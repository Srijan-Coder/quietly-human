"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import Link from "next/link";

export default function BreathePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  return (
    <div className="fixed inset-0 bg-brand-bg z-50 flex flex-col justify-center items-center text-brand-text overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <motion.div
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full bg-brand-accent blur-[100px]"
        />
      </div>

      <Link href="/" className="absolute top-12 left-12 text-xs uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity z-20">
        Leave Room 🚪
      </Link>

      <div className="z-10 flex flex-col items-center">
        {/* Breathing Circle */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center mb-16">
          <motion.div
            animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 border border-brand-accent rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-4 border border-brand-text rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 md:w-24 md:h-24 bg-brand-text rounded-full"
          />
        </div>

        <motion.p
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="font-serif text-2xl md:text-3xl text-balance tracking-wide mb-12"
        >
          Inhale deeply... Exhale slowly. 🌬️
        </motion.p>

        <button
          onClick={toggleAudio}
          className="text-xs uppercase tracking-widest border border-brand-border px-6 py-3 rounded-full hover:border-brand-accent hover:text-brand-accent transition-colors"
        >
          {isPlaying ? "Pause Ambient Sound" : "Play Ambient Sound"}
        </button>

        {/* Placeholder audio file - the user can replace this URL with their own uploaded file */}
        <audio
          ref={audioRef}
          src="https://cdn.pixabay.com/download/audio/2021/08/04/audio_c6ccf3232f.mp3?filename=soft-rain-ambient-111154.mp3"
          loop
        />
      </div>
    </div>
  );
}
