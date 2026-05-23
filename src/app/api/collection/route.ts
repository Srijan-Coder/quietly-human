import { NextResponse } from 'next/server';
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { auth } from '@clerk/nextjs/server';

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const collection = await writeClient.fetch(
      `*[_type == "userCollection" && clerkUserId == $userId][0]`,
      { userId }
    );

    return NextResponse.json({ success: true, savedItems: collection?.savedItems || [] });
  } catch (error) {
    console.error('Error fetching collection:', error);
    return NextResponse.json({ error: 'Failed to fetch collection' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { savedItems } = await req.json();

    if (!Array.isArray(savedItems)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    // Check if document exists
    const existing = await writeClient.fetch(
      `*[_type == "userCollection" && clerkUserId == $userId][0]._id`,
      { userId }
    );

    if (existing) {
      // Update existing document
      await writeClient.patch(existing)
        .set({ savedItems })
        .commit();
    } else {
      // Create new document
      await writeClient.create({
        _type: 'userCollection',
        clerkUserId: userId,
        savedItems
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating collection:', error);
    return NextResponse.json({ error: 'Failed to update collection' }, { status: 500 });
  }
}
