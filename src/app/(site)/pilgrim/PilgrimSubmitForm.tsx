"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function PilgrimSubmitForm() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      alert("Please sign in to leave a note.");
      return;
    }
    if (!content.trim() || content.length > 300) {
      setError("Notes must be between 1 and 300 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/pilgrim/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to post note");
      }

      setContent("");
      router.refresh(); // Reload the feed
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-brand-card border border-brand-border p-6 rounded-2xl relative">
      {error && (
        <div className="absolute -top-12 left-0 right-0 bg-red-500/10 border border-red-500/20 text-red-400 p-2 rounded-lg text-sm text-center font-sans">
          {error}
        </div>
      )}
      
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Write your thought here..."
        className="w-full bg-transparent border-none outline-none resize-none text-xl text-brand-text font-serif placeholder:text-brand-soft/50 min-h-[100px]"
        maxLength={300}
      />
      
      <div className="flex justify-between items-center border-t border-brand-border/50 pt-4 mt-2">
        <span className={`text-xs font-sans tracking-widest ${content.length > 250 ? 'text-brand-accent' : 'text-brand-soft/50'}`}>
          {content.length} / 300
        </span>
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="bg-brand-text text-brand-bg px-6 py-2 rounded-full uppercase tracking-widest text-[10px] font-bold hover:bg-brand-accent hover:text-white transition-all disabled:opacity-50"
        >
          {loading ? "Etching..." : "Leave Note"}
        </button>
      </div>
    </form>
  );
}
