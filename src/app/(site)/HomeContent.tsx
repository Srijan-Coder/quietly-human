"use client";

import { useState, useEffect } from "react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import Link from "next/link";
import AmbientBackground from "@/components/global/AmbientBackground";
import { EmotionalPath } from "@/components/global/EmotionalPath";
import { TestimonialCarousel, type Testimonial } from "@/components/global/TestimonialCarousel";

export default function HomeContent({ testimonials, ebooks, products }: { testimonials: Testimonial[], ebooks?: any[], products?: any[] }) {
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: i * 0.15 },
    }),
  };

  const books = ebooks && ebooks.length > 0 ? ebooks : [
    { title: "I Am Not Behind in Life", tag: "Feeling Behind" },
    { title: "A Small Book for Tired Hearts", tag: "Exhausted" },
    { title: "I'm Tired of Being Okay", tag: "Burnout" },
  ];

  const premiumProducts = products && products.length > 0 ? products : [
    { title: "The Overthinker's Journal", price: 19, slug: "#" }
  ];

  const freeSlides = [
    {
      title: "7-Day Emotional Reset",
      subtitle: "Free Download",
      desc: "A gentle week-long journey to help you release the pressure of having everything figured out.",
      cta: "Get the free reset 💌",
      link: "/reset",
      element: (
        <div className="font-serif text-4xl text-brand-text italic relative z-10 flex flex-col items-center">
          <span>7 🕯️</span>
          <span className="text-xs uppercase tracking-widest text-brand-soft mt-2 not-italic">Day Reset</span>
        </div>
      )
    },
    ...(ebooks || []).map(ebook => ({
      title: ebook.title,
      subtitle: "Free Ebook",
      desc: "A short, gentle read to help you navigate heavy emotions and find your center.",
      cta: "Read the book 📖",
      link: `/books/${ebook.slug}`,
      element: (
        <div className="font-serif text-xl text-brand-text text-center px-4 relative z-10 flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-2 not-italic">{ebook.tag}</span>
          <span>{ebook.title}</span>
        </div>
      )
    }))
  ];

  const [headline, setHeadline] = useState("A quiet space for tired hearts.");
  const [currentFreeSlide, setCurrentFreeSlide] = useState(0);
  const [currentPremiumSlide, setCurrentPremiumSlide] = useState(0);

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

  // Auto-slide for free resources
  useEffect(() => {
    if (freeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentFreeSlide((prev) => (prev + 1) % freeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [freeSlides.length]);

  // Auto-slide for premium products
  useEffect(() => {
    if (premiumProducts.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentPremiumSlide((prev) => (prev + 1) % premiumProducts.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [premiumProducts.length]);

  const nextFreeSlide = () => setCurrentFreeSlide((prev) => (prev + 1) % freeSlides.length);
  const prevFreeSlide = () => setCurrentFreeSlide((prev) => (prev - 1 + freeSlides.length) % freeSlides.length);
  
  const nextPremiumSlide = () => setCurrentPremiumSlide((prev) => (prev + 1) % premiumProducts.length);
  const prevPremiumSlide = () => setCurrentPremiumSlide((prev) => (prev - 1 + premiumProducts.length) % premiumProducts.length);

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
              href="/library"
              className="px-8 py-4 bg-brand-text text-brand-bg rounded-full text-xs tracking-widest uppercase hover:bg-brand-accent hover:text-white transition-all duration-500 hover:scale-105"
            >
              Start Softly 🌿
            </Link>
            <Link
              href="/search"
              className="px-8 py-4 border border-brand-border text-brand-text rounded-full text-xs tracking-widest uppercase hover:border-brand-accent hover:text-brand-accent transition-all duration-500"
            >
              How are you feeling? ☁️
            </Link>
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

      {/* ─── 3. RESOURCES & PRODUCTS ──────────────────────── */}
      <section className="w-full py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* FREE RESOURCES CAROUSEL (LEFT SIDE) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={0}
            variants={fadeUp}
            className="flex flex-col items-center text-center p-12 bg-brand-bg border border-brand-border rounded-3xl relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-30" />
            
            {freeSlides.length > 1 && (
              <>
                <button onClick={prevFreeSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-brand-soft hover:text-brand-accent transition-colors z-20">
                  ←
                </button>
                <button onClick={nextFreeSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-brand-soft hover:text-brand-accent transition-colors z-20">
                  →
                </button>
              </>
            )}

            <div className="relative w-full max-w-[280px] aspect-[4/5] mb-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFreeSlide}
                  initial={{ opacity: 0, rotateY: 10, scale: 0.95 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                  exit={{ opacity: 0, rotateY: -10, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-brand-card rounded-2xl border border-brand-border flex flex-col items-center justify-center relative overflow-hidden shadow-xl"
                  style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{ background: "radial-gradient(ellipse at 30% 40%, var(--color-accent), transparent 70%)" }}
                  />
                  {freeSlides[currentFreeSlide].element}
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={currentFreeSlide}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center flex-1 w-full"
              >
                <span className="text-xs tracking-widest uppercase text-brand-accent mb-4 block">{freeSlides[currentFreeSlide].subtitle}</span>
                <h2 className="font-serif text-3xl md:text-4xl text-brand-text mb-4 text-balance">{freeSlides[currentFreeSlide].title}</h2>
                <p className="text-brand-soft leading-relaxed mb-8 max-w-sm text-sm h-16 overflow-hidden">
                  {freeSlides[currentFreeSlide].desc}
                </p>
                <Link
                  href={freeSlides[currentFreeSlide].link}
                  className="px-8 py-4 bg-brand-card border border-brand-border hover:border-brand-accent text-brand-text hover:text-brand-accent transition-all duration-500 rounded-full text-xs tracking-widest uppercase mt-auto"
                >
                  {freeSlides[currentFreeSlide].cta}
                </Link>
              </motion.div>
            </AnimatePresence>
            
            {/* Dots */}
            {freeSlides.length > 1 && (
              <div className="absolute bottom-6 flex gap-2">
                {freeSlides.map((_, i) => (
                  <button key={i} onClick={() => setCurrentFreeSlide(i)} className={`w-2 h-2 rounded-full transition-colors ${i === currentFreeSlide ? 'bg-brand-accent' : 'bg-brand-border'}`} />
                ))}
              </div>
            )}
          </motion.div>

          {/* PREMIUM PRODUCT CAROUSEL (RIGHT SIDE) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={1}
            variants={fadeUp}
            className="flex flex-col items-center text-center p-12 bg-brand-card border border-brand-border rounded-3xl relative overflow-hidden group"
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{ background: "radial-gradient(circle at 70% 30%, var(--color-accent), transparent 60%)" }}
            />
            
            {premiumProducts.length > 1 && (
              <>
                <button onClick={prevPremiumSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-brand-soft hover:text-brand-accent transition-colors z-20">
                  ←
                </button>
                <button onClick={nextPremiumSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-brand-soft hover:text-brand-accent transition-colors z-20">
                  →
                </button>
              </>
            )}

            <div className="relative w-full max-w-[280px] aspect-[4/5] mb-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPremiumSlide}
                  initial={{ opacity: 0, rotateY: -10, scale: 0.95 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                  exit={{ opacity: 0, rotateY: 10, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-[#1A1A1A] dark:bg-[#111] rounded-2xl border border-[#333] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl"
                  style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                >
                   <span className="font-serif text-3xl text-[#E5E5E5] px-6 text-center text-balance leading-snug relative z-10">
                     {premiumProducts[currentPremiumSlide].title}
                   </span>
                   <span className="text-[10px] uppercase tracking-widest text-[#888] mt-4 relative z-10">Premium Guide</span>
                   <div className="absolute inset-0 border-[1px] border-white/5 rounded-2xl m-3 pointer-events-none" />
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={currentPremiumSlide}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center flex-1 w-full"
              >
                <span className="text-xs tracking-widest uppercase text-brand-soft mb-4 block">Quietly Humans Studio</span>
                <h2 className="font-serif text-3xl md:text-4xl text-brand-text mb-4 text-balance">{premiumProducts[currentPremiumSlide].title}</h2>
                <p className="text-brand-soft leading-relaxed mb-8 max-w-sm text-sm h-16 overflow-hidden">
                  Premium resources, guided journals, and digital dashboards designed to help you live softly and intentionally.
                </p>
                <Link
                  href={premiumProducts[currentPremiumSlide].slug !== "#" ? `/products/${premiumProducts[currentPremiumSlide].slug}` : "/library"}
                  className="px-8 py-4 bg-brand-text text-brand-bg hover:bg-brand-accent hover:text-white transition-all duration-500 rounded-full text-xs tracking-widest uppercase mt-auto"
                >
                  Explore the Studio ☕
                </Link>
              </motion.div>
            </AnimatePresence>
            
            {/* Dots */}
            {premiumProducts.length > 1 && (
              <div className="absolute bottom-6 flex gap-2">
                {premiumProducts.map((_, i) => (
                  <button key={i} onClick={() => setCurrentPremiumSlide(i)} className={`w-2 h-2 rounded-full transition-colors ${i === currentPremiumSlide ? 'bg-brand-accent' : 'bg-brand-border'}`} />
                ))}
              </div>
            )}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: "radial-gradient(ellipse at 50% 20%, var(--color-accent), transparent 70%)", opacity: 0.06 }}
                  />
                  <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-4">{book.tag}</span>
                  <span className="font-serif text-xl text-brand-muted px-8 text-center">{book.title}</span>
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
          className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12 p-12 rounded-2xl border border-brand-border"
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
