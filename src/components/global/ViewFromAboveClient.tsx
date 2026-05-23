"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ViewFromAboveClient() {
  const [text, setText] = useState("");
  const [stage, setStage] = useState<"typing" | "room" | "city" | "globe" | "cosmos" | "complete">("typing");

  const startZoom = () => {
    if (!text.trim()) return;
    setStage("room");

    // Sequence the zoom out
    setTimeout(() => setStage("city"), 3000);
    setTimeout(() => setStage("globe"), 6000);
    setTimeout(() => setStage("cosmos"), 9000);
    setTimeout(() => setStage("complete"), 14000);
  };

  const reset = () => {
    setText("");
    setStage("typing");
  };

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center w-full px-6 overflow-hidden">
      
      {/* Background that darkens as we zoom out */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none"
        initial={{ backgroundColor: "var(--color-bg)" }}
        animate={{ 
          backgroundColor: 
            stage === "typing" || stage === "room" ? "var(--color-bg)" :
            stage === "city" ? "#0f172a" :
            stage === "globe" ? "#020617" : 
            "#000000"
        }}
        transition={{ duration: 3 }}
      />

      {/* Stars that appear in globe/cosmos stage */}
      <AnimatePresence>
        {(stage === "globe" || stage === "cosmos" || stage === "complete") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: stage === "cosmos" || stage === "complete" ? 1 : 0.3 }}
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "50px 50px",
              backgroundPosition: "0 0, 25px 25px"
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        
        {stage === "typing" && (
          <motion.div
            key="typing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="z-10 w-full flex flex-col items-center max-w-lg"
          >
            <div className="text-4xl mb-6 grayscale opacity-50">🔭</div>
            <h2 className="font-serif text-2xl md:text-3xl text-brand-text mb-4 text-center text-balance">
              The View From Above
            </h2>
            <p className="text-brand-soft text-sm text-center mb-12">
              Type the specific localized problem that feels massive right now.
            </p>

            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="e.g. I sent the email with a typo to my boss."
              className="w-full bg-brand-bg border border-brand-border rounded-xl px-6 py-4 text-brand-text font-serif text-lg focus:outline-none focus:border-brand-accent transition-colors min-h-[120px] text-center"
              autoFocus
            />

            <button
              onClick={startZoom}
              disabled={!text.trim()}
              className="mt-8 px-10 py-4 bg-brand-text text-brand-bg rounded-full text-xs uppercase tracking-widest hover:bg-brand-accent transition-colors disabled:opacity-30 disabled:bg-brand-card disabled:text-brand-soft"
            >
              Zoom Out
            </button>
          </motion.div>
        )}

        {/* The visual zoom sequence */}
        {(stage === "room" || stage === "city" || stage === "globe" || stage === "cosmos") && (
          <motion.div
            key="zoom"
            className="z-10 flex flex-col items-center justify-center h-[50vh]"
          >
            {/* The Dot representing the problem */}
            <motion.div
              animate={{ 
                scale: 
                  stage === "room" ? 1 :
                  stage === "city" ? 0.2 :
                  stage === "globe" ? 0.05 : 
                  0,
                opacity: stage === "cosmos" ? 0 : 1
              }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
              className="w-48 h-48 rounded-full border border-brand-accent/50 bg-brand-accent/10 flex items-center justify-center p-6 text-center backdrop-blur-sm"
            >
              <AnimatePresence>
                {(stage === "room") && (
                  <motion.p 
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-brand-text font-serif text-sm"
                  >
                    {text}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Scale Context Text */}
            <div className="absolute bottom-20 text-center w-full">
              <AnimatePresence mode="wait">
                {stage === "room" && <motion.p key="1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-brand-soft text-sm uppercase tracking-[0.3em]">Your immediate surroundings</motion.p>}
                {stage === "city" && <motion.p key="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-brand-soft text-sm uppercase tracking-[0.3em]">The city around you</motion.p>}
                {stage === "globe" && <motion.p key="3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[#a0c0e0] text-sm uppercase tracking-[0.3em]">The pale blue dot</motion.p>}
                {stage === "cosmos" && <motion.p key="4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-white text-sm uppercase tracking-[0.3em]">The vast, indifferent silence</motion.p>}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {stage === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="z-10 flex flex-col items-center text-center max-w-lg"
          >
            <h2 className="font-serif text-3xl md:text-5xl text-white mb-8 leading-snug">
              In the grand scheme of the cosmos, this moment is brief and survivable.
            </h2>
            <p className="text-[#aaa] mb-16 uppercase tracking-widest text-xs leading-relaxed">
              It feels big because it is close. <br/> From a distance, it is nothing.
            </p>
            <div className="flex gap-4">
              <button
                onClick={reset}
                className="px-6 py-2 border border-[#333] text-[#aaa] rounded-full text-xs uppercase tracking-widest hover:text-white transition-colors"
              >
                Reset
              </button>
              <Link
                href="/toolkit"
                className="px-6 py-2 bg-white text-black rounded-full text-xs uppercase tracking-widest hover:bg-[#ddd] transition-colors"
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
