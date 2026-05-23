import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";
import ArchiveClient from "./ArchiveClient";
import { Metadata } from "next";

export const revalidate = 0; // Don't cache this page so new capsules appear instantly

export const metadata: Metadata = {
  title: "The Quiet Archive | Letters to the Future",
  description: "Write an anonymous note to your future self. It will be sealed and delivered here on the exact day you choose.",
};

export default async function ArchivePage() {
  // Fetch only capsules where unlockDate is in the past
  let unlockedCapsules = [];
  try {
    unlockedCapsules = await client.fetch(groq`*[_type == "timeCapsule" && unlockDate <= now()] | order(unlockDate desc) [0...50] {
      _id,
      message,
      unlockDate,
      authorAlias
    }`);
  } catch (error) {
    console.warn("Failed to fetch time capsules:", error);
  }

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-4xl mx-auto w-full pb-32">
      <header className="mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-serif text-brand-text mb-6">The Quiet Archive</h1>
        <p className="text-brand-soft text-lg max-w-2xl mx-auto text-balance">
          Leave a note for your future self, or for a stranger who might need it. 
          It will be sealed in the archive until the day you choose.
        </p>
      </header>

      {/* Interactive Form Component */}
      <ArchiveClient />

      <div className="mt-32 pt-16 border-t border-brand-border">
        <h2 className="text-2xl font-serif text-brand-text mb-12 text-center">Unlocked Capsules</h2>
        
        {unlockedCapsules.length === 0 ? (
          <div className="text-center py-20 text-brand-soft border border-brand-border border-dashed rounded-xl">
            <p>The archive is currently empty.</p>
            <p className="text-sm mt-2">No time capsules have been unlocked yet.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {unlockedCapsules.map((capsule: any) => (
              <div key={capsule._id} className="p-8 bg-brand-card border border-brand-border rounded-xl">
                <p className="text-brand-text font-serif italic mb-6">"{capsule.message}"</p>
                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-brand-soft">
                  <span>{capsule.authorAlias}</span>
                  <span>Unlocked: {new Date(capsule.unlockDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
