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

interface Props {
  onTimerActiveChange?: (isActive: boolean) => void;
  isZenMode?: boolean;
  onZenModeToggle?: () => void;
}

export default function FocusTimer({ onTimerActiveChange, isZenMode, onZenModeToggle }: Props) {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [customMinutes, setCustomMinutes] = useState(60);
  const [timeLeft, setTimeLeft] = useState(MODES.focus.minutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [timerShape, setTimerShape] = useState<"circle" | "square">("circle");
  const [timerSize, setTimerSize] = useState<"sm" | "md" | "lg">("md");
  const [timerColor, setTimerColor] = useState<string>("#e3c099"); // default accent

  const PRESET_COLORS = ["#e3c099", "#8ab4f8", "#81c995", "#f28b82", "#ffffff"];

  useEffect(() => {
    setIsClient(true);
    const savedCustomTime = localStorage.getItem("quietly_custom_timer_mins");
    if (savedCustomTime) setCustomMinutes(parseInt(savedCustomTime, 10));

    const savedShape = localStorage.getItem("quietly_timer_shape") as any;
    if (savedShape) setTimerShape(savedShape);

    const savedSize = localStorage.getItem("quietly_timer_size") as any;
    if (savedSize) setTimerSize(savedSize);

    const savedColor = localStorage.getItem("quietly_timer_color");
    if (savedColor) setTimerColor(savedColor);
  }, []);

  const saveSetting = (key: string, value: string) => {
    localStorage.setItem(key, value);
  };

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
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
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

  const sizeClasses = {
    sm: "w-64 h-64 md:w-72 md:h-72",
    md: "w-80 h-80 md:w-96 md:h-96",
    lg: "w-96 h-96 md:w-[28rem] md:h-[28rem]",
  };

  return (
    <div className="w-full flex flex-col items-center relative z-10">
      
      {/* Modes */}
      <div className={`flex gap-2 md:gap-4 mb-8 md:mb-16 p-2 bg-brand-card/80 backdrop-blur-md rounded-full border border-brand-border transition-opacity ${isZenMode ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
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
      <div className={`relative flex items-center justify-center group transition-all duration-500 ${sizeClasses[timerSize]}`}>
        {/* Pulsing glow when active */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.15, scale: 1.2 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
              className={`absolute inset-0 blur-3xl pointer-events-none ${timerShape === "circle" ? "rounded-full" : "rounded-3xl"}`}
              style={{ backgroundColor: timerColor, willChange: "transform, opacity" }}
            />
          )}
        </AnimatePresence>

        {/* Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
          {timerShape === "circle" ? (
            <>
              <circle cx="50%" cy="50%" r="48%" className="stroke-brand-border/30" strokeWidth="2" fill="none" pathLength="1000" />
              <motion.circle
                cx="50%" cy="50%" r="48%"
                stroke={timerColor} strokeWidth="2" fill="none" strokeLinecap="round"
                pathLength="1000"
                initial={{ strokeDasharray: "0 1000" }}
                animate={{ strokeDasharray: `${progress * 1000} 1000` }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </>
          ) : (
            <>
              <rect x="2%" y="2%" width="96%" height="96%" rx="10%" className="stroke-brand-border/30" strokeWidth="2" fill="none" pathLength="1000" />
              <motion.rect
                x="2%" y="2%" width="96%" height="96%" rx="10%"
                stroke={timerColor} strokeWidth="2" fill="none" strokeLinecap="round"
                pathLength="1000"
                initial={{ strokeDasharray: "0 1000" }}
                animate={{ strokeDasharray: `${progress * 1000} 1000` }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </>
          )}
        </svg>

        <div className="flex flex-col items-center z-10">
          {mode === "custom" && !isActive && timeLeft === customMinutes * 60 ? (
            <div className="flex items-end mb-2">
              <input 
                type="number" 
                value={customMinutes} 
                onChange={handleCustomChange}
                className="bg-transparent text-6xl md:text-7xl font-serif text-brand-text tracking-tight w-24 md:w-32 text-center focus:outline-none border-b-2 transition-colors"
                style={{ borderColor: timerColor }}
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

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-[60%] z-50 bg-brand-card/90 backdrop-blur-xl border border-brand-border p-6 rounded-2xl shadow-xl flex flex-col gap-6 min-w-[280px]"
          >
            {/* Color */}
            <div>
              <span className="text-[10px] uppercase tracking-widest text-brand-soft mb-3 block">Color</span>
              <div className="flex gap-3">
                {PRESET_COLORS.map(color => (
                  <button 
                    key={color} 
                    onClick={() => { setTimerColor(color); saveSetting("quietly_timer_color", color); }}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${timerColor === color ? "border-brand-text scale-110" : "border-transparent"}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            {/* Shape */}
            <div>
              <span className="text-[10px] uppercase tracking-widest text-brand-soft mb-3 block">Shape</span>
              <div className="flex gap-2 bg-brand-bg/50 p-1 rounded-lg">
                <button onClick={() => { setTimerShape("circle"); saveSetting("quietly_timer_shape", "circle"); }} className={`flex-1 py-2 text-xs rounded-md transition-colors ${timerShape === "circle" ? "bg-brand-card text-brand-text shadow" : "text-brand-soft"}`}>Circle</button>
                <button onClick={() => { setTimerShape("square"); saveSetting("quietly_timer_shape", "square"); }} className={`flex-1 py-2 text-xs rounded-md transition-colors ${timerShape === "square" ? "bg-brand-card text-brand-text shadow" : "text-brand-soft"}`}>Square</button>
              </div>
            </div>

            {/* Size */}
            <div>
              <span className="text-[10px] uppercase tracking-widest text-brand-soft mb-3 block">Size</span>
              <div className="flex gap-2 bg-brand-bg/50 p-1 rounded-lg">
                <button onClick={() => { setTimerSize("sm"); saveSetting("quietly_timer_size", "sm"); }} className={`flex-1 py-2 text-xs rounded-md transition-colors ${timerSize === "sm" ? "bg-brand-card text-brand-text shadow" : "text-brand-soft"}`}>S</button>
                <button onClick={() => { setTimerSize("md"); saveSetting("quietly_timer_size", "md"); }} className={`flex-1 py-2 text-xs rounded-md transition-colors ${timerSize === "md" ? "bg-brand-card text-brand-text shadow" : "text-brand-soft"}`}>M</button>
                <button onClick={() => { setTimerSize("lg"); saveSetting("quietly_timer_size", "lg"); }} className={`flex-1 py-2 text-xs rounded-md transition-colors ${timerSize === "lg" ? "bg-brand-card text-brand-text shadow" : "text-brand-soft"}`}>L</button>
              </div>
            </div>

            <button onClick={() => setShowSettings(false)} className="mt-2 text-xs text-brand-accent uppercase tracking-widest hover:text-brand-text">Close</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="mt-8 md:mt-16 flex items-center gap-4 md:gap-6">
        
        {/* Settings Toggle */}
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-brand-card/80 backdrop-blur-md border border-brand-border rounded-full hover:border-brand-accent transition-all duration-300 shadow-sm hover:shadow-md ${showSettings ? "text-brand-accent border-brand-accent" : "text-brand-soft hover:text-brand-accent"}`}
          title="Timer Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
        </button>

        <button
          onClick={toggleTimer}
          className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-brand-card/80 backdrop-blur-md border border-brand-border rounded-full hover:border-brand-accent transition-all duration-300 text-brand-text shadow-sm hover:shadow-md"
          style={{ color: isActive ? timerColor : undefined, borderColor: isActive ? timerColor : undefined }}
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

        {/* Zen Mode Toggle */}
        <button 
          onClick={onZenModeToggle}
          className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-brand-card/80 backdrop-blur-md border border-brand-border rounded-full hover:border-brand-accent transition-all duration-300 shadow-sm hover:shadow-md ${isZenMode ? "text-brand-accent border-brand-accent" : "text-brand-soft hover:text-brand-accent"}`}
          title="Zen Mode (Hide UI)"
        >
          {isZenMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </button>
      </div>

    </div>
  );
}
