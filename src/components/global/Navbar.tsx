"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { name: "Reset", path: "/reset" },
  { name: "Books", path: "/books" },
  { name: "Products", path: "/products" },
  { name: "Blog", path: "/blog" },
  { name: "Library", path: "/library" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="fixed top-0 left-0 w-full z-50 px-6 py-8 md:px-12 flex justify-between items-center text-brand-text"
      >
        <Link href="/" className="font-serif text-2xl tracking-wide font-light z-50 relative">
          Quietly Human Studio
        </Link>

        <div className="flex items-center gap-8 z-50 relative">
          <nav className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
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

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-sm uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity w-12 text-right"
          >
            {isOpen ? "Close" : "Menu"}
          </button>
        </div>
      </motion.header>

      {/* Full Screen Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-brand-bg flex flex-col justify-center items-center px-6"
          >
            <nav className="flex flex-col gap-8 text-center">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                >
                  <Link
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`font-serif text-4xl transition-colors duration-500 hover:text-brand-accent ${
                      pathname === link.path ? "text-brand-accent" : "text-brand-text"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
