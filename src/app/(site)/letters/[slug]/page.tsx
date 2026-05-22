import { client } from "@/sanity/lib/client";
import { letterBySlugQuery } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SaveButton } from "@/components/global/SaveButton";
import { ReadingController } from "@/components/global/ReadingController";
import { ReadingTextWrapper } from "@/components/global/ReadingTextWrapper";

export const revalidate = 60;

export default async function LetterPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let letter = null;
  try {
    letter = await client.fetch(letterBySlugQuery, { slug: resolvedParams.slug });
  } catch (error) {
    console.warn("Failed to fetch letter from Sanity:", error);
  }

  if (!letter) {
    notFound();
  }

  return (
    <>
      <ReadingController />
      <article className="min-h-screen pt-32 px-6 md:px-12 max-w-3xl mx-auto w-full pb-32">
        <Link 
          href="/letters"
          className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mb-16 block"
        >
          ← Back to Archive
        </Link>
        
        <header className="mb-20">
          <div className="flex justify-between items-start gap-4 mb-6">
            <div className="text-xs uppercase tracking-widest text-brand-soft">
              {new Date(letter.publishedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <SaveButton 
              item={{
                id: letter._id,
                title: letter.title,
                url: `/letters/${resolvedParams.slug}`,
                type: "letter"
              }} 
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-brand-text leading-tight text-balance">
            {letter.title}
          </h1>
        </header>

        <ReadingTextWrapper>
          <div className="prose prose-lg prose-stone max-w-none font-sans text-brand-soft leading-loose prose-a:text-brand-accent prose-p:mb-8">
            {letter.body ? <PortableText value={letter.body} /> : <p>This letter is blank.</p>}
          </div>
        </ReadingTextWrapper>

        <div className="mt-24 pt-16 border-t border-brand-border text-center">
          <span className="font-serif text-2xl text-brand-text block mb-6">Receive the next letter directly in your inbox.</span>
          <form className="flex flex-col md:flex-row justify-center max-w-md mx-auto gap-4">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 bg-transparent border-b border-brand-border py-3 focus:outline-none focus:border-brand-accent transition-colors text-brand-text placeholder-brand-soft/50"
            />
            <button type="button" className="text-xs tracking-widest uppercase text-brand-accent hover:text-brand-text transition-colors border border-brand-accent hover:border-brand-text px-6 py-3 rounded-full">
              Subscribe
            </button>
          </form>
        </div>
      </article>
    </>
  );
}
