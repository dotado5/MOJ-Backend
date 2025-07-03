import mongoose, { Document, Schema } from "mongoose";

export interface ICoordinator extends Document {
  name: string;
  occupation: string;
  phone_number: string;
  image_url: string;
  about: string;
  isFeatured: boolean;
}

const entityDSchema: Schema = new Schema({
  name: { type: String, required: true },
  occupation: { type: String, required: true },
  phone_number: { type: String, required: true },
  image_url: { type: String, required: true },
  about: { type: String, required: true },
  isFeatured: { type: Boolean, default: false },
});

export const Coordinator = mongoose.model<ICoordinator>(
  "Coordinator",
  entityDSchema,
  "Coordinators"
);
