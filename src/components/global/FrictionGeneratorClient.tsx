"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function FrictionGeneratorClient() {
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  
  // Total friction time required: 30 seconds (30,000 ms)
  const REQUIRED_MS = 30000;
  const UPDATE_INTERVAL_MS = 50;

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPressing && !completed) {
      timerRef.current = setInterval(() => {
        setProgress(p => {
          const next = p + (UPDATE_INTERVAL_MS / REQUIRED_MS) * 100;
          if (next >= 100) {
            setCompleted(true);
            setIsPressing(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return 100;
          }
          return next;
        });
      }, UPDATE_INTERVAL_MS);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      // Reset if they let go early!
      if (!completed) {
        setProgress(0);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPressing, completed]);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Prevent default touch behaviors (like highlighting or right click on mobile)
    e.preventDefault(); 
    if (!completed) setIsPressing(true);
  };

  const handlePointerUp = () => {
    setIsPressing(false);
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-6 touch-none">
      
      <AnimatePresence mode="wait">
        
        {!completed ? (
          <motion.div
            key="generating"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: "blur(10px)", scale: 1.1 }}
            className="w-full flex flex-col items-center max-w-lg"
          >
            <div className="text-4xl mb-6 grayscale opacity-50">🛑</div>
            <h2 className="font-serif text-2xl md:text-3xl text-brand-text mb-4 text-center">
              The Friction Generator
            </h2>
            <p className="text-brand-soft text-sm text-center mb-16">
              About to make an impulsive purchase? Send an angry text? Doomscroll? 
              <br/><br/>
              Before you do, you must hold this button down for exactly 30 seconds without letting go. If you slip, it resets.
            </p>

            <div className="relative w-48 h-48 flex items-center justify-center mb-12">
              {/* Progress Ring */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none">
                <circle
                  cx="96"
                  cy="96"
                  r="90"
                  fill="transparent"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="4"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="90"
                  fill="transparent"
                  stroke={isPressing ? "#ef4444" : "transparent"}
                  strokeWidth="4"
                  strokeDasharray={2 * Math.PI * 90}
                  strokeDashoffset={2 * Math.PI * 90 * (1 - progress / 100)}
                  className="transition-all ease-linear"
                />
              </svg>

              {/* The Button */}
              <button
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onContextMenu={e => e.preventDefault()} // prevent right click context menu from interrupting
                className={`w-32 h-32 rounded-full flex flex-col items-center justify-center select-none transition-all duration-300 ${
                  isPressing 
                    ? "bg-[#ef4444] text-white scale-95 shadow-[0_0_50px_rgba(239,68,68,0.5)]" 
                    : "bg-brand-card border-2 border-brand-border text-brand-soft hover:border-[#ef4444] hover:text-[#ef4444]"
                }`}
                style={{ WebkitUserSelect: 'none' }}
              >
                <span className="text-xs uppercase tracking-widest font-bold">
                  {isPressing ? "Hold..." : "Hold"}
                </span>
              </button>
            </div>

            <div className="h-4">
              <AnimatePresence>
                {progress > 0 && !isPressing && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[#ef4444] text-xs uppercase tracking-widest"
                  >
                    You let go. Resetting.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            
          </motion.div>
        ) : (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center max-w-lg"
          >
            <div className="text-5xl mb-8">🧠</div>
            <h2 className="font-serif text-3xl md:text-5xl text-brand-text mb-6 leading-tight">
              Prefrontal Cortex Online.
            </h2>
            <p className="text-brand-soft mb-12 text-sm leading-relaxed">
              You just gave your brain 30 seconds to catch up to your impulses. Do you still want to do the thing? 
            </p>
            
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); /* Usually they just leave the site */ }}
                className="px-6 py-4 border border-brand-border rounded-xl text-xs uppercase tracking-widest text-brand-soft hover:bg-brand-card transition-colors"
              >
                Yes, I still want to.
              </a>
              <button
                onClick={() => {
                  setCompleted(false);
                  setProgress(0);
                }}
                className="px-6 py-4 bg-brand-text text-brand-bg rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-brand-accent transition-colors shadow-lg"
              >
                No, I'm good. (Reset)
              </button>
            </div>

            <div className="mt-16">
              <Link
                href="/toolkit"
                className="text-[10px] uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors"
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
