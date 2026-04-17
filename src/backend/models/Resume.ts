import mongoose, { Schema, model, models } from "mongoose";

const ResumeSchema = new Schema(
  {
    pdfUrl: {
      type: String,
      required: [true, "PDF URL is required"],
    },
    version: {
      type: String,
      default: "1.0",
    },
  },
  {
    timestamps: true,
  }
);

const Resume = models.Resume || model("Resume", ResumeSchema);

export default Resume;
