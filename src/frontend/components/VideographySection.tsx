"use client";

import { motion } from "framer-motion";
import { Play, Film, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useData } from "@/frontend/context/DataContext";
import { useState, useRef, useEffect } from "react";

export default function VideographySection() {
  const { videos, loading } = useData();
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Find the featured video or the first one available
  const featuredVideo = videos.find(v => v.isFeatured) || videos[0];

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (loading) return null;
  if (!featuredVideo && !loading) return null;

  return (
    <section className="w-full py-24 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-[#FD853A] font-bold uppercase tracking-[0.3em] text-sm mb-4"
            >
              <Film size={18} />
              <span>Cinematography</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black text-[#1D2939] leading-[1.1]"
            >
              VISUAL <span className="text-[#FD853A]">STORYTELLING</span> AT ITS FINEST
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-500 max-w-sm text-lg leading-relaxed"
          >
            We don&apos;t just record videos; we craft cinematic experiences that preserve the soul of the moment.
          </motion.p>
        </div>

        {/* Major Video Player */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative w-full aspect-video rounded-[3rem] overflow-hidden shadow-2xl group cursor-pointer bg-black"
          onClick={togglePlay}
        >
          {/* Video Element */}
          <video 
            ref={videoRef}
            src={featuredVideo?.videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-front-of-a-luxury-car-40546-large.mp4"} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            loop
            muted={false}
          />

          {/* Overlays */}
          <div className={`absolute inset-0 bg-black/40 transition-opacity duration-500 flex flex-col items-center justify-center ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
            <div className="w-24 h-24 md:w-32 md:h-32 bg-[#FD853A] rounded-full flex items-center justify-center text-white shadow-2xl transform transition-all group-hover:scale-110 active:scale-95">
              {isPlaying ? <div className="flex gap-2"><div className="w-2 h-10 bg-white rounded-full"/><div className="w-2 h-10 bg-white rounded-full"/></div> : <Play size={48} fill="currentColor" className="ml-2" />}
            </div>
            {!isPlaying && (
              <p className="text-white font-bold mt-8 text-xl tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                Play Featured Cinematic
              </p>
            )}
          </div>

          {/* Info Card - Bottom left */}
          <div className="absolute bottom-8 left-8 right-8 md:right-auto z-20 pointer-events-none">
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl max-w-md">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#FD853A] font-bold text-xs uppercase tracking-widest">{featuredVideo?.category || "Featured Work"}</span>
                {featuredVideo?.subCategory && (
                  <>
                    <span className="text-white/20 text-xs">•</span>
                    <Link 
                      href={`/videos/tag/${featuredVideo.subCategory.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-white/60 hover:text-[#FD853A] transition-colors font-bold text-xs uppercase tracking-widest pointer-events-auto"
                    >
                      {featuredVideo.subCategory}
                    </Link>
                  </>
                )}
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-4">{featuredVideo?.title || "Cinematic Highlight 2024"}</h3>
              <div className="flex items-center gap-4">
                 <Link href="/hire-me" className="flex items-center gap-2 bg-[#FD853A] text-white px-5 py-2 rounded-xl text-sm font-bold pointer-events-auto hover:bg-[#e67a2e] transition-colors">
                   Book Your Shoot
                   <ArrowRight size={14} />
                 </Link>
              </div>
            </div>
          </div>
          
          {/* Cinematic Ambient Glow */}
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#FD853A] blur-[120px] opacity-20 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500 blur-[120px] opacity-10 pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
