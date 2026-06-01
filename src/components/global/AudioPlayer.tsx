"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const YouTube = dynamic(() => import("react-youtube").then((mod) => mod.default), {
  ssr: false,
  loading: () => null,
});

type Track = {
  id: string;
  name: string;
  url: string; 
};

const tracks: Track[] = [
  { id: "rain", name: "Midnight Rain", url: "/audio/rain.mp3" },
  { id: "piano", name: "Soft Piano", url: "/audio/piano.mp3" },
  { id: "cafe", name: "Quiet Cafe", url: "/audio/cafe.mp3" },
  { id: "study", name: "Deep Focus", url: "/audio/study.mp3" },
];

export function AudioPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);
  
  // Custom states
  const [audioMode, setAudioMode] = useState<"none" | "default" | "local" | "youtube">("none");
  const [youtubeId, setYoutubeId] = useState("");
  const [localUrl, setLocalUrl] = useState<string | null>(null);
  const [ytInput, setYtInput] = useState("");
  const [showYtInput, setShowYtInput] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytRef = useRef<any>(null);

  useEffect(() => {
    const savedYt = localStorage.getItem("quietly_global_yt_audio");
    if (savedYt) {
      setYoutubeId(savedYt);
    }
  }, []);

  // Sync HTML5 Audio
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && (audioMode === "default" || audioMode === "local")) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioMode, activeTrack, localUrl]);

  // Sync YouTube Audio
  useEffect(() => {
    if (ytRef.current) {
      if (isPlaying && audioMode === "youtube") {
        ytRef.current.playVideo();
      } else {
        ytRef.current.pauseVideo();
      }
    }
  }, [isPlaying, audioMode, youtubeId]);

  const togglePlayDefault = (track: Track) => {
    if (activeTrack?.id === track.id && audioMode === "default") {
      setIsPlaying(!isPlaying);
    } else {
      setActiveTrack(track);
      setAudioMode("default");
      if (audioRef.current) {
        audioRef.current.src = track.url;
      }
      setIsPlaying(true);
    }
  };

  const handleLocalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLocalUrl(url);
      setAudioMode("local");
      if (audioRef.current) {
        audioRef.current.src = url;
      }
      setActiveTrack({ id: "local", name: "Local Audio", url });
      setIsPlaying(true);
    }
  };

  const handleYtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let id = ytInput;
    try {
      if (ytInput.includes("v=")) id = ytInput.split("v=")[1].split("&")[0];
      else if (ytInput.includes("youtu.be/")) id = ytInput.split("youtu.be/")[1].split("?")[0];
    } catch {}

    setYoutubeId(id);
    localStorage.setItem("quietly_global_yt_audio", id);
    setAudioMode("youtube");
    setActiveTrack({ id: "youtube", name: "YouTube Stream", url: "" });
    setIsPlaying(true);
    setShowYtInput(false);
    setYtInput("");
  };

  const toggleGlobalPlay = () => {
    if (audioMode === "none" && activeTrack) {
      setAudioMode(activeTrack.id === "youtube" ? "youtube" : activeTrack.id === "local" ? "local" : "default");
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <audio ref={audioRef} loop />
      
      {youtubeId && (
        <div className="hidden">
          <YouTube 
            videoId={youtubeId} 
            opts={{ playerVars: { autoplay: 0, loop: 1, playlist: youtubeId, controls: 0 } }} 
            onReady={(e) => { ytRef.current = e.target; if (isPlaying && audioMode === "youtube") e.target.playVideo(); }}
          />
        </div>
      )}

      {/* Floating UI */}
      <div id="global-audio-player" className="fixed bottom-6 left-6 z-50 flex flex-col-reverse items-start gap-4">
        
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
              <h3 className="text-[10px] uppercase tracking-widest opacity-50 mb-4 px-2">Site Background Audio</h3>
              
              <div className="flex flex-col gap-1 mb-4">
                {tracks.map((track) => {
                  const isActive = activeTrack?.id === track.id && audioMode === "default";
                  return (
                    <button
                      key={track.id}
                      onClick={() => togglePlayDefault(track)}
                      className={`text-left px-3 py-2 rounded-lg text-xs tracking-wide transition-colors flex items-center justify-between ${
                        isActive && isPlaying
                          ? "bg-brand-accent/10 text-brand-accent"
                          : "hover:bg-brand-bg text-brand-soft hover:text-brand-text"
                      }`}
                    >
                      <span>{track.name}</span>
                      {isActive && isPlaying && (
                        <motion.div className="flex gap-[2px] items-end h-3" initial="hidden" animate="playing">
                          {[0, 1, 2].map((i) => (
                            <motion.div key={i} className="w-[2px] bg-brand-accent rounded-full" animate={{ height: ["4px", "12px", "4px"] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }} />
                          ))}
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-brand-border/50 pt-2 flex flex-col gap-1">
                <label className={`cursor-pointer text-left px-3 py-2 rounded-lg text-xs tracking-wide transition-colors flex items-center justify-between ${audioMode === "local" && isPlaying ? "bg-brand-accent/10 text-brand-accent" : "hover:bg-brand-bg text-brand-soft hover:text-brand-text"}`}>
                  <span>Upload Local MP3</span>
                  <input type="file" accept="audio/*" className="hidden" onChange={handleLocalUpload} />
                  {audioMode === "local" && isPlaying && (
                    <motion.div className="flex gap-[2px] items-end h-3" initial="hidden" animate="playing">
                      {[0, 1, 2].map((i) => <motion.div key={i} className="w-[2px] bg-brand-accent rounded-full" animate={{ height: ["4px", "12px", "4px"] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }} /> )}
                    </motion.div>
                  )}
                </label>

                <button onClick={() => setShowYtInput(!showYtInput)} className={`text-left px-3 py-2 rounded-lg text-xs tracking-wide transition-colors flex items-center justify-between ${audioMode === "youtube" && isPlaying ? "bg-brand-accent/10 text-brand-accent" : "hover:bg-brand-bg text-brand-soft hover:text-brand-text"}`}>
                  <span>YouTube Link</span>
                  {audioMode === "youtube" && isPlaying && (
                    <motion.div className="flex gap-[2px] items-end h-3" initial="hidden" animate="playing">
                      {[0, 1, 2].map((i) => <motion.div key={i} className="w-[2px] bg-brand-accent rounded-full" animate={{ height: ["4px", "12px", "4px"] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }} /> )}
                    </motion.div>
                  )}
                </button>
              </div>

              <AnimatePresence>
                {showYtInput && (
                  <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} onSubmit={handleYtSubmit} className="mt-2 flex gap-2">
                    <input type="text" placeholder="Paste YT URL..." value={ytInput} onChange={(e) => setYtInput(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded px-2 py-1 text-xs text-brand-text" />
                    <button type="submit" className="bg-brand-text text-brand-bg px-3 rounded text-[10px] uppercase tracking-widest">Set</button>
                  </motion.form>
                )}
              </AnimatePresence>

              {activeTrack && (
                <div className="mt-4 px-2 pt-4 border-t border-brand-border flex items-center justify-between">
                  <span className="text-[10px] text-brand-soft truncate max-w-[120px]">
                    Playing: {activeTrack.name}
                  </span>
                  <button onClick={toggleGlobalPlay} className="text-[10px] uppercase tracking-widest text-brand-accent hover:opacity-70">
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
