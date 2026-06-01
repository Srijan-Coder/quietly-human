import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import Link from "next/link";
import DashboardPostActionsClient from "./DashboardPostActionsClient";
import SubscriberListClient from "./SubscribersListClient";

import DashboardFeedClient from "./DashboardFeedClient";
import DashboardAnalyticsClient from "./DashboardAnalyticsClient";

export const metadata = {
  title: "Creator Dashboard — Quietly Humans",
};

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  // Fetch creator's profile
  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("id, username, is_premium")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/onboarding");

  // Fetch the user's own published posts
  const { data: myOwnPosts } = await supabaseClient
    .from("posts")
    .select(`
      id, title, slug, type, content, published_at, created_at, candle_count, author_id,
      profiles ( id, username, display_name, avatar_url )
    `)
    .eq("author_id", user.id)
    .eq("is_draft", false)
    .order("published_at", { ascending: false })
    .limit(50);

  // Fetch network feed (posts from other users, limited)
  const { data: networkPosts } = await supabaseClient
    .from("posts")
    .select(`
      id, title, slug, type, content, published_at, created_at, candle_count, author_id,
      profiles ( id, username, display_name, avatar_url )
    `)
    .neq("author_id", user.id)
    .eq("is_draft", false)
    .order("published_at", { ascending: false })
    .limit(50);

  const allPosts = [...(myOwnPosts || []), ...(networkPosts || [])];

  // Fetch who the user is following
  let followingIds: string[] = [];
  const { data: followsList } = await supabaseClient
    .from("follows")
    .select("following_id")
    .eq("follower_id", user.id);
      
  if (followsList) {
    followingIds = followsList.map(f => f.following_id);
  }

  // Fetch subscribers
  const { data: subscribers } = await supabaseClient
    .from("subscribers")
    .select("subscriber_email, created_at")
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch total followers
  const { count: followersCount } = await supabaseClient
    .from("follows")
    .select("follower_id", { count: "exact" })
    .eq("following_id", user.id);

  // Fetch page views
  const { data: pageViews } = await supabaseClient
    .from("page_views")
    .select("path, created_at")
    .eq("profile_id", user.id);

  // Fetch link clicks
  const { data: linkClicks } = await supabaseClient
    .from("link_clicks")
    .select("url, created_at")
    .eq("profile_id", user.id);

  const pageViewsCount = pageViews?.length || 0;
  const linkClicksCount = linkClicks?.length || 0;

  const myPosts = (allPosts?.filter(p => p.author_id === user.id) || []).map(post => {
    const viewCount = pageViews?.filter(v => {
      const parts = v.path.split("/");
      const slug = parts[parts.length - 1] || "";
      return slug === post.slug || slug === post.id;
    }).length || 0;
    return { ...post, view_count: viewCount };
  });

  const totalCandles = myPosts.reduce((acc, post) => acc + (post.candle_count || 0), 0) || 0;
  const feedPosts = [...myPosts, ...(networkPosts || [])];

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-5xl mx-auto w-full pb-32 font-serif text-brand-text">
      <header className="mb-16 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-brand-border/30">
        <div>
          <h1 className="text-4xl md:text-5xl text-brand-text mb-2 font-serif">Creator Dashboard</h1>
          <p className="text-brand-soft text-xs uppercase tracking-widest font-sans flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
            Welcome back, @{profile.username}.
          </p>
        </div>
        <div className="flex gap-4 flex-wrap">
          {profile?.username === "srijan" && (
            <Link href="/dashboard/bulk-uploader" className="border border-brand-border/60 text-brand-text px-6 py-3 rounded-full uppercase tracking-widest text-xs font-bold hover:scale-105 hover:bg-brand-card transition-all shadow-sm cursor-pointer">
              Bulk AI Uploader
            </Link>
          )}
          <Link href="/write" className="bg-brand-text text-brand-bg px-6 py-3 rounded-full uppercase tracking-widest text-xs font-bold hover:scale-105 transition-transform shadow-lg cursor-pointer">
            + Write New
          </Link>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        <div className="bg-brand-card border border-brand-border/40 p-8 rounded-[2rem] flex flex-col justify-center items-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-text/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <span className="text-[10px] uppercase tracking-widest text-brand-soft font-sans mb-3 z-10">Room Views</span>
          <span className="text-5xl font-serif text-brand-text z-10">{pageViewsCount || 0}</span>
        </div>
        <div className="bg-brand-card border border-brand-accent/25 p-8 rounded-[2rem] flex flex-col justify-center items-center text-center relative overflow-hidden group shadow-[0_0_30px_rgba(201,164,106,0.03)]">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <span className="text-[10px] uppercase tracking-widest text-brand-soft font-sans mb-3 z-10">Total Candles Lit</span>
          <span className="text-5xl font-serif text-brand-accent flex items-center gap-3 z-10">
            <span className="text-3xl">🕯️</span> {totalCandles}
          </span>
        </div>
        <div className="bg-brand-card border border-brand-accent/25 p-8 rounded-[2rem] flex flex-col justify-center items-center text-center relative overflow-hidden group shadow-[0_0_30px_rgba(201,164,106,0.03)]">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <span className="text-[10px] uppercase tracking-widest text-brand-soft font-sans mb-3 z-10">Store Link Clicks</span>
          <span className="text-5xl font-serif text-brand-accent flex items-center gap-3 z-10">
            <span className="text-3xl">🏷️</span> {linkClicksCount || 0}
          </span>
        </div>
        <div className="bg-brand-card border border-brand-border/40 p-8 rounded-[2rem] flex flex-col justify-center items-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-text/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <span className="text-[10px] uppercase tracking-widest text-brand-soft font-sans mb-3 z-10">Quiet Followers</span>
          <span className="text-5xl font-serif text-brand-text z-10">{followersCount || 0}</span>
        </div>
      </div>

      {/* Subscribers Section */}
      <div className="mb-16">
        <SubscriberListClient subscribers={subscribers || []} />
      </div>

      {/* Dashboard Analytics Section */}
      <DashboardAnalyticsClient 
        pageViews={pageViews || []} 
        linkClicks={linkClicks || []} 
        posts={myPosts} 
      />

      {/* Advanced Network Feed & Writings */}
      <DashboardFeedClient 
        initialPosts={feedPosts || []}
        currentUserId={user.id}
        currentUsername={profile.username}
        followingIds={followingIds}
      />

      {/* Revenue & Store Section */}
      <h2 className="text-2xl font-serif text-brand-text mt-16 mb-6">Creator Store & Revenue</h2>
      <div className="bg-brand-card border border-brand-border/40 rounded-[2rem] p-8 md:p-12">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="flex-1">
            <h3 className="text-3xl text-brand-text mb-4 font-serif">Monetize your Room</h3>
            <p className="text-brand-soft font-sans leading-relaxed mb-6">
              Quietly Humans allows you to pin <strong>anything</strong> to your Creator Room. Link your digital products (Notion templates, ebooks, journaling guides via Gumroad), your social media profiles, or your personal website. 
            </p>
            <ol className="list-decimal pl-5 text-brand-soft font-sans space-y-3 mb-8">
              <li>Upload your digital product to Gumroad, or copy any external URL.</li>
              <li>Go to <strong>Settings {`>`} Pins</strong> and add your link.</li>
              <li>Attach up to 3 links to any post you write!</li>
            </ol>
            <Link href="/settings" className="bg-brand-accent text-white px-6 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold hover:scale-105 transition-transform inline-block cursor-pointer">
              Set up your Store Pins
            </Link>
          </div>
          <div className="flex-1 bg-brand-bg/50 border border-brand-border/40 p-8 rounded-2xl w-full">
            <span className="text-[10px] uppercase tracking-widest text-brand-soft mb-4 block">Pending Balance</span>
            <div className="text-5xl font-serif text-brand-text mb-2">$0.00</div>
            <p className="text-xs text-brand-soft/70 font-sans mb-6">
              Tracked directly via your Gumroad Affiliate dashboard. Payouts happen every Friday via Gumroad.
            </p>
            <div className="border-t border-brand-border/40 pt-6 mt-6 flex justify-between text-sm">
              <span className="text-brand-soft">Platform Fee:</span>
              <span className="text-brand-text">0% (Beta)</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-brand-soft">Gumroad Fee:</span>
              <span className="text-brand-text">10% + 30¢</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
