"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function UrgeSurferClient() {
  const [stage, setStage] = useState<"intro" | "surfing" | "done">("intro");
  const [intensity, setIntensity] = useState<number>(5);
  const [history, setHistory] = useState<{time: number, value: number}[]>([]);
  const [progress, setProgress] = useState(0);

  // 5 minute wave (300 seconds)
  const totalDurationSeconds = 300; 

  useEffect(() => {
    if (stage === "surfing") {
      const intervalMs = 1000;
      let secondsPassed = 0;
      
      // Record initial intensity
      setHistory([{ time: 0, value: intensity }]);

      const timer = setInterval(() => {
        secondsPassed++;
        setProgress((secondsPassed / totalDurationSeconds) * 100);

        // Record intensity every 10 seconds to build the chart
        if (secondsPassed % 10 === 0) {
          setHistory(prev => {
            // Need to use the current state value of intensity, but setInterval closure captures old state.
            // React 18 setState with callback is safe, but we don't have direct access to 'intensity' here.
            // We'll update history in a separate effect that watches 'intensity' and 'progress'.
            return prev;
          });
        }

        if (secondsPassed >= totalDurationSeconds) {
          clearInterval(timer);
          setStage("done");
        }
      }, intervalMs);

      return () => clearInterval(timer);
    }
  }, [stage]);

  // Separate effect to record history safely
  useEffect(() => {
    if (stage === "surfing" && progress > 0) {
      const currentSecond = Math.floor((progress / 100) * totalDurationSeconds);
      if (currentSecond % 10 === 0) {
        setHistory(prev => {
          // avoid duplicates for the same second
          if (prev.length > 0 && prev[prev.length - 1].time === currentSecond) return prev;
          return [...prev, { time: currentSecond, value: intensity }];
        });
      }
    }
  }, [progress, intensity, stage]);

  const startSurfing = () => {
    setStage("surfing");
    setProgress(0);
    setHistory([]);
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center max-w-4xl mx-auto w-full px-6">
      <AnimatePresence mode="wait">
        
        {stage === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full flex flex-col items-center max-w-lg text-center"
          >
            <div className="text-4xl mb-6 grayscale opacity-50">🌊</div>
            <h2 className="font-serif text-2xl md:text-3xl text-brand-text mb-4">
              Urge Surfing
            </h2>
            <p className="text-brand-soft text-sm mb-12">
              Urges and cravings are like ocean waves. They build, they peak, and they break. If you can surf the wave for just 5 minutes without giving in, the urge will naturally subside.
            </p>

            <button
              onClick={startSurfing}
              className="px-10 py-4 border border-brand-border text-brand-text rounded-full text-xs uppercase tracking-widest hover:bg-brand-text hover:text-brand-bg transition-colors"
            >
              Start the 5-Minute Wave
            </button>
          </motion.div>
        )}

        {stage === "surfing" && (
          <motion.div
            key="surfing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col items-center h-[70vh] justify-between py-12"
          >
            <div className="text-center w-full max-w-md">
              <h3 className="font-serif text-2xl text-brand-text mb-2">Ride the wave.</h3>
              <p className="text-brand-soft text-sm mb-8">
                Do not fight the urge. Acknowledge it. Log its intensity in real-time below. Watch it rise and fall.
              </p>
            </div>

            {/* The Visual Wave Area */}
            <div className="flex-1 w-full relative flex items-end justify-center mb-12">
              {/* Background Graph Lines */}
              <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none pb-8">
                {[10, 8, 6, 4, 2, 0].map(val => (
                  <div key={val} className="w-full border-b border-brand-text/50 flex items-end relative">
                    <span className="absolute -left-6 -translate-y-1/2 text-[10px]">{val}</span>
                  </div>
                ))}
              </div>

              {/* The user's historical urge line */}
              <svg className="absolute inset-0 w-full h-full pb-8 pointer-events-none overflow-visible" preserveAspectRatio="none">
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  d={
                    history.length > 0 
                    ? `M 0,${100 - (history[0].value * 10)} ` + 
                      history.map((h, i) => {
                        const x = (h.time / totalDurationSeconds) * 100;
                        const y = 100 - (h.value * 10);
                        return `L ${x}%,${y}%`;
                      }).join(" ")
                    : ""
                  }
                  fill="transparent"
                  stroke="#fca311"
                  strokeWidth="3"
                  className="drop-shadow-[0_0_10px_rgba(252,163,17,0.5)] transition-all duration-1000"
                />
              </svg>

              {/* Live intensity indicator dot */}
              <div 
                className="absolute w-4 h-4 bg-brand-accent rounded-full shadow-[0_0_20px_rgba(252,163,17,1)] transition-all duration-1000"
                style={{ 
                  left: `${progress}%`, 
                  bottom: `calc(${intensity * 10}% + 2rem)`, // +2rem to account for pb-8 on container
                  transform: 'translate(-50%, 50%)'
                }}
              />
            </div>

            {/* Controls */}
            <div className="w-full max-w-md bg-brand-card/50 border border-brand-border p-6 rounded-2xl flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-widest text-brand-soft mb-6">Current Urge Intensity</span>
              <div className="flex items-center gap-4 w-full">
                <span className="text-brand-soft font-serif text-xl">1</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={intensity}
                  onChange={e => setIntensity(parseInt(e.target.value))}
                  className="flex-1 accent-brand-accent h-1 bg-brand-border rounded-full appearance-none outline-none cursor-pointer"
                />
                <span className="text-brand-accent font-serif text-3xl font-bold w-8 text-center">{intensity}</span>
              </div>
            </div>

            <div className="mt-8 text-[10px] uppercase tracking-widest text-brand-soft font-mono">
              {Math.floor((totalDurationSeconds - (progress/100)*totalDurationSeconds) / 60)}:
              {Math.floor((totalDurationSeconds - (progress/100)*totalDurationSeconds) % 60).toString().padStart(2, '0')} remaining
            </div>
          </motion.div>
        )}

        {stage === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center max-w-lg w-full"
          >
            <h2 className="font-serif text-4xl md:text-5xl text-brand-text mb-8">
              The wave broke.
            </h2>
            <p className="text-brand-soft mb-12 uppercase tracking-widest text-xs leading-relaxed">
              You observed the urge without acting on it. <br/> You proved you have control.
            </p>
            
            {/* Show final graph thumbnail */}
            <div className="w-full h-32 relative mb-16 border border-brand-border/50 rounded-lg p-2 bg-brand-bg/50">
              <svg className="w-full h-full" preserveAspectRatio="none">
                <path
                  d={
                    history.length > 0 
                    ? `M 0,${100 - (history[0].value * 10)} ` + 
                      history.map((h, i) => {
                        const x = (h.time / totalDurationSeconds) * 100;
                        const y = 100 - (h.value * 10);
                        return `L ${x}%,${y}%`;
                      }).join(" ")
                    : ""
                  }
                  fill="transparent"
                  stroke="#fca311"
                  strokeWidth="2"
                  className="drop-shadow-[0_0_5px_rgba(252,163,17,0.3)]"
                />
              </svg>
            </div>

            <Link
              href="/toolkit"
              className="px-6 py-2 bg-brand-text text-brand-bg rounded-full text-xs uppercase tracking-widest hover:bg-brand-accent transition-colors"
            >
              Back to Toolkit
            </Link>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
