import { NextResponse } from 'next/server';
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export async function POST(req: Request) {
  try {
    const { message, unlockDays } = await req.json();

    if (!message || !unlockDays) {
      return NextResponse.json({ error: 'Message and Unlock Days are required' }, { status: 400 });
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

    // Calculate unlock date
    const unlockDate = new Date();
    unlockDate.setDate(unlockDate.getDate() + unlockDays);

    // Create new time capsule
    const newCapsule = await writeClient.create({
      _type: "timeCapsule",
      message: message,
      unlockDate: unlockDate.toISOString(),
      createdAt: new Date().toISOString(),
      authorAlias: "A quiet human",
    });

    return NextResponse.json({ success: true, capsuleId: newCapsule._id, unlockDate: unlockDate.toISOString() }, { status: 200 });
  } catch (error) {
    console.error('Error saving time capsule:', error);
    return NextResponse.json({ error: 'Failed to save time capsule' }, { status: 500 });
  }
}
