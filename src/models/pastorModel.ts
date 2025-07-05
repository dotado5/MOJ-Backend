import { Schema, model, Document } from "mongoose";

export interface IPastor extends Document {
  name: string;
  title: string;
  welcomeMessage: string;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const pastorSchema = new Schema<IPastor>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  welcomeMessage: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export const Pastor = model<IPastor>("Pastor", pastorSchema); 