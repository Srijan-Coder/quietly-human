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

        {/* Tool 9: The Task Atomizer */}
        <Link 
          href="/toolkit/task-atomizer" 
          className="group block bg-brand-card border border-brand-border rounded-2xl p-8 hover:border-brand-accent transition-colors relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">🔨</span>
          </div>
          <div className="text-3xl mb-6 relative z-10 grayscale group-hover:grayscale-0 transition-all">🔨</div>
          <h2 className="font-serif text-2xl text-brand-text mb-4 group-hover:text-brand-accent transition-colors relative z-10">
            The Task Atomizer
          </h2>
          <p className="text-brand-soft text-sm mb-8 relative z-10">
            For task paralysis. Shatter an overwhelming task into micro-steps, and enter a hyper-focus mode that hides everything but the very next step.
          </p>
          <span className="text-xs uppercase tracking-widest text-brand-text group-hover:text-brand-accent transition-colors relative z-10">
            Open Tool →
          </span>
        </Link>

        {/* Tool 10: The Air Lock */}
        <Link 
          href="/toolkit/air-lock" 
          className="group block bg-brand-card border border-brand-border rounded-2xl p-8 hover:border-brand-accent transition-colors relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">🚪</span>
          </div>
          <div className="text-3xl mb-6 relative z-10 grayscale group-hover:grayscale-0 transition-all">🚪</div>
          <h2 className="font-serif text-2xl text-brand-text mb-4 group-hover:text-brand-accent transition-colors relative z-10">
            The Air Lock
          </h2>
          <p className="text-brand-soft text-sm mb-8 relative z-10">
            A digital decompression chamber. A guided 2-minute transition to help you mentally disconnect from work before entering rest mode.
          </p>
          <span className="text-xs uppercase tracking-widest text-brand-text group-hover:text-brand-accent transition-colors relative z-10">
            Open Tool →
          </span>
        </Link>

        {/* Tool 11: The Dopamine Menu */}
        <Link 
          href="/toolkit/dopamine-menu" 
          className="group block bg-brand-card border border-brand-border rounded-2xl p-8 hover:border-brand-accent transition-colors relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">🍽️</span>
          </div>
          <div className="text-3xl mb-6 relative z-10 grayscale group-hover:grayscale-0 transition-all">🍽️</div>
          <h2 className="font-serif text-2xl text-brand-text mb-4 group-hover:text-brand-accent transition-colors relative z-10">
            The Dopamine Menu
          </h2>
          <p className="text-brand-soft text-sm mb-8 relative z-10">
            When you feel the urge to doomscroll, consult your menu. Get a random "Chef's Recommendation" for healthy, low-friction stimulation.
          </p>
          <span className="text-xs uppercase tracking-widest text-brand-text group-hover:text-brand-accent transition-colors relative z-10">
            Open Tool →
          </span>
        </Link>

        {/* Tool 12: The Energy Battery */}
        <Link 
          href="/toolkit/energy-battery" 
          className="group block bg-brand-card border border-brand-border rounded-2xl p-8 hover:border-brand-accent transition-colors relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">🔋</span>
          </div>
          <div className="text-3xl mb-6 relative z-10 grayscale group-hover:grayscale-0 transition-all">🔋</div>
          <h2 className="font-serif text-2xl text-brand-text mb-4 group-hover:text-brand-accent transition-colors relative z-10">
            The Energy Battery
          </h2>
          <p className="text-brand-soft text-sm mb-8 relative z-10">
            Manage your daily capacity based on Spoon Theory. Set your energy level, assign costs to tasks, and prevent burnout before it happens.
          </p>
          <span className="text-xs uppercase tracking-widest text-brand-text group-hover:text-brand-accent transition-colors relative z-10">
            Open Tool →
          </span>
        </Link>

        {/* Tool 13: The Cognitive Courtroom */}
        <Link 
          href="/toolkit/cognitive-courtroom" 
          className="group block bg-brand-card border border-brand-border rounded-2xl p-8 hover:border-brand-accent transition-colors relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">⚖️</span>
          </div>
          <div className="text-3xl mb-6 relative z-10 grayscale group-hover:grayscale-0 transition-all">⚖️</div>
          <h2 className="font-serif text-2xl text-brand-text mb-4 group-hover:text-brand-accent transition-colors relative z-10">
            The Cognitive Courtroom
          </h2>
          <p className="text-brand-soft text-sm mb-8 relative z-10">
            For catastrophizing. Put your anxious thoughts on trial by stripping away the story and extracting only the cold, hard facts.
          </p>
          <span className="text-xs uppercase tracking-widest text-brand-text group-hover:text-brand-accent transition-colors relative z-10">
            Open Tool →
          </span>
        </Link>

        {/* Tool 14: Urge Surfing */}
        <Link 
          href="/toolkit/urge-surfer" 
          className="group block bg-brand-card border border-brand-border rounded-2xl p-8 hover:border-brand-accent transition-colors relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">🌊</span>
          </div>
          <div className="text-3xl mb-6 relative z-10 grayscale group-hover:grayscale-0 transition-all">🌊</div>
          <h2 className="font-serif text-2xl text-brand-text mb-4 group-hover:text-brand-accent transition-colors relative z-10">
            Urge Surfing
          </h2>
          <p className="text-brand-soft text-sm mb-8 relative z-10">
            A DBT tool for cravings and impulses. Watch a visual 5-minute wave and log your urge intensity in real-time until it breaks.
          </p>
          <span className="text-xs uppercase tracking-widest text-brand-text group-hover:text-brand-accent transition-colors relative z-10">
            Open Tool →
          </span>
        </Link>

        {/* Tool 15: The Yes, But Flipper */}
        <Link 
          href="/toolkit/yes-but-flipper" 
          className="group block bg-brand-card border border-brand-border rounded-2xl p-8 hover:border-brand-accent transition-colors relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">🃏</span>
          </div>
          <div className="text-3xl mb-6 relative z-10 grayscale group-hover:grayscale-0 transition-all">🃏</div>
          <h2 className="font-serif text-2xl text-brand-text mb-4 group-hover:text-brand-accent transition-colors relative z-10">
            The "Yes, But" Flipper
          </h2>
          <p className="text-brand-soft text-sm mb-8 relative z-10">
            Combat black-and-white thinking. Write an absolute negative thought on a digital card, flip it over, and force your brain to find the nuance.
          </p>
          <span className="text-xs uppercase tracking-widest text-brand-text group-hover:text-brand-accent transition-colors relative z-10">
            Open Tool →
          </span>
        </Link>

        {/* Tool 16: Emotion Color Wheel */}
        <Link 
          href="/toolkit/emotion-color-wheel" 
          className="group block bg-brand-card border border-brand-border rounded-2xl p-8 hover:border-brand-accent transition-colors relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">🎨</span>
          </div>
          <div className="text-3xl mb-6 relative z-10 grayscale group-hover:grayscale-0 transition-all">🎨</div>
          <h2 className="font-serif text-2xl text-brand-text mb-4 group-hover:text-brand-accent transition-colors relative z-10">
            Emotion Color Wheel
          </h2>
          <p className="text-brand-soft text-sm mb-8 relative z-10">
            For alexithymia. Drill down into an interactive color wheel to find the exact word for what you're feeling, and get a micro-action to cope.
          </p>
          <span className="text-xs uppercase tracking-widest text-brand-text group-hover:text-brand-accent transition-colors relative z-10">
            Open Tool →
          </span>
        </Link>

        {/* Tool 17: The Friction Generator */}
        <Link 
          href="/toolkit/friction-generator" 
          className="group block bg-brand-card border border-brand-border rounded-2xl p-8 hover:border-brand-accent transition-colors relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">🛑</span>
          </div>
          <div className="text-3xl mb-6 relative z-10 grayscale group-hover:grayscale-0 transition-all">🛑</div>
          <h2 className="font-serif text-2xl text-brand-text mb-4 group-hover:text-brand-accent transition-colors relative z-10">
            The Friction Generator
          </h2>
          <p className="text-brand-soft text-sm mb-8 relative z-10">
            A literal speed bump for impulsive decisions. You must physically hold a button for 30 unbroken seconds before acting on your impulse.
          </p>
          <span className="text-xs uppercase tracking-widest text-brand-text group-hover:text-brand-accent transition-colors relative z-10">
            Open Tool →
          </span>
        </Link>

      </div>
    </div>
  );
}
