import mongoose, { Schema, Document } from "mongoose";

export interface IPortfolioCategory extends Document {
  title: string;
  slug: string;
  subCategories: string[]; // New field
  order: number;
}

const PortfolioCategorySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    subCategories: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.PortfolioCategory || mongoose.model<IPortfolioCategory>("PortfolioCategory", PortfolioCategorySchema);
