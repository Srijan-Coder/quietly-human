"use client";

import { motion } from "framer-motion";

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0d0d0d]">
      {/* 
        Using pure CSS radial-gradients instead of blur-[150px]. 
        This is significantly lighter on mobile GPUs and completely eliminates lag/stuttering. 
      */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(252, 163, 17, 0.15) 0%, transparent 70%)' }}
      />
      
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[40%] -right-[10%] w-[50%] h-[70%] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(20, 33, 61, 0.2) 0%, transparent 70%)' }}
      />
      
      <motion.div
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute -bottom-[20%] left-[20%] w-[70%] h-[50%] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(229, 229, 229, 0.05) 0%, transparent 70%)' }}
      />
    </div>
  );
}
