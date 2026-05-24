import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { licenseKey } = await req.json();
    
    if (!licenseKey || typeof licenseKey !== 'string') {
      return NextResponse.json({ error: "License key is required" }, { status: 400 });
    }

    // Call Gumroad API to verify the license key
    // Product permalink is from the Gumroad URL: quietlyhumansspace.gumroad.com/l/soacp
    const permalink = "soacp";

    const verifyRes = await fetch("https://api.gumroad.com/v2/licenses/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        product_permalink: permalink,
        license_key: licenseKey.trim()
      })
    });

    const data = await verifyRes.json();

    if (!data.success || data.purchase.refunded || data.purchase.chargebacked) {
      return NextResponse.json({ error: "Invalid, refunded, or expired license key." }, { status: 400 });
    }

    // License is valid! Upgrade the user in Supabase.
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ is_premium: true })
      .eq("id", userId);

    if (error) {
      console.error("Supabase Error during license redemption:", error);
      return NextResponse.json({ error: "Failed to upgrade profile in database." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Sanctuary Pass activated!" }, { status: 200 });

  } catch (error: any) {
    console.error("Gumroad License Verify Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
