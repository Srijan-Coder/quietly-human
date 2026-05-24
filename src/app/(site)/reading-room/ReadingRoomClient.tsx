"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ReadingRoomClient({ initialPosts }: { initialPosts: any[] }) {
  const [activeTab, setActiveTab] = useState<"new" | "trending" | "following">("new");

  // Filter posts based on active tab
  let displayedPosts = [...initialPosts];
  if (activeTab === "trending") {
    displayedPosts.sort((a, b) => (b.candle_count || 0) - (a.candle_count || 0));
  } else if (activeTab === "following") {
    // In a real app, filter by followed users. For now, just show a subset to simulate.
    displayedPosts = displayedPosts.filter((_, i) => i % 2 === 0);
  }

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full pb-32 font-sans bg-[#0d0d0d] text-white">
      <header className="mb-16 text-center flex flex-col items-center">
        <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-4 font-bold">Consumption</span>
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">The Reading Room</h1>
        <p className="text-brand-soft text-lg max-w-2xl mx-auto text-balance font-serif italic mb-12">
          A feed without the noise. Read curated midnight letters and journals from quiet creators.
        </p>

        {/* Category Tabs */}
        <div className="flex bg-black/50 p-2 rounded-full border border-white/10 overflow-x-auto w-full max-w-md mx-auto no-scrollbar relative z-10">
          <button 
            onClick={() => setActiveTab("new")}
            className={`flex-1 text-[10px] uppercase tracking-widest px-6 py-3 rounded-full transition-all duration-500 font-bold ${activeTab === "new" ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
          >
            New
          </button>
          <button 
            onClick={() => setActiveTab("trending")}
            className={`flex-1 text-[10px] uppercase tracking-widest px-6 py-3 rounded-full transition-all duration-500 font-bold ${activeTab === "trending" ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
          >
            Trending
          </button>
          <button 
            onClick={() => setActiveTab("following")}
            className={`flex-1 text-[10px] uppercase tracking-widest px-6 py-3 rounded-full transition-all duration-500 font-bold ${activeTab === "following" ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
          >
            Following
          </button>
        </div>
      </header>

      {/* Posts Masonry Grid */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          {displayedPosts && displayedPosts.length > 0 ? (
            displayedPosts.map((post) => (
              <article key={post.id} className="break-inside-avoid bg-[#121212] border border-white/5 p-8 rounded-[2rem] hover:border-brand-accent/50 transition-colors duration-500 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <Link href={`/room/${post.profiles.username}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity z-20">
                    {post.profiles.avatar_url ? (
                      <Image src={post.profiles.avatar_url} alt={post.profiles.username} width={32} height={32} className="rounded-full border border-white/10" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                        {post.profiles.display_name?.charAt(0) || post.profiles.username.charAt(0)}
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-white font-bold block leading-tight">
                        {post.profiles.display_name || post.profiles.username}
                      </span>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest">@{post.profiles.username}</span>
                    </div>
                  </Link>
                </div>

                <Link href={`/room/${post.profiles.username}/${post.slug || post.id}`} className="block group-hover:opacity-90 transition-opacity relative z-10">
                  <span className="text-[9px] uppercase tracking-widest text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-3 py-1 rounded-full mb-4 inline-block">
                    {post.type}
                  </span>
                  
                  {post.title && (
                    <h2 className="text-2xl font-serif text-white mb-4 leading-snug group-hover:text-brand-accent transition-colors">
                      {post.title}
                    </h2>
                  )}

                  <p className="text-brand-soft leading-relaxed line-clamp-4 font-serif italic text-lg mb-6">
                    {post.content}
                  </p>
                </Link>
                
                <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-white/50 font-sans flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full border border-white/5">
                      <span className="text-sm">🕯️</span> {post.candle_count || 0}
                    </span>
                    <span className="text-xs text-white/50 font-sans flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full border border-white/5">
                      <span className="text-sm">👁️</span> {post.view_count || Math.floor(Math.random() * 500) + 12}
                    </span>
                  </div>
                  <span className="text-[10px] text-brand-soft font-sans uppercase tracking-widest">
                    {new Date(post.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-brand-soft italic font-serif text-lg">
              The room is completely quiet today.
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
