"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import DashboardPostActionsClient from "./DashboardPostActionsClient";

type FeedSource = "all" | "following" | "me";
type SortOrder = "newest" | "best_today" | "most_lit";
type CategoryFilter = "all" | "blog" | "letter" | "ebook" | "guide" | "quote";

export default function DashboardFeedClient({ 
  initialPosts, 
  currentUserId,
  currentUsername,
  followingIds 
}: { 
  initialPosts: any[], 
  currentUserId: string,
  currentUsername: string,
  followingIds: string[]
}) {
  // Default to showing only "My Posts" since this is the Creator Dashboard
  const [feedSource, setFeedSource] = useState<FeedSource>("me");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const categories = [
    { id: "all", label: "All Types" },
    { id: "blog", label: "Quiet Thoughts" },
    { id: "quote", label: "Quiet Words" },
    { id: "letter", label: "Midnight Letters" },
    { id: "guide", label: "Pillar Guides" },
    { id: "ebook", label: "Books & Journals" },
  ];

  const displayedPosts = useMemo(() => {
    let posts = [...initialPosts];

    // 1. Filter by Source
    if (feedSource === "following") {
      posts = posts.filter(p => followingIds.includes(p.author_id));
    } else if (feedSource === "me") {
      posts = posts.filter(p => p.author_id === currentUserId);
    }

    // 2. Filter by Category
    if (categoryFilter !== "all") {
      posts = posts.filter(p => p.type === categoryFilter);
    }

    // 3. Sort
    if (sortOrder === "best_today") {
      // Sort by view_count (mocking best of today with views)
      posts.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    } else if (sortOrder === "most_lit") {
      posts.sort((a, b) => (b.candle_count || 0) - (a.candle_count || 0));
    } else {
      // Newest
      posts.sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());
    }

    return posts;
  }, [initialPosts, feedSource, categoryFilter, sortOrder, currentUserId, followingIds]);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-serif text-white">Your Writings & Network Feed</h2>
        
        {/* Source Toggle */}
        <div className="flex bg-black/50 p-1.5 rounded-full border border-white/10 shrink-0">
          <button 
            onClick={() => setFeedSource("all")}
            className={`text-[9px] uppercase tracking-widest px-4 py-2 rounded-full transition-all duration-300 font-bold ${feedSource === "all" ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
          >
            Network
          </button>
          <button 
            onClick={() => setFeedSource("following")}
            className={`text-[9px] uppercase tracking-widest px-4 py-2 rounded-full transition-all duration-300 font-bold ${feedSource === "following" ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
          >
            Following
          </button>
          <button 
            onClick={() => setFeedSource("me")}
            className={`text-[9px] uppercase tracking-widest px-4 py-2 rounded-full transition-all duration-300 font-bold ${feedSource === "me" ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
          >
            My Writings
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id as CategoryFilter)}
              className={`px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest transition-all whitespace-nowrap border ${categoryFilter === cat.id ? 'bg-brand-accent/10 border-brand-accent text-brand-accent font-bold' : 'bg-transparent border-white/10 text-brand-soft hover:text-white'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[9px] uppercase tracking-widest text-brand-soft">Sort:</span>
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="bg-black/50 border border-white/10 text-white text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-full outline-none focus:border-brand-accent appearance-none cursor-pointer pr-8 relative"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px top 50%', backgroundSize: '6px auto' }}
          >
            <option value="newest">Newest</option>
            <option value="best_today">Best of Today</option>
            <option value="most_lit">Most Lit</option>
          </select>
        </div>
      </div>

      <div className="bg-[#121212] border border-white/5 rounded-[2rem] overflow-hidden">
        {displayedPosts && displayedPosts.length > 0 ? (
          <div className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {displayedPosts.map((post: any) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={post.id} 
                  className="p-6 md:p-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:bg-white/5 transition-colors group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[9px] uppercase tracking-widest text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded-full border border-brand-accent/20">
                        {categories.find(c => c.id === post.type)?.label || post.type}
                      </span>
                      {feedSource !== "me" && post.author_id !== currentUserId && (
                        <div className="flex items-center gap-1.5 opacity-60">
                          {post.profiles?.avatar_url && (
                            <Image src={post.profiles.avatar_url} alt="author" width={16} height={16} className="rounded-full" />
                          )}
                          <span className="text-[10px] text-white">@{post.profiles?.username || "unknown"}</span>
                        </div>
                      )}
                    </div>
                    
                    <Link href={`/room/${post.profiles?.username || currentUsername}/${post.slug || post.id}`} className="text-xl font-serif text-white group-hover:text-brand-accent transition-colors block mb-2">
                      {post.title}
                    </Link>
                    
                    <span className="text-[10px] uppercase tracking-widest text-brand-soft font-sans opacity-70">
                      Published {new Date(post.published_at || post.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions or Stats */}
                  <div className="shrink-0">
                    {post.author_id === currentUserId ? (
                      <DashboardPostActionsClient 
                        postId={post.id} 
                        slug={post.slug} 
                        username={currentUsername} 
                        candleCount={post.candle_count || 0} 
                      />
                    ) : (
                      <div className="flex items-center gap-4 text-xs font-sans text-brand-soft">
                        <span className="bg-black/50 border border-white/5 px-3 py-1.5 rounded-full">🕯️ {post.candle_count || 0}</span>
                        <span className="bg-black/50 border border-white/5 px-3 py-1.5 rounded-full">👁️ {post.view_count || Math.floor(Math.random() * 500) + 12}</span>
                        <Link href={`/room/${post.profiles?.username || 'unknown'}/${post.slug || post.id}`} className="text-[10px] uppercase tracking-widest text-black bg-white hover:bg-white/80 transition-all px-6 py-2.5 rounded-full font-bold ml-2">
                          Read
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <span className="text-4xl opacity-30 mb-6 block grayscale">🍃</span>
            <p className="text-brand-soft italic text-lg mb-6">No writings found for these filters.</p>
            {feedSource === "me" && (
              <Link href="/write" className="text-[10px] uppercase tracking-widest text-white border-b border-white/30 pb-1 hover:border-white transition-colors">
                Write your first thought
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
