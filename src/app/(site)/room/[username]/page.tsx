import { supabaseClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import FollowButton from "./FollowButton";

type Props = { params: Promise<{ username: string }> };

export default async function CreatorRoomPage({ params }: Props) {
  const { username } = await params;
  const user = await currentUser();

  // Fetch the creator's profile
  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) {
    notFound();
  }

  // Fetch followers count
  const { count: followersCount } = await supabaseClient
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", profile.id);

  // Check if current user is following
  let isFollowing = false;
  if (user) {
    const { data: follow } = await supabaseClient
      .from("follows")
      .select("follower_id")
      .eq("follower_id", user.id)
      .eq("following_id", profile.id)
      .single();
    if (follow) isFollowing = true;
  }

  // Fetch their published posts
  const { data: posts } = await supabaseClient
    .from("posts")
    .select("id, title, type, published_at, candle_count, slug")
    .eq("author_id", profile.id)
    .eq("is_draft", false)
    .order("published_at", { ascending: false });

  const isOwnProfile = user?.id === profile.id;

  // Log the page view asynchronously (fire and forget)
  import("@/lib/supabase").then(({ supabaseAdmin }) => {
    supabaseAdmin.from("page_views").insert({ 
      profile_id: profile.id, 
      path: `/room/${username}` 
    }).then();
  });

  // Map ambiance to Tailwind colors
  const getAmbianceClasses = (ambiance: string) => {
    switch(ambiance) {
      case 'sky': return 'from-blue-900/20';
      case 'forest': return 'from-emerald-900/20';
      case 'dusk': return 'from-purple-900/20';
      case 'midnight': return 'from-slate-900/20';
      case 'ember': return 'from-brand-accent/20';
      default: return 'from-[#121212]';
    }
  };

  const ambianceColor = getAmbianceClasses(profile.room_ambiance || 'midnight');

  return (
    <div className={`min-h-screen bg-[#0d0d0d] text-white font-sans overflow-x-hidden relative pb-32`}>
      {/* Dynamic Ambiance Background Glow */}
      <div className={`absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b ${ambianceColor} to-transparent pointer-events-none opacity-50 blur-3xl`} />

      <div className="relative z-10 pt-32 px-6 md:px-12 max-w-5xl mx-auto w-full">
        
        {/* Profile Header (Full-width Hero) */}
        <header className="flex flex-col items-center text-center pb-16">
          <div className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-b ${ambianceColor} to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
            {profile.avatar_url ? (
              <Image src={profile.avatar_url} alt={profile.username} width={120} height={120} className="rounded-full mb-6 border-2 border-white/10 relative z-10" />
            ) : (
              <div className="w-[120px] h-[120px] rounded-full mb-6 bg-black/50 border-2 border-white/10 flex items-center justify-center text-4xl font-sans text-brand-soft relative z-10">
                {profile.display_name?.charAt(0) || profile.username.charAt(0)}
              </div>
            )}
          </div>
          
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-4">
            {profile.display_name || profile.username}
          </h1>
          <p className="text-xs font-sans tracking-widest uppercase text-brand-soft mb-8 flex items-center gap-4 bg-black/40 px-6 py-2 rounded-full border border-white/5">
            <span>@{profile.username}</span>
            <span className="w-1 h-1 rounded-full bg-brand-soft/50"></span>
            <span>{followersCount || 0} Followers</span>
          </p>
          
          {profile.bio && (
            <p className="text-brand-soft max-w-2xl mx-auto text-xl font-serif italic mb-10 leading-relaxed">
              "{profile.bio}"
            </p>
          )}

          <div className="flex gap-4">
            {isOwnProfile ? (
              <Link href="/settings" className="bg-white text-black px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                Edit Room
              </Link>
            ) : (
              <FollowButton targetUserId={profile.id} initialIsFollowing={isFollowing} />
            )}
          </div>
        </header>

        {/* Creator Pins (Gradient Cards) */}
        {profile.pins && profile.pins.length > 0 && (
          <div className="mb-24">
            <h2 className="text-[10px] uppercase tracking-widest text-brand-soft mb-6 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span> Pinned by Creator
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {profile.pins.map((pin: any, idx: number) => (
                <a key={idx} href={`/api/analytics/click?url=${encodeURIComponent(pin.url)}&profile_id=${profile.id}`} target="_blank" rel="noopener noreferrer" className="group block bg-[#121212] border border-white/5 rounded-[1.5rem] overflow-hidden hover:border-brand-accent/50 transition-all duration-500 shadow-sm relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <div className="h-32 bg-black/40 relative flex items-center justify-center p-4 text-center border-b border-white/5 group-hover:bg-white/5 transition-colors">
                    <span className="text-5xl filter grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110">
                      {pin.emoji || "🔗"}
                    </span>
                  </div>
                  <div className="p-6 relative z-10">
                    <h3 className="text-white mb-2 font-serif text-lg group-hover:text-brand-accent transition-colors">{pin.title}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-brand-soft truncate">{pin.subtitle}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Published Content (Masonry Grid) */}
        <div>
          <h2 className="text-[10px] uppercase tracking-widest text-brand-soft mb-6 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span> Published Writings
          </h2>
          
          {posts && posts.length > 0 ? (
            <div className="columns-1 md:columns-2 gap-6 space-y-6">
              {posts.map(post => (
                <Link key={post.id} href={`/room/${username}/${post.slug || post.id}`} className="break-inside-avoid group block bg-[#121212] border border-white/5 p-8 rounded-[2rem] hover:border-brand-accent/50 transition-all duration-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  
                  <div className="relative z-10">
                    <span className="text-[9px] uppercase tracking-widest text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-3 py-1 rounded-full mb-6 inline-block">
                      {post.type}
                    </span>
                    <h3 className="text-2xl text-white mb-4 leading-snug font-serif group-hover:text-brand-accent transition-colors">
                      {post.title || "Untitled Thought"}
                    </h3>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center relative z-10">
                    <span className="text-[10px] uppercase tracking-widest text-white/40">{new Date(post.published_at).toLocaleDateString()}</span>
                    <span className="text-xs text-white/50 font-sans flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full border border-white/5">
                      <span className="text-sm">🕯️</span> {post.candle_count || 0}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 border border-white/5 border-dashed rounded-[2rem] bg-[#121212]/50">
              <span className="text-4xl opacity-30 block mb-6 grayscale">🪶</span>
              <p className="text-brand-soft font-serif italic text-xl">The room is quiet. No writings published yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
