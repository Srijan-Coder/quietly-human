import { supabaseClient } from "@/lib/supabase";
import PilgrimSubmitForm from "./PilgrimSubmitForm";
import Link from "next/link";
import CandleButton from "../room/[username]/[slug]/CandleButton";

export const metadata = {
  title: "Pilgrim Notes | Quietly Humans",
  description: "A community wall of anonymous and pseudonymous thoughts.",
};

export const revalidate = 60; // Refresh feed every minute

export default async function PilgrimNotesPage() {
  // Fetch latest 50 notes joined with author profiles
  const { data: notes, error } = await supabaseClient
    .from("pilgrim_notes")
    .select(`
      id, content, created_at, candle_count,
      profiles ( id, username, display_name )
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-4xl mx-auto w-full pb-32 font-serif relative">
      <header className="mb-16 border-b border-brand-border pb-12 text-center">
        <h1 className="text-4xl md:text-5xl text-brand-text mb-4">Pilgrim Notes</h1>
        <p className="text-brand-soft text-lg max-w-2xl mx-auto italic">
          Leave a quiet thought for the next traveler. What is heavy on your mind today?
        </p>
      </header>

      {/* Submission Form at the top */}
      <div className="mb-20 max-w-2xl mx-auto">
        <PilgrimSubmitForm />
      </div>

      {error && (
        <div className="text-center text-red-400 py-10">
          The wall is currently obscured. Please return later.
        </div>
      )}

      {/* Masonry-style Grid for Notes */}
      <div className="columns-1 md:columns-2 gap-8 space-y-8">
        {notes && notes.length > 0 ? (
          notes.map((note: any) => (
            <div key={note.id} className="break-inside-avoid bg-brand-card/50 border border-brand-border p-8 rounded-2xl relative group hover:border-brand-accent transition-colors shadow-sm">
              <p className="text-xl text-brand-text leading-relaxed mb-8 whitespace-pre-wrap">
                "{note.content}"
              </p>
              
              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-1">
                  <Link href={`/room/${note.profiles.username}`} className="text-sm font-sans tracking-widest uppercase text-brand-soft hover:text-brand-accent transition-colors">
                    — {note.profiles.display_name || note.profiles.username}
                  </Link>
                  <span className="text-[10px] text-brand-soft/50 font-sans">
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="transform scale-75 origin-bottom-right opacity-80 group-hover:opacity-100 transition-opacity">
                  <CandleButton targetId={note.id} targetType="note" initialCount={note.candle_count || 0} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-brand-soft italic col-span-full">
            The wall is completely bare. Be the first to leave a mark.
          </div>
        )}
      </div>
    </div>
  );
}
