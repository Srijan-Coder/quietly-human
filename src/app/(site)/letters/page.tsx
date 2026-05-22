import { client } from "@/sanity/lib/client";
import { lettersQuery } from "@/sanity/lib/queries";
import Link from "next/link";

export const revalidate = 60;

export interface Letter {
  _id: string;
  title: string;
  slug?: string;
  publishedAt: string;
}

export default async function LettersIndex() {
  let letters = [];
  try {
    letters = await client.fetch(lettersQuery);
  } catch (error) {
    console.warn("Failed to fetch letters:", error);
  }

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-4xl mx-auto w-full pb-24">
      <div className="mb-24 text-center">
        <h1 className="text-5xl md:text-6xl font-serif text-brand-text mb-4 text-balance">
          Midnight Letters
        </h1>
        <p className="opacity-60 text-lg max-w-xl mx-auto text-balance">
          An archive of soft words for tired hearts. Originally sent via email.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        {letters.filter((letter: Letter) => letter.slug).map((letter: Letter) => (
          <Link 
            href={`/letters/${letter.slug}`} 
            key={letter._id} 
            className="group flex flex-col md:flex-row justify-between items-baseline border-b border-brand-border pb-8 hover:bg-brand-card/50 transition-colors px-6 -mx-6 rounded-xl"
          >
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-brand-text mb-2 group-hover:text-brand-accent transition-colors">
                {letter.title}
              </h2>
            </div>
            <div className="text-xs uppercase tracking-widest text-brand-soft mt-4 md:mt-0">
              {new Date(letter.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </Link>
        ))}
      </div>

      {letters.length === 0 && (
        <div className="text-center py-20 text-brand-soft italic border border-brand-border rounded-xl mt-12 bg-brand-card">
          The mailbox is currently empty.
        </div>
      )}

      {/* Subscription CTA */}
      <div className="mt-32 p-12 bg-brand-card border border-brand-border rounded-2xl text-center">
        <h3 className="font-serif text-3xl text-brand-text mb-4">Receive the next letter.</h3>
        <p className="text-brand-soft mb-8 max-w-md mx-auto">
          Twice a month, I send a gentle reminder that you are allowed to rest. No spam, no pressure.
        </p>
        <form className="flex flex-col md:flex-row max-w-md mx-auto gap-4">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="flex-1 bg-brand-bg border border-brand-border px-6 py-4 rounded-full focus:outline-none focus:border-brand-accent transition-colors text-brand-text placeholder-brand-soft/50"
          />
          <button type="button" className="px-8 py-4 bg-brand-text text-brand-bg hover:bg-brand-accent hover:text-white transition-colors duration-500 rounded-full text-sm tracking-widest uppercase">
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}
