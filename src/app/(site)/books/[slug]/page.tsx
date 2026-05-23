import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { SecureDownloadButton } from "@/components/global/SecureDownloadButton";
import { SaveButton } from "@/components/global/SaveButton";
import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import { PortableText } from "@portabletext/react";
import { CustomPortableText } from "@/components/global/CustomPortableText";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const book = await client.fetch(
    groq`*[_type in ["ebook", "book", "product"] && slug.current == $slug][0]{ title, author, coverImage }`,
    { slug: resolvedParams.slug }
  );

  if (!book) return {};

  const ogImage = book.coverImage ? urlFor(book.coverImage)?.width(1200).height(630).url() : undefined;

  return {
    title: `${book.title} | The Library`,
    description: `Download or purchase ${book.title}.`,
    alternates: {
      canonical: `https://www.quietlyhumans.space/books/${resolvedParams.slug}`,
    },
    openGraph: {
      title: book.title,
      description: `Explore ${book.title}.`,
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
  const { userId } = await auth();
  
  const book = await client.fetch(
    groq`*[_type in ["ebook", "book", "product"] && slug.current == $slug][0]{
      _id,
      _type,
      title,
      "slug": slug.current,
      author,
      coverImage,
      "fileUrl": ebookFile.asset->url,
      notionUrl,
      emotionTags,
      bookFormat,
      price,
      purchaseUrl,
      "productLink": link,
      whatsIncluded,
      purchaseLinks,
      demoChapter,
      "hasChapters": defined(chapters)
    }`,
    { slug: resolvedParams.slug }
  );

  if (!book) {
    notFound();
  }

  // Determine the effective format
  // If it's explicitly 'free', 'premium', or 'physical', use that.
  // Otherwise infer based on type or existing fields.
  let format = 'free';
  if (book.bookFormat) {
    format = book.bookFormat;
  } else if (book._type === 'product' || book.price) {
    format = 'premium';
  } else if (book.purchaseLinks && book.purchaseLinks.length > 0) {
    format = 'physical';
  }

  const effectivePrice = book.price || 0;
  const effectivePurchaseUrl = book.purchaseUrl || book.productLink;

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

          {/* Premium "What's Included" */}
          {format === 'premium' && book.whatsIncluded && book.whatsIncluded.length > 0 && (
            <div className="mb-12 p-6 bg-brand-card border border-brand-border rounded-xl">
              <h3 className="text-xs uppercase tracking-widest text-brand-text mb-4">What's Included</h3>
              <ul className="space-y-2">
                {book.whatsIncluded.map((item: string, i: number) => (
                  <li key={i} className="text-brand-soft flex items-start gap-2">
                    <span className="text-brand-accent mt-1">✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

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

          {/* Action Area based on Format */}
          <div className="pt-8 border-t border-brand-border">
            
            {/* FORMAT: FREE */}
            {format === 'free' && (
              <div className="flex flex-col gap-4">
                {userId ? (
                  <div className="flex flex-wrap gap-4">
                    {book.fileUrl && <SecureDownloadButton fileUrl={book.fileUrl} />}
                    {book.notionUrl && (
                      <a 
                        href={book.notionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-8 py-4 bg-brand-text text-brand-bg rounded-full text-sm uppercase tracking-widest hover:bg-brand-accent transition-colors shadow-lg"
                      >
                        Open in Notion
                      </a>
                    )}
                    {book.hasChapters && (
                      <Link 
                        href={`/read/${book.slug}`}
                        className="inline-block px-8 py-4 bg-brand-card border border-brand-border text-brand-text rounded-full text-sm uppercase tracking-widest hover:border-brand-accent transition-colors"
                      >
                        Read Online
                      </Link>
                    )}
                    {!book.fileUrl && !book.notionUrl && !book.hasChapters && (
                      <button disabled className="px-8 py-4 bg-brand-card text-brand-soft border border-brand-border rounded-full text-sm uppercase tracking-widest cursor-not-allowed">
                        File not available
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <SignInButton mode="modal">
                      <button className="px-8 py-4 bg-brand-accent text-white rounded-full text-sm uppercase tracking-widest hover:bg-brand-text transition-colors shadow-lg">
                        Create Account to Download
                      </button>
                    </SignInButton>
                    <p className="text-xs text-brand-soft mt-4 italic">
                      * This file is securely encrypted. You must be signed into your community account to download.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* FORMAT: PREMIUM */}
            {format === 'premium' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-6 mb-2">
                  <span className="text-3xl font-serif text-brand-text">${effectivePrice}</span>
                </div>
                {effectivePurchaseUrl ? (
                  <a 
                    href={effectivePurchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-10 py-5 bg-brand-accent text-white rounded-full text-sm uppercase tracking-widest hover:bg-brand-text transition-all duration-300 shadow-[0_0_20px_rgba(252,163,17,0.2)] hover:shadow-[0_0_30px_rgba(252,163,17,0.4)] text-center w-full md:w-auto"
                  >
                    Purchase Now
                  </a>
                ) : (
                  <button disabled className="px-8 py-4 bg-brand-card text-brand-soft border border-brand-border rounded-full text-sm uppercase tracking-widest cursor-not-allowed">
                    Currently Unavailable
                  </button>
                )}
                <p className="text-xs text-brand-soft mt-2 italic">
                  * Secure checkout via encrypted payment gateway.
                </p>
              </div>
            )}

            {/* FORMAT: PHYSICAL */}
            {format === 'physical' && (
              <div className="flex flex-col gap-4">
                <h3 className="text-xs uppercase tracking-widest text-brand-text mb-2">Available At:</h3>
                <div className="flex flex-wrap gap-4">
                  {book.purchaseLinks && book.purchaseLinks.length > 0 ? (
                    book.purchaseLinks.map((link: any, i: number) => (
                      <a 
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-brand-card border border-brand-border text-brand-text rounded-lg text-xs uppercase tracking-widest hover:border-brand-accent hover:text-brand-accent transition-colors"
                      >
                        {link.store} ({link.format})
                      </a>
                    ))
                  ) : (
                    <span className="text-brand-soft text-sm">Links coming soon.</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Demo Chapter (for Physical/Premium) */}
      {(format === 'physical' || format === 'premium') && book.demoChapter && (
        <div className="mt-32 pt-20 border-t border-brand-border max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif text-brand-text mb-4">Read a Sample</h2>
            <p className="text-brand-soft text-sm uppercase tracking-widest">A preview from the book</p>
          </div>
          <div className="prose prose-invert prose-brand max-w-none">
            <CustomPortableText value={book.demoChapter} />
          </div>
        </div>
      )}
    </div>
  );
}
