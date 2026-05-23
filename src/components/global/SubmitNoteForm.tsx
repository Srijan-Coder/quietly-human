"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SubmitNoteForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [quote, setQuote] = useState("");
  
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !quote) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/submit-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, quote }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setQuote("");
      
      // Auto-close after a few seconds
      setTimeout(() => {
        setIsOpen(false);
        setStatus("idle");
      }, 5000);

    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message || "Failed to submit note. Please try again later.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-16 mb-24 flex flex-col items-center border-t border-brand-border/50 pt-16">
      
      <span className="text-[10px] uppercase tracking-widest text-brand-soft mb-4">Leave a Trace</span>
      <h2 className="text-3xl font-serif text-brand-text mb-6">Write a Note</h2>
      <p className="text-brand-soft text-center max-w-lg mb-8">
        If you have a thought, a letter, or a blog you'd like to share with the Quietly Humans community, leave it here. It will be sent to the studio for review before being gently placed on this wall.
      </p>

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="px-8 py-3 bg-brand-text text-brand-bg rounded-full text-xs uppercase tracking-widest hover:bg-brand-accent transition-colors"
        >
          Leave a Note
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full overflow-hidden"
          >
            {status === "success" ? (
              <div className="bg-brand-accent/10 border border-brand-accent rounded-2xl p-8 text-center mt-4">
                <span className="text-2xl mb-4 block">💌</span>
                <h3 className="font-serif text-xl text-brand-text mb-2">Note Received safely.</h3>
                <p className="text-brand-soft text-sm">
                  Thank you for sharing your thoughts. Your note has been securely delivered to the studio and is awaiting review.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-brand-card border border-brand-border rounded-2xl p-6 md:p-8 flex flex-col gap-6 mt-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-brand-soft">Your Name *</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-brand-text text-sm focus:outline-none focus:border-brand-accent transition-colors"
                      placeholder="Jane Doe or Anonymous"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-brand-soft">Your Email (Private)</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-brand-text text-sm focus:outline-none focus:border-brand-accent transition-colors"
                      placeholder="Only seen by Srijan"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-brand-soft">Your Note *</label>
                  <textarea 
                    required
                    rows={6}
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    className="bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-brand-text text-sm focus:outline-none focus:border-brand-accent transition-colors resize-none"
                    placeholder="Write your letter, thought, or blog here..."
                  />
                </div>

                {status === "error" && (
                  <p className="text-red-400 text-xs text-center">{errorMessage}</p>
                )}

                <div className="flex justify-end gap-4 mt-2">
                  <button 
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-3 text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={status === "submitting"}
                    className="px-8 py-3 bg-brand-text text-brand-bg rounded-full text-xs uppercase tracking-widest hover:bg-brand-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "submitting" ? "Sending..." : "Submit Note"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
