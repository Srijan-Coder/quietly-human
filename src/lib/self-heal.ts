import { supabaseAdmin } from "@/lib/supabase";
import type { User } from "@clerk/nextjs/server";

export async function ensureProfileExists(user: User) {
  let { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    const email = user.emailAddresses[0]?.emailAddress || "";
    const baseUsername = user.username || email.split("@")[0] || `user_${Date.now()}`;
    const cleanedUsername = baseUsername.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase() || `user_${Math.floor(Math.random() * 1000)}`;
    
    let username = cleanedUsername;
    const { data: existingUser } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();
    
    if (existingUser) {
      username = `${cleanedUsername}_${Math.floor(Math.random() * 1000)}`;
    }

    const { data: newProfile, error: createError } = await supabaseAdmin
      .from("profiles")
      .insert([{
        id: user.id,
        username,
        display_name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || username,
        avatar_url: user.imageUrl || null,
        bio: null,
        room_theme: "dark",
        is_premium: false
      }])
      .select("id")
      .maybeSingle();

    if (createError) {
      console.error("Auto profile creation failed:", createError);
      return false;
    }
    return true;
  }
  return true;
}
