"use client";

import { useState, useEffect, useRef } from "react";
import FocusTimer from "@/components/global/FocusTimer";
import FocusThemeSelector, { Theme, BUILT_IN_THEMES } from "@/components/global/FocusThemeSelector";
import YouTube from "react-youtube";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function FocusPage() {
  const [activeTheme, setActiveTheme] = useState<Theme>(BUILT_IN_THEMES[0]);
  const [customUrl, setCustomUrl] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isClient, setIsClient] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);
    const savedCustomUrl = localStorage.getItem("quietly_custom_youtube");
    if (savedCustomUrl) {
      setCustomUrl(savedCustomUrl);
    }
  }, []);

  const handleSetCustomUrl = (url: string) => {
    setCustomUrl(url);
    localStorage.setItem("quietly_custom_youtube", url);
  };

  const handleReady = (event: any) => {
    playerRef.current = event.target;
    event.target.setVolume(volume);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseInt(e.target.value);
    setVolume(newVol);
    if (playerRef.current) {
      playerRef.current.setVolume(newVol);
    }
    if (newVol === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (volume === 0) setVolume(50); // Restore to 50 if it was 0
      if (playerRef.current) playerRef.current.unMute();
    } else {
      setIsMuted(true);
      if (playerRef.current) playerRef.current.mute();
    }
  };

  if (!isClient) return null;

  return (
    <div className="relative min-h-screen flex flex-col w-full bg-brand-bg pt-32 pb-20 overflow-hidden">
      
      {/* Background Image Transition */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeTheme.bgImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <Image
            src={activeTheme.bgImage}
            alt="Room Background"
            fill
            className="object-cover"
          />
          {/* Dark Overlay so text is readable */}
          <div className="absolute inset-0 bg-brand-bg/60 backdrop-blur-[2px]" />
        </motion.div>
      </AnimatePresence>

      {/* Radial glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 40%, var(--color-accent) 0%, transparent 60%)",
          opacity: 0.15,
        }}
      />

      {/* Fullscreen Toggle */}
      <button 
        onClick={() => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => console.log(err));
          } else {
            document.exitFullscreen();
          }
        }}
        className="absolute top-32 left-6 md:left-12 z-50 p-3 rounded-full border border-brand-border bg-brand-card/80 backdrop-blur-md text-brand-text hover:border-brand-accent transition-colors shadow-sm flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
        </svg>
        <span className="text-[10px] uppercase tracking-widest hidden md:block">Full Screen</span>
      </button>

      {/* Hidden Audio Player */}
      {activeTheme.youtubeId && (
        <div className="hidden">
          <YouTube 
            videoId={activeTheme.youtubeId} 
            opts={{ 
              playerVars: { 
                autoplay: 1, 
                loop: 1, 
                playlist: activeTheme.youtubeId,
                controls: 0 
              } 
            }} 
            onReady={handleReady}
          />
        </div>
      )}

      {/* Audio Controls */}
      <div className="absolute top-32 right-6 md:right-12 z-50 flex items-center gap-4 bg-brand-card/80 backdrop-blur-md border border-brand-border rounded-full p-2 shadow-sm">
        <button 
          onClick={toggleMute}
          className="p-2 rounded-full text-brand-text hover:text-brand-accent transition-colors flex items-center justify-center"
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6L5.25 12m0 0l-2.25 2.25M5.25 12l-2.25-2.25M5.25 12l2.25 2.25" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
          )}
        </button>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={volume} 
          onChange={handleVolumeChange}
          className="w-24 md:w-32 h-1 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-accent hidden md:block mr-4"
        />
      </div>

      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center relative z-10 px-6">
        <motion.span 
          key={activeTheme.name}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] uppercase tracking-[0.2em] text-brand-accent mb-4 text-center mt-12 md:mt-0"
        >
          {activeTheme.name} Room
        </motion.span>
        
        <h1 className="text-4xl md:text-5xl font-serif text-brand-text mb-4 text-center">Quiet Focus</h1>
        <p className="text-brand-soft text-center max-w-lg mb-12 md:mb-16 leading-relaxed">
          A space to drop your shoulders, set your intention, and do your deep work gently.
        </p>

        <FocusTimer />
        
        <FocusThemeSelector 
          activeTheme={activeTheme} 
          onSelectTheme={setActiveTheme} 
          customUrl={customUrl}
          onSetCustomUrl={handleSetCustomUrl}
        />
      </div>
    </div>
  );
}
