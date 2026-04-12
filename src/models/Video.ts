import mongoose, { Schema, Document } from "mongoose";

export interface IVideo extends Document {
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: string;
  subCategory: string; // New field
  isFeatured: boolean;
  type: "featured" | "gallery"; 
  youtubeUrl: string; 
  order: number;
}

const VideoSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    videoUrl: { type: String, required: false },
    thumbnailUrl: { type: String },
    category: { type: String, default: "General" },
    subCategory: { type: String, default: "" }, // New field
    isFeatured: { type: Boolean, default: false },
    type: { type: String, enum: ["featured", "gallery"], default: "featured" },
    youtubeUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Video || mongoose.model<IVideo>("Video", VideoSchema);
