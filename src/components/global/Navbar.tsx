"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { useReadingMode } from "@/context/ReadingModeContext";

const mainNavLinks = [
  { name: "Guides", path: "/guides" },
  { name: "Letters", path: "/letters" },
  { name: "Library", path: "/library" },
];

const menuCategories = [
  {
    title: "Sanctuary",
    links: [
      { name: "The Breathe Room", path: "/breathe" },
      { name: "7-Day Reset", path: "/reset" },
      { name: "Quiet Words", path: "/quotes" },
      { name: "Soft Toolkit", path: "/toolkit" },
    ]
  },
  {
    title: "Explore",
    links: [
      { name: "Emotional Search", path: "/search" },
      { name: "My Collection", path: "/collection" },
      { name: "Journey Paths", path: "/paths/behind" },
      { name: "Free Resources", path: "/resources" },
    ]
  },
  {
    title: "Library",
    links: [
      { name: "Pillar Guides", path: "/guides" },
      { name: "Midnight Letters", path: "/letters" },
      { name: "Books & Journals", path: "/library" },
      { name: "The Ecosystem", path: "/ecosystem" },
    ]
  },
  {
    title: "Connect",
    links: [
      { name: "Reader Notes", path: "/testimonials" },
      { name: "Link-in-Bio", path: "/links" },
      { name: "About Srijan", path: "/about" },
    ]
  }
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { isReadingMode } = useReadingMode();

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isReadingMode ? 0 : 1, y: isReadingMode ? -100 : 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0 }}
        className="fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-12 flex justify-between items-center text-brand-text transition-all"
        style={{
          background: isOpen ? "transparent" : "rgba(var(--color-bg-raw, 239,231,218), 0.7)",
          backdropFilter: isOpen ? "none" : "blur(20px)",
          WebkitBackdropFilter: isOpen ? "none" : "blur(20px)",
          borderBottom: isOpen ? "none" : "1px solid var(--color-border)",
        }}
      >
        <Link href="/" className="font-serif text-2xl tracking-wide font-light z-50 relative hover:text-brand-accent transition-colors">
          Quietly Human
        </Link>

        <div className="flex items-center gap-8 z-50 relative">
          <nav className="hidden lg:flex gap-8 items-center">
            {mainNavLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm tracking-widest uppercase transition-colors duration-500 hover:text-brand-accent ${
                  pathname === link.path ? "text-brand-accent opacity-100" : "opacity-60"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <ThemeToggle />

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-sm uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity w-12 text-right"
          >
            {isOpen ? "Close" : "Menu"}
          </button>
        </div>
      </motion.header>

      {/* Full Screen Mega-Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-brand-bg px-6 pt-32 pb-12 overflow-y-auto flex flex-col md:justify-center"
          >
            <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-8">
              {menuCategories.map((category, i) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                  className="flex flex-col gap-6"
                >
                  <span className="text-xs tracking-widest uppercase opacity-40 border-b border-brand-border pb-4">{category.title}</span>
                  <nav className="flex flex-col gap-4">
                    {category.links.map((link) => (
                      <Link
                        key={link.path}
                        href={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`font-serif text-3xl md:text-2xl lg:text-3xl transition-colors duration-500 hover:text-brand-accent ${
                          pathname === link.path ? "text-brand-accent italic" : "text-brand-text"
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </nav>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
