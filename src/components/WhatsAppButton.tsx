"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const phoneNumber = "919000000000"; // Placeholder
  const message = "Hello Rohit! I'm interested in your photography services.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={{ scale: 1.15, rotate: 5, y: -5 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-[100] group"
      aria-label="Contact on WhatsApp"
    >
      {/* Dynamic Glow Effect */}
      <div className="absolute inset-0 bg-[#25D366] rounded-full blur-[20px] opacity-40 group-hover:opacity-70 transition-opacity duration-300 animate-pulse"></div>
      
      {/* Main Button with Glassmorphism */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-[#25D366]/90 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/20 shadow-[0_8px_32px_rgba(37,211,102,0.3)] group-hover:shadow-[0_12px_48px_rgba(37,211,102,0.5)] transition-all duration-300">
        <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-current" />
        
        {/* Modern Ping Indicator */}
        <span className="absolute top-3 right-3 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-white/40"></span>
        </span>
      </div>

      {/* Floating Label (Appears on Hover) */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute right-24 top-1/2 -translate-y-1/2 bg-[#25D366] text-white px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap shadow-xl pointer-events-none hidden lg:block"
      >
        Chat with Rohit
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-[6px] border-transparent border-l-[#25D366]"></div>
      </motion.div>
    </motion.a>
  );
}
