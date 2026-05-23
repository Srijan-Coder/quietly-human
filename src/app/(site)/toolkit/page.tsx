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

        {/* Placeholder for Tool 2 */}
        <div className="block bg-brand-card/50 border border-brand-border border-dashed rounded-2xl p-8 opacity-60">
          <div className="text-3xl mb-6 grayscale">🪨</div>
          <h2 className="font-serif text-2xl text-brand-soft mb-4">
            The Daily Anchor
          </h2>
          <p className="text-brand-soft text-sm mb-8">
            Set a single word as your intention for the day, carved into digital stone.
          </p>
          <span className="text-[10px] uppercase tracking-widest text-brand-soft bg-brand-bg px-3 py-1 rounded-full border border-brand-border">
            Coming Soon
          </span>
        </div>

        {/* Placeholder for Tool 3 */}
        <div className="block bg-brand-card/50 border border-brand-border border-dashed rounded-2xl p-8 opacity-60">
          <div className="text-3xl mb-6 grayscale">🕰️</div>
          <h2 className="font-serif text-2xl text-brand-soft mb-4">
            Panic Redirector
          </h2>
          <p className="text-brand-soft text-sm mb-8">
            A guided visual and audio exercise to break thought spirals using the 5-4-3-2-1 grounding method.
          </p>
          <span className="text-[10px] uppercase tracking-widest text-brand-soft bg-brand-bg px-3 py-1 rounded-full border border-brand-border">
            In Development
          </span>
        </div>

      </div>
    </div>
  );
}
