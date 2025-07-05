import { Request, Response } from "express";
import { Coordinator } from "../models/coordinatorModel";
import s3Service from "../services/s3Service";

const createCoordinator = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const newCoordinator = await Coordinator.create(body);
    console.log(newCoordinator);

    res.status(201).send({
      status: "Success",
      message: "Coordinator created successfully",
      data: newCoordinator,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

const createCoordinatorWithImage = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const file = req.file;

    let imageUrl = "";

    // Upload image to S3 if file is provided
    if (file) {
      try {
        imageUrl = await s3Service.uploadImage(
          file.buffer,
          file.originalname,
          "coordinators"
        );
      } catch (uploadError) {
        console.error("S3 upload error:", uploadError);
        return res.status(500).send({
          status: "Error",
          message: "Failed to upload image to S3",
        });
      }
    }

    // Create coordinator with image URL
    const coordinatorData = {
      ...body,
      image_url: imageUrl,
    };

    const newCoordinator = await Coordinator.create(coordinatorData);

    res.status(201).send({
      status: "Success",
      message: "Coordinator created successfully with image",
      data: newCoordinator,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

const uploadCoordinatorImage = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).send({
        status: "Error",
        message: "No image file provided",
      });
    }

    // Upload image to S3
    const imageUrl = await s3Service.uploadImage(
      file.buffer,
      file.originalname,
      "coordinators"
    );

    res.status(200).send({
      status: "Success",
      message: "Image uploaded successfully",
      data: {
        imageUrl: imageUrl,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Error",
      message: "Failed to upload image",
    });
  }
};

const getAllCoordinators = async (req: Request, res: Response) => {
  try {
    const coordinators = await Coordinator.find({});

    res.status(200).send({
      status: "Success",
      message: "All coordinators loaded successfully",
      data: coordinators,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const getFeaturedCoordinator = async (req: Request, res: Response) => {
  try {
    const featuredCoordinator = await Coordinator.findOne({ isFeatured: true });

    if (!featuredCoordinator) {
      return res.status(404).send({
        status: "Error",
        message: "No featured coordinator found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Featured coordinator loaded successfully",
      data: featuredCoordinator,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const getCoordinatorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const coordinator = await Coordinator.findById(id);

    if (!coordinator) {
      return res.status(404).send({
        status: "Error",
        message: "Coordinator not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Coordinator loaded successfully",
      data: coordinator,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const updateCoordinator = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const updatedCoordinator = await Coordinator.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCoordinator) {
      return res.status(404).send({
        status: "Error",
        message: "Coordinator not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Coordinator updated successfully",
      data: updatedCoordinator,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const updateCoordinatorWithImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const file = req.file;

    // Find existing coordinator
    const existingCoordinator = await Coordinator.findById(id);
    if (!existingCoordinator) {
      return res.status(404).send({
        status: "Error",
        message: "Coordinator not found",
      });
    }

    let updateData = { ...body };

    // Handle image upload if new file is provided
    if (file) {
      try {
        // Delete old image if it exists
        if (existingCoordinator.image_url) {
          try {
            await s3Service.deleteImage(existingCoordinator.image_url);
          } catch (deleteError) {
            console.warn("Failed to delete old image:", deleteError);
            // Continue with update even if delete fails
          }
        }

        // Upload new image
        const newImageUrl = await s3Service.uploadImage(
          file.buffer,
          file.originalname,
          "coordinators"
        );

        updateData.image_url = newImageUrl;
      } catch (uploadError) {
        console.error("S3 upload error:", uploadError);
        return res.status(500).send({
          status: "Error",
          message: "Failed to upload new image to S3",
        });
      }
    }

    const updatedCoordinator = await Coordinator.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).send({
      status: "Success",
      message: "Coordinator updated successfully",
      data: updatedCoordinator,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const setFeaturedCoordinator = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // First, remove featured status from all coordinators
    await Coordinator.updateMany({}, { isFeatured: false });

    // Then set the specified coordinator as featured
    const updatedCoordinator = await Coordinator.findByIdAndUpdate(
      id,
      { isFeatured: true },
      { new: true, runValidators: true }
    );

    if (!updatedCoordinator) {
      return res.status(404).send({
        status: "Error",
        message: "Coordinator not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Coordinator set as featured successfully",
      data: updatedCoordinator,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const deleteCoordinator = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const coordinator = await Coordinator.findById(id);
    if (!coordinator) {
      return res.status(404).send({
        status: "Error",
        message: "Coordinator not found",
      });
    }

    // Delete image from S3 if it exists
    if (coordinator.image_url) {
      try {
        await s3Service.deleteImage(coordinator.image_url);
      } catch (deleteError) {
        console.warn("Failed to delete image from S3:", deleteError);
        // Continue with coordinator deletion even if image delete fails
      }
    }

    const deletedCoordinator = await Coordinator.findByIdAndDelete(id);

    res.status(200).send({
      status: "Success",
      message: "Coordinator deleted successfully",
      data: deletedCoordinator,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

export { 
  createCoordinator, 
  createCoordinatorWithImage,
  uploadCoordinatorImage,
  getAllCoordinators, 
  getFeaturedCoordinator,
  getCoordinatorById, 
  updateCoordinator, 
  updateCoordinatorWithImage,
  setFeaturedCoordinator,
  deleteCoordinator 
};
