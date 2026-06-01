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
import { supabaseAdmin } from "@/lib/supabase";
import CommentSectionClient from "@/components/global/CommentSectionClient";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const currentSlug = resolvedParams.slug;
  const baseSlug = currentSlug.endsWith("-ebook") ? currentSlug.replace(/-ebook$/, "") : currentSlug;

  let book = null;
  try {
    book = await client.fetch(
      groq`*[_type in ["ebook", "book", "product"] && slug.current == $baseSlug][0]{ title, author, coverImage }`,
      { baseSlug }
    );
  } catch (err) {
    console.error("Metadata fetch failed:", err);
  }

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
    try {
      const baseBookExists = await client.fetch(
        groq`defined(*[_type in ["ebook", "book", "product"] && slug.current == $baseSlug][0]._id)`,
        { baseSlug }
      );
      if (baseBookExists) {
        redirect(`/books/${baseSlug}`);
      }
    } catch (e) {
      console.error("Sanity exists check failed:", e);
    }
  }

  // Fetch base book and ebook documents in a single query
  let documents = [];
  try {
    documents = await client.fetch(
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
  } catch (sanityError) {
    console.error("Sanity fetch error in book details:", sanityError);
  }

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

  // Sync Sanity Book with Supabase posts table to enable comment/reviews section
  let supabasePost = null;
  try {
    const { data: existingPost } = await supabaseAdmin
      .from("posts")
      .select("id, author_id, content")
      .eq("slug", baseSlug)
      .maybeSingle();

    // Helper to extract plain text description from Sanity PortableText
    const getSanityDescription = () => {
      const desc = baseBook.description || ebookBook?.description;
      if (!desc) return "Sanity Ebook Sync";
      if (typeof desc === 'string') return desc;
      if (Array.isArray(desc)) {
        return desc
          .map(block => {
            if (block._type !== 'block' || !block.children) return '';
            return block.children.map((child: any) => child.text).join('');
          })
          .join('\n\n');
      }
      return "Sanity Ebook Sync";
    };

    const targetContent = getSanityDescription();

    if (existingPost) {
      supabasePost = existingPost;
      // If the content is still a placeholder or empty, let's update it in Supabase
      if (existingPost.content === "sanity_book_sync" || !existingPost.content || existingPost.content === "Sanity Ebook Sync") {
        await supabaseAdmin
          .from("posts")
          .update({ content: targetContent, title: title })
          .eq("id", existingPost.id);
      }
    } else {
      // Find the first/earliest profile in the database (admin/creator)
      const { data: firstProfile } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (firstProfile) {
        const { data: newPost, error: insertError } = await supabaseAdmin
          .from("posts")
          .insert([{
            author_id: firstProfile.id,
            type: "ebook",
            title: title,
            slug: baseSlug,
            content: targetContent,
            is_draft: false,
            published_at: new Date().toISOString()
          }])
          .select("id, author_id")
          .maybeSingle();

        if (insertError) {
          console.error("Failed to insert synced post for comments:", insertError);
        } else {
          supabasePost = newPost;
        }
      }
    }
  } catch (dbError) {
    console.error("Database connection error in book syncing:", dbError);
  }

  // Get viewer's premium status
  let isPremiumViewer = false;
  if (userId) {
    try {
      const { data: viewerProf } = await supabaseAdmin
        .from("profiles")
        .select("is_premium")
        .eq("id", userId)
        .maybeSingle();
      isPremiumViewer = viewerProf?.is_premium || false;
    } catch (e) {
      console.error("Failed to fetch viewer profile premium status:", e);
    }
  }

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-5xl mx-auto w-full pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Book",
            "name": title,
            "author": {
              "@type": "Person",
              "name": author
            },
            "image": coverImage ? urlFor(coverImage)?.width(600).url() : undefined,
            "publisher": {
              "@type": "Organization",
              "name": "Quietly Humans",
              "url": "https://quietlyhumans.space"
            },
            "offers": ebookBook ? {
              "@type": "Offer",
              "price": ebookBook.bookFormat === 'premium' ? ebookBook.price || 0 : 0,
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "url": `https://www.quietlyhumans.space/books/${baseSlug}`
            } : undefined
          })
        }}
      />
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

          {/* Purchase / Download Options Cards (Side by Side Grid) */}
          <div className={`pt-8 border-t border-brand-border grid gap-6 w-full items-stretch ${
            hasEbook && hasPhysical ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
          }`}>
            
            {/* EBOOK FORMAT OPTION */}
            {hasEbook && ebookBook && (
              <div className="p-6 bg-brand-card border border-brand-border rounded-2xl shadow-lg relative overflow-hidden group flex flex-col justify-between">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <div>
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
                            className="inline-block px-8 py-4 bg-brand-accent text-white rounded-full text-xs uppercase tracking-widest hover:bg-brand-text transition-all duration-300 shadow-[0_0_20px_rgba(252,163,17,0.2)] hover:shadow-[0_0_30px_rgba(252,163,17,0.4)] text-center w-full font-sans font-bold cursor-pointer"
                          >
                            Purchase Ebook (${ebookBook.price || 0})
                          </a>
                        ) : (
                          <button disabled className="px-8 py-4 bg-brand-card text-brand-soft border border-brand-border rounded-full text-xs uppercase tracking-widest cursor-not-allowed font-sans w-full">
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
                                  className="inline-block px-8 py-4 bg-brand-text text-brand-bg rounded-full text-xs uppercase tracking-widest hover:bg-brand-accent transition-colors shadow-lg font-sans font-bold w-full text-center"
                                >
                                  Open in Notion
                                </a>
                              )}
                              {ebookBook.hasChapters && (
                                <Link 
                                  href={`/read/${ebookBook.slug}`}
                                  className="inline-block px-8 py-4 bg-brand-card border border-brand-border text-brand-text rounded-full text-xs uppercase tracking-widest hover:border-brand-accent transition-colors font-sans font-bold w-full text-center"
                                >
                                  Read Online
                                </Link>
                              )}
                            </>
                          ) : (
                            <div className="w-full">
                              <SignInButton mode="modal">
                                <button className="px-8 py-4 bg-brand-accent text-white rounded-full text-xs uppercase tracking-widest hover:bg-brand-text transition-colors shadow-lg font-sans font-bold w-full">
                                  Create Account to Download
                                </button>
                              </SignInButton>
                              <p className="text-[10px] text-brand-soft mt-3 italic font-serif">
                                * Signed-in members only.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Bullet points for what's included ("bullet point bar") */}
                {ebookBook.whatsIncluded && ebookBook.whatsIncluded.length > 0 && (
                  <div className="mt-6 border-t border-brand-border/20 pt-4 font-sans w-full">
                    <ul className="flex flex-col gap-2">
                      {ebookBook.whatsIncluded.map((item: string, i: number) => (
                        <li key={i} className="text-brand-soft flex items-start gap-2 text-[10px] leading-relaxed">
                          <span className="text-brand-accent font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* PHYSICAL PRINT OPTION */}
            {hasPhysical && (
              <div className="p-6 bg-brand-card/45 border border-brand-border rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-brand-text mb-4 font-sans font-bold">
                    Print Edition
                  </h3>
                  <p className="text-[11px] text-brand-soft leading-relaxed mb-6 font-sans">
                    Read the print edition on paper or your digital reader. Available in physical formats at major bookstores.
                  </p>
                </div>
                
                <div className="flex flex-col gap-3">
                  {baseBook.purchaseLinks && baseBook.purchaseLinks.length > 0 ? (
                    baseBook.purchaseLinks.map((link: any, i: number) => (
                      <a 
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-3 bg-brand-card border border-brand-border text-brand-text rounded-xl text-[10px] uppercase tracking-widest hover:border-brand-accent hover:text-brand-accent transition-colors font-sans font-bold cursor-pointer text-center"
                      >
                        {link.store} ({link.format})
                      </a>
                    ))
                  ) : (
                    <span className="text-brand-soft text-sm font-serif italic text-center">Links coming soon.</span>
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

      {/* Reviews/Comments Section */}
      {supabasePost && (
        <div className="mt-32 pt-20 border-t border-brand-border/20 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-brand-text mb-2">Reader Reviews</h2>
            <p className="text-brand-soft text-xs uppercase tracking-widest font-sans">Share your thoughts and review this book</p>
          </div>
          <CommentSectionClient 
            postId={supabasePost.id} 
            postAuthorId={supabasePost.author_id} 
            isPremium={isPremiumViewer} 
          />
        </div>
      )}

    </div>
  );
}
