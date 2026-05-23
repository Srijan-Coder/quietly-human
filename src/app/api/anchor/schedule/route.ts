import { NextResponse } from "next/server";
import { Client } from "@upstash/qstash";

export async function POST(req: Request) {
  try {
    const { word, email, timestamp } = await req.json();

    if (!word || !email || !timestamp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!process.env.QSTASH_TOKEN) {
      console.warn("QSTASH_TOKEN is missing. Skipping external scheduling. To enable Time-Travel Emails, add QSTASH_TOKEN to your environment.");
      return NextResponse.json({ success: true, warning: "QSTASH_TOKEN missing" });
    }

    const qstash = new Client({ token: process.env.QSTASH_TOKEN });
    
    // Determine the base URL for the webhook
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    
    const deliveryUrl = `${baseUrl}/api/anchor/deliver`;

    // QStash expects `notBefore` in seconds
    const notBefore = Math.floor(timestamp / 1000);

    const res = await qstash.publishJSON({
      url: deliveryUrl,
      body: { email, word },
      notBefore,
    });

    return NextResponse.json({ success: true, messageId: res.messageId });
  } catch (error: any) {
    console.error("Failed to schedule anchor email:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
