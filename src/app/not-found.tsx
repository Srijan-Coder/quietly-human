import Link from "next/link";

export const metadata = { title: "Page Not Found — Quietly Humans" };

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 font-serif relative overflow-hidden bg-brand-bg"
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(201,164,106,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10">
        <p className="text-[10px] uppercase tracking-[0.35em] mb-6 font-sans text-brand-accent">
          404 — lost in the quiet
        </p>

        <h1
          className="font-serif mb-6 leading-none text-brand-text"
          style={{
            fontSize: "clamp(5rem, 20vw, 14rem)",
            background: "linear-gradient(180deg, var(--color-text) 0%, rgba(235,229,223,0.2) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </h1>

        <p className="text-xl md:text-2xl mb-3 text-brand-text">
          This room doesn&apos;t exist.
        </p>
        <p className="text-base mb-12 max-w-sm mx-auto italic leading-relaxed text-brand-soft">
          The page you&apos;re looking for has wandered off into the quiet.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="px-8 py-3.5 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold transition-all hover:scale-105 font-sans bg-brand-text text-brand-bg"
          >
            Return home
          </Link>
          <Link
            href="/reading-room"
            className="px-8 py-3.5 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold transition-all hover:scale-105 font-sans bg-brand-bg text-brand-soft border border-brand-border"
          >
            Reading Room →
          </Link>
        </div>
      </div>
    </div>
  );
}
