import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import Link from "next/link";
import DashboardPostActionsClient from "./DashboardPostActionsClient";
import SubscriberListClient from "./SubscribersListClient";

import DashboardFeedClient from "./DashboardFeedClient";

export const metadata = {
  title: "Creator Dashboard | Quietly Humans",
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

  // Fetch all published posts for the Feed
  const { data: allPosts } = await supabaseClient
    .from("posts")
    .select(`
      id, title, slug, type, content, published_at, created_at, candle_count, view_count, author_id,
      profiles ( id, username, display_name, avatar_url )
    `)
    .eq("is_draft", false)
    .order("published_at", { ascending: false })
    .limit(100);

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
  const { count: pageViewsCount } = await supabaseClient
    .from("page_views")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", user.id);

  // Fetch link clicks
  const { count: linkClicksCount } = await supabaseClient
    .from("link_clicks")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", user.id);

  const myPosts = allPosts?.filter(p => p.author_id === user.id) || [];
  const totalCandles = myPosts.reduce((acc, post) => acc + (post.candle_count || 0), 0) || 0;

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-5xl mx-auto w-full pb-32 font-serif">
      <header className="mb-16 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5">
        <div>
          <h1 className="text-4xl md:text-5xl text-white mb-2 font-serif">Creator Dashboard</h1>
          <p className="text-brand-soft text-xs uppercase tracking-widest font-sans flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
            Welcome back, @{profile.username}.
          </p>
        </div>
        <Link href="/write" className="bg-white text-black px-6 py-3 rounded-full uppercase tracking-widest text-xs font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          + Write New
        </Link>
      </header>

      {/* Subscribers Section */}
      <div className="mb-16">
        <SubscriberListClient subscribers={subscribers || []} />
      </div>

      {/* Creator Guide — How to Use QH */}
      <div className="mb-16 rounded-[2rem] p-8 md:p-10" style={{ backgroundColor: "var(--color-card, #171717)", border: "1px solid var(--color-border, #2E2A27)" }}>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🧭</span>
          <h2 className="text-2xl font-serif" style={{ color: "var(--color-text, #EBE5DF)" }}>Creator Guide — How to Grow on Quietly Humans</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl" style={{ backgroundColor: "var(--color-bg, #0d0d0d)", border: "1px solid var(--color-border, #2E2A27)" }}>
            <span className="text-[10px] uppercase tracking-widest font-bold mb-2 block" style={{ color: "var(--color-accent, #C9A46A)" }}>Step 1 — Write</span>
            <h3 className="text-lg font-serif mb-2" style={{ color: "var(--color-text, #EBE5DF)" }}>Publish Content</h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-soft, #A39E99)" }}>
              Click <strong>&ldquo;Write New&rdquo;</strong> above to publish. You can write: <strong>Quiet Thoughts</strong> (short blog posts), <strong>Midnight Letters</strong> (emotional essays), <strong>Pillar Guides</strong> (long-form guides), or <strong>Books</strong> (full ebooks).
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl" style={{ backgroundColor: "var(--color-bg, #0d0d0d)", border: "1px solid var(--color-border, #2E2A27)" }}>
            <span className="text-[10px] uppercase tracking-widest font-bold mb-2 block" style={{ color: "var(--color-accent, #C9A46A)" }}>Step 2 — Build Your Room</span>
            <h3 className="text-lg font-serif mb-2" style={{ color: "var(--color-text, #EBE5DF)" }}>Customize Your Profile</h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-soft, #A39E99)" }}>
              Go to <Link href="/settings" className="text-amber-400 underline">Settings</Link> → set your display name, bio, avatar, and <strong>pin your products</strong> (Gumroad links, Notion templates, ebooks). These show on your public creator room.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl" style={{ backgroundColor: "var(--color-bg, #0d0d0d)", border: "1px solid var(--color-border, #2E2A27)" }}>
            <span className="text-[10px] uppercase tracking-widest font-bold mb-2 block" style={{ color: "var(--color-accent, #C9A46A)" }}>Step 3 — Monetize</span>
            <h3 className="text-lg font-serif mb-2" style={{ color: "var(--color-text, #EBE5DF)" }}>Sell Digital Products</h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-soft, #A39E99)" }}>
              Upload products to <strong>Gumroad</strong> (Notion templates, ebooks, journals). Pin them to your profile in Settings → Pins. Readers find you via the Reading Room, visit your room, and buy directly. <strong>0% platform fee during beta.</strong>
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-2xl" style={{ backgroundColor: "var(--color-bg, #0d0d0d)", border: "1px solid var(--color-border, #2E2A27)" }}>
            <span className="text-[10px] uppercase tracking-widest font-bold mb-2 block" style={{ color: "var(--color-accent, #C9A46A)" }}>Step 4 — Grow</span>
            <h3 className="text-lg font-serif mb-2" style={{ color: "var(--color-text, #EBE5DF)" }}>Get Discovered</h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-soft, #A39E99)" }}>
              Your posts appear in the <strong>Reading Room feed</strong> and the homepage <strong>Trending Writings</strong>. Readers can <strong>light candles</strong> (our version of likes), <strong>follow you</strong>, and <strong>subscribe</strong> to your newsletter. More candles = more visibility.
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl text-center" style={{ backgroundColor: "rgba(201,164,106,0.08)", border: "1px solid rgba(201,164,106,0.2)" }}>
          <p className="text-sm" style={{ color: "var(--color-accent, #C9A46A)" }}>
            💡 <strong>Pro tip:</strong> Publish consistently (2-3 posts/week), engage with the Pilgrim Wall community, and pin your best product to your profile. Creators who do this see 5x more followers.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        <div className="bg-[#121212] border border-white/5 p-8 rounded-[2rem] flex flex-col justify-center items-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <span className="text-[10px] uppercase tracking-widest text-brand-soft font-sans mb-3 z-10">Room Views</span>
          <span className="text-5xl font-serif text-white z-10">{pageViewsCount || 0}</span>
        </div>
        <div className="bg-[#121212] border border-brand-accent/20 p-8 rounded-[2rem] flex flex-col justify-center items-center text-center relative overflow-hidden group shadow-[0_0_30px_rgba(252,163,17,0.05)]">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <span className="text-[10px] uppercase tracking-widest text-brand-soft font-sans mb-3 z-10">Total Candles Lit</span>
          <span className="text-5xl font-serif text-brand-accent flex items-center gap-3 z-10">
            <span className="text-3xl">🕯️</span> {totalCandles}
          </span>
        </div>
        <div className="bg-[#121212] border border-brand-accent/20 p-8 rounded-[2rem] flex flex-col justify-center items-center text-center relative overflow-hidden group shadow-[0_0_30px_rgba(252,163,17,0.05)]">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <span className="text-[10px] uppercase tracking-widest text-brand-soft font-sans mb-3 z-10">Store Link Clicks</span>
          <span className="text-5xl font-serif text-brand-accent flex items-center gap-3 z-10">
            <span className="text-3xl">🏷️</span> {linkClicksCount || 0}
          </span>
        </div>
        <div className="bg-[#121212] border border-white/5 p-8 rounded-[2rem] flex flex-col justify-center items-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <span className="text-[10px] uppercase tracking-widest text-brand-soft font-sans mb-3 z-10">Quiet Followers</span>
          <span className="text-5xl font-serif text-white z-10">{followersCount || 0}</span>
        </div>
      </div>

      {/* Advanced Network Feed & Writings */}
      <DashboardFeedClient 
        initialPosts={allPosts || []}
        currentUserId={user.id}
        currentUsername={profile.username}
        followingIds={followingIds}
      />

      {/* Revenue & Store Section */}
      <h2 className="text-2xl font-serif text-white mt-16 mb-6">Creator Store & Revenue</h2>
      <div className="bg-[#121212] border border-white/5 rounded-[2rem] p-8 md:p-12">
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
            <Link href="/settings" className="bg-brand-accent text-white px-6 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold hover:scale-105 transition-transform inline-block">
              Set up your Store Pins
            </Link>
          </div>
          <div className="flex-1 bg-black/50 border border-white/5 p-8 rounded-2xl w-full">
            <span className="text-[10px] uppercase tracking-widest text-brand-soft mb-4 block">Pending Balance</span>
            <div className="text-5xl font-serif text-white mb-2">$0.00</div>
            <p className="text-xs text-brand-soft/70 font-sans mb-6">
              Tracked directly via your Gumroad Affiliate dashboard. Payouts happen every Friday via Gumroad.
            </p>
            <div className="border-t border-white/5 pt-6 mt-6 flex justify-between text-sm">
              <span className="text-brand-soft">Platform Fee:</span>
              <span className="text-white">0% (Beta)</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-brand-soft">Gumroad Fee:</span>
              <span className="text-white">10% + 30¢</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
