"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

/**
 * A library of internal "house ads" promoting QH products.
 * Each ad is designed to feel like a gentle recommendation, not an interruption.
 */
const adLibrary = [
  // Books
  {
    id: "book-tired-hearts",
    emoji: "📖",
    label: "From Our Library",
    headline: "A Small Book for Tired Hearts",
    body: "A gentle story and reflection book for anyone tired of being strong.",
    cta: "Read Free Preview",
    url: "/books/a-small-book-for-tired-hearts",
    tags: ["book", "free", "emotional"],
  },
  {
    id: "ebook-tired-hearts",
    emoji: "📱",
    headline: "A Small Book for Tired Hearts — Ebook",
    label: "Digital Download",
    body: "Take it with you. Read it at 3AM when the world is too loud.",
    cta: "Get Ebook — $2.99",
    url: "/books/a-small-book-for-tired-hearts-ebook",
    tags: ["ebook", "paid", "emotional"],
  },
  {
    id: "ebook-heavy-things",
    emoji: "🪶",
    headline: "The Art of Putting the Heavy Things Down",
    label: "Free Ebook",
    body: "A quiet guide on burnout, rest guilt, overthinking, and learning to exhale.",
    cta: "Read for Free",
    url: "/books/putting-heavy-things-down",
    tags: ["ebook", "free", "burnout"],
  },
  // Toolkit
  {
    id: "toolkit-promo",
    emoji: "🧰",
    headline: "The Soft Toolkit",
    label: "20 Free Tools",
    body: "Clinical tools for worry, panic, ADHD & overthinking. Based on CBT, DBT & psychology.",
    cta: "Explore Toolkit",
    url: "/toolkit",
    tags: ["toolkit", "free", "anxiety"],
  },
  // Individual Tools
  {
    id: "tool-worry",
    emoji: "🌫️",
    headline: "Worry Dissolver",
    label: "Soft Toolkit",
    body: "Type your worries and watch them dissolve into smoke. Nothing is saved.",
    cta: "Try It Free",
    url: "/toolkit/worry-dissolver",
    tags: ["tool", "free", "anxiety"],
  },
  {
    id: "tool-panic",
    emoji: "🕰️",
    headline: "Panic Redirector",
    label: "Soft Toolkit",
    body: "A guided 5-4-3-2-1 grounding exercise to pull you back to the present.",
    cta: "Try It Free",
    url: "/toolkit/panic-redirector",
    tags: ["tool", "free", "panic"],
  },
  {
    id: "tool-brain-dump",
    emoji: "🧠",
    headline: "Brain Dump",
    label: "Soft Toolkit",
    body: "Too many tabs open in your mind? Get them all out in one place.",
    cta: "Try It Free",
    url: "/toolkit/brain-dump",
    tags: ["tool", "free", "adhd"],
  },
  // Sanctuary Pass
  {
    id: "sanctuary-pass",
    emoji: "🌿",
    headline: "The Sanctuary Pass",
    label: "Membership",
    body: "Unlock all 20 premium tools, ad-free reading & quiet mode. Support the sanctuary.",
    cta: "Learn More — $4.99/mo",
    url: "/sanctuary-pass",
    tags: ["membership", "paid", "premium"],
  },
  // Store
  {
    id: "store-notion",
    emoji: "🗂️",
    headline: "ADHD Life System — Notion",
    label: "Notion Template",
    body: "Complete Notion dashboard for ADHD management & daily planning.",
    cta: "View Template — $9.99",
    url: "/store",
    tags: ["notion", "paid", "adhd"],
  },
  {
    id: "store-planner",
    emoji: "📓",
    headline: "Soft Living Planner",
    label: "Notion Template",
    body: "Weekly planner for intentional, soft living. Designed for tired hearts.",
    cta: "View Planner — $4.99",
    url: "/store",
    tags: ["notion", "paid", "planner"],
  },
  // Newsletter
  {
    id: "newsletter",
    emoji: "📬",
    headline: "The Quiet Letter",
    label: "Newsletter",
    body: "Soft essays for tired hearts, sent twice a month. No spam, no hustle.",
    cta: "Subscribe Free",
    url: "/",
    tags: ["newsletter", "free", "community"],
  },
];

