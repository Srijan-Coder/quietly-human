"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import AmbientBackground from "@/components/global/AmbientBackground";

// Your actual products — books, Notion, ebooks, membership, etc.
const storeProducts = [
  { emoji: "📓", title: "The Overthinking Journal", desc: "A guided journal for anxious minds. 90 pages of prompts.", url: "https://quietlyhumans.gumroad.com", tag: "Physical Book" },
  { emoji: "🧠", title: "ADHD Life System — Notion", desc: "Complete Notion dashboard for ADHD management & daily planning.", url: "https://quietlyhumans.gumroad.com", tag: "Notion Template" },
  { emoji: "🌿", title: "Sanctuary Pass Membership", desc: "Unlock all 20 premium tools, ad-free reading & quiet mode. $4.99/mo.", url: "/sanctuary-pass", tag: "Membership" },
  { emoji: "📖", title: "Midnight Letters Vol. 1", desc: "A curated collection of our best midnight essays. Digital ebook.", url: "https://quietlyhumans.gumroad.com", tag: "Ebook" },
  { emoji: "🗂️", title: "Soft Living Planner", desc: "Weekly planner Notion template for intentional, soft living.", url: "https://quietlyhumans.gumroad.com", tag: "Notion Template" },
  { emoji: "📦", title: "Creator Starter Kit", desc: "Everything you need to start writing and building on Quietly Humans.", url: "https://quietlyhumans.gumroad.com", tag: "Digital Bundle" },
];

const exploreRooms = [
  { title: "Breathing Room", path: "/breathe", emoji: "🌬️", desc: "Guided breathing" },
  { title: "Deep Focus", path: "/focus", emoji: "⏳", desc: "Pomodoro timer" },
  { title: "3AM Room", path: "/3am", emoji: "🌙", desc: "Late night sanctuary" },
  { title: "Pilgrim Wall", path: "/pilgrim", emoji: "🕯️", desc: "Anonymous notes" },
  { title: "Quotes", path: "/quotes", emoji: "💬", desc: "Quiet words" },
  { title: "The Library", path: "/library", emoji: "📚", desc: "Full archive" },
];

const categoryLabels: Record<string, string> = {
  blog: "Quiet Thought",
  letter: "Midnight Letter",
  guide: "Pillar Guide",
  ebook: "Book",
  quote: "Quiet Word",
};

