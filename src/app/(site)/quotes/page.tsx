import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { QuoteWall, type Quote } from "@/components/global/QuoteWall";

export const revalidate = 60;
export const metadata = {
  title: "Quiet Words — Curated Quotes | Quietly Humans",
  description: "A collection of curated quotes about life, anxiety, healing, and soft living."
};

export default async function QuotesPage() {
  let quotes: Quote[] = [];
  try {
    quotes = await client.fetch(groq`*[_type == "quote"] | order(_createdAt desc) {
      _id, text, author, emotionTags, cardColor, featured
    }`);
  } catch { /* silently fail */ }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-xs uppercase tracking-widest text-brand-accent mb-4 block">Quiet Words</span>
          <h1 className="text-5xl md:text-6xl font-serif text-brand-text mb-6">The Quote Wall</h1>
          <p className="text-brand-soft max-w-xl mx-auto leading-relaxed">
            Words for the moments when you need to remember you are not alone.
          </p>
        </div>
        <QuoteWall quotes={quotes} />
      </div>
    </div>
  );
}
