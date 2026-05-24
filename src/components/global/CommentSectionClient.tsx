"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

type Comment = {
  id: string;
  post_id: string;
  content: string;
  candle_count: number;
  has_creator_heart: boolean;
  is_pinned: boolean;
  created_at: string;
  author: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
};

export default function CommentSectionClient({ postId, postAuthorId, isPremium }: { postId: string, postAuthorId: string, isPremium: boolean }) {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/public-thoughts?postId=${postId}`);
      const data = await res.json();
      if (data.comments) setComments(data.comments);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async () => {
    if (!newComment.trim() || !user) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/public-thoughts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: newComment })
      });

      // Guard: Vercel can return HTML on errors — never call .json() blindly
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        console.error("Server returned non-JSON:", res.status, res.statusText);
        alert("Failed to post thought: Server error. Please try again in a moment.");
        return;
      }

      const data = await res.json();

      if (res.ok) {
        setNewComment("");
        fetchComments();
      } else {
        alert(`Failed to post thought: ${data.error || "Unknown error"}`);
      }
    } catch (e: any) {
      console.error(e);
      alert(`Network error: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAction = async (id: string, action: "heart" | "pin" | "candle") => {
    if (!user) {
      alert("Please sign in to interact.");
      return;
    }
    
    // Optimistic UI updates could go here
    try {
      await fetch(`/api/public-thoughts/${id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      fetchComments();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="mt-24 border-t border-white/5 pt-16">
      <h3 className="text-xl font-serif text-white mb-8 flex items-center gap-3">
        <span className="text-2xl">💬</span> Public Thoughts ({comments.length})
      </h3>

      {/* New Comment Input */}
      {user ? (
        <div className="mb-12 flex flex-col gap-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share a quiet thought..."
            className="w-full bg-black/50 border border-white/10 rounded-2xl p-6 text-white font-serif resize-none focus:outline-none focus:border-brand-accent min-h-[120px]"
          />
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !newComment.trim()}
            className="self-end px-8 py-3 bg-white text-black rounded-full text-[10px] uppercase tracking-widest font-bold disabled:opacity-50 hover:scale-105 transition-transform"
          >
            {isSubmitting ? "Sending..." : "Send Thought"}
          </button>
        </div>
      ) : (
        <div className="mb-12 p-8 bg-black/50 border border-white/5 rounded-2xl text-center">
          <p className="text-brand-soft font-sans text-sm">Please sign in to share your thoughts.</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className={`p-6 md:p-8 rounded-[2rem] border transition-colors ${comment.is_pinned ? 'bg-brand-accent/5 border-brand-accent/20' : 'bg-[#121212] border-white/5'}`}>
            
            {comment.is_pinned && (
              <div className="text-[10px] uppercase tracking-widest text-brand-accent font-bold mb-4 flex items-center gap-2">
                <span>📌</span> Pinned by Creator
              </div>
            )}

            <div className="flex items-start gap-4">
              {comment.author.avatar_url ? (
                <Image src={comment.author.avatar_url} alt={comment.author.username} width={40} height={40} className="rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-xs font-sans text-brand-soft shrink-0">
                  {comment.author.display_name?.charAt(0) || comment.author.username.charAt(0)}
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-sm">{comment.author.display_name || comment.author.username}</span>
                    {comment.author.id === postAuthorId && (
                      <span className="bg-brand-accent/20 text-brand-accent text-[9px] uppercase px-2 py-0.5 rounded-full border border-brand-accent/30">Author</span>
                    )}
                    <span className="text-brand-soft text-[10px]">• {new Date(comment.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
                
                <p className="text-brand-soft leading-relaxed font-serif whitespace-pre-wrap">{comment.content}</p>

                <div className="mt-6 flex items-center gap-6">
                  {/* Candle Action */}
                  <button onClick={() => handleAction(comment.id, 'candle')} className="flex items-center gap-2 text-xs font-sans text-brand-soft hover:text-white transition-colors">
                    <span className="text-lg">🕯️</span> {comment.candle_count}
                  </button>

                  {/* Creator Heart Indicator */}
                  {comment.has_creator_heart && (
                    <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded-full border border-red-400/20">
                      <span>❤️</span> Loved by Creator
                    </div>
                  )}

                  {/* Creator specific actions */}
                  {user?.id === postAuthorId && (
                    <div className="ml-auto flex items-center gap-4">
                      <button onClick={() => handleAction(comment.id, 'heart')} className="text-xs text-brand-soft hover:text-red-400 transition-colors" title="Give Creator Heart">
                        ❤️
                      </button>
                      <button onClick={() => handleAction(comment.id, 'pin')} className={`text-xs transition-colors ${isPremium ? 'text-brand-soft hover:text-brand-accent' : 'text-white/20 cursor-not-allowed'}`} title={isPremium ? "Pin Comment" : "Sanctuary Pass Required to Pin"}>
                        📌 {isPremium ? '' : '🔒'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-brand-soft italic text-center py-12">No thoughts yet. Be the first to break the silence.</p>
        )}
      </div>
    </div>
  );
}
