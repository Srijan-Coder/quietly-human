import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

export interface Book {
  _id: string;
  title: string;
  slug?: string;
  author?: string;
  coverImage?: unknown;
}

export default async function BooksIndexPage() {
  let books = [];
  try {
    books = await client.fetch(groq`*[_type in ["ebook", "book", "product"]] | order(_createdAt desc) {
      _id,
      _type,
      title,
      "slug": slug.current,
      author,
      coverImage,
      bookFormat,
      price,
      purchaseLinks
    }`);
  } catch (error) {
    console.warn("Failed to fetch books:", error);
  }

  // Categorize books
  const freeEbooks = books.filter((b: any) => 
    b.bookFormat === "free" || (!b.bookFormat && b._type === "ebook")
  );
  
  const premiumBooks = books.filter((b: any) => 
    b.bookFormat === "premium" || b._type === "product"
  );
  
  const physicalBooks = books.filter((b: any) => 
    b.bookFormat === "physical" || (b.purchaseLinks && b.purchaseLinks.length > 0)
  );

  const renderBookGrid = (bookList: any[], emptyMessage: string) => {
    if (bookList.length === 0) {
      return (
        <div className="py-12 text-center text-brand-soft border border-brand-border border-dashed rounded-xl">
          <p className="font-serif text-lg">{emptyMessage}</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {bookList.filter((b: any) => b.slug).map((book: any) => (
          <Link href={`/books/${book.slug}`} key={book._id} className="group flex flex-col gap-4">
            <div className="relative aspect-[2/3] w-full overflow-hidden bg-brand-card rounded-lg border border-brand-border shadow-sm group-hover:shadow-md transition-all">
              {book.coverImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={urlFor(book.coverImage)?.url()}
                  alt={book.title}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center opacity-50">
                  <span className="font-serif text-xl mb-2">{book.title}</span>
                  <span className="text-xs uppercase tracking-widest">{book.author || "Srijan Pandey"}</span>
                </div>
              )}
            </div>
            <div>
              <h2 className="font-serif text-xl group-hover:text-brand-accent transition-colors text-brand-text leading-tight">{book.title}</h2>
              <span className="text-[10px] uppercase tracking-widest text-brand-soft mt-2 block">{book.author || "Srijan Pandey"}</span>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-6xl mx-auto w-full pb-24">
      <Link href="/library" className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mb-12 block">
        ← Back to Library Hub
      </Link>
      
      <div className="mb-20">
        <h1 className="text-5xl md:text-6xl font-serif text-brand-text mb-4">Books & Journals 📖</h1>
        <p className="text-brand-soft text-lg max-w-xl text-balance">
          A collection of digital reading material and products for your healing journey.
        </p>
      </div>

      <div className="space-y-24">
        {/* Physical Books Section */}
        <section>
          <div className="mb-8 border-b border-brand-border pb-4">
            <h2 className="text-2xl font-serif text-brand-text">Physical Books</h2>
            <p className="text-sm text-brand-soft uppercase tracking-widest mt-1">Hold the quiet in your hands</p>
          </div>
          {renderBookGrid(physicalBooks, "No physical books available yet.")}
        </section>

        {/* Premium Digital Products Section */}
        <section>
          <div className="mb-8 border-b border-brand-border pb-4">
            <h2 className="text-2xl font-serif text-brand-text">Premium Digital</h2>
            <p className="text-sm text-brand-soft uppercase tracking-widest mt-1">Deep dives and premium resources</p>
          </div>
          {renderBookGrid(premiumBooks, "No premium digital books available yet.")}
        </section>

        {/* Free Ebooks Section */}
        <section>
          <div className="mb-8 border-b border-brand-border pb-4">
            <h2 className="text-2xl font-serif text-brand-text">Free Library</h2>
            <p className="text-sm text-brand-soft uppercase tracking-widest mt-1">Free resources for community members</p>
          </div>
          {renderBookGrid(freeEbooks, "No free ebooks available yet.")}
        </section>
      </div>
    </div>
  );
}
