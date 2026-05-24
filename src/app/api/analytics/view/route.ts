import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { profile_id, path } = await req.json();

    if (!profile_id || !path) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Ignore views to the root home page if we only want to track creator rooms
    if (path === "/") {
      return NextResponse.json({ message: "Ignored root path" }, { status: 200 });
    }

    const { error } = await supabaseAdmin
      .from("page_views")
      .insert({ profile_id, path });

    if (error) {
      console.error("Supabase Error logging view:", error);
      return NextResponse.json({ error: "Failed to log view" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Analytics View Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
