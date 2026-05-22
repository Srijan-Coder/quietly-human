"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const emotionalPrompts = [
  "I feel behind in life",
  "I am overthinking everything",
  "I am just deeply tired",
  "I feel like I'm running out of time",
  "I am scared of the future",
  "I don't know who I am anymore",
  "I am pretending to be okay",
  "I feel invisible to the people I love",
  "I am grieving a past version of myself",
  "I am overwhelmed by my own thoughts",
  "I feel like a burden",
  "I am terrified of failing",
  "I feel disconnected from my body",
  "I am holding onto too much anger",
  "I feel like I haven't done enough",
  "I am exhausted by trying to be perfect",
  "I feel lonely even when I'm not alone",
  "I am afraid of being forgotten",
  "I feel like everyone else is moving forward",
  "I am tired of being strong for others",
  "I feel guilty for resting",
  "I don't know how to forgive myself",
  "I am grieving something I never had",
  "I feel paralyzed by my choices",
  "I am scared to trust again",
  "I feel like a fraud",
  "I am overwhelmed by the state of the world",
  "I feel completely numb",
  "I don't know how to ask for help",
  "I am constantly apologizing for existing",
  "I feel like I am too much",
  "I feel like I am not enough",
  "I am terrified of being abandoned",
  "I don't know what makes me happy anymore",
  "I feel like I've wasted so much time",
  "I am trying to heal but it hurts",
  "I feel deeply misunderstood",
  "I am exhausted from masking",
  "I feel like I am grieving someone who is still alive",
  "I am scared of my own mind",
  "I don't feel safe in my own skin",
  "I feel like I am fading away"
];

export function EmotionalPath() {
  const [prompts, setPrompts] = useState<string[]>([]);

  useEffect(() => {
    // Shuffle and pick 5 random prompts on client mount to avoid hydration errors
    const shuffled = [...emotionalPrompts].sort(() => 0.5 - Math.random());
    setPrompts(shuffled.slice(0, 5));
  }, []);

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-24 border-t border-brand-border">
      <div className="text-center mb-16">
        <span className="text-xs uppercase tracking-widest text-brand-accent mb-4 block">Begin Here</span>
        <h2 className="text-3xl md:text-5xl font-serif text-brand-text">How are you feeling right now?</h2>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {prompts.length === 0 ? (
          // Skeleton loader to maintain layout before hydration
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 w-64 bg-brand-border/20 rounded-full animate-pulse" />
          ))
        ) : (
          <AnimatePresence>
            {prompts.map((prompt, i) => (
              <motion.div
                key={prompt}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              >
                <Link 
                  href={`/search?q=${encodeURIComponent(prompt)}`}
                  className="px-8 py-5 border border-brand-border rounded-full text-center hover:border-brand-accent hover:bg-brand-card transition-all duration-500 cursor-pointer group flex items-center justify-center bg-brand-bg shadow-sm hover:shadow-md"
                >
                  <span className="text-sm md:text-base font-serif text-brand-text group-hover:text-brand-accent transition-colors italic">
                    &quot;{prompt}&quot;
                  </span>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
