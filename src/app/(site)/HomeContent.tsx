"use client";

import { useState, useEffect } from "react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import Link from "next/link";
import AmbientBackground from "@/components/global/AmbientBackground";
import { EmotionalPath } from "@/components/global/EmotionalPath";
import { TestimonialCarousel, type Testimonial } from "@/components/global/TestimonialCarousel";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

export default function HomeContent({ testimonials, latestAdditions }: { testimonials: Testimonial[], latestAdditions?: any[] }) {
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: i * 0.15 },
    }),
  };

  const books = latestAdditions?.filter(item => item._type === 'book') || [];

  const slides = (latestAdditions && latestAdditions.length > 0) ? latestAdditions.map(item => {
    let subtitle = "New Arrival";
    let cta = "Read More";
    let link = "#";

    if (item._type === 'book') {
      subtitle = item.bookFormat === 'free' ? "Free Ebook" : item.bookFormat === 'premium' ? "Premium Ebook" : "Physical Book";
      cta = item.bookFormat === 'premium' ? "Explore Book ☕" : "Read Book 📖";
      link = `/books/${item.slug}`;
    } else if (item._type === 'guide') {
      subtitle = "Sanctuary Guide";
      cta = "Read Guide 🌿";
      link = `/guides/${item.slug}`;
    } else if (item._type === 'letter') {
      subtitle = "Midnight Letter";
      cta = "Read Letter 💌";
      link = `/letters/${item.slug}`;
    } else if (item._type === 'post') {
      subtitle = "Journal Entry";
      cta = "Read Entry ✍️";
      link = `/blog/${item.slug}`;
    }

    return {
      title: item.title,
      subtitle,
      desc: item.tagline || item.subtitle || item.excerpt || "A quiet space for tired hearts.",
      cta,
      link,
      coverImage: item.coverImage,
    };
  }) : [
    {
      title: "7-Day Emotional Reset",
      subtitle: "Free Download",
      desc: "A gentle week-long journey to help you release the pressure of having everything figured out.",
      cta: "Get the free reset 💌",
      link: "/reset",
      coverImage: null,
    }
  ];

  const [headline, setHeadline] = useState("A quiet space for tired hearts.");
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const headlines = [
      "A quiet space for tired hearts.",
      "A digital sanctuary for overthinkers.",
      "A gentle corner of the internet.",
      "Words for those learning to live softly.",
      "A resting place for anxious minds.",
      "Permission to pause and breathe.",
      "A soft landing for hard days.",
      "Where quiet growth is celebrated.",
      "A reminder that you are not behind.",
      "An archive of late-night thoughts.",
      "You don't have to have it all figured out.",
      "For the ones tired of being strong.",
      "A quiet space to unlearn the hustle.",
      "A moment of stillness in a loud world."
    ];
    setHeadline(headlines[Math.floor(Math.random() * headlines.length)]);
  }, []);

  // Auto-slide for latest additions
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative overflow-hidden w-full bg-brand-bg">
      <AmbientBackground />
      {/* ─── 1. HERO SECTION ──────────────────────── */}
      <section className="relative w-full min-h-screen flex flex-col justify-center items-center pt-20 px-6 text-center overflow-hidden">

        {/* Radial glow behind headline */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, var(--color-accent) 0%, transparent 70%)",
            opacity: 0.08,
          }}
        />

        <div className="z-10 max-w-4xl flex flex-col items-center gap-6">
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.3em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="text-[10px] uppercase tracking-[0.5em] text-brand-accent"
          >
            A Digital Sanctuary 🌿
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] as [number,number,number,number], delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-balance tracking-tight text-brand-text"
          >
            {headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.8 }}
            className="text-brand-soft font-sans text-lg max-w-xl leading-relaxed"
          >
            Books, guides, resets, and digital spaces for people rebuilding softly. 🤍
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 1.3 }}
            className="flex flex-col sm:flex-row gap-4 mt-4"
          >
            <Link
              href="/search"
              className="px-8 py-4 bg-brand-text text-brand-bg rounded-full text-xs tracking-widest uppercase hover:bg-brand-accent hover:text-white transition-all duration-500 hover:scale-105"
            >
              Start Softly 🌿
            </Link>
            <Link
              href="/breathe"
              className="px-8 py-4 border border-brand-border text-brand-text rounded-full text-xs tracking-widest uppercase hover:border-brand-accent hover:text-brand-accent transition-all duration-500"
            >
              Enter Breathe Room 🕊️
            </Link>
          </motion.div>

          {/* Hero Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1.8 }}
            className="mt-12 w-full max-w-md"
          >
            <form className="flex flex-col md:flex-row gap-2" onSubmit={(e) => { e.preventDefault(); alert("Newsletter functionality coming soon!"); }}>
              <input 
                type="email" 
                placeholder="Join the midnight letters (email)..." 
                className="flex-1 bg-transparent border-b border-brand-border px-4 py-3 focus:outline-none focus:border-brand-accent transition-colors text-brand-text placeholder-brand-soft/50 text-sm text-center md:text-left"
                required
              />
              <button type="submit" className="px-6 py-3 text-xs uppercase tracking-widest text-brand-soft hover:text-brand-accent transition-colors">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 3, delay: 2.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-[10px] uppercase tracking-widest text-brand-soft">Scroll slowly 🕰️</span>
          <motion.div
            className="w-px h-12 bg-brand-accent origin-top"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* ─── 1.5. EMOTIONAL ONBOARDING ──────────── */}
      <EmotionalPath />

      {/* ─── 2. SOFT INTRO ──────────────────────── */}
      <section className="w-full py-32 px-6 bg-brand-card relative overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-px"
          style={{ background: "linear-gradient(90deg, transparent, var(--color-border), transparent)" }}
        />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          variants={fadeUp}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="font-serif text-3xl md:text-5xl text-brand-text leading-relaxed text-balance">
            You don&apos;t need to become someone else to belong here. 🤎
          </p>
          <p className="mt-8 text-brand-soft font-sans text-lg max-w-xl mx-auto leading-loose">
            This is a sanctuary — a place to drop your shoulders, unclench your jaw, and simply exist. ☁️
          </p>
        </motion.div>
      </section>

      {/* ─── 3. LATEST ADDITIONS CAROUSEL ──────────────────────── */}
      <section className="w-full py-32 px-6">
        <div className="max-w-4xl mx-auto">
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={0}
            variants={fadeUp}
            className="flex flex-col md:flex-row items-center justify-between p-12 bg-brand-card border border-brand-border rounded-3xl relative overflow-hidden group shadow-sm"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-30" />
            
            {/* Carousel Content (Left Side on Desktop) */}
            <div className="flex-1 flex flex-col justify-center pr-0 md:pr-12 text-center md:text-left mb-12 md:mb-0 relative z-10 w-full">
              <span className="text-[10px] uppercase tracking-[0.2em] text-brand-soft mb-2 block">The Sanctuary Archive</span>
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentSlide}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col"
                >
                  <span className="text-xs tracking-widest uppercase text-brand-accent mb-4 block">{slides[currentSlide].subtitle}</span>
                  <h2 className="font-serif text-4xl md:text-5xl text-brand-text mb-6 text-balance leading-tight">{slides[currentSlide].title}</h2>
                  <p className="text-brand-soft leading-relaxed mb-10 max-w-md mx-auto md:mx-0 text-base h-24 overflow-hidden">
                    {slides[currentSlide].desc}
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-6">
                    <Link
                      href={slides[currentSlide].link}
                      className="px-8 py-4 bg-brand-text text-brand-bg hover:bg-brand-accent hover:text-white transition-all duration-500 rounded-full text-xs tracking-widest uppercase shadow-md"
                    >
                      {slides[currentSlide].cta}
                    </Link>
                    
                    {/* Next/Prev Navigation */}
                    {slides.length > 1 && (
                      <div className="flex gap-2">
                        <button onClick={prevSlide} className="p-3 rounded-full border border-brand-border text-brand-soft hover:text-brand-accent hover:border-brand-accent transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                          </svg>
                        </button>
                        <button onClick={nextSlide} className="p-3 rounded-full border border-brand-border text-brand-soft hover:text-brand-accent hover:border-brand-accent transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Carousel Cover Image (Right Side on Desktop) */}
            <div className="w-full max-w-[280px] shrink-0 aspect-[4/5] relative perspective-1000">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, rotateY: 15, x: 20 }}
                  animate={{ opacity: 1, rotateY: -5, x: 0, scale: 1.05 }}
                  exit={{ opacity: 0, rotateY: -15, x: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  className="absolute inset-0 bg-brand-bg rounded-2xl border border-brand-border flex flex-col items-center justify-center overflow-hidden shadow-2xl"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    className="absolute inset-0 opacity-20 z-20 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at 30% 20%, var(--color-accent), transparent 70%)" }}
                  />
                  {slides[currentSlide].coverImage?.asset ? (
                    <Image
                      src={urlFor(slides[currentSlide].coverImage).width(500).height(667).url()}
                      alt={slides[currentSlide].title}
                      fill
                      className="object-cover w-full h-full opacity-90 relative z-10"
                    />
                  ) : (
                    <>
                      <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-4 relative z-10 text-center px-4">{slides[currentSlide].subtitle}</span>
                      <span className="font-serif text-2xl text-brand-text px-8 text-center text-balance relative z-10 leading-snug">{slides[currentSlide].title}</span>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
              
              {/* Pagination Dots */}
              {slides.length > 1 && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                  {slides.map((_, i) => (
                    <button key={i} onClick={() => setCurrentSlide(i)} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-brand-accent w-6' : 'bg-brand-border'}`} />
                  ))}
                </div>
              )}
            </div>
            
          </motion.div>
          
        </div>
      </section>

      {/* ─── 4. BOOKS ───────────────────────────── */}
      <section className="w-full py-32 px-6 bg-brand-card">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-20"
          >
            <h2 className="font-serif text-4xl md:text-5xl text-brand-text mb-4">Paper & Words 📖</h2>
            <p className="text-brand-soft">Tangible comfort for long nights.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book, i) => (
              <motion.div
                key={book.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="group cursor-pointer"
              >
                <motion.div
                  className="aspect-[3/4] w-full bg-brand-bg rounded-xl border border-brand-border mb-6 flex flex-col items-center justify-center overflow-hidden relative shadow-sm"
                  whileHover={{ y: -12, rotateY: 6, rotateX: -4, boxShadow: "0 30px 60px rgba(0,0,0,0.2)" }}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20"
                    style={{ background: "radial-gradient(ellipse at 50% 20%, var(--color-accent), transparent 70%)", opacity: 0.06 }}
                  />
                  {book.coverImage?.asset ? (
                    <Image
                      src={urlFor(book.coverImage).width(400).height(533).url()}
                      alt={book.title}
                      fill
                      className="object-cover w-full h-full opacity-90 relative z-10"
                    />
                  ) : (
                    <>
                      <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-4 relative z-10">{book.tag}</span>
                      <span className="font-serif text-xl text-brand-muted px-8 text-center relative z-10">{book.title}</span>
                    </>
                  )}
                </motion.div>
                <h3 className="font-serif text-2xl text-brand-text mb-2 group-hover:text-brand-accent transition-colors">{book.title}</h3>
                <Link href={book.slug ? `/books/${book.slug}` : "/library"} className="text-xs uppercase tracking-widest text-brand-soft group-hover:text-brand-accent transition-colors">
                  Read the book
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. EMOTIONAL SEARCH CTA ────────────── */}
      <section className="w-full py-32 px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeUp}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="text-xs uppercase tracking-widest text-brand-accent mb-6 block">Sanctuary Search</span>
          <h2 className="font-serif text-4xl md:text-5xl text-brand-text mb-6">
            What is weighing on you tonight?
          </h2>
          <p className="text-brand-soft mb-12 max-w-xl mx-auto leading-relaxed">
            Search how you feel and we will find the exact words, guides, and books you need right now.
          </p>
          <Link
            href="/search"
            className="w-full max-w-2xl mx-auto bg-brand-card border border-brand-border hover:border-brand-accent transition-colors rounded-full flex items-center px-8 py-6 cursor-pointer group shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-brand-soft group-hover:text-brand-accent transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <span className="ml-4 text-brand-soft/60 font-serif text-xl italic group-hover:text-brand-text transition-colors">
              I feel...
            </span>
          </Link>
        </motion.div>
      </section>

      {/* ─── 6. SAVE COLLECTION CTA ─────────────── */}
      <section className="w-full py-24 px-6 bg-brand-card">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeUp}
          className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center gap-12 p-12 rounded-2xl border border-brand-border"
          style={{ background: "radial-gradient(ellipse at 80% 50%, var(--color-accent)08, transparent 70%)" }}
        >
          <div className="flex-1">
            <span className="text-xs uppercase tracking-widest text-brand-accent mb-4 block">Your Sanctuary</span>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-text mb-4">My Quiet Collection ☕</h2>
            <p className="text-brand-soft leading-relaxed">
              Save articles, letters, and books that resonate with you. Kept locally on your device, just for you.
            </p>
          </div>
          <Link
            href="/collection"
            className="shrink-0 px-8 py-4 bg-brand-text text-brand-bg rounded-full text-xs tracking-widest uppercase hover:bg-brand-accent hover:text-white transition-all duration-500"
          >
            Open Collection
          </Link>
        </motion.div>
      </section>

      {/* ─── 6.5 TESTIMONIALS ───────────────────── */}
      {testimonials.length > 0 && (
        <section className="w-full py-32 bg-brand-bg relative overflow-hidden">
           <div className="text-center mb-12">
             <span className="text-xs uppercase tracking-widest text-brand-accent block">Community</span>
           </div>
           <TestimonialCarousel testimonials={testimonials} />
           <div className="text-center mt-8">
              <Link href="/testimonials" className="text-[10px] uppercase tracking-widest text-brand-soft hover:text-brand-accent transition-colors">
                Read more notes
              </Link>
           </div>
        </section>
      )}

      {/* ─── 7. CLOSING QUOTE ───────────────────── */}
      <section className="w-full py-40 px-6 flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="max-w-4xl text-center"
        >
          <h2 className="font-serif text-4xl md:text-6xl text-brand-text leading-tight text-balance italic">
            &quot;Rest is not a reward for the work.{" "}
            <span style={{ color: "var(--color-accent)" }}>It is the foundation of it.</span>&quot;
          </h2>
          <Link
            href="/breathe"
            className="mt-12 inline-block text-xs uppercase tracking-widest text-brand-soft hover:text-brand-accent transition-colors border-b border-brand-border hover:border-brand-accent pb-1"
          >
            Enter the Breathe Room 🕊️
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
