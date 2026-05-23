"use client";

import { useCollection, CollectionItem } from "@/hooks/useCollection";
import { useState, useEffect } from "react";
import { useHeatmap } from "@/hooks/useHeatmap";

type SaveToCollectionButtonProps = {
  item: Omit<CollectionItem, "dateSaved" | "folderId" | "privateNote" | "hasAudioNote" | "readingProgress">;
  className?: string;
};

export function SaveToCollectionButton({ item, className = "" }: SaveToCollectionButtonProps) {
  const { isSaved, saveItem, removeItem } = useCollection();
  const { logActivity } = useHeatmap();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const saved = isSaved(item.id);

  const toggleSave = () => {
    if (saved) {
      removeItem(item.id);
    } else {
      saveItem(item);
      logActivity();
    }
  };

  const labelColor = saved ? "text-brand-accent" : "text-brand-soft hover:text-brand-text";

  return (
    <button
      onClick={toggleSave}
      className={["flex items-center gap-2 text-xs uppercase tracking-widest transition-colors", labelColor, className].join(" ")}
      title={saved ? "Remove from Vault" : "Save to Vault"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-4 h-4"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
      </svg>
      <span className="hidden md:inline">{saved ? "Saved" : "Save"}</span>
    </button>
  );
}
