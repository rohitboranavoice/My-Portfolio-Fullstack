"use client";

import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import PortfolioSection from "@/components/PortfolioSection";
import VideoGallery from "@/components/VideoGallery";
import TestimonialSlider from "@/components/TestimonialSlider";
import ContactSection from "@/components/ContactSection";

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