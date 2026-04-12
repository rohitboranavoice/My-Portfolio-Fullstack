import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState, useMemo } from "react";
import { useData } from "@/context/DataContext";
import Link from "next/link";

const fallbackProjects = [
  {
    _id: "1",
    title: "Wedding Story",
    category: "Wedding",
    image: "https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=800&auto=format&fit=crop",
    aspectRatio: "aspect-[3/4]",
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
    title: "Event Soul",
    category: "Event",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop",
    aspectRatio: "aspect-[4/3]",
  }
];

export default function PortfolioGrid() {
  const { projects, portfolioCategories, loading } = useData();
  const [activeCategory, setActiveCategory] = useState("All");

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

  return (
    <section id="portfolio" className="w-full py-24 bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Filters */}
        <div className="flex justify-center mb-16">
            {categories.map((c) => (
              <button
                key={c.slug}
                onClick={() => setActiveCategory(c.slug)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  activeCategory === c.slug
                    ? "bg-[#FD853A] text-white shadow-lg shadow-[#FD853A]/20"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-[#FD853A]/10 hover:text-[#FD853A]"
                }`}
              >
                {c.title}
              </button>
            ))}
        </div>

        {/* Masonry Grid Simulation using CSS Columns - Denser layout for full work visibility */}
        <div className="columns-1 md:columns-2 lg:columns-4 xl:columns-5 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
          {filteredProjects.map((project: any) => (
            <motion.div
              key={project._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className={`group relative overflow-hidden rounded-[2rem] bg-neutral-100 dark:bg-neutral-800 cursor-pointer w-full break-inside-avoid ${project.aspectRatio}`}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Dark Overlay on Hover - Robust visibility and interactivity */}
              <div className="absolute inset-0 bg-neutral-900/80 transition-all duration-300 flex flex-col justify-end p-8 sm:p-10 z-30 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
                
                {/* Expand Icon */}
                <div className="absolute top-6 right-6 h-12 w-12 rounded-full bg-white text-neutral-900 flex items-center justify-center opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 shadow-xl">
                  <ArrowUpRight className="h-6 w-6" />
                </div>

                {/* Info Text */}
                <div className="opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75">
                  <div className="text-primary-orange text-[10px] sm:text-[11px] font-black tracking-[0.3em] uppercase mb-3 flex flex-wrap items-center gap-3">
                    {project.category && (
                      <Link 
                        href={`/portfolio/${project.category.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-[#FD853A] hover:text-white transition-colors bg-white/5 backdrop-blur-md px-3 py-1 rounded-md border border-white/10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {project.category}
                      </Link>
                    )}
                    {project.subCategory && (
                      <>
                        <span className="text-white/20 text-lg">•</span>
                        <Link 
                          href={`/portfolio/tag/${project.subCategory.toLowerCase().replace(/\s+/g, '-')}`}
                          className="text-white/80 hover:text-white transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {project.subCategory}
                        </Link>
                      </>
                    )}
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                    {project.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
