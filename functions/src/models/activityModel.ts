import mongoose, { Document, Schema } from "mongoose";

export interface IActivity extends Document {
  name: string;
  date: string;
  description: string;
}

const entityCSchema: Schema = new Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
});

export const Activity = mongoose.model<IActivity>(
  "Activity",
  entityCSchema,
  "Activities"
);
