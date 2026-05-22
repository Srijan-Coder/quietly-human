"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SavedItem } from "@/components/global/SaveButton";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function CollectionPage() {
  const [savedItems, setSavedItems] = useLocalStorage<SavedItem[]>("quietly-human-collection", []);

  const removeSave = (id: string) => {
    setSavedItems(savedItems.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-5xl mx-auto w-full pb-24">
      <div className="mb-16">
        <span className="text-xs uppercase tracking-widest text-brand-accent mb-6 block">Your Sanctuary</span>
        <h1 className="text-5xl md:text-6xl font-serif text-brand-text mb-6">My Quiet Collection</h1>
        <p className="text-brand-soft font-sans max-w-2xl leading-relaxed">
          The pieces you have saved. Kept here locally on your device, just for you.
        </p>
      </div>

      {savedItems.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-brand-border rounded-2xl">
          <p className="italic text-brand-soft font-serif text-lg">Your collection is empty.</p>
          <Link href="/guides" className="text-xs uppercase tracking-widest text-brand-text hover:text-brand-accent mt-6 inline-block transition-colors">
            Explore Guides →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {savedItems.sort((a, b) => b.dateSaved - a.dateSaved).map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="p-6 border border-brand-border rounded-2xl bg-brand-card flex flex-col justify-between hover:border-brand-accent transition-colors"
              >
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-2 block">{item.type}</span>
                  <Link href={item.url} className="font-serif text-2xl text-brand-text hover:opacity-70 transition-opacity">
                    {item.title}
                  </Link>
                </div>
                <div className="mt-8 flex justify-between items-center border-t border-brand-border pt-4">
                  <Link href={item.url} className="text-xs uppercase tracking-widest text-brand-text hover:text-brand-accent transition-colors">
                    Read
                  </Link>
                  <button 
                    onClick={() => removeSave(item.id)}
                    className="text-[10px] uppercase tracking-widest text-brand-soft hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
