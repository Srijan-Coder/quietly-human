"use client";

import { useLocalStorage } from "./useLocalStorage";
import { useEffect } from "react";

export function useHeatmap() {
  // Store dates as YYYY-MM-DD strings
  const [activityDates, setActivityDates] = useLocalStorage<string[]>("quietly-heatmap", []);

  const logActivity = () => {
    const today = new Date().toISOString().split('T')[0];
    if (!activityDates.includes(today)) {
      setActivityDates([...activityDates, today]);
    }
  };

  // Automatically log an activity when the hook is mounted (e.g. visiting collection or using a tool)
  useEffect(() => {
    logActivity();
  }, []);

  return { activityDates, logActivity };
}
