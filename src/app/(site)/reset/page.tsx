export default function FreeResetLibrary() {
  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-5xl mx-auto w-full pb-24 text-center">
      <div className="mb-16">
        <h1 className="text-5xl md:text-6xl font-serif text-brand-charcoal mb-4">Free Reset Library</h1>
        <p className="opacity-60 text-lg max-w-2xl mx-auto text-balance">
          You don't always need to buy something to start healing. Here are free tools, wallpapers, and worksheets to help you reset.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="p-8 border border-brand-charcoal/10 hover:border-brand-gold transition-colors flex flex-col justify-between min-h-[250px] bg-brand-cream/50 backdrop-blur-sm">
            <div>
              <span className="text-xs uppercase tracking-widest opacity-50 mb-2 block">PDF Download</span>
              <h3 className="font-serif text-2xl mb-4">Sunday Reset Checklist</h3>
              <p className="opacity-70 text-sm">A gentle guide to preparing your mind and space for the week ahead without overwhelming yourself.</p>
            </div>
            <button className="text-xs uppercase tracking-widest mt-8 flex items-center gap-2 hover:text-brand-gold transition-colors">
              Download <span>↓</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
