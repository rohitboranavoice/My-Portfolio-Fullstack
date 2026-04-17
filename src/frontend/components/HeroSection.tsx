"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavbar } from "@/frontend/context/NavbarContext";
import { useData } from "@/frontend/context/DataContext";

export default function HeroSection() {
  const { settings, loading } = useData();
  const { isBrandingRevealed } = useNavbar();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Read from settings or gracefully fallback
  const heroHeading = settings?.heroHeading || "I'M ROHIT BORANA";
  const heroSubheading = settings?.heroSubheading || "PHOTOGRAPHER | VIDEOGRAPHER | VISUAL STORYTELLER";
  const heroVideo = settings?.heroVideoUrl || "https://assets.mixkit.co/videos/preview/mixkit-cinematographer-filming-a-scene-in-nature-34538-large.mp4";

  return (
    <div className="relative w-full flex flex-col items-center overflow-hidden isolate mt-24 sm:mt-32">
      
      {/* Branding Section - Between Navbar and Video Strip, white background, NO overlap */}
      <div className={`w-full flex flex-col items-center z-20 transition-all duration-700 ease-out overflow-hidden ${isBrandingRevealed ? 'max-h-[350px] opacity-100 pt-4 pb-2 sm:pt-6 sm:pb-3' : 'max-h-0 opacity-0 pt-0 pb-0 pointer-events-none'}`}>
        <div className="px-8 py-2 border border-neutral-200 rounded-full bg-white text-[#171717] font-medium text-sm shadow-sm mb-3 sm:mb-4">
          Hello!
        </div>
        <h1 className="leading-[1.1] font-semibold text-[42px] sm:text-[42px] md:text-[42px] xl:text-[42px] text-center tracking-tight flex items-baseline gap-1">
          <span className="text-neutral-900 font-bold">I&apos;m</span>
          <span className="uppercase text-[#FD853A] tracking-tight font-bold">{heroHeading.match(/i['m\s]+(.*)/i)?.[1] || "ROHIT BORANA"}</span>
        </h1>
        <div className="text-gray-400 font-semibold text-[9px] sm:text-[11px] md:text-xs xl:text-sm text-center tracking-[0.35em] mt-2 sm:mt-3 whitespace-nowrap uppercase">
          {heroSubheading}
        </div>
      </div>

      {/* Video Strip Section */}
      <div className="relative w-full flex flex-col items-center pb-20 sm:pb-24">
        
        {/* Video Strip Background */}
        <div className="relative w-[98%] mx-auto h-[340px] sm:h-[400px] lg:h-[430px] xl:h-[480px] rounded-[40px] overflow-hidden z-10 shadow-2xl">
          <div className="absolute inset-0 bg-black/40 z-10" /> 
          <video 
            key={heroVideo}
            src={heroVideo}
            autoPlay muted loop playsInline
            onLoadedData={() => setIsVideoLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          {!isVideoLoaded && <div className="absolute inset-0 bg-neutral-800" />}

          {/* Dot Decorations inside Strip */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute left-[1%] top-[30%] w-16 md:w-32 h-64 opacity-15 bg-[radial-gradient(#FD853A_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
            <div className="absolute right-[1%] top-[30%] w-16 md:w-32 h-64 opacity-15 bg-[radial-gradient(#FD853A_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
          </div>

          {/* Hire Me - Pinned to the bottom center of the video strip */}
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex justify-center z-30">
            <Link 
              href="/hire-me"
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-[#FD853A] text-white font-bold text-lg sm:text-xl shadow-[0_8px_20px_rgba(253,133,58,0.4)] hover:shadow-[0_12px_25px_rgba(253,133,58,0.6)] hover:-translate-y-1 transition-all duration-300 border border-white/20 whitespace-nowrap"
            >
              Hire me
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7M7 7h10v10" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
