"use client";

import { motion } from "framer-motion";
import { useData } from "@/frontend/context/DataContext";

export default function AboutPage() {
  const { settings } = useData();

  return (
    <div className="pt-32 pb-20 px-6 sm:px-10 lg:px-20 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
      >
        <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-gray-100 shadow-2xl">
          <img 
            src={settings?.aboutImage || "https://rohitborana.vercel.app/girl.svg"} 
            alt="Rohit Borana" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-5xl lg:text-7xl font-bold text-[#1D2939] leading-tight text-center lg:text-left">
              Beyond the Shutter, <br /> 
              Discovering the <span className="text-[#FD853A]">Soul</span>
            </h1>
            <div className="w-20 h-2 bg-[#FD853A] mt-4 rounded-full mx-auto lg:mx-0"></div>
          </div>
          
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed text-center lg:text-left">
            <p>
              {settings?.aboutText || "I am Rohit Borana, a professional photographer and videographer based in India. My journey with the camera started with a simple passion for storytelling through visuals, and it has since evolved into a lifetime commitment to freezing moments that matter."}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 border-t border-gray-100">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#FD853A]">{settings?.clientsCount || "450+"}</h3>
              <p className="text-[10px] sm:text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">Clients</p>
            </div>
            <div className="text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#FD853A]">{settings?.eventsCount || "1k+"}</h3>
              <p className="text-[10px] sm:text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">Events</p>
            </div>
            <div className="text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#FD853A]">{settings?.awardsCount || "12+"}</h3>
              <p className="text-[10px] sm:text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">Awards</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
