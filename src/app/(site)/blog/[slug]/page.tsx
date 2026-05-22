import { client } from "@/sanity/lib/client";
import { postBySlugQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;



export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let post = null;
  try {
    post = await client.fetch(postBySlugQuery, { slug: resolvedParams.slug });
  } catch (error) {
    console.warn("Failed to fetch post from Sanity (likely missing projectId):", error);
  }

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen pt-32 px-6 md:px-12 max-w-4xl mx-auto w-full pb-24">
      <Link href="/blog" className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mb-8 block">
        ← Back to Library
      </Link>
      
      <header className="mb-16">
        <h1 className="text-4xl md:text-6xl font-serif text-brand-text mb-8 text-balance">
          {post.title}
        </h1>
        {post.mainImage && (
          <div className="relative aspect-video w-full overflow-hidden bg-brand-card border border-brand-border rounded-xl mb-12">
            {/* eslint-disable-next-line @next/next/no-img-element */ }
            <img
              src={urlFor(post.mainImage)?.url()}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </header>

      <div className="prose prose-lg prose-stone max-w-none font-sans text-brand-soft prose-headings:font-serif prose-headings:text-brand-text prose-headings:font-normal prose-a:text-brand-accent">
        {post.body ? <PortableText value={post.body} /> : <p>The thoughts are empty.</p>}
      </div>
    </article>
  );
}
