import { supabaseClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CandleButton from "./CandleButton";
import GentleAd from "@/components/global/GentleAd";
import CommentSectionClient from "@/components/global/CommentSectionClient";

type Props = { params: Promise<{ username: string, slug: string }> };

export default async function PostPage({ params }: Props) {
  const { username, slug } = await params;

  // Fetch author
  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("id, display_name, avatar_url, is_premium")
    .eq("username", username)
    .single();

  if (!profile) notFound();

  // Fetch post
  // The slug parameter might be the ID if they don't have a slug yet, so we query by either.
  const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(slug);

  const { data: post } = await supabaseClient
    .from("posts")
    .select("*")
    .eq("author_id", profile.id)
    .or(isUuid ? `slug.eq.${slug},id.eq.${slug}` : `slug.eq.${slug}`)
    .eq("is_draft", false)
    .single();

  if (!post) notFound();

  // Map theme to Tailwind background color
  const getThemeClasses = (theme: string) => {
    switch(theme) {
      case 'midnight-blue': return 'bg-[#0a0f1c]';
      case 'forest-green': return 'bg-[#0a120c]';
      case 'crimson': return 'bg-[#1a0a0a]';
      case 'sepia': return 'bg-[#1c1812]';
      default: return ''; // default will inherit from room/page.tsx or be transparent
    }
  };

  const themeBg = getThemeClasses(post.post_theme || 'default');

  return (
    <div className={`min-h-screen pt-32 px-6 md:px-12 w-full pb-32 font-serif relative ${themeBg} bg-brand-bg text-brand-text transition-colors duration-1000`}>
      <div className="max-w-2xl mx-auto w-full relative">
        <Link href="/reading-room" className="absolute -top-12 left-0 text-sm text-brand-soft hover:text-brand-text transition-colors">
          ← Back to Reading Room
        </Link>

        <header className="mb-12 border-b border-brand-border/30 pb-12 text-center">
          <div className="flex justify-center gap-3 mb-6">
            <span className="text-[10px] uppercase tracking-widest text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-3 py-1 rounded-full">
              {post.type}
            </span>
            {post.category && post.category !== "Uncategorized" && (
              <span className="text-[10px] uppercase tracking-widest text-brand-soft border border-brand-border px-3 py-1 rounded-full">
                {post.category}
              </span>
            )}
          </div>
          
          {post.title && (
            <h1 className="text-4xl md:text-5xl text-brand-text mb-8 leading-snug font-serif">
              {post.title}
            </h1>
          )}

          {post.cover_image_url && (
            <div className="w-full h-[40vh] min-h-[300px] mb-8 relative rounded-3xl overflow-hidden border border-brand-border/40 shadow-2xl">
              <Image 
                src={post.cover_image_url} 
                alt="Cover Image" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-1000" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
            </div>
          )}

          {post.type === 'ebook' && post.pdf_file_url && (
            <div className="mb-12 text-center">
              <a 
                href={post.pdf_file_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-brand-accent text-white px-8 py-4 rounded-full text-xs uppercase tracking-widest font-bold hover:scale-105 transition-transform shadow-[0_0_30px_rgba(252,163,17,0.3)]"
              >
                <span className="text-xl">📖</span>
                Download / Read Ebook
              </a>
            </div>
          )}

          <div className="flex items-center justify-center gap-3">
            <Link href={`/room/${username}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              {profile.avatar_url ? (
                <Image src={profile.avatar_url} alt={username} width={32} height={32} className="rounded-full border border-brand-border/20" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-brand-bg/50 border border-brand-border/30 flex items-center justify-center text-xs font-sans text-brand-soft">
                  {profile.display_name?.charAt(0) || username.charAt(0)}
                </div>
              )}
              <span className="text-sm text-brand-text font-bold">
                {profile.display_name || username}
              </span>
            </Link>
            <span className="text-brand-border text-sm">|</span>
            <span className="text-sm text-brand-soft font-sans">
              {new Date(post.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </header>

        {/* Content Render: we use prose adaptive classes */}
        <div 
          className="prose dark:prose-invert prose-lg md:prose-xl max-w-none mb-16 leading-relaxed font-serif text-brand-text"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Embedded Premium Product Cards (Up to 3) */}
        {post.attached_pins && post.attached_pins.length > 0 && (
          <div className="mb-16 border-t border-b border-brand-border/30 py-12">
            <h3 className="text-[10px] uppercase tracking-widest text-brand-soft text-center mb-8">Featured by the Author</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
              {post.attached_pins.map((pin: any, idx: number) => (
                <a key={idx} href={`/api/analytics/click?url=${encodeURIComponent(pin.url)}&profile_id=${profile.id}`} target="_blank" rel="noopener noreferrer" className="block w-full group">
                  <div className="bg-brand-card border border-brand-border/40 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(201,164,106,0.05)] hover:shadow-[0_0_40px_rgba(201,164,106,0.15)] hover:border-brand-accent/60 transition-all duration-700 relative h-full flex flex-col">
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/5 to-transparent pointer-events-none" />
                    <div className="bg-brand-bg/40 py-6 px-6 text-center border-b border-brand-border/30 relative z-10 group-hover:bg-brand-bg/60 transition-colors">
                      <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110 block">
                        {pin.emoji || "🔗"}
                      </span>
                    </div>
                    <div className="p-6 relative z-10 text-center flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg text-brand-text mb-2 font-serif group-hover:text-brand-accent transition-colors line-clamp-2">
                          {pin.title}
                        </h3>
                        <p className="text-xs font-sans text-brand-soft mb-6 line-clamp-2">
                          {pin.subtitle}
                        </p>
                      </div>
                      <div className="inline-block bg-brand-text text-brand-bg px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold group-hover:scale-105 transition-transform mx-auto">
                        View Details
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center border-t border-brand-border/30 pt-12">
          <p className="text-sm text-brand-soft font-sans mb-4">Did these words help you?</p>
          <CandleButton targetId={post.id} targetType="post" initialCount={post.candle_count || 0} />
        </div>

        <CommentSectionClient postId={post.id} postAuthorId={post.author_id} isPremium={profile.is_premium || false} />

        <GentleAd />
      </div>
    </div>
  );
}
