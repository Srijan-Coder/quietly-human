"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export interface Letter {
  _id: string;
  title: string;
  slug?: string;
  publishedAt: string;
  guestName?: string;
}

export default function LettersIndex() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchLetters() {
      try {
        const res = await fetch("/api/letters");
        if (res.ok) {
          const data = await res.json();
          setLetters(data);
        }
      } catch {
        // silently fail
      }
    }
    fetchLetters();
  }, []);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "Letters Page" }),
      });

      if (res.ok) {
        setSuccess(true);
        setEmail("");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-4xl mx-auto w-full pb-24">
      <div className="mb-24 text-center">
        <h1 className="text-5xl md:text-6xl font-serif text-brand-text mb-4 text-balance">
          Midnight Letters 💌
        </h1>
        <p className="opacity-60 text-lg max-w-xl mx-auto text-balance">
          An archive of soft words for tired hearts. Originally sent via email. 🕊️
        </p>
      </div>

      <div className="flex flex-col gap-12">
        {letters.filter((letter: Letter) => letter.slug).map((letter: Letter) => (
          <Link 
            href={`/letters/${letter.slug}`} 
            key={letter._id} 
            className="group flex flex-col md:flex-row justify-between items-baseline border-b border-brand-border pb-8 hover:bg-brand-card/50 transition-colors px-6 -mx-6 rounded-xl"
          >
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-brand-text mb-2 group-hover:text-brand-accent transition-colors">
                {letter.title}
              </h2>
              {letter.guestName && (
                <span className="text-[10px] uppercase tracking-widest text-brand-accent">
                  {letter.guestName}
                </span>
              )}
            </div>
            <div className="text-xs uppercase tracking-widest text-brand-soft mt-4 md:mt-0">
              {new Date(letter.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </Link>
        ))}
      </div>

      {letters.length === 0 && (
        <div className="text-center py-20 text-brand-soft italic border border-brand-border rounded-xl mt-12 bg-brand-card">
          The mailbox is currently empty. 📭
        </div>
      )}

      {/* Subscription CTA */}
      <div className="mt-32 p-12 bg-brand-card border border-brand-border rounded-2xl text-center">
        <h3 className="font-serif text-3xl text-brand-text mb-4">Receive the next letter. 🕯️</h3>
        <p className="text-brand-soft mb-8 max-w-md mx-auto">
          Twice a month, I send a gentle reminder that you are allowed to rest. No spam, no pressure.
        </p>
        <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row max-w-md mx-auto gap-4">
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address" 
            className="flex-1 bg-brand-bg border border-brand-border px-6 py-4 rounded-full focus:outline-none focus:border-brand-accent transition-colors text-brand-text placeholder-brand-soft/50"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-4 bg-brand-text text-brand-bg hover:bg-brand-accent hover:text-white transition-colors duration-500 rounded-full text-sm tracking-widest uppercase disabled:opacity-50"
          >
            {loading ? "Sending..." : "Subscribe"}
          </button>
        </form>
        {success && (
          <p className="text-green-500 text-sm mt-4">You&apos;re in. Watch your inbox for the next letter. 💌</p>
        )}
        {error && (
          <p className="text-red-500 text-sm mt-4">{error}</p>
        )}
      </div>
    </div>
  );
}
