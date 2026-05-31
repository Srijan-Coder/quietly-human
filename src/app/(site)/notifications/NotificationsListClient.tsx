"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function NotificationsListClient({ initialNotifications, unreadIds }: { initialNotifications: any[]; unreadIds: string[] }) {
  const [filter, setFilter] = useState<"all" | "follow" | "candle" | "comment">("all");

  // Mark unread notifications as read after a 2-second delay
  useEffect(() => {
    if (unreadIds.length === 0) return;
    const timer = setTimeout(async () => {
      try {
        await fetch("/api/notifications/mark-read", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: unreadIds }),
        });
      } catch {
        // silently fail
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [unreadIds]);

  const filteredNotifications = initialNotifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "follow" && n.type === "follow") return true;
    if (filter === "candle" && (n.type === "candle_post" || n.type === "candle_note")) return true;
    if (filter === "comment" && n.type === "comment_post") return true;
    return false;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* FILTER TABS */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(["all", "follow", "candle", "comment"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-all whitespace-nowrap font-sans ${filter === f ? 'bg-brand-accent text-brand-bg font-bold' : 'bg-brand-card text-brand-soft hover:text-brand-text border border-brand-border'}`}
          >
            {f === "all" ? "All Activity" : f === "follow" ? "Follows" : f === "candle" ? "Candles" : "Comments"}
          </button>
        ))}
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden min-h-[40vh]">
        {filteredNotifications && filteredNotifications.length > 0 ? (
          <div className="divide-y divide-brand-border/50">
            {filteredNotifications.map((notif: any) => {
              const actor = notif.profiles;
              const actorName = actor?.display_name || actor?.username || "A quiet human";
              let message = "";
              let icon = "";
              
              if (notif.type === "follow") {
                message = `quietly entered your room.`;
                icon = "🚪";
              } else if (notif.type === "candle_post") {
                message = `lit a candle for your writing.`;
                icon = "🕯️";
              } else if (notif.type === "candle_note") {
                message = `lit a candle for your Pilgrim Note.`;
                icon = "🕯️";
              } else if (notif.type === "comment" || notif.type === "comment_post") {
                message = `left a reader note on your post.`;
                icon = "✍️";
              }

              return (
                <div key={notif.id} className={`p-5 flex items-start gap-4 hover:bg-brand-bg/50 transition-colors ${!notif.is_read ? 'bg-brand-accent/5' : ''}`}>
                  {/* Actor avatar */}
                  {actor?.avatar_url ? (
                    <Image
                      src={actor.avatar_url}
                      alt={actorName}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-sm font-serif text-brand-text shrink-0">
                      {actorName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-brand-text leading-relaxed text-sm">
                      {actor?.username ? (
                        <Link href={`/room/${actor.username}`} className="font-bold hover:text-brand-accent transition-colors">
                          {actorName}
                        </Link>
                      ) : (
                        <span className="font-bold">{actorName}</span>
                      )}
                      {" "}
                      <span className="text-brand-soft">{message}</span>
                    </p>
                    <span className="text-[10px] text-brand-soft font-sans opacity-50 mt-0.5 block">
                      {new Date(notif.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <span className="text-xl shrink-0">{icon}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-16 text-center flex flex-col justify-center items-center">
            <span className="text-4xl opacity-20 mb-4 block">🍃</span>
            <p className="text-brand-soft italic font-serif">
              {filter === "all" ? "Your notifications are silent." : `No ${filter}s yet.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
