import { Schema, model, Document, Types } from "mongoose";

export interface IMessage extends Document {
  title: string;
  content: string;
  coordinatorId: Types.ObjectId;
  datePublished: Date;
  isPublished: boolean;
  excerpt?: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  coordinatorId: {
    type: Schema.Types.ObjectId,
    ref: "Coordinator",
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
messageSchema.index({ datePublished: -1, isPublished: 1 });
messageSchema.index({ coordinatorId: 1 });

export const Message = model<IMessage>("Message", messageSchema); 