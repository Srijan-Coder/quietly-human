import { client } from "@/sanity/lib/client";
import { postsQuery } from "@/sanity/lib/queries";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60; // revalidate this page every 60 seconds

export default async function BlogPage() {
  let posts = [];
  try {
    posts = await client.fetch(postsQuery);
  } catch (error) {
    console.warn("Failed to fetch posts from Sanity (likely missing projectId):", error);
  }

  const categoryList = [
    "Feeling Behind", "Overthinking", "Tired Hearts", "Soft Life", 
    "People Pleasing", "Loneliness", "Rest Without Guilt", "Quiet Growth"
  ];

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full pb-24">
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-serif text-brand-text mb-4">Quiet Thoughts</h1>
        <p className="text-brand-soft text-lg max-w-xl text-balance">
          Words for overthinkers, tired hearts, and those learning to live softly.
        </p>
      </div>

      {/* Category Menu */}
      <div className="flex flex-wrap gap-3 mb-16 border-b border-brand-border pb-8">
        <button className="px-4 py-2 bg-brand-text text-brand-bg rounded-full text-xs uppercase tracking-widest transition-colors hover:bg-brand-accent hover:text-white">All</button>
        {categoryList.map((cat) => (
          <button key={cat} className="px-4 py-2 border border-brand-border text-brand-text rounded-full text-xs uppercase tracking-widest transition-colors hover:border-brand-accent hover:text-brand-accent">
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {posts.filter((post: any) => post.slug).map((post: any) => (
          <Link href={`/blog/${post.slug}`} key={post._id} className="group flex flex-col gap-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-card rounded-xl border border-brand-border shadow-sm">
              {post.mainImage ? (
                <img
                  src={urlFor(post.mainImage)?.url()}
                  alt={post.title}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-30">
                  <span className="font-serif text-lg">No Cover</span>
                </div>
              )}
            </div>
            <div>
              {post.categories && post.categories.length > 0 && (
                <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-2 block">
                  {post.categories[0]}
                </span>
              )}
              <h2 className="font-serif text-2xl group-hover:text-brand-accent transition-colors text-brand-text">{post.title}</h2>
              <span className="text-xs uppercase tracking-widest text-brand-soft mt-3 block group-hover:text-brand-text transition-colors">Read Article</span>
            </div>
          </Link>
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="py-24 text-center text-brand-soft">
          <p>The library is quiet. Check back soon for new thoughts.</p>
        </div>
      )}
    </div>
  );
}
