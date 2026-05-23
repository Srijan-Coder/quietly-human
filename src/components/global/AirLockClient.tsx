"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AirLockClient() {
  const [stage, setStage] = useState<"ready" | "transitioning" | "done">("ready");
  const [progress, setProgress] = useState(0);
  const [promptIndex, setPromptIndex] = useState(0);

  const prompts = [
    "Close your work tabs.",
    "Acknowledge what you accomplished today.",
    "Forgive what you left unfinished.",
    "The work day is over.",
    "You are entering rest mode."
  ];

  useEffect(() => {
    if (stage === "transitioning") {
      // 2 minute transition (120 seconds)
      // We'll update progress every 100ms
      const totalTime = 120000;
      const interval = 100;
      const step = 100 / (totalTime / interval);
      
      const timer = setInterval(() => {
        setProgress(p => {
          if (p + step >= 100) {
            clearInterval(timer);
            setStage("done");
            return 100;
          }
          return p + step;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [stage]);

  // Update text prompts based on progress percentage
  useEffect(() => {
    if (progress < 20) setPromptIndex(0);
    else if (progress < 40) setPromptIndex(1);
    else if (progress < 60) setPromptIndex(2);
    else if (progress < 80) setPromptIndex(3);
    else setPromptIndex(4);
  }, [progress]);

  const startTransition = () => {
    setStage("transitioning");
    setProgress(0);
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center w-full px-6 overflow-hidden transition-colors duration-1000"
         style={{ backgroundColor: stage === "transitioning" ? `rgba(15, 23, 42, ${progress / 100})` : stage === "done" ? "#020617" : "transparent" }}>
      
      <AnimatePresence mode="wait">
        
        {stage === "ready" && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            className="z-10 w-full flex flex-col items-center max-w-lg"
          >
            <div className="text-4xl mb-6 grayscale opacity-50">🚪</div>
            <h2 className="font-serif text-2xl md:text-3xl text-brand-text mb-4 text-center">
              The Air Lock
            </h2>
            <p className="text-brand-soft text-sm text-center mb-12">
              A digital decompression chamber. Don't carry work stress into your evening. Enter the air lock for a 2-minute guided transition.
            </p>

            <button
              onClick={startTransition}
              className="px-10 py-4 border border-brand-border text-brand-text rounded-full text-xs uppercase tracking-widest hover:bg-brand-text hover:text-brand-bg transition-colors"
            >
              Enter Air Lock
            </button>
          </motion.div>
        )}

        {stage === "transitioning" && (
          <motion.div
            key="transitioning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="z-10 flex flex-col items-center justify-center w-full max-w-2xl"
          >
            <div className="w-48 h-48 relative flex items-center justify-center mb-16">
              {/* Glowing progress ring */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="90"
                  fill="transparent"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="2"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="90"
                  fill="transparent"
                  stroke="#fca311"
                  strokeWidth="2"
                  strokeDasharray={2 * Math.PI * 90}
                  strokeDashoffset={2 * Math.PI * 90 * (1 - progress / 100)}
                  className="transition-all duration-100 ease-linear drop-shadow-[0_0_15px_rgba(252,163,17,0.5)]"
                />
              </svg>
              
              <div className="absolute text-brand-soft font-serif text-2xl">
                {Math.floor(120 - (progress / 100) * 120)}s
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.h2
                key={promptIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 1 }}
                className="font-serif text-2xl md:text-4xl text-white text-center tracking-wide"
              >
                {prompts[promptIndex]}
              </motion.h2>
            </AnimatePresence>
          </motion.div>
        )}

        {stage === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="z-10 flex flex-col items-center text-center"
          >
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-8">
              Decompression Complete.
            </h2>
            <p className="text-[#aaa] mb-12 uppercase tracking-widest text-xs">
              Close the laptop. Go rest.
            </p>
            
            <Link
              href="/toolkit"
              className="px-6 py-2 border border-[#333] text-[#aaa] rounded-full text-xs uppercase tracking-widest hover:text-white transition-colors"
            >
              Back to Toolkit
            </Link>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
