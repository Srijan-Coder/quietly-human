"use client";

import { useCollection, type CollectionItem } from "@/hooks/useCollection";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function BookmarkButton({ item }: { item: Omit<CollectionItem, "dateSaved"> }) {
  const { isSaved, saveItem, removeItem } = useCollection();
  
  // Hydration safety
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-8 h-8" />; // placeholder

  const saved = isSaved(item.id);

  const toggleBookmark = () => {
    if (saved) {
      removeItem(item.id);
    } else {
      saveItem(item);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      className="group relative flex items-center justify-center w-10 h-10 rounded-full border border-brand-border bg-brand-card hover:border-brand-accent transition-colors"
      aria-label={saved ? "Remove from Collection" : "Save to Collection"}
    >
      <motion.svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor" 
        strokeWidth="1.5" 
        className={`w-4 h-4 transition-colors duration-300 ${saved ? "text-brand-accent" : "text-brand-soft group-hover:text-brand-accent"}`}
        animate={saved ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
      </motion.svg>
    </button>
  );
}
