import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, Play, Maximize2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useData } from "@/frontend/context/DataContext";
import Link from "next/link";

const fallbackProjects = [
  {
    _id: "1",
    title: "Wedding Story",
    category: "Wedding",
    image: "https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=800&auto=format&fit=crop",
    aspectRatio: "aspect-square",
  },
  {
    _id: "2",
    title: "Fashion Portrait",
    category: "Photography",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    aspectRatio: "aspect-square",
  },
  {
    _id: "3",
    title: "Cinematic Soul",
    category: "Videography",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop",
    aspectRatio: "aspect-square",
  }
];

interface PortfolioGridProps {
  layoutType?: "grid" | "masonry";
}

export default function PortfolioGrid({ layoutType = "grid" }: PortfolioGridProps) {
  const { projects, portfolioCategories, loading } = useData();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const displayProjects = projects && projects.length > 0 ? projects : fallbackProjects;

  const categories = useMemo(() => {
    if (portfolioCategories && portfolioCategories.length > 0) {
      return [{ title: "All", slug: "All" }, ...portfolioCategories];
    }
    const cats = new Set(displayProjects.map(p => p.category));
    return [{ title: "All", slug: "All" }, ...Array.from(cats).map(c => ({ title: c, slug: c }))];
  }, [displayProjects, portfolioCategories]);

  const filteredProjects = useMemo(() => {
    return displayProjects.filter(
      (p) => activeCategory === "All" || p.category === activeCategory
    );
  }, [displayProjects, activeCategory]);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading gallery...</div>;

  const isVideo = (url: string) => {
    return url?.match(/\.(mp4|webm|ogg)$/i) || url?.includes("youtube.com") || url?.includes("vimeo.com") || url?.includes("drive.google.com");
  };

  const isMasonry = layoutType === "masonry";

  return (
    <section id="portfolio" className="w-full py-24 bg-background">
      <div className={isMasonry ? "w-full mx-auto px-4 sm:px-6 max-w-[1600px]" : "container mx-auto px-6 max-w-7xl"}>
        
        {/* Filters */}
        <div className="flex justify-center mb-16 gap-3 flex-wrap">
            {categories.map((c) => (
              <button
                key={c.slug}
                onClick={() => setActiveCategory(c.slug)}
                className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
                  activeCategory === c.slug
                    ? "bg-[#FD853A] text-white shadow-xl shadow-[#FD853A]/30 scale-105"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-[#FD853A]/10 hover:text-[#FD853A]"
                }`}
              >
                {c.title}
              </button>
            ))}
        </div>

        {/* Dynamic Grid / Masonry Layout */}
        <div className={isMasonry 
          ? "columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-4 space-y-3 sm:space-y-4" 
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"}>
          {filteredProjects.map((project: any) => (
            <motion.div
              key={project._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              onClick={() => setSelectedProject(project)}
              className={`group relative overflow-hidden rounded-[2.5rem] bg-neutral-100 dark:bg-neutral-800 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 
                ${isMasonry ? "break-inside-avoid" : "aspect-square"}
              `}
            >
              {/* Media Preview */}
              <div className={isMasonry ? "relative w-full h-full" : "absolute inset-0"}>
                {isVideo(project.image) ? (
                   <div className="relative w-full h-full">
                     <video src={project.image} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                     <div className="absolute inset-0 bg-black/20" />
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                        <Play size={20} className="text-white fill-white ml-1" />
                     </div>
                   </div>
                ) : (
                  <img
                    src={project.image}
                    alt={project.title}
                    className={`w-full ${isMasonry ? "h-auto" : "h-full"} object-cover transition-transform duration-700 group-hover:scale-110`}
                  />
                )}
              </div>
              
              {/* Dark Overlay on Hover */}
              <div className="absolute inset-0 bg-neutral-900/60 transition-all duration-300 flex flex-col justify-end p-8 z-30 opacity-0 group-hover:opacity-100">
                
                {/* Maximize Icon */}
                <div className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white text-neutral-900 flex items-center justify-center opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 shadow-xl">
                  <Maximize2 className="h-5 w-5" />
                </div>

                {/* Info Text */}
                <div className="opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75">
                  <div className="text-[#FD853A] text-[10px] font-black tracking-[0.3em] uppercase mb-2 flex flex-wrap items-center gap-2">
                    {project.category} {project.subCategory && `• ${project.subCategory}`}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                    {project.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Premium Lightbox Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-10 bg-black/95 backdrop-blur-xl"
            >
              <button 
                onClick={() => setSelectedProject(null)}
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
                {isVideo(selectedProject.image) ? (
                  <iframe 
                    src={selectedProject.image.includes("youtube.com") || selectedProject.image.includes("youtu.be") 
                      ? `https://www.youtube.com/embed/${selectedProject.image.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1]}?autoplay=1` 
                      : selectedProject.image}
                    className="w-full h-full border-none"
                    allow="autoplay; fullscreen"
                  />
                ) : (
                  <img 
                    src={selectedProject.image} 
                    alt={selectedProject.title}
                    className="w-full h-full object-contain"
                  />
                )}

                {/* Info Overlay inside Lightbox */}
                <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                  <div className="text-[#FD853A] text-[10px] sm:text-xs font-black tracking-[0.4em] uppercase mb-4">
                    {selectedProject.category} {selectedProject.subCategory && `| ${selectedProject.subCategory}`}
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-bold text-white">
                    {selectedProject.title}
                  </h2>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
