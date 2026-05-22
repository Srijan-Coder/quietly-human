import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function POST(request: Request) {
  try {
    const { firstName, email, source } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Sanity requires a Write Token to create documents.
    // The user must add SANITY_API_TOKEN to their .env.local file in Vercel/Local.
    const token = process.env.SANITY_API_TOKEN;

    if (!token) {
      console.warn("SANITY_API_TOKEN is missing. Returning success to allow frontend animation, but email was not saved.");
      // If we don't have a token, we pretend it succeeded so the UI animation still works for the demo.
      return NextResponse.json({ success: true, message: 'Simulated success (No Sanity Token)' });
    }

    const writeClient = client.withConfig({ token });

    await writeClient.create({
      _type: 'subscriber',
      firstName: firstName || 'Anonymous',
      email: email,
      source: source || 'Website',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}
