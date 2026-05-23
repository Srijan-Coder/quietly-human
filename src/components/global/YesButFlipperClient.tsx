"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function YesButFlipperClient() {
  const [negativeThought, setNegativeThought] = useState("");
  const [positiveReframing, setPositiveReframing] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [stage, setStage] = useState<"writing_front" | "flipping">("writing_front");

  const handleFlip = () => {
    if (!negativeThought.trim()) return;
    setIsFlipped(true);
    setStage("flipping");
  };

  const handleReset = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setNegativeThought("");
      setPositiveReframing("");
      setStage("writing_front");
    }, 500); // wait for animation
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-6 perspective-1000">
      
      <div className="text-4xl mb-6 grayscale opacity-50">🃏</div>
      <h2 className="font-serif text-2xl md:text-3xl text-brand-text mb-4 text-center text-balance">
        The "Yes, But" Flipper
      </h2>
      <p className="text-brand-soft text-sm text-center mb-12">
        Black-and-white thinking ignores nuance. Write an absolute, negative thought. Then flip the card and force your brain to find the "but...".
      </p>

      {/* 3D Flipping Card Container */}
      <div className="relative w-full max-w-lg h-[350px] [perspective:1000px]">
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 50, damping: 15 }}
          className="w-full h-full relative [transform-style:preserve-3d]"
        >
          {/* Front of Card (Negative Thought) */}
          <div 
            className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-brand-card border border-brand-border rounded-2xl p-8 flex flex-col items-center justify-center shadow-lg"
          >
            <span className="text-[10px] uppercase tracking-widest text-brand-soft mb-8">The Absolute Thought</span>
            <textarea
              value={negativeThought}
              onChange={e => setNegativeThought(e.target.value)}
              placeholder="e.g. Yes, I completely ruined the presentation..."
              className="w-full bg-transparent border-b border-brand-border text-brand-text font-serif text-xl p-4 focus:outline-none focus:border-brand-accent text-center resize-none min-h-[120px]"
            />
            <button
              onClick={handleFlip}
              disabled={!negativeThought.trim()}
              className="mt-8 px-8 py-3 border border-brand-border rounded-full text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text hover:border-brand-text transition-colors disabled:opacity-30"
            >
              Flip Card
            </button>
          </div>

          {/* Back of Card (Reframing) */}
          <div 
            className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-brand-bg border-2 border-brand-accent rounded-2xl p-8 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(252,163,17,0.1)]"
          >
            <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-8">The Nuance</span>
            <div className="w-full flex items-start text-brand-text font-serif text-xl p-4 min-h-[120px]">
              <span className="mr-2 italic text-brand-accent">...But,</span>
              <textarea
                value={positiveReframing}
                onChange={e => setPositiveReframing(e.target.value)}
                placeholder="I still got the main point across and the client asked good questions."
                className="flex-1 bg-transparent border-b border-brand-accent/50 focus:outline-none focus:border-brand-accent resize-none min-h-[120px]"
                autoFocus={isFlipped}
              />
            </div>
            
            <AnimatePresence>
              {positiveReframing.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex gap-4 w-full justify-center"
                >
                  <button
                    onClick={handleReset}
                    className="px-6 py-2 border border-brand-border rounded-full text-[10px] uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors"
                  >
                    Write Another
                  </button>
                  <Link
                    href="/toolkit"
                    className="px-6 py-2 bg-brand-text text-brand-bg rounded-full text-[10px] uppercase tracking-widest hover:bg-brand-accent transition-colors"
                  >
                    Back to Toolkit
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
