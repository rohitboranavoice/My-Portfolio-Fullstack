import { notFound } from "next/navigation";
import { servicesData } from "@/frontend/data/servicesData";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PortfolioGrid from "@/frontend/components/PortfolioGrid";

interface SubcategoryPageProps {
  params: {
    category: string;
    subcategory: string;
  };
}

// Generate static params for all subcategories
export function generateStaticParams() {
  const params: { category: string; subcategory: string }[] = [];
  
  servicesData.forEach((category) => {
    category.subcategories.forEach((sub) => {
      params.push({
        category: category.id,
        subcategory: sub.id,
      });
    });
  });
  
  return params;
}

export default function SubcategoryPage({ params }: SubcategoryPageProps) {
  const categoryData = servicesData.find((s) => s.id === params.category);
  const subcategoryData = categoryData?.subcategories.find((s) => s.id === params.subcategory);

  if (!categoryData || !subcategoryData) {
    notFound();
  }

  // Placeholder images for the gallery until real content is provided
  // These represent a generic portfolio layout using random visually distinct placeholders
  const placeholderGalleryImages = [
    "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=2070&auto=format&fit=crop"
  ];
  
  // Create mock items for the PortfolioGrid
  const mockItems = placeholderGalleryImages.map((src, idx) => ({
    type: idx % 2 === 0 ? "video" as const : "photo" as const,
    src,
    title: `${subcategoryData.title} Sample ${idx + 1}`,
    category: subcategoryData.title
  }));

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Back Button and Header */}
        <div className="mb-12">
          <Link href={`/service/${params.category}`} className="inline-flex items-center text-gray-500 hover:text-[#FD853A] font-medium transition-colors mb-8">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to {categoryData.title}
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="w-16 h-1 bg-[#FD853A] mb-6 rounded-full" />
              <h1 className="text-4xl md:text-5xl font-bold text-[#1D2939] mb-4">
                {subcategoryData.title} Gallery
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Explore our recent work in {subcategoryData.title.toLowerCase()}.
              </p>
            </div>
            <div className="hidden md:flex h-20 w-20 rounded-[2rem] bg-[#FAFAFA] items-center justify-center border border-gray-100 shadow-sm">
              <categoryData.icon className="w-10 h-10 text-[#FD853A]" />
            </div>
          </div>
        </div>

        {/* Masonry Gallery using PortfolioGrid logic */}
        {/* For now, just render out the images in a clean masonry setup */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {placeholderGalleryImages.map((src, index) => (
            <div key={index} className="break-inside-avoid overflow-hidden rounded-3xl relative group">
              <img 
                src={src} 
                alt={`${subcategoryData.title} sample ${index + 1}`}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white font-medium">{subcategoryData.title} #{index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
