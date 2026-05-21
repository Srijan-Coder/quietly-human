"use client";

import { motion } from "framer-motion";
import AmbientParticles from "@/components/3d/AmbientParticles";
import Link from "next/link";
import Image from "next/image";
import { EmotionalPath } from "@/components/global/EmotionalPath";

export default function Home() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-screen flex flex-col justify-center items-center pt-20 px-6 text-center">
        <AmbientParticles />
        <div className="z-10 max-w-4xl flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-balance tracking-tight mb-8 text-brand-text"
          >
            A quiet digital space for tired hearts.
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1.5 }}
            className="flex flex-col md:flex-row gap-6 mt-8"
          >
            <Link href="/reset" className="px-8 py-4 bg-brand-text text-brand-bg hover:bg-brand-accent hover:text-white transition-colors duration-500 rounded-full text-sm tracking-widest uppercase">
              Start softly
            </Link>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
        >
          <span className="text-xs uppercase tracking-widest text-brand-text">Scroll slowly</span>
          <div className="w-[1px] h-12 bg-brand-text opacity-30 animate-pulse" />
        </motion.div>
      </section>

      {/* 1.5 EMOTIONAL ONBOARDING */}
      <EmotionalPath />

      {/* 2. SOFT INTRO */}
      <section className="w-full py-32 px-6 bg-brand-card">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="font-serif text-3xl md:text-5xl text-brand-text leading-relaxed text-balance">
            Books, journals, resets, and digital spaces for people rebuilding quietly.
          </p>
          <p className="mt-8 text-brand-soft font-sans max-w-xl mx-auto leading-loose">
            You do not need to become someone else to belong here. This is a sanctuary. A place to drop your shoulders, unclench your jaw, and simply exist.
          </p>
        </motion.div>
      </section>

      {/* 3. FREE GIFT (7-DAY RESET) */}
      <section className="w-full py-32 px-6">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16"
        >
          <div className="flex-1 w-full aspect-square md:aspect-[4/5] bg-brand-card rounded-2xl border border-brand-border flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <span className="font-serif text-3xl text-brand-muted italic">A gift for you.</span>
          </div>
          <div className="flex-1 flex flex-col items-start text-left">
            <span className="text-xs tracking-widest uppercase text-brand-accent mb-4">Free Download</span>
            <h2 className="font-serif text-4xl md:text-5xl text-brand-text mb-6">7-Day Emotional Reset</h2>
            <p className="text-brand-soft leading-relaxed mb-8">
              A gentle week-long journey to help you release the pressure of having everything figured out. Includes daily soft prompts and a quiet audio meditation.
            </p>
            <Link href="/reset" className="border-b border-brand-text text-brand-text pb-1 hover:text-brand-accent hover:border-brand-accent transition-colors uppercase tracking-widest text-sm">
              Get the free reset
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 4. FEATURED BOOKS */}
      <section className="w-full py-32 px-6 bg-brand-card">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl text-brand-text mb-4">Paper & Words</h2>
            <p className="text-brand-soft">Tangible comfort for long nights.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              "I Am Not Behind in Life",
              "A Small Book for Tired Hearts",
              "I'm Tired of Being Okay"
            ].map((book, i) => (
              <motion.div 
                key={book}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.2, duration: 1 }}}}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/4] w-full bg-brand-bg rounded-xl border border-brand-border mb-6 flex items-center justify-center overflow-hidden relative shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-700">
                  <span className="font-serif text-xl text-brand-muted px-8 text-center">{book}</span>
                </div>
                <h3 className="font-serif text-2xl text-brand-text mb-2 group-hover:text-brand-accent transition-colors">{book}</h3>
                <Link href="/books" className="text-xs uppercase tracking-widest text-brand-soft group-hover:text-brand-accent transition-colors">Read the book</Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DIGITAL PRODUCTS */}
      <section className="w-full py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-brand-border pb-8">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl text-brand-text mb-4">Digital Spaces</h2>
              <p className="text-brand-soft max-w-md">Systems and journals designed to organize your mind without the pressure of productivity.</p>
            </div>
            <Link href="/products" className="hidden md:block text-xs uppercase tracking-widest text-brand-text hover:text-brand-accent transition-colors">View the Library</Link>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              "Reflection Journal",
              "Tired Hearts Workbook",
              "Healing Dashboard"
            ].map((prod, i) => (
              <motion.div 
                key={prod}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.2, duration: 1 }}}}
                className="group cursor-pointer flex flex-col"
              >
                <div className="aspect-[16/10] w-full bg-brand-card rounded-xl border border-brand-border mb-6 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-700" />
                <h3 className="font-serif text-xl text-brand-text mb-1">{prod}</h3>
                <span className="text-xs uppercase tracking-widest text-brand-soft">Notion Template</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BLOG PREVIEWS */}
      <section className="w-full py-32 px-6 bg-brand-card">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl text-brand-text mb-4">Quiet Thoughts</h2>
            <p className="text-brand-soft">Emotional articles for overthinkers and tired hearts.</p>
          </motion.div>
          
          <div className="flex flex-col gap-12">
            {[1, 2, 3].map((post, i) => (
              <motion.div 
                key={post}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 1 }}}}
                className="group cursor-pointer grid grid-cols-1 md:grid-cols-4 gap-6 items-center border-b border-brand-border pb-12"
              >
                <div className="col-span-1 aspect-square bg-brand-bg rounded-lg border border-brand-border overflow-hidden" />
                <div className="col-span-1 md:col-span-3 flex flex-col">
                  <span className="text-xs tracking-widest uppercase text-brand-accent mb-3">Feeling Behind</span>
                  <h3 className="font-serif text-2xl md:text-3xl text-brand-text mb-4 group-hover:text-brand-accent transition-colors">Why you feel like you're running out of time, and how to stop.</h3>
                  <p className="text-brand-soft line-clamp-2">A gentle reminder that life is not a race, and you are allowed to bloom at your own pace in your own season.</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/blog" className="border-b border-brand-text text-brand-text pb-1 hover:text-brand-accent hover:border-brand-accent transition-colors uppercase tracking-widest text-sm">
              Read the Journal
            </Link>
          </div>
        </div>
      </section>

      {/* 7. QUOTE SECTION */}
      <section className="w-full py-40 px-6 flex items-center justify-center min-h-[60vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="max-w-4xl text-center"
        >
          <h2 className="font-serif text-4xl md:text-6xl text-brand-text leading-tight text-balance italic">
            "Rest is not a reward for the work. It is the foundation of it. Enter the quiet space."
          </h2>
        </motion.div>
      </section>

    </div>
  );
}
