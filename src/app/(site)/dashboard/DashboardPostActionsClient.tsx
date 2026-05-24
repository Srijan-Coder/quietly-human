"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardPostActionsClient({ postId, slug, username, candleCount }: { postId: string, slug: string, username: string, candleCount: number }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post forever?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete post");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-sans text-brand-soft bg-black/50 px-4 py-2 rounded-full border border-white/5">🕯️ {candleCount}</span>
      <Link href={`/edit/${postId}`} className="text-[10px] uppercase tracking-widest text-white hover:text-brand-accent transition-colors font-sans border border-white/10 hover:border-brand-accent/50 px-6 py-2.5 rounded-full">
        Edit
      </Link>
      <button onClick={handleDelete} disabled={isDeleting} className="text-[10px] uppercase tracking-widest text-white/50 hover:text-red-400 transition-colors font-sans border border-transparent px-4 py-2.5 rounded-full disabled:opacity-50">
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
      <Link href={`/room/${username}/${slug}`} className="text-[10px] uppercase tracking-widest text-black bg-white hover:bg-white/80 transition-all font-sans px-6 py-2.5 rounded-full ml-2 font-bold">
        View
      </Link>
    </div>
  );
}
