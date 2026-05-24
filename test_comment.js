import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

async function testComment() {
  const { data: profiles, error: pErr } = await supabaseAdmin.from("profiles").select("id").limit(1);
  if (pErr) console.error("Profile Error:", pErr);
  
  const { data: posts, error: postErr } = await supabaseAdmin.from("posts").select("id").limit(1);
  if (postErr) console.error("Post Error:", postErr);

  if (profiles?.[0] && posts?.[0]) {
    const { data, error } = await supabaseAdmin
      .from("comments")
      .insert([{
        post_id: posts[0].id,
        author_id: profiles[0].id,
        content: "Test comment from script"
      }])
      .select("*, author:profiles(id, username, display_name, avatar_url)")
      .single();

    if (error) {
      console.error("Comment Insert Error:", error);
    } else {
      console.log("Success:", data);
    }
  } else {
    console.log("Missing profile or post");
  }
}

testComment();
