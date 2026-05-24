import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Soft Toolkit — Quietly Humans",
  description: "Interactive tools designed to dissolve anxiety, organize thoughts, and bring stillness to a chaotic mind.",
};

const tools = [
  { id: 1, title: "Worry Dissolver", href: "/toolkit/worry-dissolver", icon: "🌫️", desc: "Type out what is weighing heavy on your mind, and watch it turn to smoke. A private exercise in letting go.", color: "bg-slate-500/10", border: "border-slate-500/20", hover: "hover:border-slate-500/50", isPremium: false },
  { id: 2, title: "The Daily Anchor", href: "/toolkit/daily-anchor", icon: "🪨", desc: "Set a single word as your intention for the day, carved into digital stone.", color: "bg-stone-500/10", border: "border-stone-500/20", hover: "hover:border-stone-500/50", isPremium: false },
  { id: 3, title: "Panic Redirector", href: "/toolkit/panic-redirector", icon: "🕰️", desc: "A guided visual exercise to break thought spirals using the 5-4-3-2-1 clinical grounding method.", color: "bg-rose-500/10", border: "border-rose-500/20", hover: "hover:border-rose-500/50", isPremium: false },
  { id: 4, title: "The Brain Dump", href: "/toolkit/brain-dump", icon: "🗑️", desc: "An unreadable canvas. Type everything that is overwhelming you. It blurs out instantly.", color: "bg-zinc-500/10", border: "border-zinc-500/20", hover: "hover:border-zinc-500/50", isPremium: false },
  { id: 5, title: "The Decision Coin", href: "/toolkit/decision-coin", icon: "🪙", desc: "For chronic overthinkers. Type your dilemma and let the universe give you a definitive answer.", color: "bg-yellow-500/10", border: "border-yellow-500/20", hover: "hover:border-yellow-500/50", isPremium: false },
  { id: 6, title: "The Control Sorter", href: "/toolkit/control-sorter", icon: "⚖️", desc: "Sort your anxieties into what you can and cannot control, and watch the uncontrollable ones disintegrate.", color: "bg-blue-500/10", border: "border-blue-500/20", hover: "hover:border-blue-500/50", isPremium: false },
  { id: 7, title: "Leaves on a Stream", href: "/toolkit/leaves-on-stream", icon: "🍃", desc: "An ACT exercise. Place intrusive thoughts on a leaf and watch them float away.", color: "bg-emerald-500/10", border: "border-emerald-500/20", hover: "hover:border-emerald-500/50", isPremium: false },
  { id: 8, title: "The View From Above", href: "/toolkit/view-from-above", icon: "🔭", desc: "A Stoic visualization. Type a localized stressor, and smoothly zoom out to cosmic scale.", color: "bg-indigo-500/10", border: "border-indigo-500/20", hover: "hover:border-indigo-500/50", isPremium: false },
  { id: 9, title: "The Task Atomizer", href: "/toolkit/task-atomizer", icon: "🔨", desc: "Shatter an overwhelming task into micro-steps, and enter a hyper-focus mode.", color: "bg-orange-500/10", border: "border-orange-500/20", hover: "hover:border-orange-500/50", isPremium: false },
  { id: 10, title: "The Air Lock", href: "/toolkit/air-lock", icon: "🚪", desc: "A guided 2-minute transition to help you mentally disconnect from work before entering rest mode.", color: "bg-gray-500/10", border: "border-gray-500/20", hover: "hover:border-gray-500/50", isPremium: false },
  { id: 11, title: "The Dopamine Menu", href: "/toolkit/dopamine-menu", icon: "🍽️", desc: "Consult your menu. Get a random 'Chef's Recommendation' for healthy, low-friction stimulation.", color: "bg-red-500/10", border: "border-red-500/20", hover: "hover:border-red-500/50", isPremium: true },
  { id: 12, title: "The Energy Battery", href: "/toolkit/energy-battery", icon: "🔋", desc: "Manage your daily capacity based on Spoon Theory. Set your energy level, assign costs to tasks.", color: "bg-green-500/10", border: "border-green-500/20", hover: "hover:border-green-500/50", isPremium: true },
  { id: 13, title: "The Cognitive Courtroom", href: "/toolkit/cognitive-courtroom", icon: "🏛️", desc: "Put your anxious thoughts on trial by stripping away the story and extracting only the hard facts.", color: "bg-amber-500/10", border: "border-amber-500/20", hover: "hover:border-amber-500/50", isPremium: true },
  { id: 14, title: "Urge Surfing", href: "/toolkit/urge-surfer", icon: "🌊", desc: "A DBT tool for cravings. Watch a visual 5-minute wave and log your urge intensity.", color: "bg-cyan-500/10", border: "border-cyan-500/20", hover: "hover:border-cyan-500/50", isPremium: true },
  { id: 15, title: "The 'Yes, But' Flipper", href: "/toolkit/yes-but-flipper", icon: "🃏", desc: "Combat black-and-white thinking. Force your brain to find the nuance in absolute thoughts.", color: "bg-violet-500/10", border: "border-violet-500/20", hover: "hover:border-violet-500/50", isPremium: true },
  { id: 16, title: "Emotion Color Wheel", href: "/toolkit/emotion-color-wheel", icon: "🎨", desc: "Drill down into an interactive color wheel to find the exact word for what you're feeling.", color: "bg-fuchsia-500/10", border: "border-fuchsia-500/20", hover: "hover:border-fuchsia-500/50", isPremium: true },
  { id: 17, title: "The Friction Generator", href: "/toolkit/friction-generator", icon: "🛑", desc: "A speed bump for impulsive decisions. Hold a button for 30 unbroken seconds before acting.", color: "bg-red-600/10", border: "border-red-600/20", hover: "hover:border-red-600/50", isPremium: true },
  { id: 18, title: "The Worry Postponer", href: "/toolkit/worry-postponer", icon: "📦", desc: "Lock your worry in a box and schedule a 15-minute window for it later today.", color: "bg-amber-700/10", border: "border-amber-700/20", hover: "hover:border-amber-700/50", isPremium: true },
  { id: 19, title: "The 'Done' List", href: "/toolkit/done-list", icon: "✅", desc: "A reverse to-do list where you only log what you've already accomplished.", color: "bg-lime-500/10", border: "border-lime-500/20", hover: "hover:border-lime-500/50", isPremium: true },
  { id: 20, title: "The Grounding Sandbox", href: "/toolkit/grounding-sandbox", icon: "✨", desc: "Sometimes you just need to distract your hands. A calming, interactive physics sandbox.", color: "bg-sky-500/10", border: "border-sky-500/20", hover: "hover:border-sky-500/50", isPremium: true },
];

