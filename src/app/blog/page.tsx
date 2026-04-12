"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Clock, User } from "lucide-react";
import Link from "next/link";
import { useData } from "@/context/DataContext";

// Mock Blog Data - 12 posts for 4x3 grid
const fallbackBlogs = [
  {
    id: 1,
    title: "The Art of Cinematic Lighting",
    excerpt: "Exploring the fundamental techniques behind creating mood and depth in visual storytelling.",
    author: "Rohit Borana",
    date: "March 24, 2024",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop",
    category: "Cinematography",
    readTime: "6 min read"
  },
  {
    id: 2,
    title: "Urban Landscape Photography",
    excerpt: "Capturing the soul of modern cities through the lens of a professional photographer.",
    author: "Rohit Borana",
    date: "March 18, 2024",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=800&auto=format&fit=crop",
    category: "Photography",
    readTime: "8 min read"
  },
  {
    id: 3,
    title: "Post-Production Workflow",
    excerpt: "Mastering the transition from raw footage to a polished masterpiece in the editing suite.",
    author: "Rohit Borana",
    date: "March 12, 2024",
    image: "https://images.unsplash.com/photo-1574717024453-354056afd6fc?q=80&w=800&auto=format&fit=crop",
    category: "Editing",
    readTime: "10 min read"
  },
  {
    id: 4,
    title: "Fashion Photography Trends",
    excerpt: "What's defining the visual landscape of high-end fashion campaigns this year.",
    author: "Rohit Borana",
    date: "March 05, 2024",
    image: "https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=800&auto=format&fit=crop",
    category: "Fashion",
    readTime: "5 min read"
  },
  {
    id: 5,
    title: "Directing Commercial Projects",
    excerpt: "Navigating the complexities of high-budget commercial shoots with professional grace.",
    author: "Rohit Borana",
    date: "Feb 28, 2024",
    image: "https://images.unsplash.com/photo-1533488765986-dfa2a9939ca0?q=80&w=800&auto=format&fit=crop",
    category: "Directing",
    readTime: "12 min read"
  },
  {
    id: 6,
    title: "The Power of Sound Design",
    excerpt: "Why audio is 50% of the viewing experience and how to treat it correctly.",
    author: "Rohit Borana",
    date: "Feb 20, 2024",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop",
    category: "Sound",
    readTime: "7 min read"
  },
  {
    id: 7,
    title: "Documentary Storytelling",
    excerpt: "Finding truth in the mundane and crafting compelling narratives from real-life events.",
    author: "Rohit Borana",
    date: "Feb 14, 2024",
    image: "https://images.unsplash.com/photo-1551818255-e5e107c7b00c?q=80&w=800&auto=format&fit=crop",
    category: "Documentary",
    readTime: "9 min read"
  },
  {
    id: 8,
    title: "Equipment Guide for 2024",
    excerpt: "A deep dive into the gear that's actually worth the investment for professionals.",
    author: "Rohit Borana",
    date: "Feb 06, 2024",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
    category: "Gear",
    readTime: "15 min read"
  },
  {
    id: 9,
    title: "Mastering Color Grading",
    excerpt: "Using color palettes to evoke emotion and maintain visual consistency in projects.",
    author: "Rohit Borana",
    date: "Jan 30, 2024",
    image: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?q=80&w=800&auto=format&fit=crop",
    category: "Color",
    readTime: "11 min read"
  },
  {
    id: 10,
    title: "The Business of Production",
    excerpt: "Essential tips for client management, budgeting, and scaling your creative studio.",
    author: "Rohit Borana",
    date: "Jan 22, 2024",
    image: "https://images.unsplash.com/photo-1454165833202-0a97d590ce9b?q=80&w=800&auto=format&fit=crop",
    category: "Business",
    readTime: "10 min read"
  },
  {
    id: 11,
    title: "Event Photography Mastery",
    excerpt: "How to capture fleeting moments in high-energy event environments without missing a beat.",
    author: "Rohit Borana",
    date: "Jan 15, 2024",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop",
    category: "Events",
    readTime: "8 min read"
  },
  {
    id: 12,
    title: "The Future of AI in Media",
    excerpt: "How artificial intelligence is augmenting creative workflows rather than replacing them.",
    author: "Rohit Borana",
    date: "Jan 05, 2024",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
    category: "AI",
    readTime: "13 min read"
  }
];

export default function BlogPage() {
  const { blogs, loading } = useData();
  const displayBlogs = blogs && blogs.length > 0 ? blogs : fallbackBlogs;

  // We only show the loading state for a very brief moment or if we have absolutely nothing
  if (loading && (!blogs || blogs.length === 0)) {
     // Optional: Add a subtle loading skeleton here instead of a full screen block
  }

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 overflow-hidden relative">
        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center mb-20"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-neutral-900">
              Creative <span className="text-[#FD853A]">Insights</span>
            </h1>
            <p className="text-neutral-600 max-w-2xl text-lg md:text-xl leading-relaxed">
              Explore my thoughts on cinematography, photography, and the creative industry. 
              A collection of experiences and technical deep dives.
            </p>
          </motion.div>

          {/* 4x3 Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayBlogs.map((blog, index) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex flex-col bg-white border border-neutral-100 shadow-sm rounded-[2rem] overflow-hidden hover:shadow-2xl hover:border-[#FD853A]/30 transition-all duration-500"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#FD853A] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                      {blog.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6 lg:p-8">
                  <div className="flex items-center gap-4 text-xs text-neutral-500 mb-4">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {blog.readTime}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-neutral-300" />
                    <span>{blog.date}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[#FD853A] transition-colors duration-300 leading-tight text-neutral-900">
                    {blog.title}
                  </h3>
                  
                  <p className="text-neutral-600 text-sm mb-6 line-clamp-3">
                    {blog.excerpt}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#FD853A]/10 flex items-center justify-center border border-[#FD853A]/20">
                        <User className="w-4 h-4 text-[#FD853A]" />
                      </div>
                      <span className="text-sm font-semibold text-neutral-700">{blog.author}</span>
                    </div>
                    
                    <button className="text-xs font-bold uppercase tracking-widest text-neutral-500 group-hover:text-black transition-colors">
                      Read More
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer is provided globally in layout.tsx */}
    </main>
  );
}
