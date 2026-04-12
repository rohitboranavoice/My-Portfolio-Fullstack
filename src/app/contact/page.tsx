"use client";

import ContactSection from "@/components/ContactSection";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="pt-32 pb-20">
      
      <ContactSection hideHeader={false} />
    </div>
  );
}
