import Link from "next/link";

export function EmotionalPath() {
  return (
    <section className="w-full max-w-4xl mx-auto px-6 py-24 border-t border-brand-border">
      <div className="text-center mb-12">
        <span className="text-xs uppercase tracking-widest text-brand-accent mb-4 block">Begin Here</span>
        <h2 className="text-3xl md:text-4xl font-serif text-brand-text">How are you feeling right now?</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link 
          href="/paths/behind"
          className="p-8 border border-brand-border rounded-2xl text-center hover:border-brand-accent hover:bg-brand-card transition-all duration-500 cursor-pointer group flex items-center justify-center min-h-[120px]"
        >
          <span className="text-sm font-sans text-brand-text group-hover:text-brand-accent transition-colors">&quot;I feel behind in life&quot;</span>
        </Link>
        <Link 
          href="/paths/overthinking"
          className="p-8 border border-brand-border rounded-2xl text-center hover:border-brand-accent hover:bg-brand-card transition-all duration-500 cursor-pointer group flex items-center justify-center min-h-[120px]"
        >
          <span className="text-sm font-sans text-brand-text group-hover:text-brand-accent transition-colors">&quot;I am overthinking everything&quot;</span>
        </Link>
        <Link 
          href="/paths/tired"
          className="p-8 border border-brand-border rounded-2xl text-center hover:border-brand-accent hover:bg-brand-card transition-all duration-500 cursor-pointer group flex items-center justify-center min-h-[120px]"
        >
          <span className="text-sm font-sans text-brand-text group-hover:text-brand-accent transition-colors">&quot;I am just deeply tired&quot;</span>
        </Link>
      </div>
    </section>
  );
}
