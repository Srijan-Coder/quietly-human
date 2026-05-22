"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { OverthinkingTool } from "@/components/toolkit/OverthinkingTool";

type Phase = "inhale" | "hold" | "exhale" | "rest";

const phaseConfig: Record<Phase, { duration: number; next: Phase }> = { 
  inhale: { duration: 4, next: "hold" }, 
  hold: { duration: 7, next: "exhale" }, 
  exhale: { duration: 8, next: "rest" }, 
  rest: { duration: 2, next: "inhale" } 
};

const instructions: Record<Phase, string> = { 
  inhale: "Breathe in", 
  hold: "Hold", 
  exhale: "Breathe out", 
  rest: "Rest" 
};

// ─── Breathing Circle ──────────────────────────────────────────────────────
function BreathingCircle() {
  const [phase, setPhase] = useState<Phase>("inhale");
  const [active, setActive] = useState(false);
  const [seconds, setSeconds] = useState(4);

  useEffect(() => {
    if (!active) return;
    const cfg = phaseConfig[phase];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSeconds(cfg.duration);
    const countdown = setInterval(() => setSeconds(s => s - 1), 1000);
    const next = setTimeout(() => setPhase(phaseConfig[phase].next), cfg.duration * 1000);
    return () => { clearInterval(countdown); clearTimeout(next); };
  }, [phase, active]);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
        <motion.div
          className="rounded-full absolute"
          style={{ background: "radial-gradient(circle, var(--color-accent)30, var(--color-accent)08)" }}
          animate={active ? { width: phase === "inhale" ? 220 : phase === "hold" ? 220 : 120, height: phase === "inhale" ? 220 : phase === "hold" ? 220 : 120 } : { width: 160, height: 160 }}
          transition={{ duration: phase === "inhale" ? 4 : phase === "exhale" ? 8 : 0.3, ease: "easeInOut" }}
        />
        <motion.div
          className="rounded-full border border-brand-border absolute inset-0"
          animate={active ? { opacity: [0.3, 0.8, 0.3] } : { opacity: 0.3 }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <div className="relative z-10 text-center">
          <p className="font-serif text-xl text-brand-text">{active ? instructions[phase] : "Begin"}</p>
          {active && <p className="text-3xl font-serif text-brand-accent mt-1">{seconds}</p>}
        </div>
      </div>
      <button
        onClick={() => { setActive(!active); if (!active) setPhase("inhale"); }}
        className="text-xs uppercase tracking-widest border border-brand-border px-6 py-3 rounded-full hover:border-brand-accent hover:text-brand-accent transition-colors"
      >
        {active ? "Stop" : "Start 4-7-8 Breathing"}
      </button>
    </div>
  );
}

// ─── Soft No Script ────────────────────────────────────────────────────────
const softNos = [
  "I appreciate you thinking of me, but I need to pass on this one.",
  "That sounds lovely, but I'm not in a position to commit right now.",
  "I'm protecting my time and energy at the moment — I'll have to say no.",
  "This isn't something I can take on right now, but thank you for asking.",
  "I've been learning to honour what I need, and right now I need to say no.",
  "I'm not the right person for this right now, but I hope you find your answer.",
];

