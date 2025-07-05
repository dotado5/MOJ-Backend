import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
      validate: {
        validator: function (v: string) {
          // Only allow letters, spaces, and hyphens
          return /^[a-zA-Z\s\-]+$/.test(v);
        },
        message: "Category name can only contain letters, spaces, and hyphens",
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Indexes for better query performance
CategorySchema.index({ name: 1 });
CategorySchema.index({ isActive: 1, sortOrder: 1 });

// Static method to get active categories
CategorySchema.statics.getActive = function () {
  return this.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
};

const Category = mongoose.model<ICategory>("Category", CategorySchema);

export default Category; 