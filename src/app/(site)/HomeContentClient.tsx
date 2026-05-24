"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import AmbientBackground from "@/components/global/AmbientBackground";

// Your actual products with pricing
const storeProducts = [
  { emoji: "📓", title: "The Overthinking Journal", desc: "A guided journal for anxious minds. 90 pages of prompts.", price: "$12.99", tag: "Physical Book", url: "https://quietlyhumans.gumroad.com" },
  { emoji: "🧠", title: "ADHD Life System — Notion", desc: "Complete Notion dashboard for ADHD management & daily planning.", price: "$9.99", tag: "Notion Template", url: "https://quietlyhumans.gumroad.com" },
  { emoji: "🌿", title: "Sanctuary Pass", desc: "Unlock all 20 premium tools, ad-free reading & quiet mode.", price: "$4.99/mo", tag: "Membership", url: "/sanctuary-pass" },
  { emoji: "📖", title: "Midnight Letters Vol. 1", desc: "A curated collection of our best midnight essays. Digital ebook.", price: "Free", tag: "Free Ebook", url: "/books" },
  { emoji: "🗂️", title: "Soft Living Planner", desc: "Weekly planner Notion template for intentional, soft living.", price: "$4.99", tag: "Notion Template", url: "https://quietlyhumans.gumroad.com" },
  { emoji: "📦", title: "Creator Starter Kit", desc: "Everything you need to start writing and building on QH.", price: "Free", tag: "Free Download", url: "https://quietlyhumans.gumroad.com" },
];

const exploreRooms = [
  { title: "Breathing Room", path: "/breathe", emoji: "🌬️", desc: "Guided breathing" },
  { title: "Deep Focus", path: "/focus", emoji: "⏳", desc: "Pomodoro timer" },
  { title: "3AM Room", path: "/3am", emoji: "🌙", desc: "Late night sanctuary" },
  { title: "Pilgrim Wall", path: "/pilgrim", emoji: "🕯️", desc: "Anonymous notes" },
  { title: "Quotes", path: "/quotes", emoji: "💬", desc: "Quiet words" },
  { title: "Library", path: "/library", emoji: "📚", desc: "Full archive" },
];

