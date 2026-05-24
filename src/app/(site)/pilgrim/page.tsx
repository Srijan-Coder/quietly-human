import { supabaseClient } from "@/lib/supabase";
import PilgrimClient from "./PilgrimClient";

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
    <>
      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 text-center text-sm absolute top-20 left-0 right-0 z-50">
          The wall is currently obscured. Please return later.
        </div>
      )}
      <PilgrimClient initialNotes={notes || []} />
    </>
  );
}
