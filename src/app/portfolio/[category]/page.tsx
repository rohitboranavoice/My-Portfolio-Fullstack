import PortfolioGallery from "@/components/PortfolioGallery";

interface PageProps {
  params: {
    category: string;
  };
}

export default function CategoryPage({ params }: PageProps) {
  // Title case the slug for display
  const title = params.category.replace(/-/g, ' ');
  
  return (
    <PortfolioGallery 
      title={title} 
      category={params.category} 
      type="category" 
    />
  );
}
