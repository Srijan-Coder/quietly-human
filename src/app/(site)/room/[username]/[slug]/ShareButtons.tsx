"use client";

import { useState } from "react";

type ShareButtonsProps = {
  title: string;
  url: string;
};

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Clipboard write failed silently
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${title}" — @quietlyhuman\n\n`)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-sans font-bold transition-all hover:scale-105 bg-brand-card border border-brand-border hover:border-brand-accent/50 text-brand-soft hover:text-brand-text"
      >
        𝕏 Share
      </a>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-sans font-bold transition-all hover:scale-105 bg-brand-card border border-brand-border hover:border-brand-accent/50 text-brand-soft hover:text-brand-text"
      >
        💬 WhatsApp
      </a>
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-sans font-bold transition-all hover:scale-105 bg-brand-card border border-brand-border hover:border-brand-accent/50 text-brand-soft hover:text-brand-text"
      >
        {copied ? "✓ Copied" : "🔗 Copy Link"}
      </button>
    </div>
  );
}
