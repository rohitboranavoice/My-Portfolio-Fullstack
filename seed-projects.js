const mongoose = require('mongoose');

// MongoDB Connection URI - Ensure this matches your .env.local MONGODB_URI
const MONGODB_URI = "mongodb://localhost:27017/portfolio";

const ProjectSchema = new mongoose.Schema({
  title: String,
  category: String,
  subCategory: String,
  image: String,
  description: String,
  tags: [String],
  order: Number,
}, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected!");

    // Clear existing projects to avoid duplicates during test
    await Project.deleteMany({});
    console.log("Cleared existing projects.");

    const sampleProjects = [
      {
        title: "Ethereal Landscapes",
        category: "Photography",
        subCategory: "Nature",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200",
        order: 0
      },
      {
        title: "Urban Cinematic",
        category: "Photography",
        subCategory: "Street",
        image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1200",
        order: 1
      },
      {
        title: "Eternal Union",
        category: "Wedding",
        subCategory: "Cinematic",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200",
        order: 2
      },
      {
        title: "Golden Hour Portrait",
        category: "Photography",
        subCategory: "Outdoor",
        image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=1200",
        order: 3
      },
      {
        title: "Corporate Vision",
        category: "Videography",
        subCategory: "Commercial",
        image: "https://images.unsplash.com/photo-1492691523567-f73b057bb797?q=80&w=1200",
        order: 4
      },
      {
        title: "Desert Soul",
        category: "Wedding",
        subCategory: "Outdoor",
        image: "https://images.unsplash.com/photo-1522673607200-1648832cee98?q=80&w=1200",
        order: 5
      }
    ];

    await Project.insertMany(sampleProjects);
    console.log("Successfully seeded 6 projects with sub-categories!");
    
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
