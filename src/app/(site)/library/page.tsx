"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function LibraryPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
  };

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full pb-24">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mb-20 text-center"
      >
        <h1 className="text-5xl md:text-6xl font-serif text-brand-text mb-6">The Library</h1>
        <p className="text-brand-soft font-sans max-w-2xl mx-auto leading-relaxed">
          An archive of digital spaces, books, quotes, and reflections designed for quiet growth and soft living.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 1 }} className="group">
          <Link href="/books" className="block">
            <div className="aspect-[16/9] w-full bg-brand-card rounded-2xl border border-brand-border flex items-center justify-center mb-6 group-hover:border-brand-accent transition-colors duration-500 overflow-hidden relative">
              <span className="font-serif text-3xl opacity-50 group-hover:scale-105 transition-transform duration-1000">Books & Journals</span>
            </div>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1 }} className="group">
          <Link href="/products" className="block">
            <div className="aspect-[16/9] w-full bg-brand-card rounded-2xl border border-brand-border flex items-center justify-center mb-6 group-hover:border-brand-accent transition-colors duration-500 overflow-hidden relative">
              <span className="font-serif text-3xl opacity-50 group-hover:scale-105 transition-transform duration-1000">Digital Dashboards</span>
            </div>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }} className="group">
          <Link href="/blog" className="block">
            <div className="aspect-[16/9] w-full bg-brand-card rounded-2xl border border-brand-border flex items-center justify-center mb-6 group-hover:border-brand-accent transition-colors duration-500 overflow-hidden relative">
              <span className="font-serif text-3xl opacity-50 group-hover:scale-105 transition-transform duration-1000">Quiet Thoughts</span>
            </div>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }} className="group">
          <Link href="/quotes" className="block">
            <div className="aspect-[16/9] w-full bg-brand-card rounded-2xl border border-brand-border flex items-center justify-center mb-6 group-hover:border-brand-accent transition-colors duration-500 overflow-hidden relative">
              <span className="font-serif text-3xl opacity-50 group-hover:scale-105 transition-transform duration-1000">Quote Gallery</span>
            </div>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
