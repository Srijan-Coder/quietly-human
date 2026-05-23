"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function WorryDissolverClient() {
  const [text, setText] = useState("");
  const [stage, setStage] = useState<"typing" | "dissolving" | "released">("typing");

  const handleRelease = () => {
    if (!text.trim()) return;
    setStage("dissolving");

    // Wait for the dissolve animation to finish before showing the final message
    setTimeout(() => {
      setStage("released");
    }, 4000);
  };

  const reset = () => {
    setText("");
    setStage("typing");
  };

  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-6">
      <AnimatePresence mode="wait">
        
        {/* Stage 1: Typing */}
        {stage === "typing" && (
          <motion.div
            key="typing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: "blur(20px)", scale: 1.1, transition: { duration: 3, ease: "easeInOut" } }}
            className="w-full flex flex-col items-center"
          >
            <h2 className="font-serif text-2xl md:text-3xl text-brand-text mb-8 text-center text-balance">
              What is weighing heavy on your mind?
            </h2>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type it here. It will not be saved anywhere."
              className="w-full bg-transparent border-b border-brand-border/50 text-brand-text font-serif text-lg md:text-xl p-4 focus:outline-none focus:border-brand-accent resize-none min-h-[150px] text-center placeholder:text-brand-soft/50"
              autoFocus
            />
            <motion.button
              onClick={handleRelease}
              disabled={!text.trim()}
              className="mt-12 px-8 py-3 border border-brand-border rounded-full text-xs uppercase tracking-widest text-brand-soft hover:text-brand-accent hover:border-brand-accent transition-colors disabled:opacity-30 disabled:hover:border-brand-border disabled:hover:text-brand-soft"
              whileHover={{ scale: text.trim() ? 1.05 : 1 }}
              whileTap={{ scale: text.trim() ? 0.95 : 1 }}
            >
              Release
            </motion.button>
          </motion.div>
        )}

        {/* Stage 2 & 3: The Release Message */}
        {stage === "released" && (
          <motion.div
            key="released"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            <h2 className="font-serif text-3xl md:text-5xl text-brand-text mb-6">
              It has been released.
            </h2>
            <p className="text-brand-soft mb-12 uppercase tracking-widest text-xs">
              Take a deep breath.
            </p>
            <div className="flex gap-4">
              <button
                onClick={reset}
                className="px-6 py-2 border border-brand-border rounded-full text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors"
              >
                Start Over
              </button>
              <Link
                href="/toolkit"
                className="px-6 py-2 bg-brand-text text-brand-bg rounded-full text-xs uppercase tracking-widest hover:bg-brand-accent transition-colors"
              >
                Back to Toolkit
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
