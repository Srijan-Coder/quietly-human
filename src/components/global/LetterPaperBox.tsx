"use client";

import { useState, useEffect } from "react";

export function LetterPaperBox({ children }: { children: React.ReactNode }) {
  const [styleIndex, setStyleIndex] = useState(0);

  useEffect(() => {
    // Pick a random style index from 0 to 3 on mount
    setStyleIndex(Math.floor(Math.random() * 4));
  }, []);

  // 4 Subtle paper variations that adapt to light/dark mode seamlessly
  const paperStyles = [
    "bg-[#fdfcf8] dark:bg-[#1E1C1A] border-[#e2dfd2] dark:border-[#2E2A27] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] -rotate-1",
    "bg-[#fdfbf6] dark:bg-[#1A1816] border-[#e8e4d9] dark:border-[#282522] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] rotate-1",
    "bg-[#fefdfa] dark:bg-[#201D1B] border-[#e5e1d5] dark:border-[#322E2B] shadow-[0_2px_15px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.3)] -rotate-[0.5deg]",
    "bg-[#faf8f2] dark:bg-[#161514] border-[#dfdbce] dark:border-[#2A2724] shadow-[0_6px_25px_rgba(0,0,0,0.03)] dark:shadow-[0_6px_25px_rgba(0,0,0,0.4)] rotate-[0.5deg]"
  ];

  return (
    <div className={`transition-all duration-700 ease-in-out p-8 md:p-16 border rounded-sm text-brand-text ${paperStyles[styleIndex]}`}>
      {/* Dynamic text colors that map exactly to the light/dark theme variables for perfect contrast */}
      <div className="prose prose-lg max-w-none prose-p:text-brand-text prose-headings:text-brand-text prose-a:text-brand-accent prose-blockquote:border-brand-accent prose-blockquote:text-brand-soft prose-li:text-brand-text prose-strong:text-brand-text prose-em:text-brand-text">
        {children}
      </div>
    </div>
  );
}
