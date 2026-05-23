"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function BreathePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 4-7-8 Breathing State
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [countdown, setCountdown] = useState(4);
  const [isBreathing, setIsBreathing] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isBreathing) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 1) return prev - 1;

          // Transition to next phase
          if (phase === "inhale") {
            setPhase("hold");
            return 7;
          } else if (phase === "hold") {
            setPhase("exhale");
            return 8;
          } else {
            setPhase("inhale");
            return 4;
          }
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isBreathing, phase]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const startBreathing = () => {
    setIsBreathing(true);
    setPhase("inhale");
    setCountdown(4);
    if (!isPlaying && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Determine circle scale based on phase
  const getScale = () => {
    if (!isBreathing) return 1;
    if (phase === "inhale") return 2; // Expand
    if (phase === "hold") return 2;   // Hold expanded
    return 1;                         // Shrink back
  };

  // Determine transition duration based on phase
  const getDuration = () => {
    if (!isBreathing) return 1;
    if (phase === "inhale") return 4;
    if (phase === "hold") return 7;
    return 8;
  };

  const getPhaseText = () => {
    if (phase === "inhale") return "Breathe In";
    if (phase === "hold") return "Hold";
    return "Breathe Out";
  };

  return (
    <div className="fixed inset-0 bg-brand-bg z-50 flex flex-col justify-center items-center text-brand-text overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 transition-opacity duration-1000">
        <motion.div
          animate={isBreathing ? { scale: getScale(), opacity: phase === "hold" ? 0.4 : 0.2 } : { scale: [1, 1.2, 1], opacity: 0.2 }}
          transition={{ duration: getDuration(), ease: "easeInOut" }}
          className="w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full bg-brand-accent blur-[120px]"
        />
      </div>

      <Link href="/" className="absolute top-12 left-12 text-xs uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity z-20">
        Leave Room 🚪
      </Link>

      <div className="z-10 flex flex-col items-center">
        
        {/* Animated Breathing Circle */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mb-20 perspective-1000">
          <motion.div
            animate={{ scale: getScale() }}
            transition={{ duration: getDuration(), ease: "easeInOut" }}
            className="absolute inset-0 border border-brand-accent/50 rounded-full"
            style={{ transformStyle: "preserve-3d" }}
          />
          <motion.div
            animate={{ scale: getScale() * 0.8 }}
            transition={{ duration: getDuration(), ease: "easeInOut" }}
            className="absolute inset-0 m-auto w-48 h-48 md:w-56 md:h-56 border border-brand-text/30 rounded-full"
          />
          
          <AnimatePresence mode="wait">
            {isBreathing ? (
              <motion.div
                key={phase}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="absolute flex flex-col items-center justify-center text-center"
              >
                <span className="font-serif text-3xl md:text-4xl text-brand-text mb-2">{getPhaseText()}</span>
                <span className="text-xl font-mono text-brand-accent opacity-80">{countdown}</span>
              </motion.div>
            ) : (
              <motion.div
                key="start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute flex items-center justify-center cursor-pointer"
                onClick={startBreathing}
              >
                <div className="w-24 h-24 bg-brand-text rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                  <span className="text-brand-bg text-xs uppercase tracking-widest font-semibold">Begin</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!isBreathing && (
          <p className="font-serif text-xl md:text-2xl text-brand-soft text-center text-balance max-w-md mb-12">
            A guided 4-7-8 breathing exercise to calm your nervous system.
          </p>
        )}

        <button
          onClick={toggleAudio}
          className="text-[10px] uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors mt-8"
        >
          {isPlaying ? "Pause Ambient Sound" : "Play Ambient Sound"}
        </button>

        {/* Ambient audio - set to play on loop */}
        <audio
          ref={audioRef}
          src="https://cdn.pixabay.com/download/audio/2021/08/04/audio_c6ccf3232f.mp3?filename=soft-rain-ambient-111154.mp3"
          loop
        />
      </div>
    </div>
  );
}
