import { NextResponse } from 'next/server';
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { folderName, items } = await req.json();

    if (!folderName || !items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const token = process.env.SANITY_API_WRITE_TOKEN;
    if (!token) return NextResponse.json({ error: 'Server config error' }, { status: 500 });

    const writeClient = createClient({
      projectId, dataset, apiVersion, useCdn: false, token
    });

    const newKit = await writeClient.create({
      _type: "sharedKit",
      name: folderName,
      authorId: userId,
      items: JSON.stringify(items),
    });

    return NextResponse.json({ success: true, kitId: newKit._id }, { status: 200 });
  } catch (error) {
    console.error('Error sharing kit:', error);
    return NextResponse.json({ error: 'Failed to share kit' }, { status: 500 });
  }
}