export default function ToolkitHub() {
  const featuredTool = tools[0]; // Worry Dissolver
  const standardTools = tools.slice(1);

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full pb-32 font-sans bg-[#0d0d0d] text-white">
      <header className="mb-20 text-center flex flex-col items-center">
        <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-4 font-bold">Interactive</span>
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">Soft Toolkit</h1>
        <p className="text-brand-soft text-lg max-w-2xl mx-auto text-balance font-serif italic mb-10">
          Small, beautiful tools designed to intercept overthinking and guide you back to the present moment.
        </p>
        <div className="flex gap-4">
          <button className="bg-brand-accent text-white px-8 py-3 rounded-full text-xs uppercase tracking-widest font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(201,164,106,0.3)]">
            Pick a Random Tool
          </button>
        </div>
      </header>

      {/* Featured Tool (Hero Card) */}
      <div className="mb-8">
        <Link 
          href={featuredTool.href} 
          className={`group block ${featuredTool.color} border ${featuredTool.border} ${featuredTool.hover} rounded-[2rem] p-8 md:p-12 relative overflow-hidden transition-all duration-500`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 pointer-events-none" />
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-700">
            <span className="text-8xl md:text-9xl">{featuredTool.icon}</span>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start md:justify-between">
            <div className="max-w-xl">
              <span className="text-[10px] uppercase tracking-widest text-brand-soft mb-4 block bg-black/50 w-fit px-3 py-1 rounded-full border border-white/5">Daily Featured Tool</span>
              <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-500">{featuredTool.icon}</div>
              <h2 className="font-serif text-4xl text-white mb-4 group-hover:text-brand-accent transition-colors">
                {featuredTool.title}
              </h2>
              <p className="text-brand-soft text-lg mb-8 leading-relaxed">
                {featuredTool.desc}
              </p>
              <span className="text-xs uppercase tracking-widest text-white border-b border-white/30 pb-1 group-hover:border-white transition-colors">
                Open Tool →
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {standardTools.map((tool) => (
          <Link 
            key={tool.id}
            href={tool.href} 
            className={`group block bg-[#121212] border ${tool.border} ${tool.hover} rounded-[2rem] p-8 transition-all duration-500 relative overflow-hidden break-inside-avoid`}
          >
            <div className={`absolute inset-0 ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
            
            {/* Badges */}
            <div className="absolute top-6 right-6 z-10 flex gap-2">
              {tool.isPremium && (
                <span className="bg-brand-accent/20 text-brand-accent border border-brand-accent/20 text-[9px] uppercase tracking-widest px-2 py-1 rounded-sm">
                  Guardian
                </span>
              )}
            </div>

            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="text-6xl">{tool.icon}</span>
            </div>
            
            <div className="text-3xl mb-6 relative z-10 grayscale group-hover:grayscale-0 transition-all duration-500">{tool.icon}</div>
            
            <h2 className="font-serif text-2xl text-white mb-3 group-hover:text-brand-accent transition-colors relative z-10">
              {tool.title}
            </h2>
            
            <p className="text-brand-soft text-sm mb-8 relative z-10 leading-relaxed">
              {tool.desc}
            </p>
            
            <span className="text-[10px] uppercase tracking-widest text-white/50 group-hover:text-white transition-colors relative z-10 font-bold">
              Open →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
