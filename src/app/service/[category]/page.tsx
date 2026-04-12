import { notFound } from "next/navigation";
import { servicesData } from "@/data/servicesData";
import CategoryView from "@/components/CategoryView";
import dbConnect from "@/lib/mongodb";
import Service from "@/models/Service";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  let dbService = null;
  let foundId = null;

  try {
    if (process.env.MONGODB_URI) {
      await dbConnect();
      dbService = await Service.findOne({ serviceId: params.category }).lean();
      foundId = dbService?.serviceId;
    }
  } catch (error) {
    console.warn("MongoDB connection skipped during build or failed");
  }

  // Fallback to static data
  if (!foundId) {
    const staticService = servicesData.find((s) => s.id === params.category);
    if (staticService) {
      foundId = staticService.id;
    }
  }

  if (!foundId) {
    notFound();
  }
  const rawCategory = dbService || servicesData.find((s) => s.id === params.category);
  
  // Sanitize for serialization (remove functions/icons)
  const categoryToPass = rawCategory ? {
    id: rawCategory.id,
    title: rawCategory.title,
    description: rawCategory.description,
    image: rawCategory.image,
    subcategories: rawCategory.subcategories
  } : null;

  return <CategoryView categoryId={foundId} categoryData={categoryToPass} />;
}
