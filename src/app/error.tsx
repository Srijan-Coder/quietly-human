"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 font-serif relative overflow-hidden"
      style={{ background: "var(--color-bg, #0d0d0d)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 50% 40% at 50% 30%, rgba(239,68,68,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10">
        <p className="text-[10px] uppercase tracking-[0.35em] mb-6 font-sans" style={{ color: "var(--color-soft, #A39E99)" }}>
          Something went quiet
        </p>

        <h1
          className="font-serif text-5xl md:text-7xl mb-6"
          style={{ color: "var(--color-text, #EBE5DF)" }}
        >
          An unexpected silence.
        </h1>

        <p className="text-base mb-12 max-w-sm mx-auto italic leading-relaxed" style={{ color: "var(--color-soft, #A39E99)" }}>
          Something broke in the sanctuary. It happens to the best of us.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="px-8 py-3.5 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold transition-all hover:scale-105 font-sans"
            style={{ background: "var(--color-text, #EBE5DF)", color: "var(--color-bg, #0d0d0d)" }}
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-8 py-3.5 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold transition-all hover:scale-105 font-sans"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--color-soft, #A39E99)",
            }}
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
