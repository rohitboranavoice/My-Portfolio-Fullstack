"use client";

import PortfolioGrid from "@/frontend/components/PortfolioGrid";
import { motion } from "framer-motion";

export default function PortfolioPage() {
  return (
    <div className="pt-32 pb-20">
      <div className="px-6 sm:px-10 lg:px-20 max-w-7xl mx-auto mb-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#1D2939] leading-tight tracking-tight uppercase">
            OUR <span className="text-[#FD853A]">PORTFOLIO</span>
          </h1>
          <div className="w-24 h-1.5 bg-[#FD853A] mt-8 rounded-full"></div>
        </motion.div>
      </div>

      <PortfolioGrid />
    </div>
  );
}