const testimonials = [
  { quote: "This is the only place on the internet where I feel like I can actually breathe.", name: "A quiet human", source: "Newsletter reply" },
  { quote: "The Worry Dissolver tool literally changed how I handle my 3AM spirals. I use it every night.", name: "Riya", source: "Instagram DM" },
  { quote: "I never thought a website could feel like therapy. The soft toolkit is genuinely life-changing.", name: "Anonymous pilgrim", source: "Pilgrim Wall" },
  { quote: "Finally a place for people who think too much. This community gets me.", name: "Jordan", source: "Email" },
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
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 4) setGreeting("The world is asleep, but your mind isn't.");
    else if (hour >= 4 && hour < 12) setGreeting("Start your day softly.");
    else if (hour >= 12 && hour < 17) setGreeting("Take a deep breath. You're doing fine.");
    else setGreeting("The day is ending. Rest your mind here.");
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubStatus("loading");
    try {
      const res = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, source: "Homepage Lead Magnet" }) });
      if (res.ok) setSubStatus("success");
      else setSubStatus("error");
    } catch { setSubStatus("error"); }
  };

  // Merge DB products with static
  const allProducts = featuredProducts.length > 0
    ? [...featuredProducts.map(p => ({ emoji: p.emoji || "📦", title: p.title, desc: p.subtitle || "Digital Download", price: p.price || "View", tag: "Creator Product", url: p.url || "/store" })), ...storeProducts]
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
            className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-brand-soft mb-6 flex items-center gap-3"
          >
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse-glow" />
            {greeting}
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] font-serif tracking-tight text-brand-text leading-[1.1] mb-6"
          >
            The quietest corner <br className="hidden md:block"/> of the internet.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-brand-soft text-base md:text-xl max-w-2xl leading-relaxed mb-8 font-serif italic px-4"
          >
            A digital sanctuary for overthinkers. Write midnight letters, use clinical toolkits, and remember how to breathe.
          </motion.p>

          {/* Single Primary CTA + secondary */}
          <div className="flex flex-col items-center gap-3 w-full px-4">
            <Link href="/onboarding" className="w-full sm:w-auto bg-brand-text text-brand-bg px-8 py-4 rounded-full text-[10px] tracking-widest uppercase font-bold hover:scale-105 transition-transform shadow-lg text-center">
              Enter Sanctuary
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/reading-room" className="text-[10px] uppercase tracking-widest text-brand-soft hover:text-brand-accent transition-colors">
                Reading Room
              </Link>
              <span className="text-brand-border">·</span>
              <Link href="/start" className="text-[10px] uppercase tracking-widest text-brand-accent hover:text-brand-text transition-colors font-bold">
                New here? Start here →
              </Link>
            </div>
          </div>

          {/* Community counter */}
          {stats.members > 0 && (
            <p className="mt-8 text-[10px] uppercase tracking-widest text-brand-soft">
              Join {stats.members.toLocaleString()}+ quiet humans
            </p>
          )}
        </div>
      </section>

      {/* ===== 2. LIVE PULSE ===== */}
      <section className="relative w-full border-y border-brand-border/30 bg-brand-card/50 py-3 overflow-hidden z-20">
        <div className="flex whitespace-nowrap animate-marquee gap-12 text-[10px] md:text-xs text-brand-soft font-sans tracking-widest uppercase">
          <span className="flex items-center gap-2"><span className="text-brand-accent">✦</span> {stats.candles.toLocaleString()} candles lit</span>
          <span className="flex items-center gap-2"><span className="text-brand-accent">✦</span> {stats.notes.toLocaleString()} pilgrim notes</span>
          <span className="flex items-center gap-2"><span className="text-brand-accent">✦</span> {stats.posts.toLocaleString()} writings published</span>
          <span className="flex items-center gap-2"><span className="text-brand-accent">✦</span> {stats.members.toLocaleString()} quiet humans</span>
          <span className="flex items-center gap-2"><span className="text-brand-accent">✦</span> {stats.candles.toLocaleString()} candles lit</span>
          <span className="flex items-center gap-2"><span className="text-brand-accent">✦</span> {stats.notes.toLocaleString()} pilgrim notes</span>
        </div>
      </section>

      {/* ===== 3. TRENDING WRITINGS ===== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
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
            <Link key={post.id} href={`/room/${post.profiles?.username}/${post.slug || post.id}`}
              className="group bg-brand-card border border-brand-border p-5 rounded-2xl hover:border-brand-accent/50 transition-all flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] uppercase tracking-widest text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-2.5 py-1 rounded-full font-bold">
                  {categoryLabels[post.type] || post.type}
                </span>
                <span className="text-[10px] text-brand-soft">🕯️ {post.candle_count || 0}</span>
              </div>
              <h3 className="text-lg font-serif text-brand-text group-hover:text-brand-accent transition-colors mb-2 line-clamp-2 leading-snug">{post.title}</h3>
              {post.excerpt && <p className="text-sm text-brand-soft line-clamp-2 mb-4 font-serif italic flex-grow">{post.excerpt}</p>}
              <div className="flex items-center gap-2 mt-auto pt-3 border-t border-brand-border">
                {post.profiles?.avatar_url ? (
                  <Image src={post.profiles.avatar_url} alt="" width={20} height={20} className="rounded-full" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-brand-accent/20 flex items-center justify-center text-[8px] font-bold">{post.profiles?.display_name?.charAt(0) || "?"}</div>
                )}
                <span className="text-[10px] text-brand-soft uppercase tracking-widest">@{post.profiles?.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 4. BENTO GRID — Toolkit + Pilgrim ===== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/toolkit" className="md:col-span-2 bg-brand-card border border-brand-border p-6 md:p-10 rounded-2xl flex flex-col justify-between group hover:border-brand-accent/50 transition-colors">
          <div className="mb-6">
            <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-3 block font-bold">Interactive Toolkit</span>
            <h2 className="text-2xl md:text-4xl font-serif text-brand-text mb-3">The Soft Toolkit</h2>
            <p className="text-brand-soft text-sm max-w-md">20 psychological tools for worry, panic, ADHD & overthinking. Based on CBT, DBT & clinical psychology.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-brand-bg/60 border border-brand-border p-3 md:p-5 rounded-xl"><span className="text-xl mb-1 block">🌫️</span><h3 className="text-brand-text text-xs font-serif">Worry Dissolver</h3></div>
            <div className="bg-brand-bg/60 border border-brand-border p-3 md:p-5 rounded-xl"><span className="text-xl mb-1 block">🕰️</span><h3 className="text-brand-text text-xs font-serif">Panic Redirector</h3></div>
          </div>
        </Link>
        <Link href="/pilgrim" className="bg-brand-card border border-brand-border p-6 md:p-10 rounded-2xl flex flex-col group hover:border-brand-accent/50 transition-colors">
          <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-3 block font-bold">Community Wall</span>
          <h2 className="text-2xl font-serif text-brand-text mb-2">Pilgrim Notes</h2>
          <p className="text-brand-soft text-sm mb-4">Anonymous thoughts from quiet humans.</p>
          <div className="flex flex-col gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
            {latestNotes.map((note) => (
              <div key={note.id} className="bg-brand-bg/60 p-3 rounded-xl text-xs italic border border-brand-border font-serif text-brand-soft line-clamp-2">
                &ldquo;{note.content.substring(0, 60)}...&rdquo;
              </div>
            ))}
          </div>
        </Link>
      </section>

      {/* ===== 5. TESTIMONIALS ===== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-2 block font-bold">Social Proof</span>
          <h2 className="text-3xl md:text-4xl font-serif text-brand-text">What quiet humans say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-brand-card border border-brand-border p-6 md:p-8 rounded-2xl">
              <p className="text-brand-text font-serif italic text-base md:text-lg leading-relaxed mb-4">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-soft font-bold">— {t.name}</span>
                <span className="text-[9px] uppercase tracking-widest text-brand-soft bg-brand-bg px-2 py-1 rounded-full border border-brand-border">{t.source}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 6. ABOUT THE CREATOR ===== */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="bg-brand-card border border-brand-border rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-brand-accent/10 border-2 border-brand-accent/30 flex items-center justify-center text-3xl md:text-4xl shrink-0">
            🧑‍💻
          </div>
          <div className="text-center md:text-left">
            <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-2 block font-bold">The human behind this</span>
            <h3 className="text-2xl md:text-3xl font-serif text-brand-text mb-3">Hi, I&apos;m Srijan.</h3>
            <p className="text-brand-soft text-sm md:text-base leading-relaxed mb-4">
              I built Quietly Humans because I needed it to exist. As an overthinker who has spent too many nights at 3AM staring at ceilings, I wanted to create a space that actually understands what it feels like to think too much. This is that space — for you and me.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link href="/about" className="text-[10px] uppercase tracking-widest text-brand-accent border-b border-brand-accent/50 pb-1 hover:border-brand-accent transition-colors font-bold">
                Read my full story →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 7. TOP CREATORS ===== */}
      {topCreators.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-2 block font-bold">Creators</span>
              <h2 className="text-3xl md:text-4xl font-serif text-brand-text">Quiet Minds</h2>
            </div>
            <Link href="/reading-room" className="text-[10px] uppercase tracking-widest text-brand-accent border-b border-brand-accent/50 pb-1 hover:border-brand-accent transition-colors font-bold shrink-0">Discover More →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {topCreators.map((creator) => (
              <Link key={creator.id} href={`/room/${creator.username}`}
                className="group bg-brand-card border border-brand-border rounded-2xl p-4 text-center hover:border-brand-accent/50 transition-all flex flex-col items-center">
                {creator.avatar_url ? (
                  <Image src={creator.avatar_url} alt={creator.username} width={48} height={48} className="rounded-full border border-brand-border mb-3" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-brand-accent/10 border border-brand-border flex items-center justify-center text-lg font-bold text-brand-text mb-3">
                    {(creator.display_name || creator.username || "?").charAt(0)}
                  </div>
                )}
                <h3 className="text-xs font-serif text-brand-text group-hover:text-brand-accent transition-colors truncate w-full">{creator.display_name || creator.username}</h3>
                <span className="text-[9px] text-brand-soft uppercase tracking-widest mt-1">@{creator.username}</span>
                {creator.is_premium && <span className="text-[8px] text-brand-accent mt-1">🌿 Guardian</span>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== 8. THE QUIET STORE ===== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-2 block font-bold">Shop</span>
            <h2 className="text-3xl md:text-4xl font-serif text-brand-text">The Quiet Store</h2>
            <p className="text-brand-soft mt-2 text-sm max-w-lg">Books, journals, Notion templates, memberships & digital tools.</p>
          </div>
          <Link href="/store" className="text-[10px] uppercase tracking-widest text-brand-accent border-b border-brand-accent/50 pb-1 hover:border-brand-accent transition-colors font-bold shrink-0">Browse All →</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          {allProducts.slice(0, 6).map((product, idx) => {
            const isInternal = product.url?.startsWith("/");
            const Comp = isInternal ? Link : "a";
            const extraProps = isInternal ? {} : { target: "_blank", rel: "noopener noreferrer" };
            const isFree = product.price === "Free";
            return (
              <Comp key={idx} href={product.url || "/store"} {...extraProps}
                className="group bg-brand-card border border-brand-border rounded-2xl overflow-hidden hover:border-brand-accent/50 transition-all flex flex-col">
                <div className="h-28 md:h-36 bg-brand-bg flex items-center justify-center border-b border-brand-border group-hover:bg-brand-accent/5 transition-colors relative">
                  <span className="text-3xl md:text-4xl grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">{product.emoji}</span>
                  <span className="absolute top-2 left-2 text-[8px] uppercase tracking-widest text-brand-soft bg-brand-bg border border-brand-border px-2 py-0.5 rounded-full">{product.tag}</span>
                  <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${isFree ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-brand-accent/10 text-brand-accent border border-brand-accent/20"}`}>
                    {product.price}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-sm md:text-base font-serif text-brand-text group-hover:text-brand-accent transition-colors mb-1 line-clamp-2 leading-snug">{product.title}</h3>
                  <p className="text-brand-soft text-[11px] line-clamp-2 flex-grow">{product.desc}</p>
                  <div className="mt-3 pt-3 border-t border-brand-border">
                    <span className={`text-[10px] uppercase tracking-widest font-bold ${isFree ? "text-green-400" : "text-brand-accent"}`}>
                      {isFree ? "Get Free →" : "Buy Now →"}
                    </span>
                  </div>
                </div>
              </Comp>
            );
          })}
        </div>
      </section>

      {/* ===== 9. NEWSLETTER + LEAD MAGNET ===== */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="bg-brand-card border border-brand-border rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <span className="text-3xl md:text-4xl mb-4 block">📬</span>
            <h2 className="text-2xl md:text-3xl font-serif text-brand-text mb-3">The Quiet Letter</h2>
            <p className="text-brand-soft text-sm md:text-base mb-2 max-w-lg mx-auto">
              Soft essays for tired hearts, sent twice a month. No spam, no hustle, no noise.
            </p>
            <p className="text-brand-accent text-xs md:text-sm font-bold mb-6">
              🎁 Sign up and get &ldquo;The 7-Day Soft Reset&rdquo; — a free journaling kit (PDF)
            </p>

            {subStatus === "success" ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-green-400 font-serif italic">
                Welcome to the sanctuary. Check your inbox for the free journaling kit. 🌿
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 bg-brand-bg border border-brand-border rounded-full px-5 py-3 text-sm text-brand-text placeholder:text-brand-soft outline-none focus:border-brand-accent transition-colors"
                />
                <button
                  type="submit"
                  disabled={subStatus === "loading"}
                  className="bg-brand-text text-brand-bg px-6 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold hover:scale-105 transition-transform disabled:opacity-50 shrink-0"
                >
                  {subStatus === "loading" ? "Joining..." : "Join Free"}
                </button>
              </form>
            )}

            {subStatus === "error" && (
              <p className="text-red-400 text-xs mt-3">Something went wrong. Please try again.</p>
            )}

            <p className="text-[10px] text-brand-soft mt-4 uppercase tracking-widest">
              {stats.members > 0 ? `${stats.members.toLocaleString()}+ quiet humans already inside` : "Join the quiet revolution"}
            </p>
          </div>
        </div>
      </section>

      {/* ===== 10. EXPLORE ALL ROOMS ===== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-2 block font-bold">Explore</span>
          <h2 className="text-3xl md:text-4xl font-serif text-brand-text mb-3">Every Quiet Room</h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {exploreRooms.map((room) => (
            <Link key={room.path} href={room.path}
              className="group bg-brand-card border border-brand-border rounded-xl p-4 text-center hover:border-brand-accent/50 transition-all flex flex-col items-center">
              <span className="text-2xl mb-2 grayscale group-hover:grayscale-0 transition-all duration-300">{room.emoji}</span>
              <h3 className="text-[11px] md:text-sm font-serif text-brand-text group-hover:text-brand-accent transition-colors leading-tight">{room.title}</h3>
              <p className="text-[9px] text-brand-soft uppercase tracking-widest mt-1 hidden md:block">{room.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 11. CREATOR PITCH ===== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="bg-brand-card border border-brand-border rounded-2xl p-8 md:p-14 text-center flex flex-col items-center">
          <span className="text-4xl mb-4">🖋️</span>
          <h2 className="text-2xl md:text-3xl font-serif text-brand-text mb-3">Don&apos;t scream into the void.</h2>
          <p className="text-brand-soft text-sm mb-6 max-w-lg">Build your own quiet room. Publish essays, sell digital products, and grow your audience.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/onboarding" className="bg-brand-text text-brand-bg px-6 py-3 rounded-full text-[10px] tracking-widest uppercase font-bold hover:scale-105 transition-transform text-center">Start Writing</Link>
            <Link href="/dashboard" className="px-6 py-3 rounded-full text-[10px] tracking-widest uppercase text-brand-soft border border-brand-border hover:border-brand-text/30 transition-all text-center">Dashboard</Link>
          </div>
        </div>
      </section>

      {/* ===== 12. SANCTUARY PASS CTA ===== */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-12 relative">
        <div className="absolute inset-0 bg-brand-accent/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="relative rounded-2xl md:rounded-[3rem] overflow-hidden p-[1px] animate-pulse-glow">
          <div className="bg-brand-bg/95 rounded-2xl md:rounded-[3rem] p-8 md:p-16 text-center relative z-10 flex flex-col items-center">
            <span className="text-brand-accent mb-4 text-4xl">🌿</span>
            <h2 className="text-3xl md:text-5xl font-serif text-brand-text mb-4">Become a Guardian.</h2>
            <p className="text-brand-soft text-sm md:text-lg max-w-xl mb-8 font-serif italic">
              $4.99/month. Unlock the complete Soft Toolkit, ad-free reading, and support the quiet ecosystem.
            </p>
            <Link href="/sanctuary-pass" className="bg-brand-accent text-white px-8 py-4 rounded-full text-[10px] tracking-widest uppercase font-bold hover:scale-105 transition-transform shadow-[0_0_30px_rgba(201,164,106,0.3)]">View Sanctuary Pass</Link>
          </div>
        </div>
      </section>
      
      {/* ===== 13. PROMISE FOOTER ===== */}
      <section className="border-t border-brand-border bg-brand-bg py-16 text-center px-4">
        <p className="text-brand-soft uppercase tracking-[0.3em] text-[10px] mb-6">The Quietly Humans Promise</p>
        <h2 className="text-2xl md:text-3xl font-serif text-brand-text max-w-2xl mx-auto leading-relaxed italic opacity-80">
          &ldquo;Whenever the world is too loud, or the night is too long, there is a quiet room waiting for you here.&rdquo;
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/toolkit" className="text-xs text-brand-soft hover:text-brand-text transition-colors border-b border-brand-border pb-1">Soft Toolkit</Link>
          <Link href="/store" className="text-xs text-brand-soft hover:text-brand-text transition-colors border-b border-brand-border pb-1">Store</Link>
          <Link href="/breathe" className="text-xs text-brand-soft hover:text-brand-text transition-colors border-b border-brand-border pb-1">Breathing</Link>
          <Link href="/focus" className="text-xs text-brand-soft hover:text-brand-text transition-colors border-b border-brand-border pb-1">Focus Timer</Link>
          <Link href="/start" className="text-xs text-brand-soft hover:text-brand-text transition-colors border-b border-brand-border pb-1">Start Here</Link>
          <Link href="/sanctuary-pass" className="text-xs text-brand-soft hover:text-brand-text transition-colors border-b border-brand-border pb-1">Sanctuary Pass</Link>
        </div>
      </section>

    </div>
  );
}
