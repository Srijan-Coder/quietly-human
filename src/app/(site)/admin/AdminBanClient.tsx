"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminBanClient({ targetId, targetType }: { targetId: string, targetType: "user" | "post" }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBan = async () => {
    if (!confirm(`Are you sure you want to permanently delete this ${targetType}? This cannot be undone.`)) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/ban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId, targetType })
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete");
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleBan}
      disabled={loading}
      className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
