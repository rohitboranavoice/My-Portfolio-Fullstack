"use client";

import { motion } from "framer-motion";
import { useData } from "@/frontend/context/DataContext";

const TestimonialCard = ({ t }: { t: any }) => (
  <div className="flex flex-col w-[260px] sm:w-[300px] h-auto min-h-[180px] p-5 rounded-[1.5rem] bg-white border border-gray-100 shadow-[0_8px_20px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:border-primary-orange/30 transition-all duration-500 hover:shadow-lg">
    {/* Profile Image Circle at Top */}
    <div className="flex justify-center -mt-3 mb-2 relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 scale-75 opacity-20">
        <svg width="20" height="16" viewBox="0 0 24 20" fill="none" className="text-primary-orange group-hover:scale-110 transition-transform">
          <path d="M9 0L7 4H12V20H0V4L3 0H9ZM21 0L19 4H24V20H12V4L15 0H21Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="w-12 h-12 rounded-full border-2 border-gray-50 overflow-hidden bg-neutral-100 relative z-10 shadow-sm group-hover:border-primary-orange/20 transition-colors duration-500">
        <div className="w-full h-full flex items-center justify-center text-primary-orange font-bold text-sm uppercase italic">
          {t.name.split(' ').map((n: string) => n[0]).join('')}
        </div>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 rotate-180 scale-75 opacity-20">
        <svg width="20" height="16" viewBox="0 0 24 20" fill="none" className="text-primary-orange group-hover:scale-110 transition-transform">
          <path d="M9 0L7 4H12V20H0V4L3 0H9ZM21 0L19 4H24V20H12V4L15 0H21Z" fill="currentColor"/>
        </svg>
      </div>
    </div>

    {/* Stars */}
    <div className="flex justify-center gap-0.5 mb-2">
      {[...Array(5)].map((_, i) => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill={i < t.rating ? "#FD853A" : "#E2E8F0"} stroke={i < t.rating ? "#FD853A" : "#E2E8F0"} strokeWidth="2">
          <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>

    {/* Text */}
    <p className="text-gray-500 text-center text-[11px] leading-relaxed mb-2 italic flex-1 flex items-center px-1">
      &quot;{t.text}&quot;
    </p>

    {/* Signature/Name */}
    <div className="flex flex-col items-center border-t border-gray-50 pt-1.5 mt-auto">
      <span className="text-[#171717] font-bold text-[10px] tracking-widest uppercase text-center">{t.name}</span>
      <span className="text-[9px] text-gray-400 italic mt-0.5 font-signature text-sm">{t.signature}</span>
    </div>
  </div>
);

const MarqueeRow = ({ items, direction = "left", speed = 35 }: { items: any[], direction?: "left" | "right", speed?: number }) => (
  <div className="flex overflow-hidden select-none w-full py-4 relative">
    {/* Fade out edges */}
    <div className="absolute left-0 w-24 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
    <div className="absolute right-0 w-24 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
    
    <motion.div
      animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
      transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      className="flex shrink-0 gap-6 px-3 w-max items-stretch"
    >
      {[...items, ...items].map((t, idx) => (
        <TestimonialCard key={idx} t={t} />
      ))}
    </motion.div>
  </div>
);

export default function TestimonialSlider() {
  const { testimonials } = useData();

  const mockTestimonials = [
    { name: "Mahesh Pokale", role: "Web Designer", rating: 5, text: "Excellent photography and professional staff. Highly recommend Lemon Studio for all video results and photos.", signature: "Pokale M." },
    { name: "Sarah Johnson", role: "Product Manager", rating: 5, text: "Truly exceptional photography and design. They captured our brand's soul perfectly. A pleasure to work with.", signature: "S. Johnson" },
    { name: "John Doe", role: "UI/UX Lead", rating: 5, text: "Top quality design and coding. Strong attention to detail and highly collaborative throughout the project lifecycle.", signature: "J. Doe" },
    { name: "Priya Sharma", role: "Marketing Director", rating: 5, text: "Fantastic shoot! The team was very professional and delivered outstanding results for our latest campaign.", signature: "Priya S." },
    { name: "Michael Chen", role: "Creative Director", rating: 5, text: "The best visual storytellers we've ever worked with. The lighting and composition are always spot on.", signature: "M. Chen" },
    { name: "Emily White", role: "Artist", rating: 5, text: "Captured my art exhibition beautifully. Every shot reflects the energy of the show perfectly. Much appreciated!", signature: "Emily W." },
  ];

  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : mockTestimonials;

  // Split into two rows for the marquee effect
  const firstRow = displayTestimonials.slice(0, Math.ceil(displayTestimonials.length / 2));
  const secondRow = displayTestimonials.slice(Math.ceil(displayTestimonials.length / 2));

  return (
    <section id="testimonials" className="relative flex flex-col w-full items-center py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-6 mb-8 text-center">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-primary-orange font-bold tracking-[0.3em] text-[10px] sm:text-xs mb-2 uppercase inline-block"
        >
          Customer
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl md:text-3xl lg:text-5xl font-extrabold text-[#171717] leading-tight tracking-tight uppercase"
        >
          TESTIMONIALS
        </motion.h2>
      </div>

      <div className="w-full flex flex-col gap-3">
        {firstRow.length > 0 && <MarqueeRow items={firstRow} direction="left" speed={25} />}
        {secondRow.length > 0 && <MarqueeRow items={secondRow} direction="right" speed={30} />}
      </div>

      {/* Decorative gradients */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
    </section>
  );
}
