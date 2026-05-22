import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  try {
    const category = await client.fetch(groq`*[_type == "category" && slug.current == $slug][0]{ title, description }`, { slug });
    if (category) {
      return {
        title: `${category.title} — Quietly Humans`,
        description: category.description || `Explore writings and resources on ${category.title}.`,
      };
    }
  } catch (error) { console.error(error); }
  
  return { title: "Quietly Humans" };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let data: any = null;
  try {
    data = await client.fetch(
      groq`{
        "category": *[_type == "category" && slug.current == $slug][0]{ title, description },
        "posts": *[_type == "post" && $slug in categories[]->slug.current] | order(publishedAt desc) {_id, title, slug, mainImage, excerpt},
        "guides": *[_type == "guide" && $slug in categories[]->slug.current]{_id, title, slug, excerpt, mainImage},
        "books": *[_type == "ebook" && $slug in categories[]->slug.current]{_id, title, slug, coverImage},
        "letters": *[_type == "letter" && $slug in categories[]->slug.current]{_id, title, slug}
      }`,
      { slug }
    );
  } catch (error) { console.error(error); }

  if (!data?.category) {
    notFound();
  }

  const { category, posts, guides, books, letters } = data;
  const hasContent = posts.length > 0 || guides.length > 0 || books.length > 0 || letters.length > 0;

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-24">
          <span className="text-xs uppercase tracking-widest text-brand-accent mb-4 block">Category Archive</span>
          <h1 className="text-5xl md:text-7xl font-serif text-brand-text mb-6 text-balance leading-tight">{category.title}</h1>
          {category.description && <p className="text-xl md:text-2xl text-brand-soft font-serif italic max-w-2xl mx-auto">{category.description}</p>}
        </div>

        {!hasContent && (
          <div className="text-center py-20 text-brand-soft italic font-serif">
            No items in this category yet.
          </div>
        )}

        {!!guides?.length && (
          <div className="mb-24">
            <h2 className="text-sm uppercase tracking-widest text-brand-soft border-b border-brand-border pb-4 mb-12">Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guides.map((guide: any) => (
                 <Link key={guide._id} href={`/guides/${guide.slug?.current}`} className="group flex flex-col p-6 rounded-2xl border border-brand-border hover:border-brand-accent transition-colors bg-brand-bg">
                    <h3 className="font-serif text-xl text-brand-text group-hover:text-brand-accent mb-3">{guide.title}</h3>
                    <p className="text-brand-soft text-sm leading-relaxed line-clamp-3">{guide.excerpt}</p>
                 </Link>
              ))}
            </div>
          </div>
        )}

        {!!books?.length && (
          <div className="mb-24">
            <h2 className="text-sm uppercase tracking-widest text-brand-soft border-b border-brand-border pb-4 mb-12">Books & Resources</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {books.map((book: any) => (
                 <Link key={book._id} href={`/books/${book.slug?.current}`} className="group flex flex-col items-center">
                    <div className="relative aspect-[3/4] w-full max-w-[200px] mb-4 bg-brand-card rounded-xl border border-brand-border overflow-hidden">
                      {book.coverImage?.asset ? (
                        <Image src={urlFor(book.coverImage).width(300).height(400).url()} alt={book.title} fill className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-center p-4"><span className="font-serif text-sm">{book.title}</span></div>
                      )}
                    </div>
                    <h3 className="font-serif text-center text-brand-text group-hover:text-brand-accent transition-colors">{book.title}</h3>
                 </Link>
              ))}
            </div>
          </div>
        )}

        {!!posts?.length && (
          <div className="mb-24">
            <h2 className="text-sm uppercase tracking-widest text-brand-soft border-b border-brand-border pb-4 mb-12">Quiet Thoughts</h2>
            <div className="flex flex-col gap-8">
              {posts.map((post: any) => (
                 <Link key={post._id} href={`/blog/${post.slug?.current}`} className="group block">
                    <h3 className="font-serif text-2xl text-brand-text group-hover:text-brand-accent transition-colors mb-2">{post.title}</h3>
                    {post.excerpt && <p className="text-brand-soft text-sm max-w-2xl">{post.excerpt}</p>}
                 </Link>
              ))}
            </div>
          </div>
        )}
        
        {!!letters?.length && (
          <div className="mb-24">
            <h2 className="text-sm uppercase tracking-widest text-brand-soft border-b border-brand-border pb-4 mb-12">Midnight Letters</h2>
            <div className="flex flex-col gap-4">
              {letters.map((letter: any) => (
                 <Link key={letter._id} href={`/letters/${letter.slug?.current}`} className="group block p-6 bg-brand-card rounded-xl border border-brand-border hover:border-brand-accent transition-colors">
                    <h3 className="font-serif text-xl text-brand-text group-hover:text-brand-accent transition-colors">{letter.title}</h3>
                 </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
