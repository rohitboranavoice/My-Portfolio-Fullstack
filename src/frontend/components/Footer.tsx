"use client";

import Link from "next/link";
import { Instagram, Twitter, Youtube, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { usePathname } from "next/navigation";
import { servicesData as fallbackServicesData } from "@/frontend/data/servicesData";
import { useData } from "@/frontend/context/DataContext";

export default function Footer() {
  const pathname = usePathname();
  const { services, settings } = useData();
  const displayServices = services.length > 0 ? services : fallbackServicesData;
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="w-[98%] mx-auto bg-[#171717] rounded-[30px] pt-12 pb-10 px-6 sm:px-10 lg:px-16 text-white mt-12 mb-8 overflow-hidden shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-white/10 pb-10">
        {/* Brand Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FD853A] rounded-full flex items-center justify-center font-bold text-xl transition-transform hover:scale-110">
              RB
            </div>
            <span className="text-2xl font-bold tracking-tighter">
              ROHIT<span className="text-[#FD853A]">BORANA</span>
            </span>
          </div>
          <p className="text-gray-400 max-w-xs leading-relaxed text-sm">
            Capturing the most precious moments of your life with a cinematic and storytelling approach. 
          </p>
          <div className="flex gap-4">
            {[
              { Icon: Instagram, link: settings?.instagram },
              { Icon: Twitter, link: settings?.twitter },
              { Icon: Youtube, link: settings?.youtube },
              { Icon: Facebook, link: settings?.facebook }
            ].filter(item => item.link).map((item, idx) => (
              <a 
                key={idx} 
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#FD853A] hover:border-[#FD853A] transition-all duration-300"
              >
                <item.Icon size={18} />
              </a>
            ))}
            {(!settings?.instagram && !settings?.twitter && !settings?.youtube && !settings?.facebook) && (
               [Instagram, Twitter, Youtube, Facebook].map((Icon, idx) => (
                <div key={idx} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-600">
                  <Icon size={18} />
                </div>
               ))
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-6">
          <h3 className="text-lg font-bold">Quick Links</h3>
          <ul className="flex flex-col gap-3 text-gray-400 text-sm">
            <li><Link href="/" className="hover:text-[#FD853A] transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-[#FD853A] transition-colors">About Me</Link></li>
            <li><Link href="/service" className="hover:text-[#FD853A] transition-colors">Services</Link></li>
            <li><Link href="/portfolio" className="hover:text-[#FD853A] transition-colors">Portfolio</Link></li>
            <li><Link href="/#contact" className="hover:text-[#FD853A] transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div className="flex flex-col gap-6">
          <h3 className="text-lg font-bold">Our Services</h3>
          <ul className="flex flex-col gap-3 text-gray-400 text-sm">
            {displayServices.map((service) => (
              <li key={service._id || service.id}>
                <Link href={`/service/${service.serviceId || service.id}`} className="hover:text-[#FD853A] transition-colors relative flex items-center group/link">
                  <span className="w-1.5 h-1.5 bg-[#FD853A] rounded-full mr-2 opacity-0 group-hover/link:opacity-100 transition-opacity"></span>
                  <span className="group-hover/link:translate-x-1 transition-transform">{service.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-6">
          <h3 className="text-lg font-bold">Get In Touch</h3>
          <ul className="flex flex-col gap-4 text-gray-400 text-sm">
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-[#FD853A]" />
              <span>{settings?.contactEmail || "rohit@rohitborana.com"}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-[#FD853A]" />
              <span>{settings?.contactPhone || "+91 98765 43210"}</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin size={16} className="text-[#FD853A]" />
              <span>{settings?.contactLocation || "Jodhpur, Rajasthan, India"}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-[12px] uppercase tracking-wider">
        <p>© 2024 Rohit Borana. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