// ===========================
// VARIANT: Inline (between content sections — blog posts, articles)
// A single-line, minimal suggestion that blends with the reading flow
// ===========================
export function QuietAdInline({ exclude, tags }: { exclude?: string[]; tags?: string[] }) {
  const [ad, setAd] = useState<typeof adLibrary[0] | null>(null);

  useEffect(() => {
    let pool = adLibrary;
    if (exclude?.length) pool = pool.filter(a => !exclude.includes(a.id));
    if (tags?.length) {
      const tagged = pool.filter(a => a.tags.some(t => tags.includes(t)));
      if (tagged.length > 0) pool = tagged;
    }
    setAd(pool[Math.floor(Math.random() * pool.length)]);
  }, []);

  if (!ad) return null;

  return (
    <div className="my-12 py-6 border-t border-b border-brand-border/30">
      <Link href={ad.url} className="group flex items-center gap-4 max-w-2xl mx-auto">
        <span className="text-2xl shrink-0 grayscale group-hover:grayscale-0 transition-all duration-300">{ad.emoji}</span>
        <div className="flex-1 min-w-0">
          <span className="text-[9px] uppercase tracking-widest text-brand-accent font-bold">{ad.label}</span>
          <p className="text-sm font-serif text-brand-text line-clamp-1 group-hover:text-brand-accent transition-colors">{ad.headline}</p>
        </div>
        <span className="text-[9px] uppercase tracking-widest text-brand-soft group-hover:text-brand-accent transition-colors shrink-0 hidden sm:block">
          {ad.cta} →
        </span>
      </Link>
    </div>
  );
}

// ===========================
// VARIANT: Card (sidebar / between grid items)
// A small card that looks like a natural part of the page layout
// ===========================
export function QuietAdCard({ exclude, tags }: { exclude?: string[]; tags?: string[] }) {
  const [ad, setAd] = useState<typeof adLibrary[0] | null>(null);

  useEffect(() => {
    let pool = adLibrary;
    if (exclude?.length) pool = pool.filter(a => !exclude.includes(a.id));
    if (tags?.length) {
      const tagged = pool.filter(a => a.tags.some(t => tags.includes(t)));
      if (tagged.length > 0) pool = tagged;
    }
    setAd(pool[Math.floor(Math.random() * pool.length)]);
  }, []);

  if (!ad) return null;

  return (
    <Link href={ad.url}
      className="group rounded-2xl overflow-hidden transition-all flex flex-col bg-brand-card border border-dashed border-brand-accent/30 hover:border-brand-accent/60 shadow-sm hover:shadow-md"
    >
      <div className="h-28 md:h-36 flex items-center justify-center relative transition-colors bg-brand-accent/5 border-b border-brand-accent/10">
        <span className="text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-300">{ad.emoji}</span>
        <span className="absolute top-2 left-2 text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full text-brand-accent bg-brand-accent/10 border border-brand-accent/20">
          {ad.label}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm md:text-base font-serif mb-1 line-clamp-2 leading-snug group-hover:text-brand-accent transition-colors text-brand-text">
          {ad.headline}
        </h3>
        <p className="text-[11px] line-clamp-2 flex-grow text-brand-soft">{ad.body}</p>
        <div className="mt-3 pt-3 border-t border-brand-border/40">
          <span className="text-[10px] uppercase tracking-widest font-bold text-brand-accent group-hover:text-brand-text">
            {ad.cta} →
          </span>
        </div>
      </div>
    </Link>
  );
}

// ===========================
// VARIANT: Banner (full-width, between major sections)
// A beautiful, ambient banner that feels like part of the page
// ===========================
export function QuietAdBanner({ exclude, tags }: { exclude?: string[]; tags?: string[] }) {
  const [ad, setAd] = useState<typeof adLibrary[0] | null>(null);

  useEffect(() => {
    let pool = adLibrary;
    if (exclude?.length) pool = pool.filter(a => !exclude.includes(a.id));
    if (tags?.length) {
      const tagged = pool.filter(a => a.tags.some(t => tags.includes(t)));
      if (tagged.length > 0) pool = tagged;
    }
    setAd(pool[Math.floor(Math.random() * pool.length)]);
  }, []);

  if (!ad) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
      <Link href={ad.url} className="group block rounded-2xl p-6 md:p-8 text-center transition-all bg-brand-card border border-brand-border hover:border-brand-accent/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-accent/[0.03] pointer-events-none" />
        <div className="relative z-10">
          <span className="text-3xl mb-3 block">{ad.emoji}</span>
          <span className="text-[9px] uppercase tracking-widest text-brand-accent font-bold block mb-2">{ad.label}</span>
          <h3 className="text-xl md:text-2xl font-serif text-brand-text mb-2 group-hover:text-brand-accent transition-colors">{ad.headline}</h3>
          <p className="text-sm text-brand-soft mb-4 max-w-md mx-auto font-serif italic">{ad.body}</p>
          <span className="inline-block px-6 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all bg-brand-text text-brand-bg group-hover:bg-brand-accent group-hover:scale-105">
            {ad.cta}
          </span>
        </div>
      </Link>
    </div>
  );
}
