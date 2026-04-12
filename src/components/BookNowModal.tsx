"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { useState } from "react";

interface BookNowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookNowModal({ isOpen, onClose }: BookNowModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2rem] overflow-hidden shadow-2xl"
          >
            <div className="p-8 sm:p-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-[#1D2939]">Book Your Shoot</h2>
                  <p className="text-[#667085] mt-1">Tell us about your event and we&apos;ll get back to you.</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-[#667085]" />
                </button>
              </div>

              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Send className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1D2939]">Booking Received!</h3>
                  <p className="text-[#667085] mt-2">We will contact you shortly to confirm the details.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[#344054]">Full Name</label>
                    <input required type="text" placeholder="John Doe" className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FD853A]/20 focus:border-[#FD853A] transition-all" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[#344054]">Email Id</label>
                    <input required type="email" placeholder="john@example.com" className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FD853A]/20 focus:border-[#FD853A] transition-all" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[#344054]">Mobile Number</label>
                    <input required type="tel" placeholder="+91 ..." className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FD853A]/20 focus:border-[#FD853A] transition-all" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[#344054]">WhatsApp Number</label>
                    <input required type="tel" placeholder="+91 ..." className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FD853A]/20 focus:border-[#FD853A] transition-all" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[#344054]">Event Type</label>
                    <select required className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FD853A]/20 focus:border-[#FD853A] transition-all bg-white">
                      <option value="">Select Type</option>
                      <option>Wedding</option>
                      <option>Portrait</option>
                      <option>Commercial</option>
                      <option>Event</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[#344054]">Event Date</label>
                    <input required type="date" className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FD853A]/20 focus:border-[#FD853A] transition-all" />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-[#344054]">Event Location</label>
                    <input required type="text" placeholder="Venue, City" className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FD853A]/20 focus:border-[#FD853A] transition-all" />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-[#344054]">Shoot Requirement</label>
                    <textarea placeholder="Describe what you need..." rows={3} className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FD853A]/20 focus:border-[#FD853A] transition-all resize-none" />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="md:col-span-2 w-full py-4 mt-4 bg-[#FD853A] text-white font-bold text-xl rounded-xl shadow-lg shadow-[#FD853A]/30 hover:bg-[#ff9d5c] transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Submit Booking
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
