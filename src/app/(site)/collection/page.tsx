"use client";

import { useCollection } from "@/hooks/useCollection";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CollectionPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { collection, removeItem } = useCollection();

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-5xl mx-auto w-full pb-32 font-serif">
      <header className="mb-16 border-b border-brand-border pb-8">
        <h1 className="text-4xl md:text-5xl text-brand-text mb-4">My Collection</h1>
        <p className="text-brand-soft font-sans tracking-widest uppercase text-xs">
          {isSignedIn ? "Safely stored in your account." : "Stored locally in your browser. Sign in to save permanently."}
        </p>
      </header>

      {collection.length === 0 ? (
        <div className="text-center py-24 border border-brand-border border-dashed rounded-xl">
          <p className="text-brand-soft text-lg mb-4">Your collection is empty.</p>
          <Link href="/search" className="text-xs uppercase tracking-widest text-brand-text hover:text-brand-accent transition-colors border-b border-brand-text pb-1">
            Explore the Sanctuary
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collection.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-brand-card border border-brand-border rounded-xl p-6 flex flex-col justify-between group hover:border-brand-accent transition-colors"
            >
              <div>
                <span className="text-[10px] uppercase tracking-widest text-brand-soft mb-2 block">
                  {item.type}
                </span>
                <h3 className="text-xl text-brand-text mb-4 line-clamp-2 leading-snug">
                  {item.title}
                </h3>
              </div>
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-brand-border/50">
                <Link 
                  href={item.url}
                  className="text-xs uppercase tracking-widest text-brand-text hover:text-brand-accent transition-colors"
                >
                  Read →
                </Link>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-[10px] uppercase tracking-widest text-brand-soft hover:text-red-400 transition-colors"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
