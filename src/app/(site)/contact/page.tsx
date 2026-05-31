"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/submit-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, source: "Contact Page" }),
      });

      if (res.ok) {
        setSuccess(true);
        setName("");
        setEmail("");
        setMessage("");
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
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-3xl mx-auto w-full pb-24 text-center">
      <div className="mb-16">
        <h1 className="text-5xl md:text-6xl font-serif text-brand-text mb-4">Say Hello</h1>
        <p className="opacity-60 text-lg max-w-xl mx-auto text-balance">
          Whether you want to collaborate, share a quiet thought, or just say hi.
        </p>
      </div>

      {success && (
        <div className="mb-8 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-500 text-sm">
          Your message has been sent. We&apos;ll get back to you quietly. 🕊️
        </div>
      )}

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 text-left">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-xs uppercase tracking-widest opacity-60">Name</label>
          <input 
            type="text" 
            id="name" 
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent border-b border-brand-border py-2 focus:outline-none focus:border-brand-accent transition-colors text-brand-text placeholder-brand-soft/50" 
            placeholder="Your name" 
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-xs uppercase tracking-widest opacity-60">Email</label>
          <input 
            type="email" 
            id="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-b border-brand-border py-2 focus:outline-none focus:border-brand-accent transition-colors text-brand-text placeholder-brand-soft/50" 
            placeholder="your@email.com" 
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="text-xs uppercase tracking-widest opacity-60">Message</label>
          <textarea 
            id="message" 
            rows={5} 
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-transparent border-b border-brand-border py-2 focus:outline-none focus:border-brand-accent transition-colors resize-none text-brand-text placeholder-brand-soft/50" 
            placeholder="What's on your mind?"
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="mt-8 px-8 py-4 bg-brand-text text-brand-bg hover:bg-brand-accent hover:text-white transition-colors duration-500 rounded-full text-sm tracking-widest uppercase w-max mx-auto disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
