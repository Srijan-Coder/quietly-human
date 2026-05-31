"use client";

import { useState, useMemo } from "react";

interface PageView {
  path: string;
  created_at: string;
}

interface LinkClick {
  url: string;
  created_at: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  type: string;
  candle_count: number;
  published_at: string;
}

export default function DashboardAnalyticsClient({
  pageViews,
  linkClicks,
  posts,
}: {
  pageViews: PageView[];
  linkClicks: LinkClick[];
  posts: Post[];
}) {
  const [activeTab, setActiveTab] = useState<"views" | "clicks">("views");
  const [timeframe, setTimeframe] = useState<7 | 30>(30);

  // Helper to get slug from view path
  const getSlugFromPath = (path: string) => {
    if (!path) return "";
    const parts = path.split("/");
    return parts[parts.length - 1] || "";
  };

  // 1. Calculate Daily Views for Charting
  const viewsChartData = useMemo(() => {
    const data: { label: string; value: number; date: Date }[] = [];
    const now = new Date();

    // Populate empty dates for timeframe
    for (let i = timeframe - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      data.push({ label, value: 0, date: d });
    }

    // Accumulate actual views
    pageViews.forEach((view) => {
      const viewDate = new Date(view.created_at);
      const matched = data.find(
        (item) =>
          item.date.getDate() === viewDate.getDate() &&
          item.date.getMonth() === viewDate.getMonth() &&
          item.date.getFullYear() === viewDate.getFullYear()
      );
      if (matched) {
        matched.value += 1;
      }
    });

    return data;
  }, [pageViews, timeframe]);

  // 2. Calculate Click Counts per Link for Store clicks chart
  const clicksChartData = useMemo(() => {
    const linkMap: Record<string, number> = {};
    linkClicks.forEach((click) => {
      // Clean up URL display
      let cleanUrl = click.url;
      try {
        const parsed = new URL(click.url);
        cleanUrl = parsed.hostname + (parsed.pathname !== "/" ? parsed.pathname : "");
      } catch {}
      linkMap[cleanUrl] = (linkMap[cleanUrl] || 0) + 1;
    });

    const sortedData = Object.entries(linkMap)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // top 5 clicked links

    return sortedData;
  }, [linkClicks]);

  // 3. Aggregate view counts per post
  const postPerformanceData = useMemo(() => {
    return posts.map((post) => {
      // Find views matching this post's slug
      const viewCount = pageViews.filter((v) => {
        const viewSlug = getSlugFromPath(v.path);
        return viewSlug === post.slug || viewSlug === post.id;
      }).length;

      return {
        ...post,
        views: viewCount,
      };
    });
  }, [posts, pageViews]);

  // SVG Chart Dimensions
  const chartHeight = 160;
  const chartWidth = 500;
  const padding = 20;

  // View SVG calculations
  const viewSvgPoints = useMemo(() => {
    if (viewsChartData.length === 0) return "";
    const maxVal = Math.max(...viewsChartData.map((d) => d.value), 4);
    
    return viewsChartData.map((d, index) => {
      const x = padding + (index * (chartWidth - padding * 2)) / (viewsChartData.length - 1);
      const y = chartHeight - padding - (d.value / maxVal) * (chartHeight - padding * 2);
      return `${x},${y}`;
    }).join(" ");
  }, [viewsChartData]);

  // Fill area under view line svg path
  const viewSvgArea = useMemo(() => {
    if (viewsChartData.length === 0) return "";
    const points = viewSvgPoints.split(" ");
    if (points.length === 0) return "";
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    
    const [firstX] = firstPoint.split(",");
    const [lastX] = lastPoint.split(",");
    const bottomY = chartHeight - padding;
    
    return `M ${firstX},${bottomY} L ${viewSvgPoints} L ${lastX},${bottomY} Z`;
  }, [viewsChartData, viewSvgPoints]);

  return (
    <div className="bg-brand-card border border-brand-border/40 rounded-[2rem] p-6 md:p-8 mb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-brand-border/30 pb-6">
        <div>
          <h2 className="text-2xl font-serif text-brand-text">Performance Analytics</h2>
          <p className="text-brand-soft text-[10px] uppercase tracking-widest font-sans mt-1">
            Realtime views and engagement trends
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Tab Switcher */}
          <div className="flex bg-brand-bg p-1 rounded-full border border-brand-border/50 text-[10px] uppercase tracking-wider font-bold">
            <button
              onClick={() => setActiveTab("views")}
              className={`px-4 py-1.5 rounded-full transition-all duration-300 ${
                activeTab === "views"
                  ? "bg-brand-accent text-white"
                  : "text-brand-soft hover:text-brand-text"
              }`}
            >
              Views
            </button>
            <button
              onClick={() => setActiveTab("clicks")}
              className={`px-4 py-1.5 rounded-full transition-all duration-300 ${
                activeTab === "clicks"
                  ? "bg-brand-accent text-white"
                  : "text-brand-soft hover:text-brand-text"
              }`}
            >
              Store Clicks
            </button>
          </div>

          {/* Timeframe Switcher */}
          {activeTab === "views" && (
            <div className="flex bg-brand-bg p-1 rounded-full border border-brand-border/50 text-[10px] uppercase tracking-wider font-bold">
              <button
                onClick={() => setTimeframe(7)}
                className={`px-3 py-1.5 rounded-full transition-all ${
                  timeframe === 7 ? "text-brand-accent bg-brand-accent/10" : "text-brand-soft"
                }`}
              >
                7D
              </button>
              <button
                onClick={() => setTimeframe(30)}
                className={`px-3 py-1.5 rounded-full transition-all ${
                  timeframe === 30 ? "text-brand-accent bg-brand-accent/10" : "text-brand-soft"
                }`}
              >
                30D
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart View */}
        <div className="lg:col-span-2 bg-brand-bg/40 border border-brand-border/30 rounded-2xl p-6 flex flex-col justify-between min-h-[220px]">
          {activeTab === "views" ? (
            <>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] uppercase tracking-widest text-brand-soft">
                  Views Trend ({timeframe} Days)
                </span>
                <span className="text-xl font-serif text-brand-accent">
                  {viewsChartData.reduce((sum, d) => sum + d.value, 0)} total views
                </span>
              </div>

              {/* Line Chart */}
              <div className="w-full flex-grow relative overflow-visible mt-2">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-accent, #C9A46A)" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="var(--color-accent, #C9A46A)" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line
                    x1={padding}
                    y1={chartHeight - padding}
                    x2={chartWidth - padding}
                    y2={chartHeight - padding}
                    stroke="var(--color-border, #333)"
                    strokeWidth={0.5}
                  />
                  <line
                    x1={padding}
                    y1={padding}
                    x2={chartWidth - padding}
                    y2={padding}
                    stroke="var(--color-border, #333)"
                    strokeWidth={0.5}
                    strokeDasharray="4 4"
                  />

                  {/* Area fill */}
                  {viewSvgArea && (
                    <path d={viewSvgArea} fill="url(#viewsGradient)" className="transition-all duration-700" />
                  )}

                  {/* Trend line */}
                  {viewSvgPoints && (
                    <path
                      d={`M ${viewSvgPoints}`}
                      fill="none"
                      stroke="var(--color-accent, #C9A46A)"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all duration-700"
                    />
                  )}
                </svg>
              </div>

              {/* Labels */}
              <div className="flex justify-between text-[8px] uppercase tracking-widest text-brand-soft mt-3 px-2">
                <span>{viewsChartData[0]?.label}</span>
                <span>{viewsChartData[Math.floor(viewsChartData.length / 2)]?.label}</span>
                <span>{viewsChartData[viewsChartData.length - 1]?.label}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] uppercase tracking-widest text-brand-soft">
                  Top Product Clicks (All time)
                </span>
                <span className="text-xl font-serif text-brand-accent">
                  {linkClicks.length} total clicks
                </span>
              </div>

              {/* Bar Chart */}
              {clicksChartData.length > 0 ? (
                <div className="flex flex-col gap-3 flex-grow justify-center mt-2">
                  {clicksChartData.map((item, idx) => {
                    const maxVal = Math.max(...clicksChartData.map((c) => c.value), 1);
                    const pct = (item.value / maxVal) * 100;
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-[9px] font-sans text-brand-soft truncate w-32 tracking-wider">
                          {item.label}
                        </span>
                        <div className="flex-grow h-3 bg-brand-border/20 rounded-full overflow-hidden relative border border-brand-border/30">
                          <div
                            className="h-full bg-brand-accent transition-all duration-750"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold font-serif text-brand-text shrink-0 w-8 text-right">
                          {item.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex-grow flex items-center justify-center text-center py-6 text-brand-soft italic text-xs">
                  No links have been clicked yet.
                </div>
              )}
            </>
          )}
        </div>

        {/* Post-level table */}
        <div className="bg-brand-bg/40 border border-brand-border/30 rounded-2xl p-6 flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-brand-soft mb-4 block">
            Writings Performance
          </span>

          <div className="flex-grow overflow-y-auto max-h-[190px] pr-1 space-y-3 scrollbar-hide">
            {postPerformanceData.length > 0 ? (
              postPerformanceData.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between py-2 border-b border-brand-border/20 text-xs gap-3"
                >
                  <div className="min-w-0 flex-grow">
                    <p className="font-serif text-brand-text truncate font-bold">{post.title}</p>
                    <p className="text-[9px] uppercase text-brand-soft tracking-wider font-sans mt-0.5">
                      {post.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] shrink-0 text-brand-soft font-sans">
                    <span className="flex items-center gap-1 font-bold">
                      👁️ {post.views}
                    </span>
                    <span className="flex items-center gap-1">
                      🕯️ {post.candle_count}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-center text-brand-soft italic text-xs">
                No published posts.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
