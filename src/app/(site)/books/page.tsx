import { client } from "@/sanity/lib/client";
import { booksQuery } from "@/sanity/lib/queries";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

export const revalidate = 60;

export default async function BooksPage() {
  let books = [];
  try {
    books = await client.fetch(booksQuery);
  } catch (error) { console.error(error); }

  const freeEbooks = books.filter((b: any) => b.bookFormat === 'free');
  const premiumEbooks = books.filter((b: any) => b.bookFormat === 'premium');
  const physicalBooks = books.filter((b: any) => b.bookFormat === 'physical');

  const renderBookCard = (book: any, sublabel: string) => (
    <Link href={`/books/${book.slug}`} key={book._id} className="group flex flex-col gap-4">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-card flex items-center justify-center p-8 border border-brand-border rounded-xl transition-transform duration-700 group-hover:-translate-y-2">
        {book.coverImage?.asset ? (
          <Image
            src={urlFor(book.coverImage).width(400).height(533).url()}
            alt={book.coverImage.alt || book.title}
            fill
            className="object-cover w-full h-full opacity-90"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <span className="font-serif text-xl mb-2">{book.title}</span>
            <span className="text-[10px] uppercase tracking-widest opacity-60">{book.author}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 text-center items-center">
        <h3 className="font-serif text-xl group-hover:text-brand-accent transition-colors text-balance">{book.title}</h3>
        {book.tagline && <p className="text-brand-soft text-sm text-balance max-w-[250px]">{book.tagline}</p>}
        <span className="text-xs uppercase tracking-widest text-brand-text border-b border-brand-text hover:text-brand-accent hover:border-brand-accent transition-colors pb-1 mt-2">
          {sublabel}
        </span>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full pb-24">
      <div className="mb-20 text-center">
        <h1 className="text-5xl md:text-6xl font-serif text-brand-text mb-6">Books & Journals</h1>
        <p className="text-brand-soft text-lg max-w-xl mx-auto text-balance">
          Artifacts to hold your thoughts and guide you toward a softer life.
        </p>
      </div>

      {physicalBooks.length > 0 && (
        <div className="mb-32">
          <h2 className="text-sm uppercase tracking-widest text-brand-soft border-b border-brand-border pb-4 mb-12">Physical Books</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
            {physicalBooks.map((book: any) => renderBookCard(book, "Explore Formats"))}
          </div>
        </div>
      )}

      {premiumEbooks.length > 0 && (
        <div className="mb-32">
          <h2 className="text-sm uppercase tracking-widest text-brand-soft border-b border-brand-border pb-4 mb-12">Premium Digital Ebooks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
            {premiumEbooks.map((book: any) => renderBookCard(book, "Explore Ebook"))}
          </div>
        </div>
      )}

      {freeEbooks.length > 0 && (
        <div className="mb-32">
          <h2 className="text-sm uppercase tracking-widest text-brand-soft border-b border-brand-border pb-4 mb-12">Free Digital Resets</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
            {freeEbooks.map((book: any) => renderBookCard(book, "Read for Free"))}
          </div>
        </div>
      )}
      
      {books.length === 0 && (
        <div className="text-center text-brand-soft py-20">
          <p>The library is currently being restocked. Check back soon.</p>
        </div>
      )}
    </div>
  );
}
