import Link from "next/link";

export default function LibraryHub() {
  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-5xl mx-auto w-full pb-24">
      <header className="mb-24 text-center">
        <h1 className="text-5xl md:text-7xl font-serif text-brand-text mb-6">The Library 🏛️</h1>
        <p className="text-brand-soft text-lg max-w-2xl mx-auto text-balance">
          A collection of digital resources, journals, and tools designed to help you organize your mind and live a softer life.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* Books & Journals (Free Ebooks) */}
        <Link 
          href="/books" 
          className="group block bg-brand-card border border-brand-border rounded-2xl p-8 hover:border-brand-accent transition-colors tilt-card"
        >
          <div className="text-4xl mb-6">📖</div>
          <h2 className="font-serif text-3xl text-brand-text mb-4 group-hover:text-brand-accent transition-colors">
            Books & Journals
          </h2>
          <p className="text-brand-soft mb-8">
            Free downloadable ebooks, PDF workbooks, and guided journals. Available to all community members.
          </p>
          <span className="text-xs uppercase tracking-widest text-brand-text group-hover:text-brand-accent transition-colors">
            Browse collection →
          </span>
        </Link>

        {/* Digital Dashboards (Products/Notion) */}
        <Link 
          href="/products" 
          className="group block bg-brand-card border border-brand-border rounded-2xl p-8 hover:border-brand-accent transition-colors tilt-card"
        >
          <div className="text-4xl mb-6">💻</div>
          <h2 className="font-serif text-3xl text-brand-text mb-4 group-hover:text-brand-accent transition-colors">
            Digital Dashboards
          </h2>
          <p className="text-brand-soft mb-8">
            Premium Notion templates, focus systems, and organizational hubs for deep work and soft living.
          </p>
          <span className="text-xs uppercase tracking-widest text-brand-text group-hover:text-brand-accent transition-colors">
            Explore dashboards →
          </span>
        </Link>

      </div>
    </div>
  );
}
