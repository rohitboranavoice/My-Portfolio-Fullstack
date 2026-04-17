import PortfolioGallery from "@/frontend/components/PortfolioGallery";

interface PageProps {
  params: {
    subcategory: string;
  };
}

export default function SubCategoryPage({ params }: PageProps) {
  // Title case the slug for display
  const title = params.subcategory.replace(/-/g, ' ');
  
  return (
    <PortfolioGallery 
      title={title} 
      subCategory={params.subcategory} 
      type="tag" 
    />
  );
}
