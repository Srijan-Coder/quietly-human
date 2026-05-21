export default function MinimalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-brand-charcoal text-brand-cream selection:bg-brand-gold/30">
      <div className="film-grain opacity-10"></div>
      {children}
    </div>
  );
}
