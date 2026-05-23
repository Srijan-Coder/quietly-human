import { supabaseClient } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "The Reading Room | Quietly Humans",
  description: "A daily curated feed of quiet thoughts and midnight letters.",
};

export const revalidate = 60; // Revalidate every minute

export default async function ReadingRoomPage() {
  // Fetch latest published posts joined with author profiles
  const { data: posts, error } = await supabaseClient
    .from("posts")
    .select(`
      id, title, slug, type, content, published_at, candle_count,
      profiles ( id, username, display_name, avatar_url )
    `)
    .eq("is_draft", false)
    .order("published_at", { ascending: false })
    .limit(20);

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-2xl mx-auto w-full pb-32 font-serif">
      <header className="mb-16 border-b border-brand-border pb-8 text-center">
        <h1 className="text-4xl text-brand-text mb-4">The Reading Room</h1>
        <p className="text-brand-soft text-sm font-sans tracking-widest uppercase">
          Take a breath. Read quietly.
        </p>
      </header>

      {error && (
        <div className="text-center text-red-400 py-10">
          We couldn't open the room today. Please return later.
        </div>
      )}

      <div className="flex flex-col gap-16">
        {posts && posts.length > 0 ? (
          posts.map((post: any) => (
            <article key={post.id} className="group relative">
              <div className="flex items-center gap-3 mb-4">
                <Link href={`/room/${post.profiles.username}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  {post.profiles.avatar_url ? (
                    <Image src={post.profiles.avatar_url} alt={post.profiles.username} width={24} height={24} className="rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-brand-card border border-brand-border flex items-center justify-center text-[10px] font-sans text-brand-soft">
                      {post.profiles.display_name?.charAt(0) || post.profiles.username.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm text-brand-text font-bold">
                    {post.profiles.display_name || post.profiles.username}
                  </span>
                </Link>
                <span className="text-xs text-brand-soft font-sans">
                  • {new Date(post.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>

              <Link href={`/room/${post.profiles.username}/${post.slug || post.id}`} className="block group-hover:opacity-90 transition-opacity">
                <span className="text-[10px] uppercase tracking-widest text-brand-soft bg-brand-bg px-2 py-1 rounded-md mb-3 inline-block">
                  {post.type}
                </span>
                
                {post.title && (
                  <h2 className="text-3xl text-brand-text mb-4 leading-snug">
                    {post.title}
                  </h2>
                )}

                <p className="text-lg text-brand-soft leading-relaxed line-clamp-3">
                  {post.content}
                </p>
                <div className="mt-4 text-xs font-sans tracking-widest uppercase text-brand-accent">
                  Read More →
                </div>
              </Link>
              
              <div className="mt-6 pt-6 border-t border-brand-border/30 flex items-center gap-4">
                <span className="text-xs text-brand-soft font-sans flex items-center gap-1">
                  🕯️ {post.candle_count || 0}
                </span>
              </div>
            </article>
          ))
        ) : (
          <div className="text-center py-20 text-brand-soft italic">
            The room is completely quiet today.
          </div>
        )}
      </div>
    </div>
  );
}
