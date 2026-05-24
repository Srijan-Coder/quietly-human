"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { GlobalSearchModal } from "./GlobalSearchModal";
import { ExploreModal } from "./ExploreModal";

export default function Navbar() {
  const { isLoaded, isSignedIn } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    {
      name: "Read",
      items: [
        { title: "The Reading Room", path: "/reading-room", desc: "Network feed & Creator discovery." },
        { title: "The Quiet Store", path: "/store", desc: "Books, journals & digital products." },
      ]
    },
    {
      name: "Heal",
      items: [
        { title: "Soft Toolkit", path: "/toolkit", desc: "20 interactive clinical tools." },
        { title: "Breathing Room", path: "/breathe", desc: "Guided deep breathing exercises." },
        { title: "Deep Focus", path: "/focus", desc: "Pomodoro timer with soundscapes." },
      ]
    },
    {
      name: "Upgrade",
      items: [
        { title: "Sanctuary Pass", path: "/sanctuary-pass", desc: "Unlock premium tools & quiet mode." },
        { title: "Digital Products", path: "/products", desc: "Notion templates, ebooks & more." },
      ]
    }
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-brand-bg/90 backdrop-blur-2xl border-b border-brand-border/50 py-4" 
            : "bg-transparent py-6"
        } px-6 md:px-12 flex justify-between items-center text-brand-text`}
      >
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="font-serif text-xl md:text-2xl tracking-wide font-bold hover:text-brand-accent transition-colors z-50">
            Quietly Humans.
          </Link>
          
          {/* Search Icon */}
          <button onClick={() => setIsSearchOpen(true)} className="opacity-60 hover:opacity-100 transition-opacity" aria-label="Search">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>

          {/* Explore Button */}
          <button 
            onClick={() => setIsExploreOpen(true)} 
            className="hidden md:flex items-center gap-1.5 text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity font-sans font-bold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            Explore
          </button>
        </div>

        {/* Desktop Premium Hover Navigation */}
        <nav className="hidden lg:flex items-center gap-8 relative z-50">
          {navItems.map((category) => (
            <div 
              key={category.name}
              className="relative group"
              onMouseEnter={() => setActiveDropdown(category.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="text-sm font-sans tracking-widest uppercase opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1 py-2">
                {category.name}
              </button>
              
              <AnimatePresence>
                {activeDropdown === category.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-brand-card/95 backdrop-blur-3xl border border-brand-border/50 rounded-2xl p-2 shadow-2xl overflow-hidden"
                  >
                    {category.items.map((item) => (
                      <Link 
                        key={item.path} 
                        href={item.path}
                        className="block p-3 rounded-xl hover:bg-brand-bg transition-colors group/link"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <p className="text-sm text-brand-text font-bold group-hover/link:text-brand-accent transition-colors">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-brand-soft uppercase tracking-widest mt-1">
                          {item.desc}
                        </p>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Right Actions & Menu Toggle */}
        <div className="flex items-center gap-4 md:gap-6 z-50">
          <ThemeToggle />

          {/* Mobile Explore Button (hamburger-like) */}
          <button 
            onClick={() => setIsExploreOpen(true)} 
            className="md:hidden p-2 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Explore menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {isLoaded && !isSignedIn && (
            <SignInButton mode="modal">
              <button className="hidden md:block text-[10px] uppercase tracking-widest text-black bg-white hover:bg-white/80 transition-all font-bold font-sans px-6 py-2 rounded-full">
                Log In
              </button>
            </SignInButton>
          )}

          {isLoaded && isSignedIn && (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="hidden md:block text-[10px] uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity font-sans font-bold">
                Dashboard
              </Link>
              <Link href="/write" className="hidden md:block text-[10px] uppercase tracking-widest text-black bg-white hover:bg-white/80 transition-all font-bold font-sans border border-brand-border px-6 py-2 rounded-full">
                Write
              </Link>

              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8 shadow-sm border border-white/20",
                  }
                }}
              />
            </div>
          )}
        </div>
      </motion.header>

      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ExploreModal isOpen={isExploreOpen} onClose={() => setIsExploreOpen(false)} />
    </>
  );
}
