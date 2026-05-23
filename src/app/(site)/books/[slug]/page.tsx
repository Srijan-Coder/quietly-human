import { client } from "@/sanity/lib/client";
import { bookBySlugQuery } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { Metadata } from "next";
import Image from "next/image";
import { CustomPortableText } from "@/components/global/CustomPortableText";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const book = await client.fetch(bookBySlugQuery, { slug: resolvedParams.slug });
  if (!book) return {};

  const ogImage = book.coverImage?.asset ? urlFor(book.coverImage).width(1200).height(630).url() : undefined;

  return {
    title: book.title,
    description: book.tagline || `Read ${book.title} by ${book.author || 'Quietly Humans'}`,
    alternates: {
      canonical: `https://www.quietlyhumans.space/books/${book.slug}`,
    },
    openGraph: {
      title: book.title,
      description: book.tagline || `Read ${book.title} by ${book.author || 'Quietly Humans'}`,
      type: "book",
      url: `https://www.quietlyhumans.space/books/${book.slug}`,
      images: ogImage ? [{ url: ogImage, alt: book.coverImage?.alt || book.title }] : undefined,
    },
  };
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let book = null;
  try {
    book = await client.fetch(bookBySlugQuery, { slug: resolvedParams.slug });
  } catch (error) {
    console.warn("Failed to fetch book from Sanity:", error);
  }

  if (!book) {
    notFound();
  }

  const isFree = book.bookFormat === 'free';
  const isPremium = book.bookFormat === 'premium';
  const isPhysical = book.bookFormat === 'physical';

  return (
    <article className="min-h-screen pt-32 px-6 md:px-12 max-w-4xl mx-auto w-full pb-32 flex flex-col items-center">
      <Link 
        href="/books"
        className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mb-12 self-start"
      >
        ← Back to Library
      </Link>
      
      <header className="mb-16 text-center flex flex-col items-center w-full max-w-2xl">
        <span className="text-xs tracking-widest uppercase text-brand-accent mb-6 block">
          {isFree ? "Free Resource" : isPremium ? "Premium Ebook" : "Physical Book"}
        </span>
        <h1 className="text-4xl md:text-6xl font-serif text-brand-text mb-6 text-balance">
          {book.title}
        </h1>
        {book.author && (
          <p className="text-sm uppercase tracking-widest text-brand-soft mb-12">
            By {book.author}
          </p>
        )}
        
        {book.coverImage?.asset ? (
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

        {/* Dynamic Action Buttons based on Book Format */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4 mb-12 flex-wrap">
          {isFree && (
            <a
              href={book.fileUrl || book.notionUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-brand-text text-brand-bg hover:bg-brand-accent hover:text-white transition-colors duration-500 rounded-full text-xs tracking-widest uppercase"
            >
              {book.fileUrl ? "Download PDF ⬇️" : (book.notionUrl ? "Read on Notion 📖" : "Coming Soon 🕰️")}
            </a>
          )}

          {isPremium && (
            <div className="flex flex-col items-center gap-4">
              {book.price && <span className="font-serif text-2xl text-brand-text">${book.price}</span>}
              <a
                href={book.purchaseUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-brand-text text-brand-bg hover:bg-brand-accent hover:text-white transition-colors duration-500 rounded-full text-xs tracking-widest uppercase shadow-xl"
              >
                {book.purchaseUrl ? "Purchase Ebook 📖" : "Coming Soon 🕰️"}
              </a>
            </div>
          )}

          {isPhysical && book.purchaseLinks && book.purchaseLinks.length > 0 && (
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              {book.purchaseLinks.map((link: any, i: number) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 border border-brand-border bg-brand-card hover:border-brand-accent text-brand-text hover:text-brand-accent transition-colors duration-500 rounded-full text-xs tracking-widest uppercase flex flex-col items-center gap-1 shadow-sm"
                >
                  <span className="font-serif text-lg lowercase italic opacity-80">{link.format}</span>
                  <span className="text-[10px] uppercase tracking-widest opacity-60">via {link.store}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Description */}
      {book.description && (
        <div className="w-full max-w-2xl text-lg text-brand-soft prose-p:leading-relaxed prose-p:mb-6 mx-auto text-balance text-center">
          <CustomPortableText value={book.description} />
        </div>
      )}

      {/* Premium Ebook: What's Included */}
      {isPremium && book.whatsIncluded && book.whatsIncluded.length > 0 && (
        <section className="w-full max-w-xl mx-auto mt-16 p-8 bg-brand-card border border-brand-border rounded-2xl shadow-sm">
          <h3 className="font-serif text-2xl text-brand-text mb-6 text-center">What's Included</h3>
          <ul className="space-y-4">
            {book.whatsIncluded.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-4 text-brand-soft">
                <span className="text-brand-accent mt-1">✦</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Demo Chapter (For Premium & Physical) */}
      {(isPremium || isPhysical) && book.demoChapter && (
        <section className="w-full max-w-3xl mt-32 border-t border-brand-border pt-16">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-brand-accent block mb-4">Read a Sample</span>
            <h2 className="font-serif text-4xl text-brand-text">Demo Chapter</h2>
          </div>
          <div className="bg-brand-card p-8 md:p-16 border border-brand-border rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-20" />
            <div className="max-w-none text-brand-soft prose-p:leading-loose prose-p:text-lg prose-p:mb-8 font-serif">
              <CustomPortableText value={book.demoChapter} />
            </div>
            
            <div className="mt-16 pt-8 border-t border-brand-border/30 text-center">
               <p className="font-serif text-xl text-brand-text italic mb-6">Enjoyed this chapter?</p>
               {isPhysical && book.purchaseLinks && book.purchaseLinks.length > 0 && (
                 <a href={book.purchaseLinks[0]?.url} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest text-brand-accent hover:text-brand-text transition-colors border-b border-brand-accent pb-1">
                   Get the full book 📖
                 </a>
               )}
               {isPremium && book.purchaseUrl && (
                 <a href={book.purchaseUrl} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest text-brand-accent hover:text-brand-text transition-colors border-b border-brand-accent pb-1">
                   Get the full ebook 📖
                 </a>
               )}
            </div>
          </div>
        </section>
      )}

      {/* Free Ebook: Chapters */}
      {isFree && book.chapters && book.chapters.length > 0 && (
        <section className="w-full max-w-2xl mt-16 border-t border-brand-border pt-16">
          <h2 className="font-serif text-3xl text-brand-text mb-8 text-center">Chapters</h2>
          <ul className="space-y-4">
            {book.chapters.map((chapter: any, i: number) => (
              <li key={i} className="flex flex-col gap-2 text-brand-soft items-start mb-8">
                <div className="flex gap-4 items-center">
                  <span className="text-xs uppercase tracking-widest opacity-50 w-8">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-serif text-2xl text-brand-text">{chapter.chapterTitle}</span>
                </div>
                {chapter.content && (
                  <div className="pl-12 max-w-none text-brand-soft prose-p:leading-relaxed">
                    <CustomPortableText value={chapter.content} />
                  </div>
                )}
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
