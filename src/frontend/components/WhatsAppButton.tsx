"use client";

import { motion } from "framer-motion";

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
      whileHover={{ scale: 1.1, rotate: 5, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[100] group"
      aria-label="Contact on WhatsApp"
    >
      {/* Intense Glowing Backdrop (Pulse Effect) */}
      <div className="absolute inset-0 bg-[#25D366] rounded-full blur-[25px] opacity-50 group-hover:opacity-80 transition-opacity duration-300 animate-pulse"></div>
      
      {/* Sleek Modern Gradient Button */}
      <div 
        className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-[#128c7e] to-[#25d366] rounded-full flex items-center justify-center shadow-2xl transition-all duration-300"
        style={{
          boxShadow: '0 10px 25px rgba(37,211,102,0.5), inset 0 2px 4px rgba(255,255,255,0.4)',
          border: '2px solid rgba(255,255,255,0.3)'
        }}
      >
        {/* Sleek WhatsApp SVG Icon */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="36" height="36" 
          fill="currentColor" 
          viewBox="0 0 16 16" 
          className="text-white drop-shadow-md w-8 h-8 sm:w-11 sm:h-11 ml-0.5"
        >
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
        </svg>

        {/* Small indicator dot on the top right simulating a notification ping */}
        <span className="absolute top-0 right-0 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-[#128c7e]"></span>
        </span>
      </div>

      {/* Floating Stylish Label (Appears on Hover) */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute right-[85px] sm:right-[100px] top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#171717] to-[#252525] text-white px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap shadow-2xl pointer-events-none hidden lg:block border border-white/10"
      >
        Chat with Rohit
        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-[6px] border-transparent border-l-[#252525]"></div>
      </motion.div>
    </motion.a>
  );
}
