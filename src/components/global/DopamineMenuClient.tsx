"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function DopamineMenuClient() {
  const [recommendation, setRecommendation] = useState<string | null>(null);

  // Hardcoded defaults for a beautiful empty state, but users can imagine editing these
  const menuItems = {
    starters: ["Drink a glass of ice water", "Stretch for 5 minutes", "Step outside for air", "Take 10 deep breaths"],
    mains: ["Read a physical book", "Work on a hobby project", "Cook a meal from scratch", "Call a friend"],
    desserts: ["Watch one episode of a show", "Play a cozy video game", "15 minutes of guilt-free scrolling"]
  };

  const getRecommendation = () => {
    const allItems = [...menuItems.starters, ...menuItems.mains]; // Don't recommend desserts automatically
    const random = allItems[Math.floor(Math.random() * allItems.length)];
    setRecommendation(null);
    setTimeout(() => setRecommendation(random), 100);
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center max-w-4xl mx-auto w-full px-6">
      <div className="text-4xl mb-6 grayscale opacity-50 mt-12">🍽️</div>
      <h2 className="font-serif text-2xl md:text-3xl text-brand-text mb-4 text-center">
        The Dopamine Menu
      </h2>
      <p className="text-brand-soft text-sm text-center mb-12 max-w-lg">
        When you feel under-stimulated and want to doomscroll, order from your menu instead. Healthy dopamine with lower friction.
      </p>

      <button
        onClick={getRecommendation}
        className="mb-16 px-8 py-3 bg-brand-accent text-brand-bg rounded-full text-xs uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(252,163,17,0.3)] hover:shadow-[0_0_30px_rgba(252,163,17,0.5)] transition-all transform hover:-translate-y-1"
      >
        Chef's Recommendation
      </button>

      <AnimatePresence>
        {recommendation && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md bg-brand-bg border-2 border-brand-accent rounded-xl p-6 mb-16 text-center shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-accent/50" />
            <p className="text-[10px] uppercase tracking-widest text-brand-accent mb-4">You should try</p>
            <h3 className="font-serif text-2xl text-brand-text">{recommendation}</h3>
            <button 
              onClick={() => setRecommendation(null)}
              className="absolute top-2 right-4 text-brand-soft hover:text-brand-text text-sm"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full grid md:grid-cols-3 gap-8">
        {/* Starters */}
        <div className="bg-brand-card/30 border border-brand-border rounded-2xl p-6">
          <h3 className="font-serif text-xl text-brand-text mb-2 text-center">Starters</h3>
          <p className="text-[10px] uppercase tracking-widest text-brand-soft text-center mb-6">Quick 5-min hits</p>
          <ul className="space-y-4">
            {menuItems.starters.map((item, i) => (
              <li key={i} className="text-sm text-brand-soft pb-4 border-b border-brand-border/30 last:border-0 last:pb-0 text-center">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Mains */}
        <div className="bg-brand-card/50 border border-brand-border rounded-2xl p-6 transform md:-translate-y-4 shadow-lg">
          <h3 className="font-serif text-2xl text-brand-text mb-2 text-center">Mains</h3>
          <p className="text-[10px] uppercase tracking-widest text-brand-soft text-center mb-6">Deep Engagement</p>
          <ul className="space-y-4">
            {menuItems.mains.map((item, i) => (
              <li key={i} className="text-base text-brand-text font-serif pb-4 border-b border-brand-border/30 last:border-0 last:pb-0 text-center">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Desserts */}
        <div className="bg-brand-card/30 border border-brand-border rounded-2xl p-6">
          <h3 className="font-serif text-xl text-brand-text mb-2 text-center">Desserts</h3>
          <p className="text-[10px] uppercase tracking-widest text-brand-soft text-center mb-6">Guilt-free indulgence</p>
          <ul className="space-y-4">
            {menuItems.desserts.map((item, i) => (
              <li key={i} className="text-sm text-brand-soft pb-4 border-b border-brand-border/30 last:border-0 last:pb-0 text-center italic">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-16 mb-12">
        <Link
          href="/toolkit"
          className="px-6 py-2 border border-brand-border rounded-full text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors"
        >
          Back to Toolkit
        </Link>
      </div>
    </div>
  );
}
