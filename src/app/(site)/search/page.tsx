import { StandaloneSearchClient } from "@/components/global/StandaloneSearchClient";

export const metadata = {
  title: "Sanctuary Search - Quietly Humans",
  description: "Search for a feeling, word, or topic.",
};

export default function SearchPage() {
  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-4xl mx-auto w-full pb-24">
      <StandaloneSearchClient />
    </div>
  );
}
