import { client } from "@/sanity/lib/client";
import { ebookBySlugQuery } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { EbookReader } from "@/components/global/EbookReader";

export const revalidate = 60;

export default async function ReadPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let ebook = null;
  
  try {
    ebook = await client.fetch(ebookBySlugQuery, { slug: resolvedParams.slug });
  } catch (error) {
    console.warn("Failed to fetch ebook from Sanity:", error);
  }

  if (!ebook) {
    notFound();
  }

  return <EbookReader ebook={ebook} />;
}
