"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { GlobalSearchModal } from "./GlobalSearchModal";

const oldMegaMenuCategories = [
  {
    title: "Sanctuary 🌿",
    links: [
      { name: "The Breathe Room", path: "/breathe" },
      { name: "The 3AM Room", path: "/3am" },
      { name: "Quiet Focus", path: "/focus" },
      { name: "7-Day Reset", path: "/reset" },
      { name: "Quiet Words", path: "/quotes" },
      { name: "Soft Toolkit", path: "/toolkit" },
      { name: "When it feels heavy...", path: "/heavy" },
    ]
  },
  {
    title: "Explore ☁️",
    links: [
      { name: "Emotional Search", path: "/search" },
      { name: "The Quiet Archive", path: "/archive" },
      { name: "Quiet Thoughts (Blog)", path: "/blog" },
      { name: "My Collection", path: "/collection" },
      { name: "Journey Paths", path: "/paths/behind" },
      { name: "Free Resources", path: "/resources" },
      { name: "Free Ebooks", path: "/books" },
    ]
  },
  {
    title: "Library 📖",
    links: [
      { name: "Pillar Guides", path: "/guides" },
      { name: "Midnight Letters", path: "/letters" },
      { name: "Books & Journals", path: "/library" },
      { name: "The Ecosystem", path: "/ecosystem" },
    ]
  },
  {
    title: "Connect 💌",
    links: [
      { name: "Reader Notes", path: "/testimonials" },
      { name: "Link-in-Bio", path: "/links" },
      { name: "About Srijan", path: "/about" },
    ]
  }
];

export default function Navbar() {
  const { isLoaded, isSignedIn } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    {
      name: "Explore",
      items: [
        { title: "The Reading Room", path: "/reading-room", desc: "Curated essays and letters." },
        { title: "Pilgrim Notes", path: "/pilgrim", desc: "The community wall." },
        { title: "The Quiet Store", path: "/store", desc: "Digital products & books." },
      ]
    },
    {
      name: "Heal",
      items: [
        { title: "Soft Toolkit", path: "/toolkit", desc: "15+ interactive tools." },
        { title: "Breathe Room", path: "/breathe", desc: "Guided breathing." },
        { title: "Focus Timer", path: "/focus", desc: "Deep work pomodoro." },
      ]
    },
    {
      name: "Creator",
      items: [
        { title: "Dashboard", path: "/dashboard", desc: "Analytics & metrics." },
        { title: "Room Settings", path: "/settings", desc: "Manage your pins." },
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
          scrolled || isMegaMenuOpen
            ? "bg-brand-bg/90 backdrop-blur-2xl border-b border-brand-border/50 py-4" 
            : "bg-transparent py-6"
        } px-6 md:px-12 flex justify-between items-center text-brand-text`}
      >
        <div className="flex items-center gap-6">
          <Link href="/" onClick={() => setIsMegaMenuOpen(false)} className="font-serif text-xl md:text-2xl tracking-wide font-bold hover:text-brand-accent transition-colors z-50">
            Quietly Humans.
          </Link>
          
          {/* Search Icon */}
          <button onClick={() => setIsSearchOpen(true)} className="opacity-60 hover:opacity-100 transition-opacity">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
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
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-brand-card/95 backdrop-blur-3xl border border-brand-border/50 rounded-2xl p-2 shadow-2xl overflow-hidden"
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

          {isLoaded && !isSignedIn && (
            <SignInButton mode="modal">
              <button className="hidden md:block text-xs uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity font-sans">
                Log In
              </button>
            </SignInButton>
          )}

          {isLoaded && isSignedIn && (
            <div className="flex items-center gap-4">
              <Link href="/write" className="hidden md:block text-xs uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity font-sans border border-brand-border px-4 py-2 rounded-full hover:border-brand-accent">
                Write
              </Link>
              
              <Link href="/sanctuary-pass" className="hidden md:block text-[10px] uppercase tracking-widest text-brand-accent font-bold px-4 py-2 rounded-full border border-brand-accent/30 bg-brand-accent/5 hover:bg-brand-accent hover:text-white transition-colors">
                Pass
              </Link>

              <Link href="/notifications" className="opacity-70 hover:opacity-100 transition-opacity">
                <span className="text-lg">🔔</span>
              </Link>
              
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8 shadow-sm",
                  }
                }}
              />
            </div>
          )}

          {/* The "Menu" Button to open the Old Mega-Menu */}
          <button 
            onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
            className="text-xs uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity flex items-center gap-2 border border-brand-border/50 px-4 py-2 rounded-full"
          >
            {isMegaMenuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </motion.header>

      {/* The "Mixed" Mega-Menu Overlay (Old features preserved!) */}
      <AnimatePresence>
        {isMegaMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-brand-bg px-6 pt-32 pb-32 md:pt-40 md:pb-24 overflow-y-auto flex flex-col"
          >
            <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
              {oldMegaMenuCategories.map((category, i) => (
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
                        onClick={() => setIsMegaMenuOpen(false)}
                        className={`font-serif text-2xl md:text-xl lg:text-2xl transition-colors duration-500 hover:text-brand-accent ${
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

      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
