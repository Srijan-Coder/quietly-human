"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ListenButton() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsSupported(false);
    }
    
    // Stop speaking when leaving the page
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlay = () => {
    if (!window.speechSynthesis) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      setIsPaused(true);
      return;
    }

    // Start fresh reading
    const contentDiv = document.getElementById("article-content");
    if (!contentDiv) return;

    const textToRead = contentDiv.innerText || contentDiv.textContent || "";
    if (!textToRead.trim()) return;

    // Stop anything currently playing just in case
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    // Try to pick a soft, pleasant voice if available
    const voices = window.speechSynthesis.getVoices();
    // Prefer female or calm voices (e.g., Samantha on Mac, Google US English)
    const preferredVoice = voices.find(v => 
      v.name.includes("Samantha") || 
      v.name.includes("Victoria") || 
      v.name.includes("Google US English") ||
      (v.lang.includes("en") && v.name.includes("Female"))
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.rate = 0.85; // Slightly slower for a calm effect
    utterance.pitch = 0.9; // Slightly lower pitch

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };
    
    utterance.onerror = (e) => {
      console.error("SpeechSynthesis error:", e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  if (!isSupported) return null;

  return (
    <button
      onClick={handlePlay}
      className="flex items-center gap-3 px-6 py-3 rounded-full border border-brand-border bg-brand-card hover:border-brand-accent transition-all group"
      aria-label={isPlaying ? "Pause audio" : "Listen to this page"}
    >
      <div className="relative flex items-center justify-center w-6 h-6">
        {isPlaying ? (
          <div className="flex gap-1 items-center h-4">
            <motion.div animate={{ height: ["4px", "16px", "4px"] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }} className="w-1 bg-brand-accent rounded-full" />
            <motion.div animate={{ height: ["8px", "12px", "8px"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} className="w-1 bg-brand-accent rounded-full" />
            <motion.div animate={{ height: ["12px", "6px", "12px"] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.1 }} className="w-1 bg-brand-accent rounded-full" />
          </div>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-brand-soft group-hover:text-brand-accent transition-colors">
            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <span className="text-xs tracking-widest uppercase text-brand-soft group-hover:text-brand-text transition-colors">
        {isPlaying ? "Pause" : isPaused ? "Resume" : "Listen"}
      </span>
    </button>
  );
}
