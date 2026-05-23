"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type Theme = {
  id: string;
  name: string;
  youtubeId: string;
  bgImage: string;
  icon: string;
};

export const BUILT_IN_THEMES: Theme[] = [
  { id: "train", name: "Midnight Train", youtubeId: "mFdE3G_iIeQ", bgImage: "https://images.unsplash.com/photo-1515155075601-23009d0cb6d4?q=80&w=1600&auto=format&fit=crop", icon: "🚂" },
  { id: "airplane", name: "Airplane Cabin", youtubeId: "co7KLSrIkDQ", bgImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1600&auto=format&fit=crop", icon: "✈️" },
  { id: "cafe", name: "Rainy Cafe", youtubeId: "c9pQYOGIWM8", bgImage: "https://images.unsplash.com/photo-1445116572660-236099cecd07?q=80&w=1600&auto=format&fit=crop", icon: "☕" },
  { id: "library", name: "Quiet Library", youtubeId: "4vIQON2fDWM", bgImage: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1600&auto=format&fit=crop", icon: "📚" },
  { id: "forest", name: "Deep Forest", youtubeId: "xNN7iTA57jM", bgImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1600&auto=format&fit=crop", icon: "🌲" },
  { id: "ocean", name: "Ocean Waves", youtubeId: "nepFndq_Q9Q", bgImage: "https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=1600&auto=format&fit=crop", icon: "🌊" },
  { id: "snow", name: "Snowy Cabin", youtubeId: "WKzHq2mP_F0", bgImage: "https://images.unsplash.com/photo-1514632595-4944383f2737?q=80&w=1600&auto=format&fit=crop", icon: "❄️" },
  { id: "study", name: "Late Night Study", youtubeId: "jfKfPfyJRdk", bgImage: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1600&auto=format&fit=crop", icon: "🌙" },
  { id: "storm", name: "Gentle Storm", youtubeId: "nDq6TstdEi8", bgImage: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1600&auto=format&fit=crop", icon: "⛈️" },
  { id: "sunrise", name: "Sunrise Flight", youtubeId: "K1zN406N718", bgImage: "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?q=80&w=1600&auto=format&fit=crop", icon: "🌅" },
];

interface Props {
  activeTheme: Theme;
  onSelectTheme: (theme: Theme) => void;
  customUrl: string;
  onSetCustomUrl: (url: string) => void;
}

export default function FocusThemeSelector({ activeTheme, onSelectTheme, customUrl, onSetCustomUrl }: Props) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [inputValue, setInputValue] = useState(customUrl);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSetCustomUrl(inputValue);
    
    // Extract video ID from youtube url
    let videoId = "";
    try {
      if (inputValue.includes("v=")) {
        videoId = inputValue.split("v=")[1].split("&")[0];
      } else if (inputValue.includes("youtu.be/")) {
        videoId = inputValue.split("youtu.be/")[1].split("?")[0];
      } else {
        videoId = inputValue; // Assume it's an ID
      }
    } catch (err) {}

    onSelectTheme({
      id: "custom",
      name: "Custom Vibe",
      youtubeId: videoId,
      bgImage: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1600&auto=format&fit=crop",
      icon: "🎵"
    });
    setShowCustomInput(false);
  };

  return (
    <div className="w-full mt-16 max-w-4xl mx-auto px-4 z-20">
      <span className="text-[10px] uppercase tracking-widest text-brand-soft mb-4 block text-center">Room Atmosphere</span>
      
      <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar justify-start md:justify-center">
        {/* Custom Audio Button */}
        <button
          onClick={() => setShowCustomInput(!showCustomInput)}
          className={`flex flex-col items-center gap-2 p-3 min-w-[80px] rounded-2xl transition-all duration-300 ${
            activeTheme.id === "custom" || showCustomInput
              ? "bg-brand-card border border-brand-accent shadow-sm" 
              : "hover:bg-brand-card/50 border border-transparent opacity-60 hover:opacity-100"
          }`}
        >
          <span className="text-2xl">🎵</span>
          <span className="text-[10px] uppercase tracking-wider text-brand-text whitespace-nowrap">Custom</span>
        </button>

        {BUILT_IN_THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => {
              onSelectTheme(theme);
              setShowCustomInput(false);
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

      {/* Custom Audio Input */}
      <AnimatePresence>
        {showCustomInput && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="w-full max-w-md mx-auto mt-4 overflow-hidden"
          >
            <form onSubmit={handleCustomSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Paste YouTube URL..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
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
