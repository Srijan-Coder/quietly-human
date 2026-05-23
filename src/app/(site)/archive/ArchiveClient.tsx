"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ArchiveClient() {
  const [message, setMessage] = useState("");
  const [unlockDays, setUnlockDays] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [unlockDateLabel, setUnlockDateLabel] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/capsule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, unlockDays })
      });
      
      const data = await res.json();
      if (data.success) {
        setUnlockDateLabel(new Date(data.unlockDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }));
        setSuccess(true);
        setMessage("");
      }
    } catch (error) {
      console.error("Failed to submit capsule");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-6 md:p-10 shadow-sm max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!success ? (
          <motion.form 
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit} 
            className="flex flex-col gap-8"
          >
            <div>
              <label className="block text-sm uppercase tracking-widest text-brand-soft mb-4">What do you want to tell the future?</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="I hope you finally forgave yourself for..."
                className="w-full bg-transparent border border-brand-border rounded-xl p-6 h-40 focus:outline-none focus:border-brand-accent transition-colors text-brand-text placeholder-brand-soft/50 resize-none font-serif text-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm uppercase tracking-widest text-brand-soft mb-4">Seal this capsule for...</label>
              <div className="grid grid-cols-3 gap-4">
                {[7, 30, 365].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setUnlockDays(days)}
                    className={`py-4 rounded-xl border text-xs tracking-widest uppercase transition-colors ${
                      unlockDays === days 
                        ? "border-brand-accent bg-brand-accent/10 text-brand-accent" 
                        : "border-brand-border hover:border-brand-soft text-brand-soft"
                    }`}
                  >
                    {days === 7 ? "1 Week" : days === 30 ? "1 Month" : "1 Year"}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || !message}
              className="w-full py-5 bg-brand-text text-brand-bg rounded-xl text-sm uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all disabled:opacity-50 mt-4"
            >
              {isSubmitting ? "Sealing..." : "Seal Capsule"}
            </button>
          </motion.form>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 flex flex-col items-center gap-6"
          >
            <div className="w-16 h-16 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent text-2xl">
              ✨
            </div>
            <h3 className="text-3xl font-serif text-brand-text">Capsule Sealed</h3>
            <p className="text-brand-soft text-balance">
              Your words have been locked in the archive. They will be revealed to the world on <strong>{unlockDateLabel}</strong>.
            </p>
            <button 
              onClick={() => setSuccess(false)}
              className="mt-8 px-6 py-3 border border-brand-border rounded-full text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text hover:border-brand-text transition-colors"
            >
              Write Another
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
