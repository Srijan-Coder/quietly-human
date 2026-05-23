"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type VisualTheme = {
  id: string;
  name: string;
  bgImage?: string;
  youtubeId?: string; // Muted video background
  icon: string;
};

export const BUILT_IN_THEMES: VisualTheme[] = [
  { id: "train", name: "Midnight Train", bgImage: "https://images.unsplash.com/photo-1515155075601-23009d0cb6d4?q=80&w=1600&auto=format&fit=crop", icon: "🚂" },
  { id: "airplane", name: "Airplane Cabin", bgImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1600&auto=format&fit=crop", icon: "✈️" },
  { id: "cafe", name: "Rainy Cafe", bgImage: "https://images.unsplash.com/photo-1445116572660-236099cecd07?q=80&w=1600&auto=format&fit=crop", icon: "☕" },
  { id: "library", name: "Quiet Library", bgImage: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1600&auto=format&fit=crop", icon: "📚" },
  { id: "forest", name: "Deep Forest", bgImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1600&auto=format&fit=crop", icon: "🌲" },
  { id: "ocean", name: "Ocean Waves", bgImage: "https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=1600&auto=format&fit=crop", icon: "🌊" },
  { id: "snow", name: "Snowy Cabin", bgImage: "https://images.unsplash.com/photo-1514632595-4944383f2737?q=80&w=1600&auto=format&fit=crop", icon: "❄️" },
  { id: "study", name: "Late Night Study", bgImage: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1600&auto=format&fit=crop", icon: "🌙" },
  { id: "storm", name: "Gentle Storm", bgImage: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1600&auto=format&fit=crop", icon: "⛈️" },
  { id: "sunrise", name: "Sunrise Flight", bgImage: "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?q=80&w=1600&auto=format&fit=crop", icon: "🌅" },
];

interface Props {
  activeTheme: VisualTheme;
  onSelectTheme: (theme: VisualTheme) => void;
  audioMode: "none" | "youtube" | "local";
  setAudioMode: (mode: "none" | "youtube" | "local") => void;
  audioYoutubeId: string;
  setAudioYoutubeId: (id: string) => void;
  setLocalAudioFile: (fileUrl: string | null) => void;
}

export default function FocusThemeSelector({ 
  activeTheme, onSelectTheme, audioMode, setAudioMode, audioYoutubeId, setAudioYoutubeId, setLocalAudioFile
}: Props) {
  const [showPanel, setShowPanel] = useState<"none" | "bgYoutube" | "audioYoutube">("none");
  const [ytInput, setYtInput] = useState("");

  const extractYTId = (url: string) => {
    try {
      if (url.includes("v=")) return url.split("v=")[1].split("&")[0];
      if (url.includes("youtu.be/")) return url.split("youtu.be/")[1].split("?")[0];
      return url;
    } catch {
      return url;
    }
  };

  const handleYtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractYTId(ytInput);
    if (!id) return;

    if (showPanel === "bgYoutube") {
      onSelectTheme({
        id: "yt_bg",
        name: "Video Vibe",
        youtubeId: id,
        icon: "🎬"
      });
    } else if (showPanel === "audioYoutube") {
      setAudioMode("youtube");
      setAudioYoutubeId(id);
      localStorage.setItem("quietly_custom_audio_yt", id);
    }
    setShowPanel("none");
    setYtInput("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onSelectTheme({
        id: "local_bg",
        name: "My Space",
        bgImage: url,
        icon: "🖼️"
      });
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioMode("local");
      setLocalAudioFile(url);
    }
  };

  return (
    <div className="w-full mt-16 max-w-4xl mx-auto px-4 z-20">
      
      {/* Visual Themes Row */}
      <span className="text-[10px] uppercase tracking-widest text-brand-soft mb-4 block text-center">Room Visuals</span>
      <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar justify-start md:justify-center items-center">
        
        {/* Custom Visual Buttons */}
        <label className="cursor-pointer flex flex-col items-center gap-2 p-3 min-w-[80px] rounded-2xl hover:bg-brand-card/50 border border-brand-border/30 opacity-60 hover:opacity-100 transition-all duration-300">
          <span className="text-2xl">🖼️</span>
          <span className="text-[10px] uppercase tracking-wider text-brand-text whitespace-nowrap">Image</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>

        <button
          onClick={() => setShowPanel(showPanel === "bgYoutube" ? "none" : "bgYoutube")}
          className={`flex flex-col items-center gap-2 p-3 min-w-[80px] rounded-2xl transition-all duration-300 ${
            activeTheme.id === "yt_bg" || showPanel === "bgYoutube"
              ? "bg-brand-card border border-brand-accent shadow-sm" 
              : "hover:bg-brand-card/50 border border-brand-border/30 opacity-60 hover:opacity-100"
          }`}
        >
          <span className="text-2xl">🎬</span>
          <span className="text-[10px] uppercase tracking-wider text-brand-text whitespace-nowrap">YT Video</span>
        </button>

        <div className="w-px h-8 bg-brand-border/50 mx-2" />

        {BUILT_IN_THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => {
              onSelectTheme(theme);
              setShowPanel("none");
            }}
            className={`flex flex-col items-center gap-2 p-3 min-w-[80px] rounded-2xl transition-all duration-300 ${
              activeTheme.id === theme.id 
                ? "bg-brand-card border border-brand-accent shadow-sm" 
                : "hover:bg-brand-card/50 border border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <span className="text-2xl">{theme.icon}</span>
            <span className="text-[10px] uppercase tracking-wider text-brand-text whitespace-nowrap">{theme.name}</span>
          </button>
        ))}
      </div>

      {/* Audio Options Row */}
      <span className="text-[10px] uppercase tracking-widest text-brand-soft mb-4 mt-6 block text-center">Room Audio</span>
      <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar justify-center items-center">
        
        <button
          onClick={() => { setAudioMode("none"); setLocalAudioFile(null); }}
          className={`flex flex-col items-center gap-2 p-3 min-w-[80px] rounded-2xl transition-all duration-300 ${
            audioMode === "none"
              ? "bg-brand-card border border-brand-accent shadow-sm" 
              : "hover:bg-brand-card/50 border border-transparent opacity-60 hover:opacity-100"
          }`}
        >
          <span className="text-2xl">🔇</span>
          <span className="text-[10px] uppercase tracking-wider text-brand-text whitespace-nowrap">Silent</span>
        </button>

        <label className={`cursor-pointer flex flex-col items-center gap-2 p-3 min-w-[80px] rounded-2xl transition-all duration-300 ${
            audioMode === "local"
              ? "bg-brand-card border border-brand-accent shadow-sm" 
              : "hover:bg-brand-card/50 border border-transparent opacity-60 hover:opacity-100"
          }`}>
          <span className="text-2xl">🎵</span>
          <span className="text-[10px] uppercase tracking-wider text-brand-text whitespace-nowrap">Local MP3</span>
          <input type="file" accept="audio/*" className="hidden" onChange={handleAudioUpload} />
        </label>

        <button
          onClick={() => setShowPanel(showPanel === "audioYoutube" ? "none" : "audioYoutube")}
          className={`flex flex-col items-center gap-2 p-3 min-w-[80px] rounded-2xl transition-all duration-300 ${
            audioMode === "youtube" || showPanel === "audioYoutube"
              ? "bg-brand-card border border-brand-accent shadow-sm" 
              : "hover:bg-brand-card/50 border border-transparent opacity-60 hover:opacity-100"
          }`}
        >
          <span className="text-2xl">🎧</span>
          <span className="text-[10px] uppercase tracking-wider text-brand-text whitespace-nowrap">YT Audio</span>
        </button>

      </div>

      {/* Dynamic Input Panel */}
      <AnimatePresence>
        {showPanel !== "none" && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="w-full max-w-md mx-auto mt-4 overflow-hidden"
          >
            <form onSubmit={handleYtSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder={showPanel === "bgYoutube" ? "Paste YouTube Video URL..." : "Paste YouTube Audio URL..."}
                value={ytInput}
                onChange={(e) => setYtInput(e.target.value)}
                className="flex-1 bg-brand-card border border-brand-border rounded-full px-6 py-3 text-sm text-brand-text focus:outline-none focus:border-brand-accent"
              />
              <button 
                type="submit"
                className="bg-brand-text text-brand-bg px-6 py-3 rounded-full text-xs uppercase tracking-widest hover:bg-brand-accent transition-colors"
              >
                Set
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
