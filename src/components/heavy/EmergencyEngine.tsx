"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type ViewState = "initial" | "panic" | "sleep" | "alone";

export default function EmergencyEngine() {
  const [view, setView] = useState<ViewState>("initial");

  const renderContent = () => {
    switch (view) {
      case "initial":
        return (
          <motion.div
            key="initial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 1.5 }}
            className="flex flex-col items-center justify-center min-h-screen text-center px-6"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="w-32 h-32 rounded-full border border-white/20 mb-16 shadow-[0_0_40px_rgba(255,255,255,0.05)]"
            />
            
            <h1 className="font-serif text-2xl md:text-3xl text-white/90 mb-16 font-light tracking-wide">
              It is okay. You are safe here.<br/>
              <span className="text-white/50 text-xl md:text-2xl mt-4 block">What is the heaviest thing right now?</span>
            </h1>

            <div className="flex flex-col gap-6 w-full max-w-sm">
              <button 
                onClick={() => setView("panic")}
                className="px-8 py-4 border border-white/10 rounded-full text-white/70 hover:text-white hover:border-white/40 transition-all tracking-widest text-xs uppercase"
              >
                I am panicking
              </button>
              <button 
                onClick={() => setView("sleep")}
                className="px-8 py-4 border border-white/10 rounded-full text-white/70 hover:text-white hover:border-white/40 transition-all tracking-widest text-xs uppercase"
              >
                I cannot sleep
              </button>
              <button 
                onClick={() => setView("alone")}
                className="px-8 py-4 border border-white/10 rounded-full text-white/70 hover:text-white hover:border-white/40 transition-all tracking-widest text-xs uppercase"
              >
                I feel completely alone
              </button>
            </div>
          </motion.div>
        );

      case "panic":
        return (
          <motion.div
            key="panic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="flex flex-col items-center justify-center min-h-screen text-center px-6 max-w-2xl mx-auto"
          >
            <h2 className="font-serif text-3xl text-white/90 mb-12">Let's ground you.</h2>
            
            <div className="space-y-12 text-white/70 text-lg md:text-xl font-light leading-relaxed">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 2 }}>
                Look around the room.<br/>Find <strong className="text-white font-normal">5</strong> things you can see. Name them out loud.
              </motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 8, duration: 2 }}>
                Now, find <strong className="text-white font-normal">4</strong> things you can feel. The chair, your clothes, the floor.
              </motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 14, duration: 2 }}>
                Listen closely. What are <strong className="text-white font-normal">3</strong> sounds you hear?
              </motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 20, duration: 2 }}>
                Find <strong className="text-white font-normal">2</strong> things you can smell.
              </motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 26, duration: 2 }}>
                And <strong className="text-white font-normal">1</strong> good thing about yourself.
              </motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 32, duration: 2 }} className="text-white/90 font-serif italic pt-12">
                Your body is here. The floor is holding you. You are going to be okay.
              </motion.p>
            </div>

            <div className="mt-24 flex flex-col items-center gap-8">
              <a 
                href="https://findahelpline.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs tracking-widest uppercase text-white/50 border-b border-white/20 pb-1 hover:text-white hover:border-white/50 transition-colors"
              >
                Find international crisis support
              </a>
              <button onClick={() => setView("initial")} className="text-[10px] tracking-widest uppercase text-white/30 hover:text-white/70 transition-colors">
                Go Back
              </button>
            </div>
          </motion.div>
        );

      case "sleep":
        return (
          <motion.div
            key="sleep"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="flex flex-col items-center justify-center min-h-screen px-6 py-24 max-w-2xl mx-auto"
          >
            <div className="text-left space-y-8 text-white/70 text-lg md:text-xl font-light leading-relaxed">
              <p>You don't have to force it.</p>
              <p>If sleep refuses to come right now, that is okay. The pressure to sleep is often what keeps us awake.</p>
              <p>For the next ten minutes, you are officially off the hook. You don't have to solve your life tonight. You don't have to plan for tomorrow. You don't even have to fall asleep.</p>
              <p>Your only job is to let your body rest horizontally. Your muscles are still recovering. Your heart is still slowing down. Even resting awake is a form of healing.</p>
              <p>Close your eyes, not to sleep, but just to give them a break from the light.</p>
            </div>
            
            <button onClick={() => setView("initial")} className="mt-24 text-xs tracking-widest uppercase text-white/30 hover:text-white/70 transition-colors">
              Go Back
            </button>
          </motion.div>
        );

      case "alone":
        return (
          <motion.div
            key="alone"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="flex flex-col items-center justify-center min-h-screen px-6 py-24 max-w-2xl mx-auto"
          >
            <div className="text-left space-y-8 text-white/70 text-lg md:text-xl font-light leading-relaxed">
              <p>It is profoundly quiet in the exact spot you are sitting right now.</p>
              <p>But zoom out. Across the world, right in this very second, there are millions of people awake in the dark. Some are staring at ceilings. Some are drinking water in dim kitchens. Some are feeling the exact same aching, heavy isolation you are feeling right now.</p>
              <p>You do not know their names, and they do not know yours, but you are not doing this alone. You are part of a massive, quiet chorus of humans surviving the night together.</p>
              <p>I am glad you are here. Tomorrow will come, and the sun will rise for you, too.</p>
            </div>

            <button onClick={() => setView("initial")} className="mt-24 text-xs tracking-widest uppercase text-white/30 hover:text-white/70 transition-colors">
              Go Back
            </button>
          </motion.div>
        );
    }
  };

  return (
    <div className="relative">
      <Link href="/" className="absolute top-8 left-8 md:top-12 md:left-12 text-xs tracking-widest uppercase text-white/30 hover:text-white/70 transition-colors z-50">
        Exit to Home
      </Link>
      
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </div>
  );
}
