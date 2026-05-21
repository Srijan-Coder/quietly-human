"use client";

import { useState } from "react";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function EbookReader({ ebook }: { ebook: any }) {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");
  const [menuOpen, setMenuOpen] = useState(false);

  const chapters = ebook.chapters || [];
  const activeChapter = chapters[currentChapter];

  const fontSizeClasses = {
    normal: "prose-lg",
    large: "prose-xl",
    xlarge: "prose-2xl",
  };

  if (chapters.length === 0) {
    if (ebook.fileUrl || ebook.notionUrl) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-brand-bg text-brand-text">
          <h1 className="font-serif text-3xl mb-8">{ebook.title}</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm mx-auto">
            {ebook.fileUrl && (
              <a 
                href={ebook.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-4 border border-brand-border text-brand-text hover:border-brand-accent hover:text-brand-accent transition-colors rounded-full text-xs tracking-widest uppercase text-center"
              >
                Download File
              </a>
            )}
            {ebook.notionUrl && (
              <a 
                href={ebook.notionUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-4 border border-brand-border text-brand-text hover:border-brand-accent hover:text-brand-accent transition-colors rounded-full text-xs tracking-widest uppercase text-center"
              >
                Read in Notion
              </a>
            )}
          </div>
          <Link href="/library" className="mt-12 text-xs uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">
            ← Back to Library
          </Link>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center text-brand-soft italic bg-brand-bg">
        This book has no pages yet.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-brand-bg text-brand-text flex overflow-hidden">
      
      {/* Sidebar Navigation (Desktop) / Slide-out (Mobile) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.5 }}
            className="fixed inset-y-0 left-0 w-80 bg-brand-card border-r border-brand-border z-40 flex flex-col p-8 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-serif text-xl italic">{ebook.title}</span>
              <button onClick={() => setMenuOpen(false)} className="text-xs uppercase tracking-widest opacity-50 hover:opacity-100">
                Close
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-[10px] uppercase tracking-widest opacity-40 mb-2">Chapters</span>
              {chapters.map((ch: any, idx: number) => (
                <button
                  key={ch._key || idx}
                  onClick={() => {
                    setCurrentChapter(idx);
                    setMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`text-left text-sm transition-colors ${
                    currentChapter === idx ? "text-brand-accent font-medium" : "text-brand-soft hover:text-brand-text"
                  }`}
                >
                  {idx + 1}. {ch.chapterTitle}
                </button>
              ))}
            </div>

            <div className="mt-auto pt-12">
              <Link href="/library" className="text-xs uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">
                ← Exit Book
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Reading Area */}
      <main className="flex-1 min-h-screen flex flex-col items-center relative">
        
        {/* Top bar */}
        <header className="w-full flex justify-between items-center px-6 py-6 md:px-12 sticky top-0 bg-brand-bg/90 backdrop-blur-sm z-30">
          <button onClick={() => setMenuOpen(true)} className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2">
            <span>☰</span> Index
          </button>

          <div className="flex gap-4 items-center">
            <button onClick={() => setFontSize("normal")} className={`text-xs opacity-60 hover:opacity-100 ${fontSize === "normal" && "text-brand-accent opacity-100"}`}>A</button>
            <button onClick={() => setFontSize("large")} className={`text-sm opacity-60 hover:opacity-100 ${fontSize === "large" && "text-brand-accent opacity-100"}`}>A</button>
            <button onClick={() => setFontSize("xlarge")} className={`text-base opacity-60 hover:opacity-100 ${fontSize === "xlarge" && "text-brand-accent opacity-100"}`}>A</button>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-brand-border z-40">
          <motion.div 
            className="h-full bg-brand-accent"
            initial={{ width: 0 }}
            animate={{ width: `${((currentChapter + 1) / chapters.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Chapter Content */}
        <article className="w-full max-w-3xl px-6 py-20 md:py-32 flex-1">
          <motion.div
            key={currentChapter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-serif text-4xl md:text-5xl text-brand-text mb-16 text-center text-balance leading-tight">
              {activeChapter.chapterTitle}
            </h1>

            <div className={`prose prose-stone max-w-none font-serif text-brand-text leading-relaxed prose-headings:font-sans prose-headings:font-normal prose-headings:text-brand-soft prose-a:text-brand-accent ${fontSizeClasses[fontSize]}`}>
              {activeChapter.content ? <PortableText value={activeChapter.content} /> : <p className="italic text-center">Chapter is empty.</p>}
            </div>
          </motion.div>
        </article>

        {/* Bottom Pagination */}
        <footer className="w-full max-w-3xl px-6 py-12 border-t border-brand-border flex justify-between items-center mt-auto mb-12">
          {currentChapter > 0 ? (
            <button 
              onClick={() => { setCurrentChapter(c => c - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors"
            >
              ← Previous
            </button>
          ) : <div />}
          
          <span className="text-xs text-brand-soft">
            {currentChapter + 1} / {chapters.length}
          </span>

          {currentChapter < chapters.length - 1 ? (
            <button 
              onClick={() => { setCurrentChapter(c => c + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="text-xs uppercase tracking-widest text-brand-accent hover:text-brand-text transition-colors"
            >
              Next →
            </button>
          ) : (
            <Link href="/library" className="text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors">
              Finish Book
            </Link>
          )}
        </footer>
      </main>
    </div>
  );
}
