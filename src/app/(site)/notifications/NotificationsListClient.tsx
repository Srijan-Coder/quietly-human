"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationsListClient({ initialNotifications }: { initialNotifications: any[] }) {
  const [filter, setFilter] = useState<"all" | "follow" | "candle" | "comment">("all");

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
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
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
        <AnimatePresence mode="wait">
          {filteredNotifications && filteredNotifications.length > 0 ? (
            <motion.div 
              key={filter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="divide-y divide-brand-border/50"
            >
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
                } else if (notif.type === "comment_post") {
                  message = `left a reader note on your post.`;
                  icon = "✍️";
                }

                return (
                  <div key={notif.id} className={`p-6 flex items-start gap-4 hover:bg-brand-bg/50 transition-colors ${!notif.is_read ? 'bg-brand-accent/5' : ''}`}>
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <p className="text-brand-text leading-relaxed">
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
                      <span className="text-xs text-brand-soft font-sans opacity-50">
                        {new Date(notif.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div 
              key={`empty-${filter}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-16 text-center h-full flex flex-col justify-center items-center"
            >
              <span className="text-4xl filter grayscale opacity-30 mb-4 block">🍃</span>
              <p className="text-brand-soft italic font-serif">
                {filter === "all" ? "Your notifications are silent." : `No ${filter}s yet.`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
