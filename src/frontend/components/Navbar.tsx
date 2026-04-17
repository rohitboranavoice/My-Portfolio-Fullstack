"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useNavbar } from "@/frontend/context/NavbarContext";
import { Menu, X } from "lucide-react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <>
      <nav className="absolute left-0 right-0 z-[100] flex justify-center px-4 transition-all duration-500 top-6 scale-100">
        <motion.div 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`
            relative w-full max-w-[1200px] h-[65px] lg:h-[85px] 
            bg-[#171717] border border-white/10 
            text-white rounded-full flex items-center justify-between lg:justify-center transition-all duration-300
            shadow-[0_20px_50px_rgba(0,0,0,0.3)]
            px-4 lg:px-2
          `}
        >
          {/* Mobile Logo & Hamburger Layout */}
          <div className="flex items-center justify-between w-full lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#FD853A] rounded-full flex items-center justify-center border-2 border-white/20 shadow-md">
                <span className="text-white font-bold text-sm">RB</span>
              </div>
            </Link>
            
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-white p-2 focus:outline-none"
            >
              <Menu size={28} />
            </button>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-evenly w-full h-full lg:px-3">
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
                    <div className="w-12 h-12 bg-[#FD853A] rounded-full flex items-center justify-center border-2 border-white/20 shadow-md relative overflow-hidden group-hover:shadow-[0_0_20px_rgba(253,133,58,0.5)]">
                      <span className="text-white font-bold text-base transition-transform duration-300 group-hover:scale-110">RB</span>
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
                      ? 'bg-[#FD853A] text-white px-6 lg:px-8 rounded-full shadow-lg text-xs lg:text-sm h-[40px] lg:h-[48px] my-auto scale-105' 
                      : 'text-gray-300 hover:text-white text-xs lg:text-sm translate-y-[-1px]'
                    }
                    ${isContact ? 'pr-4 lg:pr-5' : ''}
                    ${index === 0 ? 'ml-4 lg:ml-5' : ''}
                  `}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </motion.div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[200] bg-[#171717]/95 backdrop-blur-md flex flex-col items-center justify-center lg:hidden"
          >
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-8 right-8 text-white p-2"
            >
              <X size={32} />
            </button>
            <div className="flex flex-col items-center gap-6">
              {navItems.filter(item => item.name !== "RB").map((item) => {
                 const isActive = pathname === item.href;
                 return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-2xl font-bold tracking-wider transition-colors ${
                      isActive ? 'text-[#FD853A]' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                 )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
