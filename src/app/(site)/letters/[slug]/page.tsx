import { client } from "@/sanity/lib/client";
import { letterBySlugQuery } from "@/sanity/lib/queries";
import { CustomPortableText } from "@/components/global/CustomPortableText";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SaveButton } from "@/components/global/SaveButton";
import { ReadingController } from "@/components/global/ReadingController";
import { ReadingTextWrapper } from "@/components/global/ReadingTextWrapper";
import { LetterPaperBox } from "@/components/global/LetterPaperBox";
import { ClientCopyButton } from "@/components/global/ClientCopyButton";

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
          className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mb-12 block"
        >
          ← Back to Mailbox
        </Link>
        
        <header className="mb-16 border-b border-brand-border pb-12">
          <div className="flex justify-between items-start gap-4 mb-6">
            <span className="text-xs tracking-widest uppercase text-brand-soft font-mono">
              Sent: {new Date(letter.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <SaveButton 
              item={{
                id: letter._id,
                title: letter.title,
                url: `/letters/${resolvedParams.slug}`,
                type: "letter"
              }} 
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-brand-text mb-8 text-balance">
            {letter.title}
          </h1>
          {letter.excerpt && (
            <p className="text-lg text-brand-soft font-serif italic text-balance border-l-2 border-brand-border pl-4">
              {letter.excerpt}
            </p>
          )}
        </header>

        <ReadingTextWrapper>
          <div className="max-w-none pb-16">
            {letter.body ? (
              <LetterPaperBox>
                <CustomPortableText value={letter.body} />
              </LetterPaperBox>
            ) : (
              <p className="text-brand-soft">This letter is blank.</p>
            )}
          </div>
        </ReadingTextWrapper>

        <div className="mt-20 p-8 bg-brand-card border border-brand-border rounded-xl text-center">
          <p className="font-serif text-xl text-brand-text mb-4">Did this letter resonate?</p>
          <p className="text-brand-soft text-sm mb-6">Forward it to a friend who might need these words tonight.</p>
          <ClientCopyButton />
        </div>
      </article>
    </>
  );
}
