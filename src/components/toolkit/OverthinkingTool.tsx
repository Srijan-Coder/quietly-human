"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function OverthinkingTool() {
  const [thought, setThought] = useState("");
  const [stage, setStage] = useState<"typing" | "releasing" | "released">("typing");

  const handleRelease = () => {
    if (!thought.trim()) return;
    setStage("releasing");
    
    // After 4 seconds of animation, switch to released state
    setTimeout(() => {
      setStage("released");
    }, 4000);
  };

  const reset = () => {
    setThought("");
    setStage("typing");
  };

  return (
    <div className="w-full max-w-2xl mx-auto min-h-[400px] flex flex-col items-center justify-center relative bg-brand-card border border-brand-border rounded-3xl p-8 md:p-16 shadow-sm overflow-hidden">
      <AnimatePresence mode="wait">
        
        {stage === "typing" && (
          <motion.div
            key="typing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
            transition={{ duration: 1 }}
            className="w-full flex flex-col items-center"
          >
            <h3 className="font-serif text-2xl text-brand-text mb-6 text-center text-balance">
              What is the thought that keeps looping in your mind right now?
            </h3>
            <textarea
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="Type it here. No one will see it..."
              className="w-full bg-brand-bg border border-brand-border rounded-2xl p-6 text-brand-text placeholder:text-brand-soft/50 focus:outline-none focus:border-brand-accent transition-colors resize-none min-h-[150px] font-sans text-lg"
            />
            <button
              onClick={handleRelease}
              disabled={!thought.trim()}
              className="mt-8 px-8 py-4 bg-brand-text text-brand-bg rounded-full text-xs tracking-widest uppercase hover:bg-brand-accent hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-brand-text disabled:hover:text-brand-bg"
            >
              Release this thought
            </button>
          </motion.div>
        )}

        {stage === "releasing" && (
          <motion.div
            key="releasing"
            className="w-full text-center flex items-center justify-center relative min-h-[200px]"
          >
            <motion.p
              initial={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              animate={{ 
                opacity: 0, 
                filter: "blur(20px)", 
                y: -50,
                scale: 1.1 
              }}
              transition={{ duration: 4, ease: "easeOut" }}
              className="text-brand-soft text-xl font-serif italic text-balance absolute"
            >
              "{thought}"
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 4, ease: "easeInOut" }}
              className="absolute inset-0 bg-brand-accent/5 rounded-full blur-[50px]"
            />
          </motion.div>
        )}

        {stage === "released" && (
          <motion.div
            key="released"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-brand-accent/10 flex items-center justify-center mb-8">
              <span className="text-2xl">🕊️</span>
            </div>
            <h3 className="font-serif text-3xl md:text-4xl text-brand-text mb-6">
              It is gone.
            </h3>
            <p className="text-brand-soft text-lg mb-12 max-w-md leading-relaxed text-balance">
              You do not have to hold onto every thought that enters your mind. Some thoughts are just passing clouds. Let them drift.
            </p>
            <button
              onClick={reset}
              className="text-xs tracking-widest uppercase text-brand-soft hover:text-brand-accent transition-colors border-b border-transparent hover:border-brand-accent pb-1"
            >
              Release another thought
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
