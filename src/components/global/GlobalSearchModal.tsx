"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { searchSanctuary, GlobalSearchResult } from "@/actions/search";

export function GlobalSearchModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 1) {
        setIsSearching(true);
        const res = await searchSanctuary(query);
        setResults(res);
        setIsSearching(false);
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const getUrl = (item: GlobalSearchResult) => {
    if (item._type === "profile" && item.username) return `/room/${item.username}`;
    const slug = item.slug?.current;
    if (!slug) return "#";
    switch (item._type) {
      case "post": return `/blog/${slug}`;
      case "letter": return `/letters/${slug}`;
      case "guide": return `/guides/${slug}`;
      case "ebook": return `/read/${slug}`;
      default: return "#";
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case "profile": return "Creator";
      case "post": return "Thought";
      case "letter": return "Letter";
      case "guide": return "Guide";
      case "ebook": return "Book";
      default: return type;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-brand-bg/95 backdrop-blur-md overflow-y-auto pt-32 px-6 pb-24 flex flex-col items-center"
        >
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 text-xs uppercase tracking-widest text-brand-soft hover:text-brand-accent transition-colors"
          >
            Close Esc
          </button>

          <div className="w-full max-w-3xl mx-auto flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-4 block text-center">Sanctuary Search</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a feeling, word, or topic..."
              className="w-full bg-transparent border-b-2 border-brand-border pb-6 text-center text-3xl md:text-5xl font-serif outline-none focus:border-brand-accent transition-colors text-brand-text placeholder:text-brand-soft/30"
            />

            <div className="mt-16 w-full flex flex-col gap-4">
              {isSearching && (
                <p className="text-center text-brand-soft italic font-serif">Searching the sanctuary...</p>
              )}

              {!isSearching && query.length > 1 && results.length === 0 && (
                <p className="text-center text-brand-soft italic font-serif">Nothing was found. Keep breathing, keep looking.</p>
              )}

              {!isSearching && results.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {results.map((item) => (
                    <Link key={item._id} href={getUrl(item)} onClick={onClose}>
                      <div className="p-6 border border-brand-border rounded-xl bg-brand-card hover:border-brand-accent transition-all duration-300 hover:scale-[1.02] cursor-pointer h-full flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-3 block">{getLabel(item._type)}</span>
                        <h3 className="font-serif text-2xl text-brand-text mb-2">{item.title}</h3>
                        {(item.subtitle || item.excerpt) && (
                          <p className="text-sm text-brand-soft line-clamp-2">
                            {item.subtitle || item.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
