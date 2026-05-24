export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d0d0d] text-brand-soft">
      <div className="flex flex-col items-center gap-6">
        <div className="w-8 h-8 rounded-full border-t-2 border-brand-accent animate-spin" />
        <p className="text-[10px] uppercase tracking-widest font-sans animate-pulse">Entering Sanctuary...</p>
      </div>
    </div>
  );
}
