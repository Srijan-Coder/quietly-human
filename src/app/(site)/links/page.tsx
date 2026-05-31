import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quietly Humans | Links",
  description: "A soft space on the internet. Enter the sanctuary.",
};

const links = [
  { name: "Join the Midnight Letters 💌", url: "/#newsletter", isPrimary: true },
  { name: "Enter The 3AM Room 🕯️", url: "/3am", isPrimary: false },
  { name: "The Breathe Room 🌬️", url: "/breathe", isPrimary: false },
  { name: "Free Ebooks & Tools 📚", url: "/books", isPrimary: false },
  { name: "Read the Blog ☕", url: "/blog", isPrimary: false },
  { name: "About Srijan 🪴", url: "/about", isPrimary: false },
];

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-brand-bg pt-32 pb-24 px-6 flex flex-col items-center">
      {/* Profile Section */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-brand-card border border-brand-border mb-6">
          {/* We use a placeholder image or rely on the user to update it */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/icon.png" 
            alt="Quietly Humans"
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="font-serif text-3xl text-brand-text mb-2">Quietly Humans</h1>
        <p className="text-brand-soft text-sm max-w-xs">A soft corner of the internet for tired hearts and overthinkers. Drop your shoulders.</p>
      </div>

      {/* Links Section */}
      <div className="w-full max-w-md flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.url}
            className={`w-full p-5 flex items-center justify-center text-center rounded-xl transition-all duration-300 hover:scale-[1.02] ${
              link.isPrimary 
                ? "bg-brand-text text-brand-bg font-medium shadow-md hover:bg-brand-accent hover:text-white" 
                : "bg-brand-card border border-brand-border text-brand-text hover:border-brand-accent hover:text-brand-accent"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Footer Logo */}
      <div className="mt-16 text-center">
        <p className="text-[10px] uppercase tracking-widest text-brand-soft opacity-50">
          Built with Quietly Humans Studio
        </p>
      </div>
    </div>
  );
}
