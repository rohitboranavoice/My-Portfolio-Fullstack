import mongoose, { Schema, Document } from "mongoose";

export interface ISubcategory {
  id: string;
  title: string;
}

export interface IService extends Document {
  serviceId: string; // e.g. "event-photography"
  title: string;
  description: string;
  icon: string; // store the name of the icon, e.g. "CalendarRange"
  image: string;
  subcategories: ISubcategory[];
  order: number;
}

const ServiceSchema: Schema = new Schema(
  {
    serviceId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: "Camera" },
    image: { type: String, required: true },
    subcategories: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
      },
    ],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);
