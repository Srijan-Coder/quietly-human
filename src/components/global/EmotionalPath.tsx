"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type ToolRecommendation = {
  name: string;
  icon: string;
  desc: string;
  link: string;
};

type NeedMapping = {
  label: string;
  tool: ToolRecommendation;
};

type StateMapping = {
  state: string;
  needs: NeedMapping[];
};

const toolkitMap: StateMapping[] = [
  {
    state: "spiraling",
    needs: [
      {
        label: "find the facts",
        tool: { name: "Cognitive Courtroom", icon: "⚖️", desc: "Put your anxious story on trial and extract only the objective facts.", link: "/toolkit/cognitive-courtroom" }
      },
      {
        label: "zoom out",
        tool: { name: "The View From Above", icon: "🔭", desc: "A Stoic visualization to put your stress into cosmic perspective.", link: "/toolkit/view-from-above" }
      },
      {
        label: "let it pass",
        tool: { name: "Leaves on a Stream", icon: "🍃", desc: "Place intrusive thoughts on a leaf and watch them float away.", link: "/toolkit/leaves-on-stream" }
      }
    ]
  },
  {
    state: "paralyzed",
    needs: [
      {
        label: "break things down",
        tool: { name: "The Task Atomizer", icon: "🔨", desc: "Shatter an overwhelming task and enter hyper-focus mode.", link: "/toolkit/task-atomizer" }
      },
      {
        label: "make a choice",
        tool: { name: "The Decision Coin", icon: "🪙", desc: "Flip a slow-motion coin and let the universe decide.", link: "/toolkit/decision-coin" }
      }
    ]
  },
  {
    state: "agitated",
    needs: [
      {
        label: "slow my breathing",
        tool: { name: "The Breathing Room", icon: "🌬️", desc: "A cyclic visualizer to regulate your nervous system.", link: "/breathe" }
      },
      {
        label: "distract my hands",
        tool: { name: "The Grounding Sandbox", icon: "✨", desc: "A calming physics sandbox to pull your mind to the present.", link: "/toolkit/grounding-sandbox" }
      },
      {
        label: "ground myself",
        tool: { name: "Panic Redirector", icon: "🕰️", desc: "Break thought spirals using the 5-4-3-2-1 clinical method.", link: "/toolkit/panic-redirector" }
      }
    ]
  },
  {
    state: "exhausted",
    needs: [
      {
        label: "log what I survived",
        tool: { name: "The 'Done' List", icon: "✅", desc: "A reverse to-do list for low-energy days.", link: "/toolkit/done-list" }
      },
      {
        label: "guard my energy",
        tool: { name: "The Energy Battery", icon: "🔋", desc: "Manage your daily capacity based on Spoon Theory.", link: "/toolkit/energy-battery" }
      },
      {
        label: "transition to rest",
        tool: { name: "The Air Lock", icon: "🚪", desc: "A 2-minute digital decompression chamber to leave work behind.", link: "/toolkit/air-lock" }
      }
    ]
  },
  {
    state: "impulsive",
    needs: [
      {
        label: "ride the wave",
        tool: { name: "Urge Surfing", icon: "🌊", desc: "Watch a 5-minute wave and log craving intensity until it breaks.", link: "/toolkit/urge-surfer" }
      },
      {
        label: "stop myself",
        tool: { name: "The Friction Generator", icon: "🛑", desc: "A physical speed bump. Hold a button for 30s before acting.", link: "/toolkit/friction-generator" }
      }
    ]
  },
  {
    state: "overwhelmed",
    needs: [
      {
        label: "empty my brain",
        tool: { name: "The Brain Dump", icon: "🗑️", desc: "An unreadable canvas. Vent your chaos and wipe it clean.", link: "/toolkit/brain-dump" }
      },
      {
        label: "sort what I control",
        tool: { name: "The Control Sorter", icon: "⚖️", desc: "Sort anxieties and watch the uncontrollable ones disintegrate.", link: "/toolkit/control-sorter" }
      },
      {
        label: "worry later",
        tool: { name: "The Worry Postponer", icon: "📦", desc: "Lock your worry in a box and schedule a 15-minute window for later.", link: "/toolkit/worry-postponer" }
      }
    ]
  },
  {
    state: "doomscrolling",
    needs: [
      {
        label: "find better dopamine",
        tool: { name: "The Dopamine Menu", icon: "🍽️", desc: "Get a random 'Chef's Recommendation' for healthy stimulation.", link: "/toolkit/dopamine-menu" }
      }
    ]
  },
  {
    state: "feeling like a failure",
    needs: [
      {
        label: "find the nuance",
        tool: { name: "The 'Yes, But' Flipper", icon: "🃏", desc: "Combat black-and-white thinking by forcing your brain to reframe.", link: "/toolkit/yes-but-flipper" }
      }
    ]
  },
  {
    state: "numb",
    needs: [
      {
        label: "identify the feeling",
        tool: { name: "Emotion Color Wheel", icon: "🎨", desc: "Drill down into an interactive wheel to find the exact emotion.", link: "/toolkit/emotion-color-wheel" }
      }
    ]
  }
];

