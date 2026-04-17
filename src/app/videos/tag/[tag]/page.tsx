"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Youtube, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { useData } from "@/frontend/context/DataContext";
import { useMemo } from "react";

interface PageProps {
  params: {
    tag: string;
  };
}

export default function VideoTagPage({ params }: PageProps) {
  const { videos, loading } = useData();
  
  const filteredVideos = useMemo(() => {
    const slugify = (str: string) => {
      if (!str) return "";
      return str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    };
    return videos.filter(v => v.subCategory && slugify(v.subCategory) === params.tag.toLowerCase());
  }, [videos, params.tag]);

  const title = params.tag.replace(/-/g, ' ');

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Video Gallery...</div>;

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-16">
          <Link href="/" className="inline-flex items-center text-gray-500 hover:text-[#FD853A] font-medium transition-colors mb-8 group uppercase tracking-widest text-xs">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="flex flex-col">
            <div className="w-16 h-1.5 bg-[#FD853A] mb-8 rounded-full" />
            <h1 className="text-4xl md:text-6xl font-black text-[#1D2939] uppercase tracking-tighter">
              {title} <span className="text-[#FD853A]">Production</span>
            </h1>
            <p className="text-gray-500 mt-4 text-lg">Official production links and cinematic highlights.</p>
          </div>
        </div>

        {/* Links Grid - Clean list view as requested */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video, idx) => (
              <motion.div
                key={video._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-neutral-50 rounded-3xl p-8 border border-neutral-100 flex items-center justify-between group hover:border-[#FD853A]/30 transition-all hover:bg-white hover:shadow-xl"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#FD853A] border shadow-sm group-hover:scale-110 transition-transform">
                    {video.youtubeUrl ? <Youtube size={32} /> : <LinkIcon size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1D2939] group-hover:text-[#FD853A] transition-colors">{video.title}</h3>
                    <p className="text-gray-400 text-xs uppercase font-bold tracking-widest mt-1">{video.category}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  {(video.youtubeUrl || video.videoUrl) && (
                    <a 
                      href={video.youtubeUrl || video.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-[#171717] text-white rounded-xl flex items-center justify-center hover:bg-[#FD853A] transition-all shadow-lg shadow-black/10"
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-400">
              No video productions found for this tag.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
