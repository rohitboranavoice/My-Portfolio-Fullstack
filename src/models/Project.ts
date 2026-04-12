import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  category: string;
  image: string;
  aspectRatio: string;
  featured: boolean;
  subCategory: string; // New field
  order: number;
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    aspectRatio: { type: String, default: "aspect-square" },
    featured: { type: Boolean, default: false },
    subCategory: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
