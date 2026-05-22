"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { motion } from "framer-motion";

export type SavedItem = {
  id: string;
  title: string;
  url: string;
  type: "guide" | "letter" | "book" | "product";
  dateSaved: number;
};

interface SaveButtonProps {
  item: Omit<SavedItem, "dateSaved">;
  className?: string;
}

export function SaveButton({ item, className = "" }: SaveButtonProps) {
  const [savedItems, setSavedItems] = useLocalStorage<SavedItem[]>("quietly-human-collection", []);
  const [isSaved, setIsSaved] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    setIsSaved(savedItems.some((i) => i.id === item.id));
  }, [savedItems, item.id]);

  const toggleSave = () => {
    if (isSaved) {
      setSavedItems(savedItems.filter((i) => i.id !== item.id));
      setIsSaved(false);
    } else {
      setSavedItems([...savedItems, { ...item, dateSaved: Date.now() }]);
      setIsSaved(true);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    }
  };

  return (
    <button
      onClick={toggleSave}
      className={`group flex items-center gap-2 text-xs uppercase tracking-widest transition-colors ${
        isSaved ? "text-brand-accent" : "text-brand-soft hover:text-brand-text"
      } ${className}`}
    >
      <motion.div animate={justSaved ? { scale: [1, 1.2, 1] } : {}}>
        {isSaved ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        )}
      </motion.div>
      <span>{isSaved ? "Saved" : "Save to Collection"}</span>
    </button>
  );
}
