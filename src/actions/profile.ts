"use server";

import { createClient } from "@supabase/supabase-js";

// We use the Service Role key here to bypass RLS since the user doesn't have a Supabase session
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function createProfile(data: { id: string, username: string, display_name: string, bio: string, avatar_url: string | null }) {
  try {
    // Check if username is taken
    const { data: existing } = await supabaseAdmin
      .from("profiles")
      .select("username")
      .eq("username", data.username)
      .single();

    if (existing) {
      return { error: "Username is already taken." };
    }

    const { error } = await supabaseAdmin
      .from("profiles")
      .insert([data]);

    if (error) {
      console.error(error);
      return { error: "Failed to create profile. Please try again." };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "An unexpected error occurred." };
  }
}
