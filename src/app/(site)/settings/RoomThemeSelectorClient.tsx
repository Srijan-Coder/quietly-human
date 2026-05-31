"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';

const ROOM_THEMES = [
  { id: "dark", name: "Classic Onyx", color: "bg-[#121212]" },
  { id: "midnight-blue", name: "Midnight Blue", color: "bg-[#0a0f1c]" },
  { id: "forest-green", name: "Deep Forest", color: "bg-[#0a120c]" },
  { id: "crimson", name: "Dark Crimson", color: "bg-[#1a0a0a]" },
  { id: "sepia", name: "Warm Sepia", color: "bg-[#1c1812]" },
];

export default function RoomThemeSelectorClient({ initialTheme, userId }: { initialTheme: string, userId: string }) {
  const [theme, setTheme] = useState(initialTheme || "dark");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async (newTheme: string) => {
    setTheme(newTheme);
    setIsSaving(true);
    
    try {
      const res = await fetch("/api/settings/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomTheme: newTheme })
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (e) {
      toast.error("Failed to save theme");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        {ROOM_THEMES.map(t => (
          <button
            key={t.id}
            onClick={() => handleSave(t.id)}
            disabled={isSaving}
            className={`w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105 ${t.color} ${theme === t.id ? 'border-brand-accent' : 'border-white/10 opacity-70'}`}
          >
            <span className={`w-6 h-6 rounded-full border border-white/20 ${t.color}`}></span>
            <span className="text-[10px] uppercase tracking-widest text-brand-soft text-center px-1">
              {t.name}
            </span>
          </button>
        ))}
      </div>
      {isSaving && <span className="text-xs text-brand-soft animate-pulse">Saving theme...</span>}
    </div>
  );
}