export default function HomeContentClient({ stats, latestNotes, latestPosts, topCreators, featuredProducts }: { stats: any, latestNotes: any[], latestPosts: any[], topCreators: any[], featuredProducts: any[] }) {
  const [greeting, setGreeting] = useState("Welcome to the sanctuary.");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 4) {
      setGreeting("The world is asleep, but your mind isn't.");
    } else if (hour >= 4 && hour < 12) {
      setGreeting("Start your day softly.");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Take a deep breath. You're doing fine.");
    } else {
      setGreeting("The day is ending. Rest your mind here.");
    }
  }, []);

  // Merge DB products with static products, DB first
  const allProducts = featuredProducts.length > 0
    ? [...featuredProducts.map(p => ({ emoji: p.emoji || "📦", title: p.title, desc: p.subtitle || "Digital Download", url: p.url || "/store", tag: "Creator Product" })), ...storeProducts]
    : storeProducts;

  return (
    <div className="relative min-h-screen w-full bg-brand-bg text-brand-text font-sans selection:bg-brand-accent selection:text-white overflow-hidden">
      <AmbientBackground />
      
      {/* ===== 1. HERO ===== */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col justify-center items-center px-4 md:px-6 text-center">
        <div className="z-10 flex flex-col items-center max-w-4xl mt-16 md:mt-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-brand-soft mb-6 md:mb-8 flex items-center gap-3"
          >
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse-glow" />
            {greeting}
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] font-serif tracking-tight text-brand-text leading-[1.1] mb-6 md:mb-8"
          >
            The quietest corner <br className="hidden md:block"/> of the internet.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-brand-soft text-base md:text-xl max-w-2xl leading-relaxed mb-8 md:mb-12 font-serif italic px-4"
          >
            A digital sanctuary for overthinkers. Write your midnight letters, use our clinical toolkits, and remember how to breathe.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-center w-full sm:w-auto px-4">
            <Link href="/onboarding" className="w-full sm:w-auto bg-brand-text text-brand-bg px-6 md:px-8 py-3.5 md:py-4 rounded-full text-[10px] tracking-widest uppercase font-bold hover:scale-105 transition-transform shadow-lg text-center">
              Enter Sanctuary
            </Link>
            <Link href="/reading-room" className="w-full sm:w-auto px-6 md:px-8 py-3.5 md:py-4 rounded-full text-[10px] tracking-widest uppercase text-brand-soft hover:text-brand-text border border-brand-border hover:border-brand-text/30 transition-all bg-brand-card/50 text-center">
              Reading Room
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 2. LIVE PULSE ===== */}
      <section className="relative w-full border-y border-brand-border/30 bg-brand-card/50 py-3 md:py-4 overflow-hidden z-20">
        <div className="flex whitespace-nowrap animate-marquee gap-12 md:gap-16 text-[10px] md:text-xs text-brand-soft font-sans tracking-widest uppercase">
          <span className="flex items-center gap-2"><span className="text-brand-accent">✦</span> {stats.candles.toLocaleString()} candles lit</span>
          <span className="flex items-center gap-2"><span className="text-brand-accent">✦</span> {stats.notes.toLocaleString()} pilgrim notes</span>
          <span className="flex items-center gap-2"><span className="text-brand-accent">✦</span> {stats.posts.toLocaleString()} writings published</span>
          <span className="flex items-center gap-2"><span className="text-brand-accent">✦</span> {stats.candles.toLocaleString()} candles lit</span>
          <span className="flex items-center gap-2"><span className="text-brand-accent">✦</span> {stats.notes.toLocaleString()} pilgrim notes</span>
          <span className="flex items-center gap-2"><span className="text-brand-accent">✦</span> {stats.posts.toLocaleString()} writings published</span>
        </div>
      </section>

      {/* ===== 3. TRENDING WRITINGS ===== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-12 gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-2 block font-bold">Latest from the sanctuary</span>
            <h2 className="text-3xl md:text-4xl font-serif text-brand-text">Trending Writings</h2>
          </div>
          <Link href="/reading-room" className="text-[10px] uppercase tracking-widest text-brand-accent border-b border-brand-accent/50 pb-1 hover:border-brand-accent transition-colors font-bold shrink-0">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {latestPosts.map((post) => (
            <Link
              key={post.id}
              href={`/room/${post.profiles?.username}/${post.slug || post.id}`}
              className="group bg-brand-card border border-brand-border p-5 md:p-6 rounded-2xl hover:border-brand-accent/50 transition-all flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] uppercase tracking-widest text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-2.5 py-1 rounded-full font-bold">
                  {categoryLabels[post.type] || post.type}
                </span>
                <span className="text-[10px] text-brand-soft">
                  🕯️ {post.candle_count || 0}
                </span>
              </div>

              <h3 className="text-lg md:text-xl font-serif text-brand-text group-hover:text-brand-accent transition-colors mb-2 line-clamp-2 leading-snug">
                {post.title}
              </h3>

              {post.excerpt && (
                <p className="text-sm text-brand-soft line-clamp-2 mb-4 font-serif italic flex-grow">
                  {post.excerpt}
                </p>
              )}

              <div className="flex items-center gap-2 mt-auto pt-3 border-t border-brand-border">
                {post.profiles?.avatar_url ? (
                  <Image src={post.profiles.avatar_url} alt="" width={20} height={20} className="rounded-full" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-brand-accent/20 flex items-center justify-center text-[8px] font-bold">
                    {post.profiles?.display_name?.charAt(0) || "?"}
                  </div>
                )}
                <span className="text-[10px] text-brand-soft uppercase tracking-widest">
                  @{post.profiles?.username}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 4. BENTO GRID — Toolkit + Community ===== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        
        {/* Box 1: The Soft Toolkit (2 cols) */}
        <Link href="/toolkit" className="md:col-span-2 bg-brand-card border border-brand-border p-6 md:p-10 rounded-2xl md:rounded-[2rem] flex flex-col justify-between group overflow-hidden relative hover:border-brand-accent/50 transition-colors">
          <div className="z-10 mb-6 md:mb-10">
            <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-3 block font-bold">Interactive Toolkit</span>
            <h2 className="text-2xl md:text-4xl font-serif text-brand-text mb-3">The Soft Toolkit</h2>
            <p className="text-brand-soft text-sm md:text-base max-w-md">20 psychological tools designed to dissolve worry, redirect panic, and help you find focus.</p>
          </div>
          <div className="z-10 grid grid-cols-2 gap-3 md:gap-4">
            <div className="bg-brand-bg/60 border border-brand-border p-3 md:p-5 rounded-xl md:rounded-2xl">
              <span className="text-xl md:text-2xl mb-1 block">🌫️</span>
              <h3 className="text-brand-text text-xs md:text-sm font-serif">Worry Dissolver</h3>
            </div>
            <div className="bg-brand-bg/60 border border-brand-border p-3 md:p-5 rounded-xl md:rounded-2xl">
              <span className="text-xl md:text-2xl mb-1 block">🕰️</span>
              <h3 className="text-brand-text text-xs md:text-sm font-serif">Panic Redirector</h3>
            </div>
          </div>
        </Link>

        {/* Box 2: Pilgrim Notes (1 col) */}
        <Link href="/pilgrim" className="bg-brand-card border border-brand-border p-6 md:p-10 rounded-2xl md:rounded-[2rem] flex flex-col group relative overflow-hidden hover:border-brand-accent/50 transition-colors">
           <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-3 block font-bold z-20">Community Wall</span>
           <h2 className="text-2xl md:text-3xl font-serif text-brand-text mb-2 z-20">Pilgrim Notes</h2>
           <p className="text-brand-soft text-sm mb-4 md:mb-6 z-20">Anonymous thoughts left behind by others.</p>
           
           <div className="flex flex-col gap-2 md:gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
              {latestNotes.map((note) => (
                <div key={note.id} className="bg-brand-bg/60 p-3 rounded-xl text-xs md:text-sm italic border border-brand-border font-serif text-brand-soft line-clamp-2">
                  &ldquo;{note.content.substring(0, 60)}...&rdquo;
                </div>
              ))}
           </div>
        </Link>
      </section>

      {/* ===== 5. TOP CREATORS ===== */}
      {topCreators.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-12 gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-2 block font-bold">Creators</span>
              <h2 className="text-3xl md:text-4xl font-serif text-brand-text">Quiet Minds</h2>
            </div>
            <Link href="/reading-room" className="text-[10px] uppercase tracking-widest text-brand-accent border-b border-brand-accent/50 pb-1 hover:border-brand-accent transition-colors font-bold shrink-0">
              Discover More →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {topCreators.map((creator) => (
              <Link
                key={creator.id}
                href={`/room/${creator.username}`}
                className="group bg-brand-card border border-brand-border rounded-2xl p-4 md:p-5 text-center hover:border-brand-accent/50 transition-all flex flex-col items-center"
              >
                {creator.avatar_url ? (
                  <Image src={creator.avatar_url} alt={creator.username} width={48} height={48} className="rounded-full border border-brand-border mb-3" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-brand-accent/10 border border-brand-border flex items-center justify-center text-lg font-bold text-brand-text mb-3">
                    {(creator.display_name || creator.username || "?").charAt(0)}
                  </div>
                )}
                <h3 className="text-xs md:text-sm font-serif text-brand-text group-hover:text-brand-accent transition-colors truncate w-full">
                  {creator.display_name || creator.username}
                </h3>
                <span className="text-[9px] text-brand-soft uppercase tracking-widest mt-1">@{creator.username}</span>
                {creator.is_premium && (
                  <span className="text-[8px] text-brand-accent mt-1">🌿 Guardian</span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== 6. THE QUIET STORE ===== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-12 gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-2 block font-bold">Shop</span>
            <h2 className="text-3xl md:text-4xl font-serif text-brand-text">The Quiet Store</h2>
            <p className="text-brand-soft mt-2 text-sm md:text-base max-w-lg">Books, journals, Notion templates, memberships & digital tools.</p>
          </div>
          <Link href="/store" className="text-[10px] uppercase tracking-widest text-brand-accent border-b border-brand-accent/50 pb-1 hover:border-brand-accent transition-colors font-bold shrink-0">
            Browse All →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          {allProducts.slice(0, 6).map((product, idx) => {
            const isInternal = product.url?.startsWith("/");
            const Comp = isInternal ? Link : "a";
            const extraProps = isInternal ? {} : { target: "_blank", rel: "noopener noreferrer" };
            return (
              <Comp
                key={idx}
                href={product.url || "/store"}
                {...extraProps}
                className="group bg-brand-card border border-brand-border rounded-2xl overflow-hidden hover:border-brand-accent/50 transition-all flex flex-col"
              >
                <div className="h-28 md:h-36 bg-brand-bg flex items-center justify-center border-b border-brand-border group-hover:bg-brand-accent/5 transition-colors relative">
                  <span className="text-3xl md:text-4xl grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">
                    {product.emoji}
                  </span>
                  <span className="absolute top-2 right-2 text-[8px] uppercase tracking-widest text-brand-soft bg-brand-bg border border-brand-border px-2 py-0.5 rounded-full">
                    {product.tag}
                  </span>
                </div>
                <div className="p-4 md:p-5 flex flex-col flex-1">
                  <h3 className="text-sm md:text-base font-serif text-brand-text group-hover:text-brand-accent transition-colors mb-1 line-clamp-2 leading-snug">
                    {product.title}
                  </h3>
                  <p className="text-brand-soft text-[11px] md:text-xs line-clamp-2 flex-grow">
                    {product.desc}
                  </p>
                </div>
              </Comp>
            );
          })}
        </div>
      </section>

      {/* ===== 7. EXPLORE ALL ROOMS ===== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-8 md:mb-12">
          <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-2 block font-bold">Explore</span>
          <h2 className="text-3xl md:text-4xl font-serif text-brand-text mb-3">Every Quiet Room</h2>
          <p className="text-brand-soft text-sm max-w-lg mx-auto">Breathing exercises, focus timers, the 3AM room, and more.</p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          {exploreRooms.map((room) => (
            <Link
              key={room.path}
              href={room.path}
              className="group bg-brand-card border border-brand-border rounded-xl md:rounded-2xl p-4 md:p-5 text-center hover:border-brand-accent/50 transition-all flex flex-col items-center"
            >
              <span className="text-2xl md:text-3xl mb-2 grayscale group-hover:grayscale-0 transition-all duration-300">
                {room.emoji}
              </span>
              <h3 className="text-[11px] md:text-sm font-serif text-brand-text group-hover:text-brand-accent transition-colors leading-tight">{room.title}</h3>
              <p className="text-[9px] md:text-[10px] text-brand-soft uppercase tracking-widest mt-1 hidden md:block">{room.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 8. CREATOR PITCH ===== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="bg-brand-card border border-brand-border rounded-2xl md:rounded-[2rem] p-8 md:p-16 text-center flex flex-col items-center">
          <span className="text-4xl md:text-5xl mb-4 md:mb-6">🖋️</span>
          <h2 className="text-2xl md:text-4xl font-serif text-brand-text mb-3 md:mb-4">Don&apos;t scream into the void.</h2>
          <p className="text-brand-soft text-sm md:text-base mb-6 md:mb-8 max-w-lg">Build your own quiet room. Publish essays, curate your audience, sell digital products, and monetize your Notion templates.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/onboarding" className="bg-brand-text text-brand-bg px-6 md:px-8 py-3 md:py-4 rounded-full text-[10px] tracking-widest uppercase font-bold hover:scale-105 transition-transform text-center">
              Start Writing
            </Link>
            <Link href="/dashboard" className="px-6 md:px-8 py-3 md:py-4 rounded-full text-[10px] tracking-widest uppercase text-brand-soft border border-brand-border hover:border-brand-text/30 transition-all text-center">
              Creator Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 9. SANCTUARY PASS CTA ===== */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-12 relative">
        <div className="absolute inset-0 bg-brand-accent/10 blur-[80px] md:blur-[100px] rounded-full pointer-events-none" />
        <div className="relative rounded-2xl md:rounded-[3rem] overflow-hidden p-[1px] animate-pulse-glow">
          <div className="bg-brand-bg/95 rounded-2xl md:rounded-[3rem] p-8 md:p-20 text-center relative z-10 flex flex-col items-center">
             <span className="text-brand-accent mb-4 md:mb-6 text-4xl md:text-5xl">🌿</span>
             <h2 className="text-3xl md:text-5xl font-serif text-brand-text mb-4 md:mb-6">Become a Guardian.</h2>
             <p className="text-brand-soft text-sm md:text-lg max-w-xl mb-8 md:mb-12 font-serif italic">
               Upgrade to the Sanctuary Pass for $4.99/month. Unlock the complete Soft Toolkit, ad-free reading, and support the quiet ecosystem.
             </p>
             <Link href="/sanctuary-pass" className="bg-brand-accent text-white px-8 md:px-10 py-4 md:py-5 rounded-full text-[10px] tracking-widest uppercase font-bold hover:scale-105 transition-transform shadow-[0_0_30px_rgba(201,164,106,0.3)]">
                View Sanctuary Pass
             </Link>
          </div>
        </div>
      </section>
      
      {/* ===== 10. THE PROMISE + FOOTER LINKS ===== */}
      <section className="border-t border-brand-border bg-brand-bg py-16 md:py-24 text-center px-4 md:px-6">
        <p className="text-brand-soft uppercase tracking-[0.3em] text-[10px] mb-6 md:mb-8">The Quietly Humans Promise</p>
        <h2 className="text-2xl md:text-3xl font-serif text-brand-text max-w-2xl mx-auto leading-relaxed italic opacity-80">
          &ldquo;Whenever the world is too loud, or the night is too long, there is a quiet room waiting for you here.&rdquo;
        </h2>
        <div className="mt-8 md:mt-12 flex flex-wrap justify-center gap-4 md:gap-6">
          <Link href="/toolkit" className="text-xs text-brand-soft hover:text-brand-text transition-colors border-b border-brand-border pb-1">Soft Toolkit</Link>
          <Link href="/store" className="text-xs text-brand-soft hover:text-brand-text transition-colors border-b border-brand-border pb-1">Store</Link>
          <Link href="/breathe" className="text-xs text-brand-soft hover:text-brand-text transition-colors border-b border-brand-border pb-1">Breathing</Link>
          <Link href="/focus" className="text-xs text-brand-soft hover:text-brand-text transition-colors border-b border-brand-border pb-1">Focus Timer</Link>
          <Link href="/reading-room" className="text-xs text-brand-soft hover:text-brand-text transition-colors border-b border-brand-border pb-1">Reading Room</Link>
          <Link href="/sanctuary-pass" className="text-xs text-brand-soft hover:text-brand-text transition-colors border-b border-brand-border pb-1">Sanctuary Pass</Link>
        </div>
      </section>

    </div>
  );
}
