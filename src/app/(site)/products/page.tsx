import { client } from "@/sanity/lib/client";
import { productsQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";

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
      <div className="mb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-serif text-brand-charcoal mb-4">Digital Products</h1>
        <p className="opacity-60 text-lg max-w-xl mx-auto text-balance">
          Tools and Notion systems to help you organize your mind and live intentionally.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {products.map((product: any) => (
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            key={product._id}
            className="group flex flex-col gap-6"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-charcoal/5 flex items-center justify-center p-8">
              {product.coverImage ? (
                <img
                  src={urlForImage(product.coverImage)?.url()}
                  alt={product.title}
                  className="object-contain w-full h-full transition-transform duration-700 group-hover:scale-105 drop-shadow-2xl"
                />
              ) : (
                <div className="w-full h-full bg-brand-cream border border-brand-charcoal/10 shadow-xl flex items-center justify-center">
                  <span className="font-serif opacity-30 text-2xl">Cover</span>
                </div>
              )}
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-serif text-2xl group-hover:text-brand-gold transition-colors">{product.title}</h2>
              </div>
              <span className="text-sm font-medium tracking-widest">${product.price}</span>
            </div>
          </a>
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="py-24 text-center opacity-50">
          <p>The shop is currently being curated.</p>
        </div>
      )}
    </div>
  );
}
