"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

// -------------------------------------------------------------
// UPDATED COMPASS MAP CATEGORIES
// -------------------------------------------------------------
const mapCategories = [
  {
    title: "I need immediate comfort...",
    links: [
      { name: "When it feels heavy...", path: "/heavy" },
      { name: "Enter The 3AM Room", path: "/3am" },
      { name: "Panic Redirector", path: "/toolkit/panic-redirector" },
      { name: "Take the Heart Quiz", path: "/quiz" },
    ]
  },
  {
    title: "I am feeling overwhelmed...",
    links: [
      { name: "The Task Atomizer", path: "/toolkit/task-atomizer" },
      { name: "The 'Done' List", path: "/toolkit/done-list" },
      { name: "The Brain Dump", path: "/toolkit/brain-dump" },
      { name: "Worry Postponer", path: "/toolkit/worry-postponer" },
    ]
  },
  {
    title: "I want to disconnect...",
    links: [
      { name: "The Breathing Room", path: "/breathe" },
      { name: "Quiet Focus Room", path: "/focus" },
      { name: "Grounding Sandbox", path: "/toolkit/grounding-sandbox" },
      { name: "Leaves on a Stream", path: "/toolkit/leaves-on-stream" },
    ]
  },
  {
    title: "I want to explore the Library...",
    links: [
      { name: "Search the Sanctuary", path: "/search" },
      { name: "Quiet Thoughts (Blog)", path: "/blog" },
      { name: "Read a Midnight Letter", path: "/letters" },
      { name: "Books & Guides", path: "/books" },
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

  // Prevent background scrolling when map is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-1/2 right-0 -translate-y-1/2 z-[90] flex items-center justify-center bg-brand-text text-brand-bg py-6 px-2 rounded-l-xl shadow-2xl hover:bg-brand-accent hover:pr-4 transition-all duration-300 overflow-hidden group border border-r-0 border-brand-border/20"
        aria-label="Open Site Map"
      >
        <span 
          className="font-serif text-xs uppercase tracking-[0.3em] font-light group-hover:tracking-[0.4em] transition-all duration-300 block"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          Map
        </span>
      </button>

      {/* Overlay - Removed blur for performance */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-brand-bg/90 z-[100]"
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
            transition={{ type: "tween", ease: "circOut", duration: 0.4 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-card shadow-2xl z-[110] overflow-y-auto border-l border-brand-border will-change-transform"
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

              <div className="flex-1 flex flex-col gap-10 pb-12">
                {mapCategories.map((category, idx) => (
                  <motion.div 
                    key={category.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05, duration: 0.3 }}
                  >
                    <h3 className="font-serif text-xl text-brand-text mb-4 italic">{category.title}</h3>
                    <ul className="flex flex-col gap-3 pl-4 border-l border-brand-border/30">
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
              
              <div className="border-t border-brand-border pt-8 mt-auto">
                <Link href="/toolkit" className="block w-full py-4 text-center border border-brand-accent text-brand-accent rounded-full text-xs uppercase tracking-widest hover:bg-brand-accent hover:text-brand-bg transition-all">
                  View All Tools
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
