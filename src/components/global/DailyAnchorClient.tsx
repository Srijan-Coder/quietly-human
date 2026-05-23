"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DailyAnchorClient() {
  const [anchor, setAnchor] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedAnchor = localStorage.getItem("qh_daily_anchor");
    const savedDate = localStorage.getItem("qh_daily_anchor_date");
    const today = new Date().toDateString();

    if (savedAnchor && savedDate === today) {
      setAnchor(savedAnchor);
    } else {
      // Clear it if it's a new day
      localStorage.removeItem("qh_daily_anchor");
      localStorage.removeItem("qh_daily_anchor_date");
    }
  }, []);

  const handleSetAnchor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const word = inputValue.trim().toLowerCase();
    setAnchor(word);
    localStorage.setItem("qh_daily_anchor", word);
    localStorage.setItem("qh_daily_anchor_date", new Date().toDateString());
  };

  const handleReset = () => {
    setAnchor("");
    setInputValue("");
    localStorage.removeItem("qh_daily_anchor");
    localStorage.removeItem("qh_daily_anchor_date");
  };

  if (!isClient) return null; // prevent hydration mismatch

  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-6">
      {!anchor ? (
        <motion.div
          key="input"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex flex-col items-center"
        >
          <div className="text-4xl mb-8 grayscale opacity-50">🪨</div>
          <h2 className="font-serif text-2xl md:text-4xl text-brand-text mb-4 text-center text-balance">
            Set your daily anchor.
          </h2>
          <p className="text-brand-soft text-sm uppercase tracking-widest text-center mb-12">
            A single word to return to when the mind wanders.
          </p>
          
          <form onSubmit={handleSetAnchor} className="w-full max-w-xs flex flex-col items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g., breathe, focus, stillness"
              maxLength={20}
              className="w-full bg-transparent border-b border-brand-border/50 text-brand-text font-serif text-2xl p-4 focus:outline-none focus:border-brand-accent text-center placeholder:text-brand-soft/30 lowercase"
              autoFocus
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="mt-12 px-8 py-3 border border-brand-border rounded-full text-xs uppercase tracking-widest text-brand-soft hover:text-brand-accent hover:border-brand-accent transition-colors disabled:opacity-30 disabled:hover:border-brand-border disabled:hover:text-brand-soft"
            >
              Carve into stone
            </button>
          </form>
        </motion.div>
      ) : (
        <motion.div
          key="stone"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="flex flex-col items-center w-full"
        >
          <p className="text-brand-soft text-xs uppercase tracking-widest text-center mb-12">
            Your anchor for today
          </p>
          
          {/* The "Stone" debossed text effect */}
          <div className="w-full py-16 px-4 flex items-center justify-center bg-brand-bg/50 rounded-3xl border border-brand-border shadow-[inset_0_10px_30px_rgba(0,0,0,0.5)]">
            <h1 
              className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-center uppercase"
              style={{
                color: 'transparent',
                textShadow: '0px 2px 3px rgba(255,255,255,0.1), 0px -2px 3px rgba(0,0,0,0.8)',
                WebkitTextStroke: '1px rgba(0,0,0,0.3)',
              }}
            >
              {anchor}
            </h1>
          </div>

          <div className="mt-16 flex gap-4">
            <button
              onClick={handleReset}
              className="px-6 py-2 border border-brand-border rounded-full text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors"
            >
              Shatter & Reset
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
    </div>
  );
}
