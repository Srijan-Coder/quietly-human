"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TimerMode = "focus" | "shortBreak" | "longBreak";

const MODES = {
  focus: { label: "Deep Focus", minutes: 25 },
  shortBreak: { label: "Soft Pause", minutes: 5 },
  longBreak: { label: "Long Rest", minutes: 15 },
};

export default function FocusTimer() {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(MODES.focus.minutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      playSoftChime();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(MODES[newMode].minutes * 60);
  };

  const toggleTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(MODES[mode].minutes * 60);
    }
    setIsActive(!isActive);
  };

  const playSoftChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(510, ctx.currentTime + 3);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 4);
    } catch (e) {
      console.error("Audio API not supported", e);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progress = 1 - (timeLeft / (MODES[mode].minutes * 60));

  if (!isClient) return null;

  return (
    <div className="w-full flex flex-col items-center relative z-10">
      
      {/* Modes */}
      <div className="flex gap-4 mb-16 p-2 bg-brand-card rounded-full border border-brand-border">
        {(Object.keys(MODES) as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all duration-300 ${
              mode === m 
                ? "bg-brand-text text-brand-bg shadow-sm" 
                : "text-brand-soft hover:text-brand-text hover:bg-brand-border/50"
            }`}
          >
            {MODES[m].label}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="relative flex items-center justify-center w-80 h-80 md:w-96 md:h-96 group">
        {/* Pulsing glow when active */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.15, scale: 1.2 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
              className="absolute inset-0 bg-brand-accent rounded-full blur-3xl pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
          <circle
            cx="50%"
            cy="50%"
            r="48%"
            className="stroke-brand-border"
            strokeWidth="2"
            fill="none"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="48%"
            className="stroke-brand-accent"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: "0 1000" }}
            animate={{ 
              strokeDasharray: `${progress * 1000} 1000` 
            }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>

        <div className="flex flex-col items-center z-10">
          <motion.span 
            key={timeLeft}
            initial={{ opacity: 0.5, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-8xl font-serif text-brand-text tracking-tight mb-2"
          >
            {formatTime(timeLeft)}
          </motion.span>
          <span className="text-xs uppercase tracking-[0.3em] text-brand-soft">
            {isActive ? "Flowing" : "Paused"}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-16 flex items-center gap-6">
        <button
          onClick={toggleTimer}
          className="w-20 h-20 flex items-center justify-center bg-brand-card border border-brand-border rounded-full hover:border-brand-accent hover:text-brand-accent transition-all duration-300 text-brand-text shadow-sm hover:shadow-md"
        >
          {isActive ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
          )}
        </button>
      </div>

    </div>
  );
}
