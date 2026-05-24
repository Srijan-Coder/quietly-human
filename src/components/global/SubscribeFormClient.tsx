"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function SubscribeFormClient({ creatorId, creatorName }: { creatorId: string, creatorName: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/creator-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatorId, email })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to subscribe");
      
      setStatus("success");
      setMessage(data.message || "Subscribed successfully!");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "An error occurred");
    }
  };

  if (status === "success") {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="w-full bg-brand-accent/10 border border-brand-accent/30 p-6 rounded-2xl text-center flex flex-col items-center justify-center min-h-[160px]"
      >
        <span className="text-3xl mb-2">💌</span>
        <h3 className="font-serif text-brand-text text-xl mb-1">You are on the list.</h3>
        <p className="text-brand-soft text-sm">You will receive letters from {creatorName} directly in your inbox.</p>
      </motion.div>
    );
  }

  return (
    <div className="w-full bg-brand-card/50 border border-brand-border p-6 rounded-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="font-serif text-xl text-brand-text mb-1 flex items-center gap-2">
            <span>Subscribe to {creatorName}</span>
            <span className="text-lg">💌</span>
          </h3>
          <p className="text-brand-soft text-sm font-sans">
            Receive free essays, updates, and midnight letters directly in your inbox.
          </p>
        </div>
        
        <form onSubmit={handleSubscribe} className="flex w-full md:w-auto relative max-w-sm shrink-0">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={status === "loading"}
            className="w-full bg-brand-bg border border-brand-border rounded-full pl-6 pr-32 py-3 text-sm focus:outline-none focus:border-brand-accent transition-colors disabled:opacity-50 text-brand-text placeholder:text-brand-soft/50"
          />
          <button
            type="submit"
            disabled={status === "loading" || !email}
            className="absolute right-1 top-1 bottom-1 bg-brand-accent text-white px-6 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-brand-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </form>
      </div>
      {status === "error" && (
        <p className="text-red-400 text-xs mt-4 text-center">{message}</p>
      )}
    </div>
  );
}
