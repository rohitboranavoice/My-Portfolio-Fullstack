"use client";

import HeroSection from "@/frontend/components/HeroSection";
import ServicesSection from "@/frontend/components/ServicesSection";
import PortfolioSection from "@/frontend/components/PortfolioSection";
import VideoGallery from "@/frontend/components/VideoGallery";
import TestimonialSlider from "@/frontend/components/TestimonialSlider";
import ContactSection from "@/frontend/components/ContactSection";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start pb-0">
      <HeroSection />
      
      <div className="w-full">
        <ServicesSection />
      </div>

      <div className="w-full">
        <PortfolioSection />
      </div>

      <div className="w-full">
        <VideoGallery />
      </div>

      <div className="w-full">
        <TestimonialSlider />
      </div>

      <div className="w-full">
        <ContactSection />
      </div>

      {/* Footer handles testimonials globally */}
    </div>
  );
}
