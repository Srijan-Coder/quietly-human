export default function Footer() {
  return (
    <footer className="mt-auto py-12 px-6 md:px-12 border-t border-brand-charcoal/10 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex flex-col items-center md:items-start gap-2">
        <span className="font-serif text-xl">Quietly Human</span>
        <span className="text-sm opacity-50">A digital sanctuary for soft living.</span>
      </div>
      
      <div className="flex gap-6 text-sm opacity-60">
        <a href="/privacy" className="hover:opacity-100 transition-opacity">Privacy</a>
        <a href="/terms" className="hover:opacity-100 transition-opacity">Terms</a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">Instagram</a>
      </div>
    </footer>
  );
}
