import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { SecureDownloadButton } from "@/components/global/SecureDownloadButton";
import { SaveButton } from "@/components/global/SaveButton";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const book = await client.fetch(
    groq`*[_type == "ebook" && slug.current == $slug][0]{ title, author, coverImage }`,
    { slug: resolvedParams.slug }
  );

  if (!book) return {};

  const ogImage = book.coverImage ? urlFor(book.coverImage)?.width(1200).height(630).url() : undefined;

  return {
    title: `${book.title} | The Library`,
    description: `Download the free ebook ${book.title} by ${book.author || "Quietly Humans"}.`,
    alternates: {
      canonical: `https://www.quietlyhumans.space/books/${resolvedParams.slug}`,
    },
    openGraph: {
      title: book.title,
      description: `Download the free ebook ${book.title} by ${book.author || "Quietly Humans"}.`,
      type: "book",
      url: `https://www.quietlyhumans.space/books/${resolvedParams.slug}`,
      images: ogImage ? [{ url: ogImage, alt: book.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: book.title,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function BookDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const book = await client.fetch(
    groq`*[_type == "ebook" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      author,
      coverImage,
      "fileUrl": ebookFile.asset->url,
      notionUrl,
      emotionTags
    }`,
    { slug: resolvedParams.slug }
  );

  if (!book) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-5xl mx-auto w-full pb-32">
      <Link href="/books" className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mb-12 block">
        ← Back to Library
      </Link>
      
      <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-start">
        {/* Cover Image */}
        <div className="w-full md:w-2/5 shrink-0">
          <div className="relative aspect-[2/3] w-full overflow-hidden bg-brand-card rounded-xl border border-brand-border shadow-2xl">
            {book.coverImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={urlFor(book.coverImage)?.url()}
                alt={book.title}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center opacity-50">
                <span className="font-serif text-3xl mb-4">{book.title}</span>
                <span className="text-sm uppercase tracking-widest">{book.author || "Srijan Pandey"}</span>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="w-full md:w-3/5">
          <div className="flex justify-between items-start gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-serif text-brand-text text-balance">
              {book.title}
            </h1>
            <SaveButton 
              item={{
                id: book.slug,
                title: book.title,
                url: `/books/${book.slug}`,
                type: "Book"
              }} 
            />
          </div>
          
          <p className="text-lg text-brand-soft uppercase tracking-widest mb-10">
            By {book.author || "Srijan Pandey"}
          </p>

          <div className="mb-12">
            <h3 className="text-xs uppercase tracking-widest text-brand-text mb-4">About this resource</h3>
            <p className="text-brand-soft leading-relaxed">
              This digital resource is part of the Quietly Humans library. It is designed to help you process emotions, structure your thoughts, and find moments of stillness in a loud world.
            </p>
          </div>

          {book.emotionTags && book.emotionTags.length > 0 && (
            <div className="mb-12">
              <div className="flex flex-wrap gap-2">
                {book.emotionTags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-brand-card border border-brand-border rounded-full text-[10px] uppercase tracking-widest text-brand-soft">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-8 border-t border-brand-border">
            {book.fileUrl ? (
              <SecureDownloadButton fileUrl={book.fileUrl} />
            ) : book.notionUrl ? (
              <a 
                href={book.notionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-brand-text text-brand-bg rounded-full text-sm uppercase tracking-widest hover:bg-brand-accent transition-colors shadow-lg"
              >
                Open in Notion
              </a>
            ) : (
              <button disabled className="px-8 py-4 bg-brand-card text-brand-soft border border-brand-border rounded-full text-sm uppercase tracking-widest cursor-not-allowed">
                File not available
              </button>
            )}
          </div>
          <p className="text-xs text-brand-soft mt-4 italic">
            * This file is securely encrypted. You must be signed into your community account to download.
          </p>
        </div>
      </div>
    </div>
  );
}
