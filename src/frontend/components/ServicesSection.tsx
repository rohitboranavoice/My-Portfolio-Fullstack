"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { servicesData as fallbackServicesData } from "@/frontend/data/servicesData";
import { useData } from "@/frontend/context/DataContext";

export default function ServicesSection() {
  const { services, loading } = useData();
  const displayServices = services.length > 0 ? services : fallbackServicesData;
  return (
    <section id="services" className="w-full py-32 bg-white relative z-10 rounded-[40px] mt-6 overflow-hidden">
      <div className="container mx-auto px-6 max-w-screen-2xl">
        <div className="w-full flex flex-col items-center mb-20 text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#1D2939] leading-tight tracking-tight uppercase max-w-4xl"
          >
            WHAT I <span className="text-[#FD853A]">OFFER</span>
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "100px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1.5 bg-[#FD853A] mt-8 rounded-full"
          />
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayServices.map((service, index) => (
            <motion.div
              key={service._id || service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group flex flex-col bg-[#FAFAFA] rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:border-[#FD853A]/30 transition-all duration-300"
            >
              {/* Top Cover Image */}
              <Link href={`/service/${service.serviceId || service.id}`} className="block relative h-56 w-full overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                  loading="lazy" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              {/* Card Content */}
              <div className="p-8 flex flex-col flex-1">
                <Link href={`/service/${service.serviceId || service.id}`}>
                  <h3 className="text-xl font-bold text-[#1D2939] mb-3 group-hover:text-[#FD853A] transition-colors uppercase tracking-wide">
                    {service.title}
                  </h3>
                </Link>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                  {service.description}
                </p>

                {/* Subcategories List */}
                <div className="pt-6 border-t border-gray-200">
                  <ul className="space-y-3">
                    {service.subcategories?.map((sub: any) => (
                      <li key={sub.id} className="flex items-start">
                        <span className="text-[#FD853A] mr-3 text-lg leading-4">•</span>
                        <Link 
                          href={`/service/${service.serviceId || service.id}`} 
                          className="text-[#1D2939] font-medium text-sm hover:text-[#FD853A] transition-colors"
                        >
                          {sub.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
