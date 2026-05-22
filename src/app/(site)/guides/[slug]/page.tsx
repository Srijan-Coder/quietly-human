import { client } from "@/sanity/lib/client";
import { guideBySlugQuery } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { SaveButton } from "@/components/global/SaveButton";
import { ReadingController } from "@/components/global/ReadingController";
import { ReadingTextWrapper } from "@/components/global/ReadingTextWrapper";
import Image from "next/image";

export const revalidate = 60;

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let guide = null;
  try {
    guide = await client.fetch(guideBySlugQuery, { slug: resolvedParams.slug });
  } catch (error) {
    console.warn("Failed to fetch guide from Sanity:", error);
  }

  if (!guide) {
    notFound();
  }

  return (
    <>
      <ReadingController />
      <article className="min-h-screen pt-32 px-6 md:px-12 max-w-4xl mx-auto w-full pb-32">
        <Link 
          href="/guides"
          className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mb-12 block"
        >
          ← Back to Guides
        </Link>
        
        <header className="mb-16 text-center">
          <span className="text-xs tracking-widest uppercase text-brand-accent mb-6 block">Deep Dive</span>
          <h1 className="text-5xl md:text-7xl font-serif text-brand-text mb-8 text-balance">
            {guide.title}
          </h1>
          {guide.subtitle && (
            <p className="text-xl md:text-2xl text-brand-soft font-serif italic text-balance mb-12 max-w-2xl mx-auto">
              {guide.subtitle}
            </p>
          )}
          
          {guide.coverImage && (
            <div className="relative aspect-[21/9] w-full overflow-hidden bg-brand-card border border-brand-border rounded-xl mb-16 shadow-lg">
              <Image
                src={urlFor(guide.coverImage).width(1200).height(600).url()}
                alt={guide.title}
                fill
                className="object-cover w-full h-full opacity-90"
              />
            </div>
          )}
        </header>

        <ReadingTextWrapper>
          <div className="max-w-3xl mx-auto">
            {guide.content ? <PortableText value={guide.content} /> : <p>The guide is empty.</p>}
          </div>
        </ReadingTextWrapper>

        <div className="mt-32 pt-16 border-t border-brand-border text-center">
          <p className="font-serif text-2xl text-brand-text italic mb-6">Did you find this space helpful?</p>
          <Link href="/reset" className="px-8 py-4 bg-brand-text text-brand-bg hover:bg-brand-accent hover:text-white transition-colors duration-500 rounded-full text-sm tracking-widest uppercase mx-auto inline-block">
            Start the 7-Day Reset
          </Link>
        </div>
      </article>
    </>
  );
}
