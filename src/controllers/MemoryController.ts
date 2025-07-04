import { Request, Response } from "express";
import { Memory } from "../models/memoryModel";
import { Activity } from "../models/activityModel";
import s3Service from "../services/s3Service";
import sharp from "sharp";

const uploadMemory = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const newMemory = await Memory.create(body);

    res.status(200).send({
      status: "Success",
      message: "Memory created successfully",
      data: newMemory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ 
      status: "Error", 
      message: "Something went wrong" 
    });
  }
};

const uploadMemoryWithImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).send({
        status: "Error",
        message: "No image file provided",
      });
    }

    const { activityId } = req.body;

    if (!activityId) {
      return res.status(400).send({
        status: "Error",
        message: "Activity ID is required",
      });
    }

    // Verify activity exists
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).send({
        status: "Error",
        message: "Activity not found",
      });
    }

    // Validate file type and size
    if (!s3Service.isValidImageType(req.file.mimetype)) {
      return res.status(400).send({
        status: "Error",
        message: "Invalid file type. Only JPG, PNG, GIF, WebP, and SVG are allowed.",
      });
    }

    if (!s3Service.isValidFileSize(req.file.size)) {
      return res.status(400).send({
        status: "Error",
        message: "File size too large. Maximum size is 5MB.",
      });
    }

    // Get image dimensions using sharp
    let width = 800;
    let height = 600;
    let imgType = req.file.mimetype.split('/')[1];

    try {
      if (req.file.mimetype !== 'image/svg+xml') {
        const metadata = await sharp(req.file.buffer).metadata();
        width = metadata.width || 800;
        height = metadata.height || 600;
      }
    } catch (sharpError) {
      console.warn("Could not get image dimensions, using defaults:", sharpError);
    }

    // Upload to S3
    const imageUrl = await s3Service.uploadImage(
      req.file.buffer,
      req.file.originalname,
      "memories"
    );

    // Create memory record
    const newMemory = await Memory.create({
      imageUrl,
      height,
      width,
      imgType,
      activityId,
    });

    res.status(201).send({
      status: "Success",
      message: "Memory uploaded successfully",
      data: newMemory,
    });
  } catch (error) {
    console.error("Error uploading memory:", error);
    res.status(500).send({
      status: "Error",
      message: "Failed to upload memory",
    });
  }
};

const uploadImageOnly = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).send({
        status: "Error",
        message: "No image file provided",
      });
    }

    // Validate file
    if (!s3Service.isValidImageType(req.file.mimetype)) {
      return res.status(400).send({
        status: "Error",
        message: "Invalid file type. Only JPG, PNG, GIF, WebP, and SVG are allowed.",
      });
    }

    if (!s3Service.isValidFileSize(req.file.size)) {
      return res.status(400).send({
        status: "Error",
        message: "File size too large. Maximum size is 5MB.",
      });
    }

    // Upload to S3
    const imageUrl = await s3Service.uploadImage(
      req.file.buffer,
      req.file.originalname,
      "memories"
    );

    res.status(200).send({
      status: "Success",
      message: "Image uploaded successfully",
      data: { imageUrl },
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).send({
      status: "Error",
      message: "Failed to upload image",
    });
  }
};

