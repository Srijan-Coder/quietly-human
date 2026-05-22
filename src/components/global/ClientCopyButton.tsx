"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function ClientCopyButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL: ", err);
    }
  };

  return (
    <button 
      onClick={handleCopy}
      type="button" 
      className={`px-6 py-3 border transition-colors duration-500 rounded-full text-xs tracking-widest uppercase relative overflow-hidden ${
        copied 
          ? "border-brand-accent text-brand-bg bg-brand-accent" 
          : "border-brand-border text-brand-text hover:border-brand-accent hover:text-brand-accent"
      }`}
    >
      <motion.span
        initial={false}
        animate={{ y: copied ? -30 : 0, opacity: copied ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="block"
      >
        Copy Link
      </motion.span>
      
      <motion.span
        initial={false}
        animate={{ y: copied ? 0 : 30, opacity: copied ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        Copied!
      </motion.span>
    </button>
  );
}
