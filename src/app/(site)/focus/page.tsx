import AmbientBackground from "@/components/global/AmbientBackground";
import FocusTimer from "@/components/global/FocusTimer";

export const metadata = {
  title: "Quiet Focus | Quietly Humans",
  description: "A gentle timer for deep work and soft rest.",
};

export default function FocusPage() {
  return (
    <div className="relative min-h-screen flex flex-col w-full bg-brand-bg pt-32 pb-20 px-6 overflow-hidden">
      <AmbientBackground />
      
      {/* Radial glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 40%, var(--color-accent) 0%, transparent 60%)",
          opacity: 0.05,
        }}
      />

      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col items-center justify-center relative z-10">
        <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-4 text-center">Sanctuary Tools</span>
        <h1 className="text-4xl md:text-5xl font-serif text-brand-text mb-4 text-center">Quiet Focus</h1>
        <p className="text-brand-soft text-center max-w-lg mb-16 leading-relaxed">
          A space to drop your shoulders, set your intention, and do your deep work gently.
        </p>

        <FocusTimer />
      </div>
    </div>
  );
}
