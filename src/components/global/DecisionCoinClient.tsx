"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function DecisionCoinClient() {
  const [question, setQuestion] = useState("");
  const [stage, setStage] = useState<"asking" | "flipping" | "result">("asking");
  const [result, setResult] = useState<"Yes" | "No" | null>(null);

  const flipCoin = () => {
    if (!question.trim()) return;
    setStage("flipping");
    
    // Simulate physics/time
    setTimeout(() => {
      setResult(Math.random() > 0.5 ? "Yes" : "No");
      setStage("result");
    }, 3000);
  };

  const reset = () => {
    setQuestion("");
    setResult(null);
    setStage("asking");
  };

  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center max-w-xl mx-auto w-full px-6">
      <AnimatePresence mode="wait">
        
        {stage === "asking" && (
          <motion.div
            key="asking"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            className="w-full flex flex-col items-center"
          >
            <h2 className="font-serif text-2xl md:text-3xl text-brand-text mb-4 text-center text-balance">
              The Decision Coin
            </h2>
            <p className="text-brand-soft text-sm text-center mb-12 max-w-sm">
              For chronic overthinkers. Type your dilemma. The universe will give you a single answer. Commit to it.
            </p>
            
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Should I send the text?"
              className="w-full bg-transparent border-b border-brand-border/50 text-brand-text font-serif text-lg md:text-xl p-4 focus:outline-none focus:border-brand-accent text-center placeholder:text-brand-soft/50"
              autoFocus
            />

            <motion.button
              onClick={flipCoin}
              disabled={!question.trim()}
              className="mt-12 w-24 h-24 rounded-full border-2 border-brand-border text-xs uppercase tracking-widest text-brand-soft flex items-center justify-center hover:border-brand-accent hover:text-brand-accent transition-colors disabled:opacity-30 disabled:border-brand-border disabled:text-brand-soft"
              whileHover={{ scale: question.trim() ? 1.05 : 1 }}
              whileTap={{ scale: question.trim() ? 0.95 : 1 }}
            >
              Flip
            </motion.button>
          </motion.div>
        )}

        {stage === "flipping" && (
          <motion.div
            key="flipping"
            className="flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ 
                rotateY: [0, 1800], // Flips 5 times
                y: [0, -150, 0] // Tosses up and down
              }}
              transition={{ 
                duration: 3, 
                ease: "easeInOut"
              }}
              className="w-32 h-32 rounded-full border-4 border-[#fca311] bg-gradient-to-tr from-[#fca311]/20 to-[#fca311]/5 shadow-[0_0_50px_rgba(252,163,17,0.3)] flex items-center justify-center"
            >
              <div className="w-24 h-24 rounded-full border border-[#fca311]/30 opacity-50" />
            </motion.div>
            <p className="mt-12 text-brand-soft text-xs uppercase tracking-[0.3em] animate-pulse">
              Deciding...
            </p>
          </motion.div>
        )}

        {stage === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="flex flex-col items-center text-center"
          >
            <p className="text-brand-soft text-sm italic mb-8 max-w-sm px-6">
              "{question}"
            </p>
            
            <div className="w-40 h-40 rounded-full border-4 border-[#fca311] bg-gradient-to-tr from-[#fca311]/10 to-[#fca311]/5 shadow-[0_0_80px_rgba(252,163,17,0.2)] flex items-center justify-center mb-12">
              <span className="font-serif text-5xl text-[#fca311]">{result}</span>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={reset}
                className="px-6 py-2 border border-brand-border rounded-full text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors"
              >
                Ask Again
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
