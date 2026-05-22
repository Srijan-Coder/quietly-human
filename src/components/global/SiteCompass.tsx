"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mapCategories = [
  {
    title: "I need comfort...",
    links: [
      { name: "Take the Heart Quiz", path: "/quiz" },
      { name: "Read a Midnight Letter", path: "/letters" },
      { name: "Explore the Pillars", path: "/guides" },
    ]
  },
  {
    title: "I want to read...",
    links: [
      { name: "Quiet Thoughts (Blog)", path: "/blog" },
      { name: "Free Ebooks & Journals", path: "/books" },
      { name: "My Collection", path: "/collection" },
    ]
  },
  {
    title: "I feel lost...",
    links: [
      { name: "Start the 7-Day Reset", path: "/reset" },
      { name: "Search by Emotion", path: "/search" },
      { name: "Enter The Breathe Room", path: "/breathe" },
    ]
  },
  {
    title: "I want to connect...",
    links: [
      { name: "Meet Srijan", path: "/about" },
      { name: "Reader Notes", path: "/testimonials" },
      { name: "Link-in-Bio", path: "/links" },
    ]
  }
];

export default function SiteCompass() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close map when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-1/2 right-0 -translate-y-1/2 z-[90] flex items-center justify-center bg-brand-text text-brand-bg py-6 px-2 rounded-l-xl shadow-2xl hover:bg-brand-accent hover:pr-4 transition-all duration-500 overflow-hidden group border border-r-0 border-brand-border/20"
        aria-label="Open Site Map"
      >
        <span 
          className="font-serif text-xs uppercase tracking-[0.3em] font-light group-hover:tracking-[0.4em] transition-all duration-500 block"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          Map
        </span>
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-brand-bg/60 backdrop-blur-sm z-[100]"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Slide-out Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-card shadow-2xl z-[110] overflow-y-auto border-l border-brand-border"
          >
            <div className="p-8 md:p-12 relative flex flex-col min-h-full">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-8 right-8 text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors"
              >
                Close
              </button>

              <div className="mb-12 pt-8">
                <span className="text-xl">🧭</span>
                <h2 className="text-3xl font-serif text-brand-text mt-4 mb-2">The Compass</h2>
                <p className="text-brand-soft text-sm leading-relaxed">A feeling-based map to help you find exactly what you need right now.</p>
              </div>

              <div className="flex-1 flex flex-col gap-10">
                {mapCategories.map((category, idx) => (
                  <motion.div 
                    key={category.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                  >
                    <h3 className="font-serif text-xl text-brand-text mb-4 italic">{category.title}</h3>
                    <ul className="flex flex-col gap-3 pl-4 border-l border-brand-border/50">
                      {category.links.map((link) => (
                        <li key={link.path}>
                          <Link 
                            href={link.path}
                            className="text-brand-soft hover:text-brand-accent transition-colors text-sm tracking-wide block py-1"
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
