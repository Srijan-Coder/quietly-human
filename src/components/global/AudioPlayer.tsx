"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Track = {
  id: string;
  name: string;
  url: string; // The user will need to put these mp3s in the public folder, e.g. /audio/rain.mp3
};

const tracks: Track[] = [
  { id: "rain", name: "Midnight Rain", url: "/audio/rain.mp3" },
  { id: "piano", name: "Soft Piano", url: "/audio/piano.mp3" },
  { id: "cafe", name: "Quiet Cafe", url: "/audio/cafe.mp3" },
  { id: "study", name: "Deep Focus (Study Mode)", url: "/audio/study.mp3" },
];

export function AudioPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle play/pause when state or track changes
  useEffect(() => {
    if (activeTrack && audioRef.current) {
      audioRef.current.src = activeTrack.url;
      if (isPlaying) {
        audioRef.current.play().catch((e) => {
          console.warn("Autoplay blocked by browser. User must interact first.", e);
          setIsPlaying(false);
        });
      }
    }
  }, [activeTrack]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = (track: Track) => {
    if (activeTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveTrack(track);
      setIsPlaying(true);
    }
  };

  return (
    <>
      {/* Invisible Global Audio Element */}
      <audio ref={audioRef} loop />

      {/* Floating UI */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col-reverse items-start gap-4">
        
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-12 h-12 rounded-full border border-brand-border bg-brand-bg/80 backdrop-blur-md flex items-center justify-center text-brand-text shadow-sm transition-all hover:scale-105 ${isPlaying ? 'animate-pulse border-brand-accent' : ''}`}
          aria-label="Ambient Audio Player"
        >
          {isPlaying ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          )}
        </button>

        {/* Expanding Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-brand-card/90 backdrop-blur-xl border border-brand-border p-4 rounded-2xl shadow-lg w-64 origin-bottom-left"
            >
              <h3 className="text-[10px] uppercase tracking-widest opacity-50 mb-4 px-2">Ambient Layer</h3>
              <div className="flex flex-col gap-1">
                {tracks.map((track) => {
                  const isActive = activeTrack?.id === track.id;
                  return (
                    <button
                      key={track.id}
                      onClick={() => togglePlay(track)}
                      className={`text-left px-3 py-2 rounded-lg text-xs tracking-wide transition-colors flex items-center justify-between ${
                        isActive && isPlaying
                          ? "bg-brand-accent/10 text-brand-accent"
                          : "hover:bg-brand-bg text-brand-soft hover:text-brand-text"
                      }`}
                    >
                      <span>{track.name}</span>
                      {isActive && isPlaying && (
                        <motion.div 
                          className="flex gap-[2px] items-end h-3"
                          initial="hidden"
                          animate="playing"
                        >
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-[2px] bg-brand-accent rounded-full"
                              animate={{ height: ["4px", "12px", "4px"] }}
                              transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                            />
                          ))}
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>

              {activeTrack && (
                <div className="mt-4 px-2 pt-4 border-t border-brand-border flex items-center justify-between">
                  <span className="text-[10px] text-brand-soft truncate max-w-[120px]">
                    Playing: {activeTrack.name}
                  </span>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-[10px] uppercase tracking-widest text-brand-accent hover:opacity-70"
                  >
                    {isPlaying ? "Pause" : "Play"}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
}
