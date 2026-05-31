import { Fragment } from 'react';
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { CategoryFilter } from "@/components/global/CategoryFilter";
import { QuietAdCard, QuietAdBanner } from "@/components/global/QuietAd";
import { Metadata } from "next";

export const revalidate = 60; // revalidate this page every 60 seconds

export const metadata: Metadata = {
  title: "Quiet Thoughts — Essays & Blog | Quietly Humans",
  description: "Read curated essays and quiet thoughts on emotional wellness, overthinking, and soft living."
};

export interface Post {
  _id: string;
  title: string;
  slug?: string;
  mainImage?: unknown;
  categories?: string[];
  guestName?: string;
}

export default async function BlogPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const currentCategory = searchParams?.category as string | undefined;
  let posts = [];
  try {
    posts = await client.fetch(groq`*[_type == "post" && isApproved != false] | order(coalesce(publishedAt, _createdAt) desc) {
      _id,
      title,
      "slug": slug.current,
      mainImage,
      guestName,
      "publishedAt": coalesce(publishedAt, _createdAt),
      "categories": categories[]->title
    }`);
  } catch (error) {
    console.warn("Failed to fetch posts from Sanity (likely missing projectId):", error);
  }

  const categorySet = new Set<string>();
  posts.forEach((post: Post) => {
    if (post.categories) {
      post.categories.forEach(cat => categorySet.add(cat));
    }
  });
  const categoryList = Array.from(categorySet).sort();

  const filteredPosts = currentCategory
    ? posts.filter((post: Post) => post.categories?.includes(currentCategory))
    : posts;

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full pb-24">
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-serif text-brand-text mb-4">Quiet Thoughts ☕</h1>
        <p className="text-brand-soft text-lg max-w-xl text-balance">
          Words for overthinkers, tired hearts, and those learning to live softly. ☁️
        </p>
      </div>

      {/* Category Menu */}
      <CategoryFilter categories={categoryList} currentCategory={currentCategory} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {filteredPosts.filter((post: Post) => post.slug).map((post: Post, index: number) => (
          <Fragment key={post._id}>
            <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-4">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-card rounded-xl border border-brand-border shadow-sm">
                {post.mainImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
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
                <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-2 block">
                  {post.guestName ? `${post.guestName}` : post.categories?.[0] || "Blog Post"}
                </span>
                <h2 className="font-serif text-2xl group-hover:text-brand-accent transition-colors text-brand-text">{post.title}</h2>
                <span className="text-xs uppercase tracking-widest text-brand-soft mt-3 block group-hover:text-brand-text transition-colors">Read Article</span>
              </div>
            </Link>
            {/* Inject a house ad card after the 3rd post */}
            {index === 2 && <QuietAdCard key="quiet-ad-card" tags={["book", "ebook", "tool"]} />}
          </Fragment>
        ))}
      </div>

      {/* Quiet House Ad — full-width banner below grid */}
      <QuietAdBanner tags={["membership", "toolkit"]} />
      
      {filteredPosts.length === 0 && (
        <div className="py-24 text-center text-brand-soft">
          <p>The library is quiet. No posts found for this category.</p>
        </div>
      )}
    </div>
  );
}
