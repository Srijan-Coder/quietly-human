import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

export const revalidate = 60;

export default async function BooksPage() {
  const books = [
    { title: "I Am Not Behind in Life", author: "Srijan Pandey", link: "#", desc: "A gentle reminder that life is not a race.", status: "Available on Amazon", bg: "bg-brand-bg", text: "text-brand-text" },
    { title: "A Small Book for Tired Hearts", author: "Srijan Pandey", link: "#", desc: "For when you are too tired to keep going, but too scared to stop.", status: "Available on Amazon", bg: "bg-brand-text", text: "text-brand-bg" },
    { title: "I'm Tired of Being Okay", author: "Srijan Pandey", link: "#", desc: "A journal for rediscovering your authentic energy.", status: "Coming Soon", bg: "bg-brand-muted", text: "text-brand-bg" },
  ];

  let ebooks = [];
  try {
    ebooks = await client.fetch(
      groq`*[_type == "ebook"] | order(_createdAt desc) {
        title,
        author,
        "slug": slug.current,
        coverImage {
          ...,
          "alt": alt
        }
      }`
    );
  } catch (error) { console.error(error); }

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full pb-24">
      <div className="mb-20 text-center">
        <h1 className="text-5xl md:text-6xl font-serif text-brand-text mb-6">Books & Journals</h1>
        <p className="text-brand-soft text-lg max-w-xl mx-auto text-balance">
          Artifacts to hold your thoughts and guide you toward a softer life.
        </p>
      </div>

      {ebooks.length > 0 && (
        <div className="mb-32">
          <h2 className="text-sm uppercase tracking-widest text-brand-soft border-b border-brand-border pb-4 mb-12">Free Digital Ebooks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {ebooks.map((ebook: any, i: number) => (
              <Link href={`/books/${ebook.slug}`} key={i} className="group flex flex-col gap-4">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-card flex items-center justify-center p-8 border border-brand-border rounded-xl transition-transform duration-700 group-hover:-translate-y-2">
                  {ebook.coverImage?.asset ? (
                    <Image
                      src={urlFor(ebook.coverImage).width(400).height(533).url()}
                      alt={ebook.coverImage.alt || ebook.title}
                      fill
                      className="object-cover w-full h-full opacity-90"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                      <span className="font-serif text-xl mb-2">{ebook.title}</span>
                      <span className="text-[10px] uppercase tracking-widest opacity-60">{ebook.author}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-center">
                  <h3 className="font-serif text-xl group-hover:text-brand-accent transition-colors">{ebook.title}</h3>
                  <span className="text-xs uppercase tracking-widest text-brand-soft">Free Download</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm uppercase tracking-widest text-brand-soft border-b border-brand-border pb-4 mb-12">Physical Books</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {books.map((book) => (
            <div key={book.title} className="group flex flex-col gap-6">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-card flex items-center justify-center p-8 border border-brand-border rounded-xl">
                <div className={`w-56 h-72 ${book.bg} ${book.text} border border-brand-border/20 shadow-2xl flex flex-col items-center justify-center p-6 text-center transition-transform duration-700 group-hover:-translate-y-4`}>
                  <span className="font-serif text-xl mb-2">{book.title}</span>
                  <span className="text-[10px] uppercase tracking-widest opacity-60">{book.author}</span>
                </div>
              </div>
              <div className="flex flex-col gap-4 items-center text-center">
                <h2 className="font-serif text-2xl group-hover:text-brand-accent transition-colors">{book.title}</h2>
                <p className="text-brand-soft text-sm text-balance">{book.desc}</p>
                <a href={book.link} className="uppercase tracking-widest text-xs border-b border-brand-text text-brand-text pb-1 w-max hover:text-brand-accent hover:border-brand-accent transition-colors mt-2">{book.status}</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
