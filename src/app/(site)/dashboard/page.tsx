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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-[#121212] border border-white/5 p-8 rounded-[2rem] flex flex-col justify-center items-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <span className="text-[10px] uppercase tracking-widest text-brand-soft font-sans mb-3 z-10">Total Posts</span>
          <span className="text-5xl font-serif text-white z-10">{posts?.length || 0}</span>
        </div>
        <div className="bg-[#121212] border border-brand-accent/20 p-8 rounded-[2rem] flex flex-col justify-center items-center text-center relative overflow-hidden group shadow-[0_0_30px_rgba(252,163,17,0.05)]">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <span className="text-[10px] uppercase tracking-widest text-brand-soft font-sans mb-3 z-10">Total Candles Lit</span>
          <span className="text-5xl font-serif text-brand-accent flex items-center gap-3 z-10">
            <span className="text-3xl">🕯️</span> {totalCandles}
          </span>
        </div>
        <div className="bg-[#121212] border border-white/5 p-8 rounded-[2rem] flex flex-col justify-center items-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <span className="text-[10px] uppercase tracking-widest text-brand-soft font-sans mb-3 z-10">Quiet Followers</span>
          <span className="text-5xl font-serif text-white z-10">{followersCount || 0}</span>
        </div>
      </div>

      {/* Recent Posts */}
      <h2 className="text-2xl font-serif text-white mb-6">Your Writings</h2>
      <div className="bg-[#121212] border border-white/5 rounded-[2rem] overflow-hidden">
        {posts && posts.length > 0 ? (
          <div className="divide-y divide-white/5">
            {posts.map((post: any) => (
              <div key={post.id} className="p-6 md:p-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:bg-white/5 transition-colors group">
                <div>
                  <Link href={`/room/${profile.username}/${post.slug}`} className="text-xl font-serif text-white group-hover:text-brand-accent transition-colors block mb-2">
                    {post.title}
                  </Link>
                  <span className="text-[10px] uppercase tracking-widest text-brand-soft font-sans opacity-70">
                    Published {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-sm font-sans text-brand-soft bg-black/50 px-4 py-2 rounded-full border border-white/5">🕯️ {post.candle_count}</span>
                  <Link href={`/room/${profile.username}/${post.slug}`} className="text-[10px] uppercase tracking-widest text-white hover:text-black hover:bg-white transition-all font-sans border border-white/20 px-6 py-2.5 rounded-full">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <span className="text-4xl opacity-30 mb-6 block grayscale">🍃</span>
            <p className="text-brand-soft italic text-lg mb-6">You haven't published anything yet.</p>
            <Link href="/write" className="text-[10px] uppercase tracking-widest text-white border-b border-white/30 pb-1 hover:border-white transition-colors">
              Write your first thought
            </Link>
          </div>
        )}
      </div>

      {/* Revenue & Store Section */}
      <h2 className="text-2xl font-serif text-white mt-16 mb-6">Creator Store & Revenue</h2>
      <div className="bg-[#121212] border border-white/5 rounded-[2rem] p-8 md:p-12">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="flex-1">
            <h3 className="text-3xl text-brand-text mb-4 font-serif">Monetize your Room</h3>
            <p className="text-brand-soft font-sans leading-relaxed mb-6">
              Quietly Humans allows you to sell digital products (Notion templates, ebooks, journaling guides) directly from your Creator Room. We use <strong>Gumroad</strong> to process all payments globally.
            </p>
            <ol className="list-decimal pl-5 text-brand-soft font-sans space-y-3 mb-8">
              <li>Upload your digital product to your own Gumroad account.</li>
              <li>Copy the checkout link provided by Gumroad.</li>
              <li>Go to <strong>Settings {`>`} Pins</strong> and add your product link.</li>
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
