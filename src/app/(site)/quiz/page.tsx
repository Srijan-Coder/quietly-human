import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import QuizEngine from "@/components/global/QuizEngine";
import { archetypes, ArchetypeId } from "@/lib/quizData";
import { Metadata } from "next";

export const revalidate = 0; // Dynamic page

export const metadata: Metadata = {
  title: "What Is Your Heart Carrying? — Quietly Humans",
  description: "Take this gentle 5-question assessment to discover your emotional archetype and receive a curated reading list for your soul.",
};

export default async function QuizPage({ searchParams }: { searchParams: Promise<{ result?: string }> }) {
  const resolvedParams = await searchParams;
  const resultId = resolvedParams.result as ArchetypeId;

  // If no result is present, render the Quiz Engine
  if (!resultId || !archetypes[resultId]) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 flex items-center justify-center">
        <QuizEngine />
      </div>
    );
  }

  // If result is present, fetch the curated recommendations based on the archetype's tags!
  const archetype = archetypes[resultId];
  
  let data: any = null;
  try {
    data = await client.fetch(groq`{
      "guide": *[_type == "guide" && count((emotionTags[])[@ in $tags]) > 0] | order(_createdAt desc)[0]{_id, title, slug, excerpt},
      "ebook": *[_type == "ebook" && count((emotionTags[])[@ in $tags]) > 0] | order(_createdAt desc)[0]{_id, title, slug, coverImage},
      "post": *[_type == "post" && count((categories[]->slug.current)[@ in $tags]) > 0] | order(publishedAt desc)[0]{_id, title, slug, excerpt},
      "letter": *[_type == "letter" && count((emotionTags[])[@ in $tags]) > 0] | order(publishedAt desc)[0]{_id, title, slug}
    }`, { tags: archetype.tags });
  } catch (error) {
    console.error("Failed to fetch recommendations:", error);
  }

  // Fallbacks if tags didn't match anything specific
  const fetchGeneric = async (type: string) => client.fetch(groq`*[_type == $type] | order(_createdAt desc)[0]{_id, title, slug, excerpt, coverImage}`, { type });
  
  const recommendedGuide = data?.guide || await fetchGeneric('guide');
  const recommendedEbook = data?.ebook || await fetchGeneric('ebook');
  const recommendedPost = data?.post || await fetchGeneric('post');

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-xs uppercase tracking-widest text-brand-accent mb-6 block">Your Emotional Archetype</span>
          <h1 className="text-5xl md:text-7xl font-serif text-brand-text mb-8 text-balance">{archetype.title}</h1>
          <p className="text-xl md:text-2xl text-brand-soft font-serif italic max-w-2xl mx-auto leading-relaxed">
            {archetype.description}
          </p>
        </div>

        <div className="mb-24 pt-16 border-t border-brand-border">
          <h2 className="text-center font-serif text-3xl md:text-4xl text-brand-text mb-16">Your Curated Reading List 🤍</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Guide Recommendation */}
            {recommendedGuide && (
              <Link href={`/guides/${recommendedGuide.slug?.current}`} className="group p-8 bg-brand-card rounded-3xl border border-brand-border hover:border-brand-accent transition-all flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-4 block">Recommended Guide</span>
                  <h3 className="font-serif text-2xl text-brand-text group-hover:text-brand-accent transition-colors mb-4">{recommendedGuide.title}</h3>
                  <p className="text-brand-soft text-sm leading-relaxed mb-8">{recommendedGuide.excerpt}</p>
                </div>
                <span className="text-xs tracking-widest uppercase border-b border-brand-text text-brand-text pb-1 w-max">Read Guide</span>
              </Link>
            )}

            {/* Post Recommendation */}
            {recommendedPost && (
              <Link href={`/blog/${recommendedPost.slug?.current}`} className="group p-8 bg-brand-card rounded-3xl border border-brand-border hover:border-brand-accent transition-all flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-4 block">Quiet Thought (Blog)</span>
                  <h3 className="font-serif text-2xl text-brand-text group-hover:text-brand-accent transition-colors mb-4">{recommendedPost.title}</h3>
                  <p className="text-brand-soft text-sm leading-relaxed mb-8 line-clamp-3">{recommendedPost.excerpt}</p>
                </div>
                <span className="text-xs tracking-widest uppercase border-b border-brand-text text-brand-text pb-1 w-max">Read Essay</span>
              </Link>
            )}
          </div>

          {/* Ebook Recommendation */}
          {recommendedEbook && (
            <div className="w-full max-w-2xl mx-auto">
              <Link href={`/books/${recommendedEbook.slug?.current}`} className="group flex flex-col md:flex-row gap-8 items-center p-8 bg-brand-bg rounded-3xl border border-brand-border hover:border-brand-accent transition-all">
                <div className="relative aspect-[3/4] w-32 shrink-0 bg-brand-card rounded-xl border border-brand-border overflow-hidden">
                  {recommendedEbook.coverImage?.asset ? (
                    <Image src={urlFor(recommendedEbook.coverImage).width(200).height(266).url()} alt={recommendedEbook.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-2 text-center"><span className="font-serif text-[10px]">{recommendedEbook.title}</span></div>
                  )}
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-3 block">Free Download</span>
                  <h3 className="font-serif text-2xl text-brand-text group-hover:text-brand-accent transition-colors mb-3">{recommendedEbook.title}</h3>
                  <p className="text-brand-soft text-sm leading-relaxed mb-6">A digital resource to help you navigate your current season.</p>
                  <span className="text-xs tracking-widest uppercase border-b border-brand-text text-brand-text pb-1 w-max">Get Ebook</span>
                </div>
              </Link>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link href="/quiz" className="text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors">
            ← Retake Assessment
          </Link>
        </div>
      </div>
    </div>
  );
}
