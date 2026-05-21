export default function MinimalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text selection:bg-brand-accent/30">
      <div className="film-grain opacity-10"></div>
      {children}
    </div>
  );
}
