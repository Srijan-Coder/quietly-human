import { client } from "@/sanity/lib/client";
import { postBySlugQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { CustomPortableText } from "@/components/global/CustomPortableText";
import SocialConnectCTA from "@/components/global/SocialConnectCTA";
import { QuietAdInline, QuietAdBanner } from "@/components/global/QuietAd";
import ListenButton from "@/components/global/ListenButton";
import { SaveButton } from "@/components/global/SaveButton";
import { LikeButton } from "@/components/global/LikeButton";
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
    description: post.excerpt || "Read this quiet thought on the Quietly Humans Studio.",
    alternates: {
      canonical: `https://www.quietlyhumans.space/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || "Read this quiet thought on the Quietly Humans Studio.",
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
        ← Back to Quiet Thoughts
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

      <div className="flex justify-center items-center gap-6 mb-16">
        <ListenButton />
        <LikeButton documentId={post._id} initialLikes={post.likes} />
        <SaveButton item={{ id: post.slug, title: post.title, type: "post", url: `/blog/${post.slug}` }} className="px-6 py-3 border border-brand-border bg-brand-card rounded-full" />
      </div>

      <div id="article-content" className="max-w-none">
        {post.body ? <CustomPortableText value={post.body} /> : <p className="text-brand-soft">The thoughts are empty.</p>}
      </div>

      {/* Quiet House Ad — blends with reading flow */}
      <QuietAdInline tags={["book", "ebook", "free"]} />

      <SocialConnectCTA />

      {/* Quiet House Ad — after social CTA */}
      <QuietAdBanner tags={["toolkit", "membership"]} />
    </article>
  );
}
