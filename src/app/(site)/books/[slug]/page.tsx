import { client } from "@/sanity/lib/client";
import { ebookBySlugQuery } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { Metadata } from "next";
import Image from "next/image";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const book = await client.fetch(ebookBySlugQuery, { slug: resolvedParams.slug });
  if (!book) return {};

  const ogImage = book.coverImage ? urlFor(book.coverImage)?.width(1200).height(630).url() : undefined;

  return {
    title: book.title,
    description: `Read ${book.title} by ${book.author || 'Quietly Humans'}`,
    alternates: {
      canonical: `https://www.quietlyhumans.space/books/${book.slug}`,
    },
    openGraph: {
      title: book.title,
      description: `Read ${book.title} by ${book.author || 'Quietly Humans'}`,
      type: "book",
      url: `https://www.quietlyhumans.space/books/${book.slug}`,
      images: ogImage ? [{ url: ogImage, alt: book.coverImage?.alt || book.title }] : undefined,
    },
  };
}

export default async function EbookPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let book = null;
  try {
    book = await client.fetch(ebookBySlugQuery, { slug: resolvedParams.slug });
  } catch (error) {
    console.warn("Failed to fetch ebook from Sanity:", error);
  }

  if (!book) {
    notFound();
  }

  const readLink = book.fileUrl || book.notionUrl || "#";

  return (
    <article className="min-h-screen pt-32 px-6 md:px-12 max-w-4xl mx-auto w-full pb-32 flex flex-col items-center">
      <Link 
        href="/library"
        className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mb-12 self-start"
      >
        ← Back to Library
      </Link>
      
      <header className="mb-16 text-center flex flex-col items-center w-full max-w-2xl">
        <span className="text-xs tracking-widest uppercase text-brand-accent mb-6 block">Free Resource</span>
        <h1 className="text-4xl md:text-6xl font-serif text-brand-text mb-6 text-balance">
          {book.title}
        </h1>
        {book.author && (
          <p className="text-sm uppercase tracking-widest text-brand-soft mb-12">
            By {book.author}
          </p>
        )}
        
        {book.coverImage ? (
          <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden bg-brand-card border border-brand-border rounded-xl shadow-2xl mb-12 transition-transform duration-700 hover:scale-105">
            <Image
              src={urlFor(book.coverImage).width(800).height(1066).url()}
              alt={book.coverImage?.alt || book.title}
              fill
              className="object-cover w-full h-full opacity-90"
            />
          </div>
        ) : (
          <div className="aspect-[3/4] w-full max-w-md bg-brand-card border border-brand-border rounded-xl shadow-2xl mb-12 flex flex-col items-center justify-center p-8 text-center transition-transform duration-700 hover:scale-105">
            <span className="font-serif text-2xl text-brand-text mb-4">{book.title}</span>
            <span className="text-xs uppercase tracking-widest text-brand-soft">Quietly Humans</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
          <a
            href={readLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-brand-text text-brand-bg hover:bg-brand-accent hover:text-white transition-colors duration-500 rounded-full text-xs tracking-widest uppercase"
          >
            {book.fileUrl ? "Download PDF ⬇️" : (book.notionUrl ? "Read on Notion 📖" : "Coming Soon 🕰️")}
          </a>
        </div>
      </header>

      {book.chapters && book.chapters.length > 0 && (
        <section className="w-full max-w-2xl mt-16 border-t border-brand-border pt-16">
          <h2 className="font-serif text-3xl text-brand-text mb-8 text-center">Chapters</h2>
          <ul className="space-y-4">
            {book.chapters.map((chapter: string, i: number) => (
              <li key={i} className="flex gap-4 text-brand-soft items-start">
                <span className="text-xs uppercase tracking-widest mt-1 opacity-50 w-8">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-lg leading-relaxed">{chapter}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-32 pt-16 border-t border-brand-border w-full text-center">
        <p className="font-serif text-2xl text-brand-text italic mb-6">Need more quiet space?</p>
        <Link href="/search" className="px-8 py-4 border border-brand-border hover:border-brand-accent text-brand-text hover:text-brand-accent transition-colors duration-500 rounded-full text-sm tracking-widest uppercase mx-auto inline-block">
          Explore Emotional Search
        </Link>
      </div>
    </article>
  );
}
