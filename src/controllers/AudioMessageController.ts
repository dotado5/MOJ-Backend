import { Request, Response } from "express";
import AudioMessage, { IAudioMessage } from "../models/audioMessageModel";
import Category from "../models/categoryModel";
import S3Service from "../services/s3Service";
import { validationResult } from "express-validator";

class AudioMessageController {
  /**
   * Get all audio messages with pagination, filtering, and search
   */
  async getAllAudioMessages(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      
      const category = req.query.category as string;
      const speaker = req.query.speaker as string;
      const search = req.query.search as string;
      
      // Build query
      let query: any = { isActive: true };
      
      if (category && category !== "all") {
        query.category = category;
      }
      
      if (speaker && speaker !== "all") {
        query.speaker = { $regex: speaker, $options: "i" };
      }
      
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { speaker: { $regex: search, $options: "i" } },
        ];
      }
      
      const [audioMessages, total] = await Promise.all([
        AudioMessage.find(query)
          .sort({ dateUploaded: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        AudioMessage.countDocuments(query),
      ]);
      
      // Manually map fields for frontend compatibility
      const mappedMessages = audioMessages.map(message => ({
        ...message,
        date: message.dateUploaded,
        thumbnail: message.thumbnailUrl,
      }));
      
      const totalPages = Math.ceil(total / limit);
      
      res.status(200).json({
        status: "Success",
        message: "Audio messages retrieved successfully",
        data: mappedMessages,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      });
    } catch (error) {
      console.error("Error getting audio messages:", error);
      res.status(500).json({
        status: "Error",
        message: "Failed to retrieve audio messages",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Get a single audio message by ID
   */
  async getAudioMessageById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const audioMessage = await AudioMessage.findById(id).lean();
      
      if (!audioMessage) {
        res.status(404).json({
          status: "Error",
          message: "Audio message not found",
        });
        return;
      }

      // Manually map fields for frontend compatibility
      const mappedMessage = {
        ...audioMessage,
        date: audioMessage.dateUploaded,
        thumbnail: audioMessage.thumbnailUrl,
      };
      
      res.status(200).json({
        status: "Success",
        message: "Audio message retrieved successfully",
        data: mappedMessage,
      });
    } catch (error) {
      console.error("Error getting audio message:", error);
      res.status(500).json({
        status: "Error",
        message: "Failed to retrieve audio message",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Create a new audio message
   */
  async createAudioMessage(req: Request, res: Response): Promise<void> {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          status: "Error",
          message: "Validation failed",
          errors: errors.array(),
        });
        return;
      }

      const { title, description, speaker, category, duration, date } = req.body;
      
      // Check if files were uploaded
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const audioFile = files?.audio?.[0];
      const thumbnailFile = files?.thumbnail?.[0];
      
      if (!audioFile) {
        res.status(400).json({
          status: "Error",
          message: "Audio file is required",
        });
        return;
      }

      // Debug: Log the MIME type and file info
      console.log("Audio file info:", {
        originalname: audioFile.originalname,
        mimetype: audioFile.mimetype,
        size: audioFile.size,
        fieldname: audioFile.fieldname
      });

      // Validate audio file
      if (!S3Service.isValidAudioType(audioFile.mimetype)) {
        console.log("Audio validation failed for MIME type:", audioFile.mimetype);
        res.status(400).json({
          status: "Error",
          message: `Invalid audio file type. Received: ${audioFile.mimetype}. Supported types include: audio/mpeg, audio/wav, audio/m4a, audio/mp4, audio/aac, etc.`,
        });
        return;
      }

      if (!S3Service.isValidAudioSize(audioFile.size)) {
        res.status(400).json({
          status: "Error",
          message: "Audio file size too large (max 100MB)",
        });
        return;
      }

      // Upload audio file to S3
      const audioUrl = await S3Service.uploadFile(
        audioFile.buffer,
        audioFile.originalname,
        "audio"
      );

      // Upload thumbnail if provided
      let thumbnailUrl: string | undefined;
      if (thumbnailFile) {
        if (!S3Service.isValidImageType(thumbnailFile.mimetype)) {
          res.status(400).json({
            status: "Error",
            message: "Invalid thumbnail file type",
          });
          return;
        }

        if (!S3Service.isValidImageSize(thumbnailFile.size)) {
          res.status(400).json({
            status: "Error",
            message: "Thumbnail file size too large (max 5MB)",
          });
          return;
        }

        thumbnailUrl = await S3Service.uploadFile(
          thumbnailFile.buffer,
          thumbnailFile.originalname,
          "audio-thumbnails"
        );
      }

      // Create audio message
      const audioMessage = new AudioMessage({
        title,
        description,
        speaker,
        category,
        duration,
        audioUrl,
        thumbnailUrl,
        fileSize: audioFile.size,
        dateUploaded: date ? new Date(date) : new Date(),
      });

      await audioMessage.save();

      res.status(201).json({
        status: "Success",
        message: "Audio message created successfully",
        data: audioMessage,
      });
    } catch (error) {
      console.error("Error creating audio message:", error);
      res.status(500).json({
        status: "Error",
        message: "Failed to create audio message",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Update an audio message
   */
  async updateAudioMessage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, description, speaker, category, duration, date } = req.body;
      
      const audioMessage = await AudioMessage.findById(id);
      
      if (!audioMessage) {
        res.status(404).json({
          status: "Error",
          message: "Audio message not found",
        });
        return;
      }

      // Check if new files were uploaded
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const audioFile = files?.audio?.[0];
      const thumbnailFile = files?.thumbnail?.[0];
      
      let audioUrl = audioMessage.audioUrl;
      let thumbnailUrl = audioMessage.thumbnailUrl;
      let fileSize = audioMessage.fileSize;

      // Update audio file if provided
      if (audioFile) {
        if (!S3Service.isValidAudioType(audioFile.mimetype)) {
          res.status(400).json({
            status: "Error",
            message: "Invalid audio file type",
          });
          return;
        }

        if (!S3Service.isValidAudioSize(audioFile.size)) {
          res.status(400).json({
            status: "Error",
            message: "Audio file size too large (max 100MB)",
          });
          return;
        }

        // Delete old audio file
        try {
          await S3Service.deleteImage(audioMessage.audioUrl);
        } catch (deleteError) {
          console.warn("Could not delete old audio file:", deleteError);
        }

        // Upload new audio file
        audioUrl = await S3Service.uploadFile(
          audioFile.buffer,
          audioFile.originalname,
          "audio"
        );
        fileSize = audioFile.size;
      }

      // Update thumbnail if provided
      if (thumbnailFile) {
        if (!S3Service.isValidImageType(thumbnailFile.mimetype)) {
          res.status(400).json({
            status: "Error",
            message: "Invalid thumbnail file type",
          });
          return;
        }

        if (!S3Service.isValidImageSize(thumbnailFile.size)) {
          res.status(400).json({
            status: "Error",
            message: "Thumbnail file size too large (max 5MB)",
          });
          return;
        }

        // Delete old thumbnail if exists
        if (audioMessage.thumbnailUrl) {
          try {
            await S3Service.deleteImage(audioMessage.thumbnailUrl);
          } catch (deleteError) {
            console.warn("Could not delete old thumbnail:", deleteError);
          }
        }

        // Upload new thumbnail
        thumbnailUrl = await S3Service.uploadFile(
          thumbnailFile.buffer,
          thumbnailFile.originalname,
          "audio-thumbnails"
        );
      }

      // Update audio message
      const updateData: any = {
        title,
        description,
        speaker,
        category,
        duration,
        audioUrl,
        thumbnailUrl,
        fileSize,
      };

      // Update date if provided
      if (date) {
        updateData.dateUploaded = new Date(date);
      }

      const updatedAudioMessage = await AudioMessage.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: "Success",
        message: "Audio message updated successfully",
        data: updatedAudioMessage,
      });
    } catch (error) {
      console.error("Error updating audio message:", error);
      res.status(500).json({
        status: "Error",
        message: "Failed to update audio message",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Delete an audio message
   */
  async deleteAudioMessage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const audioMessage = await AudioMessage.findById(id);
      
      if (!audioMessage) {
        res.status(404).json({
          status: "Error",
          message: "Audio message not found",
        });
        return;
      }

      // Delete files from S3
      try {
        await S3Service.deleteImage(audioMessage.audioUrl);
        if (audioMessage.thumbnailUrl) {
          await S3Service.deleteImage(audioMessage.thumbnailUrl);
        }
      } catch (deleteError) {
        console.warn("Could not delete files from S3:", deleteError);
      }

      // Delete from database
      await AudioMessage.findByIdAndDelete(id);

      res.status(200).json({
        status: "Success",
        message: "Audio message deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting audio message:", error);
      res.status(500).json({
        status: "Error",
        message: "Failed to delete audio message",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Get audio messages by category
   */
  async getAudioMessagesByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const audioMessages = await AudioMessage.find({
        category,
        isActive: true,
      })
        .sort({ dateUploaded: -1 })
        .limit(limit)
        .lean();

      // Manually map fields for frontend compatibility
      const mappedMessages = audioMessages.map(message => ({
        ...message,
        date: message.dateUploaded,
        thumbnail: message.thumbnailUrl,
      }));

      res.status(200).json({
        status: "Success",
        message: `Audio messages in ${category} category retrieved successfully`,
        data: mappedMessages,
      });
    } catch (error) {
      console.error("Error getting audio messages by category:", error);
      res.status(500).json({
        status: "Error",
        message: "Failed to retrieve audio messages by category",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Get latest audio messages
   */
  async getLatestAudioMessages(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      
      const audioMessages = await AudioMessage.find({ isActive: true })
        .sort({ dateUploaded: -1 })
        .limit(limit)
        .lean();

      // Manually map fields for frontend compatibility
      const mappedMessages = audioMessages.map(message => ({
        ...message,
        date: message.dateUploaded,
        thumbnail: message.thumbnailUrl,
      }));

      res.status(200).json({
        status: "Success",
        message: "Latest audio messages retrieved successfully",
        data: mappedMessages,
      });
    } catch (error) {
      console.error("Error getting latest audio messages:", error);
      res.status(500).json({
        status: "Error",
        message: "Failed to retrieve latest audio messages",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Get popular audio messages
   */
  async getPopularAudioMessages(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      
      const audioMessages = await AudioMessage.find({ isActive: true })
        .sort({ playCount: -1, dateUploaded: -1 })
        .limit(limit)
        .lean();

      // Manually map fields for frontend compatibility
      const mappedMessages = audioMessages.map(message => ({
        ...message,
        date: message.dateUploaded,
        thumbnail: message.thumbnailUrl,
      }));

      res.status(200).json({
        status: "Success",
        message: "Popular audio messages retrieved successfully",
        data: mappedMessages,
      });
    } catch (error) {
      console.error("Error getting popular audio messages:", error);
      res.status(500).json({
        status: "Error",
        message: "Failed to retrieve popular audio messages",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Increment play count for an audio message
   */
  async incrementPlayCount(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const audioMessage = await AudioMessage.findById(id);
      
      if (!audioMessage) {
        res.status(404).json({
          status: "Error",
          message: "Audio message not found",
        });
        return;
      }

      await audioMessage.incrementPlayCount();

      res.status(200).json({
        status: "Success",
        message: "Play count incremented successfully",
        data: { playCount: audioMessage.playCount },
      });
    } catch (error) {
      console.error("Error incrementing play count:", error);
      res.status(500).json({
        status: "Error",
        message: "Failed to increment play count",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Get available audio message categories
   */
  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await Category.find({ isActive: true })
        .sort({ sortOrder: 1, name: 1 })
        .select("name")
        .lean();
      
      const categoryNames = categories.map(cat => cat.name);
      
      res.status(200).json({
        status: "Success",
        message: "Audio message categories retrieved successfully",
        data: categoryNames,
      });
    } catch (error) {
      console.error("Error getting categories:", error);
      res.status(500).json({
        status: "Error",
        message: "Failed to retrieve categories",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export default new AudioMessageController(); 