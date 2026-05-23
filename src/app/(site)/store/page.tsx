import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "The Quiet Store | Quietly Humans",
};

const PRODUCTS = [
  {
    id: "prod_overthinker", // In reality, this links to a Stripe Price ID
    title: "The Overthinker's Journal",
    type: "Notion Template",
    price: "$9.00",
    description: "A beautifully structured Notion workspace designed to offload heavy thoughts, track emotional patterns, and find clarity in chaos.",
    image: "/og-image.jpg"
  },
  {
    id: "prod_anxiety",
    title: "Soft Living Handbook",
    type: "Digital Ebook",
    price: "$12.00",
    description: "A 50-page guide on romanticizing your quiet life, stepping away from hustle culture, and finding peace in the mundane.",
    image: "/og-image.jpg"
  }
];

export default function StorePage() {
  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-5xl mx-auto w-full pb-32 font-serif">
      <header className="mb-16 border-b border-brand-border pb-12 text-center">
        <h1 className="text-4xl text-brand-text mb-4">The Quiet Store</h1>
        <p className="text-brand-soft text-lg max-w-xl mx-auto italic">
          Tools, templates, and words to help you navigate a loud world. 
          Every purchase directly supports this sanctuary.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {PRODUCTS.map(product => (
          <div key={product.id} className="group bg-brand-card border border-brand-border rounded-2xl overflow-hidden hover:border-brand-accent transition-colors flex flex-col">
            <div className="h-64 bg-brand-bg relative w-full border-b border-brand-border">
              {/* Fallback image if real image isn't uploaded yet */}
              <div className="absolute inset-0 flex items-center justify-center text-brand-soft opacity-50 font-sans tracking-widest uppercase text-xs">
                [Product Image Placeholder]
              </div>
            </div>
            
            <div className="p-8 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-2 inline-block font-sans">
                    {product.type}
                  </span>
                  <h2 className="text-2xl text-brand-text leading-snug">
                    {product.title}
                  </h2>
                </div>
                <span className="text-xl text-brand-text font-sans font-bold">
                  {product.price}
                </span>
              </div>
              
              <p className="text-brand-soft mb-8 flex-1">
                {product.description}
              </p>
              
              {/* In a real scenario, this connects to another Stripe checkout API route for one-off payments */}
              <button className="w-full bg-brand-text text-brand-bg py-4 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-brand-accent hover:text-white transition-all">
                Purchase
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
