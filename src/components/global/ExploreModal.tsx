"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-brand-bg/98 backdrop-blur-xl overflow-y-auto py-24 px-6 md:px-12"
        >
          <button
            onClick={onClose}
            className="fixed top-8 right-8 text-xs uppercase tracking-widest text-brand-soft hover:text-brand-accent transition-colors z-[110]"
          >
            Close ✕
          </button>

          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-center mb-16"
            >
              <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-4 block font-bold">Explore Everything</span>
              <h2 className="text-4xl md:text-5xl font-serif text-brand-text">Every quiet room, in one place.</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {sections.map((section, sIdx) => (
                <motion.div
                  key={section.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + sIdx * 0.08, duration: 0.5 }}
                >
                  <h3 className="text-[10px] uppercase tracking-widest text-brand-accent mb-6 font-bold border-b border-brand-border pb-3">
                    {section.label}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {section.items.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={onClose}
                        className="flex items-start gap-4 p-4 rounded-2xl hover:bg-brand-card border border-transparent hover:border-brand-border transition-all group"
                      >
                        <span className="text-2xl mt-0.5 grayscale group-hover:grayscale-0 transition-all duration-300">
                          {item.emoji}
                        </span>
                        <div>
                          <p className="text-brand-text font-bold group-hover:text-brand-accent transition-colors text-sm">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-brand-soft mt-0.5 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
