"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LikeButton({ documentId, initialLikes = 0 }: { documentId: string, initialLikes?: number }) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // Check local storage to see if they already liked this
  useEffect(() => {
    const likedCache = localStorage.getItem(`liked_${documentId}`);
    if (likedCache === "true") {
      setHasLiked(true);
    }
  }, [documentId]);

  const handleLike = async () => {
    if (hasLiked || isLiking) return;

    setIsLiking(true);
    
    // Optimistic UI update
    setLikes(prev => prev + 1);
    setHasLiked(true);
    localStorage.setItem(`liked_${documentId}`, "true");

    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId }),
      });
      
      const data = await res.json();
      if (data.success && data.likes) {
        setLikes(data.likes);
      }
    } catch (error) {
      console.error("Failed to like:", error);
      // Revert optimistic update on error
      setLikes(prev => prev - 1);
      setHasLiked(false);
      localStorage.removeItem(`liked_${documentId}`);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={hasLiked || isLiking}
      className={`group flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
        hasLiked 
          ? "border-brand-accent/50 bg-brand-accent/10" 
          : "border-brand-border hover:border-brand-accent bg-transparent"
      }`}
    >
      <motion.div
        animate={hasLiked ? { scale: [1, 1.5, 1] } : {}}
        transition={{ duration: 0.4 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={hasLiked ? "var(--color-accent)" : "none"}
          stroke={hasLiked ? "var(--color-accent)" : "currentColor"}
          strokeWidth="1.5"
          className={`w-5 h-5 ${hasLiked ? "text-brand-accent" : "text-brand-soft group-hover:text-brand-accent transition-colors"}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.span 
          key={likes}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          className={`text-xs font-mono ${hasLiked ? "text-brand-accent" : "text-brand-soft"}`}
        >
          {likes > 0 ? likes : ""}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
