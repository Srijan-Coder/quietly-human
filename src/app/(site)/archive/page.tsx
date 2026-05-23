import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import ArchiveClient from "./ArchiveClient";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";

export const revalidate = 0; // Don't cache this page so new capsules appear instantly

export const metadata: Metadata = {
  title: "The Quiet Archive | Letters to the Future",
  description: "Write an anonymous note to your future self. It will be sealed and delivered here on the exact day you choose.",
};

export default async function ArchivePage() {
  const { userId } = await auth();

  // Fetch only capsules where unlockDate is in the past (Public Feed)
  let unlockedCapsules = [];
  try {
    unlockedCapsules = await client.fetch(groq`*[_type == "timeCapsule" && unlockDate <= now()] | order(unlockDate desc) [0...20] {
      _id,
      message,
      unlockDate,
      authorAlias
    }`);
  } catch (error) {
    console.warn("Failed to fetch public unlocked capsules:", error);
  }

  // Fetch user's personal locked capsules
  let lockedCapsules = [];
  if (userId) {
    try {
      lockedCapsules = await client.fetch(groq`*[_type == "timeCapsule" && userId == $userId && unlockDate > now()] | order(unlockDate asc) {
        _id,
        createdAt,
        unlockDate
      }`, { userId });
    } catch (error) {
      console.warn("Failed to fetch user locked capsules:", error);
    }
  }

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-4xl mx-auto w-full pb-32">
      <header className="mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-serif text-brand-text mb-6">The Quiet Archive</h1>
        <p className="text-brand-soft text-lg max-w-2xl mx-auto text-balance">
          Leave a note for your future self. It will be sealed in the archive and delivered to your email on the exact day you choose.
        </p>
      </header>

      {/* DASHBOARD: My Locked Capsules (Only shown if logged in and has capsules) */}
      {userId && lockedCapsules.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-6">
            <h2 className="text-xl font-serif text-brand-text flex items-center gap-2">
              <span>🔒</span> My Locked Capsules
            </h2>
            <span className="text-xs uppercase tracking-widest text-brand-soft">{lockedCapsules.length} Active</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lockedCapsules.map((cap: any) => {
              const unlock = new Date(cap.unlockDate);
              const isClose = (unlock.getTime() - new Date().getTime()) < (7 * 24 * 60 * 60 * 1000); // Less than 7 days

              return (
                <div key={cap._id} className="p-6 border border-brand-border rounded-xl bg-brand-card flex items-center justify-between group">
                  <div>
                    <p className="text-brand-text font-serif mb-1">
                      Unlocks on {unlock.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-xs uppercase tracking-widest text-brand-soft">
                      Written: {new Date(cap.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${isClose ? 'bg-brand-accent/20 text-brand-accent' : 'bg-white/5 text-brand-soft'}`}>
                    {isClose ? '⏳' : '🔒'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Form Component */}
      <ArchiveClient />

      {/* PUBLIC FEED */}
      <div className="mt-32 pt-16 border-t border-brand-border">
        <h2 className="text-xl font-serif text-brand-text mb-4 text-center">The Public Wall</h2>
        <p className="text-center text-sm text-brand-soft mb-12">Anonymous capsules that have finally unlocked.</p>
        
        {unlockedCapsules.length === 0 ? (
          <div className="text-center py-20 text-brand-soft border border-brand-border border-dashed rounded-xl">
            <p>The archive is currently empty.</p>
            <p className="text-sm mt-2">No time capsules have been unlocked yet.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {unlockedCapsules.map((capsule: any) => (
              <div key={capsule._id} className="p-8 bg-brand-bg border border-brand-border rounded-xl hover:border-brand-accent/50 transition-colors">
                <p className="text-brand-text font-serif italic mb-6 leading-relaxed">"{capsule.message}"</p>
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
