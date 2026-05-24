"use client";
import { useEffect } from "react";

export default function ViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    // Fire-and-forget: increment view count from client so auth cookie is present
    fetch(`/api/posts/${postId}/view`, { method: "POST" }).catch(() => {});
  }, [postId]);
  return null;
}
