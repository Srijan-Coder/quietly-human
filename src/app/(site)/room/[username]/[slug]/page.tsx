import { supabaseClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CandleButton from "./CandleButton";
import GentleAd from "@/components/global/GentleAd";

type Props = { params: Promise<{ username: string, slug: string }> };

export default async function PostPage({ params }: Props) {
  const { username, slug } = await params;

  // Fetch author
  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("id, display_name, avatar_url")
    .eq("username", username)
    .single();

  if (!profile) notFound();

  // Fetch post
  // The slug parameter might be the ID if they don't have a slug yet, so we query by either.
  const { data: post } = await supabaseClient
    .from("posts")
    .select("*")
    .eq("author_id", profile.id)
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .eq("is_draft", false)
    .single();

  if (!post) notFound();

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-2xl mx-auto w-full pb-32 font-serif relative">
      <Link href="/reading-room" className="absolute top-24 left-6 md:-left-12 text-sm text-brand-soft hover:text-brand-text transition-colors">
        ← Back
      </Link>

      <header className="mb-12 border-b border-brand-border pb-12 text-center">
        <span className="text-[10px] uppercase tracking-widest text-brand-soft bg-brand-bg px-2 py-1 rounded-md mb-6 inline-block">
          {post.type}
        </span>
        
        {post.title && (
          <h1 className="text-4xl md:text-5xl text-brand-text mb-8 leading-snug">
            {post.title}
          </h1>
        )}

        <div className="flex items-center justify-center gap-3">
          <Link href={`/room/${username}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            {profile.avatar_url ? (
              <Image src={profile.avatar_url} alt={username} width={32} height={32} className="rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-brand-card border border-brand-border flex items-center justify-center text-xs font-sans text-brand-soft">
                {profile.display_name?.charAt(0) || username.charAt(0)}
              </div>
            )}
            <span className="text-sm text-brand-text font-bold">
              {profile.display_name || username}
            </span>
          </Link>
          <span className="text-brand-soft text-sm">|</span>
          <span className="text-sm text-brand-soft font-sans">
            {new Date(post.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </header>

      <div className="text-xl text-brand-soft leading-relaxed whitespace-pre-wrap mb-16">
        {post.content}
      </div>

      {/* Embedded Premium Product Card */}
      {post.attached_pin && (
        <div className="mb-16 border-t border-b border-white/5 py-12 flex justify-center">
          <a href={`/api/analytics/click?url=${encodeURIComponent(post.attached_pin.url)}&profile_id=${profile.id}`} target="_blank" rel="noopener noreferrer" className="block max-w-md w-full group">
            <div className="bg-[#121212] border border-brand-accent/20 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(252,163,17,0.05)] hover:shadow-[0_0_40px_rgba(252,163,17,0.15)] hover:border-brand-accent/60 transition-all duration-700 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/5 to-transparent pointer-events-none" />
              <div className="bg-black/60 py-8 px-6 text-center border-b border-white/5 relative z-10 group-hover:bg-white/5 transition-colors">
                <span className="text-6xl filter grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110 block">
                  {post.attached_pin.emoji || "🔗"}
                </span>
              </div>
              <div className="p-8 relative z-10 text-center">
                <span className="text-[10px] uppercase tracking-widest text-brand-accent font-bold mb-3 block">Featured by {profile.display_name || username}</span>
                <h3 className="text-2xl text-white mb-2 font-serif group-hover:text-brand-accent transition-colors">
                  {post.attached_pin.title}
                </h3>
                <p className="text-sm font-sans text-brand-soft mb-6">
                  {post.attached_pin.subtitle}
                </p>
                <div className="inline-block bg-white text-black px-8 py-3 rounded-full text-xs uppercase tracking-widest font-bold group-hover:scale-105 transition-transform">
                  View Details
                </div>
              </div>
            </div>
          </a>
        </div>
      )}

      <div className="flex flex-col items-center border-t border-brand-border pt-12">
        <p className="text-sm text-brand-soft font-sans mb-4">Did these words help you?</p>
        <CandleButton targetId={post.id} targetType="post" initialCount={post.candle_count || 0} />
      </div>

      <GentleAd />
    </div>
  );
}
