import { client } from "@/sanity/lib/client";
import { postsQuery } from "@/sanity/lib/queries";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";

export const revalidate = 60; // revalidate this page every 60 seconds

export default async function BlogPage() {
  let posts = [];
  try {
    posts = await client.fetch(postsQuery);
  } catch (error) {
    console.warn("Failed to fetch posts from Sanity (likely missing projectId):", error);
  }

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full">
      <div className="mb-16">
        <h1 className="text-5xl md:text-6xl font-serif text-brand-charcoal mb-4">Quiet Thoughts</h1>
        <p className="opacity-60 text-lg max-w-xl text-balance">
          Words for overthinkers, tired hearts, and those learning to live softly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {posts.map((post: any) => (
          <Link href={`/blog/${post.slug}`} key={post._id} className="group flex flex-col gap-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-charcoal/5">
              {post.mainImage && (
                <img
                  src={urlForImage(post.mainImage)?.url()}
                  alt={post.title}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                />
              )}
            </div>
            <div>
              <h2 className="font-serif text-2xl group-hover:text-brand-gold transition-colors">{post.title}</h2>
              <span className="text-xs uppercase tracking-widest opacity-50 mt-2 block">Read Article</span>
            </div>
          </Link>
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="py-24 text-center opacity-50">
          <p>The library is quiet. Check back soon for new thoughts.</p>
        </div>
      )}
    </div>
  );
}
