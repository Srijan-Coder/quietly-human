import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pins } = await req.json();

    if (!Array.isArray(pins) || pins.length > 4) {
      return NextResponse.json({ error: "Invalid pins data" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ pins })
      .eq("id", user.id);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to update pins" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

