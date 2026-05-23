"use client";

import { useEffect, useState } from "react";
import { useCollection } from "./useCollection";

export function useReadingProgress(itemId: string) {
  const [progress, setProgress] = useState(0);
  const { isSaved, updateItem } = useCollection();

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll percentage
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      const scrollableDistance = documentHeight - windowHeight;
      if (scrollableDistance <= 0) return;

      const percentage = Math.min(100, Math.max(0, Math.round((scrollTop / scrollableDistance) * 100)));
      setProgress(percentage);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync to collection when progress changes significantly (every 10%)
  useEffect(() => {
    if (isSaved(itemId)) {
      const roundedProgress = Math.round(progress / 10) * 10;
      updateItem(itemId, { readingProgress: roundedProgress });
    }
  }, [Math.round(progress / 10), itemId, isSaved, updateItem]);

  return progress;
}
