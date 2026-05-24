import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const profile_id = searchParams.get("profile_id");
    const url = searchParams.get("url");

    if (!profile_id || !url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("link_clicks")
      .insert({ profile_id, url });

    if (error) {
      console.error("Supabase Error logging click:", error);
      // Even if logging fails, we should still redirect the user
    }

    return NextResponse.redirect(url);
  } catch (error: any) {
    console.error("Analytics Click Error:", error);
    // Fallback redirect if something completely breaks
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    if (url) return NextResponse.redirect(url);
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
