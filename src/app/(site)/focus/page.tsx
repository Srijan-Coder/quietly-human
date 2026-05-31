"use client";

import { useState, useEffect, useRef } from "react";
import FocusTimer from "@/components/global/FocusTimer";
import FocusThemeSelector, { VisualTheme, BUILT_IN_THEMES } from "@/components/global/FocusThemeSelector";
import YouTube from "react-youtube";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function FocusPage() {
  const [activeTheme, setActiveTheme] = useState<VisualTheme>(BUILT_IN_THEMES[0]);
  
  // Audio state
  const [audioMode, setAudioMode] = useState<"none" | "youtube" | "local">("none");
  const [audioYoutubeId, setAudioYoutubeId] = useState("");
  const [localAudioFile, setLocalAudioFile] = useState<string | null>(null);
  
  // Controls
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  
  const [isClient, setIsClient] = useState(false);
  
  // Refs
  const audioYtRef = useRef<any>(null);
  const bgYtRef = useRef<any>(null);
  const htmlAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setIsClient(true);
    const savedAudioYt = localStorage.getItem("quietly_custom_audio_yt");
    if (savedAudioYt) {
      setAudioMode("youtube");
      setAudioYoutubeId(savedAudioYt);
    }
  }, []);

  // Sync Zen Mode with body class
  useEffect(() => {
    if (isZenMode) {
      document.body.classList.add("zen-mode");
    } else {
      document.body.classList.remove("zen-mode");
    }
    return () => document.body.classList.remove("zen-mode");
  }, [isZenMode]);

  // Sync play/pause with Timer
  useEffect(() => {
    if (isTimerActive) {
      if (audioYtRef.current && !isMuted) audioYtRef.current.playVideo();
      if (bgYtRef.current) bgYtRef.current.playVideo();
      if (htmlAudioRef.current && !isMuted) htmlAudioRef.current.play();
    } else {
      if (audioYtRef.current) audioYtRef.current.pauseVideo();
      if (bgYtRef.current) bgYtRef.current.pauseVideo();
      if (htmlAudioRef.current) htmlAudioRef.current.pause();
    }
  }, [isTimerActive, isMuted]);

  // Sync volume
  useEffect(() => {
    const vol = isMuted ? 0 : volume;
    if (audioYtRef.current) audioYtRef.current.setVolume(vol);
    if (htmlAudioRef.current) htmlAudioRef.current.volume = vol / 100;
  }, [volume, isMuted]);

  const handleAudioYtReady = (event: any) => {
    audioYtRef.current = event.target;
    event.target.setVolume(isMuted ? 0 : volume);
    if (!isTimerActive) event.target.pauseVideo();
  };

  const handleBgYtReady = (event: any) => {
    bgYtRef.current = event.target;
    event.target.mute(); // BG video is always muted
    if (!isTimerActive) event.target.pauseVideo();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseInt(e.target.value);
    setVolume(newVol);
    if (newVol === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (volume === 0) setVolume(50);
    } else {
      setIsMuted(true);
    }
  };

  if (!isClient) return null;

  return (
    <div className={`relative min-h-screen flex flex-col w-full bg-brand-bg pb-20 overflow-hidden transition-all duration-700 ${isZenMode ? 'pt-8' : 'pt-32'}`}>
      
      {/* Background Image Transition */}
      <AnimatePresence mode="popLayout">
        {activeTheme.bgImage && !activeTheme.youtubeId && (
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
            <div className={`absolute inset-0 bg-brand-bg transition-opacity duration-1000 ${isZenMode ? "opacity-30" : "opacity-60"}`} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Muted YouTube Background Video */}
      {activeTheme.youtubeId && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
          <div className="w-[150vw] h-[150vh] opacity-80">
            <YouTube 
              videoId={activeTheme.youtubeId} 
              opts={{ 
                width: '100%',
                height: '100%',
                playerVars: { 
                  autoplay: 1, 
                  loop: 1, 
                  playlist: activeTheme.youtubeId,
                  controls: 0,
                  mute: 1
                } 
              }} 
              onReady={handleBgYtReady}
              className="w-full h-full pointer-events-none"
            />
          </div>
          <div className={`absolute inset-0 bg-brand-bg transition-opacity duration-1000 ${isZenMode ? "opacity-30" : "opacity-60"}`} />
        </div>
      )}

      {/* Radial glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: "radial-gradient(circle at 50% 40%, var(--color-accent) 0%, transparent 60%)",
          opacity: isZenMode ? 0.05 : 0.15,
        }}
      />

      {/* Hidden Audio Players */}
      {audioMode === "youtube" && audioYoutubeId && (
        <div className="hidden">
          <YouTube 
            videoId={audioYoutubeId} 
            opts={{ 
              playerVars: { 
                autoplay: isTimerActive ? 1 : 0, 
                loop: 1, 
                playlist: audioYoutubeId,
                controls: 0 
              } 
            }} 
            onReady={handleAudioYtReady}
          />
        </div>
      )}

      {audioMode === "local" && localAudioFile && (
        <audio 
          ref={htmlAudioRef} 
          src={localAudioFile} 
          loop 
          className="hidden" 
          autoPlay={isTimerActive && !isMuted}
        />
      )}

      {/* Audio Controls */}
      <div className={`absolute top-6 right-6 md:top-12 md:right-12 z-50 flex items-center gap-4 bg-brand-card/80 backdrop-blur-md border border-brand-border rounded-full p-2 shadow-sm transition-all duration-700 ${isZenMode ? "opacity-0 pointer-events-none translate-y-[-20px]" : "opacity-100 translate-y-0"}`}>
        <button 
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
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
          aria-label="Volume"
          className="w-24 md:w-32 h-1 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-accent hidden md:block mr-4"
        />
      </div>

      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center relative z-10 px-6 pt-16">
        <motion.span 
          key={activeTheme.name}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-[10px] uppercase tracking-[0.2em] text-brand-accent mb-4 text-center mt-12 md:mt-0 transition-opacity duration-700 ${isZenMode ? "opacity-0" : "opacity-100"}`}
        >
          {activeTheme.name} Room
        </motion.span>
        
        <h1 className={`text-4xl md:text-5xl font-serif text-brand-text mb-4 text-center transition-all duration-700 ${isZenMode ? "opacity-0 h-0 overflow-hidden mb-0" : "opacity-100 h-auto"}`}>Quiet Focus</h1>
        <p className={`text-brand-soft text-center max-w-lg mb-12 md:mb-16 leading-relaxed transition-all duration-700 ${isZenMode ? "opacity-0 h-0 overflow-hidden mb-0" : "opacity-100 h-auto"}`}>
          A space to drop your shoulders, set your intention, and do your deep work gently.
        </p>

        <FocusTimer onTimerActiveChange={setIsTimerActive} isZenMode={isZenMode} onZenModeToggle={() => setIsZenMode(!isZenMode)} />
        
        <div className={`w-full transition-all duration-700 ${isZenMode ? "opacity-0 pointer-events-none translate-y-10" : "opacity-100 translate-y-0"}`}>
          <FocusThemeSelector 
            activeTheme={activeTheme} 
            onSelectTheme={setActiveTheme} 
            audioMode={audioMode}
            setAudioMode={setAudioMode}
            audioYoutubeId={audioYoutubeId}
            setAudioYoutubeId={setAudioYoutubeId}
            setLocalAudioFile={setLocalAudioFile}
          />
        </div>
      </div>
    </div>
  );
}
