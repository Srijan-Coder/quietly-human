"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import AmbientBackground from "@/components/global/AmbientBackground";

// Products with pricing — books go to /books, not Gumroad
const storeProducts = [
  { emoji: "📓", title: "The Overthinking Journal", desc: "A guided journal for anxious minds. 90 pages of prompts.", price: "$12.99", tag: "Physical Book", url: "/books" },
  { emoji: "🧠", title: "ADHD Life System — Notion", desc: "Complete Notion dashboard for ADHD management & daily planning.", price: "$9.99", tag: "Notion Template", url: "/store" },
  { emoji: "🌿", title: "Sanctuary Pass", desc: "Unlock all 20 premium tools, ad-free reading & quiet mode.", price: "$4.99/mo", tag: "Membership", url: "/sanctuary-pass" },
  { emoji: "📖", title: "Midnight Letters Vol. 1", desc: "A curated collection of our best midnight essays.", price: "Free", tag: "Free Ebook", url: "/books" },
  { emoji: "🗂️", title: "Soft Living Planner", desc: "Weekly planner Notion template for intentional, soft living.", price: "$4.99", tag: "Notion Template", url: "/store" },
  { emoji: "📦", title: "Creator Starter Kit", desc: "Everything you need to start writing and building on QH.", price: "Free", tag: "Free Download", url: "/store" },
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

const categoryLabels: Record<string, string> = { blog: "Quiet Thought", letter: "Midnight Letter", guide: "Pillar Guide", ebook: "Book", quote: "Quiet Word" };

// Fallback posts when DB is empty
const fallbackPosts = [
  { id: "f1", title: "Why your brain won't shut up at 3AM", slug: "brain-3am", excerpt: "A deep dive into why anxious minds activate at night and how to find peace.", type: "letter", candle_count: 42, profiles: { username: "srijan", display_name: "Srijan" } },
  { id: "f2", title: "The introvert's guide to recovering from social burnout", slug: "introvert-burnout", excerpt: "You're not broken. You're just overstimulated. Here's how to recover.", type: "guide", candle_count: 38, profiles: { username: "srijan", display_name: "Srijan" } },
  { id: "f3", title: "Soft living isn't lazy — it's intentional", slug: "soft-living", excerpt: "The case for choosing gentleness in a world that rewards hustle.", type: "blog", candle_count: 55, profiles: { username: "srijan", display_name: "Srijan" } },
  { id: "f4", title: "How to start journaling when you hate journaling", slug: "start-journaling", excerpt: "Forget the aesthetic. Here's a raw, honest guide to actually writing.", type: "guide", candle_count: 27, profiles: { username: "srijan", display_name: "Srijan" } },
  { id: "f5", title: "The overthinking loop: a clinical breakdown", slug: "overthinking-loop", excerpt: "What happens in your brain when you spiral — and 3 ways to break the cycle.", type: "letter", candle_count: 61, profiles: { username: "srijan", display_name: "Srijan" } },
  { id: "f6", title: "Digital minimalism for anxious minds", slug: "digital-minimalism", excerpt: "Your phone is making your anxiety worse. Here's how to fix that.", type: "blog", candle_count: 33, profiles: { username: "srijan", display_name: "Srijan" } },
];

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

  // Use fallback posts if DB returns empty
  const displayPosts = latestPosts.length > 0 ? latestPosts : fallbackPosts;
  const displayNotes = latestNotes.length > 0 ? latestNotes : [
    { id: "fn1", content: "I've been carrying this weight for so long. Leaving it here feels right." },
    { id: "fn2", content: "It's 2AM and I just needed someone to tell me it's going to be okay." },
    { id: "fn3", content: "I'm learning that rest is not the enemy. Thank you for this space." },
  ];

  // Merge DB products with static (all go to internal pages now)
  const allProducts = storeProducts;

  return (
    <div className="relative min-h-screen w-full font-sans selection:bg-amber-600 selection:text-white overflow-hidden"
      style={{ backgroundColor: "var(--color-bg, #0d0d0d)", color: "var(--color-text, #EBE5DF)" }}>
      <AmbientBackground />
      
      {/* ===== 1. HERO ===== */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col justify-center items-center px-4 md:px-6 text-center">
        <div className="z-10 flex flex-col items-center max-w-4xl mt-16 md:mt-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-[10px] md:text-xs tracking-[0.3em] uppercase mb-6 flex items-center gap-3"
            style={{ color: "var(--color-soft, #A39E99)" }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse-glow" style={{ backgroundColor: "var(--color-accent, #C9A46A)" }} />
            {greeting}
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] font-serif tracking-tight leading-[1.1] mb-6"
            style={{ color: "var(--color-text, #EBE5DF)" }}
          >
            The quietest corner <br className="hidden md:block"/> of the internet.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-base md:text-xl max-w-2xl leading-relaxed mb-8 font-serif italic px-4"
            style={{ color: "var(--color-soft, #A39E99)" }}
          >
            A digital sanctuary for overthinkers. Write midnight letters, use clinical toolkits, and remember how to breathe.
          </motion.p>

          <div className="flex flex-col items-center gap-3 w-full px-4">
            <Link href="/onboarding" className="w-full sm:w-auto px-8 py-4 rounded-full text-[10px] tracking-widest uppercase font-bold hover:scale-105 transition-transform shadow-lg text-center"
              style={{ backgroundColor: "var(--color-text, #EBE5DF)", color: "var(--color-bg, #0d0d0d)" }}>
              Enter Sanctuary
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/reading-room" className="text-[10px] uppercase tracking-widest transition-colors" style={{ color: "var(--color-soft, #A39E99)" }}>
                Reading Room
              </Link>
              <span style={{ color: "var(--color-border, #333)" }}>·</span>
              <Link href="/start" className="text-[10px] uppercase tracking-widest font-bold transition-colors" style={{ color: "var(--color-accent, #C9A46A)" }}>
                New here? Start here →
              </Link>
            </div>
          </div>

          {stats.members > 0 && (
            <p className="mt-8 text-[10px] uppercase tracking-widest" style={{ color: "var(--color-soft, #A39E99)" }}>
              Join {stats.members.toLocaleString()}+ quiet humans
            </p>
          )}
        </div>
      </section>

      {/* ===== 2. LIVE PULSE ===== */}
      <section className="relative w-full py-3 overflow-hidden z-20" style={{ borderTop: "1px solid var(--color-border, #2E2A27)", borderBottom: "1px solid var(--color-border, #2E2A27)", backgroundColor: "var(--color-card, #171717)" }}>
        <div className="flex whitespace-nowrap animate-marquee gap-12 text-[10px] md:text-xs font-sans tracking-widest uppercase" style={{ color: "var(--color-soft, #A39E99)" }}>
          <span className="flex items-center gap-2"><span style={{ color: "var(--color-accent, #C9A46A)" }}>✦</span> {stats.candles.toLocaleString()} candles lit</span>
          <span className="flex items-center gap-2"><span style={{ color: "var(--color-accent, #C9A46A)" }}>✦</span> {stats.notes.toLocaleString()} pilgrim notes</span>
          <span className="flex items-center gap-2"><span style={{ color: "var(--color-accent, #C9A46A)" }}>✦</span> {stats.posts.toLocaleString()} writings published</span>
          <span className="flex items-center gap-2"><span style={{ color: "var(--color-accent, #C9A46A)" }}>✦</span> {stats.members.toLocaleString()} quiet humans</span>
          <span className="flex items-center gap-2"><span style={{ color: "var(--color-accent, #C9A46A)" }}>✦</span> {stats.candles.toLocaleString()} candles lit</span>
          <span className="flex items-center gap-2"><span style={{ color: "var(--color-accent, #C9A46A)" }}>✦</span> {stats.notes.toLocaleString()} pilgrim notes</span>
        </div>
      </section>

      {/* ===== 3. TRENDING WRITINGS ===== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-widest mb-2 block font-bold" style={{ color: "var(--color-accent, #C9A46A)" }}>Latest from the sanctuary</span>
            <h2 className="text-3xl md:text-4xl font-serif" style={{ color: "var(--color-text, #EBE5DF)" }}>Trending Writings</h2>
          </div>
          <Link href="/reading-room" className="text-[10px] uppercase tracking-widest pb-1 font-bold shrink-0"
            style={{ color: "var(--color-accent, #C9A46A)", borderBottom: "1px solid var(--color-accent, #C9A46A)" }}>
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {displayPosts.map((post: any) => (
            <Link key={post.id} href={post.slug ? `/read/${post.slug}` : `/reading-room`}
              className="group p-5 rounded-2xl transition-all flex flex-col"
              style={{ backgroundColor: "var(--color-card, #171717)", border: "1px solid var(--color-border, #2E2A27)" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full"
                  style={{ color: "var(--color-accent, #C9A46A)", backgroundColor: "rgba(201,164,106,0.1)", border: "1px solid rgba(201,164,106,0.2)" }}>
                  {categoryLabels[post.type] || post.type}
                </span>
                <span className="text-[10px]" style={{ color: "var(--color-soft, #A39E99)" }}>🕯️ {post.candle_count || 0}</span>
              </div>
              <h3 className="text-lg font-serif mb-2 line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors"
                style={{ color: "var(--color-text, #EBE5DF)" }}>
                {post.title}
              </h3>
              {post.excerpt && <p className="text-sm line-clamp-2 mb-4 font-serif italic flex-grow" style={{ color: "var(--color-soft, #A39E99)" }}>{post.excerpt}</p>}
              <div className="flex items-center gap-2 mt-auto pt-3" style={{ borderTop: "1px solid var(--color-border, #2E2A27)" }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ backgroundColor: "rgba(201,164,106,0.2)", color: "var(--color-text, #EBE5DF)" }}>
                  {post.profiles?.display_name?.charAt(0) || "S"}
                </div>
                <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--color-soft, #A39E99)" }}>@{post.profiles?.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 4. BENTO GRID ===== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/toolkit" className="md:col-span-2 p-6 md:p-10 rounded-2xl flex flex-col justify-between group transition-colors"
          style={{ backgroundColor: "var(--color-card, #171717)", border: "1px solid var(--color-border, #2E2A27)" }}>
          <div className="mb-6">
            <span className="text-[10px] uppercase tracking-widest mb-3 block font-bold" style={{ color: "var(--color-accent, #C9A46A)" }}>Interactive Toolkit</span>
            <h2 className="text-2xl md:text-4xl font-serif mb-3" style={{ color: "var(--color-text, #EBE5DF)" }}>The Soft Toolkit</h2>
            <p className="text-sm max-w-md" style={{ color: "var(--color-soft, #A39E99)" }}>20 psychological tools for worry, panic, ADHD & overthinking. Based on CBT, DBT & clinical psychology.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 md:p-5 rounded-xl" style={{ backgroundColor: "var(--color-bg, #0d0d0d)", border: "1px solid var(--color-border, #2E2A27)" }}>
              <span className="text-xl mb-1 block">🌫️</span>
              <h3 className="text-xs font-serif" style={{ color: "var(--color-text, #EBE5DF)" }}>Worry Dissolver</h3>
            </div>
            <div className="p-3 md:p-5 rounded-xl" style={{ backgroundColor: "var(--color-bg, #0d0d0d)", border: "1px solid var(--color-border, #2E2A27)" }}>
              <span className="text-xl mb-1 block">🕰️</span>
              <h3 className="text-xs font-serif" style={{ color: "var(--color-text, #EBE5DF)" }}>Panic Redirector</h3>
            </div>
          </div>
        </Link>
        <Link href="/pilgrim" className="p-6 md:p-10 rounded-2xl flex flex-col group transition-colors"
          style={{ backgroundColor: "var(--color-card, #171717)", border: "1px solid var(--color-border, #2E2A27)" }}>
          <span className="text-[10px] uppercase tracking-widest mb-3 block font-bold" style={{ color: "var(--color-accent, #C9A46A)" }}>Community Wall</span>
          <h2 className="text-2xl font-serif mb-2" style={{ color: "var(--color-text, #EBE5DF)" }}>Pilgrim Notes</h2>
          <p className="text-sm mb-4" style={{ color: "var(--color-soft, #A39E99)" }}>Anonymous thoughts from quiet humans.</p>
          <div className="flex flex-col gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
            {displayNotes.map((note: any) => (
              <div key={note.id} className="p-3 rounded-xl text-xs italic font-serif line-clamp-2"
                style={{ backgroundColor: "var(--color-bg, #0d0d0d)", border: "1px solid var(--color-border, #2E2A27)", color: "var(--color-soft, #A39E99)" }}>
                &ldquo;{note.content.substring(0, 60)}...&rdquo;
              </div>
            ))}
          </div>
        </Link>
      </section>

      {/* ===== 5. TESTIMONIALS ===== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-widest mb-2 block font-bold" style={{ color: "var(--color-accent, #C9A46A)" }}>Social Proof</span>
          <h2 className="text-3xl md:text-4xl font-serif" style={{ color: "var(--color-text, #EBE5DF)" }}>What quiet humans say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t, i) => (
            <div key={i} className="p-6 md:p-8 rounded-2xl"
              style={{ backgroundColor: "var(--color-card, #171717)", border: "1px solid var(--color-border, #2E2A27)" }}>
              <p className="font-serif italic text-base md:text-lg leading-relaxed mb-4" style={{ color: "var(--color-text, #EBE5DF)" }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold" style={{ color: "var(--color-soft, #A39E99)" }}>— {t.name}</span>
                <span className="text-[9px] uppercase tracking-widest px-2 py-1 rounded-full"
                  style={{ color: "var(--color-soft, #A39E99)", backgroundColor: "var(--color-bg, #0d0d0d)", border: "1px solid var(--color-border, #2E2A27)" }}>
                  {t.source}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 6. ABOUT THE CREATOR ===== */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="p-6 md:p-10 rounded-2xl flex flex-col md:flex-row items-center gap-6 md:gap-10"
          style={{ backgroundColor: "var(--color-card, #171717)", border: "1px solid var(--color-border, #2E2A27)" }}>
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-3xl md:text-4xl shrink-0"
            style={{ backgroundColor: "rgba(201,164,106,0.1)", border: "2px solid rgba(201,164,106,0.3)" }}>
            🧑‍💻
          </div>
          <div className="text-center md:text-left">
            <span className="text-[10px] uppercase tracking-widest mb-2 block font-bold" style={{ color: "var(--color-accent, #C9A46A)" }}>The human behind this</span>
            <h3 className="text-2xl md:text-3xl font-serif mb-3" style={{ color: "var(--color-text, #EBE5DF)" }}>Hi, I&apos;m Srijan.</h3>
            <p className="text-sm md:text-base leading-relaxed mb-4" style={{ color: "var(--color-soft, #A39E99)" }}>
              I built Quietly Humans because I needed it to exist. As an overthinker who has spent too many nights at 3AM staring at ceilings, I wanted to create a space that actually understands what it feels like to think too much.
            </p>
            <Link href="/about" className="text-[10px] uppercase tracking-widest font-bold transition-colors"
              style={{ color: "var(--color-accent, #C9A46A)", borderBottom: "1px solid var(--color-accent, #C9A46A)" }}>
              Read my full story →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 7. THE QUIET STORE ===== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-widest mb-2 block font-bold" style={{ color: "var(--color-accent, #C9A46A)" }}>Shop</span>
            <h2 className="text-3xl md:text-4xl font-serif" style={{ color: "var(--color-text, #EBE5DF)" }}>The Quiet Store</h2>
            <p className="mt-2 text-sm max-w-lg" style={{ color: "var(--color-soft, #A39E99)" }}>Books, journals, Notion templates, memberships & digital tools.</p>
          </div>
          <Link href="/store" className="text-[10px] uppercase tracking-widest pb-1 font-bold shrink-0"
            style={{ color: "var(--color-accent, #C9A46A)", borderBottom: "1px solid var(--color-accent, #C9A46A)" }}>Browse All →</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          {allProducts.slice(0, 6).map((product, idx) => {
            const isFree = product.price === "Free";
            return (
              <Link key={idx} href={product.url}
                className="group rounded-2xl overflow-hidden transition-all flex flex-col"
                style={{ backgroundColor: "var(--color-card, #171717)", border: "1px solid var(--color-border, #2E2A27)" }}>
                <div className="h-28 md:h-36 flex items-center justify-center relative transition-colors"
                  style={{ backgroundColor: "var(--color-bg, #0d0d0d)", borderBottom: "1px solid var(--color-border, #2E2A27)" }}>
                  <span className="text-3xl md:text-4xl grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">{product.emoji}</span>
                  <span className="absolute top-2 left-2 text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ color: "var(--color-soft, #A39E99)", backgroundColor: "var(--color-bg, #0d0d0d)", border: "1px solid var(--color-border, #2E2A27)" }}>
                    {product.tag}
                  </span>
                  <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${isFree ? "text-green-400" : ""}`}
                    style={isFree ? { backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" } : { color: "var(--color-accent, #C9A46A)", backgroundColor: "rgba(201,164,106,0.1)", border: "1px solid rgba(201,164,106,0.2)" }}>
                    {product.price}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-sm md:text-base font-serif mb-1 line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors"
                    style={{ color: "var(--color-text, #EBE5DF)" }}>
                    {product.title}
                  </h3>
                  <p className="text-[11px] line-clamp-2 flex-grow" style={{ color: "var(--color-soft, #A39E99)" }}>{product.desc}</p>
                  <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--color-border, #2E2A27)" }}>
                    <span className={`text-[10px] uppercase tracking-widest font-bold ${isFree ? "text-green-400" : ""}`}
                      style={isFree ? {} : { color: "var(--color-accent, #C9A46A)" }}>
                      {isFree ? "Get Free →" : "View Details →"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===== 8. NEWSLETTER + LEAD MAGNET ===== */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="p-8 md:p-12 rounded-2xl text-center relative overflow-hidden"
          style={{ backgroundColor: "var(--color-card, #171717)", border: "1px solid var(--color-border, #2E2A27)" }}>
          <div className="relative z-10">
            <span className="text-3xl md:text-4xl mb-4 block">📬</span>
            <h2 className="text-2xl md:text-3xl font-serif mb-3" style={{ color: "var(--color-text, #EBE5DF)" }}>The Quiet Letter</h2>
            <p className="text-sm md:text-base mb-2 max-w-lg mx-auto" style={{ color: "var(--color-soft, #A39E99)" }}>
              Soft essays for tired hearts, sent twice a month. No spam, no hustle, no noise.
            </p>
            <p className="text-xs md:text-sm font-bold mb-6" style={{ color: "var(--color-accent, #C9A46A)" }}>
              🎁 Sign up and get &ldquo;The 7-Day Soft Reset&rdquo; — a free journaling kit (PDF)
            </p>

            {subStatus === "success" ? (
              <div className="rounded-xl p-6 font-serif italic text-green-400" style={{ backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
                Welcome to the sanctuary. Check your inbox for the free journaling kit. 🌿
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required
                  className="flex-1 rounded-full px-5 py-3 text-sm outline-none transition-colors"
                  style={{ backgroundColor: "var(--color-bg, #0d0d0d)", border: "1px solid var(--color-border, #2E2A27)", color: "var(--color-text, #EBE5DF)" }} />
                <button type="submit" disabled={subStatus === "loading"}
                  className="px-6 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold hover:scale-105 transition-transform disabled:opacity-50 shrink-0"
                  style={{ backgroundColor: "var(--color-text, #EBE5DF)", color: "var(--color-bg, #0d0d0d)" }}>
                  {subStatus === "loading" ? "Joining..." : "Join Free"}
                </button>
              </form>
            )}
            {subStatus === "error" && <p className="text-red-400 text-xs mt-3">Something went wrong. Please try again.</p>}
            <p className="text-[10px] mt-4 uppercase tracking-widest" style={{ color: "var(--color-soft, #A39E99)" }}>
              {stats.members > 0 ? `${stats.members.toLocaleString()}+ quiet humans already inside` : "Join the quiet revolution"}
            </p>
          </div>
        </div>
      </section>

      {/* ===== 9. EXPLORE ALL ROOMS ===== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-widest mb-2 block font-bold" style={{ color: "var(--color-accent, #C9A46A)" }}>Explore</span>
          <h2 className="text-3xl md:text-4xl font-serif mb-3" style={{ color: "var(--color-text, #EBE5DF)" }}>Every Quiet Room</h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {exploreRooms.map((room) => (
            <Link key={room.path} href={room.path}
              className="group rounded-xl p-4 text-center transition-all flex flex-col items-center"
              style={{ backgroundColor: "var(--color-card, #171717)", border: "1px solid var(--color-border, #2E2A27)" }}>
              <span className="text-2xl mb-2 grayscale group-hover:grayscale-0 transition-all duration-300">{room.emoji}</span>
              <h3 className="text-[11px] md:text-sm font-serif leading-tight group-hover:text-amber-400 transition-colors" style={{ color: "var(--color-text, #EBE5DF)" }}>{room.title}</h3>
              <p className="text-[9px] uppercase tracking-widest mt-1 hidden md:block" style={{ color: "var(--color-soft, #A39E99)" }}>{room.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 10. CREATOR PITCH ===== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="rounded-2xl p-8 md:p-14 text-center flex flex-col items-center"
          style={{ backgroundColor: "var(--color-card, #171717)", border: "1px solid var(--color-border, #2E2A27)" }}>
          <span className="text-4xl mb-4">🖋️</span>
          <h2 className="text-2xl md:text-3xl font-serif mb-3" style={{ color: "var(--color-text, #EBE5DF)" }}>Don&apos;t scream into the void.</h2>
          <p className="text-sm mb-6 max-w-lg" style={{ color: "var(--color-soft, #A39E99)" }}>Build your own quiet room. Publish essays, sell digital products, and grow your audience.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/onboarding" className="px-6 py-3 rounded-full text-[10px] tracking-widest uppercase font-bold hover:scale-105 transition-transform text-center"
              style={{ backgroundColor: "var(--color-text, #EBE5DF)", color: "var(--color-bg, #0d0d0d)" }}>Start Writing</Link>
            <Link href="/dashboard" className="px-6 py-3 rounded-full text-[10px] tracking-widest uppercase text-center transition-all"
              style={{ color: "var(--color-soft, #A39E99)", border: "1px solid var(--color-border, #2E2A27)" }}>Dashboard</Link>
          </div>
        </div>
      </section>

      {/* ===== 11. SANCTUARY PASS CTA ===== */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-12 relative">
        <div className="absolute inset-0 blur-[80px] rounded-full pointer-events-none" style={{ backgroundColor: "rgba(201,164,106,0.1)" }} />
        <div className="relative rounded-2xl md:rounded-[3rem] overflow-hidden p-[1px] animate-pulse-glow">
          <div className="rounded-2xl md:rounded-[3rem] p-8 md:p-16 text-center relative z-10 flex flex-col items-center"
            style={{ backgroundColor: "var(--color-bg, #0d0d0d)" }}>
            <span className="mb-4 text-4xl" style={{ color: "var(--color-accent, #C9A46A)" }}>🌿</span>
            <h2 className="text-3xl md:text-5xl font-serif mb-4" style={{ color: "var(--color-text, #EBE5DF)" }}>Become a Guardian.</h2>
            <p className="text-sm md:text-lg max-w-xl mb-8 font-serif italic" style={{ color: "var(--color-soft, #A39E99)" }}>
              $4.99/month. Unlock the complete Soft Toolkit, ad-free reading, and support the quiet ecosystem.
            </p>
            <Link href="/sanctuary-pass" className="text-white px-8 py-4 rounded-full text-[10px] tracking-widest uppercase font-bold hover:scale-105 transition-transform"
              style={{ backgroundColor: "var(--color-accent, #C9A46A)", boxShadow: "0 0 30px rgba(201,164,106,0.3)" }}>
              View Sanctuary Pass
            </Link>
          </div>
        </div>
      </section>
      
      {/* ===== 12. PROMISE FOOTER ===== */}
      <section className="py-16 text-center px-4" style={{ borderTop: "1px solid var(--color-border, #2E2A27)", backgroundColor: "var(--color-bg, #0d0d0d)" }}>
        <p className="uppercase tracking-[0.3em] text-[10px] mb-6" style={{ color: "var(--color-soft, #A39E99)" }}>The Quietly Humans Promise</p>
        <h2 className="text-2xl md:text-3xl font-serif max-w-2xl mx-auto leading-relaxed italic opacity-80" style={{ color: "var(--color-text, #EBE5DF)" }}>
          &ldquo;Whenever the world is too loud, or the night is too long, there is a quiet room waiting for you here.&rdquo;
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {[
            { label: "Soft Toolkit", path: "/toolkit" },
            { label: "Store", path: "/store" },
            { label: "Breathing", path: "/breathe" },
            { label: "Focus Timer", path: "/focus" },
            { label: "Start Here", path: "/start" },
            { label: "Sanctuary Pass", path: "/sanctuary-pass" },
          ].map(l => (
            <Link key={l.path} href={l.path} className="text-xs transition-colors pb-1"
              style={{ color: "var(--color-soft, #A39E99)", borderBottom: "1px solid var(--color-border, #2E2A27)" }}>{l.label}</Link>
          ))}
        </div>
      </section>

    </div>
  );
}
