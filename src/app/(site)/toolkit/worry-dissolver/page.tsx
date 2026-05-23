import WorryDissolverClient from "@/components/global/WorryDissolverClient";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Worry Dissolver | Soft Toolkit",
  description: "A private digital space to type out your anxieties and watch them dissolve into nothingness.",
};

export default function WorryDissolverPage() {
  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 w-full pb-24 flex flex-col">
      <Link href="/toolkit" className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mb-8 block max-w-5xl mx-auto w-full">
        ← Back to Toolkit
      </Link>
      
      <div className="flex-1 flex items-center justify-center">
        <WorryDissolverClient />
      </div>
    </div>
  );
}
