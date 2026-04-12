"use client";

import { motion } from "framer-motion";
import { useData } from "@/context/DataContext";

const timelineItems = [
  {
    id: 1,
    year: "2020 - Present",
    role: "Senior Designer",
    company: "Studio",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis lacus nunc, posuere in justo vulputate."
  },
  {
    id: 2,
    year: "2016 - 2020",
    role: "Freelancer",
    company: "Self Employed",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis lacus nunc."
  },
  {
    id: 3,
    year: "2013 - 2016",
    role: "Design Lead",
    company: "Agency",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  }
];

export default function ExperienceSection() {
  const { resumeUrl } = useData();

  return (
    <section id="resume" className="w-full py-32 bg-white dark:bg-neutral-950 overflow-hidden relative">
      <div className="container mx-auto px-6 max-w-5xl">

        <div className="w-full flex flex-col items-center mb-20 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary-orange font-bold tracking-[0.3em] text-xs sm:text-sm mb-4 uppercase"
          >
            Resume
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-[#171717] leading-tight tracking-tight uppercase"
          >
            Professional <span className="text-primary-orange">Journey</span>
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "100px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1.5 bg-primary-orange mt-8 rounded-full"
          />
        </div>

        <div className="relative w-full">
          
          {/* Centered Dashed Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-neutral-200 dark:bg-neutral-800 -translate-x-1/2 border-dashed border-l-[2px]" />

          <div className="flex flex-col gap-12">
            {timelineItems.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center w-full relative"
                >
                  
                  {/* Left Column (Content or Empty) */}
                  <div className={`w-1/2 pr-8 flex ${isEven ? 'justify-end' : 'justify-start md:opacity-0 hidden md:block'}`}>
                     {isEven && (
                       <div className="flex flex-col items-end text-right">
                         <span className="text-primary-orange font-bold text-xl mb-1">{item.year}</span>
                         <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">{item.role}</h3>
                         <p className="text-neutral-500 font-medium mb-3">{item.company}</p>
                         <p className="text-neutral-600 dark:text-neutral-400 max-w-sm">
                           {item.description}
                         </p>
                       </div>
                     )}
                  </div>

                  {/* Center Dot */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-primary-orange border-4 border-white dark:border-neutral-950 z-10 shadow-[0_0_15px_rgba(253,133,58,0.5)]" />

                  {/* Right Column (Content or Empty) */}
                  <div className={`w-1/2 pl-8 flex ${!isEven ? 'justify-start' : 'justify-end md:opacity-0 hidden md:block'}`}>
                    {!isEven && (
                      <div className="flex flex-col items-start text-left">
                         <span className="text-primary-orange font-bold text-xl mb-1">{item.year}</span>
                         <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">{item.role}</h3>
                         <p className="text-neutral-500 font-medium mb-3">{item.company}</p>
                         <p className="text-neutral-600 dark:text-neutral-400 max-w-sm">
                           {item.description}
                         </p>
                      </div>
                    )}
                  </div>

                  {/* Mobile Fallback layout (the above is heavily desktop oriented, so let's ensure it flows nicely on mobile if possible, but centered line works okay down to iPad. For mobile, shift line to left) */}
                  {/* Wait, simple solution for mobile is to just use standard flex layout, but for exact visual clone, centered is what the reference does. */}
                </motion.div>
              )
            })}
          </div>

        </div>

        <div className="mt-20 flex justify-center">
          {resumeUrl && (
            <motion.a 
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 bg-[#171717] text-white px-10 py-5 rounded-[2rem] font-bold text-xl hover:bg-[#FD853A] transition-all shadow-xl hover:shadow-orange-500/20 group"
            >
              Download Full CV
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-1 transition-transform">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
            </motion.a>
          )}
        </div>
      </div>
    </section>
  );
}
