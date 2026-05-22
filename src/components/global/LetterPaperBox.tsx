"use client";

import { useState, useEffect } from "react";

export function LetterPaperBox({ children }: { children: React.ReactNode }) {
  const [styleIndex, setStyleIndex] = useState(0);

  useEffect(() => {
    // Pick a random style index from 0 to 3 on mount
    setStyleIndex(Math.floor(Math.random() * 4));
  }, []);

  // 4 Subtle paper variations
  const paperStyles = [
    "bg-[#fdfcf8] border-[#e2dfd2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] -rotate-1",
    "bg-[#fdfbf6] border-[#e8e4d9] shadow-[0_8px_30px_rgba(0,0,0,0.04)] rotate-1",
    "bg-[#fefdfa] border-[#e5e1d5] shadow-[0_2px_15px_rgba(0,0,0,0.02)] -rotate-[0.5deg]",
    "bg-[#faf8f2] border-[#dfdbce] shadow-[0_6px_25px_rgba(0,0,0,0.03)] rotate-[0.5deg]"
  ];

  return (
    <div className={`transition-all duration-700 ease-in-out p-8 md:p-16 border rounded-sm text-brand-bg ${paperStyles[styleIndex]}`}>
      {/* We are overriding text-brand-soft etc to make it look like ink on paper */}
      <div className="prose prose-lg prose-stone max-w-none prose-p:text-stone-800 prose-headings:text-stone-900 prose-a:text-stone-600 prose-blockquote:border-stone-400 prose-blockquote:text-stone-700">
        {children}
      </div>
    </div>
  );
}
