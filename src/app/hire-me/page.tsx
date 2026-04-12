"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

export default function HireMePage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    whatsapp: "",
    address: "",
    shootType: "",
    description: "",
    shootDate: "",
    shootLocation: "",
    requirement: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Thank you! Your request has been sent.");
  };

  const inputClasses = "w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-[#FD853A] transition-colors placeholder:text-gray-400 shadow-sm";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6 sm:px-10">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link href="/" className="text-[#FD853A] hover:underline mb-6 inline-block flex items-center gap-2 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Book Your <span className="text-[#FD853A]">Shoot</span></h1>
          <p className="text-gray-600 text-lg max-w-2xl">Tell me about your vision, and let&apos;s create something extraordinary together. Fill out the details below to get started.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section 1: Personal Details */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#FAFAFA] border border-gray-200 p-8 rounded-2xl shadow-sm"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#FD853A]/10 text-[#FD853A] flex items-center justify-center text-sm font-bold">01</span>
              Personal Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className={labelClasses}>First Name</label>
                <input type="text" id="firstName" name="firstName" placeholder="John" required className={inputClasses} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="lastName" className={labelClasses}>Last Name</label>
                <input type="text" id="lastName" name="lastName" placeholder="Doe" required className={inputClasses} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="email" className={labelClasses}>Email ID</label>
                <input type="email" id="email" name="email" placeholder="john@example.com" required className={inputClasses} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="mobile" className={labelClasses}>Mobile No.</label>
                <input type="tel" id="mobile" name="mobile" placeholder="+91 00000 00000" className={inputClasses} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="whatsapp" className={labelClasses}>WhatsApp No.</label>
                <input type="tel" id="whatsapp" name="whatsapp" placeholder="+91 00000 00000" required className={inputClasses} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className={labelClasses}>Address</label>
                <textarea id="address" name="address" rows={2} placeholder="Your full address or city" className={inputClasses} onChange={handleChange}></textarea>
              </div>
            </div>
          </motion.section>

          {/* Section 2: Shoot Details */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-[#FAFAFA] border border-gray-200 p-8 rounded-2xl shadow-sm"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#FD853A]/10 text-[#FD853A] flex items-center justify-center text-sm font-bold">02</span>
              Shoot Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="shootType" className={labelClasses}>Shoot Type</label>
                <select id="shootType" name="shootType" required className={inputClasses} onChange={handleChange}>
                  <option value="" disabled selected>Select Shoot Type</option>
                  <option value="portrait">Portrait Photography</option>
                  <option value="wedding">Wedding / Event</option>
                  <option value="fashion">Fashion / Editorial</option>
                  <option value="commercial">Commercial / Product</option>
                  <option value="cinematic">Cinematic Videography</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="shootDate" className={labelClasses}>Preferred Shoot Date</label>
                <input type="date" id="shootDate" name="shootDate" required className={inputClasses} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="shootLocation" className={labelClasses}>Shoot Location</label>
                    <input type="text" id="shootLocation" name="shootLocation" placeholder="Studio, Outdoor, Specific City" required className={inputClasses} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="requirement" className={labelClasses}>Requirement</label>
                    <input type="text" id="requirement" name="requirement" placeholder="Indoor, Drone, High-speed, etc." className={inputClasses} onChange={handleChange} />
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="description" className={labelClasses}>Shoot Description</label>
                <textarea id="description" name="description" rows={4} placeholder="Describe your vision, theme, or any specific details..." required className={inputClasses} onChange={handleChange}></textarea>
              </div>
            </div>
          </motion.section>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center"
          >
            <button
              type="submit"
              className="px-12 py-4 bg-[#FD853A] text-white font-bold text-xl rounded-full hover:scale-105 transition-all shadow-lg hover:shadow-[#FD853A]/20 border border-white/10"
            >
              Submit Request
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
