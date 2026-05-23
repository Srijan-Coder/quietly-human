"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { searchSanctuary, GlobalSearchResult } from "@/actions/search";

export function StandaloneSearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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
    const slug = item.slug?.current;
    if (!slug) return "#";
    switch (item._type) {
      case "post": return `/blog/${slug}`;
      case "letter": return `/letters/${slug}`;
      case "guide": return `/guides/${slug}`;
      case "ebook": return `/books/${slug}`;
      case "book": return `/books/${slug}`;
      default: return "#";
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case "post": return "Thought";
      case "letter": return "Letter";
      case "guide": return "Guide";
      case "ebook": return "Book";
      case "book": return "Book";
      default: return type;
    }
  };

  return (
    <div className="w-full flex flex-col items-center relative">
      <button 
        onClick={() => router.back()}
        className="absolute -top-16 right-0 md:-top-24 opacity-60 hover:opacity-100 transition-opacity p-2 flex items-center gap-2 text-xs uppercase tracking-widest text-brand-text"
      >
        <span>Close</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="w-full max-w-3xl mx-auto flex flex-col">
        <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-4 block text-center">Sanctuary Search</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a feeling, word, or topic..."
          className="w-full bg-transparent border-b-2 border-brand-border pb-6 text-center text-3xl md:text-5xl font-serif outline-none focus:border-brand-accent transition-colors text-brand-text placeholder:text-brand-soft/30"
          autoFocus
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
                <Link key={item._id} href={getUrl(item)}>
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
    </div>
  );
}
