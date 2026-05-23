"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TimerMode = "focus" | "shortBreak" | "longBreak" | "custom";

const MODES: Record<string, { label: string, minutes: number }> = {
  focus: { label: "Deep Focus", minutes: 25 },
  shortBreak: { label: "Soft Pause", minutes: 5 },
  longBreak: { label: "Long Rest", minutes: 15 },
  custom: { label: "Custom", minutes: 0 },
};

export default function FocusTimer({ onTimerActiveChange }: { onTimerActiveChange?: (isActive: boolean) => void }) {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [customMinutes, setCustomMinutes] = useState(60);
  const [timeLeft, setTimeLeft] = useState(MODES.focus.minutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedCustomTime = localStorage.getItem("quietly_custom_timer_mins");
    if (savedCustomTime) {
      setCustomMinutes(parseInt(savedCustomTime, 10));
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (onTimerActiveChange) onTimerActiveChange(false);
      playSoftChime();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onTimerActiveChange]);

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    if (onTimerActiveChange) onTimerActiveChange(false);
    if (newMode === "custom") {
      setTimeLeft(customMinutes * 60);
    } else {
      setTimeLeft(MODES[newMode].minutes * 60);
    }
  };

  const toggleTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(mode === "custom" ? customMinutes * 60 : MODES[mode].minutes * 60);
    }
    const newActiveState = !isActive;
    setIsActive(newActiveState);
    if (onTimerActiveChange) onTimerActiveChange(newActiveState);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setCustomMinutes(val);
    setTimeLeft(val * 60);
    localStorage.setItem("quietly_custom_timer_mins", val.toString());
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
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    const hStr = h.toString().padStart(2, "0");
    const mStr = m.toString().padStart(2, "0");
    const sStr = s.toString().padStart(2, "0");
    
    if (h > 0) {
      return `${hStr}:${mStr}:${sStr}`;
    }
    return `00:${mStr}:${sStr}`;
  };

  const totalTime = mode === "custom" ? customMinutes * 60 : MODES[mode].minutes * 60;
  const progress = totalTime > 0 ? 1 - (timeLeft / totalTime) : 0;

  if (!isClient) return null;

  return (
    <div className="w-full flex flex-col items-center relative z-10">
      
      {/* Modes */}
      <div className="flex gap-2 md:gap-4 mb-8 md:mb-16 p-2 bg-brand-card/80 backdrop-blur-md rounded-full border border-brand-border">
        {(Object.keys(MODES) as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`px-4 md:px-6 py-2 rounded-full text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 ${
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
            className="stroke-brand-border/30"
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
          {mode === "custom" && !isActive && timeLeft === customMinutes * 60 ? (
            <div className="flex items-end mb-2">
              <input 
                type="number" 
                value={customMinutes} 
                onChange={handleCustomChange}
                className="bg-transparent text-6xl md:text-7xl font-serif text-brand-text tracking-tight w-24 md:w-32 text-center focus:outline-none border-b-2 border-brand-accent/50 focus:border-brand-accent transition-colors"
                min="1"
                max="999"
              />
              <span className="text-xl text-brand-soft mb-4 ml-2">m</span>
            </div>
          ) : (
            <motion.span 
              key={timeLeft}
              initial={{ opacity: 0.5, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-7xl font-serif text-brand-text tracking-tight mb-2"
            >
              {formatTime(timeLeft)}
            </motion.span>
          )}
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-brand-soft">
            {isActive ? "Flowing" : mode === "custom" && !isActive && timeLeft === customMinutes * 60 ? "Set Minutes" : "Paused"}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 md:mt-16 flex items-center gap-6">
        <button
          onClick={toggleTimer}
          className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-brand-card/80 backdrop-blur-md border border-brand-border rounded-full hover:border-brand-accent hover:text-brand-accent transition-all duration-300 text-brand-text shadow-sm hover:shadow-md"
        >
          {isActive ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
          )}
        </button>
      </div>

    </div>
  );
}
