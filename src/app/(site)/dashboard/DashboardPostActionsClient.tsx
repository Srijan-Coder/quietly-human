"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardPostActionsClient({ postId, slug, username, candleCount }: { postId: string, slug: string, username: string, candleCount: number }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        setError("Failed");
      }
    } catch (e: any) {
      setError("Error");
    } finally {
      setIsDeleting(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-3">
        {error && <span className="text-xs text-red-400 font-sans">{error}</span>}
        <span className="text-[10px] uppercase tracking-widest text-brand-soft font-bold font-sans">Sure?</span>
        <button 
          onClick={handleDelete} 
          disabled={isDeleting}
          className="text-[10px] uppercase tracking-widest bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-full font-bold hover:bg-red-500/20 transition-all cursor-pointer font-sans"
        >
          {isDeleting ? "Deleting..." : "Yes, Delete"}
        </button>
        <button 
          onClick={() => { setShowConfirm(false); setError(""); }}
          className="text-[10px] uppercase tracking-widest text-brand-soft border border-brand-border/40 px-4 py-2 rounded-full hover:text-brand-text hover:border-brand-text transition-all cursor-pointer font-sans"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs font-sans text-brand-soft bg-brand-bg border border-brand-border/20 px-3.5 py-1.5 rounded-full">🕯️ {candleCount}</span>
      <Link href={`/edit/${postId}`} className="text-[10px] uppercase tracking-widest text-brand-text hover:text-brand-accent transition-colors font-sans border border-brand-border/40 hover:border-brand-accent/50 px-5 py-2.5 rounded-full">
        Edit
      </Link>
      <button 
        onClick={() => setShowConfirm(true)} 
        className="text-[10px] uppercase tracking-widest text-brand-soft hover:text-red-400 transition-colors font-sans border border-transparent px-3 py-2.5 rounded-full cursor-pointer"
      >
        Delete
      </button>
      <Link href={`/room/${username}/${slug}`} className="text-[10px] uppercase tracking-widest text-brand-bg bg-brand-text hover:scale-105 transition-all font-sans px-5 py-2.5 rounded-full font-bold cursor-pointer">
        View
      </Link>
    </div>
  );
}
