"use client";

import { useReadingMode } from "@/context/ReadingModeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function ReadingController() {
  const { isReadingMode, setIsReadingMode, fontSize, setFontSize, scrollProgress } = useReadingMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Global Scroll Progress Bar (Only visible in reading mode) */}
      <AnimatePresence>
        {isReadingMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-full h-1 bg-brand-border z-[100]"
          >
            <div 
              className="h-full bg-brand-accent transition-all duration-150"
              style={{ width: `${scrollProgress}%` }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Controller */}
      <div className={`fixed z-50 transition-all duration-700 ${isReadingMode ? "top-6 right-6" : "bottom-6 right-6"}`}>
        <div className="flex flex-col items-end gap-2">
          
          <AnimatePresence>
            {isReadingMode && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-brand-card/90 backdrop-blur-md border border-brand-border p-2 rounded-2xl flex flex-col gap-2 mb-2 shadow-sm"
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[8px] uppercase tracking-widest text-brand-soft px-2 pt-1">Size</span>
                  <div className="flex gap-1">
                    <button onClick={() => setFontSize("normal")} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs hover:bg-brand-bg transition-colors ${fontSize === "normal" ? "text-brand-accent font-medium" : "text-brand-text"}`}>A</button>
                    <button onClick={() => setFontSize("large")} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm hover:bg-brand-bg transition-colors ${fontSize === "large" ? "text-brand-accent font-medium" : "text-brand-text"}`}>A</button>
                    <button onClick={() => setFontSize("xlarge")} className={`w-8 h-8 rounded-full flex items-center justify-center text-base hover:bg-brand-bg transition-colors ${fontSize === "xlarge" ? "text-brand-accent font-medium" : "text-brand-text"}`}>A</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsReadingMode(!isReadingMode)}
            className={`w-12 h-12 rounded-full border bg-brand-bg/80 backdrop-blur-md flex items-center justify-center shadow-sm transition-all duration-500 hover:scale-105 ${
              isReadingMode 
                ? "border-brand-accent text-brand-accent rotate-180" 
                : "border-brand-border text-brand-text"
            }`}
            aria-label="Toggle Reading Mode"
          >
            {isReadingMode ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>

        </div>
      </div>
    </>
  );
}
