import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function BlogSeriesPage({ params }: { params: { slug: string } }) {
  let series: any = null;
  try {
    series = await client.fetch(
      groq`*[_type == "blogSeries" && slug.current == $slug][0]{
        title, description, emotionTag, coverImage,
        guides[]->{_id, title, slug, excerpt, mainImage, publishedAt},
        letters[]->{_id, title, slug, excerpt, mainImage, publishedAt}
      }`,
      { slug: params.slug }
    );
  } catch (_) {}

  if (!series) {
    notFound();
  }

  // Combine and sort, but keep the specific order if it was set in the array for guides. 
  // For simplicity, we just list guides then letters.
  const posts = [
    ...(series.guides || []).map((p: any) => ({ ...p, type: 'guide' })),
    ...(series.letters || []).map((p: any) => ({ ...p, type: 'letter' }))
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16 flex flex-col md:flex-row gap-8 items-center md:items-start">
          {series.coverImage && (
             <div className="w-full md:w-1/3 aspect-[4/5] relative rounded-2xl overflow-hidden border border-brand-border shadow-sm shrink-0">
               <Image src={urlFor(series.coverImage).width(400).height(500).url()} alt={series.title} fill className="object-cover" />
             </div>
          )}
          <div className="flex-1">
             {series.emotionTag && <span className="text-xs uppercase tracking-widest text-brand-accent mb-4 block">Series: {series.emotionTag}</span>}
             <h1 className="text-4xl md:text-5xl font-serif text-brand-text mb-6">{series.title}</h1>
             <p className="text-brand-soft leading-relaxed max-w-lg mb-8">{series.description}</p>
             <div className="flex gap-4 border-t border-brand-border pt-6">
                <div className="text-xs uppercase tracking-widest text-brand-soft">
                  <span className="text-brand-text font-semibold">{posts.length}</span> entries
                </div>
             </div>
          </div>
        </div>

        <div className="relative border-l border-brand-border ml-4 md:ml-8 pl-8 md:pl-12 py-8 flex flex-col gap-12">
          {posts.map((post: any, i: number) => (
             <div key={post._id} className="relative">
                {/* Timeline dot */}
                <div className="absolute -left-[37px] md:-left-[53px] top-6 w-3 h-3 rounded-full bg-brand-bg border-2 border-brand-accent z-10" />
                
                <span className="text-[10px] uppercase tracking-widest text-brand-soft mb-2 block">Part {i + 1}</span>
                <Link href={`/${post.type}s/${post.slug?.current}`} className="group block p-6 bg-brand-card rounded-2xl border border-brand-border hover:border-brand-accent transition-colors">
                  <h3 className="font-serif text-2xl text-brand-text group-hover:text-brand-accent transition-colors mb-3">{post.title}</h3>
                  <p className="text-sm text-brand-soft leading-relaxed line-clamp-2">{post.excerpt}</p>
                </Link>
             </div>
          ))}
          {posts.length === 0 && (
             <p className="font-serif italic text-brand-soft">No entries in this series yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
