import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import Link from "next/link";

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

  // Fetch their posts to calculate total candles
  const { data: posts } = await supabaseClient
    .from("posts")
    .select("id, title, slug, candle_count, created_at")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch total followers
  const { count: followersCount } = await supabaseClient
    .from("follows")
    .select("follower_id", { count: "exact" })
    .eq("following_id", user.id);

  const totalCandles = posts?.reduce((acc, post) => acc + (post.candle_count || 0), 0) || 0;

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-5xl mx-auto w-full pb-32 font-serif">
      <header className="mb-12 border-b border-brand-border pb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl text-brand-text mb-2">Creator Dashboard</h1>
          <p className="text-brand-soft text-sm uppercase tracking-widest font-sans">
            Welcome back, @{profile.username}.
          </p>
        </div>
        <Link href="/write" className="bg-brand-text text-brand-bg px-6 py-2 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-brand-accent hover:text-white transition-colors font-sans">
          + Write New
        </Link>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-brand-card border border-brand-border p-6 rounded-2xl flex flex-col justify-center items-center text-center">
          <span className="text-[10px] uppercase tracking-widest text-brand-soft font-sans mb-2">Total Posts</span>
          <span className="text-4xl text-brand-text">{posts?.length || 0}</span>
        </div>
        <div className="bg-brand-card border border-brand-border p-6 rounded-2xl flex flex-col justify-center items-center text-center">
          <span className="text-[10px] uppercase tracking-widest text-brand-soft font-sans mb-2">Total Candles Lit</span>
          <span className="text-4xl text-brand-accent flex items-center gap-2">🕯️ {totalCandles}</span>
        </div>
        <div className="bg-brand-card border border-brand-border p-6 rounded-2xl flex flex-col justify-center items-center text-center">
          <span className="text-[10px] uppercase tracking-widest text-brand-soft font-sans mb-2">Quiet Followers</span>
          <span className="text-4xl text-brand-text">{followersCount || 0}</span>
        </div>
      </div>

      {/* Recent Posts */}
      <h2 className="text-xl text-brand-text mb-6">Your Writings</h2>
      <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
        {posts && posts.length > 0 ? (
          <div className="divide-y divide-brand-border/50">
            {posts.map((post: any) => (
              <div key={post.id} className="p-6 flex justify-between items-center hover:bg-brand-bg/50 transition-colors">
                <div>
                  <Link href={`/room/${profile.username}/${post.slug}`} className="text-lg text-brand-text font-bold hover:text-brand-accent transition-colors block mb-1">
                    {post.title}
                  </Link>
                  <span className="text-xs text-brand-soft font-sans">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-sm font-sans text-brand-soft">🕯️ {post.candle_count}</span>
                  <Link href={`/room/${profile.username}/${post.slug}`} className="text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors font-sans border border-brand-border px-4 py-2 rounded-full">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-brand-soft italic">
            You haven't published anything yet.
          </div>
        )}
      </div>
    </div>
  );
}
