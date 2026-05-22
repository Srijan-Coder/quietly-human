"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function EmotionalSearchClient({ initialData }: { initialData: any }) {
  const [query, setQuery] = useState("");

  const allItems = useMemo(() => {
    const items: any[] = [];
    initialData.guides?.forEach((g: any) => items.push({ ...g, type: "guide", url: `/guides/${g.slug}` }));
    initialData.letters?.forEach((l: any) => items.push({ ...l, type: "letter", url: `/letters/${l.slug}` }));
    initialData.books?.forEach((b: any) => items.push({ ...b, type: "book", url: `/read/${b.slug}` }));
    return items;
  }, [initialData]);

  const results = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    
    return allItems.filter((item) => {
      // Direct match on title
      if (item.title.toLowerCase().includes(lowerQuery)) return true;
      
      // Fuzzy emotional match on tags
      if (item.emotionTags) {
        const matchesTag = item.emotionTags.some((tag: string) => lowerQuery.includes(tag.toLowerCase()));
        if (matchesTag) return true;
      }

      return false;
    });
  }, [query, allItems]);

  return (
    <div className="w-full">
      <div className="mb-16 text-center">
        <span className="text-xs uppercase tracking-widest text-brand-accent mb-6 block">Sanctuary Search</span>
        <h1 className="text-4xl md:text-5xl font-serif text-brand-text mb-8">How are you feeling?</h1>
        
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. I feel exhausted from pretending to be okay"
            className="w-full bg-transparent border-b border-brand-border pb-4 text-center text-lg md:text-xl font-serif italic outline-none focus:border-brand-accent transition-colors placeholder:text-brand-soft/50"
            autoFocus
          />
        </div>
      </div>

      <AnimatePresence>
        {query && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {results.length > 0 ? (
              results.map((item) => (
                <Link key={item._id} href={item.url}>
                  <div className="p-6 border border-brand-border rounded-2xl bg-brand-card hover:border-brand-accent transition-colors group cursor-pointer h-full flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-2 block">{item.type}</span>
                      <h3 className="font-serif text-xl text-brand-text group-hover:opacity-70 transition-opacity">
                        {item.title}
                      </h3>
                      {item.subtitle && <p className="text-sm text-brand-soft mt-2">{item.subtitle}</p>}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 text-center py-12">
                <p className="text-brand-soft italic font-serif">I cannot find anything for this exact feeling yet. Try exploring the Library.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
