"use client";

import { motion } from "framer-motion";

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Soft animated gradient blobs. Animations are limited to opacity to prevent GPU lag with heavy blurs */}
      <motion.div
        animate={{ opacity: [0.03, 0.08, 0.03] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-brand-accent blur-[120px]"
      />
      
      <motion.div
        animate={{ opacity: [0.02, 0.05, 0.02] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[40%] -right-[10%] w-[50%] h-[70%] rounded-full bg-brand-blue blur-[150px]"
      />
      
      <motion.div
        animate={{ opacity: [0.02, 0.06, 0.02] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute -bottom-[20%] left-[20%] w-[70%] h-[50%] rounded-full bg-brand-muted blur-[100px]"
      />
    </div>
  );
}
