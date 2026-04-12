"use client";

import { motion } from "framer-motion";
import { useData } from "@/context/DataContext";
import { Play, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function VideoGallery() {
  const { videos, loading } = useData();
  
  // Filter for gallery type videos
  const galleryVideos = videos.filter(v => v.type === "gallery").slice(0, 8);

  if (loading) return null;
  
  // Placeholder in case no gallery videos exist yet, to assist in visual verification
  const isEmpty = galleryVideos.length === 0;

  // Helper to convert YouTube URL to Embed
  const getEmbedUrl = (url: string) => {
    if (!url || typeof url !== 'string') return "";
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "youtube.com/embed/");
    }
    return url;
  };

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Title Section */}
        <div className="mb-10 text-center md:text-left">
          <motion.h3 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-400 font-bold uppercase tracking-[0.5em] text-[10px] sm:text-xs mb-2"
          >
            videography
          </motion.h3>
        </div>

        {/* 4x2 Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => {
            const video = galleryVideos[i];
            
            if (!video) {
              return (
                <div key={`placeholder-${i}`} className="aspect-[3/4] bg-neutral-50 rounded-3xl border border-neutral-100 flex flex-col items-center justify-center p-6 text-center opacity-50 scale-95 shadow-lg">
                  <div className="w-10 h-10 bg-neutral-100 rounded-full mb-3 flex items-center justify-center text-neutral-300">
                    <Play size={16} fill="currentColor" />
                  </div>
                  <div className="h-2 w-24 bg-neutral-100 rounded-full mb-2"></div>
                  <div className="h-2 w-16 bg-neutral-100 rounded-full opacity-50"></div>
                </div>
              );
            }

            return (
              <motion.div
                key={video._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="group relative aspect-[3/4] bg-neutral-100 rounded-3xl overflow-hidden shadow-lg border border-gray-100 transition-all hover:shadow-xl"
              >
                {/* YouTube Embed Container */}
                <iframe 
                  src={`${getEmbedUrl(video.youtubeUrl || video.videoUrl)}?autoplay=0&controls=1&rel=0`}
                  className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 border-none object-cover"
                  allowFullScreen
                  loading="lazy"
                ></iframe>

                {/* Static Thumbnail (Visible by default) */}
                <div className="absolute inset-0 bg-black group-hover:opacity-0 transition-opacity duration-500">
                  <img 
                    src={video.thumbnailUrl || `https://img.youtube.com/vi/${(video.youtubeUrl || video.videoUrl).match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1] || ''}/maxresdefault.jpg`} 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" 
                    alt={video.title}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 transform group-hover:scale-110 transition-transform">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>
                </div>

                {/* Content Overlay (Bottom) */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 group-hover:translate-y-full transition-transform duration-500 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white font-bold text-[10px] uppercase tracking-[0.3em] truncate">{video.title}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1 whitespace-nowrap overflow-hidden">
                    <p className="text-white/60 text-[9px] uppercase font-bold tracking-widest">{video.category}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-center mt-12">
          <Link href="/service/video-production" className="px-10 py-4 bg-[#171717] text-white rounded-full font-bold hover:bg-[#FD853A] transition-all duration-300 shadow-xl group border border-[#171717] hover:border-[#FD853A] mb-16 inline-block">
            View All Videos
          </Link>
        </div>
      </div>
    </section>
  );
}
