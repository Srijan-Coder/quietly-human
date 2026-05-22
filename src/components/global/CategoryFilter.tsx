"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CategoryFilter({ categories, currentCategory }: { categories: string[], currentCategory?: string }) {
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();

  // If there are many categories, show first 5, else show all
  const limit = 5;
  const isExpandable = categories.length > limit;
  const visibleCategories = showAll ? categories : categories.slice(0, limit);

  return (
    <div className="flex flex-wrap gap-3 mb-16 border-b border-brand-border pb-8 items-center">
      <button 
        onClick={() => router.push('/blog')}
        className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-colors ${
          !currentCategory 
            ? "bg-brand-text text-brand-bg hover:bg-brand-accent hover:text-white" 
            : "border border-brand-border text-brand-text hover:border-brand-accent hover:text-brand-accent"
        }`}
      >
        All
      </button>
      {visibleCategories.map((cat) => (
        <button
          key={cat}
          onClick={() => router.push(`/blog?category=${encodeURIComponent(cat)}`)}
          className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-colors ${
            currentCategory === cat
              ? "bg-brand-text text-brand-bg hover:bg-brand-accent hover:text-white border border-transparent"
              : "border border-brand-border text-brand-text hover:border-brand-accent hover:text-brand-accent"
          }`}
        >
          {cat}
        </button>
      ))}
      
      {isExpandable && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-4 py-2 text-xs uppercase tracking-widest text-brand-soft hover:text-brand-accent transition-colors"
        >
          {showAll ? "Show Less ↑" : `+ ${categories.length - limit} More`}
        </button>
      )}
    </div>
  );
}
