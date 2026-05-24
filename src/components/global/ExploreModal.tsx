"use client";

import { useEffect } from "react";
import Link from "next/link";

const sections = [
  {
    label: "Read & Discover",
    items: [
      { title: "The Reading Room", path: "/reading-room", emoji: "📖", desc: "Network feed, curated posts & creator profiles." },
      { title: "The Quiet Store", path: "/store", emoji: "🏷️", desc: "Books, journals, Notion templates & digital products." },
      { title: "The Library", path: "/library", emoji: "📚", desc: "Browse the full archive of published writings." },
      { title: "Quotes", path: "/quotes", emoji: "💬", desc: "A collection of quiet words from quiet minds." },
      { title: "Books", path: "/books", emoji: "📕", desc: "Free ebooks, premium editions & physical books." },
    ]
  },
  {
    label: "Heal & Focus",
    items: [
      { title: "Soft Toolkit", path: "/toolkit", emoji: "🧰", desc: "20 interactive clinical tools for anxiety, ADHD & overthinking." },
      { title: "Breathing Room", path: "/breathe", emoji: "🌬️", desc: "Guided deep breathing exercises." },
      { title: "Deep Focus Timer", path: "/focus", emoji: "⏳", desc: "Pomodoro timer with ambient soundscapes." },
      { title: "The 3AM Room", path: "/3am", emoji: "🌙", desc: "For when the world is asleep but your mind isn't." },
    ]
  },
  {
    label: "Create & Build",
    items: [
      { title: "Creator Dashboard", path: "/dashboard", emoji: "📊", desc: "Manage your posts, followers & analytics." },
      { title: "Write", path: "/write", emoji: "✍️", desc: "Publish Quiet Thoughts, Letters, Guides & Books." },
      { title: "Pilgrim Wall", path: "/pilgrim", emoji: "🕯️", desc: "Leave an anonymous note on the community wall." },
      { title: "Settings", path: "/settings", emoji: "⚙️", desc: "Customize your profile, bio, links & theme." },
      { title: "Start Here", path: "/start", emoji: "🧭", desc: "New? Learn what Quietly Humans is all about." },
    ]
  },
  {
    label: "Upgrade",
    items: [
      { title: "Sanctuary Pass", path: "/sanctuary-pass", emoji: "🌿", desc: "$4.99/mo — unlock all premium tools and quiet mode." },
      { title: "Digital Products", path: "/products", emoji: "📦", desc: "Notion dashboards, ebooks & journals for sale." },
    ]
  },
];

export function ExploreModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Stop Lenis smooth scrolling when modal is open
      document.documentElement.classList.add("lenis-stopped");
    } else {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("lenis-stopped");
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[100]"
      style={{
        backgroundColor: "var(--color-bg, #0d0d0d)",
        overflowY: "scroll",
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "contain",
      }}
    >
      {/* Close button — sticky at top */}
      <div className="sticky top-0 z-[110] flex justify-end p-4 md:p-6" style={{ backgroundColor: "var(--color-bg, #0d0d0d)" }}>
        <button
          onClick={onClose}
          className="text-xs uppercase tracking-widest hover:text-amber-400 transition-colors px-4 py-2 rounded-full border"
          style={{ color: "var(--color-soft, #999)", borderColor: "var(--color-border, #333)", backgroundColor: "var(--color-bg, #0d0d0d)" }}
        >
          ✕ Close
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 pb-32">
        <div className="text-center mb-10">
          <span className="text-[10px] uppercase tracking-widest mb-3 block font-bold" style={{ color: "var(--color-accent, #C9A46A)" }}>Explore Everything</span>
          <h2 className="text-3xl md:text-4xl font-serif" style={{ color: "var(--color-text, #EBE5DF)" }}>Every quiet room, in one place.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {sections.map((section) => (
            <div key={section.label}>
              <h3 className="text-[10px] uppercase tracking-widest mb-4 font-bold border-b pb-3"
                style={{ color: "var(--color-accent, #C9A46A)", borderColor: "var(--color-border, #333)" }}>
                {section.label}
              </h3>
              <div className="flex flex-col gap-1">
                {section.items.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-xl transition-colors group active:scale-[0.98]"
                    style={{ color: "var(--color-text, #EBE5DF)" }}
                  >
                    <span className="text-xl shrink-0">{item.emoji}</span>
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate group-hover:text-amber-400 transition-colors">{item.title}</p>
                      <p className="text-[11px] mt-0.5 leading-relaxed line-clamp-1" style={{ color: "var(--color-soft, #999)" }}>{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
