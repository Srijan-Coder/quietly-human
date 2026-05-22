"use client";

import { motion } from "framer-motion";
import { SaveButton } from "@/components/global/SaveButton";
import { ShareQuoteButton } from "@/components/global/ShareQuoteButton";
import { useState } from "react";

const cardBg: Record<string, string> = {
  warm: "bg-brand-card",
  dark: "bg-[#181411]",
  sage: "bg-[#e8ede8]",
  blush: "bg-[#f5e8e4]",
  midnight: "bg-[#0f0d0b]",
};

const cardText: Record<string, string> = {
  warm: "text-brand-text",
  dark: "text-[#F0E8DC]",
  sage: "text-[#2a3828]",
  blush: "text-[#3a2220]",
  midnight: "text-[#C9956A]",
};

export interface Quote {
  _id: string;
  text: string;
  author?: string;
  cardColor?: string;
  emotionTags?: string[];
}

function QuoteCard({ quote, index }: { quote: Quote; index: number }) {
  const [copied, setCopied] = useState(false);
  const bg = cardBg[quote.cardColor || "warm"];
  const text = cardText[quote.cardColor || "warm"];

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${quote.text}" — ${quote.author || "Quietly Humans"}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: (index % 6) * 0.08 }}
      whileHover={{ y: -6, rotateX: 2, rotateY: -1 }}
      style={{ transformStyle: "preserve-3d" }}
      className={`group relative p-8 md:p-10 rounded-2xl border border-brand-border flex flex-col justify-between min-h-[220px] ${bg} shadow-sm hover:shadow-xl transition-shadow duration-500`}
    >
      <div className={`font-serif text-xl md:text-2xl leading-relaxed text-balance italic ${text} mb-6`}>
        &quot;{quote.text}&quot;
      </div>

      {quote.author && (
        <div className={`text-xs uppercase tracking-widest opacity-60 ${text}`}>
          — {quote.author}
        </div>
      )}

      {/* Actions — reveal on hover */}
      <div className="absolute bottom-4 right-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <ShareQuoteButton text={quote.text} />
        <button
          onClick={handleCopy}
          className="text-[10px] uppercase tracking-widest border border-brand-border px-3 py-1.5 rounded-full hover:border-brand-accent hover:text-brand-accent transition-colors bg-brand-bg/80 backdrop-blur-sm"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <SaveButton
          item={{ id: quote._id, title: quote.text.slice(0, 60), url: "/quotes", type: "guide" }}
          className="text-[10px] border border-brand-border px-3 py-1.5 rounded-full hover:border-brand-accent bg-brand-bg/80 backdrop-blur-sm"
        />
      </div>

      {/* Emotion tags */}
      {!!quote.emotionTags?.length && (
        <div className="flex flex-wrap gap-2 mb-4">
          {quote.emotionTags.map((tag: string) => (
            <span key={tag} className="text-[9px] uppercase tracking-widest text-brand-accent opacity-60">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function QuoteWall({ quotes }: { quotes: Quote[] }) {
  if (quotes.length === 0) {
    return (
      <div className="text-center py-24 border border-dashed border-brand-border rounded-2xl">
        <p className="font-serif italic text-brand-soft">
          No quotes yet. Go to your Studio and add the first one.
        </p>
      </div>
    );
  }

  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      {quotes.map((quote, i) => (
        <div key={quote._id} className="break-inside-avoid">
          <QuoteCard quote={quote} index={i} />
        </div>
      ))}
    </div>
  );
}
