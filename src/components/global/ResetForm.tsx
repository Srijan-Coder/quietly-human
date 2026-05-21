"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ResetForm({ settings }: { settings: any }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, source: "7-Day Reset" }),
      });

      if (!res.ok) throw new Error("Failed to subscribe");

      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const successMessage = settings?.successMessage || "Your 7-Day Reset has begun. Access your resources below.";
  const notionLink = settings?.notionLink || "https://notion.so";
  const driveLink = settings?.driveLink || "https://drive.google.com";

  return (
    <div className="max-w-md mx-auto bg-brand-card p-12 rounded-2xl border border-brand-border shadow-sm relative min-h-[400px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        
        {status !== "success" && (
          <motion.form 
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6 w-full" 
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col text-left gap-2">
              <label className="text-xs uppercase tracking-widest opacity-60">First Name</label>
              <input 
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="What should we call you?"
                className="bg-transparent border-b border-brand-border pb-2 outline-none focus:border-brand-accent transition-colors w-full" 
                disabled={status === "loading"}
              />
            </div>
            <div className="flex flex-col text-left gap-2 mb-4">
              <label className="text-xs uppercase tracking-widest opacity-60">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Where should we send the reset?"
                className="bg-transparent border-b border-brand-border pb-2 outline-none focus:border-brand-accent transition-colors w-full" 
                disabled={status === "loading"}
              />
            </div>
            <button 
              type="submit"
              disabled={status === "loading"}
              className="w-full py-4 bg-brand-text text-brand-bg hover:bg-brand-accent hover:text-white transition-colors duration-500 rounded-full text-sm tracking-widest uppercase relative overflow-hidden"
            >
              {status === "loading" ? (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  Sending gently...
                </motion.div>
              ) : (
                "Start the Reset"
              )}
            </button>
            
            {status === "error" && (
              <p className="text-red-500 text-xs mt-2">Something went wrong. Please try again.</p>
            )}

            <p className="text-xs opacity-40 mt-2">By joining, you will also receive the bi-weekly Letters for Tired Hearts.</p>
          </motion.form>
        )}

        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center w-full"
          >
            {/* Animated Checkmark Cartoon */}
            <svg className="w-24 h-24 mb-6" viewBox="0 0 100 100">
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-brand-accent"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
              <motion.path
                d="M30 50 L45 65 L70 35"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-brand-text"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
              />
            </svg>

            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="font-serif text-xl md:text-2xl text-brand-text mb-8 text-balance italic"
            >
              {successMessage}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 1 }}
              className="flex flex-col gap-4 w-full"
            >
              <a 
                href={notionLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 border border-brand-border text-brand-text hover:border-brand-accent hover:text-brand-accent transition-colors rounded-full text-xs tracking-widest uppercase"
              >
                Open Notion Template
              </a>
              <a 
                href={driveLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 border border-brand-border text-brand-text hover:border-brand-accent hover:text-brand-accent transition-colors rounded-full text-xs tracking-widest uppercase"
              >
                Access Google Drive
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
