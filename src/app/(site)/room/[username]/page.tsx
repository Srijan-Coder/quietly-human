import { supabaseClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import FollowButton from "./FollowButton";
import SubscribeFormClient from "@/components/global/SubscribeFormClient";
import type { Metadata } from "next";

const BASE_URL = "https://www.quietlyhumans.space";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("display_name, bio, avatar_url")
    .eq("username", username)
    .single();

  if (!profile) return { title: "Quietly Humans" };

  const name = profile.display_name || username;
  const title = `${name}'s Room | Quietly Humans`;
  const description = profile.bio || `Read writings and letters from ${name} on Quietly Humans.`;
  const imageUrl = profile.avatar_url || `${BASE_URL}/og-default.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/room/${username}`,
      siteName: "Quietly Humans",
      images: [{ url: imageUrl, width: 400, height: 400 }],
      type: "profile",
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [imageUrl],
    },
  };
}



const typeLabels: Record<string, string> = {
  "quiet-thought": "Quiet Thought",
  "midnight-letter": "Midnight Letter",
  "pillar-guide": "Pillar Guide",
  "book": "Book",
};

export default async function CreatorRoomPage({ params }: Props) {
  const { username } = await params;
  const user = await currentUser();

  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) notFound();

  const { count: followersCount } = await supabaseClient
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", profile.id);

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

  const { data: posts } = await supabaseClient
    .from("posts")
    .select("id, title, type, published_at, candle_count, slug, excerpt")
    .eq("author_id", profile.id)
    .eq("is_draft", false)
    .order("candle_count", { ascending: false });

  const isOwnProfile = user?.id === profile.id;
  const totalCandles = posts?.reduce((sum, p) => sum + (p.candle_count || 0), 0) || 0;
  const totalPosts = posts?.length || 0;

  // Log page view (fire and forget)
  import("@/lib/supabase").then(({ supabaseAdmin }) => {
    supabaseAdmin.from("page_views").insert({
      profile_id: profile.id,
      path: `/room/${username}`,
    }).then();
  });

  // Accent colour per theme
  const accentGlow: Record<string, string> = {
    "midnight-blue": "rgba(59,130,246,0.18)",
    "forest-green": "rgba(34,197,94,0.15)",
    "crimson": "rgba(239,68,68,0.15)",
    "sepia": "rgba(201,164,106,0.18)",
    default: "rgba(201,164,106,0.18)",
  };
  const themeBg: Record<string, string> = {
    "midnight-blue": "#080d18",
    "forest-green": "#070f09",
    "crimson": "#120505",
    "sepia": "#0f0c08",
    default: "#0d0d0d",
  };
  const bgColor = themeBg[profile.room_theme || "default"] ?? themeBg.default;
  const glowColor = accentGlow[profile.room_theme || "default"] ?? accentGlow.default;

  return (
    <div
      className="min-h-screen text-white font-sans overflow-x-hidden relative pb-40"
      style={{ backgroundColor: bgColor }}
    >
      {/* ── Full‑bleed ambient gradient ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% -10%, ${glowColor} 0%, transparent 65%)`,
        }}
      />
      {/* Secondary bottom glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 80% 100%, ${glowColor} 0%, transparent 60%)`,
          opacity: 0.5,
        }}
      />

      {/* ── Subtle grain texture ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10">

        {/* ══════════════════════════════════════
            HERO — full width, cinematic
        ══════════════════════════════════════ */}
        <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 text-center pt-28 pb-16">

          {/* Thin top rule */}
          <div className="absolute top-24 left-0 right-0 h-px bg-white/5" />

          {/* Avatar with layered glow */}
          <div className="relative mb-8 animate-fade-in-up" style={{ animationDelay: "0s" }}>
            {/* outer soft ring */}
            <div
              className="absolute inset-0 rounded-full blur-2xl scale-150"
              style={{ background: glowColor, opacity: 0.7 }}
            />
            {/* spinning accent ring */}
            <div
              className="absolute -inset-1 rounded-full opacity-40"
              style={{
                background: `conic-gradient(from 0deg, transparent 0%, ${glowColor} 30%, transparent 60%)`,
                animation: "spin 8s linear infinite",
              }}
            />
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.display_name || profile.username}
                width={140}
                height={140}
                className="rounded-full relative z-10 border border-white/15 shadow-[0_0_60px_rgba(0,0,0,0.8)]"
              />
            ) : (
              <div className="w-[140px] h-[140px] rounded-full relative z-10 border border-white/15 shadow-[0_0_60px_rgba(0,0,0,0.8)] flex items-center justify-center text-6xl font-serif"
                style={{ background: "linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)" }}>
                {(profile.display_name || profile.username).charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Creator name */}
          <h1
            className="font-serif leading-none mb-3 animate-fade-in-up"
            style={{
              fontSize: "clamp(3rem, 9vw, 7rem)",
              animationDelay: "0.1s",
              background: "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.65) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {profile.display_name || profile.username}
          </h1>

          {/* Handle + stats pill */}
          <div
            className="flex items-center gap-5 px-6 py-2.5 rounded-full mb-6 text-[11px] uppercase tracking-[0.22em] font-sans text-white/50 animate-fade-in-up"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              animationDelay: "0.2s",
            }}
          >
            <span>@{profile.username}</span>
            <span className="w-px h-3 bg-white/20" />
            <span>{followersCount ?? 0} followers</span>
            <span className="w-px h-3 bg-white/20" />
            <span>{totalPosts} writings</span>
            <span className="w-px h-3 bg-white/20" />
            <span>🕯️ {totalCandles}</span>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p
              className="font-serif italic text-white/55 max-w-xl mx-auto leading-relaxed mb-10 animate-fade-in-up"
              style={{ fontSize: "clamp(1rem, 2.5vw, 1.35rem)", animationDelay: "0.3s" }}
            >
              "{profile.bio}"
            </p>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            {isOwnProfile ? (
              <Link
                href="/settings"
                className="px-8 py-3.5 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold transition-all"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  color: "#0d0d0d",
                  boxShadow: "0 0 30px rgba(255,255,255,0.12)",
                }}
              >
                Edit Room
              </Link>
            ) : (
              <FollowButton targetUserId={profile.id} initialIsFollowing={isFollowing} />
            )}

            {/* Quick-links to pins */}
            {profile.pins?.slice(0, 3).map((pin: any, i: number) => (
              <a
                key={i}
                href={`/api/analytics/click?url=${encodeURIComponent(pin.url)}&profile_id=${profile.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                {pin.emoji ? `${pin.emoji} ` : ""}{pin.title}
              </a>
            ))}
          </div>

          {/* Subscribe form — compact, centred */}
          <div className="w-full max-w-lg animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <SubscribeFormClient
              creatorId={profile.id}
              creatorName={profile.display_name || profile.username}
            />
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
            <span className="text-[9px] uppercase tracking-[0.3em] font-sans">Writings</span>
            <div className="w-px h-8 bg-white/40" style={{ animation: "float 2s ease-in-out infinite" }} />
          </div>
        </section>

        {/* ══════════════════════════════════════
            PINNED PRODUCTS (if any)
        ══════════════════════════════════════ */}
        {profile.pins && profile.pins.length > 0 && (
          <section className="max-w-5xl mx-auto px-6 mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-white/6" />
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-sans">Pinned</span>
              <div className="h-px flex-1 bg-white/6" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {profile.pins.map((pin: any, idx: number) => (
                <a
                  key={idx}
                  href={`/api/analytics/click?url=${encodeURIComponent(pin.url)}&profile_id=${profile.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${glowColor}, transparent 70%)` }}
                  />
                  <div className="p-6 text-center relative z-10">
                    <span className="text-4xl block mb-3 transition-transform duration-500 group-hover:scale-110">
                      {pin.emoji || "🔗"}
                    </span>
                    <h3 className="text-sm font-serif text-white/80 group-hover:text-white transition-colors leading-tight mb-1">
                      {pin.title}
                    </h3>
                    {pin.subtitle && (
                      <p className="text-[10px] text-white/35 uppercase tracking-wider">{pin.subtitle}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════
            WRITINGS
        ══════════════════════════════════════ */}
        <section className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-white/6" />
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-sans">Published Writings</span>
            <div className="h-px flex-1 bg-white/6" />
          </div>

          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {posts.map((post, i) => (
                <Link
                  key={post.id}
                  href={`/room/${username}/${post.slug || post.id}`}
                  className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 flex flex-col"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    animationDelay: `${i * 0.07}s`,
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 50% 0%, ${glowColor}, transparent 65%)` }}
                  />

                  <div className="p-7 flex flex-col flex-1 relative z-10">
                    {/* Type badge */}
                    <span
                      className="text-[9px] uppercase tracking-[0.22em] font-bold mb-5 inline-block w-fit px-3 py-1 rounded-full"
                      style={{
                        background: `${glowColor}`,
                        border: `1px solid ${glowColor}`,
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      {typeLabels[post.type] || post.type}
                    </span>

                    <h3 className="font-serif text-xl md:text-2xl leading-snug text-white/85 group-hover:text-white transition-colors duration-300 mb-3 flex-1">
                      {post.title || "Untitled Thought"}
                    </h3>

                    {post.excerpt && (
                      <p className="text-sm text-white/35 font-serif italic line-clamp-2 mb-5 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-5 border-t border-white/6 mt-auto">
                      <span className="text-[10px] text-white/25 font-sans tracking-wider">
                        {new Date(post.published_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span
                        className="flex items-center gap-1.5 text-[11px] text-white/40 px-3 py-1 rounded-full font-sans"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        🕯️ {post.candle_count || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div
              className="text-center py-32 rounded-3xl"
              style={{ border: "1px dashed rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.015)" }}
            >
              <span className="text-5xl block mb-6 opacity-20">🪶</span>
              <p className="font-serif italic text-white/30 text-xl">The room is quiet. No writings yet.</p>
              {isOwnProfile && (
                <Link
                  href="/write"
                  className="inline-block mt-8 px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold transition-all hover:scale-105"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}
                >
                  Write your first piece →
                </Link>
              )}
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════
            BOTTOM CTA BAND
        ══════════════════════════════════════ */}
        {!isOwnProfile && (
          <section className="max-w-2xl mx-auto px-6 mt-24 text-center">
            <p className="font-serif italic text-white/20 text-sm mb-4">
              — Explore more quiet rooms —
            </p>
            <Link
              href="/reading-room"
              className="text-[11px] uppercase tracking-[0.25em] text-white/35 hover:text-white/70 transition-colors font-sans border-b border-white/10 hover:border-white/40 pb-px"
            >
              Visit the Reading Room →
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
