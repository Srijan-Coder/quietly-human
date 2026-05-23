"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Leaf {
  id: string;
  text: string;
  xOffset: number;
}

export default function LeavesOnStreamClient() {
  const [input, setInput] = useState("");
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  // Periodically clean up leaves that have floated away
  useEffect(() => {
    const interval = setInterval(() => {
      setLeaves(prev => {
        // We keep the last 15 to prevent memory leaks if left open for hours, 
        // but technically framer motion AnimatePresence handles unmounting if they exit,
        // but our animation just pushes them down infinitely. Let's just remove them after 20s.
        return prev.slice(-20);
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const addThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newLeaf: Leaf = {
      id: Date.now().toString(),
      text: input.trim(),
      xOffset: (Math.random() - 0.5) * 60 // Random starting position across the stream width
    };
    
    setLeaves([...leaves, newLeaf]);
    setInput("");
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center overflow-hidden w-full px-6">
      
      {/* The River Background */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center opacity-30">
        <div className="w-[300px] md:w-[500px] h-full bg-gradient-to-b from-brand-bg via-[#1a2c3a] to-brand-bg relative overflow-hidden">
          {/* Subtle water ripples */}
          <motion.div
            animate={{ y: [0, 1000] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(ellipse at center, #8ab4f8 0%, transparent 70%)",
              backgroundSize: "200px 300px",
              backgroundPosition: "0 0, 100px 150px"
            }}
          />
        </div>
      </div>

      <div className="z-10 w-full max-w-lg mt-12 flex flex-col items-center">
        <h2 className="font-serif text-2xl md:text-3xl text-brand-text mb-4 text-center">
          Leaves on a Stream
        </h2>
        <p className="text-brand-soft text-sm text-center mb-8">
          Type an intrusive thought. Do not judge it. Place it on a leaf, and watch it float away.
        </p>

        <form onSubmit={addThought} className="w-full flex gap-2 bg-brand-bg/80 backdrop-blur-md p-4 rounded-2xl border border-brand-border">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. I am going to fail."
            className="flex-1 bg-transparent text-brand-text placeholder:text-brand-soft/50 focus:outline-none text-sm"
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="text-brand-accent uppercase tracking-widest text-[10px] hover:text-brand-text transition-colors disabled:opacity-30"
          >
            Place on Leaf
          </button>
        </form>
        
        <Link href="/toolkit" className="mt-6 text-[10px] uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors">
          Leave the stream
        </Link>
      </div>

      {/* The Stream Area where leaves float */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center mt-48">
        <div className="w-[300px] md:w-[500px] h-full relative">
          <AnimatePresence>
            {leaves.map((leaf) => (
              <motion.div
                key={leaf.id}
                initial={{ opacity: 0, y: -50, x: `${leaf.xOffset}%`, rotate: -10 }}
                animate={{ 
                  opacity: [0, 1, 1, 0], 
                  y: [0, 300, 600, 1000],
                  x: [`${leaf.xOffset}%`, `${leaf.xOffset + 20}%`, `${leaf.xOffset - 10}%`, `${leaf.xOffset + 30}%`],
                  rotate: [-10, 15, -5, 20]
                }}
                transition={{ 
                  duration: 25, // Very slow, calming float
                  ease: "linear"
                }}
                onAnimationComplete={() => {
                  setLeaves(prev => prev.filter(l => l.id !== leaf.id));
                }}
                className="absolute top-0 left-1/2 -translate-x-1/2"
              >
                {/* SVG Leaf */}
                <div className="relative flex items-center justify-center">
                  <svg width="180" height="90" viewBox="0 0 180 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-20 drop-shadow-lg">
                    <path d="M10 45C10 45 60 10 90 10C120 10 170 45 170 45C170 45 120 80 90 80C60 80 10 45 10 45Z" fill="#81c995"/>
                    <path d="M10 45C10 45 60 10 90 10C120 10 170 45 170 45C170 45 120 80 90 80C60 80 10 45 10 45Z" stroke="#81c995" strokeWidth="2"/>
                    <path d="M90 10V80" stroke="#81c995" strokeWidth="2" strokeDasharray="4 4"/>
                  </svg>
                  {/* The Thought */}
                  <span className="absolute z-10 text-brand-text font-serif text-sm max-w-[140px] text-center text-balance">
                    {leaf.text}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
