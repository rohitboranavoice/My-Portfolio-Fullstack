"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useNavbar } from "@/context/NavbarContext";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "RB", href: "/" },
  { name: "Service", href: "/service" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { setIsLogoHovered, isBrandingRevealed, setIsBrandingRevealed } = useNavbar();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="absolute left-0 right-0 z-[100] flex justify-center px-4 transition-all duration-500 top-6 scale-100">
      <motion.div 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`
          relative w-full max-w-[1200px] h-[75px] lg:h-[85px] 
          bg-[#171717] border border-white/10 
          text-white rounded-full flex items-center transition-all duration-300
          shadow-[0_20px_50px_rgba(0,0,0,0.3)]
          border-white/20
        `}
      >
        {/* Unified distributed layout for perfect spacing */}
        <div className="flex items-center justify-between w-full h-full px-2 lg:px-3">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            const isLogo = item.name === "RB";
            const isContact = item.name === "Contact";

            if (isLogo) {
              return (
                <div 
                  key={item.name}
                  onMouseEnter={() => {
                    setIsLogoHovered(true);
                    setIsBrandingRevealed(true);
                  }}
                  onMouseLeave={() => {
                    setIsLogoHovered(false);
                    setIsBrandingRevealed(false);
                  }}
                  className="flex flex-col items-center justify-center cursor-pointer hover:scale-110 transition-all duration-500 group mx-2"
                >
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#FD853A] rounded-full flex items-center justify-center border-2 border-white/20 shadow-md relative overflow-hidden group-hover:shadow-[0_0_20px_rgba(253,133,58,0.5)]">
                    <span className="text-white font-bold text-sm lg:text-base transition-transform duration-300 group-hover:scale-110">RB</span>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  transition-all duration-500 font-bold whitespace-nowrap flex items-center justify-center h-full
                  ${isActive 
                    ? 'bg-[#FD853A] text-white px-8 lg:px-12 rounded-full shadow-lg text-sm lg:text-base h-[45px] lg:h-[55px] my-auto scale-105' 
                    : 'text-gray-300 hover:text-white text-sm lg:text-base translate-y-[-1px]'
                  }
                  ${isContact ? 'pr-4 lg:pr-6' : ''}
                  ${index === 0 ? 'ml-4 lg:ml-6' : ''}
                `}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </motion.div>
    </nav>
  );
}
