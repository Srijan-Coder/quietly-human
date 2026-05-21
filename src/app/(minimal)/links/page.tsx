import Link from "next/link";

export default function LinksPage() {
  const links = [
    { title: "Read the Blog", url: "/blog" },
    { title: "The Overthinker's Guide (Book)", url: "/books" },
    { title: "Notion Life Systems", url: "/products" },
    { title: "Free Reset Library", url: "/reset" },
    { title: "Contact Me", url: "/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-24 px-6 relative z-10">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-3xl mb-2">Quietly Human</h1>
        <p className="opacity-60 text-sm tracking-widest uppercase">A Digital Sanctuary</p>
      </div>

      <div className="w-full max-w-md flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.title}
            href={link.url}
            className="w-full py-4 px-6 bg-brand-cream text-brand-charcoal hover:bg-brand-gold hover:text-brand-charcoal transition-all text-center rounded-sm font-medium tracking-wide"
          >
            {link.title}
          </Link>
        ))}
      </div>

      <div className="mt-16 flex gap-6">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity uppercase text-xs tracking-widest">
          Instagram
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity uppercase text-xs tracking-widest">
          YouTube
        </a>
      </div>
    </div>
  );
}
