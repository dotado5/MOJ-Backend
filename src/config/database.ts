// src/config/database.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

export const connectDB = async () => {
  if (!MONGO_URL) {
    return null;
  }

  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1); // Exit the app if MongoDB connection fails
  }
};

// Usage
