import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const text = await req.text();
    let email: string | null = null;
    let productName: string | null = null;

    // Check if the content is JSON or urlencoded
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        const json = JSON.parse(text);
        email = json.email || null;
        productName = json.product_name || null;
      } catch (err) {
        console.error("Failed to parse JSON body:", err);
      }
    }

    // Fallback to url-encoded parameter parsing
    if (!email) {
      const params = new URLSearchParams(text);
      email = params.get("email");
      productName = params.get("product_name");
    }

    if (!email) {
      return NextResponse.json({ error: "No email provided" }, { status: 400 });
    }

    // Only process Sanctuary Pass purchases
    if (productName && !productName.toLowerCase().includes("sanctuary pass")) {
      return NextResponse.json({ message: "Ignored: Not a Sanctuary Pass purchase" }, { status: 200 });
    }

    // Find the user in Clerk by email
    const client = await clerkClient();
    const users = await client.users.getUserList({ emailAddress: [email] });
    
    if (users.data.length === 0) {
      // User hasn't created an account yet, or used a different email on Gumroad.
      console.warn(`Gumroad purchase for ${email}, but no Clerk account found.`);
      return NextResponse.json({ message: "User not found, upgrade deferred" }, { status: 200 });
    }

    const userId = users.data[0].id;

    // Update their profile in Supabase to be premium
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ is_premium: true })
      .eq("id", userId);

    if (error) {
      console.error("Supabase Error during webhook upgrade:", error);
      return NextResponse.json({ error: "Failed to upgrade profile" }, { status: 500 });
    }

    console.log(`Gumroad upgrade successful: ${email} upgraded to premium status.`);
    return NextResponse.json({ message: "User upgraded successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("Gumroad Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
