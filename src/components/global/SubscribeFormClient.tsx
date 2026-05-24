"use client";

import { useState } from "react";

export default function SubscribeFormClient({
  creatorId,
  creatorName,
}: {
  creatorId: string;
  creatorName: string;
}) {
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
        body: JSON.stringify({ creatorId, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to subscribe");
      setStatus("success");
      setMessage(data.message || "Subscribed!");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "An error occurred");
    }
  };

  if (status === "success") {
    return (
      <div className="w-full py-5 px-6 rounded-2xl text-center animate-fade-in-up"
        style={{ background: "rgba(201,164,106,0.08)", border: "1px solid rgba(201,164,106,0.2)" }}>
        <span className="text-2xl block mb-2">💌</span>
        <p className="font-serif text-white/75 text-sm">
          You're on the list. Letters from <em>{creatorName}</em> will arrive in your inbox.
        </p>
      </div>
    );
  }

  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-sans text-center">
          Subscribe to {creatorName}
        </p>
      </div>
      <form onSubmit={handleSubscribe} className="p-4 flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === "loading"}
          className="flex-1 rounded-xl px-4 py-3 text-sm outline-none transition-all font-sans disabled:opacity-50"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.8)",
          }}
        />
        <button
          type="submit"
          disabled={status === "loading" || !email}
          className="px-6 py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          style={{ background: "rgba(201,164,106,0.85)", color: "#0d0d0d" }}
        >
          {status === "loading" ? "…" : "Subscribe"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-red-400/70 text-xs px-6 pb-4 text-center font-sans">{message}</p>
      )}
    </div>
  );
}
