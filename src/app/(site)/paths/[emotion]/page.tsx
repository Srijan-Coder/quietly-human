import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";
import { SaveButton } from "@/components/global/SaveButton";

export const revalidate = 60;

export default async function JourneyPath({ params }: { params: { emotion: string } }) {
  const emotion = params.emotion.toLowerCase();

  // Fetch all content tagged with this emotion
  const query = groq`{
    "guides": *[_type == "guide" && $emotion in emotionTags] | order(_createdAt desc) { _id, title, "slug": slug.current, subtitle },
    "letters": *[_type == "letter" && $emotion in emotionTags] | order(publishedAt desc) { _id, title, "slug": slug.current, publishedAt },
    "books": *[_type == "ebook" && $emotion in emotionTags] | order(_createdAt desc) { _id, title, "slug": slug.current, author }
  }`;

  const data = await client.fetch(query, { emotion });

  const isEmpty = data.guides.length === 0 && data.letters.length === 0 && data.books.length === 0;

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-4xl mx-auto w-full pb-24">
      <div className="mb-16 text-center">
        <span className="text-xs uppercase tracking-widest text-brand-accent mb-6 block">Curated Journey</span>
        <h1 className="text-4xl md:text-6xl font-serif text-brand-text mb-6 capitalize">
          The {emotion} Path
        </h1>
        <p className="text-brand-soft font-sans max-w-2xl mx-auto leading-relaxed">
          A careful curation of words, guides, and tools specifically selected for when you feel {emotion}. Go at your own pace.
        </p>
      </div>

      {isEmpty ? (
        <div className="text-center py-20 border border-brand-border rounded-2xl">
          <p className="italic text-brand-soft font-serif">We are still writing the words for this path. Check back soon.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-12 relative before:absolute before:inset-0 before:ml-[27px] md:before:ml-[50%] before:-translate-x-px md:before:translate-x-0 before:w-px before:bg-brand-border before:z-0">
          
          {data.guides.length > 0 && (
            <div className="relative z-10 w-full flex flex-col md:flex-row gap-8 md:gap-16 items-start md:items-center">
              <div className="md:w-1/2 flex justify-end md:text-right order-2 md:order-1 hidden md:block">
                <span className="text-xs uppercase tracking-widest text-brand-accent">First Step</span>
              </div>
              <div className="w-14 h-14 rounded-full bg-brand-bg border-2 border-brand-accent flex items-center justify-center text-brand-accent shrink-0 order-1 md:order-2 z-10">
                1
              </div>
              <div className="md:w-1/2 order-3 bg-brand-card p-8 rounded-2xl border border-brand-border w-full">
                <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-2 block">Read the Guide</span>
                <Link href={`/guides/${data.guides[0].slug}`} className="font-serif text-2xl text-brand-text hover:text-brand-accent transition-colors mb-4 block">
                  {data.guides[0].title}
                </Link>
                <SaveButton item={{ id: data.guides[0]._id, title: data.guides[0].title, url: `/guides/${data.guides[0].slug}`, type: "guide" }} />
              </div>
            </div>
          )}

          {data.letters.length > 0 && (
            <div className="relative z-10 w-full flex flex-col md:flex-row gap-8 md:gap-16 items-start md:items-center">
              <div className="md:w-1/2 order-3 md:order-1 bg-brand-card p-8 rounded-2xl border border-brand-border w-full">
                <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-2 block">A Letter For You</span>
                <Link href={`/letters/${data.letters[0].slug}`} className="font-serif text-2xl text-brand-text hover:text-brand-accent transition-colors mb-4 block">
                  {data.letters[0].title}
                </Link>
                <SaveButton item={{ id: data.letters[0]._id, title: data.letters[0].title, url: `/letters/${data.letters[0].slug}`, type: "letter" }} />
              </div>
              <div className="w-14 h-14 rounded-full bg-brand-bg border-2 border-brand-border flex items-center justify-center text-brand-soft shrink-0 order-1 md:order-2 z-10">
                2
              </div>
              <div className="md:w-1/2 md:text-left order-2 md:order-3 hidden md:block">
                <span className="text-xs uppercase tracking-widest text-brand-soft">Second Step</span>
              </div>
            </div>
          )}

          {data.books.length > 0 && (
            <div className="relative z-10 w-full flex flex-col md:flex-row gap-8 md:gap-16 items-start md:items-center">
              <div className="md:w-1/2 flex justify-end md:text-right order-2 md:order-1 hidden md:block">
                <span className="text-xs uppercase tracking-widest text-brand-soft">Deep Dive</span>
              </div>
              <div className="w-14 h-14 rounded-full bg-brand-bg border-2 border-brand-border flex items-center justify-center text-brand-soft shrink-0 order-1 md:order-2 z-10">
                3
              </div>
              <div className="md:w-1/2 order-3 bg-brand-card p-8 rounded-2xl border border-brand-border w-full">
                <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-2 block">Read the Book</span>
                <Link href={`/read/${data.books[0].slug}`} className="font-serif text-2xl text-brand-text hover:text-brand-accent transition-colors mb-4 block">
                  {data.books[0].title}
                </Link>
                <SaveButton item={{ id: data.books[0]._id, title: data.books[0].title, url: `/read/${data.books[0].slug}`, type: "book" }} />
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
