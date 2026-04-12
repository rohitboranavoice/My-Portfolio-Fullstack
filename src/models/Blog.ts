import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  excerpt: string;
  content: string; // HTML or markdown
  author: string;
  date: string;
  image: string;
  category: string;
  readTime: string;
  order: number;
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: "Rohit Borana" },
    date: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    readTime: { type: String, default: "5 min read" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);
