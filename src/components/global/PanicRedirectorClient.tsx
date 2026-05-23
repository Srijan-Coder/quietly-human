"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const steps = [
  { count: 5, action: "things you can see", instruction: "Look around you. Notice five things you can see." },
  { count: 4, action: "things you can touch", instruction: "Reach out. Notice four things you can physically feel." },
  { count: 3, action: "things you can hear", instruction: "Listen closely. Notice three distinct sounds." },
  { count: 2, action: "things you can smell", instruction: "Breathe in. Notice two things you can smell." },
  { count: 1, action: "thing you can taste", instruction: "Notice one thing you can taste right now." },
];

export default function PanicRedirectorClient() {
  const [currentStep, setCurrentStep] = useState(-1); // -1 is the intro
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    // A subtle slow breathing pulse for the background
    const interval = setInterval(() => {
      setPulsing(prev => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(-1);
  };

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-6">
      
      {/* Subtle pulsing background glow that syncs with deep breathing (4s in, 4s out) */}
      <motion.div 
        className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,rgba(252,163,17,0.1)_0%,transparent_70%)]"
        animate={{ scale: pulsing ? 1.2 : 1, opacity: pulsing ? 0.3 : 0.1 }}
        transition={{ duration: 4, ease: "easeInOut" }}
      />

      <AnimatePresence mode="wait">
        {/* Intro Stage */}
        {currentStep === -1 && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 1 } }}
            className="w-full flex flex-col items-center text-center"
          >
            <div className="text-4xl mb-8 opacity-50">🕰️</div>
            <h1 className="font-serif text-4xl md:text-5xl text-brand-text mb-6">
              Panic Redirector
            </h1>
            <p className="text-brand-soft text-lg max-w-md mb-12 leading-relaxed">
              When thoughts are spiraling, this clinical 5-4-3-2-1 method will pull you back into your physical body.
            </p>
            <button
              onClick={handleNext}
              className="px-10 py-4 bg-brand-text text-brand-bg rounded-full text-sm uppercase tracking-widest hover:bg-brand-accent transition-colors shadow-lg"
            >
              Begin Grounding
            </button>
          </motion.div>
        )}

        {/* Guided Steps */}
        {currentStep >= 0 && currentStep < steps.length && (
          <motion.div
            key={`step-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(5px)", transition: { duration: 1 } }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full flex flex-col items-center text-center"
          >
            <span className="text-[120px] md:text-[180px] font-serif font-bold text-brand-text/10 leading-none mb-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 select-none">
              {steps[currentStep].count}
            </span>
            
            <h2 className="text-2xl md:text-4xl font-serif text-brand-text mb-4">
              Find {steps[currentStep].count} {steps[currentStep].action}.
            </h2>
            <p className="text-brand-soft uppercase tracking-widest text-xs mb-16">
              {steps[currentStep].instruction}
            </p>

            <p className="text-brand-soft text-sm italic mb-12 max-w-xs text-balance">
              Take your time. Do not rush. Name them silently in your head.
            </p>

            <button
              onClick={handleNext}
              className="px-8 py-3 border border-brand-border rounded-full text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text hover:border-brand-text transition-all duration-500"
            >
              I have found them
            </button>
          </motion.div>
        )}

        {/* Final Stage */}
        {currentStep === steps.length && (
          <motion.div
            key="finish"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="w-full flex flex-col items-center text-center"
          >
            <h2 className="font-serif text-3xl md:text-5xl text-brand-text mb-6">
              You are here.
            </h2>
            <p className="text-brand-soft mb-12 text-lg">
              You are safe. You are in your body.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleRestart}
                className="px-6 py-2 border border-brand-border rounded-full text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors"
              >
                Restart
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
