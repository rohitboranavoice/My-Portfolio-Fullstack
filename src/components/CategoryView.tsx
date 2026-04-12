"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, LayoutGrid, Check, Image as ImageIcon, Film, Play } from "lucide-react";
import { useData } from "@/context/DataContext";

interface CategoryViewProps {
  categoryId: string;
  categoryData: any; // Passed from the Server Component
}

export default function CategoryView({ categoryId, categoryData }: CategoryViewProps) {
  const { projects, videos } = useData();

  const [activeSubcategoryId, setActiveSubcategoryId] = useState(
    categoryData?.subcategories?.length > 0 ? categoryData.subcategories[0].id : null
  );

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
      <div className="container mx-auto px-6 max-w-7xl">
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

        {/* Main Content Layout: List on Left (30%), Gallery on Right (70%) */}
        <div className="flex flex-col lg:flex-row gap-12 mt-12">
          
          {/* Left Column: Subcategory List */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-32">
              <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest mb-6 px-2">Select Category</h3>
              <div className="flex flex-col gap-3">
                {categoryData.subcategories.map((sub: any) => {
                  const isActive = activeSubcategoryId === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSubcategoryId(sub.id)}
                      className={`group relative flex items-center p-4 rounded-2xl transition-all duration-300 w-full text-left
                        ${isActive 
                           ? 'bg-[#1D2939] text-white shadow-lg shadow-[#1D2939]/20 scale-[1.02] border border-[#1D2939]' 
                           : 'bg-[#FAFAFA] border border-gray-200 text-[#1D2939] hover:border-[#FD853A] hover:bg-white hover:shadow-md'
                        }
                      `}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center border shadow-sm mr-4 transition-colors duration-300 flex-shrink-0
                        ${isActive 
                           ? 'bg-white/10 border-white/20' 
                           : 'bg-white border-gray-100 group-hover:border-[#FD853A]/30'
                        }
                      `}>
                        {isActive ? (
                          <Check className="w-5 h-5 text-[#FD853A]" />
                        ) : (
                          <LayoutGrid className="w-5 h-5 text-gray-400 group-hover:text-[#FD853A]" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`font-semibold text-base md:text-lg transition-colors
                          ${isActive ? 'text-white' : 'group-hover:text-[#FD853A]'}
                        `}>
                          {sub.title}
                        </h3>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Gallery (Takes up more space) */}
          <div className="w-full lg:w-2/3">
            <div className="mb-6 flex justify-between items-center bg-[#FAFAFA] p-6 rounded-3xl border border-gray-100">
              <h2 className="text-2xl font-bold text-[#1D2939]">{activeSubcategory?.title} Gallery</h2>
            </div>
            
            <div key={activeSubcategory?.id} className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in duration-700">
              {galleryContent.map((item, index) => (
                <div key={item.id} className="overflow-hidden rounded-3xl relative group bg-neutral-100 shadow-md aspect-[3/4]">
                  {item.type === "video" ? (
                    <>
                      <img 
                        src={item.src} 
                        alt={item.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 transform group-hover:scale-110 transition-transform">
                          <Play size={24} fill="currentColor" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                         <p className="text-white font-bold text-xs uppercase tracking-widest truncate">{item.title}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <img 
                        src={item.src} 
                        alt={item.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                        loading="lazy"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                         <p className="text-white font-bold text-xs uppercase tracking-widest truncate">{item.title}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
