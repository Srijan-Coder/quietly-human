"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function QuizFloatingBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Don't show on the quiz page itself or if dismissed
    if (pathname === "/quiz" || isDismissed) {
      setIsVisible(false);
      return;
    }

    // Show after a slight delay to not overwhelm the user immediately
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname, isDismissed]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
    setIsDismissed(true);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100]"
        >
          <div className="relative group">
            <Link href="/quiz" className="flex items-center gap-4 bg-brand-text text-brand-bg px-6 py-4 rounded-full shadow-2xl hover:bg-brand-accent transition-colors duration-500 border border-transparent hover:border-brand-bg/20">
              <span className="text-xl animate-pulse">🤍</span>
              <div className="flex flex-col">
                <span className="font-serif text-sm md:text-base">What Is Your Heart Carrying?</span>
                <span className="text-[10px] uppercase tracking-widest opacity-80">Take the free assessment</span>
              </div>
            </Link>
            <button 
              onClick={handleDismiss}
              className="absolute -top-2 -right-2 w-6 h-6 bg-brand-card border border-brand-border text-brand-soft rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:text-brand-text hover:border-brand-text"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
