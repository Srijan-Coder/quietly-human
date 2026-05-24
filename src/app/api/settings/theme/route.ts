import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomTheme } = await req.json();

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ room_theme: roomTheme })
      .eq("id", user.id);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to update theme." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

