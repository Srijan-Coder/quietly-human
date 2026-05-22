"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type FontSize = "normal" | "large" | "xlarge";

interface ReadingModeContextType {
  isReadingMode: boolean;
  setIsReadingMode: (val: boolean) => void;
  fontSize: FontSize;
  setFontSize: (val: FontSize) => void;
  scrollProgress: number;
}

const ReadingModeContext = createContext<ReadingModeContextType | undefined>(undefined);

export function ReadingModeProvider({ children }: { children: React.ReactNode }) {
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("normal");
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll progress globally when in reading mode
  useEffect(() => {
    const handleScroll = () => {
      if (!isReadingMode) return;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isReadingMode]);

  return (
    <ReadingModeContext.Provider value={{ isReadingMode, setIsReadingMode, fontSize, setFontSize, scrollProgress }}>
      <div className={`min-h-screen transition-all duration-1000 ${isReadingMode ? "bg-brand-bg/50" : ""}`}>
        {children}
      </div>
    </ReadingModeContext.Provider>
  );
}

export function useReadingMode() {
  const context = useContext(ReadingModeContext);
  if (context === undefined) {
    throw new Error("useReadingMode must be used within a ReadingModeProvider");
  }
  return context;
}