const getAllMemories = async (req: Request, res: Response) => {
  try {
    const { activityId, page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    let query = {};
    if (activityId) {
      query = { activityId };
    }

    const memories = await Memory.find(query)
      .sort({ _id: -1 }) // Most recent first
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await Memory.countDocuments(query);

    res.status(200).send({
      status: "Success",
      message: "Memories loaded successfully",
      data: memories,
      pagination: {
        currentPage: parseInt(page as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
        totalMemories: total,
        hasNextPage: skip + memories.length < total,
        hasPrevPage: parseInt(page as string) > 1,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ 
      status: "Error", 
      message: "Failed to fetch memories" 
    });
  }
};

const getMemoriesByActivity = async (req: Request, res: Response) => {
  try {
    const { activityId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Verify activity exists
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).send({
        status: "Error",
        message: "Activity not found",
      });
    }

    const memories = await Memory.find({ activityId })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await Memory.countDocuments({ activityId });

    res.status(200).send({
      status: "Success",
      message: "Activity memories loaded successfully",
      data: {
        activity: {
          _id: activity._id,
          name: activity.name,
          date: activity.date,
          description: activity.description,
        },
        memories,
        pagination: {
          currentPage: parseInt(page as string),
          totalPages: Math.ceil(total / parseInt(limit as string)),
          totalMemories: total,
          hasNextPage: skip + memories.length < total,
          hasPrevPage: parseInt(page as string) > 1,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ 
      status: "Error", 
      message: "Failed to fetch activity memories" 
    });
  }
};

const getGalleryByEvents = async (req: Request, res: Response) => {
  try {
    // Get all activities with their memory counts
    const activitiesWithMemories = await Activity.aggregate([
      {
        $lookup: {
          from: "memories",
          localField: "_id",
          foreignField: "activityId",
          as: "memories"
        }
      },
      {
        $addFields: {
          memoryCount: { $size: "$memories" },
          // Get first few memories as preview
          previewMemories: { $slice: ["$memories", 3] }
        }
      },
      {
        $match: {
          memoryCount: { $gt: 0 } // Only activities with memories
        }
      },
      {
        $sort: { date: -1 } // Most recent events first
      }
    ]);

    res.status(200).send({
      status: "Success",
      message: "Gallery organized by events loaded successfully",
      data: activitiesWithMemories,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ 
      status: "Error", 
      message: "Failed to fetch gallery by events" 
    });
  }
};

const getMemoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const memory = await Memory.findById(id);

    if (!memory) {
      return res.status(404).send({
        status: "Error",
        message: "Memory not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Memory loaded successfully",
      data: memory,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ 
      status: "Error", 
      message: "Failed to fetch memory" 
    });
  }
};

const updateMemory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const updatedMemory = await Memory.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedMemory) {
      return res.status(404).send({
        status: "Error",
        message: "Memory not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Memory updated successfully",
      data: updatedMemory,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ 
      status: "Error", 
      message: "Failed to update memory" 
    });
  }
};

const updateMemoryWithImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const existingMemory = await Memory.findById(id);
    if (!existingMemory) {
      return res.status(404).send({
        status: "Error",
        message: "Memory not found",
      });
    }

    let updateData = { ...req.body };

    // If new image is provided, upload it and delete old one
    if (req.file) {
      // Validate new file
      if (!s3Service.isValidImageType(req.file.mimetype)) {
        return res.status(400).send({
          status: "Error",
          message: "Invalid file type. Only JPG, PNG, GIF, WebP, and SVG are allowed.",
        });
      }

      if (!s3Service.isValidFileSize(req.file.size)) {
        return res.status(400).send({
          status: "Error",
          message: "File size too large. Maximum size is 5MB.",
        });
      }

      // Get new image dimensions
      let width = 800;
      let height = 600;
      let imgType = req.file.mimetype.split('/')[1];

      try {
        if (req.file.mimetype !== 'image/svg+xml') {
          const metadata = await sharp(req.file.buffer).metadata();
          width = metadata.width || 800;
          height = metadata.height || 600;
        }
      } catch (sharpError) {
        console.warn("Could not get image dimensions, using defaults:", sharpError);
      }

      // Upload new image
      const newImageUrl = await s3Service.uploadImage(
        req.file.buffer,
        req.file.originalname,
        "memories"
      );

      // Delete old image
      try {
        await s3Service.deleteImage(existingMemory.imageUrl);
      } catch (deleteError) {
        console.warn("Could not delete old image:", deleteError);
      }

      updateData = {
        ...updateData,
        imageUrl: newImageUrl,
        height,
        width,
        imgType,
      };
    }

    const updatedMemory = await Memory.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).send({
      status: "Success",
      message: "Memory updated successfully",
      data: updatedMemory,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ 
      status: "Error", 
      message: "Failed to update memory" 
    });
  }
};

const deleteMemory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedMemory = await Memory.findByIdAndDelete(id);

    if (!deletedMemory) {
      return res.status(404).send({
        status: "Error",
        message: "Memory not found",
      });
    }

    // Delete image from S3
    try {
      await s3Service.deleteImage(deletedMemory.imageUrl);
    } catch (s3Error) {
      console.warn("Could not delete image from S3:", s3Error);
    }

    res.status(200).send({
      status: "Success",
      message: "Memory deleted successfully",
      data: deletedMemory,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ 
      status: "Error", 
      message: "Failed to delete memory" 
    });
  }
};

export { 
  uploadMemory, 
  uploadMemoryWithImage,
  uploadImageOnly,
  getAllMemories, 
  getMemoriesByActivity,
  getGalleryByEvents,
  getMemoryById, 
  updateMemory,
  updateMemoryWithImage, 
  deleteMemory 
};
