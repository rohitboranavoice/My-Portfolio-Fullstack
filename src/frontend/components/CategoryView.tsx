"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, LayoutGrid, Check, Image as ImageIcon, Film, Play, Maximize2, X } from "lucide-react";
import { useData } from "@/frontend/context/DataContext";
import { motion, AnimatePresence } from "framer-motion";

interface CategoryViewProps {
  categoryId: string;
  categoryData: any; // Passed from the Server Component
}

export default function CategoryView({ categoryId, categoryData }: CategoryViewProps) {
  const { projects, videos } = useData();

  const [activeSubcategoryId, setActiveSubcategoryId] = useState(
    categoryData?.subcategories?.length > 0 ? categoryData.subcategories[0].id : null
  );
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  if (!categoryData) return null;

  const activeSubcategory = categoryData.subcategories.find((sub: any) => sub.id === activeSubcategoryId) || categoryData.subcategories[0];

  // Logic to determine if we are in video mode
  const isVideoMode = categoryId === "video-production";
  
  // Content selection logic
  let galleryContent: any[] = [];
  
  if (isVideoMode) {
    // Filter videos by subcategory if it exists
    const categoryVideos = videos.filter(v => 
      v.subCategory?.toLowerCase() === activeSubcategory?.title?.toLowerCase() ||
      v.category?.toLowerCase() === activeSubcategory?.title?.toLowerCase()
    );
    
    galleryContent = categoryVideos.map(v => ({
      type: "video",
      src: v.thumbnailUrl || `https://img.youtube.com/vi/${(v.youtubeUrl || v.videoUrl).match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1] || ''}/maxresdefault.jpg`,
      title: v.title,
      id: v._id,
      url: v.youtubeUrl || v.videoUrl
    }));
  } else {
    // Standard image projects
    const categoryProjects = projects.filter(p => p.category === activeSubcategory?.title || p.category === categoryData.title);
    galleryContent = categoryProjects.map(p => ({
      type: "image",
      src: p.image,
      title: p.title,
      id: p._id
    }));
  }

  // Fallback to placeholders if empty
  if (galleryContent.length === 0) {
    const basePlaceholders = [
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop"
    ];
    galleryContent = Array.from({ length: 9 }).map((_, i) => ({
      type: isVideoMode ? "video" : "image",
      src: basePlaceholders[i % basePlaceholders.length],
      title: `${activeSubcategory?.title} Sample ${i + 1}`,
      id: `placeholder-${i}`
    }));
  }

  const IconComponent = isVideoMode ? Film : ImageIcon;

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="w-full mx-auto px-4 sm:px-6 max-w-[1600px]">
        {/* Back Button and Header */}
        <div className="mb-12">
          <Link href="/service" className="inline-flex items-center text-gray-500 hover:text-[#FD853A] font-medium transition-colors mb-8 group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Services
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="w-16 h-1 bg-[#FD853A] mb-6 rounded-full" />
              <h1 className="text-4xl md:text-5xl font-bold text-[#1D2939] mb-4">
                {categoryData.title}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                {categoryData.description}
              </p>
            </div>
            <div className="hidden md:flex h-20 w-20 rounded-[2rem] bg-[#FAFAFA] items-center justify-center border border-gray-100 shadow-sm">
              {IconComponent && <IconComponent className="w-10 h-10 text-[#FD853A]" />}
            </div>
          </div>
        </div>

        {/* Subcategories Top Navigation */}
        {categoryData.subcategories.length > 0 && (
          <div className="mb-10 w-full overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex gap-3 min-w-max justify-center md:justify-start">
              {categoryData.subcategories.map((sub: any) => {
                const isActive = activeSubcategoryId === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubcategoryId(sub.id)}
                    className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 font-bold text-sm
                      ${isActive 
                         ? 'bg-[#FD853A] text-white shadow-lg shadow-[#FD853A]/30 scale-105' 
                         : 'bg-[#FAFAFA] border border-gray-200 text-[#1D2939] hover:border-[#FD853A] hover:text-[#FD853A] hover:bg-white'
                      }
                    `}
                  >
                    {sub.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Dense Masonry Gallery */}
        <div className="w-full">
          <div key={activeSubcategory?.id} className="columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4 animate-in fade-in duration-700">
            {galleryContent.map((item, index) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedMedia(item)}
                className="relative group bg-neutral-100 break-inside-avoid cursor-pointer rounded-2xl overflow-hidden"
              >
                {item.type === "video" ? (
                  <>
                    <img 
                      src={item.src} 
                      alt={item.title}
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" 
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 transform group-hover:scale-110 transition-transform">
                        <Play size={20} fill="currentColor" className="ml-1" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <img 
                      src={item.src} 
                      alt={item.title}
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 block" 
                      loading="lazy"
                    />
                    {/* Maximize Icon */}
                    <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white text-neutral-900 flex items-center justify-center opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 shadow-xl z-20">
                      <Maximize2 className="h-5 w-5" />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Lightbox Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-10 bg-black/95 backdrop-blur-xl"
          >
            <button 
              onClick={() => setSelectedMedia(null)}
              className="absolute top-10 right-10 z-[210] w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all group"
            >
              <X size={32} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-6xl aspect-[4/3] sm:aspect-video rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(253,133,58,0.15)] bg-neutral-900"
            >
              {selectedMedia.type === "video" && selectedMedia.url ? (
                <iframe 
                  src={selectedMedia.url.includes("youtube.com") || selectedMedia.url.includes("youtu.be") 
                    ? `https://www.youtube.com/embed/${selectedMedia.url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1]}?autoplay=1` 
                    : selectedMedia.url}
                  className="w-full h-full border-none"
                  allow="autoplay; fullscreen"
                />
              ) : (
                <img 
                  src={selectedMedia.src} 
                  alt={selectedMedia.title}
                  className="w-full h-full object-contain"
                />
              )}

              {/* Info Overlay inside Lightbox */}
              <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                <h2 className="text-3xl sm:text-5xl font-bold text-white">
                  {selectedMedia.title}
                </h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
