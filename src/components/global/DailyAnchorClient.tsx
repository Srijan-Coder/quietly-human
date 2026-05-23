"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function DailyAnchorClient() {
  const { user, isLoaded } = useUser();
  const [anchor, setAnchor] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isClient, setIsClient] = useState(false);
  
  // Time Travel Features
  const [wantsEmail, setWantsEmail] = useState(false);
  const [wantsNotify, setWantsNotify] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [targetTime, setTargetTime] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedAnchor = localStorage.getItem("qh_daily_anchor");
    const savedDate = localStorage.getItem("qh_daily_anchor_date");
    const today = new Date().toDateString();

    if (savedAnchor && savedDate === today) {
      setAnchor(savedAnchor);
    } else {
      localStorage.removeItem("qh_daily_anchor");
      localStorage.removeItem("qh_daily_anchor_date");
    }

    // Set default date to today, time to +1 hour
    const now = new Date();
    setTargetDate(now.toISOString().split('T')[0]);
    now.setHours(now.getHours() + 1);
    setTargetTime(now.toTimeString().slice(0,5));
  }, []);

  const handleSetAnchor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const word = inputValue.trim().toLowerCase();
    
    // Request local notification permission if requested
    if (wantsNotify && "Notification" in window) {
      if (Notification.permission !== "granted") {
        await Notification.requestPermission();
      }
    }

    // Schedule Email via API
    if (wantsEmail) {
      const emailToSendTo = user?.primaryEmailAddress?.emailAddress || emailInput;
      if (emailToSendTo && targetDate && targetTime) {
        setIsScheduling(true);
        try {
          // Combine date and time
          const scheduledDate = new Date(`${targetDate}T${targetTime}:00`);
          
          await fetch('/api/anchor/schedule', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              word,
              email: emailToSendTo,
              timestamp: scheduledDate.getTime(),
            })
          });
        } catch (error) {
          console.error("Failed to schedule email", error);
        } finally {
          setIsScheduling(false);
        }
      }
    }

    // If local notification is requested, set a basic timeout (only works if tab is open)
    if (wantsNotify && "Notification" in window && Notification.permission === "granted") {
      const scheduledDate = new Date(`${targetDate}T${targetTime}:00`);
      const delay = scheduledDate.getTime() - Date.now();
      if (delay > 0 && delay < 2147483647) { // max setTimeout is ~24 days
        setTimeout(() => {
          new Notification("Quietly Humans", {
            body: `Return to your anchor: ${word}`,
            icon: "/favicon.ico"
          });
        }, delay);
      }
    }

    setAnchor(word);
    localStorage.setItem("qh_daily_anchor", word);
    localStorage.setItem("qh_daily_anchor_date", new Date().toDateString());
  };

  const handleReset = () => {
    setAnchor("");
    setInputValue("");
    setWantsEmail(false);
    setWantsNotify(false);
    localStorage.removeItem("qh_daily_anchor");
    localStorage.removeItem("qh_daily_anchor_date");
  };

  if (!isClient) return null;

  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-6">
      {!anchor ? (
        <motion.div
          key="input"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex flex-col items-center"
        >
          <div className="text-4xl mb-8 grayscale opacity-50">🪨</div>
          <h2 className="font-serif text-2xl md:text-4xl text-brand-text mb-4 text-center text-balance">
            Set your anchor.
          </h2>
          <p className="text-brand-soft text-sm uppercase tracking-widest text-center mb-12">
            A single word to return to when the mind wanders.
          </p>
          
          <form onSubmit={handleSetAnchor} className="w-full max-w-sm flex flex-col items-center gap-6">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g., breathe, focus, stillness"
              maxLength={20}
              className="w-full bg-transparent border-b border-brand-border/50 text-brand-text font-serif text-2xl p-4 focus:outline-none focus:border-brand-accent text-center placeholder:text-brand-soft/30 lowercase"
              autoFocus
            />

            {/* Reminder Options */}
            <div className="w-full mt-6 flex flex-col gap-4 border border-brand-border rounded-2xl p-6 bg-brand-card/50">
              <span className="text-[10px] uppercase tracking-widest text-brand-soft">Remind me later</span>
              
              <div className="flex gap-4 items-center">
                <input 
                  type="date" 
                  value={targetDate}
                  onChange={e => setTargetDate(e.target.value)}
                  className="bg-brand-bg border border-brand-border rounded px-3 py-2 text-xs text-brand-text focus:border-brand-accent focus:outline-none"
                />
                <input 
                  type="time" 
                  value={targetTime}
                  onChange={e => setTargetTime(e.target.value)}
                  className="bg-brand-bg border border-brand-border rounded px-3 py-2 text-xs text-brand-text focus:border-brand-accent focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${wantsNotify ? 'bg-brand-text border-brand-text' : 'border-brand-border group-hover:border-brand-accent'}`}>
                    {wantsNotify && <span className="text-brand-bg text-[10px]">✓</span>}
                  </div>
                  <span className="text-xs text-brand-soft">Browser Push Notification (keep tab open)</span>
                  <input type="checkbox" className="hidden" checked={wantsNotify} onChange={() => setWantsNotify(!wantsNotify)} />
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${wantsEmail ? 'bg-brand-text border-brand-text' : 'border-brand-border group-hover:border-brand-accent'}`}>
                    {wantsEmail && <span className="text-brand-bg text-[10px]">✓</span>}
                  </div>
                  <span className="text-xs text-brand-soft">Send me an Email</span>
                  <input type="checkbox" className="hidden" checked={wantsEmail} onChange={() => setWantsEmail(!wantsEmail)} />
                </label>
              </div>

              <AnimatePresence>
                {wantsEmail && !user && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <input
                      type="email"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      placeholder="Your email address"
                      className="w-full mt-2 bg-brand-bg border border-brand-border rounded-lg px-4 py-2 text-sm text-brand-text focus:border-brand-accent focus:outline-none placeholder:text-brand-soft/50"
                      required
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              disabled={!inputValue.trim() || isScheduling}
              className="mt-6 px-8 py-3 w-full border border-brand-border rounded-full text-xs uppercase tracking-widest text-brand-soft hover:text-brand-accent hover:border-brand-accent transition-colors disabled:opacity-30 disabled:hover:border-brand-border disabled:hover:text-brand-soft"
            >
              {isScheduling ? "Carving..." : "Carve into stone"}
            </button>
          </form>
        </motion.div>
      ) : (
        <motion.div
          key="stone"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="flex flex-col items-center w-full"
        >
          <p className="text-brand-soft text-xs uppercase tracking-widest text-center mb-12">
            Your anchor
          </p>
          
          <div className="w-full py-16 px-4 flex items-center justify-center bg-brand-bg/50 rounded-3xl border border-brand-border shadow-[inset_0_10px_30px_rgba(0,0,0,0.5)]">
            <h1 
              className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-center uppercase"
              style={{
                color: 'transparent',
                textShadow: '0px 2px 3px rgba(255,255,255,0.1), 0px -2px 3px rgba(0,0,0,0.8)',
                WebkitTextStroke: '1px rgba(0,0,0,0.3)',
              }}
            >
              {anchor}
            </h1>
          </div>

          <div className="mt-16 flex gap-4">
            <button
              onClick={handleReset}
              className="px-6 py-2 border border-brand-border rounded-full text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors"
            >
              Shatter & Reset
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
