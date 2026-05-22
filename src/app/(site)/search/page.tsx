import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { EmotionalSearchClient } from "@/components/global/EmotionalSearchClient";

export const revalidate = 60;

export default async function SearchPage() {
  // Fetch everything to power the fuzzy emotional search
  const query = groq`{
    "guides": *[_type == "guide"] { _id, title, "slug": slug.current, emotionTags, subtitle },
    "letters": *[_type == "letter"] { _id, title, "slug": slug.current, emotionTags, publishedAt },
    "books": *[_type == "ebook"] { _id, title, "slug": slug.current, emotionTags, author }
  }`;

  const data = await client.fetch(query);

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-4xl mx-auto w-full pb-24">
      <EmotionalSearchClient initialData={data} />
    </div>
  );
}
