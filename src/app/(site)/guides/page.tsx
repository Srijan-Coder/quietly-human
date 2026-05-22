import { client } from "@/sanity/lib/client";
import { guidesQuery } from "@/sanity/lib/queries";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

export interface Guide {
  _id: string;
  title: string;
  subtitle?: string;
  slug?: string;
  coverImage?: unknown;
}

export default async function GuidesIndex() {
  let guides = [];
  try {
    guides = await client.fetch(guidesQuery);
  } catch (error) {
    console.warn("Failed to fetch guides:", error);
  }

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full pb-24">
      <div className="mb-24 text-center">
        <h1 className="text-5xl md:text-6xl font-serif text-brand-text mb-4 text-balance">
          Pillars of Rest
        </h1>
        <p className="opacity-60 text-lg max-w-xl mx-auto text-balance">
          Deep, immersive guides into emotional wellness and the quiet life.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {guides.filter((guide: Guide) => guide.slug).map((guide: Guide) => (
          <Link href={`/guides/${guide.slug}`} key={guide._id} className="group flex flex-col gap-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-card rounded-xl border border-brand-border shadow-sm">
              {guide.coverImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={urlFor(guide.coverImage)?.url()}
                  alt={guide.title}
                  className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-serif text-brand-muted italic opacity-50">
                  Quietly Humans
                </div>
              )}
            </div>
            <div>
              <span className="text-xs tracking-widest uppercase text-brand-accent mb-3 block">Guide</span>
              <h2 className="font-serif text-3xl text-brand-text mb-2 group-hover:text-brand-accent transition-colors">
                {guide.title}
              </h2>
              {guide.subtitle && (
                <p className="text-brand-soft leading-relaxed opacity-80">
                  {guide.subtitle}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {guides.length === 0 && (
        <div className="text-center py-20 text-brand-soft italic">
          The guides are currently being written. Check back soon.
        </div>
      )}
    </div>
  );
}
