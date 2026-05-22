import Link from "next/link";

export default function SocialConnectCTA() {
  return (
    <div className="mt-16 pt-16 border-t border-brand-border/50 text-center max-w-2xl mx-auto">
      <span className="text-xl mb-6 block">🤍</span>
      <h3 className="font-serif text-2xl md:text-3xl text-brand-text mb-4">Let&apos;s stay connected.</h3>
      <p className="text-brand-soft leading-relaxed mb-8">
        If these words brought you a moment of peace, you can find more quiet spaces with us here:
      </p>
      
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        <a 
          href="https://instagram.com/quietlyhumansspace" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-6 py-3 bg-brand-card border border-brand-border rounded-full text-xs uppercase tracking-widest hover:border-brand-accent hover:text-brand-accent transition-colors"
        >
          Instagram
        </a>
        <a 
          href="https://pinterest.com/quietlyhumansspace" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-6 py-3 bg-brand-card border border-brand-border rounded-full text-xs uppercase tracking-widest hover:border-brand-accent hover:text-brand-accent transition-colors"
        >
          Pinterest
        </a>
        <a 
          href="https://www.youtube.com/@quietlyhumansspace" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-6 py-3 bg-brand-card border border-brand-border rounded-full text-xs uppercase tracking-widest hover:border-brand-accent hover:text-brand-accent transition-colors"
        >
          YouTube
        </a>
      </div>
    </div>
  );
}
