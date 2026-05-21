import { client } from "@/sanity/lib/client";
import { productBySlugQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let product = null;
  try {
    product = await client.fetch(productBySlugQuery, { slug: resolvedParams.slug });
  } catch (error) {
    console.warn("Failed to fetch product from Sanity:", error);
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full pb-24">
      <Link href="/products" className="text-xs uppercase tracking-widest text-brand-soft hover:text-brand-accent transition-colors mb-12 block">
        ← Back to Library
      </Link>

      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* Left: Mockup / Image */}
        <div className="w-full lg:w-1/2 sticky top-32">
          <div className="aspect-[16/10] lg:aspect-square w-full bg-brand-card rounded-2xl border border-brand-border flex items-center justify-center p-12 overflow-hidden shadow-sm">
            {product.coverImage ? (
              <img
                src={urlFor(product.coverImage)?.url()}
                alt={product.title}
                className="object-cover w-full h-full rounded shadow-xl"
              />
            ) : (
              <span className="font-serif text-2xl text-brand-soft">Visual Preview</span>
            )}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="w-full lg:w-1/2 flex flex-col gap-12">
          
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl md:text-5xl font-serif text-brand-text">{product.title}</h1>
            <span className="text-xl text-brand-accent font-serif">${product.price}</span>
            <p className="text-brand-soft leading-relaxed text-lg">
              {product.description || "A digital sanctuary designed to help you organize your mind without the pressure of productivity."}
            </p>
            
            <a 
              href={product.link || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 px-8 py-4 bg-brand-text text-brand-bg hover:bg-brand-accent hover:text-white transition-colors duration-500 rounded-full text-sm tracking-widest uppercase text-center w-full md:w-max"
            >
              Enter the Dashboard
            </a>
          </div>

          <div className="w-full h-px bg-brand-border" />

          {/* What's Included */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs uppercase tracking-widest text-brand-soft">What's Included</h3>
            <ul className="flex flex-col gap-3 text-brand-text">
              {product.whatsIncluded?.map((item: string, i: number) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="text-brand-accent mt-1">✦</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              )) || (
                <>
                  <li className="flex gap-3 items-start"><span className="text-brand-accent mt-1">✦</span><span>Complete Notion Dashboard Template</span></li>
                  <li className="flex gap-3 items-start"><span className="text-brand-accent mt-1">✦</span><span>Video walkthrough and setup guide</span></li>
                  <li className="flex gap-3 items-start"><span className="text-brand-accent mt-1">✦</span><span>Lifetime updates and improvements</span></li>
                </>
              )}
            </ul>
          </div>

          <div className="w-full h-px bg-brand-border" />

          {/* Who It's For */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs uppercase tracking-widest text-brand-soft">Who It's For</h3>
            <p className="text-brand-text leading-relaxed">
              {product.whoItsFor || "For the overthinker. For the person who feels constantly behind. For those who want to build soft, sustainable systems instead of rigid routines."}
            </p>
          </div>

          {/* FAQ */}
          {product.faq && product.faq.length > 0 && (
            <>
              <div className="w-full h-px bg-brand-border" />
              <div className="flex flex-col gap-6">
                <h3 className="text-xs uppercase tracking-widest text-brand-soft mb-2">Common Questions</h3>
                {product.faq.map((q: any, i: number) => (
                  <div key={i} className="flex flex-col gap-2">
                    <h4 className="font-serif text-xl text-brand-text">{q.question}</h4>
                    <p className="text-brand-soft leading-relaxed">{q.answer}</p>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
