"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareToolButtonProps {
  url: string;
  title: string;
  text: string;
}

export function ShareToolButton({ url, title, text }: ShareToolButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // If Web Share API is available (usually mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to clipboard (usually desktop)
      try {
        await navigator.clipboard.writeText(`${text}\n\n${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-6 py-3 border border-brand-accent/50 bg-brand-accent/10 rounded-full text-xs uppercase tracking-widest text-brand-accent hover:bg-brand-accent hover:text-brand-bg transition-colors"
      >
        <span>✉️</span> Share with a friend
      </button>

      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] text-center px-4 py-2 bg-brand-text text-brand-bg rounded-lg text-xs font-serif italic shadow-lg"
          >
            Link copied! Send it to someone who needs a quiet moment.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
