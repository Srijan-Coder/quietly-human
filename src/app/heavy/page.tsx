import EmergencyEngine from "@/components/heavy/EmergencyEngine";

export default function HeavyPage() {
  return (
    <main className="relative min-h-screen">
      <EmergencyEngine />
      <div className="absolute bottom-6 left-0 right-0 text-center px-4 pointer-events-none">
        <p className="text-[10px] uppercase tracking-widest text-brand-soft/30 max-w-md mx-auto">
          Quietly Humans is a digital sanctuary, not clinical support. 
        </p>
      </div>
    </main>
  );
}
