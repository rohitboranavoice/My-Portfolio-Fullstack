"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useData } from "@/context/DataContext";

// Sample sets of images for each of the 8 blocks
const portfolioData = [
  {
    id: 1,
    title: "Wedding Story",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800",
    ]
  },
  {
    id: 2,
    title: "Fashion Portrait",
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800",
    ]
  },
  {
    id: 3,
    title: "Nature & Travel",
    images: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800",
    ]
  },
  {
    id: 4,
    title: "Creative Art",
    images: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1459908493193-278676d1e431?auto=format&fit=crop&q=80&w=800",
    ]
  },
  {
    id: 5,
    title: "Event Photography",
    images: [
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
    ]
  },
  {
    id: 6,
    title: "Street Soul",
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=800",
    ]
  },
  {
    id: 7,
    title: "Commercial Film",
    images: [
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=800",
    ]
  },
  {
    id: 8,
    title: "Black & White",
    images: [
      "https://images.unsplash.com/photo-1502164980785-f8aa41d53611?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1470075801209-17f9ec0cada6?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&q=80&w=800",
    ]
  }
];

function DynamicPhotoBlock({ images, id, interval }: { images: string[], id: number, interval: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="relative w-full aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden group shadow-lg border border-gray-100">
      <AnimatePresence mode="wait">
        <motion.img
          key={images[index]}
          src={images[index]}
          alt={`Portfolio ${id}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <span className="text-white/10 font-bold text-8xl">#{id}</span>
      </div>
    </div>
  );
}

export default function PortfolioSection() {
  const { projects } = useData();
  
  const dynamicPortfolio = useMemo(() => {
    // 1. Group actual projects by category
    const groups = projects.reduce((acc: any, proj: any) => {
      const cat = proj.category || "Uncategorized";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(proj.image);
      return acc;
    }, {});
    
    // 2. Convert groups to base array
    const baseGroups = Object.entries(groups).map(([title, images]: any, idx) => ({
      id: idx + 1,
      title,
      images
    }));

    // 3. Ensure exactly 8 items for a 4x2 grid
    if (baseGroups.length >= 8) {
      return baseGroups.slice(0, 8);
    }
    
    // Pad with sample data if needed
    const paddedGroups = [...baseGroups];
    const needed = 8 - baseGroups.length;
    
    for (let i = 0; i < needed; i++) {
      // Use portfolioData items, offset by baseGroups.length to avoid immediate direct duplicates if possible
      const fallbackItem = portfolioData[(baseGroups.length + i) % portfolioData.length];
      paddedGroups.push({
        ...fallbackItem,
        id: paddedGroups.length + 1
      });
    }
    
    return paddedGroups;
  }, [projects]);

  return (
    <section id="portfolio" className="w-full bg-white py-32 overflow-hidden">
      <div className="container mx-auto px-6 mb-20 text-center">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[#FD853A] font-bold tracking-[0.3em] text-xs sm:text-sm mb-4 uppercase inline-block"
        >
          My Work
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#171717] leading-tight tracking-tight uppercase"
        >
          EXPLORE OUR <span className="text-[#FD853A]">PORTFOLIO</span>
        </motion.h2>
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: "100px" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-1.5 bg-[#FD853A] mt-8 rounded-full mx-auto"
        />
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-gray-500 text-lg max-w-2xl mx-auto"
        >
          A curated collection of our most stunning visual narratives, showcased in a dynamic, living gallery.
        </motion.p>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {dynamicPortfolio.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <DynamicPhotoBlock 
                images={item.images} 
                id={item.id} 
                // Stagger the intervals so they don't change at the same time
                interval={4000 + (idx * 300)} 
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center mt-16">
        <Link href="/portfolio" className="px-10 py-4 bg-[#171717] text-white rounded-full font-bold hover:bg-[#FD853A] transition-all duration-300 shadow-xl group border border-[#171717] hover:border-[#FD853A] mb-16 inline-block">
          View Full Portfolio
        </Link>
      </div>
    </section>
  );
}
