"use client";

import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useData } from "@/context/DataContext";

export default function ContactSection({ hideHeader = false }: { hideHeader?: boolean }) {
  const { settings } = useData();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "",
    mobile: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Message sent! We will contact you soon.");
  };

  return (
    <section id="contact" className="w-full py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        {!hideHeader && (
          <div className="w-full flex flex-col items-center mb-20 text-center">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#FD853A] font-bold tracking-[0.3em] text-xs sm:text-sm mb-4 uppercase"
            >
              Contact
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-[#171717] leading-tight tracking-tight uppercase"
            >
              LET&apos;S <span className="text-[#FD853A]">CONNECT</span>
            </motion.h2>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "100px" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-1.5 bg-[#FD853A] mt-8 rounded-full"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side: Text and Info */}
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6">
              <h3 className="text-3xl font-bold text-[#171717]">
                Have a project in mind?<br />
                Let&apos;s create something <span className="text-[#FD853A]">extraordinary.</span>
              </h3>
              <p className="text-[#667085] text-lg leading-relaxed max-w-lg">
                Whether you have a detailed brief or just an idea on a napkin, I&apos;d love to hear about it. Let&apos;s find out how we can make your vision a reality.
              </p>
            </div>

            {/* Contact Details */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-[#F2F4F7] flex items-center justify-center transition-colors group-hover:bg-[#FD853A]/10">
                  <Mail className="w-5 h-5 text-[#FD853A]" />
                </div>
                <span className="text-[#475467] text-lg font-medium group-hover:text-[#171717] transition-colors">
                  {settings?.contactEmail || "rohit@rohitborana.com"}
                </span>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-[#F2F4F7] flex items-center justify-center transition-colors group-hover:bg-[#FD853A]/10">
                  <Phone className="w-5 h-5 text-[#FD853A]" />
                </div>
                <span className="text-[#475467] text-lg font-medium group-hover:text-[#171717] transition-colors">
                  {settings?.contactPhone || "+91 98765 43210"}
                </span>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-[#F2F4F7] flex items-center justify-center transition-colors group-hover:bg-[#FD853A]/10">
                  <MapPin className="w-5 h-5 text-[#FD853A]" />
                </div>
                <span className="text-[#475467] text-lg font-medium group-hover:text-[#171717] transition-colors">
                  {settings?.contactLocation || "Jodhpur, Rajasthan, India"}
                </span>
              </div>
            </div>

            <button className="flex items-center justify-center gap-2 w-fit bg-[#FD853A] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#e67a2e] transition-all shadow-lg hover:shadow-orange-500/20">
              Start a Conversation <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Side: Contact Form Card */}
          <div className="bg-[#171717] rounded-[32px] p-8 md:p-10 shadow-2xl shadow-black/10">
            <h3 className="text-2xl font-bold text-white mb-8">Send a Message</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#98A2B3]">NAME</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="bg-[#232323] border border-[#333333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FD853A] transition-colors placeholder:text-[#667085]"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#98A2B3]">EMAIL</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="bg-[#232323] border border-[#333333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FD853A] transition-colors placeholder:text-[#667085]"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#98A2B3]">PROJECT TYPE</label>
                <select
                  className="bg-[#232323] border border-[#333333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FD853A] transition-colors"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="" disabled>Select...</option>
                  <option value="Photography">Photography</option>
                  <option value="Videography">Videography</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#98A2B3]">MOBILE</label>
                <input
                  type="tel"
                  placeholder="Your mobile number"
                  className="bg-[#232323] border border-[#333333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FD853A] transition-colors placeholder:text-[#667085]"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#98A2B3]">MESSAGE</label>
                <textarea
                  rows={4}
                  placeholder="Describe your vision, timeline, and requirements..."
                  className="bg-[#232323] border border-[#333333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FD853A] transition-colors placeholder:text-[#667085] resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-[#FD853A] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#e67a2e] transition-all mt-4 flex items-center justify-center gap-2"
              >
                Send Message <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
