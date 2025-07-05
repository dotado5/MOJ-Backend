import multer from "multer";
import { Request } from "express";
import s3Service from "../services/s3Service";

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check if file is an image
  if (s3Service.isValidImageType(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpg, jpeg, png, gif, webp, svg)"));
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Middleware for single image upload
export const uploadSingle = (fieldName: string) => {
  return upload.single(fieldName);
};

// Middleware for multiple image uploads
export const uploadMultiple = (fieldName: string, maxCount: number) => {
  return upload.array(fieldName, maxCount);
};

// Error handling middleware for multer
export const handleUploadError = (error: any, req: Request, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        status: "Error",
        message: "File size too large. Maximum size is 5MB.",
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        status: "Error",
        message: "Too many files uploaded.",
      });
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        status: "Error",
        message: "Unexpected file field.",
      });
    }
  }
  
  if (error.message.includes("Only image files are allowed")) {
    return res.status(400).json({
      status: "Error",
      message: error.message,
    });
  }

  // Pass other errors to the next middleware
  next(error);
}; 