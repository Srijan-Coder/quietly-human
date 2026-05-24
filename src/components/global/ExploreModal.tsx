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
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-brand-bg"
      style={{ overflowY: "auto", WebkitOverflowScrolling: "touch" }}
    >
      {/* Close button — sticky at top */}
      <div className="sticky top-0 z-[110] flex justify-end p-4 md:p-6">
        <button
          onClick={onClose}
          className="text-xs uppercase tracking-widest text-brand-soft hover:text-brand-accent transition-colors bg-brand-bg/80 backdrop-blur-sm px-4 py-2 rounded-full border border-brand-border"
        >
          Close ✕
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-4 block font-bold">Explore Everything</span>
          <h2 className="text-3xl md:text-4xl font-serif text-brand-text">Every quiet room, in one place.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {sections.map((section) => (
            <div key={section.label}>
              <h3 className="text-[10px] uppercase tracking-widest text-brand-accent mb-4 font-bold border-b border-brand-border pb-3">
                {section.label}
              </h3>
              <div className="flex flex-col gap-1">
                {section.items.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 md:p-4 rounded-xl hover:bg-brand-card border border-transparent hover:border-brand-border transition-colors group active:scale-[0.98]"
                  >
                    <span className="text-xl md:text-2xl shrink-0">
                      {item.emoji}
                    </span>
                    <div className="min-w-0">
                      <p className="text-brand-text font-bold group-hover:text-brand-accent transition-colors text-sm truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-brand-soft mt-0.5 leading-relaxed line-clamp-1">
                        {item.desc}
                      </p>
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
