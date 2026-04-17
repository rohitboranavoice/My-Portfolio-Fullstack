"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavbar } from "@/frontend/context/NavbarContext";
import { useData } from "@/frontend/context/DataContext";

export default function HeroSection() {
  const { settings, loading } = useData();
  const { isBrandingRevealed } = useNavbar();
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Read from settings or gracefully fallback
  const heroHeading = settings?.heroHeading || "I'M ROHIT BORANA";
  const heroSubheading = settings?.heroSubheading || "PHOTOGRAPHER | VIDEOGRAPHER | VISUAL STORYTELLER";
  const heroVideo = settings?.heroVideoUrl || "https://assets.mixkit.co/videos/preview/mixkit-cinematographer-filming-a-scene-in-nature-34538-large.mp4";
  const heroImage = settings?.heroImage || "/assets/hero/hero-person.png";

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

      {/* Video Strip + Hero Image Section */}
      <div className="relative w-full flex flex-col items-center" style={{ minHeight: '520px' }}>
        
        {/* Video Strip Background */}
        <div className="absolute inset-x-0 top-0 w-[98%] mx-auto h-[340px] sm:h-[400px] lg:h-[430px] xl:h-[480px] rounded-[40px] overflow-hidden z-0 pointer-events-none shadow-2xl">
          <div className="absolute inset-0 bg-black/40 z-10" /> 
          <video 
            key={heroVideo}
            src={heroVideo}
            autoPlay muted loop playsInline
            onLoadedData={() => setIsVideoLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          {!isVideoLoaded && <div className="absolute inset-0 bg-neutral-800" />}
        </div>

        {/* Dot Decorations on Strip */}
        <div className="absolute inset-x-0 top-0 h-[340px] sm:h-[400px] lg:h-[430px] xl:h-[480px] pointer-events-none z-0 overflow-hidden">
          <div className="absolute left-[1%] top-[30%] w-16 md:w-32 h-64 opacity-15 bg-[radial-gradient(#FD853A_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
          <div className="absolute right-[1%] top-[30%] w-16 md:w-32 h-64 opacity-15 bg-[radial-gradient(#FD853A_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
        </div>

        {/* Hero Image & Doodles Container - Wider for doodle space */}
        <div 
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
          className="relative w-full max-w-[900px] flex flex-col items-center justify-end z-10 cursor-default"
          style={{ minHeight: '480px' }}
        >
          {/* Orange base arch - aligned to strip bottom */}
          <div className="absolute bottom-0 z-0 w-[55%] max-w-[520px] overflow-hidden flex items-center justify-center" style={{ aspectRatio: '2/1' }}>
            <div className="absolute w-full h-full bg-[#FEB273] rounded-t-full shadow-lg"></div>
          </div>

          {/* Doodles Reveal Layer - 9 unique doodles (removed duplicate video cameras) */}
          <div className="absolute inset-0 z-10 pointer-events-none overflow-visible">
            
            {/* Upper Left - DSLR Camera (was clapperboard's spot) */}
            <motion.div 
              animate={{ y: [-8, 8, -8], x: [-4, 4, -4], rotate: [-4, 4, -4] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute top-[18%] left-[18%] w-10 h-10 sm:w-14 sm:h-14 transition-all duration-700 ${isImageHovered ? 'opacity-90 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-12'}`}
            >
              <img src="/assets/hero/doodle_10.png" alt="" className="w-full h-full object-contain" />
            </motion.div>

            {/* Top Center-Left - Hard Drive (next to DSLR) */}
            <motion.div 
              animate={{ y: [-10, 6, -10], x: [-3, 5, -3], rotate: [-3, 3, -3] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              className={`absolute top-[10%] left-[28%] w-10 h-10 sm:w-12 sm:h-12 transition-all duration-700 ${isImageHovered ? 'opacity-90 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-12'}`}
            >
              <img src="/assets/hero/doodle_3.png" alt="" className="w-full h-full object-contain" />
            </motion.div>

            {/* Top Center-Right - Memory Card (next to video camera side) */}
            <motion.div 
              animate={{ y: [-6, 10, -6], x: [-5, 3, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className={`absolute top-[10%] right-[28%] w-10 h-10 sm:w-12 sm:h-12 transition-all duration-700 ${isImageHovered ? 'opacity-90 scale-100' : 'opacity-0 scale-75'}`}
            >
              <img src="/assets/hero/doodle_4.png" alt="" className="w-full h-full object-contain" />
            </motion.div>

            {/* Upper Right - Light Stand (was flash's spot) */}
            <motion.div 
              animate={{ y: [-10, 8, -10], x: [-3, 6, -3], rotate: [-6, 3, -6] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
              className={`absolute top-[15%] right-[16%] w-10 h-10 sm:w-14 sm:h-14 transition-all duration-700 ${isImageHovered ? 'opacity-90 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-6'}`}
            >
              <img src="/assets/hero/doodle_5.png" alt="" className="w-full h-full object-contain" />
            </motion.div>

            {/* Mid Left - Video Camera (was hard drive's spot) */}
            <motion.div 
              animate={{ y: [-8, 10, -8], x: [-4, 6, -4], rotate: [-3, 5, -3] }}
              transition={{ duration: 4.3, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className={`absolute top-[40%] left-[10%] w-10 h-10 sm:w-13 sm:h-13 transition-all duration-700 ${isImageHovered ? 'opacity-90 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-6'}`}
            >
              <img src="/assets/hero/doodle_6.png" alt="" className="w-full h-full object-contain" />
            </motion.div>

            {/* Mid Right - Flash (was tripod's spot) */}
            <motion.div 
              animate={{ y: [-7, 9, -7], x: [-5, 4, -5] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
              className={`absolute top-[35%] right-[8%] w-10 h-10 sm:w-14 sm:h-14 transition-all duration-700 ${isImageHovered ? 'opacity-90 scale-100' : 'opacity-0 scale-75'}`}
            >
              <img src="/assets/hero/doodle_9.png" alt="" className="w-full h-full object-contain" />
            </motion.div>

            {/* Lower Left - Clapperboard */}
            <motion.div 
              animate={{ y: [-10, 10, -10], x: [-5, 5, -5], rotate: [-5, 5, -5] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1.0 }}
              className={`absolute top-[58%] left-[14%] w-10 h-10 sm:w-13 sm:h-13 transition-all duration-700 ${isImageHovered ? 'opacity-90 scale-100' : 'opacity-0 scale-75'}`}
            >
              <img src="/assets/hero/doodle_2.png" alt="" className="w-full h-full object-contain" />
            </motion.div>

            {/* Lower Right - Photo Frames/Polaroids */}
            <motion.div 
              animate={{ y: [-9, 7, -9], x: [-4, 6, -4], rotate: [-4, 4, -4] }}
              transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className={`absolute top-[55%] right-[10%] w-10 h-10 sm:w-14 sm:h-14 transition-all duration-700 ${isImageHovered ? 'opacity-90 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-8'}`}
            >
              <img src="/assets/hero/doodle_7.png" alt="" className="w-full h-full object-contain" />
            </motion.div>

            {/* Bottom Left - Tripod (light stand ke opposite side) */}
            <motion.div 
              animate={{ y: [-6, 8, -6], x: [-3, 5, -3], rotate: [-3, 3, -3] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
              className={`absolute bottom-[22%] left-[18%] w-10 h-10 sm:w-14 sm:h-14 transition-all duration-700 ${isImageHovered ? 'opacity-85 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-8'}`}
            >
              <img src="/assets/hero/doodle_1.png" alt="" className="w-full h-full object-contain" />
            </motion.div>
          </div>

          {/* Person Image Container - Fixed Layout Bounds for Maximum Stability */}
          <div className="relative z-20 flex flex-col items-center justify-end w-full max-w-[800px] h-[450px] group mt-auto">
            
            {/* The Scaled Image Wrapper - Zooms inside the stable box */}
            <div 
              className="absolute inset-0 flex justify-center items-end overflow-visible origin-bottom transition-all duration-500 ease-in-out" 
              style={{ 
                maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                transform: `scale(${(settings?.heroImageScale || 100) / 100})`
              }}
            >
              <img 
                src={heroImage} 
                alt="Rohit Borana" 
                key={heroImage} // Forces fast re-render for dimensions
                className="w-full h-full object-contain object-bottom drop-shadow-[0_20px_25px_rgba(0,0,0,0.5)] filter contrast-[1.05] brightness-[1.02] transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
            
            {/* Hire Me - Pinned completely outside the scaled box so it never moves unexpectedly */}
            <div className="absolute -bottom-4 sm:-bottom-6 left-1/2 -translate-x-1/2 flex justify-center z-30">
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
    </div>
  );
}
