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
    },
    overthinking: {
      message: "The mind gets loud when it's trying to protect you. Let's turn the volume down.",
      actionText: "Enter the Breathe Room",
      link: "/breathe",
    },
    tired: {
      message: "It is okay to rest. You don't have to carry it all today.",
      actionText: "Start the 7-Day Reset",
      link: "/reset",
    },
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-32 text-center">
      <h2 className="text-sm uppercase tracking-widest opacity-60 mb-8">How are you feeling tonight?</h2>
      
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
        <button
          onClick={() => setSelected("behind")}
          className={`px-6 py-3 rounded-full border transition-all duration-500 ${
            selected === "behind"
              ? "border-brand-accent bg-brand-accent text-white"
              : "border-brand-border text-brand-text hover:border-brand-accent"
          }`}
        >
          I feel behind
        </button>
        <button
          onClick={() => setSelected("overthinking")}
          className={`px-6 py-3 rounded-full border transition-all duration-500 ${
            selected === "overthinking"
              ? "border-brand-accent bg-brand-accent text-white"
              : "border-brand-border text-brand-text hover:border-brand-accent"
          }`}
        >
          I am overthinking
        </button>
        <button
          onClick={() => setSelected("tired")}
          className={`px-6 py-3 rounded-full border transition-all duration-500 ${
            selected === "tired"
              ? "border-brand-accent bg-brand-accent text-white"
              : "border-brand-border text-brand-text hover:border-brand-accent"
          }`}
        >
          I am just tired
        </button>
      </div>

      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-6"
          >
            <p className="font-serif text-2xl md:text-3xl text-balance text-brand-accent italic">
              "{content[selected].message}"
            </p>
            <Link
              href={content[selected].link}
              className="mt-4 border-b border-brand-text pb-1 text-sm uppercase tracking-widest hover:text-brand-accent hover:border-brand-accent transition-colors"
            >
              {content[selected].actionText}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
