import { Metadata } from "next";
import CollectionLibraryClient from "./CollectionLibraryClient";

export const metadata: Metadata = {
  title: "My Collection",
  description: "Your private sanctuary of saved tools, essays, and letters.",
};

export default function CollectionPage() {
  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full pb-32">
      <CollectionLibraryClient />
    </div>
  );
}
