import { supabaseClient } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover Creators",
  description: "Find quiet writers, thinkers, and creators. Browse the Quietly Humans community.",
};

export const revalidate = 300; // Refresh every 5 minutes

export default async function CreatorsPage() {
  const { data: profiles } = await supabaseClient
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio, is_premium")
    .order("created_at", { ascending: false })
    .limit(60);

  // Get post counts per creator
  const { data: postCounts } = await supabaseClient
    .from("posts")
    .select("author_id")
    .eq("is_draft", false);

  const countMap: Record<string, number> = {};
  if (postCounts) {
    for (const p of postCounts) {
      countMap[p.author_id] = (countMap[p.author_id] || 0) + 1;
    }
  }

  const sortedProfiles = (profiles || [])
    .map((p) => ({ ...p, postCount: countMap[p.id] || 0 }))
    .sort((a, b) => b.postCount - a.postCount);

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-6xl mx-auto w-full pb-32">
      {/* Header */}
      <header className="mb-16 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-brand-accent font-sans font-bold mb-4">
          The Quiet Community
        </p>
        <h1 className="text-5xl md:text-6xl font-serif text-brand-text mb-4 leading-tight">
          Discover Creators
        </h1>
        <p className="text-brand-soft max-w-md mx-auto leading-relaxed">
          Writers, thinkers, and quiet minds sharing their rooms with the world.
        </p>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedProfiles.map((profile) => (
          <Link
            key={profile.id}
            href={`/room/${profile.username}`}
            className="group flex items-start gap-4 p-5 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-accent/50 transition-all duration-300"
          >
            {/* Avatar */}
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.display_name || profile.username}
                width={52}
                height={52}
                className="rounded-full border border-brand-border/30 shrink-0"
              />
            ) : (
              <div className="w-[52px] h-[52px] rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-xl font-serif text-brand-text shrink-0">
                {(profile.display_name || profile.username).charAt(0).toUpperCase()}
              </div>
            )}

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-brand-text group-hover:text-brand-accent transition-colors font-serif truncate">
                  {profile.display_name || profile.username}
                </p>
                {profile.is_premium && (
                  <span className="text-[8px] uppercase tracking-widest bg-brand-accent/15 text-brand-accent border border-brand-accent/30 px-2 py-0.5 rounded-full font-sans font-bold shrink-0">
                    Pass
                  </span>
                )}
              </div>
              <p className="text-[10px] text-brand-soft font-sans mb-1.5">@{profile.username}</p>
              {profile.bio && (
                <p className="text-xs text-brand-soft leading-relaxed line-clamp-2 italic font-serif">
                  {profile.bio}
                </p>
              )}
              <p className="text-[9px] uppercase tracking-widest text-brand-soft/60 font-sans mt-2">
                {profile.postCount} {profile.postCount === 1 ? "writing" : "writings"}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {(!sortedProfiles || sortedProfiles.length === 0) && (
        <div className="text-center py-24">
          <p className="text-brand-soft font-serif italic text-lg">No creators yet. Be the first.</p>
          <Link href="/onboarding" className="mt-6 inline-block px-8 py-3 rounded-full bg-brand-text text-brand-bg text-[10px] uppercase tracking-widest font-bold font-sans hover:scale-105 transition-transform">
            Create Your Room
          </Link>
        </div>
      )}
    </div>
  );
}
