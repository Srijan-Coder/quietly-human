"use client";

import { useCollection } from "@/hooks/useCollection";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";

export default function CollectionPage() {
  const { collection, removeItem } = useCollection();
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-5xl mx-auto w-full pb-24">
      <header className="mb-16">
        <h1 className="text-5xl md:text-6xl font-serif text-brand-text mb-4">My Collection 🗃️</h1>
        <p className="text-brand-soft text-lg max-w-xl text-balance mb-8">
          A private vault of everything you've saved from the Quietly Humans universe.
        </p>

        {isLoaded && !isSignedIn && (
          <div className="bg-brand-accent/10 border border-brand-accent rounded-xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl text-brand-text mb-1">Your vault is temporary.</h3>
              <p className="text-brand-soft text-sm">Sign in to permanently save your collection across all your devices.</p>
            </div>
            <SignInButton mode="modal">
              <button className="px-6 py-2 bg-brand-text text-brand-bg rounded-full text-xs uppercase tracking-widest hover:bg-brand-accent transition-colors shrink-0">
                Sign In
              </button>
            </SignInButton>
          </div>
        )}
      </header>

      {collection.length === 0 ? (
        <div className="py-24 text-center border border-brand-border border-dashed rounded-2xl bg-brand-card/50">
          <p className="text-brand-soft font-serif text-xl italic mb-4">Your vault is completely empty.</p>
          <p className="text-sm uppercase tracking-widest text-brand-soft mb-8">Go find some words that move you.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/blog" className="px-6 py-2 border border-brand-border rounded-full text-xs uppercase tracking-widest hover:border-brand-accent transition-colors">
              Explore Blogs
            </Link>
            <Link href="/letters" className="px-6 py-2 border border-brand-border rounded-full text-xs uppercase tracking-widest hover:border-brand-accent transition-colors">
              Read Letters
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collection.map((item) => (
            <div key={item.id} className="group flex flex-col justify-between bg-brand-card border border-brand-border rounded-xl p-6 shadow-sm hover:border-brand-accent transition-colors">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] uppercase tracking-widest text-brand-accent px-2 py-1 bg-brand-accent/10 rounded-sm">
                    {item.type}
                  </span>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-brand-soft hover:text-red-400 transition-colors"
                    aria-label="Remove item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <h3 className="font-serif text-xl text-brand-text mb-4 line-clamp-3">
                  {item.title}
                </h3>
              </div>
              
              <div className="flex justify-between items-end mt-6">
                <span className="text-[10px] uppercase tracking-widest text-brand-soft">
                  Saved {new Date(item.dateSaved).toLocaleDateString()}
                </span>
                <Link 
                  href={item.url}
                  className="text-xs uppercase tracking-widest text-brand-text group-hover:text-brand-accent transition-colors"
                >
                  View →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
