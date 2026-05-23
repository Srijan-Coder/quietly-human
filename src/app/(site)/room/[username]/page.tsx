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

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-4xl mx-auto w-full pb-32 font-serif">
      {/* Profile Header */}
      <header className="flex flex-col items-center text-center border-b border-brand-border pb-12 mb-12">
        {profile.avatar_url ? (
          <Image src={profile.avatar_url} alt={profile.username} width={96} height={96} className="rounded-full mb-6 border border-brand-border/50" />
        ) : (
          <div className="w-24 h-24 rounded-full mb-6 bg-brand-card border border-brand-border flex items-center justify-center text-2xl font-sans text-brand-soft">
            {profile.display_name?.charAt(0) || profile.username.charAt(0)}
          </div>
        )}
        
        <h1 className="text-4xl text-brand-text mb-2">
          {profile.display_name || profile.username}
        </h1>
        <p className="text-sm font-sans tracking-widest uppercase text-brand-soft mb-6">
          @{profile.username} • {followersCount || 0} Followers
        </p>
        
        {profile.bio && (
          <p className="text-brand-soft max-w-lg mx-auto text-lg italic mb-8">
            "{profile.bio}"
          </p>
        )}

        {isOwnProfile ? (
          <Link href="/settings" className="text-xs uppercase tracking-widest text-brand-text border border-brand-border px-6 py-2 rounded-full hover:border-brand-accent transition-colors">
            Edit Room
          </Link>
        ) : (
          <FollowButton targetUserId={profile.id} initialIsFollowing={isFollowing} />
        )}
      </header>

      {/* Creator Pins (Pinterest-Style) */}
      {profile.pins && profile.pins.length > 0 && (
        <div className="mb-16">
          <h2 className="text-sm uppercase tracking-widest text-brand-soft mb-8 flex items-center gap-2">
            <span>📌</span> Pinned by Creator
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profile.pins.map((pin: any, idx: number) => (
              <a key={idx} href={pin.url} target="_blank" rel="noopener noreferrer" className="group block bg-brand-card border border-brand-border rounded-xl overflow-hidden hover:border-brand-accent transition-colors shadow-sm">
                <div className="h-32 bg-brand-bg relative flex items-center justify-center p-4 text-center border-b border-brand-border">
                  <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all">
                    {pin.emoji || "🔗"}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm text-brand-text mb-1 font-bold truncate">{pin.title}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-brand-soft truncate">{pin.subtitle}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Published Content */}
      <div>
        <h2 className="text-sm uppercase tracking-widest text-brand-soft mb-8 flex items-center gap-2">
          <span>📜</span> Published Writings
        </h2>
        
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map(post => (
              <Link key={post.id} href={`/room/${username}/${post.slug || post.id}`} className="group bg-brand-card border border-brand-border p-6 rounded-xl flex flex-col justify-between hover:border-brand-accent transition-colors">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-brand-soft bg-brand-bg px-2 py-1 rounded-md mb-4 inline-block">
                    {post.type}
                  </span>
                  <h3 className="text-xl text-brand-text mb-4 leading-snug font-serif group-hover:text-brand-accent transition-colors">
                    {post.title || "Untitled Thought"}
                  </h3>
                </div>
                <div className="mt-8 pt-4 border-t border-brand-border/50 flex justify-between items-center">
                  <span className="text-xs text-brand-soft font-sans">{new Date(post.published_at).toLocaleDateString()}</span>
                  <span className="text-xs text-brand-soft flex items-center gap-1">🕯️ {post.candle_count || 0}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-brand-border border-dashed rounded-xl bg-brand-card/30">
            <p className="text-brand-soft italic">The room is quiet. No writings published yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
