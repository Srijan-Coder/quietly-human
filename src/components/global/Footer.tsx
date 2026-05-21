export default function Footer() {
  return (
    <footer className="mt-auto py-24 px-6 md:px-12 border-t border-brand-border bg-brand-bg text-brand-text">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        
        <div className="flex flex-col gap-4 col-span-1 md:col-span-1">
          <span className="font-serif text-2xl">Quietly Human Studio</span>
          <span className="text-sm opacity-60 max-w-xs leading-relaxed">
            Books, journals, resets, and digital spaces for people rebuilding quietly.
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-xs tracking-widest uppercase opacity-40">Navigate</span>
          <a href="/books" className="text-sm opacity-80 hover:text-brand-accent transition-colors">Books & Journals</a>
          <a href="/products" className="text-sm opacity-80 hover:text-brand-accent transition-colors">Digital Dashboard</a>
          <a href="/blog" className="text-sm opacity-80 hover:text-brand-accent transition-colors">Quiet Thoughts</a>
          <a href="/library" className="text-sm opacity-80 hover:text-brand-accent transition-colors">The Library</a>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-xs tracking-widest uppercase opacity-40">Connect</span>
          <a href="https://instagram.com" target="_blank" className="text-sm opacity-80 hover:text-brand-accent transition-colors">Instagram</a>
          <a href="https://youtube.com" target="_blank" className="text-sm opacity-80 hover:text-brand-accent transition-colors">YouTube</a>
          <a href="https://pinterest.com" target="_blank" className="text-sm opacity-80 hover:text-brand-accent transition-colors">Pinterest</a>
          <a href="/contact" className="text-sm opacity-80 hover:text-brand-accent transition-colors">Contact</a>
        </div>

        <div className="flex flex-col gap-4 col-span-1 md:col-span-1">
          <span className="text-xs tracking-widest uppercase opacity-40">The Letters</span>
          <p className="text-sm opacity-60">Soft words for tired hearts, sent twice a month.</p>
          <form className="flex mt-2 border-b border-brand-border pb-2 focus-within:border-brand-accent transition-colors">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="bg-transparent text-sm w-full outline-none placeholder:text-brand-soft"
            />
            <button type="button" className="text-xs tracking-widest uppercase opacity-60 hover:text-brand-accent hover:opacity-100 transition-colors">
              Join
            </button>
          </form>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-40 uppercase tracking-widest">
        <span>© 2026 Quietly Human Studio</span>
        <div className="flex gap-6">
          <a href="/privacy" className="hover:text-brand-accent transition-colors">Privacy</a>
          <a href="/terms" className="hover:text-brand-accent transition-colors">Terms</a>
        </div>
      </div>
      
      <div className="text-center mt-16 opacity-30 hover:opacity-100 transition-opacity duration-1000 text-[10px] tracking-[0.2em] uppercase cursor-default">
        Take a deep breath before you close this tab.
      </div>
    </footer>
  );
}
