import { client } from "@/sanity/lib/client";
import { guideBySlugQuery } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { SaveButton } from "@/components/global/SaveButton";
import { ReadingController } from "@/components/global/ReadingController";
import { ReadingTextWrapper } from "@/components/global/ReadingTextWrapper";

export const revalidate = 60;

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let guide = null;
  try {
    guide = await client.fetch(guideBySlugQuery, { slug: resolvedParams.slug });
  } catch (error) {
    console.warn("Failed to fetch guide from Sanity:", error);
  }

  if (!guide) {
    notFound();
  }

  return (
    <>
      <ReadingController />
      <article className="min-h-screen pt-32 px-6 md:px-12 max-w-4xl mx-auto w-full pb-32">
        <Link 
          href="/guides"
          className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mb-12 block"
        >
          ← Back to Guides
        </Link>
      </div>
    </article>
  );
}
