"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import { useCollection } from "@/hooks/useCollection";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

interface SaveButtonProps {
  item: {
    id: string;
    title: string;
    url: string;
    type: "Letter" | "Guide" | "Thought" | "Book" | "letter" | "post" | "book" | "product" | "guide";
  };
  className?: string;
}

export function SaveButton({ item, className = "" }: SaveButtonProps) {
  const { isSaved, saveItem, removeItem } = useCollection();
  const { user, isSignedIn } = useUser();
  
  const [mounted, setMounted] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => setMounted(true), []);

  if (!mounted) return <button className={`opacity-0 ${className}`}>Save</button>;

  const saved = isSaved(item.id);

  const toggleSave = () => {
    if (saved) {
      removeItem(item.id);
      setShowEmailPrompt(false);
    } else {
      saveItem(item as any);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
      
      // Only show email prompt if they are signed in (we need their email)
      if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
        setShowEmailPrompt(true);
      }
    }
  };

  const handleSendEmail = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    
    setEmailStatus("sending");
    try {
      const res = await fetch("/api/email/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "save",
          title: item.title,
          url: item.url,
          userEmail: user.primaryEmailAddress.emailAddress,
        }),
      });

      if (res.ok) {
        setEmailStatus("sent");
        setTimeout(() => setShowEmailPrompt(false), 4000);
      } else {
        setEmailStatus("error");
        setTimeout(() => setEmailStatus("idle"), 3000);
      }
    } catch (e) {
      setEmailStatus("error");
      setTimeout(() => setEmailStatus("idle"), 3000);
    }
  };

  return (
    <div className="relative flex flex-col items-end">
      <button
        onClick={toggleSave}
        className={`group flex items-center gap-2 text-xs uppercase tracking-widest transition-colors ${
          saved ? "text-brand-accent" : "text-brand-soft hover:text-brand-text"
        } ${className}`}
      >
        <motion.div animate={justSaved ? { scale: [1, 1.2, 1] } : {}}>
          {saved ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          )}
        </motion.div>
        <span>{saved ? "Saved" : "Save to Collection"}</span>
      </button>

      <AnimatePresence>
        {showEmailPrompt && emailStatus !== "sent" && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-full mt-4 right-0 bg-brand-card border border-brand-border rounded-lg p-4 shadow-xl z-50 w-64 text-left"
          >
            <p className="text-xs text-brand-text mb-3 leading-relaxed">
              Added to collection. Want a direct link sent to your email?
            </p>
            <div className="flex gap-2">
              <button 
                onClick={handleSendEmail}
                disabled={emailStatus === "sending"}
                className="flex-1 py-1.5 bg-brand-text text-brand-bg text-[10px] uppercase tracking-widest rounded disabled:opacity-50 hover:bg-brand-accent transition-colors"
              >
                {emailStatus === "sending" ? "Sending..." : "Yes, send link"}
              </button>
              <button 
                onClick={() => setShowEmailPrompt(false)}
                className="px-3 py-1.5 border border-brand-border text-brand-soft text-[10px] uppercase tracking-widest rounded hover:text-brand-text transition-colors"
              >
                No
              </button>
            </div>
            {emailStatus === "error" && <p className="text-red-400 text-[10px] mt-2">Error sending email.</p>}
          </motion.div>
        )}

        {showEmailPrompt && emailStatus === "sent" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-full mt-4 right-0 text-[10px] text-brand-accent uppercase tracking-widest whitespace-nowrap"
          >
            ✓ Sent to your inbox.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
