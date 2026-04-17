"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { servicesData } from "@/frontend/data/servicesData";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, Loader2 } from "lucide-react";

interface SubcategoryPageProps {
  params: {
    category: string;
    subcategory: string;
  };
}

export default function SubcategoryPage({ params }: SubcategoryPageProps) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const categoryData = servicesData.find((s) => s.id === params.category);
  const subcategoryData = categoryData?.subcategories.find((s) => s.id === params.subcategory);

  useEffect(() => {
    if (categoryData && subcategoryData) {
      fetchProjects();
    }
  }, [params]);

  const fetchProjects = async () => {
    try {
      // Fetch projects filtered by category ID and subcategory Title
      const res = await fetch(`/api/admin/projects?category=${params.category}&subCategory=${subcategoryData?.title}`);
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!categoryData || !subcategoryData) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Back Button and Header */}
        <div className="mb-12">
          <Link href={`/service/${params.category}`} className="inline-flex items-center text-gray-500 hover:text-[#FD853A] font-medium transition-colors mb-8">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to {categoryData.title}
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="w-16 h-1 bg-[#FD853A] mb-6 rounded-full" />
              <h1 className="text-4xl md:text-5xl font-bold text-[#1D2939] mb-4 uppercase tracking-tight">
                {subcategoryData.title} <span className="text-[#FD853A]">Gallery</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Explore our professional {subcategoryData.title.toLowerCase()} work and cinematic excellence.
              </p>
            </div>
            <div className="hidden md:flex h-20 w-20 rounded-[2rem] bg-[#FAFAFA] items-center justify-center border border-gray-100 shadow-sm">
              <categoryData.icon className="w-10 h-10 text-[#FD853A]" />
            </div>
          </div>
        </div>

        {/* Gallery Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-400">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="font-medium">Loading gallery...</p>
          </div>
        ) : projects.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {projects.map((project, index) => (
              <motion_wrapper key={project._id || index}>
                <div className="break-inside-avoid overflow-hidden rounded-[2rem] relative group border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:border-[#FD853A]/20">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                    <span className="text-white font-bold text-xl mb-1">{project.title}</span>
                    <span className="text-gray-300 text-sm font-medium uppercase tracking-wider">{subcategoryData.title}</span>
                  </div>
                </div>
              </motion_wrapper>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 px-6 bg-[#FAFAFA] rounded-[3rem] border border-dashed border-gray-200 text-center">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6">
              <ImageIcon className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-[#1D2939] mb-2">No Projects Yet</h3>
            <p className="text-gray-500 max-w-md">
              We haven't uploaded any work for {subcategoryData.title} yet. 
              Check back soon to see our latest masterpieces!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
