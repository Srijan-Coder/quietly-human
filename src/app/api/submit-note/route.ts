import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, quote } = body;

    if (!name || !quote) {
      return NextResponse.json({ error: "Name and Note are required." }, { status: 400 });
    }

    const token = process.env.SANITY_API_WRITE_TOKEN;
    if (!token) {
      console.error("Missing SANITY_API_WRITE_TOKEN in environment variables.");
      return NextResponse.json({ error: "Server configuration error. Please contact the administrator." }, { status: 500 });
    }

    const writeClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: token,
    });

    const newNote = await writeClient.create({
      _type: "testimonial",
      name: name,
      email: email || "No email provided",
      quote: quote,
      platform: "Website Form",
      isApproved: false, // Explicitly set to false to require manual approval
      featured: false,
    });

    return NextResponse.json({ success: true, noteId: newNote._id });
  } catch (error) {
    console.error("Error submitting reader note:", error);
    return NextResponse.json({ error: "Failed to submit note." }, { status: 500 });
  }
}
