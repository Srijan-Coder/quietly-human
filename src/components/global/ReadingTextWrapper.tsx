"use client";

import { useReadingMode } from "@/context/ReadingModeContext";

export function ReadingTextWrapper({ children }: { children: React.ReactNode }) {
  const { fontSize, isReadingMode } = useReadingMode();

  const sizeClasses = {
    normal: "prose-lg",
    large: "prose-xl",
    xlarge: "prose-2xl",
  };

  return (
    <div 
      className={`prose prose-stone max-w-none font-serif text-brand-text leading-relaxed prose-headings:font-sans prose-headings:font-normal prose-headings:text-brand-soft prose-a:text-brand-accent transition-all duration-700 ${sizeClasses[fontSize]} ${isReadingMode ? "opacity-100" : "opacity-90"}`}
    >
      {children}
    </div>
  );
}
