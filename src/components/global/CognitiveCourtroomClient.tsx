"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function CognitiveCourtroomClient() {
  const [story, setStory] = useState("");
  const [facts, setFacts] = useState<string[]>([]);
  const [currentFact, setCurrentFact] = useState("");
  const [stage, setStage] = useState<"writing" | "extracting" | "verdict">("writing");

  const startExtraction = () => {
    if (!story.trim()) return;
    setStage("extracting");
  };

  const addFact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFact.trim()) return;
    setFacts([...facts, currentFact.trim()]);
    setCurrentFact("");
  };

  const removeFact = (index: number) => {
    setFacts(facts.filter((_, i) => i !== index));
  };

  const deliverVerdict = () => {
    setStage("verdict");
  };

  const reset = () => {
    setStory("");
    setFacts([]);
    setCurrentFact("");
    setStage("writing");
  };

  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center max-w-5xl mx-auto w-full px-6">
      
      {stage === "writing" && (
        <motion.div
          key="writing"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="w-full flex flex-col items-center max-w-xl"
        >
          <div className="text-4xl mb-6 grayscale opacity-50">⚖️</div>
          <h2 className="font-serif text-2xl md:text-3xl text-brand-text mb-4 text-center">
            The Cognitive Courtroom
          </h2>
          <p className="text-brand-soft text-sm text-center mb-12">
            Catastrophizing blends facts with emotions until you can't tell the difference. Write the entire anxious story your brain is telling you right now.
          </p>

          <textarea
            value={story}
            onChange={e => setStory(e.target.value)}
            placeholder="e.g. My boss didn't reply to my slack message for 4 hours, which means they hate my work and I'm probably going to be fired by Friday..."
            className="w-full bg-brand-card/50 border border-brand-border rounded-xl px-6 py-6 text-brand-text font-serif text-lg focus:outline-none focus:border-brand-accent transition-colors min-h-[200px]"
            autoFocus
          />

          <button
            onClick={startExtraction}
            disabled={!story.trim()}
            className="mt-8 px-10 py-4 bg-brand-text text-brand-bg rounded-full text-xs uppercase tracking-widest hover:bg-brand-accent transition-colors disabled:opacity-30 disabled:bg-brand-card disabled:text-brand-soft"
          >
            Enter the Courtroom
          </button>
        </motion.div>
      )}

      {stage === "extracting" && (
        <motion.div
          key="extracting"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full flex flex-col md:flex-row gap-8 lg:gap-16 items-start"
        >
          {/* Left Column: The Story */}
          <div className="flex-1 w-full">
            <h3 className="text-[10px] uppercase tracking-widest text-brand-soft mb-6 flex items-center gap-2">
              <span>The Story You're Telling Yourself</span>
              <span className="h-px bg-brand-border flex-1" />
            </h3>
            <div className="p-6 bg-brand-card/30 border border-brand-border/50 rounded-xl">
              <p className="text-brand-soft font-serif text-lg leading-relaxed italic opacity-50">
                "{story}"
              </p>
            </div>
          </div>

          {/* Right Column: The Facts */}
          <div className="flex-1 w-full flex flex-col h-full">
            <h3 className="text-[10px] uppercase tracking-widest text-brand-accent mb-6 flex items-center gap-2">
              <span>The Cold Hard Facts</span>
              <span className="h-px bg-brand-accent/30 flex-1" />
            </h3>
            
            <p className="text-brand-soft text-xs mb-6">
              Extract ONLY the objective facts that could be proven in a court of law. Strip away all mind-reading, assumptions, and emotions.
            </p>

            <form onSubmit={addFact} className="flex gap-2 mb-8">
              <input
                type="text"
                value={currentFact}
                onChange={e => setCurrentFact(e.target.value)}
                placeholder="e.g. My boss hasn't replied yet."
                className="flex-1 bg-transparent border-b border-brand-border focus:outline-none focus:border-brand-accent text-brand-text font-serif pb-2"
              />
              <button
                type="submit"
                disabled={!currentFact.trim()}
                className="text-brand-accent uppercase tracking-widest text-[10px] hover:text-brand-text transition-colors disabled:opacity-30"
              >
                Add Fact
              </button>
            </form>

            <div className="flex flex-col gap-3 flex-1 mb-8">
              <AnimatePresence>
                {facts.map((fact, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex justify-between items-start gap-4 p-4 bg-brand-bg border border-brand-accent/30 rounded-lg group"
                  >
                    <span className="text-brand-text font-serif flex-1">{fact}</span>
                    <button 
                      onClick={() => removeFact(idx)}
                      className="text-brand-soft hover:text-brand-text opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                    >
                      ✕
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {facts.length === 0 && (
                <p className="text-center text-brand-soft text-xs py-8 border border-brand-border/50 border-dashed rounded-lg">
                  What actually happened?
                </p>
              )}
            </div>

            <button
              onClick={deliverVerdict}
              disabled={facts.length === 0}
              className="w-full py-4 border border-brand-accent text-brand-accent rounded-full text-xs uppercase tracking-widest hover:bg-brand-accent hover:text-brand-bg transition-colors disabled:opacity-30 disabled:border-brand-border disabled:text-brand-soft"
            >
              Deliver Verdict
            </button>
          </div>
        </motion.div>
      )}

      {stage === "verdict" && (
        <motion.div
          key="verdict"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center max-w-2xl w-full text-center"
        >
          <h3 className="text-[10px] uppercase tracking-[0.3em] text-brand-soft mb-8">The Verdict</h3>
          
          <h2 className="font-serif text-3xl md:text-4xl text-brand-text mb-8 leading-relaxed">
            Your anxiety was based on a story. <br/> The reality is simply this:
          </h2>
          
          <div className="w-full flex flex-col gap-4 mb-16">
            {facts.map((fact, idx) => (
              <div key={idx} className="p-6 bg-brand-card/50 border border-brand-accent/50 rounded-xl shadow-[0_0_30px_rgba(252,163,17,0.05)]">
                <p className="text-brand-text font-serif text-xl">{fact}</p>
              </div>
            ))}
          </div>

          <p className="text-brand-soft text-sm italic mb-16">
            The facts are manageable. The story was not.
          </p>

          <div className="flex gap-4">
            <button
              onClick={reset}
              className="px-6 py-2 border border-brand-border rounded-full text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors"
            >
              Examine Another
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
    </div>
  );
}
