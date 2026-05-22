"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WaitlistPage({ params }: { params: { product: string } }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const productName = params.product.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");
    
    // Simulate API call for now. User can connect this to Sanity subscribers later.
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-brand-card border border-brand-border p-10 rounded-2xl shadow-xl text-center">
        <span className="text-xs uppercase tracking-widest text-brand-accent mb-4 block">Coming Soon</span>
        <h1 className="text-3xl font-serif text-brand-text mb-4">{productName}</h1>
        <p className="text-brand-soft text-sm leading-relaxed mb-8">
          Leave your email to be gently notified when this arrives. No spam, only soft updates.
        </p>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-8"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-accent/10 flex items-center justify-center border border-brand-accent">
                <svg className="w-8 h-8 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-serif text-xl text-brand-text">You're on the list.</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="w-full px-5 py-4 bg-brand-bg border border-brand-border rounded-xl focus:outline-none focus:border-brand-accent text-brand-text placeholder:text-brand-soft/50 transition-colors"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full px-5 py-4 bg-brand-text text-brand-bg rounded-xl text-xs uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-colors disabled:opacity-50"
              >
                {status === "loading" ? "Joining..." : "Join Waitlist"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
