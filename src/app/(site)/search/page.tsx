import { StandaloneSearchClient } from "@/components/global/StandaloneSearchClient";
import { Suspense } from "react";

export const metadata = {
  title: "Sanctuary Search",
  description: "Search for a feeling, word, or topic.",
};

export default function SearchPage() {
  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-4xl mx-auto w-full pb-24">
      <Suspense fallback={<p className="text-center text-brand-soft italic font-serif">Loading sanctuary...</p>}>
        <StandaloneSearchClient />
      </Suspense>
    </div>
  );
}
