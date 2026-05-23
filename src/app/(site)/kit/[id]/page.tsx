import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const revalidate = 0;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const kit = await client.fetch(groq`*[_type == "sharedKit" && _id == $id][0] { name }`, { id });
  return {
    title: kit ? kit.name + " | A Shared Kit" : "Shared Kit | Quietly Humans",
    description: "Someone shared a curated toolkit of quiet spaces and tools with you.",
  };
}

export default async function SharedKitPage({ params }: Props) {
  const { id } = await params;
  const kit = await client.fetch(groq`*[_type == "sharedKit" && _id == $id][0]`, { id });

  if (!kit) {
    notFound();
  }

  let items: { id: string; title: string; type: string; url: string; privateNote?: string }[] = [];
  try {
    items = JSON.parse(kit.items);
  } catch (e) {
    console.error("Failed to parse kit items");
  }

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-4xl mx-auto w-full pb-32">
      <header className="mb-16 text-center border-b border-brand-border pb-12">
        <span className="text-xl">🎁</span>
        <h1 className="text-4xl md:text-5xl font-serif text-brand-text mt-4 mb-4">
          {kit.name}
        </h1>
        <p className="text-brand-soft text-lg max-w-2xl mx-auto text-balance">
          Someone created this custom Care Package and shared it with you. It contains hand-picked tools and letters for whatever you are going through right now.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, idx) => (
          <div key={idx} className="bg-brand-card border border-brand-border rounded-xl p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-brand-soft bg-brand-bg px-2 py-1 rounded-md mb-4 inline-block">
                {item.type}
              </span>
              <h3 className="text-2xl text-brand-text mb-4 leading-snug font-serif">
                {item.title}
              </h3>
              {item.privateNote && (
                <p className="text-sm text-brand-soft italic mt-4 border-l-2 border-brand-accent/50 pl-4 py-1">
                  &ldquo;{item.privateNote}&rdquo;
                </p>
              )}
            </div>
            <div className="mt-8 pt-4 border-t border-brand-border/50">
              <Link
                href={item.url}
                className="text-xs uppercase tracking-widest text-brand-accent hover:text-brand-text transition-colors flex items-center gap-2"
              >
                Open {item.type === "Tool" ? "Tool" : "Reading"} →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 text-center">
        <p className="text-sm text-brand-soft mb-6">Want to create your own care packages?</p>
        <Link href="/collection" className="px-6 py-3 bg-brand-bg border border-brand-border rounded-full text-xs uppercase tracking-widest hover:border-brand-accent transition-all text-brand-text">
          Go to My Collection
        </Link>
      </div>
    </div>
  );
}
