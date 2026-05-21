import { client } from "@/sanity/lib/client";
import { productsQuery } from "@/sanity/lib/queries";

export default async function BooksPage() {
  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full pb-24">
      <div className="mb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-serif text-brand-charcoal mb-4">Books & Journals</h1>
        <p className="opacity-60 text-lg max-w-xl mx-auto text-balance">
          Physical artifacts to hold your thoughts and guide you toward a softer life.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Placeholder for physical books, can be fetched from Sanity later */}
        <div className="group flex flex-col gap-6">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-charcoal/5 flex items-center justify-center p-8">
            <div className="w-64 h-80 bg-brand-cream border border-brand-charcoal/20 shadow-2xl flex flex-col items-center justify-center p-6 text-center transition-transform duration-700 group-hover:rotate-y-12">
              <span className="font-serif text-2xl mb-2">The Overthinker's Guide</span>
              <span className="text-xs uppercase tracking-widest opacity-50">Srijan Pandey</span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="font-serif text-3xl group-hover:text-brand-gold transition-colors">The Overthinker's Guide</h2>
            <p className="opacity-70 text-balance">A gentle companion for the anxious mind. Learn to untangle your thoughts and find peace in the present moment.</p>
            <a href="#" className="uppercase tracking-widest text-xs border-b border-brand-charcoal pb-1 w-max hover:text-brand-gold hover:border-brand-gold transition-colors">Available on Amazon</a>
          </div>
        </div>

        <div className="group flex flex-col gap-6">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-charcoal/5 flex items-center justify-center p-8">
            <div className="w-64 h-80 bg-brand-charcoal text-brand-cream border border-brand-cream/20 shadow-2xl flex flex-col items-center justify-center p-6 text-center transition-transform duration-700 group-hover:-rotate-y-12">
              <span className="font-serif text-2xl mb-2">Healing Burnout</span>
              <span className="text-xs uppercase tracking-widest opacity-50">Guided Journal</span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="font-serif text-3xl group-hover:text-brand-gold transition-colors">Healing Burnout</h2>
            <p className="opacity-70 text-balance">When you are too tired to keep going, but too scared to stop. A journal for rediscovering your energy.</p>
            <a href="#" className="uppercase tracking-widest text-xs border-b border-brand-charcoal pb-1 w-max hover:text-brand-gold hover:border-brand-gold transition-colors">Coming Soon</a>
          </div>
        </div>
      </div>
    </div>
  );
}
