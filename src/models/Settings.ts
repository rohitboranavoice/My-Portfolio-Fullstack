import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  siteTitle: string;
  heroHeading: string;
  heroSubheading: string;
  heroImage: string;
  aboutText: string;
  aboutImage: string;
  clientsCount: string;
  eventsCount: string;
  awardsCount: string;
  contactEmail: string;
  contactPhone: string;
  contactLocation: string;
  instagram: string;
  youtube: string;
  facebook: string;
  whatsapp: string;
  heroVideoUrl: string;
}

const SettingsSchema: Schema = new Schema(
  {
    siteTitle: { type: String, default: "Rohit Borana" },
    heroHeading: { type: String, default: "I'M ROHIT BORANA" },
    heroSubheading: { type: String, default: "PREMIUM PHOTOGRAPHER & VIDEOGRAPHER" },
    heroImage: { type: String, default: "https://my-project-gamma-sable.vercel.app/girl.svg" },
    aboutText: { type: String, default: "I am Rohit Borana, a professional photographer and videographer based in India." },
    aboutImage: { type: String, default: "https://my-project-gamma-sable.vercel.app/girl.svg" },
    clientsCount: { type: String, default: "450+" },
    eventsCount: { type: String, default: "1k+" },
    awardsCount: { type: String, default: "12+" },
    contactEmail: { type: String, default: "rohit@rohitborana.com" },
    contactPhone: { type: String, default: "+91 98765 43210" },
    contactLocation: { type: String, default: "Jodhpur, Rajasthan, India" },
    instagram: { type: String, default: "" },
    youtube: { type: String, default: "" },
    facebook: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    heroVideoUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);
