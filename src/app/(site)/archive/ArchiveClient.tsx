"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, SignInButton } from "@clerk/nextjs";

export default function ArchiveClient() {
  const { isLoaded, isSignedIn } = useAuth();
  const [message, setMessage] = useState("");
  
  // Set default to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [unlockDate, setUnlockDate] = useState(tomorrow.toISOString().split('T')[0]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [unlockDateLabel, setUnlockDateLabel] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !unlockDate) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/capsule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, unlockDate })
      });
      
      const data = await res.json();
      if (data.success) {
        setUnlockDateLabel(new Date(data.unlockDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }));
        setSuccess(true);
        setMessage("");
      } else {
        alert("Failed to seal capsule: " + data.error);
      }
    } catch (error) {
      console.error("Failed to submit capsule");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return <div className="text-center italic font-serif opacity-50 py-10">Checking keys...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="bg-brand-card border border-brand-border rounded-2xl p-10 md:p-16 shadow-sm max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
        <span className="text-4xl grayscale opacity-50">🗝️</span>
        <h3 className="text-2xl font-serif text-brand-text">The Archive is Locked</h3>
        <p className="text-brand-soft leading-relaxed max-w-md">
          Writing to the future is a private act. You must hold a key to leave a capsule in the archive.
        </p>
        <SignInButton mode="modal">
          <button className="mt-4 px-8 py-4 bg-brand-text text-brand-bg rounded-xl text-xs uppercase tracking-widest hover:bg-brand-accent transition-all">
            Sign In to Unlock
          </button>
        </SignInButton>
      </div>
    );
  }

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
              <label className="block text-sm uppercase tracking-widest text-brand-soft mb-4">When should we deliver this to you?</label>
              <input 
                type="date"
                required
                min={tomorrow.toISOString().split('T')[0]} // Cannot pick today or past
                value={unlockDate}
                onChange={(e) => setUnlockDate(e.target.value)}
                className="w-full bg-brand-bg border border-brand-border rounded-xl px-6 py-4 text-brand-text focus:outline-none focus:border-brand-accent transition-colors"
                style={{ colorScheme: 'dark' }} // Ensure date picker matches dark theme
              />
              <p className="text-xs text-brand-soft mt-3 italic">
                We will send you an email with this message on the exact date you choose.
              </p>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || !message || !unlockDate}
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
              Your words have been locked in the archive. We will email it to you on <strong>{unlockDateLabel}</strong>.
            </p>
            <button 
              onClick={() => { setSuccess(false); setMessage(""); }}
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
