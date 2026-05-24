import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

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
    }

    // Instead of direct redirect, route through the safety warning page
    // We pass the raw url so the leaving page can handle it
    const leavingUrl = new URL("/leaving", req.url);
    leavingUrl.searchParams.set("url", url);
    return NextResponse.redirect(leavingUrl.toString());
  } catch (error: any) {
    console.error("Analytics Click Error:", error);
    
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    if (url) {
      const leavingUrl = new URL("/leaving", req.url);
      leavingUrl.searchParams.set("url", url);
      return NextResponse.redirect(leavingUrl.toString());
    }
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
