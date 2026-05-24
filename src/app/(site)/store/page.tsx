import { supabaseClient } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "The Quiet Store | Quietly Humans",
};

export const revalidate = 60; // Revalidate every minute

export default async function StorePage() {
  // Fetch all profiles that have pins
  const { data: profiles } = await supabaseClient
    .from("profiles")
    .select("username, display_name, avatar_url, pins")
    .not("pins", "is", null);

  // Flatten pins into a single array of products
  const allProducts: any[] = [];
  if (profiles) {
    profiles.forEach(profile => {
      const pins = profile.pins || [];
      pins.forEach((pin: any) => {
        // Only include pins that look like products (e.g. have a subtitle/price)
        allProducts.push({
          ...pin,
          creatorUsername: profile.username,
          creatorName: profile.display_name || profile.username,
          creatorAvatar: profile.avatar_url
        });
      });
    });
  }

  // Shuffle products for a fresh discovery feed
  const shuffledProducts = allProducts.sort(() => 0.5 - Math.random());

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white pt-24 md:pt-32 px-6 md:px-12 w-full pb-32">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 border-b border-white/5 pb-12 text-center flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-4 font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
            Marketplace
          </span>
          <h1 className="text-5xl md:text-6xl text-white mb-6 font-serif">The Quiet Store</h1>
          <p className="text-brand-soft text-xl max-w-2xl mx-auto italic font-serif">
            Tools, journals, and templates created by quiet minds. Every purchase directly supports the creators on this sanctuary.
          </p>
        </header>

        {shuffledProducts.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {shuffledProducts.map((product, idx) => (
              <div key={idx} className="break-inside-avoid group bg-[#121212] border border-white/5 rounded-[2rem] overflow-hidden hover:border-brand-accent/50 transition-colors flex flex-col shadow-sm relative">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <div className="h-48 bg-black/40 relative w-full border-b border-white/5 flex items-center justify-center group-hover:bg-white/5 transition-colors">
                  <span className="text-6xl filter grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110">
                    {product.emoji || "🏷️"}
                  </span>
                </div>
                
                <div className="p-8 flex flex-col flex-1 relative z-10">
                  <div className="mb-6">
                    <h2 className="text-2xl text-white leading-snug font-serif mb-2 group-hover:text-brand-accent transition-colors">
                      {product.title}
                    </h2>
                    <p className="text-brand-soft text-sm font-sans mb-6">
                      {product.subtitle || "Digital Download"}
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      {product.creatorAvatar ? (
                        <Image src={product.creatorAvatar} alt={product.creatorName} width={24} height={24} className="rounded-full" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-sans">
                          {product.creatorName.charAt(0)}
                        </div>
                      )}
                      <Link href={`/room/${product.creatorUsername}`} className="text-xs uppercase tracking-widest text-brand-soft hover:text-white transition-colors">
                        By @{product.creatorUsername}
                      </Link>
                    </div>

                    <a 
                      href={product.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center bg-white text-black py-4 rounded-full uppercase tracking-widest text-xs font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)] block mt-2"
                    >
                      View Product
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 border border-white/5 border-dashed rounded-[2rem] bg-[#121212]/50">
            <span className="text-4xl opacity-30 block mb-6 grayscale">🏷️</span>
            <p className="text-brand-soft font-serif italic text-xl">The store is empty right now. Creators are writing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
