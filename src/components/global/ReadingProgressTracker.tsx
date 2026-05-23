"use client";

import { useReadingProgress } from "@/hooks/useReadingProgress";

export function ReadingProgressTracker({ itemId }: { itemId: string }) {
  // Mount this hook anywhere on a scrollable reading page
  useReadingProgress(itemId);
  return null;
}
