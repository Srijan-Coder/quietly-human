"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function FollowButton({ targetUserId, initialIsFollowing }: { targetUserId: string, initialIsFollowing: boolean }) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleFollow = async () => {
    if (!isSignedIn) {
      alert("Please sign in to follow creators.");
      return;
    }

    setLoading(true);
    // Optimistic update
    setIsFollowing(!isFollowing);

    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId, action: isFollowing ? "unfollow" : "follow" })
      });

      if (!res.ok) {
        throw new Error("Failed to follow");
      }
      
      router.refresh(); // Refresh to update server components (follower count)
    } catch (error) {
      // Revert optimistic update
      setIsFollowing(isFollowing);
      alert("Failed to update follow status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleFollow}
      disabled={loading}
      className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all font-bold ${
        isFollowing 
          ? "bg-brand-card text-brand-soft border border-brand-border hover:bg-brand-bg hover:text-red-400" 
          : "bg-brand-text text-brand-bg hover:bg-brand-accent hover:text-white"
      }`}
    >
      {isFollowing ? (loading ? "..." : "Following") : (loading ? "..." : "Follow")}
    </button>
  );
}