function SoftNoScript() {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const next = () => setIndex(i => (i + 1) % softNos.length);
  const copy = () => { navigator.clipboard.writeText(softNos[index]); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="font-serif text-xl md:text-2xl text-brand-text leading-relaxed italic max-w-lg"
        >
          &quot;{softNos[index]}&quot;
        </motion.p>
      </AnimatePresence>
      <div className="flex gap-4">
        <button onClick={next} className="text-xs uppercase tracking-widest border border-brand-border px-5 py-2.5 rounded-full hover:border-brand-accent transition-colors">
          Next Script
        </button>
        <button onClick={copy} className="text-xs uppercase tracking-widest border border-brand-border px-5 py-2.5 rounded-full hover:border-brand-accent hover:text-brand-accent transition-colors">
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

// ─── Tiny Win Logger ───────────────────────────────────────────────────────
type TinyWin = { text: string; date: string };

function TinyWinLogger() {
  const [wins, setWins] = useLocalStorage<TinyWin[]>("tiny-wins", []);
  const [input, setInput] = useState("");

  const addWin = () => {
    if (!input.trim()) return;
    setWins([{ text: input, date: new Date().toLocaleDateString() }, ...wins]);
    setInput("");
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <div className="flex gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addWin()}
          placeholder="I made my bed. I drank water. I showed up."
          className="flex-1 bg-transparent border-b border-brand-border pb-2 outline-none focus:border-brand-accent transition-colors text-sm"
        />
        <button onClick={addWin} className="text-xs uppercase tracking-widest text-brand-accent hover:opacity-70 transition-opacity">
          Log
        </button>
      </div>
      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
        <AnimatePresence>
          {wins.map((win, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex justify-between items-start p-3 bg-brand-card rounded-lg border border-brand-border text-sm"
            >
              <span className="text-brand-text">{win.text}</span>
              <span className="text-[10px] text-brand-soft shrink-0 ml-4">{win.date}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {wins.length > 0 && (
        <button onClick={() => setWins([])} className="text-[10px] uppercase tracking-widest text-brand-soft hover:text-red-400 transition-colors self-end">
          Clear all
        </button>
      )}
    </div>
  );
}

// ─── Night Reset Checklist ─────────────────────────────────────────────────
const nightSteps = [
  "Close all unnecessary tabs — physical and mental.",
  "Drink a glass of water slowly.",
  "Write down one thing that is making you anxious.",
  "Decide one gentle thing to do tomorrow morning.",
  "Tell yourself: I did enough today. Rest is allowed.",
];

function NightReset() {
  const [checked, setChecked] = useState<boolean[]>(new Array(nightSteps.length).fill(false));
  const done = checked.every(Boolean);

  const toggle = (i: number) => setChecked(prev => prev.map((v, idx) => idx === i ? !v : v));

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      {nightSteps.map((step, i) => (
        <motion.button
          key={i}
          onClick={() => toggle(i)}
          className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-500 ${checked[i] ? "border-brand-accent bg-brand-accent/5 opacity-60" : "border-brand-border hover:border-brand-accent/50"}`}
          whileTap={{ scale: 0.98 }}
        >
          <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${checked[i] ? "border-brand-accent bg-brand-accent" : "border-brand-border"}`}>
            {checked[i] && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
          </div>
          <span className={`font-serif text-base ${checked[i] ? "line-through text-brand-soft" : "text-brand-text"}`}>{step}</span>
        </motion.button>
      ))}
      <AnimatePresence>
        {done && (
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center font-serif italic text-brand-accent text-lg mt-4">
            You can rest now. You did enough.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
const tools = [
  { id: "overthinking", label: "Overthinking Release", desc: "Let go of heavy, looping thoughts", component: OverthinkingTool },
  { id: "breathe", label: "Breathing Circle", desc: "4-7-8 technique to calm your nervous system", component: BreathingCircle },
  { id: "no", label: "Soft No Script", desc: "Gentle words for when you need to set a boundary", component: SoftNoScript },
  { id: "wins", label: "Tiny Win Logger", desc: "Record small victories that usually go unnoticed", component: TinyWinLogger },
  { id: "night", label: "Night Reset", desc: "A 5-step wind-down ritual for restless nights", component: NightReset },
];

export default function ToolkitPage() {
  const [active, setActive] = useState("overthinking");
  const ActiveTool = tools.find(t => t.id === active)?.component || OverthinkingTool;

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-xs uppercase tracking-widest text-brand-accent mb-4 block">Free Tools</span>
        <h1 className="text-5xl md:text-6xl font-serif text-brand-text mb-6">Soft Toolkit</h1>
        <p className="text-brand-soft max-w-xl mx-auto leading-relaxed">
          Small, quiet tools for the moments when you need a little support.
        </p>
      </div>

      {/* Tool selector */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-16">
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => setActive(tool.id)}
            className={`p-4 rounded-2xl border text-left transition-all duration-300 ${active === tool.id ? "border-brand-accent bg-brand-accent/5" : "border-brand-border hover:border-brand-accent/50"}`}
          >
            <p className={`text-sm font-medium mb-1 ${active === tool.id ? "text-brand-accent" : "text-brand-text"}`}>{tool.label}</p>
            <p className="text-[11px] text-brand-soft leading-relaxed">{tool.desc}</p>
          </button>
        ))}
      </div>

      {/* Active tool */}
      <div className="p-10 md:p-16 bg-brand-card border border-brand-border rounded-3xl flex items-center justify-center min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <ActiveTool />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
