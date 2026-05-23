"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function DoneListClient() {
  const [items, setItems] = useState<{ id: string, text: string }[]>([]);
  const [input, setInput] = useState("");

  const preFilledSuggestions = [
    "I got out of bed.",
    "I drank a glass of water.",
    "I breathed.",
    "I survived until noon.",
    "I ate something.",
    "I washed my face."
  ];

  const addItem = (text: string) => {
    if (!text.trim()) return;
    setItems([{ id: Date.now().toString(), text }, ...items]);
    setInput("");
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addItem(input);
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center max-w-3xl mx-auto w-full px-6">
      
      <div className="text-4xl mb-6 grayscale opacity-50 mt-12">✅</div>
      <h2 className="font-serif text-2xl md:text-3xl text-brand-text mb-4 text-center">
        The "Done" List
      </h2>
      <p className="text-brand-soft text-sm text-center mb-12 max-w-lg">
        To-Do lists are for days when you have energy. On bad days, you use a Done List. Write down what you already accomplished today, no matter how small.
      </p>

      <div className="w-full grid md:grid-cols-2 gap-12">
        {/* Left: Input & Suggestions */}
        <div>
          <form onSubmit={handleManualAdd} className="flex gap-2 mb-8 bg-brand-card/50 p-2 rounded-xl border border-brand-border focus-within:border-brand-accent transition-colors">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="What did you do?"
              className="flex-1 bg-transparent border-none focus:outline-none text-brand-text px-4 py-2"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-6 bg-brand-text text-brand-bg rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-brand-accent transition-colors disabled:opacity-30 disabled:bg-brand-border disabled:text-brand-soft"
            >
              Add
            </button>
          </form>

          <h3 className="text-[10px] uppercase tracking-widest text-brand-soft mb-4">Bad Day Suggestions:</h3>
          <div className="flex flex-wrap gap-2">
            {preFilledSuggestions.map(s => (
              <button
                key={s}
                onClick={() => addItem(s)}
                className="px-4 py-2 border border-brand-border/50 bg-brand-bg rounded-full text-xs text-brand-soft hover:text-brand-text hover:border-brand-text transition-colors text-left"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>

        {/* Right: The Done List */}
        <div>
          <h3 className="text-[10px] uppercase tracking-widest text-brand-accent mb-6 border-b border-brand-border pb-2 flex justify-between items-center">
            <span>Already Completed ({items.length})</span>
            {items.length > 0 && <span className="text-xl">🏆</span>}
          </h3>
          
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {items.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="flex items-center gap-4 bg-brand-card p-4 rounded-xl border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.05)]"
                >
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-brand-text font-serif line-through opacity-70 decoration-green-500/50 decoration-2">
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            {items.length === 0 && (
              <p className="text-center text-brand-soft text-sm py-12 border border-brand-border/30 border-dashed rounded-xl italic">
                You've done something today. <br/> Even if it was just opening this app.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-20 mb-12">
        <Link
          href="/toolkit"
          className="px-6 py-2 border border-brand-border rounded-full text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors"
        >
          Back to Toolkit
        </Link>
      </div>

    </div>
  );
}
