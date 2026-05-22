"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Emotion = "behind" | "overthinking" | "tired" | null;

export function EmotionalPath() {
  const [selected, setSelected] = useState<Emotion>(null);

  const content = {
    behind: {
      message: "You are exactly where you need to be. Life is not a race, it's a quiet walk.",
      actionText: "Read: I Am Not Behind In Life",
      link: "/books",
  return (
    <section className="w-full max-w-4xl mx-auto px-6 py-24 border-t border-brand-border">
      <div className="text-center mb-12">
        <span className="text-xs uppercase tracking-widest text-brand-accent mb-4 block">Begin Here</span>
        <h2 className="text-3xl md:text-4xl font-serif text-brand-text">How are you feeling right now?</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link 
          href="/paths/behind"
          className="p-8 border border-brand-border rounded-2xl text-center hover:border-brand-accent hover:bg-brand-card transition-all duration-500 cursor-pointer group"
        >
          <span className="text-sm font-sans text-brand-text group-hover:text-brand-accent transition-colors">"I feel behind in life"</span>
        </Link>
        <Link 
          href="/paths/overthinking"
          className="p-8 border border-brand-border rounded-2xl text-center hover:border-brand-accent hover:bg-brand-card transition-all duration-500 cursor-pointer group"
        >
          <span className="text-sm font-sans text-brand-text group-hover:text-brand-accent transition-colors">"I am overthinking everything"</span>
        </Link>
        <Link 
          href="/paths/tired"
          className="p-8 border border-brand-border rounded-2xl text-center hover:border-brand-accent hover:bg-brand-card transition-all duration-500 cursor-pointer group"
        >
          <span className="text-sm font-sans text-brand-text group-hover:text-brand-accent transition-colors">"I am just deeply tired"</span>
        </Link>
      </div>
    </section>
  );
}
