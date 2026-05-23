"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Worry {
  id: string;
  text: string;
  status: "unsorted" | "in_control" | "out_of_control";
}

export default function ControlSorterClient() {
  const [input, setInput] = useState("");
  const [worries, setWorries] = useState<Worry[]>([]);
  const [stage, setStage] = useState<"inputting" | "sorting" | "sorted">("inputting");

  const addWorry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setWorries([...worries, { id: Date.now().toString(), text: input.trim(), status: "unsorted" }]);
    setInput("");
  };

  const removeWorry = (id: string) => {
    setWorries(worries.filter(w => w.id !== id));
  };

  const startSorting = () => {
    if (worries.length === 0) return;
    setStage("sorting");
  };

  const sortWorry = (id: string, status: "in_control" | "out_of_control") => {
    setWorries(worries.map(w => w.id === id ? { ...w, status } : w));
  };

  const finishSorting = () => {
    setStage("sorted");
  };

  const reset = () => {
    setWorries([]);
    setStage("inputting");
  };

  const unsortedWorries = worries.filter(w => w.status === "unsorted");
  const inControlWorries = worries.filter(w => w.status === "in_control");
  const outOfControlWorries = worries.filter(w => w.status === "out_of_control");

  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center max-w-4xl mx-auto w-full px-6">
      
      {/* Stage 1: Inputting */}
      {stage === "inputting" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="w-full flex flex-col items-center max-w-lg"
        >
          <div className="text-4xl mb-6 grayscale opacity-50">⚖️</div>
          <h2 className="font-serif text-2xl md:text-3xl text-brand-text mb-4 text-center">
            The Control Sorter
          </h2>
          <p className="text-brand-soft text-sm text-center mb-12">
            List everything causing you anxiety right now. Break the overwhelm into individual items.
          </p>

          <form onSubmit={addWorry} className="w-full flex gap-2 mb-8">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="e.g. The upcoming presentation"
              className="flex-1 bg-brand-card/50 border border-brand-border rounded-xl px-4 py-3 text-brand-text focus:outline-none focus:border-brand-accent transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-brand-text text-brand-bg px-6 rounded-xl text-xs uppercase tracking-widest font-medium hover:bg-brand-accent transition-colors disabled:opacity-50"
            >
              Add
            </button>
          </form>

          <div className="w-full flex flex-col gap-2 mb-12">
            <AnimatePresence>
              {worries.map((worry) => (
                <motion.div
                  key={worry.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-brand-bg border border-brand-border rounded-lg p-3 flex justify-between items-center group"
                >
                  <span className="text-brand-text">{worry.text}</span>
                  <button onClick={() => removeWorry(worry.id)} className="text-brand-soft hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    ✕
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {worries.length === 0 && (
              <p className="text-center text-brand-soft text-xs py-4 border border-brand-border/50 border-dashed rounded-lg">
                Your list is empty.
              </p>
            )}
          </div>

          <button
            onClick={startSorting}
            disabled={worries.length === 0}
            className="w-full py-4 border border-brand-border rounded-full text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text hover:border-brand-text transition-colors disabled:opacity-30"
          >
            Sort these thoughts
          </button>
        </motion.div>
      )}

      {/* Stage 2: Sorting */}
      {stage === "sorting" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full flex flex-col items-center"
        >
          <h2 className="font-serif text-xl md:text-2xl text-brand-text mb-8 text-center">
            Sort your list. Be brutally honest.
          </h2>
          
          {unsortedWorries.length > 0 ? (
            <div className="flex flex-col items-center mb-12">
              <motion.div 
                key={unsortedWorries[0].id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-brand-card border-2 border-brand-accent rounded-xl p-8 mb-8 text-center max-w-sm w-full shadow-lg"
              >
                <p className="text-brand-text text-xl font-serif">{unsortedWorries[0].text}</p>
              </motion.div>
              
              <div className="flex gap-4 w-full max-w-sm">
                <button
                  onClick={() => sortWorry(unsortedWorries[0].id, "out_of_control")}
                  className="flex-1 py-4 border border-brand-border rounded-xl text-xs uppercase tracking-widest text-brand-soft hover:bg-brand-bg hover:text-brand-text transition-all"
                >
                  Out of my control
                </button>
                <button
                  onClick={() => sortWorry(unsortedWorries[0].id, "in_control")}
                  className="flex-1 py-4 border border-brand-accent rounded-xl text-xs uppercase tracking-widest text-brand-accent hover:bg-brand-accent hover:text-brand-bg transition-all"
                >
                  In my control
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center mb-12">
              <p className="text-brand-soft text-lg mb-8">Everything is sorted.</p>
              <button
                onClick={finishSorting}
                className="px-8 py-3 bg-brand-text text-brand-bg rounded-full text-xs uppercase tracking-widest font-medium hover:bg-brand-accent transition-colors"
              >
                Reveal Clarity
              </button>
            </div>
          )}
          
          <div className="w-full flex gap-8 opacity-50 pointer-events-none mt-8">
            <div className="flex-1 border border-brand-border rounded-xl p-4 min-h-[100px]">
              <span className="text-[10px] uppercase tracking-widest text-brand-soft block mb-4">Out of my control ({outOfControlWorries.length})</span>
            </div>
            <div className="flex-1 border border-brand-accent/50 rounded-xl p-4 min-h-[100px]">
              <span className="text-[10px] uppercase tracking-widest text-brand-accent block mb-4">In my control ({inControlWorries.length})</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stage 3: Sorted Result */}
      {stage === "sorted" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full flex flex-col md:flex-row gap-8 lg:gap-16 items-start"
        >
          {/* Out of Control Zone (Disintegrating) */}
          <div className="flex-1 w-full">
            <h3 className="text-[10px] uppercase tracking-widest text-brand-soft mb-6 flex items-center gap-2">
              <span>Out of your control</span>
              <span className="h-px bg-brand-border flex-1" />
            </h3>
            <div className="flex flex-col gap-4">
              {outOfControlWorries.length === 0 ? (
                <p className="text-brand-soft text-sm italic">Nothing here.</p>
              ) : (
                outOfControlWorries.map((worry, index) => (
                  <motion.div
                    key={worry.id}
                    initial={{ opacity: 1, filter: "blur(0px)", x: 0 }}
                    animate={{ opacity: 0, filter: "blur(10px)", x: 50 }}
                    transition={{ duration: 4, delay: 1 + index * 0.5 }}
                    className="p-4 border border-brand-border/30 rounded-lg text-brand-soft/50 line-through"
                  >
                    {worry.text}
                  </motion.div>
                ))
              )}
            </div>
            {outOfControlWorries.length > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + outOfControlWorries.length * 0.5 }}
                className="mt-8 text-xs text-brand-soft italic"
              >
                Let these fade away. They are not your burden to carry today.
              </motion.p>
            )}
          </div>

          {/* In Control Zone (Actionable) */}
          <div className="flex-1 w-full">
            <h3 className="text-[10px] uppercase tracking-widest text-brand-accent mb-6 flex items-center gap-2">
              <span>In your control</span>
              <span className="h-px bg-brand-accent/30 flex-1" />
            </h3>
            <div className="flex flex-col gap-4">
              {inControlWorries.length === 0 ? (
                <p className="text-brand-soft text-sm italic">Nothing here.</p>
              ) : (
                inControlWorries.map((worry, index) => (
                  <motion.div
                    key={worry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="p-4 bg-brand-card border border-brand-accent/50 rounded-lg text-brand-text shadow-sm"
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" className="mt-1 accent-brand-accent" />
                      <span>{worry.text}</span>
                    </label>
                  </motion.div>
                ))
              )}
            </div>
            {inControlWorries.length > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 text-xs text-brand-text italic"
              >
                This is your action list. Focus only on this.
              </motion.p>
            )}

            <div className="mt-16 flex gap-4">
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
          </div>
        </motion.div>
      )}

    </div>
  );
}
