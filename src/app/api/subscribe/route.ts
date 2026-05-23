import { NextResponse } from 'next/server';
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export async function POST(req: Request) {
  try {
    const { email, source = "Website Form" } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const token = process.env.SANITY_API_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'Server Configuration Error' }, { status: 500 });
    }

    const writeClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: token,
    });

    // Check if subscriber already exists
    const existing = await writeClient.fetch(`*[_type == "subscriber" && email == $email][0]`, { email });
    if (existing) {
      return NextResponse.json({ success: true, message: "Already subscribed!" }, { status: 200 });
    }

    // Create new subscriber
    await writeClient.create({
      _type: "subscriber",
      email,
      source,
      subscribedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, message: "Subscribed successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error subscribing:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
