"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type FeedSource = "all" | "following" | "me";
type SortOrder = "newest" | "best_today" | "most_lit";
type CategoryFilter = "all" | "blog" | "letter" | "ebook" | "guide" | "quote" | "creators";

export default function ReadingRoomClient({ 
  initialPosts, 
  initialProfiles = [],
  currentUserId,
  followingIds 
}: { 
  initialPosts: any[], 
  initialProfiles?: any[],
  currentUserId: string | null,
  followingIds: string[]
}) {
  const [feedSource, setFeedSource] = useState<FeedSource>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const categories = [
    { id: "all", label: "All Types" },
    { id: "creators", label: "Creators" },
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
    if (categoryFilter !== "all" && categoryFilter !== "creators") {
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
      posts.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    }

    return posts;
  }, [initialPosts, feedSource, categoryFilter, sortOrder, currentUserId, followingIds]);

  const displayedProfiles = useMemo(() => {
    let profiles = [...initialProfiles];
    if (feedSource === "following") {
      profiles = profiles.filter(p => followingIds.includes(p.id));
    } else if (feedSource === "me") {
      profiles = profiles.filter(p => p.id === currentUserId);
    }
    return profiles;
  }, [initialProfiles, feedSource, currentUserId, followingIds]);

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full pb-32 font-sans bg-[#0d0d0d] text-white">
      <header className="mb-12 text-center flex flex-col items-center">
        <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-4 font-bold">Consumption</span>
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">The Reading Room</h1>
        <p className="text-brand-soft text-lg max-w-2xl mx-auto text-balance font-serif italic mb-12">
          A feed without the noise. Read curated midnight letters and journals from quiet creators.
        </p>

        {/* Primary Feed Source Tabs */}
        <div className="flex bg-black/50 p-2 rounded-full border border-white/10 overflow-x-auto w-full max-w-md mx-auto no-scrollbar relative z-10 mb-8">
          <button 
            onClick={() => setFeedSource("all")}
            className={`flex-1 text-[10px] uppercase tracking-widest px-6 py-3 rounded-full transition-all duration-500 font-bold whitespace-nowrap ${feedSource === "all" ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
          >
            All Posts
          </button>
          <button 
            onClick={() => setFeedSource("following")}
            className={`flex-1 text-[10px] uppercase tracking-widest px-6 py-3 rounded-full transition-all duration-500 font-bold whitespace-nowrap ${feedSource === "following" ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
          >
            Following
          </button>
          {currentUserId && (
            <button 
              onClick={() => setFeedSource("me")}
              className={`flex-1 text-[10px] uppercase tracking-widest px-6 py-3 rounded-full transition-all duration-500 font-bold whitespace-nowrap ${feedSource === "me" ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
            >
              My Posts
            </button>
          )}
        </div>

        {/* Secondary Filters: Categories & Sort */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10 pb-6">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as CategoryFilter)}
                className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border ${categoryFilter === cat.id ? 'bg-brand-accent/10 border-brand-accent text-brand-accent font-bold' : 'bg-transparent border-white/10 text-brand-soft hover:text-white'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[10px] uppercase tracking-widest text-brand-soft">Sort By:</span>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="bg-black/50 border border-white/10 text-white text-xs py-2 px-4 rounded-full outline-none focus:border-brand-accent appearance-none cursor-pointer pr-8 relative"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px top 50%', backgroundSize: '8px auto' }}
            >
              <option value="newest">Newest</option>
              <option value="best_today">Best of Today (Views)</option>
              <option value="most_lit">Most Lit (Candles)</option>
            </select>
          </div>
        </div>
      </header>

      {/* Posts & Profiles Masonry Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {categoryFilter === "creators" ? (
          displayedProfiles && displayedProfiles.length > 0 ? (
            displayedProfiles.map((profile) => (
              <article key={profile.id} className="break-inside-avoid bg-[#121212] border border-white/5 p-8 rounded-[2rem] hover:border-brand-accent/50 transition-colors duration-500 group relative overflow-hidden flex flex-col min-h-[250px] items-center text-center animate-fade-in-up">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                {profile.avatar_url ? (
                  <Image src={profile.avatar_url} alt={profile.username} width={80} height={80} className="rounded-full border border-white/10 mb-4" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-2xl font-bold text-white mb-4">
                    {profile.display_name?.charAt(0) || profile.username?.charAt(0) || '?'}
                  </div>
                )}

                <h2 className="text-2xl font-serif text-white mb-1 group-hover:text-brand-accent transition-colors relative z-10">
                  {profile.display_name || profile.username || 'Unknown'}
                </h2>
                <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-4 relative z-10">@{profile.username}</span>

                {profile.bio && (
                  <p className="text-brand-soft leading-relaxed line-clamp-3 font-sans text-sm mb-6 relative z-10">
                    {profile.bio}
                  </p>
                )}

                {profile.is_premium && (
                  <span className="text-[9px] uppercase tracking-widest text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-3 py-1 rounded-full mb-4 inline-block relative z-10">
                    Guardian 🌿
                  </span>
                )}

                <Link href={`/room/${profile.username}`} className="mt-auto relative z-10 bg-white text-black px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold hover:scale-105 transition-transform">
                  Enter Room
                </Link>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-brand-soft italic font-serif text-lg">
              No creators found for this filter.
            </div>
          )
        ) : (
          displayedPosts && displayedPosts.length > 0 ? (
            displayedPosts.map((post) => (
              <article key={post.id} className="break-inside-avoid bg-[#121212] border border-white/5 p-8 rounded-[2rem] hover:border-brand-accent/50 transition-colors duration-500 group relative overflow-hidden flex flex-col min-h-[250px] animate-fade-in-up">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <div className="flex items-center gap-3 mb-6 relative z-10 shrink-0">
                  <Link href={`/room/${post.profiles?.username}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity z-20">
                    {post.profiles?.avatar_url ? (
                      <Image src={post.profiles.avatar_url} alt={post.profiles.username} width={32} height={32} className="rounded-full border border-white/10" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                        {post.profiles?.display_name?.charAt(0) || post.profiles?.username?.charAt(0) || '?'}
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-white font-bold block leading-tight">
                        {post.profiles?.display_name || post.profiles?.username || 'Unknown'}
                      </span>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest">@{post.profiles?.username || 'unknown'}</span>
                    </div>
                  </Link>
                </div>

                <Link href={`/room/${post.profiles?.username}/${post.slug || post.id}`} className="block group-hover:opacity-90 transition-opacity relative z-10 flex-grow">
                  <span className="text-[9px] uppercase tracking-widest text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-3 py-1 rounded-full mb-4 inline-block">
                    {categories.find(c => c.id === post.type)?.label || post.type}
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
                
                <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10 shrink-0 mt-auto">
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
              The room is completely quiet today. Try adjusting your filters.
            </div>
          )
        )}
      </div>
    </div>
  );
}
