import { client } from "@/sanity/lib/client";
import { postBySlugQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { CustomPortableText } from "@/components/global/CustomPortableText";
import SocialConnectCTA from "@/components/global/SocialConnectCTA";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await client.fetch(postBySlugQuery, { slug: resolvedParams.slug });
  if (!post) return {};

  const ogImage = post.mainImage ? urlFor(post.mainImage)?.width(1200).height(630).url() : undefined;

  return {
    title: post.title,
    description: "Read this quiet thought on the Quietly Humans Studio.",
    alternates: {
      canonical: `https://www.quietlyhumans.space/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: "Read this quiet thought on the Quietly Humans Studio.",
      type: "article",
      publishedTime: post.publishedAt,
      url: `https://www.quietlyhumans.space/blog/${post.slug}`,
      images: ogImage ? [{ url: ogImage, alt: post.mainImage?.alt || post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.mainImage ? [urlFor(post.mainImage)?.url()] : [],
    "datePublished": post.publishedAt,
    "author": [{
      "@type": "Person",
      "name": post.authorName || "Srijan",
      "url": "https://www.quietlyhumans.space/about"
    }]
  };

  return (
    <article className="min-h-screen pt-32 px-6 md:px-12 max-w-4xl mx-auto w-full pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/blog" className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mb-8 block">
        ← Back to Library
      </Link>
      
      <header className="mb-16">
        <h1 className="text-4xl md:text-6xl font-serif text-brand-text mb-8 text-balance">
          {post.title}
        </h1>
        {post.mainImage && (
          <div className="relative aspect-video w-full overflow-hidden bg-brand-card border border-brand-border rounded-xl mb-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={urlFor(post.mainImage)?.url()}
              alt={post.mainImage?.alt || post.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </header>

      <div className="max-w-none">
        {post.body ? <CustomPortableText value={post.body} /> : <p className="text-brand-soft">The thoughts are empty.</p>}
      </div>

      <SocialConnectCTA />
    </article>
  );
}
