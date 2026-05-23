"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type AnimationStyle = "smoke" | "burn" | "drop" | "wind" | "shatter" | "fade";

export default function WorryDissolverClient() {
  const [text, setText] = useState("");
  const [stage, setStage] = useState<"typing" | "dissolving" | "released">("typing");
  const [animStyle, setAnimStyle] = useState<AnimationStyle>("smoke");

  const handleRelease = () => {
    if (!text.trim()) return;
    setStage("dissolving");

    // Wait for the dissolve animation to finish before showing the final message
    setTimeout(() => {
      setStage("released");
    }, 4000);
  };

  const reset = () => {
    setText("");
    setStage("typing");
  };

  const getAnimationProps = (index: number) => {
    const randomDelay = Math.random() * 2;
    const randomX = (Math.random() - 0.5) * 100;
    const randomY = (Math.random() - 0.5) * 100;
    const randomRotation = (Math.random() - 0.5) * 180;
    
    switch (animStyle) {
      case "burn":
        return {
          initial: { opacity: 1, y: 0, x: 0, color: "#e0e0e0" },
          animate: { 
            opacity: 0, 
            y: -150 - Math.random() * 50, 
            x: randomX, 
            color: "#ff4500", // turns to fire
            scale: 0.2,
            filter: "blur(4px)"
          },
          transition: { duration: 2 + Math.random() * 1.5, delay: randomDelay, ease: "easeOut" }
        };
      case "drop":
        return {
          initial: { opacity: 1, y: 0, x: 0, rotate: 0 },
          animate: { 
            opacity: 0, 
            y: 500, // falls down
            x: randomX * 0.5, 
            rotate: randomRotation 
          },
          transition: { duration: 1.5 + Math.random(), delay: randomDelay * 0.5, ease: "easeIn" }
        };
      case "wind":
        return {
          initial: { opacity: 1, x: 0, y: 0, skewX: 0 },
          animate: { 
            opacity: 0, 
            x: 800 + Math.random() * 200, // blows right
            y: randomY,
            skewX: -30 
          },
          transition: { duration: 1.5, delay: index * 0.02, ease: "easeInOut" } // blows away in sequence
        };
      case "shatter":
        return {
          initial: { opacity: 1, x: 0, y: 0, rotate: 0 },
          animate: { 
            opacity: 0, 
            x: randomX * 3, 
            y: randomY * 3, 
            rotate: randomRotation * 2,
            scale: Math.random() > 0.5 ? 1.5 : 0.5
          },
          transition: { duration: 1 + Math.random(), delay: 0, ease: "easeOut" } // explodes all at once
        };
      case "fade":
        return {
          initial: { opacity: 1, scale: 1 },
          animate: { opacity: 0, scale: 0.9 },
          transition: { duration: 3, delay: randomDelay * 0.5, ease: "easeInOut" } // slow gentle fade
        };
      case "smoke":
      default:
        return {
          initial: { opacity: 1, y: 0, x: 0, rotate: 0, filter: "blur(0px)" },
          animate: { 
            opacity: 0, 
            y: -100 - Math.random() * 50, 
            x: randomX, 
            rotate: randomRotation,
            filter: "blur(10px)"
          },
          transition: { duration: 2 + Math.random() * 1.5, delay: randomDelay, ease: "easeOut" }
        };
    }
  };

  // Helper to render text as individual animated spans
  const renderAnimatedText = () => {
    const chars = text.split("");
    return (
      <div className="w-full text-brand-text font-serif text-lg md:text-xl p-4 text-center min-h-[150px] leading-relaxed break-words whitespace-pre-wrap">
        {chars.map((char, index) => {
          const props = getAnimationProps(index);
          return (
            <motion.span
              key={index}
              initial={props.initial}
              animate={props.animate}
              transition={props.transition}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-6">
      <AnimatePresence mode="wait">
        
        {/* Stage 1: Typing */}
        {stage === "typing" && (
          <motion.div
            key="typing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="w-full flex flex-col items-center"
          >
            <h2 className="font-serif text-2xl md:text-3xl text-brand-text mb-8 text-center text-balance">
              What is weighing heavy on your mind?
            </h2>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type it here. It will not be saved anywhere."
              className="w-full bg-transparent border-b border-brand-border/50 text-brand-text font-serif text-lg md:text-xl p-4 focus:outline-none focus:border-brand-accent resize-none min-h-[150px] text-center placeholder:text-brand-soft/50"
              autoFocus
            />
            
            <div className="mt-8 flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-widest text-brand-soft mb-3">How should it disappear?</span>
              <div className="flex flex-wrap justify-center gap-2">
                {(["smoke", "burn", "drop", "wind", "shatter", "fade"] as AnimationStyle[]).map(style => (
                  <button
                    key={style}
                    onClick={() => setAnimStyle(style)}
                    className={`px-3 py-1 rounded text-[10px] uppercase tracking-widest transition-colors ${animStyle === style ? "bg-brand-card text-brand-accent border border-brand-accent" : "text-brand-soft border border-brand-border hover:text-brand-text"}`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              onClick={handleRelease}
              disabled={!text.trim()}
              className="mt-12 px-8 py-3 border border-brand-border rounded-full text-xs uppercase tracking-widest text-brand-soft hover:text-brand-accent hover:border-brand-accent transition-colors disabled:opacity-30 disabled:hover:border-brand-border disabled:hover:text-brand-soft"
              whileHover={{ scale: text.trim() ? 1.05 : 1 }}
              whileTap={{ scale: text.trim() ? 0.95 : 1 }}
            >
              Release
            </motion.button>
          </motion.div>
        )}

        {/* Stage 2: Dissolving */}
        {stage === "dissolving" && (
          <motion.div
            key="dissolving"
            className="w-full flex flex-col items-center"
          >
            {renderAnimatedText()}
          </motion.div>
        )}

        {/* Stage 3: The Release Message */}
        {stage === "released" && (
          <motion.div
            key="released"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            <h2 className="font-serif text-3xl md:text-5xl text-brand-text mb-6">
              It has been released.
            </h2>
            <p className="text-brand-soft mb-12 uppercase tracking-widest text-xs">
              Take a deep breath.
            </p>
            <div className="flex gap-4">
              <button
                onClick={reset}
                className="px-6 py-2 border border-brand-border rounded-full text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors"
              >
                Start Over
              </button>
              <Link
                href="/toolkit"
                className="px-6 py-2 bg-brand-text text-brand-bg rounded-full text-xs uppercase tracking-widest hover:bg-brand-accent transition-colors"
              >
                Back to Toolkit
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
