"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function TaskAtomizerClient() {
  const [mainTask, setMainTask] = useState("");
  const [subSteps, setSubSteps] = useState<string[]>(["", "", ""]);
  const [stage, setStage] = useState<"input" | "shatter" | "focus" | "done">("input");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleShatter = () => {
    if (!mainTask.trim()) return;
    setStage("shatter");
    // Auto-progress to focus mode after shattering animation
    setTimeout(() => setStage("focus"), 3000);
  };

  const handleUpdateStep = (index: number, value: string) => {
    const newSteps = [...subSteps];
    newSteps[index] = value;
    setSubSteps(newSteps);
  };

  const addStep = () => {
    if (subSteps.length < 5) {
      setSubSteps([...subSteps, ""]);
    }
  };

  const completeCurrentStep = () => {
    if (currentStepIndex < subSteps.filter(s => s.trim() !== "").length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setStage("done");
    }
  };

  const validSteps = subSteps.filter(s => s.trim() !== "");

  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-6">
      <AnimatePresence mode="wait">
        
        {stage === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            className="w-full flex flex-col items-center"
          >
            <div className="text-4xl mb-6 grayscale opacity-50">🔨</div>
            <h2 className="font-serif text-2xl md:text-3xl text-brand-text mb-4 text-center">
              The Task Atomizer
            </h2>
            <p className="text-brand-soft text-sm text-center mb-12">
              Task paralysis happens when a task is too big. Break it into ridiculously small micro-steps.
            </p>

            <div className="w-full mb-8">
              <label className="text-[10px] uppercase tracking-widest text-brand-soft block mb-2 text-center">The Overwhelming Task</label>
              <input
                type="text"
                value={mainTask}
                onChange={e => setMainTask(e.target.value)}
                placeholder="e.g. Clean the entire apartment"
                className="w-full bg-transparent border-b-2 border-brand-text text-brand-text font-serif text-xl md:text-2xl p-4 focus:outline-none focus:border-brand-accent text-center"
                autoFocus
              />
            </div>

            <AnimatePresence>
              {mainTask.trim() && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="w-full mt-8"
                >
                  <label className="text-[10px] uppercase tracking-widest text-brand-soft block mb-4 text-center">Micro-steps (Max 5)</label>
                  <div className="flex flex-col gap-3">
                    {subSteps.map((step, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={step}
                        onChange={e => handleUpdateStep(idx, e.target.value)}
                        placeholder={`Step ${idx + 1}...`}
                        className="w-full bg-brand-card/50 border border-brand-border rounded-lg px-4 py-3 text-sm text-brand-text focus:outline-none focus:border-brand-accent"
                      />
                    ))}
                  </div>
                  {subSteps.length < 5 && (
                    <button onClick={addStep} className="mt-4 text-[10px] uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors w-full text-center">
                      + Add another step
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleShatter}
              disabled={!mainTask.trim() || validSteps.length === 0}
              className="mt-12 px-10 py-4 bg-brand-text text-brand-bg rounded-full text-xs uppercase tracking-widest hover:bg-brand-accent transition-colors disabled:opacity-30"
            >
              Atomize
            </button>
          </motion.div>
        )}

        {stage === "shatter" && (
          <motion.div
            key="shatter"
            className="flex flex-col items-center justify-center relative w-full h-[50vh]"
          >
            {/* The shattering animation */}
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.5, opacity: 0, filter: "blur(20px)" }}
              transition={{ duration: 1.5, ease: "easeIn" }}
              className="absolute text-brand-text font-serif text-3xl font-bold text-center"
            >
              {mainTask}
            </motion.div>
            
            {validSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1, 0.5],
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400
                }}
                transition={{ duration: 2, delay: 0.5 + Math.random() * 0.5 }}
                className="absolute text-brand-accent text-sm border border-brand-accent px-4 py-2 rounded-full"
              >
                {step}
              </motion.div>
            ))}
          </motion.div>
        )}

        {stage === "focus" && (
          <motion.div
            key="focus"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center w-full max-w-lg text-center"
          >
            <div className="mb-12">
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-soft border border-brand-border px-4 py-1 rounded-full">
                Step {currentStepIndex + 1} of {validSteps.length}
              </span>
            </div>
            
            <p className="text-brand-soft text-xs uppercase tracking-widest mb-6">
              Ignore everything else. Just do this:
            </p>
            
            <h2 className="font-serif text-4xl md:text-5xl text-brand-text mb-16 leading-tight">
              {validSteps[currentStepIndex]}
            </h2>
            
            <button
              onClick={completeCurrentStep}
              className="w-32 h-32 rounded-full border-2 border-brand-accent text-brand-accent flex items-center justify-center hover:bg-brand-accent hover:text-brand-bg transition-colors shadow-[0_0_30px_rgba(252,163,17,0.1)] hover:shadow-[0_0_50px_rgba(252,163,17,0.3)]"
            >
              <span className="text-xs uppercase tracking-widest font-bold">Done</span>
            </button>
          </motion.div>
        )}

        {stage === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center"
          >
            <div className="text-6xl mb-8">✅</div>
            <h2 className="font-serif text-3xl md:text-5xl text-brand-text mb-6">
              Task Complete.
            </h2>
            <p className="text-brand-soft mb-12 uppercase tracking-widest text-xs">
              You broke through the paralysis.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setMainTask("");
                  setSubSteps(["", "", ""]);
                  setCurrentStepIndex(0);
                  setStage("input");
                }}
                className="px-6 py-2 border border-brand-border rounded-full text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors"
              >
                Atomize Another
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
