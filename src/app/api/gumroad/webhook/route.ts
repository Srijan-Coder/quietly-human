import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    // Gumroad sends data as form-urlencoded
    const text = await req.text();
    const params = new URLSearchParams(text);
    
    // Extract the email of the buyer
    const email = params.get("email");
    const productName = params.get("product_name");
    
    // Optional: You can verify the webhook signature here if you set a secret in Gumroad
    
    if (!email) {
      return NextResponse.json({ error: "No email provided" }, { status: 400 });
    }

    // Only process Sanctuary Pass purchases
    // Adjust this string if you named your Gumroad product slightly differently
    if (productName && !productName.toLowerCase().includes("sanctuary pass")) {
      return NextResponse.json({ message: "Ignored: Not a Sanctuary Pass purchase" }, { status: 200 });
    }

    // Find the user in Clerk by email
    const client = await clerkClient();
    const users = await client.users.getUserList({ emailAddress: [email] });
    
    if (users.data.length === 0) {
      // User hasn't created an account yet, or used a different email on Gumroad.
      // In a robust system, you might store this purchase in a "pending_upgrades" table.
      // But for V1, we just return 200 so Gumroad doesn't retry.
      console.warn(`Gumroad purchase for ${email}, but no Clerk account found.`);
      return NextResponse.json({ message: "User not found, upgrade skipped" }, { status: 200 });
    }

    const userId = users.data[0].id;

    // Update their profile in Supabase to be premium
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ is_premium: true })
      .eq("id", userId);

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: "Failed to upgrade profile" }, { status: 500 });
    }

    return NextResponse.json({ message: "User upgraded successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("Gumroad Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
