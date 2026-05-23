"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Candle {
  id: number;
  x: number;
  y: number;
  opacity: number;
  size: number;
}

export default function ThreeAMRoom() {
  const [activeUsers, setActiveUsers] = useState(0);
  const [candles, setCandles] = useState<Candle[]>([]);

  // The Algorithmic "Live" Counter
  useEffect(() => {
    // Generate a realistic base number based on the hour of the day
    // More people at night (8pm - 4am), fewer during the day
    const calculateBaseUsers = () => {
      const hour = new Date().getHours();
      let base = 40; // baseline
      if (hour >= 20 || hour <= 4) base = 120; // peak night
      if (hour > 4 && hour < 8) base = 15; // early morning slump
      return base + Math.floor(Math.random() * 20);
    };

    let currentUserCount = calculateBaseUsers();
    setActiveUsers(currentUserCount);

    // Fluctuate the number every 5-15 seconds
    const interval = setInterval(() => {
      const change = Math.floor(Math.random() * 5) - 2; // -2, -1, 0, 1, 2
      currentUserCount = Math.max(5, currentUserCount + change);
      setActiveUsers(currentUserCount);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Fade out candles over time
  useEffect(() => {
    const interval = setInterval(() => {
      setCandles(prev => 
        prev.map(c => ({ ...c, opacity: c.opacity - 0.05 }))
            .filter(c => c.opacity > 0)
      );
    }, 2000); // Reduce opacity every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const leaveCandle = () => {
    // Prevent spamming too many candles
    if (candles.length > 30) return;

    // Random position within central bounds
    const x = 5 + Math.random() * 90; // 5% to 95%
    const y = 5 + Math.random() * 90; // 5% to 95%
    
    const newCandle: Candle = {
      id: Date.now() + Math.random(),
      x,
      y,
      opacity: 1,
      size: 15 + Math.random() * 20,
    };
    
    setCandles(prev => [...prev, newCandle]);
    
    // Simulate real user interaction by incrementing the live counter!
    setActiveUsers(prev => prev + 1);
  };

  return (
    <div className="fixed inset-0 bg-[#050505] z-[100] flex flex-col justify-center items-center text-[#e0e0e0] overflow-hidden font-serif">
      {/* Candles Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AnimatePresence>
          {candles.map(candle => (
            <motion.div
              key={candle.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: candle.opacity, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className="absolute rounded-full bg-[#fca311]"
              style={{
                left: `${candle.x}%`,
                top: `${candle.y}%`,
                width: `${candle.size}px`,
                height: `${candle.size}px`,
                boxShadow: "0 0 40px 10px rgba(252, 163, 17, 0.4)",
                filter: "blur(4px)",
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="absolute top-8 left-6 md:left-12 z-20">
        <Link href="/" className="text-[10px] uppercase tracking-widest text-[#666] hover:text-[#fff] transition-colors flex items-center gap-2">
          <span>←</span> Leave the 3AM Room
        </Link>
      </div>

      <div className="z-10 flex flex-col items-center text-center max-w-lg px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 3, delay: 1 }}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#666] block mb-12">The 3AM Room</span>
          
          <h1 className="text-3xl md:text-5xl font-light tracking-wide mb-8">
            You are not the only one awake.
          </h1>
          
          <div className="flex items-center justify-center gap-4 mb-20">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fca311] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#fca311]"></span>
            </span>
            <p className="text-sm tracking-widest text-[#aaa] font-mono">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={activeUsers}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="inline-block font-bold text-[#fff]"
                >
                  {activeUsers}
                </motion.span>
              </AnimatePresence>
              {" "}people are here right now, in the quiet.
            </p>
          </div>

          <button 
            onClick={leaveCandle}
            className="px-6 py-4 border border-[#333] hover:border-[#fca311] hover:text-[#fca311] rounded-full text-[10px] uppercase tracking-[0.2em] transition-all duration-700 bg-black/50 backdrop-blur-md"
          >
            Leave a light for someone else 🕯️
          </button>
        </motion.div>
      </div>
    </div>
  );
}
