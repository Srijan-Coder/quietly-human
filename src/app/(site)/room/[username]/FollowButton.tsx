"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function FollowButton({
  targetUserId,
  initialIsFollowing,
}: {
  targetUserId: string;
  initialIsFollowing: boolean;
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleFollow = async () => {
    if (!isSignedIn) {
      router.push("/onboarding");
      return;
    }

    setLoading(true);
    setIsFollowing(!isFollowing); // optimistic

    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId,
          action: isFollowing ? "unfollow" : "follow",
        }),
      });

      if (!res.ok) throw new Error("Failed");

      router.refresh();
    } catch {
      setIsFollowing(isFollowing); // revert
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className="px-8 py-3.5 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50"
      style={
        isFollowing
          ? {
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.5)",
            }
          : {
              background: "rgba(255,255,255,0.9)",
              color: "#0d0d0d",
              boxShadow: "0 0 30px rgba(255,255,255,0.12)",
            }
      }
    >
      {loading ? "…" : isFollowing ? "Following" : "Follow"}
    </button>
  );
}
