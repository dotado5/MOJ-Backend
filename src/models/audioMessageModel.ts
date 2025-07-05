import mongoose, { Schema, Document } from "mongoose";

export interface IAudioMessage extends Document {
  title: string;
  description: string;
  speaker: string;
  category: string;
  duration?: string;
  audioUrl: string;
  thumbnailUrl?: string;
  dateUploaded: Date;
  fileSize?: number;
  playCount?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Methods
  incrementPlayCount(): Promise<IAudioMessage>;
}

const AudioMessageSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    speaker: {
      type: String,
      required: [true, "Speaker is required"],
      trim: true,
      maxlength: [100, "Speaker name cannot exceed 100 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      // Removed enum constraint to allow dynamic categories from database
    },
    duration: {
      type: String,
      trim: true,
      validate: {
        validator: function (v: string) {
          // Validate format: MM:SS or H:MM:SS
          return !v || /^(\d{1,2}:)?[0-5]?\d:[0-5]\d$/.test(v);
        },
        message: "Duration must be in format MM:SS or H:MM:SS",
      },
    },
    audioUrl: {
      type: String,
      required: [true, "Audio URL is required"],
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      trim: true,
    },
    dateUploaded: {
      type: Date,
      default: Date.now,
    },
    fileSize: {
      type: Number,
      min: [0, "File size must be positive"],
    },
    playCount: {
      type: Number,
      default: 0,
      min: [0, "Play count must be positive"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        // Map dateUploaded to date for frontend compatibility
        ret.date = ret.dateUploaded;
        // Also map thumbnailUrl to thumbnail for consistency  
        ret.thumbnail = ret.thumbnailUrl;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        // Map dateUploaded to date for frontend compatibility
        ret.date = ret.dateUploaded;
        // Also map thumbnailUrl to thumbnail for consistency
        ret.thumbnail = ret.thumbnailUrl;
        return ret;
      },
    },
  }
);

// Indexes for better query performance
AudioMessageSchema.index({ category: 1, isActive: 1 });
AudioMessageSchema.index({ speaker: 1, isActive: 1 });
AudioMessageSchema.index({ dateUploaded: -1 });
AudioMessageSchema.index({ playCount: -1 });

// Virtual for formatted date
AudioMessageSchema.virtual("formattedDate").get(function (this: IAudioMessage) {
  return this.dateUploaded.toLocaleDateString();
});

// Virtual for formatted file size
AudioMessageSchema.virtual("formattedFileSize").get(function (this: IAudioMessage) {
  if (!this.fileSize) return "Unknown";
  
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(this.fileSize) / Math.log(1024));
  return Math.round((this.fileSize / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
});

// Method to increment play count
AudioMessageSchema.methods.incrementPlayCount = function (this: IAudioMessage) {
  this.playCount = (this.playCount || 0) + 1;
  return this.save();
};

// Static method to get by category
AudioMessageSchema.statics.getByCategory = function (category: string) {
  return this.find({ category, isActive: true }).sort({ dateUploaded: -1 });
};

// Static method to get popular messages
AudioMessageSchema.statics.getPopular = function (limit: number = 10) {
  return this.find({ isActive: true })
    .sort({ playCount: -1, dateUploaded: -1 })
    .limit(limit);
};

// Static method to get latest messages
AudioMessageSchema.statics.getLatest = function (limit: number = 10) {
  return this.find({ isActive: true })
    .sort({ dateUploaded: -1 })
    .limit(limit);
};

export default mongoose.model<IAudioMessage>("AudioMessage", AudioMessageSchema); 