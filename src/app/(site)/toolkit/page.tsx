import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Soft Toolkit — Quietly Humans",
  description: "Interactive tools designed to dissolve anxiety, organize thoughts, and bring stillness to a chaotic mind.",
};

export default function ToolkitHub() {
  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-5xl mx-auto w-full pb-24">
      <header className="mb-24 text-center">
        <span className="text-xs uppercase tracking-widest text-brand-accent mb-4 block">Interactive</span>
        <h1 className="text-5xl md:text-7xl font-serif text-brand-text mb-6">Soft Toolkit 🧰</h1>
        <p className="text-brand-soft text-lg max-w-2xl mx-auto text-balance">
          Small, beautiful tools designed to intercept overthinking and guide you back to the present moment.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Tool 1: Worry Dissolver */}
        <Link 
          href="/toolkit/worry-dissolver" 
          className="group block bg-brand-card border border-brand-border rounded-2xl p-8 hover:border-brand-accent transition-colors relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">🌫️</span>
          </div>
          <div className="text-3xl mb-6 relative z-10">🌫️</div>
          <h2 className="font-serif text-2xl text-brand-text mb-4 group-hover:text-brand-accent transition-colors relative z-10">
            Worry Dissolver
          </h2>
          <p className="text-brand-soft text-sm mb-8 relative z-10">
            Type out what is weighing heavy on your mind, and watch it turn to smoke. A private exercise in letting go.
          </p>
          <span className="text-xs uppercase tracking-widest text-brand-text group-hover:text-brand-accent transition-colors relative z-10">
            Open Tool →
          </span>
        </Link>

        {/* Tool 2: The Daily Anchor */}
        <Link 
          href="/toolkit/daily-anchor" 
          className="group block bg-brand-card border border-brand-border rounded-2xl p-8 hover:border-brand-accent transition-colors relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">🪨</span>
          </div>
          <div className="text-3xl mb-6 relative z-10 grayscale group-hover:grayscale-0 transition-all">🪨</div>
          <h2 className="font-serif text-2xl text-brand-text mb-4 group-hover:text-brand-accent transition-colors relative z-10">
            The Daily Anchor
          </h2>
          <p className="text-brand-soft text-sm mb-8 relative z-10">
            Set a single word as your intention for the day, carved into digital stone.
          </p>
          <span className="text-xs uppercase tracking-widest text-brand-text group-hover:text-brand-accent transition-colors relative z-10">
            Open Tool →
          </span>
        </Link>

        {/* Tool 3: Panic Redirector */}
        <Link 
          href="/toolkit/panic-redirector" 
          className="group block bg-brand-card border border-brand-border rounded-2xl p-8 hover:border-brand-accent transition-colors relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">🕰️</span>
          </div>
          <div className="text-3xl mb-6 relative z-10 grayscale group-hover:grayscale-0 transition-all">🕰️</div>
          <h2 className="font-serif text-2xl text-brand-text mb-4 group-hover:text-brand-accent transition-colors relative z-10">
            Panic Redirector
          </h2>
          <p className="text-brand-soft text-sm mb-8 relative z-10">
            A guided visual exercise to break thought spirals using the 5-4-3-2-1 clinical grounding method.
          </p>
          <span className="text-xs uppercase tracking-widest text-brand-text group-hover:text-brand-accent transition-colors relative z-10">
            Open Tool →
          </span>
        </Link>

        {/* Tool 4: The Brain Dump */}
        <Link 
          href="/toolkit/brain-dump" 
          className="group block bg-brand-card border border-brand-border rounded-2xl p-8 hover:border-brand-accent transition-colors relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">🗑️</span>
          </div>
          <div className="text-3xl mb-6 relative z-10 grayscale group-hover:grayscale-0 transition-all">🗑️</div>
          <h2 className="font-serif text-2xl text-brand-text mb-4 group-hover:text-brand-accent transition-colors relative z-10">
            The Brain Dump
          </h2>
          <p className="text-brand-soft text-sm mb-8 relative z-10">
            An unreadable canvas. Type everything that is overwhelming you. It blurs out instantly. Wipe it clean when you are done.
          </p>
          <span className="text-xs uppercase tracking-widest text-brand-text group-hover:text-brand-accent transition-colors relative z-10">
            Open Tool →
          </span>
        </Link>

        {/* Tool 5: The Decision Coin */}
        <Link 
          href="/toolkit/decision-coin" 
          className="group block bg-brand-card border border-brand-border rounded-2xl p-8 hover:border-brand-accent transition-colors relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">🪙</span>
          </div>
          <div className="text-3xl mb-6 relative z-10 grayscale group-hover:grayscale-0 transition-all">🪙</div>
          <h2 className="font-serif text-2xl text-brand-text mb-4 group-hover:text-brand-accent transition-colors relative z-10">
            The Decision Coin
          </h2>
          <p className="text-brand-soft text-sm mb-8 relative z-10">
            For chronic overthinkers. Type your dilemma and let the universe give you a definitive answer. Commit to it.
          </p>
          <span className="text-xs uppercase tracking-widest text-brand-text group-hover:text-brand-accent transition-colors relative z-10">
            Open Tool →
          </span>
        </Link>

        {/* Tool 6: The Control Sorter */}
        <Link 
          href="/toolkit/control-sorter" 
          className="group block bg-brand-card border border-brand-border rounded-2xl p-8 hover:border-brand-accent transition-colors relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">⚖️</span>
          </div>
          <div className="text-3xl mb-6 relative z-10 grayscale group-hover:grayscale-0 transition-all">⚖️</div>
          <h2 className="font-serif text-2xl text-brand-text mb-4 group-hover:text-brand-accent transition-colors relative z-10">
            The Control Sorter
          </h2>
          <p className="text-brand-soft text-sm mb-8 relative z-10">
            A visual exercise in the Dichotomy of Control. Sort your anxieties, and watch the uncontrollable ones disintegrate.
          </p>
          <span className="text-xs uppercase tracking-widest text-brand-text group-hover:text-brand-accent transition-colors relative z-10">
            Open Tool →
          </span>
        </Link>

        {/* Tool 7: Leaves on a Stream */}
        <Link 
          href="/toolkit/leaves-on-stream" 
          className="group block bg-brand-card border border-brand-border rounded-2xl p-8 hover:border-brand-accent transition-colors relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">🍃</span>
          </div>
          <div className="text-3xl mb-6 relative z-10 grayscale group-hover:grayscale-0 transition-all">🍃</div>
          <h2 className="font-serif text-2xl text-brand-text mb-4 group-hover:text-brand-accent transition-colors relative z-10">
            Leaves on a Stream
          </h2>
          <p className="text-brand-soft text-sm mb-8 relative z-10">
            An Acceptance and Commitment Therapy (ACT) exercise. Place intrusive thoughts on a leaf and watch them float away.
          </p>
          <span className="text-xs uppercase tracking-widest text-brand-text group-hover:text-brand-accent transition-colors relative z-10">
            Open Tool →
          </span>
        </Link>

        {/* Tool 8: The View From Above */}
        <Link 
          href="/toolkit/view-from-above" 
          className="group block bg-brand-card border border-brand-border rounded-2xl p-8 hover:border-brand-accent transition-colors relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">🔭</span>
          </div>
          <div className="text-3xl mb-6 relative z-10 grayscale group-hover:grayscale-0 transition-all">🔭</div>
          <h2 className="font-serif text-2xl text-brand-text mb-4 group-hover:text-brand-accent transition-colors relative z-10">
            The View From Above
          </h2>
          <p className="text-brand-soft text-sm mb-8 relative z-10">
            A Stoic visualization. Type a localized stressor, and smoothly zoom out to cosmic scale to put it in perspective.
          </p>
          <span className="text-xs uppercase tracking-widest text-brand-text group-hover:text-brand-accent transition-colors relative z-10">
            Open Tool →
          </span>
        </Link>

      </div>
    </div>
  );
}
