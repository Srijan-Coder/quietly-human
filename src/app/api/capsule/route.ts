import { NextResponse } from 'next/server';
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { auth, currentUser } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    // Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
      return NextResponse.json({ error: 'Email required for capsule delivery' }, { status: 400 });
    }

    const { message, unlockDate } = await req.json();

    if (!message || !unlockDate) {
      return NextResponse.json({ error: 'Message and Unlock Date are required' }, { status: 400 });
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

    // Create new time capsule in Sanity
    const newCapsule = await writeClient.create({
      _type: "timeCapsule",
      message: message,
      unlockDate: new Date(unlockDate).toISOString(),
      createdAt: new Date().toISOString(),
      authorAlias: "A quiet human",
      userId: userId,
      userEmail: userEmail,
    });

    // Schedule QStash Email Delivery
    if (process.env.QSTASH_TOKEN && process.env.NEXT_PUBLIC_APP_URL) {
      const { Client } = await import('@upstash/qstash');
      const qstash = new Client({ token: process.env.QSTASH_TOKEN });
      
      const sequenceUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/email/capsule`;
      const targetDate = new Date(unlockDate);
      
      // Calculate Unix timestamp for notBefore
      const notBeforeTimestamp = Math.floor(targetDate.getTime() / 1000);

      await qstash.publishJSON({
        url: sequenceUrl,
        body: { email: userEmail, message, capsuleId: newCapsule._id },
        notBefore: notBeforeTimestamp,
      });

      console.log(`Capsule email scheduled for ${targetDate.toISOString()} via QStash`);
    } else {
      console.warn("Skipping email schedule: QSTASH_TOKEN or NEXT_PUBLIC_APP_URL missing.");
    }

    return NextResponse.json({ success: true, capsuleId: newCapsule._id, unlockDate: new Date(unlockDate).toISOString() }, { status: 200 });
  } catch (error) {
    console.error('Error saving time capsule:', error);
    return NextResponse.json({ error: 'Failed to save time capsule' }, { status: 500 });
  }
}
