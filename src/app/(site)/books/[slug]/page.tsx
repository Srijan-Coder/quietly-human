import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { SecureDownloadButton } from "@/components/global/SecureDownloadButton";
import { SaveButton } from "@/components/global/SaveButton";
import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import { CustomPortableText } from "@/components/global/CustomPortableText";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const currentSlug = resolvedParams.slug;
  const baseSlug = currentSlug.endsWith("-ebook") ? currentSlug.replace(/-ebook$/, "") : currentSlug;

  const book = await client.fetch(
    groq`*[_type in ["ebook", "book", "product"] && slug.current == $baseSlug][0]{ title, author, coverImage }`,
    { baseSlug }
  );

  if (!book) return {};

  const ogImage = book.coverImage ? urlFor(book.coverImage)?.width(1200).height(630).url() : undefined;

  return {
    title: `${book.title} | The Library`,
    description: `Download or purchase ${book.title}.`,
    alternates: {
      canonical: `https://www.quietlyhumans.space/books/${baseSlug}`,
    },
    openGraph: {
      title: book.title,
      description: `Explore ${book.title}.`,
      type: "book",
      url: `https://www.quietlyhumans.space/books/${baseSlug}`,
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
  const currentSlug = resolvedParams.slug;
  const isEbookSlug = currentSlug.endsWith("-ebook");
  const baseSlug = isEbookSlug ? currentSlug.replace(/-ebook$/, "") : currentSlug;
  const ebookSlug = baseSlug + "-ebook";
  
  const { userId } = await auth();

  // If the user visits the -ebook URL, and the base book exists, redirect them to the consolidated base page
  if (isEbookSlug) {
    const baseBookExists = await client.fetch(
      groq`defined(*[_type in ["ebook", "book", "product"] && slug.current == $baseSlug][0]._id)`,
      { baseSlug }
    );
    if (baseBookExists) {
      redirect(`/books/${baseSlug}`);
    }
  }

  // Fetch base book and ebook documents in a single query
  const documents = await client.fetch(
    groq`*[_type in ["ebook", "book", "product"] && (slug.current == $baseSlug || slug.current == $ebookSlug)]{
      _id,
      _type,
      title,
      "slug": slug.current,
      author,
      coverImage,
      description,
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
    { baseSlug, ebookSlug }
  );

  if (!documents || documents.length === 0) {
    notFound();
  }

  // Identify base and ebook documents
  const baseBook = documents.find((doc: any) => doc.slug === baseSlug) || documents[0];
  const ebookBook = documents.find((doc: any) => doc.slug === ebookSlug) || (baseBook.bookFormat !== 'physical' ? baseBook : null);

  const title = baseBook.title;
  const author = baseBook.author || "Srijan Pandey";
  const coverImage = baseBook.coverImage || ebookBook?.coverImage;
  const emotionTags = baseBook.emotionTags || ebookBook?.emotionTags;

  const hasPhysical = baseBook.bookFormat === 'physical' || (baseBook.purchaseLinks && baseBook.purchaseLinks.length > 0);
  const hasEbook = !!ebookBook;

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-5xl mx-auto w-full pb-32">
      <Link href="/books" className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mb-12 block">
        ← Back to Library
      </Link>
      
      <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-start">
        {/* Cover Image */}
        <div className="w-full md:w-2/5 shrink-0">
          <div className="relative aspect-[2/3] w-full overflow-hidden bg-brand-card rounded-xl border border-brand-border shadow-2xl animate-fade-in">
            {coverImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={urlFor(coverImage)?.url()}
                alt={title}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center opacity-50">
                <span className="font-serif text-3xl mb-4">{title}</span>
                <span className="text-sm uppercase tracking-widest">{author}</span>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="w-full md:w-3/5">
          <div className="flex justify-between items-start gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-serif text-brand-text text-balance">
              {title}
            </h1>
            <SaveButton 
              item={{
                id: baseSlug,
                title: title,
                url: `/books/${baseSlug}`,
                type: "Book"
              }} 
            />
          </div>
          
          <p className="text-lg text-brand-soft uppercase tracking-widest mb-10 font-sans">
            By {author}
          </p>

          {/* Description */}
          <div className="mb-12">
            <h3 className="text-xs uppercase tracking-widest text-brand-text mb-4 font-sans font-bold">About this resource</h3>
            {baseBook.description ? (
              <div className="prose prose-invert prose-brand text-brand-soft text-sm leading-relaxed max-w-none font-serif">
                <CustomPortableText value={baseBook.description} />
              </div>
            ) : (
              <p className="text-brand-soft leading-relaxed font-serif text-sm">
                This digital resource is part of the Quietly Humans library. It is designed to help you process emotions, structure your thoughts, and find moments of stillness in a loud world.
              </p>
            )}
          </div>

          {/* Emotion Tags */}
          {emotionTags && emotionTags.length > 0 && (
            <div className="mb-12">
              <div className="flex flex-wrap gap-2">
                {emotionTags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-brand-card border border-brand-border rounded-full text-[10px] uppercase tracking-widest text-brand-soft font-sans">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Purchase / Download Options Card */}
          <div className="pt-8 border-t border-brand-border flex flex-col gap-6 w-full">
            
            {/* EBOOK FORMAT OPTION */}
            {hasEbook && ebookBook && (
              <div className="p-6 bg-brand-card border border-brand-border rounded-2xl shadow-lg relative overflow-hidden group w-full">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <h3 className="text-xs uppercase tracking-widest text-brand-text mb-4 font-sans font-bold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"></span>
                  Digital Ebook
                </h3>
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-6 mb-2">
                    {ebookBook.bookFormat === 'premium' ? (
                      <span className="text-3xl font-serif text-brand-text">${ebookBook.price || 0}</span>
                    ) : (
                      <span className="text-3xl font-serif text-brand-accent">Free Download</span>
                    )}
                  </div>
                  
                  {/* Action Button */}
                  <div className="flex flex-wrap gap-4 w-full">
                    {ebookBook.bookFormat === 'premium' ? (
                      ebookBook.purchaseUrl || ebookBook.productLink ? (
                        <a 
                          href={ebookBook.purchaseUrl || ebookBook.productLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-10 py-4 bg-brand-accent text-white rounded-full text-sm uppercase tracking-widest hover:bg-brand-text transition-all duration-300 shadow-[0_0_20px_rgba(252,163,17,0.2)] hover:shadow-[0_0_30px_rgba(252,163,17,0.4)] text-center w-full md:w-auto font-sans font-bold cursor-pointer"
                        >
                          Purchase Ebook (${ebookBook.price || 0})
                        </a>
                      ) : (
                        <button disabled className="px-8 py-4 bg-brand-card text-brand-soft border border-brand-border rounded-full text-sm uppercase tracking-widest cursor-not-allowed font-sans">
                          Currently Unavailable
                        </button>
                      )
                    ) : (
                      // Free Ebook actions
                      <div className="flex flex-wrap gap-4 w-full">
                        {userId ? (
                          <>
                            {ebookBook.fileUrl && <SecureDownloadButton fileUrl={ebookBook.fileUrl} title={title} />}
                            {ebookBook.notionUrl && (
                              <a 
                                href={ebookBook.notionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-8 py-4 bg-brand-text text-brand-bg rounded-full text-sm uppercase tracking-widest hover:bg-brand-accent transition-colors shadow-lg font-sans font-bold"
                              >
                                Open in Notion
                              </a>
                            )}
                            {ebookBook.hasChapters && (
                              <Link 
                                href={`/read/${ebookBook.slug}`}
                                className="inline-block px-8 py-4 bg-brand-card border border-brand-border text-brand-text rounded-full text-sm uppercase tracking-widest hover:border-brand-accent transition-colors font-sans font-bold"
                              >
                                Read Online
                              </Link>
                            )}
                          </>
                        ) : (
                          <div>
                            <SignInButton mode="modal">
                              <button className="px-8 py-4 bg-brand-accent text-white rounded-full text-sm uppercase tracking-widest hover:bg-brand-text transition-colors shadow-lg font-sans font-bold">
                                Create Account to Download
                              </button>
                            </SignInButton>
                            <p className="text-xs text-brand-soft mt-3 italic font-serif">
                              * This file is encrypted. Please sign in to download.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Bullet points for what's included ("bullet point bar") */}
                  {ebookBook.whatsIncluded && ebookBook.whatsIncluded.length > 0 && (
                    <div className="mt-4 border-t border-brand-border/20 pt-4 font-sans">
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                        {ebookBook.whatsIncluded.map((item: string, i: number) => (
                          <li key={i} className="text-brand-soft flex items-start gap-2 text-xs">
                            <span className="text-brand-accent mt-0.5 font-bold">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PHYSICAL PRINT OPTION */}
            {hasPhysical && (
              <div className="p-6 bg-brand-card/45 border border-brand-border rounded-2xl shadow-sm w-full">
                <h3 className="text-xs uppercase tracking-widest text-brand-text mb-4 font-sans font-bold">
                  Print Edition
                </h3>
                <div className="flex flex-wrap gap-4">
                  {baseBook.purchaseLinks && baseBook.purchaseLinks.length > 0 ? (
                    baseBook.purchaseLinks.map((link: any, i: number) => (
                      <a 
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-brand-card border border-brand-border text-brand-text rounded-xl text-xs uppercase tracking-widest hover:border-brand-accent hover:text-brand-accent transition-colors font-sans font-bold cursor-pointer"
                      >
                        {link.store} ({link.format})
                      </a>
                    ))
                  ) : (
                    <span className="text-brand-soft text-sm font-serif italic">Links coming soon.</span>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Demo Chapter */}
      {((ebookBook && ebookBook.bookFormat === 'premium') || hasPhysical) && baseBook.demoChapter && (
        <div className="mt-32 pt-20 border-t border-brand-border max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-brand-text mb-4">Read a Sample</h2>
            <p className="text-brand-soft text-xs uppercase tracking-widest font-sans">A preview from the book</p>
          </div>
          <div className="prose prose-invert prose-brand max-w-none font-serif text-brand-soft leading-relaxed">
            <CustomPortableText value={baseBook.demoChapter} />
          </div>
        </div>
      )}
    </div>
  );
}
