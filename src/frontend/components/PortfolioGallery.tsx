"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useData } from "@/frontend/context/DataContext";
import { useMemo } from "react";

interface PortfolioGalleryProps {
  title: string;
  category?: string;
  subCategory?: string;
  type: "category" | "tag";
}

export default function PortfolioGallery({ title, category, subCategory, type }: PortfolioGalleryProps) {
  const { projects, loading } = useData();

  const filteredProjects = useMemo(() => {
    const slugify = (str: string) => {
      if (!str) return "";
      return str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    };
    
    if (type === "category") {
      return projects.filter(p => p.category && slugify(p.category) === category?.toLowerCase());
    } else {
      return projects.filter(p => p.subCategory && slugify(p.subCategory) === subCategory?.toLowerCase());
    }
  }, [projects, category, subCategory, type]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Gallery...</div>;

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Back and Header */}
        <div className="mb-16">
          <Link href="/portfolio" className="inline-flex items-center text-gray-500 hover:text-[#FD853A] font-medium transition-colors mb-8 group uppercase tracking-widest text-xs">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to All Portfolio
          </Link>
          <div className="flex flex-col">
            <div className="w-16 h-1.5 bg-[#FD853A] mb-8 rounded-full" />
            <h1 className="text-4xl md:text-6xl font-black text-[#1D2939] uppercase tracking-tighter">
              {title} <span className="text-[#FD853A]">Gallery</span>
            </h1>
          </div>
        </div>

        {/* Mosaic Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, idx) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`relative overflow-hidden rounded-[2rem] bg-neutral-100 group shadow-lg ${project.aspectRatio || "aspect-square"}`}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                   <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{project.title}</h3>
                   <p className="text-[#FD853A] text-xs font-bold uppercase tracking-widest">{project.category} {project.subCategory && `• ${project.subCategory}`}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-400">
              No projects found in this collection.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