export function EmotionalPath() {
  const [selectedStateIdx, setSelectedStateIdx] = useState<number>(0);
  const [selectedNeedIdx, setSelectedNeedIdx] = useState<number>(0);

  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [isNeedDropdownOpen, setIsNeedDropdownOpen] = useState(false);

  const currentState = toolkitMap[selectedStateIdx];
  const currentNeed = currentState.needs[selectedNeedIdx];
  const recommendedTool = currentNeed.tool;

  const handleStateChange = (idx: number) => {
    setSelectedStateIdx(idx);
    setSelectedNeedIdx(0); // Reset need when state changes
    setIsStateDropdownOpen(false);
  };

  const handleNeedChange = (idx: number) => {
    setSelectedNeedIdx(idx);
    setIsNeedDropdownOpen(false);
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-32 border-t border-brand-border">
      <div className="text-center mb-16">
        <span className="text-xs uppercase tracking-widest text-brand-accent mb-4 block">The Compass</span>
        <h2 className="text-3xl md:text-4xl font-serif text-brand-text mb-4">Find the exact tool you need right now.</h2>
      </div>

      <div className="flex flex-col items-center">
        {/* The Mad-Lib Sentence */}
        <div className="text-center font-serif text-2xl md:text-4xl lg:text-5xl leading-[1.8] md:leading-[1.6] text-brand-text flex flex-wrap justify-center items-center gap-x-2 gap-y-6">
          <span>Right now, my mind is</span>
          
          {/* State Dropdown */}
          <div className="relative inline-block mx-2">
            <button 
              onClick={() => { setIsStateDropdownOpen(!isStateDropdownOpen); setIsNeedDropdownOpen(false); }}
              className={`inline-flex items-center gap-2 px-4 py-1 rounded-xl transition-all duration-300 ${isStateDropdownOpen ? "bg-brand-accent text-brand-bg shadow-lg" : "bg-brand-card border border-brand-border hover:border-brand-accent text-brand-accent shadow-sm"}`}
            >
              <span className="italic font-bold">{currentState.state}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 transition-transform ${isStateDropdownOpen ? "rotate-180" : ""}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            
            <AnimatePresence>
              {isStateDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 max-h-64 overflow-y-auto bg-brand-card/95 backdrop-blur-xl border border-brand-border rounded-2xl shadow-2xl z-50 text-base"
                >
                  <div className="flex flex-col p-2">
                    {toolkitMap.map((s, idx) => (
                      <button
                        key={s.state}
                        onClick={() => handleStateChange(idx)}
                        className={`text-left px-4 py-3 rounded-lg transition-colors italic ${idx === selectedStateIdx ? "bg-brand-accent text-brand-bg font-bold" : "text-brand-text hover:bg-brand-bg"}`}
                      >
                        {s.state}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <span>,</span>
          <br className="hidden md:block" />
          <span>and I just need to</span>

          {/* Need Dropdown */}
          <div className="relative inline-block mx-2">
            <button 
              onClick={() => { setIsNeedDropdownOpen(!isNeedDropdownOpen); setIsStateDropdownOpen(false); }}
              className={`inline-flex items-center gap-2 px-4 py-1 rounded-xl transition-all duration-300 ${isNeedDropdownOpen ? "bg-brand-accent text-brand-bg shadow-lg" : "bg-brand-card border border-brand-border hover:border-brand-accent text-brand-accent shadow-sm"}`}
            >
              <span className="italic font-bold">{currentNeed.label}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 transition-transform ${isNeedDropdownOpen ? "rotate-180" : ""}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            <AnimatePresence>
              {isNeedDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 max-h-64 overflow-y-auto bg-brand-card/95 backdrop-blur-xl border border-brand-border rounded-2xl shadow-2xl z-50 text-base"
                >
                  <div className="flex flex-col p-2">
                    {currentState.needs.map((n, idx) => (
                      <button
                        key={n.label}
                        onClick={() => handleNeedChange(idx)}
                        className={`text-left px-4 py-3 rounded-lg transition-colors italic ${idx === selectedNeedIdx ? "bg-brand-accent text-brand-bg font-bold" : "text-brand-text hover:bg-brand-bg"}`}
                      >
                        {n.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <span>.</span>
        </div>

        {/* The Result Card */}
        <div className="mt-20 w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={recommendedTool.name}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 100, damping: 15 }}
              className="bg-brand-bg border border-brand-accent/50 rounded-3xl p-8 md:p-10 shadow-[0_0_50px_rgba(252,163,17,0.05)] hover:shadow-[0_0_50px_rgba(252,163,17,0.1)] transition-shadow relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-8xl">{recommendedTool.icon}</span>
              </div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-6">Recommended Tool</span>
                <span className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-500">{recommendedTool.icon}</span>
                <h3 className="font-serif text-3xl text-brand-text mb-4">{recommendedTool.name}</h3>
                <p className="text-brand-soft text-sm mb-10 leading-relaxed">
                  {recommendedTool.desc}
                </p>
                <Link
                  href={recommendedTool.link}
                  className="w-full py-4 bg-brand-text text-brand-bg rounded-full text-xs uppercase tracking-widest font-bold hover:bg-brand-accent transition-colors shadow-lg"
                >
                  Go to Tool →
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
