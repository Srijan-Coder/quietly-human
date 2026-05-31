"use client";

import { useState } from "react";
import { useReadingMode } from "@/context/ReadingModeContext";
import Link from "next/link";

export default function Footer() {
  const { isReadingMode } = useReadingMode();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'Footer' }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <footer className={`mt-auto py-24 px-6 md:px-12 border-t border-brand-border bg-brand-bg text-brand-text transition-opacity duration-1000 ${isReadingMode ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        
        <div className="flex flex-col gap-4 col-span-1 md:col-span-1">
          <span className="font-serif text-2xl">Quietly Humans Studio</span>
          <span className="text-sm opacity-60 max-w-xs leading-relaxed">
            Books, journals, resets, and digital spaces for people rebuilding quietly.
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-xs tracking-widest uppercase opacity-40">Ecosystem</span>
          <Link href="/reading-room" className="text-sm opacity-80 hover:text-brand-accent transition-colors">The Reading Room</Link>
          <Link href="/pilgrim" className="text-sm opacity-80 hover:text-brand-accent transition-colors">Pilgrim Notes</Link>
          <Link href="/store" className="text-sm opacity-80 hover:text-brand-accent transition-colors">The Quiet Store</Link>
          <Link href="/books" className="text-sm opacity-80 hover:text-brand-accent transition-colors">Books & Journals</Link>
          <Link href="/guides" className="text-sm opacity-80 hover:text-brand-accent transition-colors">Pillar Guides</Link>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-xs tracking-widest uppercase opacity-40">Connect</span>
          <Link href="/dashboard" className="text-sm opacity-80 hover:text-brand-accent transition-colors">Creator Dashboard</Link>
          <Link href="/breathe" className="text-sm opacity-80 hover:text-brand-accent transition-colors">The Breathe Room</Link>
          <Link href="/toolkit" className="text-sm opacity-80 hover:text-brand-accent transition-colors">Soft Toolkit</Link>
          <Link href="/about" className="text-sm opacity-80 hover:text-brand-accent transition-colors">About Srijan</Link>
          <Link href="/contact" className="text-sm opacity-80 hover:text-brand-accent transition-colors">Contact</Link>
        </div>

        <div className="flex flex-col gap-4 col-span-1 md:col-span-1">
          <span className="text-xs tracking-widest uppercase opacity-40">The Letters</span>
          <p className="text-sm opacity-60">Soft words for tired hearts, sent twice a month.</p>
          <form onSubmit={handleSubscribe} className="flex mt-2 border-b border-brand-border pb-2 focus-within:border-brand-accent transition-colors">
            <input 
              type="email" 
              placeholder="Your email address" 
              aria-label="Email for newsletter"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent text-sm w-full outline-none placeholder:text-brand-soft"
            />
            <button type="submit" disabled={status === 'loading'} className="text-xs tracking-widest uppercase opacity-60 hover:text-brand-accent hover:opacity-100 transition-colors disabled:opacity-30">
              {status === 'loading' ? '...' : 'Join'}
            </button>
          </form>
          {status === 'success' && <p className="text-xs text-brand-accent mt-1">Welcome aboard. 💛</p>}
          {status === 'error' && <p className="text-xs text-red-400 mt-1">Something went wrong. Try again?</p>}
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-40 uppercase tracking-widest">
        <span>© {new Date().getFullYear()} Quietly Humans Studio</span>
        <div className="flex gap-4 md:gap-6 flex-wrap justify-center md:justify-end">
          <a href="https://pinterest.com/quietlyhumansspace" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors">Pinterest</a>
          <a href="https://instagram.com/quietlyhumansspace" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors">Instagram</a>
          <a href="https://www.youtube.com/@quietlyhumansspace" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors">YouTube</a>
          <Link href="/about" className="hover:text-brand-accent transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-brand-accent transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-brand-accent transition-colors">Terms</Link>
        </div>
      </div>
      
      <div className="text-center mt-16 opacity-30 hover:opacity-100 transition-opacity duration-1000 flex flex-col items-center gap-6">
        <span className="text-[10px] tracking-[0.2em] uppercase cursor-default">
          Take a deep breath before you close this tab.
        </span>
        <Link href="/heavy" className="font-serif text-sm italic hover:text-brand-accent transition-colors opacity-70">
          When things feel heavy...
        </Link>
      </div>
    </footer>
  );
}
