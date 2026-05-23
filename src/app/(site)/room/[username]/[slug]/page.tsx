import { supabaseClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CandleButton from "./CandleButton";

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

      <div className="flex flex-col items-center border-t border-brand-border pt-12">
        <p className="text-sm text-brand-soft font-sans mb-4">Did these words help you?</p>
        <CandleButton targetId={post.id} targetType="post" initialCount={post.candle_count || 0} />
      </div>
    </div>
  );
}
