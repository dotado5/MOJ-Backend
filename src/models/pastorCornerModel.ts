import { Schema, model, Document, Types } from "mongoose";

export interface IPastorCorner extends Document {
  title: string;
  content: string;
  pastorId: Types.ObjectId;
  datePublished: Date;
  isPublished: boolean;
  excerpt?: string;
  createdAt: Date;
  updatedAt: Date;
}

const pastorCornerSchema = new Schema<IPastorCorner>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  pastorId: {
    type: Schema.Types.ObjectId,
    ref: "Pastor",
    required: true,
  },
  datePublished: {
    type: Date,
    default: Date.now,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  excerpt: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Index for efficient querying
pastorCornerSchema.index({ datePublished: -1, isPublished: 1 });
pastorCornerSchema.index({ pastorId: 1 });

export const PastorCorner = model<IPastorCorner>("PastorCorner", pastorCornerSchema); 