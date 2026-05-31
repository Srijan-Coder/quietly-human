"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type BreathingMode = "4-7-8" | "box" | "calm";
type Phase = "inhale" | "hold-in" | "exhale" | "hold-out";

const MODE_CONFIG = {
  "4-7-8": {
    name: "4-7-8 (Anxiety Relief)",
    desc: "A natural tranquilizer for the nervous system.",
    sequence: [
      { phase: "inhale" as Phase, duration: 4, text: "Breathe In" },
      { phase: "hold-in" as Phase, duration: 7, text: "Hold" },
      { phase: "exhale" as Phase, duration: 8, text: "Breathe Out" },
    ],
  },
  "box": {
    name: "Box Breathing (Focus)",
    desc: "Used to clear the mind and regain focus.",
    sequence: [
      { phase: "inhale" as Phase, duration: 4, text: "Breathe In" },
      { phase: "hold-in" as Phase, duration: 4, text: "Hold" },
      { phase: "exhale" as Phase, duration: 4, text: "Breathe Out" },
      { phase: "hold-out" as Phase, duration: 4, text: "Hold" },
    ],
  },
  "calm": {
    name: "Deep Calm (Sleep)",
    desc: "Slow, steady breaths to signal safety to your body.",
    sequence: [
      { phase: "inhale" as Phase, duration: 5, text: "Breathe In" },
      { phase: "exhale" as Phase, duration: 5, text: "Breathe Out" },
    ],
  },
};

export default function BreathePage() {
  const [mode, setMode] = useState<BreathingMode>("4-7-8");
  const [isBreathing, setIsBreathing] = useState(false);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const sequenceIndexRef = useRef(0);

  const config = MODE_CONFIG[mode];
  const currentStep = config.sequence[sequenceIndex];

  useEffect(() => {
    sequenceIndexRef.current = sequenceIndex;
  }, [sequenceIndex]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isBreathing) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 1) return prev - 1;

          // Move to next phase in sequence
          const nextIndex = (sequenceIndexRef.current + 1) % config.sequence.length;
          setSequenceIndex(nextIndex);
          return config.sequence[nextIndex].duration;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isBreathing, config.sequence]);

  const startBreathing = () => {
    setSequenceIndex(0);
    setCountdown(config.sequence[0].duration);
    setIsBreathing(true);
  };

  const stopBreathing = () => {
    setIsBreathing(false);
  };

  const switchMode = (newMode: BreathingMode) => {
    setIsBreathing(false);
    setMode(newMode);
  };

  // Determine circle scale based on phase
  const getScale = () => {
    if (!isBreathing) return 1;
    if (currentStep.phase === "inhale" || currentStep.phase === "hold-in") return 2;
    return 1; // exhale or hold-out
  };

  return (
    <div className="fixed inset-0 bg-brand-bg z-50 flex flex-col justify-center items-center text-brand-text overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 transition-opacity duration-1000">
        <motion.div
          animate={isBreathing ? { scale: getScale(), opacity: currentStep.phase.includes("hold") ? 0.4 : 0.2 } : { scale: [1, 1.2, 1], opacity: 0.2 }}
          transition={{ duration: currentStep.duration, ease: "easeInOut" }}
          className="w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full bg-brand-accent blur-[120px]"
        />
      </div>

      <div className="absolute top-8 left-6 md:left-12 flex flex-col gap-6 z-20">
        <Link href="/" className="text-xs uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity flex items-center gap-2">
          <span>←</span> Leave Room
        </Link>
        
        {/* Mode Selector */}
        {!isBreathing && (
          <div className="flex flex-col gap-3">
            <span className="text-[10px] uppercase tracking-widest text-brand-soft">Rhythm</span>
            <div className="flex flex-col items-start gap-2">
              {(Object.keys(MODE_CONFIG) as BreathingMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`text-xs tracking-widest uppercase transition-colors px-4 py-2 rounded-full border ${
                    mode === m ? "border-brand-accent text-brand-accent bg-brand-accent/10" : "border-brand-border text-brand-soft hover:text-brand-text hover:border-brand-text"
                  }`}
                >
                  {MODE_CONFIG[m].name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="z-10 flex flex-col items-center">
        
        {/* Animated Breathing Circle */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mb-20 perspective-1000 mt-12 md:mt-0">
          <motion.div
            animate={{ scale: getScale() }}
            transition={{ duration: currentStep.duration, ease: "easeInOut" }}
            className="absolute inset-0 border border-brand-accent/50 rounded-full"
            style={{ transformStyle: "preserve-3d" }}
          />
          <motion.div
            animate={{ scale: getScale() * 0.8 }}
            transition={{ duration: currentStep.duration, ease: "easeInOut" }}
            className="absolute inset-0 m-auto w-48 h-48 md:w-56 md:h-56 border border-brand-text/30 rounded-full"
          />
          
          <AnimatePresence mode="wait">
            {isBreathing ? (
              <motion.div
                key={currentStep.phase}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="absolute flex flex-col items-center justify-center text-center w-full"
              >
                <span className="font-serif text-3xl md:text-4xl text-brand-text mb-2 block">{currentStep.text}</span>
                <span className="text-xl font-mono text-brand-accent opacity-80">{countdown}</span>
              </motion.div>
            ) : (
              <motion.button
                key="start"
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg rounded-full"
                onClick={startBreathing}
              >
                <div className="w-24 h-24 bg-brand-text rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                  <span className="text-brand-bg text-xs uppercase tracking-widest font-semibold">Begin</span>
                </div>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {!isBreathing ? (
            <motion.p
              key="desc"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="font-serif text-xl md:text-2xl text-brand-soft text-center text-balance max-w-md mb-12 px-6"
            >
              {config.desc}
            </motion.p>
          ) : (
            <motion.button
              key="stop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={stopBreathing}
              className="text-[10px] uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors mt-8"
            >
              Stop
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
