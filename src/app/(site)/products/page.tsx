import { client } from "@/sanity/lib/client";
import { productsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

export const revalidate = 60;

export default async function ProductsPage() {
  let products = [];
  try {
    products = await client.fetch(productsQuery);
  } catch (error) {
    console.warn("Failed to fetch products from Sanity (likely missing projectId):", error);
  }

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full pb-24">
      <div className="mb-20 text-center">
        <h1 className="text-5xl md:text-6xl font-serif text-brand-text mb-6">Digital Dashboards</h1>
        <p className="text-brand-soft text-lg max-w-xl mx-auto text-balance">
          Tools and Notion systems to help you organize your mind and live intentionally.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {products.filter((product: any) => product.slug).map((product: any) => (
          <Link
            href={`/products/${product.slug}`}
            key={product._id}
            className="group flex flex-col gap-6"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-card flex items-center justify-center p-8 rounded-xl border border-brand-border">
              {product.coverImage ? (
                <img
                  src={urlFor(product.coverImage)?.url()}
                  alt={product.title}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-30">
                  <span className="font-serif text-xl">Preview</span>
                </div>
              )}
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-serif text-2xl group-hover:text-brand-accent transition-colors text-brand-text">{product.title}</h2>
              </div>
              <span className="text-sm tracking-widest text-brand-soft">${product.price}</span>
            </div>
          </Link>
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="py-32 text-center text-brand-soft">
          <p>The shop is currently being curated. Check back soon.</p>
        </div>
      )}
    </div>
  );
}
