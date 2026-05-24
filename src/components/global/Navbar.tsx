"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";

export default function Navbar() {
  const { isLoaded, isSignedIn } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
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
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-brand-bg/80 backdrop-blur-xl border-b border-brand-border/50 py-4" 
          : "bg-transparent py-6"
      } px-6 md:px-12 flex justify-between items-center text-brand-text`}
    >
      <Link href="/" className="font-serif text-xl md:text-2xl tracking-wide font-bold hover:text-brand-accent transition-colors z-50">
        Quietly Humans.
      </Link>

      {/* Desktop Center Navigation */}
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
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-brand-card/90 backdrop-blur-2xl border border-brand-border/50 rounded-2xl p-2 shadow-2xl overflow-hidden"
                >
                  {category.items.map((item) => (
                    <Link 
                      key={item.path} 
                      href={item.path}
                      className="block p-3 rounded-xl hover:bg-brand-bg/50 transition-colors group/link"
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

      {/* Right Actions */}
      <div className="flex items-center gap-4 md:gap-6 z-50">
        <ThemeToggle />

        {isLoaded && !isSignedIn && (
          <div className="flex items-center gap-4">
            <SignInButton mode="modal">
              <button className="hidden md:block text-xs uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity font-sans">
                Log In
              </button>
            </SignInButton>
            <Link 
              href="/onboarding"
              className="bg-brand-text text-brand-bg px-5 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-brand-accent hover:text-white transition-all hover:scale-105 active:scale-95"
            >
              Enter Sanctuary
            </Link>
          </div>
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
      </div>
    </motion.header>
  );
}
