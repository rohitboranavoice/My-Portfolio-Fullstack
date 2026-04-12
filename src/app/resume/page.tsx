"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function ResumePage() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResume() {
      try {
        const res = await fetch("/api/resume");
        const data = await res.json();
        setPdfUrl(data.pdfUrl);
      } catch (error) {
        console.error("Failed to fetch resume:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchResume();
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Header Info */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6"
      >
        <div>
          <h1 className="text-4xl lg:text-6xl font-bold text-[#1D2939]">
            My <span className="text-[#FD853A]">Resume</span>
          </h1>
          <p className="text-[#667085] mt-2 text-lg">Detailed professional background and expertise.</p>
        </div>
        <div className="flex gap-4">
          <a
            href={pdfUrl || "#"}
            download
            className={`px-8 py-4 bg-[#FD853A] text-white font-bold rounded-2xl shadow-lg hover:bg-[#e67a2e] transition-all ${!pdfUrl && "opacity-50 pointer-events-none"}`}
          >
            Download PDF
          </a>
        </div>
      </motion.div>

      {/* PDF Viewer Container */}
      <div className="w-full max-w-5xl flex-grow px-6 pb-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-[80vh] bg-white rounded-[32px] overflow-hidden shadow-2xl border border-gray-200 relative"
        >
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50">
              <Loader2 className="w-12 h-12 text-[#FD853A] animate-spin" />
              <p className="text-lg font-bold text-[#1D2939] mt-4">Loading Resume...</p>
            </div>
          ) : (
            <iframe 
              src={`${pdfUrl}#toolbar=0`} 
              className="w-full h-full border-none"
              title="Rohit Borana Resume"
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
