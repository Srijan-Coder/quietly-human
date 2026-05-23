"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function BrainDumpClient() {
  const [text, setText] = useState("");
  const [stage, setStage] = useState<"typing" | "wiping" | "cleared">("typing");

  const handleWipe = () => {
    if (!text.trim()) return;
    setStage("wiping");

    setTimeout(() => {
      setText("");
      setStage("cleared");
    }, 2000);
  };

  const reset = () => {
    setText("");
    setStage("typing");
  };

  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center max-w-3xl mx-auto w-full px-6">
      <AnimatePresence mode="wait">
        
        {stage === "typing" && (
          <motion.div
            key="typing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
            transition={{ duration: 0.8 }}
            className="w-full flex flex-col items-center"
          >
            <h2 className="font-serif text-2xl md:text-3xl text-brand-text mb-4 text-center text-balance">
              The Brain Dump
            </h2>
            <p className="text-brand-soft text-sm text-center mb-12 max-w-lg">
              Type everything that is overwhelming you. It blurs out instantly so you don't have to reread your own toxic thoughts. Once you click Wipe, it is permanently erased.
            </p>
            
            <div className="relative w-full">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Start typing..."
                className="w-full bg-brand-card/50 border border-brand-border/50 text-brand-text font-serif text-lg md:text-xl p-8 focus:outline-none focus:border-brand-accent resize-none min-h-[250px] rounded-2xl shadow-inner placeholder:text-brand-soft/50"
                autoFocus
                style={{
                  color: "transparent",
                  textShadow: text.length > 0 ? "0 0 15px rgba(224, 224, 224, 0.8)" : "none",
                  caretColor: "#fca311"
                }}
              />
            </div>

            <motion.button
              onClick={handleWipe}
              disabled={!text.trim()}
              className="mt-12 px-10 py-4 bg-brand-text text-brand-bg rounded-full text-xs uppercase tracking-widest hover:bg-brand-accent transition-colors disabled:opacity-30 disabled:bg-brand-card disabled:text-brand-soft"
              whileHover={{ scale: text.trim() ? 1.05 : 1 }}
              whileTap={{ scale: text.trim() ? 0.95 : 1 }}
            >
              Wipe Clean
            </motion.button>
          </motion.div>
        )}

        {stage === "cleared" && (
          <motion.div
            key="cleared"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            <h2 className="font-serif text-3xl md:text-5xl text-brand-text mb-6">
              It is gone.
            </h2>
            <p className="text-brand-soft mb-12 uppercase tracking-widest text-xs">
              The noise has been cleared.
            </p>
            <div className="flex gap-4">
              <button
                onClick={reset}
                className="px-6 py-2 border border-brand-border rounded-full text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors"
              >
                Dump More
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
