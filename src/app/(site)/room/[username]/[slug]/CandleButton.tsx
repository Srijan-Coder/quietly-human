"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

export default function CandleButton({ targetId, targetType, initialCount }: { targetId: string, targetType: "post" | "note", initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const [isLit, setIsLit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isSignedIn } = useAuth();

  // In a real app we'd fetch initial isLit status from Supabase here
  // but for speed we'll rely on optimistic UI for now.

  const handleLight = async () => {
    if (!isSignedIn) {
      setError("Please sign in to light a candle.");
      setTimeout(() => setError(""), 4000);
      return;
    }

    if (isLit) return; // Can only light once

    setLoading(true);
    setIsLit(true);
    setCount(c => c + 1);

    try {
      const res = await fetch("/api/candle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId, targetType })
      });

      if (!res.ok) {
        throw new Error("Failed to light candle");
      }
    } catch (error) {
      setIsLit(false);
      setCount(c => c - 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button 
        onClick={handleLight}
        disabled={loading || isLit}
        className={`flex flex-col items-center gap-2 group transition-all duration-700 ${isLit ? 'opacity-100 scale-110' : 'opacity-60 hover:opacity-100'} cursor-pointer`}
        title="Light a candle to show you were here"
      >
        <span className={`text-4xl filter transition-all duration-1000 ${isLit ? 'drop-shadow-[0_0_15px_rgba(252,163,17,0.8)]' : 'grayscale group-hover:grayscale-0'}`}>
          🕯️
        </span>
        <span className={`text-xs font-sans tracking-widest ${isLit ? 'text-brand-accent font-bold' : 'text-brand-soft'}`}>
          {count}
        </span>
      </button>
      {error && (
        <span className="text-[10px] text-red-400 font-sans tracking-wider animate-pulse">
          {error}
        </span>
      )}
    </div>
  );
}
