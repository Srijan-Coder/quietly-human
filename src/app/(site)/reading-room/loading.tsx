export default function ReadingRoomLoading() {
  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full pb-32">
      {/* Header skeleton */}
      <div className="mb-12">
        <div className="h-4 w-32 bg-brand-card rounded-full mb-4 animate-pulse" />
        <div className="h-12 w-64 bg-brand-card rounded-2xl mb-4 animate-pulse" />
        <div className="h-4 w-48 bg-brand-card rounded-full animate-pulse" />
      </div>

      {/* Filter tabs skeleton */}
      <div className="flex gap-3 mb-10">
        {[80, 100, 90, 110, 70].map((w, i) => (
          <div key={i} className="h-9 rounded-full bg-brand-card animate-pulse" style={{ width: w }} />
        ))}
      </div>

      {/* Post cards skeleton grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="p-6 rounded-2xl bg-brand-card border border-brand-border/30 animate-pulse flex flex-col gap-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-brand-bg" />
              <div className="h-3 w-24 bg-brand-bg rounded-full" />
            </div>
            <div className="h-5 w-full bg-brand-bg rounded-full" />
            <div className="h-5 w-3/4 bg-brand-bg rounded-full" />
            <div className="h-3 w-full bg-brand-bg rounded-full mt-1" />
            <div className="h-3 w-2/3 bg-brand-bg rounded-full" />
            <div className="flex gap-2 mt-2">
              <div className="h-6 w-16 bg-brand-bg rounded-full" />
              <div className="h-6 w-20 bg-brand-bg rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
