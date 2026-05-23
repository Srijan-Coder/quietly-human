import { NextResponse } from 'next/server';
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export async function POST(req: Request) {
  try {
    const { documentId } = await req.json();

    if (!documentId) {
      return NextResponse.json({ error: 'documentId is required' }, { status: 400 });
    }

    const token = process.env.SANITY_API_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'Missing SANITY_API_WRITE_TOKEN' }, { status: 500 });
    }

    const writeClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: token,
    });

    // Use Sanity's .inc() method to increment the likes count atomically
    const response = await writeClient
      .patch(documentId)
      .setIfMissing({ likes: 0 })
      .inc({ likes: 1 })
      .commit();

    return NextResponse.json({ success: true, likes: response.likes }, { status: 200 });
  } catch (error) {
    console.error('Error incrementing likes:', error);
    return NextResponse.json({ error: 'Failed to increment likes' }, { status: 500 });
  }
}
