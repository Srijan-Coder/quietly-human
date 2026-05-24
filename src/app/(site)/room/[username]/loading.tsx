export default function CreatorRoomLoading() {
  return (
    <div className="min-h-screen" style={{ background: "#0d0d0d" }}>
      {/* Hero skeleton */}
      <div className="min-h-[85vh] flex flex-col items-center justify-center">
        {/* Avatar ring skeleton */}
        <div className="w-36 h-36 rounded-full bg-white/5 animate-pulse mb-6" />
        {/* Name skeleton */}
        <div className="h-10 w-64 bg-white/5 rounded-2xl animate-pulse mb-3" />
        <div className="h-4 w-40 bg-white/5 rounded-full animate-pulse mb-6" />
        {/* Stats skeleton */}
        <div className="flex gap-8">
          {[60, 80, 70].map((w, i) => (
            <div key={i} className="h-10 rounded-xl bg-white/5 animate-pulse" style={{ width: w }} />
          ))}
        </div>
      </div>

      {/* Posts skeleton */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-6 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="h-4 w-16 rounded-full mb-3" style={{ background: "rgba(255,255,255,0.05)" }} />
              <div className="h-6 w-full rounded-xl mb-2" style={{ background: "rgba(255,255,255,0.05)" }} />
              <div className="h-6 w-3/4 rounded-xl mb-4" style={{ background: "rgba(255,255,255,0.05)" }} />
              <div className="h-3 w-24 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
