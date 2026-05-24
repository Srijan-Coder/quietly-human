import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"),
  (process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder")
);

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // SECURITY CHECK: Ensure it's the admin
    const isAdmin = user.emailAddresses.some(email => email.emailAddress === process.env.ADMIN_EMAIL);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { targetId, targetType } = await req.json();

    if (targetType === "user") {
      // Delete user from Supabase profiles (cascade will delete their posts/follows)
      const { error } = await supabaseAdmin.from("profiles").delete().eq("id", targetId);
      if (error) throw error;
      // Note: Ideally we would also delete the user from Clerk here using Clerk Backend SDK.
    } else if (targetType === "post") {
      // Delete specific post
      const { error } = await supabaseAdmin.from("posts").delete().eq("id", targetId);
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

