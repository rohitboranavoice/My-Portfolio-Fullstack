import mongoose, { Schema, Document } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  role: string;
  rating: number;
  text: string;
  signature: string;
  order: number;
}

const TestimonialSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: "" },
    rating: { type: Number, default: 5 },
    text: { type: String, required: true },
    signature: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
