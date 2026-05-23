import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, name, email, title, bodyText, coverImageBase64 } = body;

    if (!name || !bodyText) {
      return NextResponse.json({ error: "Name and Body are required." }, { status: 400 });
    }

    if ((type === "blog" || type === "letter") && !title) {
      return NextResponse.json({ error: "Title is required for Blogs and Letters." }, { status: 400 });
    }

    const token = process.env.SANITY_API_WRITE_TOKEN;
    if (!token) {
      console.error("Missing SANITY_API_WRITE_TOKEN");
      return NextResponse.json({ 
        error: "Server Configuration Error: The SANITY_API_WRITE_TOKEN is missing. Please create an API token in Sanity with Editor permissions and add it to your .env.local file or Vercel Environment Variables." 
      }, { status: 500 });
    }

    const writeClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: token,
    });

    // Helper to convert plain text to simple Portable Text array
    const toPortableText = (text: string) => {
      return text.split('\n').filter(p => p.trim() !== '').map(p => ({
        _type: 'block',
        children: [{ _type: 'span', text: p }]
      }));
    };

    // Helper to generate a slug
    const generateSlug = (str: string) => {
      return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    let imageAssetId = null;

    // Handle Image Upload if base64 provided
    if (type === "blog" && coverImageBase64) {
      try {
        const matches = coverImageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const buffer = Buffer.from(matches[2], 'base64');
          const asset = await writeClient.assets.upload('image', buffer, {
            contentType: matches[1]
          });
          imageAssetId = asset._id;
        }
      } catch (err) {
        console.error("Failed to upload image:", err);
        return NextResponse.json({ error: "Failed to upload cover image. It might be too large or corrupted." }, { status: 400 });
      }
    }

    let newDoc;

    if (type === "blog") {
      newDoc = await writeClient.create({
        _type: "post",
        title: title,
        slug: { _type: 'slug', current: `${generateSlug(title)}-${Date.now()}` },
        guestName: name,
        guestEmail: email || "No email provided",
        isApproved: true, // Instantly approved
        publishedAt: new Date().toISOString(),
        body: toPortableText(bodyText),
        ...(imageAssetId ? { mainImage: { _type: 'image', asset: { _type: 'reference', _ref: imageAssetId } } } : {})
      });
    } else if (type === "letter") {
      newDoc = await writeClient.create({
        _type: "letter",
        title: title,
        slug: { _type: 'slug', current: `${generateSlug(title)}-${Date.now()}` },
        guestName: name,
        guestEmail: email || "No email provided",
        isApproved: true, // Instantly approved
        publishedAt: new Date().toISOString(),
        body: toPortableText(bodyText),
      });
    } else {
      // Default to Testimonial/Note
      newDoc = await writeClient.create({
        _type: "testimonial",
        name: name,
        email: email || "No email provided",
        quote: bodyText,
        platform: "Website Form",
        isApproved: true, 
        featured: false,
      });
    }

    return NextResponse.json({ success: true, docId: newDoc._id });
  } catch (error: any) {
    console.error("Error submitting document:", error);
    if (error?.message?.includes("Insufficient permissions")) {
      return NextResponse.json({ error: "Sanity Permission Denied. Please ensure your SANITY_API_WRITE_TOKEN has 'Editor' access rights." }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to submit. Please try again later." }, { status: 500 });
  }
}
