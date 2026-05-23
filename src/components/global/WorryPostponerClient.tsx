"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface PostponedWorry {
  id: string;
  text: string;
  time: string;
}

export default function WorryPostponerClient() {
  const [worry, setWorry] = useState("");
  const [time, setTime] = useState("");
  const [postponedWorries, setPostponedWorries] = useState<PostponedWorry[]>([]);
  const [stage, setStage] = useState<"writing" | "locked">("writing");

  const handlePostpone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!worry.trim() || !time) return;

    setPostponedWorries([
      ...postponedWorries,
      { id: Date.now().toString(), text: worry, time }
    ]);
    
    setStage("locked");
  };

  const handleReset = () => {
    setWorry("");
    setTime("");
    setStage("writing");
  };

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-6">
      
      <AnimatePresence mode="wait">
        
        {stage === "writing" && (
          <motion.div
            key="writing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full flex flex-col items-center max-w-lg"
          >
            <div className="text-4xl mb-6 grayscale opacity-50">📦</div>
            <h2 className="font-serif text-2xl md:text-3xl text-brand-text mb-4 text-center">
              The Worry Postponer
            </h2>
            <p className="text-brand-soft text-sm text-center mb-12">
              You are allowed to worry, just not right now. Schedule a 15-minute "Worry Window" for later today. Until then, the box is locked.
            </p>

            <form onSubmit={handlePostpone} className="w-full flex flex-col gap-6 bg-brand-card/50 p-8 rounded-2xl border border-brand-border shadow-lg">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-brand-soft block mb-2">What is bothering you?</label>
                <textarea
                  value={worry}
                  onChange={e => setWorry(e.target.value)}
                  placeholder="e.g. I'm afraid I offended Sarah with my email..."
                  className="w-full bg-transparent border-b border-brand-border text-brand-text font-serif text-lg p-2 focus:outline-none focus:border-brand-accent min-h-[100px] resize-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-brand-soft block mb-2">When will you worry about this?</label>
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-border rounded-lg p-4 text-brand-text focus:outline-none focus:border-brand-accent"
                />
              </div>

              <button
                type="submit"
                disabled={!worry.trim() || !time}
                className="mt-4 w-full py-4 bg-brand-text text-brand-bg rounded-full text-xs uppercase tracking-widest hover:bg-brand-accent transition-colors disabled:opacity-30 disabled:bg-brand-card disabled:text-brand-soft"
              >
                Lock it in the box
              </button>
            </form>

            {postponedWorries.length > 0 && (
              <div className="w-full mt-12">
                <h3 className="text-[10px] uppercase tracking-widest text-brand-soft mb-4 border-b border-brand-border pb-2">Currently Locked Boxes</h3>
                <div className="flex flex-col gap-2">
                  {postponedWorries.map(pw => (
                    <div key={pw.id} className="flex justify-between items-center bg-brand-card p-4 rounded-lg border border-brand-border border-dashed">
                      <span className="text-brand-soft text-sm font-serif italic truncate flex-1 mr-4">"{pw.text.substring(0, 30)}..."</span>
                      <span className="text-[10px] uppercase tracking-widest text-brand-accent px-3 py-1 bg-brand-accent/10 rounded-full flex shrink-0 items-center gap-2">
                        🔒 Until {pw.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {stage === "locked" && (
          <motion.div
            key="locked"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center max-w-md w-full"
          >
            <motion.div 
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="text-6xl mb-8"
            >
              🔒
            </motion.div>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-text mb-6 leading-tight">
              Worry Postponed.
            </h2>
            <p className="text-brand-soft mb-12 text-sm leading-relaxed">
              Your brain is free to let this go until {time}. If the thought arises before then, remind yourself: "I have an appointment to think about this later."
            </p>

            <div className="flex gap-4">
              <button
                onClick={handleReset}
                className="px-6 py-2 border border-brand-border rounded-full text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors"
              >
                Postpone Another
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
