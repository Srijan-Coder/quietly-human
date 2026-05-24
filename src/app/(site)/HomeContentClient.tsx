"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import AmbientBackground from "@/components/global/AmbientBackground";

export default function HomeContentClient({ stats, latestNotes, latestPosts }: { stats: any, latestNotes: any[], latestPosts: any[] }) {
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

  return (
    <div className="relative min-h-screen w-full bg-[#0d0d0d] text-[#e0e0e0] font-sans selection:bg-brand-accent selection:text-white overflow-hidden">
      <AmbientBackground />
      
      {/* 1. Cinematic Hero */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-6 text-center">
        <div className="z-10 flex flex-col items-center max-w-4xl mt-12">
          <motion.p
            initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-brand-soft mb-8 flex items-center gap-3"
          >
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse-glow" />
            {greeting}
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, filter: "blur(20px)", scale: 0.95 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-[7rem] font-serif tracking-tight text-white leading-[1.1] mb-8"
          >
            The quietest corner <br className="hidden md:block"/> of the internet.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="text-brand-soft text-lg md:text-xl max-w-2xl leading-relaxed mb-12 font-serif italic"
          >
            A digital sanctuary for overthinkers. Write your midnight letters, use our clinical toolkits, and remember how to breathe.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto"
          >
            <Link href="/onboarding" className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-full text-[10px] tracking-widest uppercase font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Enter Sanctuary
            </Link>
            <Link href="/reading-room" className="w-full sm:w-auto px-8 py-4 rounded-full text-[10px] tracking-widest uppercase text-brand-soft hover:text-white border border-white/10 hover:border-white/30 transition-all bg-white/5 backdrop-blur-md">
              Enter Reading Room
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. The Live Pulse */}
      <section className="relative w-full border-y border-white/5 bg-white/5 backdrop-blur-md py-4 overflow-hidden z-20">
        <div className="flex whitespace-nowrap animate-marquee gap-16 text-xs text-brand-soft font-sans tracking-widest uppercase">
          <span className="flex items-center gap-3"><span className="text-brand-accent">✦</span> {stats.candles.toLocaleString()} candles lit</span>
          <span className="flex items-center gap-3"><span className="text-brand-accent">✦</span> {stats.notes.toLocaleString()} pilgrim notes</span>
          <span className="flex items-center gap-3"><span className="text-brand-accent">✦</span> {stats.posts.toLocaleString()} midnight letters</span>
          <span className="flex items-center gap-3"><span className="text-brand-accent">✦</span> {stats.candles.toLocaleString()} candles lit</span>
          <span className="flex items-center gap-3"><span className="text-brand-accent">✦</span> {stats.notes.toLocaleString()} pilgrim notes</span>
          <span className="flex items-center gap-3"><span className="text-brand-accent">✦</span> {stats.posts.toLocaleString()} midnight letters</span>
          <span className="flex items-center gap-3"><span className="text-brand-accent">✦</span> {stats.candles.toLocaleString()} candles lit</span>
        </div>
      </section>

      {/* 3. The Asymmetric Bento Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Box 1: The Soft Toolkit (2 cols) */}
        <Link href="/toolkit" className="md:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2rem] flex flex-col justify-between group overflow-hidden relative hover:border-brand-accent/50 transition-colors duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"/>
          <div className="z-10 mb-12">
            <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-4 block font-bold">01. Interactive</span>
            <h2 className="text-4xl font-serif text-white mb-4">The Soft Toolkit</h2>
            <p className="text-brand-soft max-w-md">20 psychological tools designed to dissolve worry, redirect panic, and help you find focus. Used by thousands daily.</p>
          </div>
          <div className="z-10 grid grid-cols-2 gap-4">
            <div className="bg-black/40 border border-white/5 p-4 md:p-6 rounded-2xl group-hover:bg-white/5 transition-colors">
              <span className="text-2xl mb-2 block">🌫️</span>
              <h3 className="text-white text-sm md:text-base mb-1 font-serif">Worry Dissolver</h3>
            </div>
            <div className="bg-black/40 border border-white/5 p-4 md:p-6 rounded-2xl group-hover:bg-white/5 transition-colors">
              <span className="text-2xl mb-2 block">🕰️</span>
              <h3 className="text-white text-sm md:text-base mb-1 font-serif">Panic Redirector</h3>
            </div>
          </div>
        </Link>

        {/* Box 2: Pilgrim Notes (1 col) */}
        <Link href="/reading-room" className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2rem] flex flex-col group relative overflow-hidden hover:border-brand-accent/50 transition-colors duration-500">
           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"/>
           <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-4 block font-bold z-20">02. Community</span>
           <h2 className="text-3xl font-serif text-white mb-2 z-20">Pilgrim Notes</h2>
           <p className="text-brand-soft text-sm mb-8 z-20">Anonymous thoughts left behind by others.</p>
           
           <div className="flex flex-col gap-4 z-0 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
              {latestNotes.map((note) => (
                <div key={note.id} className="bg-black/40 p-4 rounded-xl text-sm italic border border-white/5 font-serif text-brand-soft">
                  "{note.content.substring(0, 70)}..."
                </div>
              ))}
           </div>
        </Link>

        {/* Box 3: The Reading Room (2 cols) */}
        <Link href="/reading-room" className="md:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2rem] flex flex-col justify-between group overflow-hidden relative hover:border-brand-accent/50 transition-colors duration-500">
           <div className="flex justify-between items-start mb-12 relative z-10">
             <div>
                <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-4 block font-bold">03. Consumption</span>
                <h2 className="text-4xl font-serif text-white mb-2">The Reading Room</h2>
                <p className="text-brand-soft">A feed without the noise. Read curated midnight letters and journals.</p>
             </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              {latestPosts.map((post) => (
                <div key={post.id} className="block group/post p-6 bg-black/40 rounded-2xl border border-white/5">
                  <h3 className="text-xl font-serif text-white group-hover/post:text-brand-accent transition-colors mb-2 line-clamp-1">{post.title}</h3>
                  <p className="text-sm text-brand-soft line-clamp-2 mb-4 font-serif italic">{post.excerpt}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-brand-accent/20 flex items-center justify-center text-[10px]">✨</div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">@{post.profiles?.username}</p>
                  </div>
                </div>
              ))}
           </div>
        </Link>

        {/* Box 4: Creator Pitch (1 col) */}
        <Link href="/dashboard" className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2rem] flex flex-col justify-center items-center text-center group hover:border-white/30 transition-colors duration-500">
          <span className="text-4xl mb-6">🖋️</span>
          <h2 className="text-2xl font-serif text-white mb-4">Don't scream into the void.</h2>
          <p className="text-brand-soft text-sm mb-8">Build your own quiet room. Publish essays, curate your audience, and monetize digital products.</p>
          <span className="text-[10px] uppercase tracking-widest border-b border-brand-accent/50 text-brand-accent pb-1 group-hover:border-brand-accent transition-colors font-bold">
            Creator Dashboard
          </span>
        </Link>

      </section>

      {/* 4. Sanctuary Pass CTA */}
      <section className="max-w-5xl mx-auto px-6 py-12 mb-32 relative">
        <div className="absolute inset-0 bg-brand-accent/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative rounded-[3rem] overflow-hidden p-[1px] animate-pulse-glow">
          <div className="bg-[#0d0d0d]/90 backdrop-blur-3xl rounded-[3rem] p-12 md:p-24 text-center relative z-10 flex flex-col items-center">
             <span className="text-brand-accent mb-6 text-5xl">🌿</span>
             <h2 className="text-5xl md:text-6xl font-serif text-white mb-6">Become a Guardian.</h2>
             <p className="text-brand-soft text-lg max-w-xl mb-12 font-serif italic">
               Upgrade to the Sanctuary Pass for $4.99/month. Unlock the complete Soft Toolkit, ad-free reading, and support the quiet ecosystem.
             </p>
             <Link href="/sanctuary-pass" className="bg-brand-accent text-white px-10 py-5 rounded-full text-[10px] tracking-widest uppercase font-bold hover:scale-105 transition-transform shadow-[0_0_30px_rgba(201,164,106,0.3)]">
                View Sanctuary Pass
             </Link>
          </div>
        </div>
      </section>
      
      {/* 5. The Promise */}
      <section className="border-t border-white/5 bg-black py-24 text-center px-6">
        <p className="text-brand-soft uppercase tracking-[0.3em] text-[10px] mb-8">The Quietly Humans Promise</p>
        <h2 className="text-3xl md:text-4xl font-serif text-white max-w-2xl mx-auto leading-relaxed italic opacity-80 hover:opacity-100 transition-opacity duration-1000">
          "Whenever the world is too loud, or the night is too long, there is a quiet room waiting for you here."
        </h2>
        <div className="mt-12 flex justify-center gap-6">
          <Link href="/toolkit" className="text-xs text-brand-soft hover:text-white transition-colors border-b border-white/10 pb-1">Enter the Soft Toolkit</Link>
        </div>
      </section>

    </div>
  );
}
