"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function FreeResetLibrary() {
  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-5xl mx-auto w-full pb-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-16"
      >
        <span className="text-xs uppercase tracking-widest text-brand-accent mb-6 block">Free Resource</span>
        <h1 className="text-5xl md:text-6xl font-serif text-brand-text mb-6">7-Day Emotional Reset</h1>
        <p className="text-brand-soft font-sans max-w-2xl mx-auto leading-relaxed">
          A gentle week-long journey delivered to your inbox. Designed to help you release the pressure of having everything figured out. Includes daily soft prompts, phone wallpapers, and a quiet audio meditation.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md mx-auto bg-brand-card p-12 rounded-2xl border border-brand-border shadow-sm"
      >
        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col text-left gap-2">
            <label className="text-xs uppercase tracking-widest opacity-60">First Name</label>
            <input 
              type="text" 
              placeholder="What should we call you?"
              className="bg-transparent border-b border-brand-border pb-2 outline-none focus:border-brand-accent transition-colors" 
            />
          </div>
          <div className="flex flex-col text-left gap-2 mb-4">
            <label className="text-xs uppercase tracking-widest opacity-60">Email Address</label>
            <input 
              type="email" 
              placeholder="Where should we send the reset?"
              className="bg-transparent border-b border-brand-border pb-2 outline-none focus:border-brand-accent transition-colors" 
            />
          </div>
          <button className="w-full py-4 bg-brand-text text-brand-bg hover:bg-brand-accent hover:text-white transition-colors duration-500 rounded-full text-sm tracking-widest uppercase">
            Start the Reset
          </button>
        </form>
        <p className="text-xs opacity-40 mt-6">By joining, you will also receive the bi-weekly Letters for Tired Hearts.</p>
      </motion.div>
    </div>
  );
}
