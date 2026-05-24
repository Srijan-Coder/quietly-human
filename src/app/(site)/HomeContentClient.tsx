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
    <div className="relative min-h-screen w-full bg-[#0a0a0a] text-[#e0e0e0] font-sans selection:bg-brand-accent selection:text-white overflow-hidden">
      <AmbientBackground />
      
      {/* 1. Cinematic Hero */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 text-center">
        <div className="z-10 flex flex-col items-center max-w-4xl">
          <motion.p
            initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-xs md:text-sm tracking-[0.3em] uppercase text-brand-soft mb-8"
          >
            {greeting}
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, filter: "blur(20px)", scale: 0.9 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-tight text-white leading-tight mb-8"
          >
            The quietest corner <br className="hidden md:block"/> of the internet.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="text-brand-soft text-lg md:text-xl max-w-2xl leading-relaxed mb-12"
          >
            A digital sanctuary for overthinkers. Write your midnight letters, use our clinical toolkits, and remember how to breathe.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-6 items-center"
          >
            <Link href="/onboarding" className="bg-white text-black px-8 py-4 rounded-full text-xs tracking-widest uppercase font-bold hover:scale-105 transition-transform">
              Enter Sanctuary
            </Link>
            <Link href="/pilgrim" className="px-8 py-4 rounded-full text-xs tracking-widest uppercase text-brand-soft hover:text-white border border-brand-border/50 hover:border-white/50 transition-all">
              Explore the Wall
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. The Live Pulse */}
      <section className="relative w-full border-y border-white/10 bg-white/5 backdrop-blur-md py-6 overflow-hidden">
        <div className="flex whitespace-nowrap animate-[marquee_40s_linear_infinite] gap-12 text-sm text-brand-soft font-serif italic">
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"/> {stats.candles.toLocaleString()} candles lit</span>
          <span>•</span>
          <span>{stats.notes.toLocaleString()} pilgrim notes left</span>
          <span>•</span>
          <span>{stats.posts.toLocaleString()} midnight letters written</span>
          <span>•</span>
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"/> {stats.candles.toLocaleString()} candles lit</span>
          <span>•</span>
          <span>{stats.notes.toLocaleString()} pilgrim notes left</span>
          <span>•</span>
          <span>{stats.posts.toLocaleString()} midnight letters written</span>
        </div>
      </section>

      {/* 3. The Bento Box Ecosystem */}
      <section className="max-w-6xl mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Box 1: The Toolkit */}
        <div className="lg:col-span-2 bg-[#121212] border border-white/10 p-8 md:p-12 rounded-[2rem] flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"/>
          <div className="z-10">
            <h2 className="text-3xl font-serif text-white mb-4">The Soft Toolkit</h2>
            <p className="text-brand-soft mb-12 max-w-md">15+ interactive psychological tools designed to dissolve worry, redirect panic, and help you find focus.</p>
          </div>
          <div className="z-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/toolkit/worry-dissolver" className="bg-black/50 border border-white/5 p-4 rounded-xl hover:bg-white/5 transition-colors">
              <h3 className="text-white text-sm mb-1">Worry Dissolver</h3>
              <p className="text-brand-soft text-[10px] uppercase tracking-widest">For racing thoughts</p>
            </Link>
            <Link href="/toolkit/panic-redirector" className="bg-black/50 border border-white/5 p-4 rounded-xl hover:bg-white/5 transition-colors">
              <h3 className="text-white text-sm mb-1">Panic Redirector</h3>
              <p className="text-brand-soft text-[10px] uppercase tracking-widest">Ground yourself</p>
            </Link>
          </div>
        </div>

        {/* Box 2: Pilgrim Notes */}
        <div className="bg-[#121212] border border-white/10 p-8 rounded-[2rem] flex flex-col group relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"/>
           <h2 className="text-2xl font-serif text-white mb-2 z-20">The Community Wall</h2>
           <p className="text-brand-soft text-sm mb-8 z-20">Recent thoughts left behind.</p>
           
           <div className="flex flex-col gap-4 z-0 opacity-60 group-hover:opacity-100 transition-opacity">
              {latestNotes.map((note) => (
                <div key={note.id} className="bg-white/5 p-4 rounded-xl text-sm italic border border-white/5">
                  "{note.content.substring(0, 80)}..."
                </div>
              ))}
           </div>
        </div>

        {/* Box 3: Creator Pitch */}
        <div className="bg-[#121212] border border-white/10 p-8 rounded-[2rem] flex flex-col justify-center items-center text-center group">
          <h2 className="text-2xl font-serif text-white mb-4">Don't scream into the void.</h2>
          <p className="text-brand-soft text-sm mb-8">Build your own quiet room. Publish essays, curate your audience, and monetize your digital products using Creator Pins.</p>
          <Link href="/onboarding" className="text-xs uppercase tracking-widest border-b border-white/30 pb-1 hover:border-white transition-colors">
            Start Writing
          </Link>
        </div>

        {/* Box 4: Latest Posts */}
        <div className="lg:col-span-2 bg-[#121212] border border-white/10 p-8 md:p-12 rounded-[2rem] flex flex-col justify-between">
           <div className="flex justify-between items-end mb-12">
             <div>
                <h2 className="text-3xl font-serif text-white mb-2">The Reading Room</h2>
                <p className="text-brand-soft">A feed without the noise. Curated essays.</p>
             </div>
             <Link href="/reading-room" className="hidden md:block text-xs uppercase tracking-widest border border-white/20 px-4 py-2 rounded-full hover:bg-white hover:text-black transition-colors">
               Read All
             </Link>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestPosts.map((post) => (
                <Link key={post.id} href={`/room/${post.profiles?.username}/${post.slug}`} className="block group">
                  <h3 className="text-xl font-serif text-white group-hover:text-brand-accent transition-colors mb-2">{post.title}</h3>
                  <p className="text-sm text-brand-soft line-clamp-2">{post.excerpt}</p>
                  <p className="text-xs text-brand-soft/50 mt-4 uppercase tracking-widest">By @{post.profiles?.username}</p>
                </Link>
              ))}
           </div>
        </div>

      </section>

      {/* 4. Sanctuary Pass CTA */}
      <section className="max-w-4xl mx-auto px-6 py-32 mb-32">
        <div className="relative rounded-[3rem] overflow-hidden p-[1px]">
          {/* Glowing Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/0 via-brand-accent to-brand-accent/0 opacity-50"/>
          
          <div className="bg-[#0a0a0a] rounded-[3rem] p-12 md:p-24 text-center relative z-10 flex flex-col items-center">
             <span className="text-brand-accent mb-6 text-4xl">🕊️</span>
             <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Become a Guardian.</h2>
             <p className="text-brand-soft text-lg max-w-lg mb-12">Upgrade to the Sanctuary Pass for $4.99/month. Unlock the complete Soft Toolkit, ad-free reading, and support the ecosystem.</p>
             <Link href="/sanctuary-pass" className="bg-white text-black px-8 py-4 rounded-full text-xs tracking-widest uppercase font-bold hover:scale-105 transition-transform">
                View Sanctuary Pass
             </Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
