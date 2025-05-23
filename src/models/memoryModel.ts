import mongoose, { Document, Schema } from "mongoose";

export interface IMemory extends Document {
  imageUrl: string;
  height: number;
  width: number;
  imgType: string;
  activityId: string;
}

const entityDSchema: Schema = new Schema({
  imageUrl: { type: String, required: true },
  height: { type: Number, required: true },
  width: { type: Number, required: true },
  imgType: { type: String, required: true },
  activityId: { type: String, required: true },
});

export const Memory = mongoose.model<IMemory>(
  "Memories",
  entityDSchema,
  "Memories"
);
