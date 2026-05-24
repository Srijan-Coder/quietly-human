import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Articles | Quietly Humans",
    template: "%s",
  },
  description: "Clinically-sound, empathetic guides for emotional wellness, anxiety relief, and soft living.",
};

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans selection:bg-brand-accent/20 selection:text-brand-text transition-colors duration-1000">
      {children}
    </div>
  );
}
