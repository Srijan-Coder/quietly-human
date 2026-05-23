"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import { useCollection } from "@/hooks/useCollection";
import { motion } from "framer-motion";

interface SaveButtonProps {
  item: {
    id: string;
    title: string;
    url: string;
    type: "Letter" | "Guide" | "Thought" | "Book" | "letter" | "post" | "book" | "product" | "guide";
  };
  className?: string;
}

export function SaveButton({ item, className = "" }: SaveButtonProps) {
  const { isSaved, saveItem, removeItem } = useCollection();
  
  const [mounted, setMounted] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <button className={`opacity-0 ${className}`}>Save</button>;

  const saved = isSaved(item.id);

  const toggleSave = () => {
    if (saved) {
      removeItem(item.id);
    } else {
      saveItem(item as any);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    }
  };

  return (
    <button
      onClick={toggleSave}
      className={`group flex items-center gap-2 text-xs uppercase tracking-widest transition-colors ${
        saved ? "text-brand-accent" : "text-brand-soft hover:text-brand-text"
      } ${className}`}
    >
      <motion.div animate={justSaved ? { scale: [1, 1.2, 1] } : {}}>
        {saved ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        )}
      </motion.div>
      <span>{saved ? "Saved" : "Save to Collection"}</span>
    </button>
  );
}
