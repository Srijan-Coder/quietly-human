import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";

export interface EmotionPageData {
  headline: string;
  subheadline?: string;
  metaDescription?: string;
  openingParagraph?: string;
  featuredQuote?: string;
  relatedGuides?: {
    _id: string;
    title: string;
    slug: { current: string };
    excerpt?: string;
    mainImage?: unknown;
  }[];
  relatedBooks?: {
    _id: string;
    title: string;
    slug: { current: string };
    price?: number;
    coverImage?: unknown;
  }[];
}

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ emotion: string }> }) {
  const resolvedParams = await params;
  const emotion = resolvedParams.emotion;

  let page: EmotionPageData | null = null;
  try {
    page = await client.fetch(groq`*[_type == "seoEmotionPage" && emotion == $emotion][0]{ headline, metaDescription }`, { emotion });
    
    if (!page) {
      const dynamicData = await client.fetch(groq`{
        "guides": *[_type == "guide" && $emotion in emotionTags]{_id},
        "books": *[_type == "ebook" && $emotion in emotionTags]{_id},
        "letters": *[_type == "letter" && $emotion in emotionTags]{_id}
      }`, { emotion });
      
      if (dynamicData.guides.length > 0 || dynamicData.books.length > 0 || dynamicData.letters.length > 0) {
        page = {
          headline: `Resources for feeling ${emotion.replace(/-/g, ' ')}`,
          metaDescription: `Explore curated resources, books, and guides to support you when feeling ${emotion.replace(/-/g, ' ')}.`
        };
      }
    }
  } catch (error) { console.error(error); }
  
  if (!page) return { title: "Quietly Humans" };
  return {
    title: `${page.headline} — Quietly Humans`,
    description: page.metaDescription,
  };
}

export default async function SEOEmotionPage({ params }: { params: Promise<{ emotion: string }> }) {
  const resolvedParams = await params;
  const emotion = resolvedParams.emotion;

  let page: EmotionPageData | null = null;
  try {
    page = await client.fetch(
      groq`*[_type == "seoEmotionPage" && emotion == $emotion][0]{
        headline, subheadline, openingParagraph, featuredQuote,
        relatedGuides[]->{_id, title, slug, excerpt, mainImage},
        relatedBooks[]->{_id, title, slug, price, coverImage}
      }`,
      { emotion }
    );

    if (!page) {
      const dynamicData = await client.fetch(groq`{
        "relatedGuides": *[_type == "guide" && $emotion in emotionTags]{_id, title, slug, excerpt, mainImage},
        "relatedBooks": *[_type == "ebook" && $emotion in emotionTags]{_id, title, slug, price, coverImage}
      }`, { emotion });

      if (dynamicData.relatedGuides.length > 0 || dynamicData.relatedBooks.length > 0) {
        page = {
          headline: `Resources for feeling ${emotion.replace(/-/g, ' ')}`,
          subheadline: "You are not alone in this.",
          openingParagraph: "We have gathered a collection of books, guides, and resources specifically designed for this feeling. Take your time, breathe, and explore gently.",
          relatedGuides: dynamicData.relatedGuides,
          relatedBooks: dynamicData.relatedBooks,
        };
      }
    }
  } catch (error) { console.error(error); }

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-24">
          <span className="text-xs uppercase tracking-widest text-brand-accent mb-4 block">You searched for: {emotion.replace(/-/g, ' ')}</span>
          <h1 className="text-5xl md:text-7xl font-serif text-brand-text mb-6 text-balance leading-tight">{page.headline}</h1>
          {page.subheadline && <p className="text-xl md:text-2xl text-brand-soft font-serif italic mb-8">{page.subheadline}</p>}
          {page.openingParagraph && <p className="text-brand-text leading-relaxed max-w-2xl mx-auto">{page.openingParagraph}</p>}
        </div>

        {page.featuredQuote && (
           <div className="my-20 p-12 bg-brand-card border border-brand-border rounded-3xl text-center">
             <p className="font-serif text-2xl md:text-3xl text-brand-text italic leading-relaxed">&quot;{page.featuredQuote}&quot;</p>
           </div>
        )}

        {!!page.relatedGuides?.length && (
          <div className="mb-24">
            <h2 className="text-xs uppercase tracking-widest text-brand-accent mb-8 text-center">Words that might help</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {page.relatedGuides?.map((guide) => (
                 <Link key={guide._id} href={`/guides/${guide.slug?.current}`} className="group flex flex-col p-6 rounded-2xl border border-brand-border hover:border-brand-accent transition-colors bg-brand-bg">
                    <h3 className="font-serif text-xl text-brand-text group-hover:text-brand-accent mb-3">{guide.title}</h3>
                    <p className="text-brand-soft text-sm leading-relaxed line-clamp-3">{guide.excerpt}</p>
                 </Link>
              ))}
            </div>
          </div>
        )}

        <div className="text-center p-12 bg-brand-card rounded-3xl border border-brand-border">
          <span className="text-xs uppercase tracking-widest text-brand-accent mb-4 block">A Gentle Start</span>
          <h3 className="font-serif text-3xl text-brand-text mb-4">The 7-Day Emotional Reset</h3>
          <p className="text-brand-soft mb-8 max-w-md mx-auto">A free, week-long journey to help you release the pressure of having everything figured out.</p>
          <Link href="/reset" className="inline-block px-8 py-4 bg-brand-text text-brand-bg rounded-full text-xs tracking-widest uppercase hover:bg-brand-accent hover:text-white transition-colors">
            Get the free reset
          </Link>
        </div>
      </div>
    </div>
  );
}
