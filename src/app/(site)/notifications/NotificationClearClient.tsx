"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NotificationClearClient({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClear = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications/clear", { method: "POST" });
      if (res.ok) {
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleClear}
      disabled={loading}
      className="text-[10px] uppercase tracking-widest font-sans text-brand-soft hover:text-red-400 transition-colors disabled:opacity-50"
    >
      Clear All
    </button>
  );
}
