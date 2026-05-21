"use client";

import { motion } from "framer-motion";
import AmbientParticles from "@/components/3d/AmbientParticles";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-20">
      <AmbientParticles />
      
      <div className="z-10 text-center max-w-4xl px-6 flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          className="text-sm uppercase tracking-[0.3em] mb-6 opacity-60 font-sans"
        >
          A Digital Sanctuary
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif text-balance tracking-tight mb-8"
        >
          You do not need to become someone else to belong here.
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.5 }}
          className="flex flex-col md:flex-row gap-6 mt-12"
        >
          <Link
            href="/books"
            className="px-8 py-4 bg-brand-charcoal text-brand-cream hover:bg-brand-gold transition-colors duration-500 rounded-full text-sm tracking-widest uppercase"
          >
            Read the Books
          </Link>
          <Link
            href="/blog"
            className="px-8 py-4 border border-brand-charcoal/30 hover:border-brand-charcoal transition-colors duration-500 rounded-full text-sm tracking-widest uppercase"
          >
            Quiet Thoughts
          </Link>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 2.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
      >
        <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
        <div className="w-[1px] h-12 bg-brand-charcoal opacity-30 animate-pulse" />
      </motion.div>
    </div>
  );
}
