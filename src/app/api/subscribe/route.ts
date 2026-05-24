import { NextResponse } from 'next/server';
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import nodemailer from "nodemailer";

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

    // Send Welcome Email if GMAIL_APP_PASSWORD is set
    if (process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'srijanpandey2025@gmail.com',
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      try {
        await transporter.sendMail({
          from: '"Quietly Humans" <srijanpandey2025@gmail.com>',
          to: email,
          subject: 'Welcome to the Sanctuary — Your Free Journaling Reset inside',
          html: `
            <div style="font-family: 'Georgia', serif; color: #1a1a1a; max-width: 500px; margin: 0 auto; line-height: 1.6; padding: 20px;">
              <p style="font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 2px;">Quietly Humans</p>
              
              <h1 style="font-weight: 300; font-size: 24px; margin-top: 40px; margin-bottom: 20px;">
                Your space is ready.
              </h1>
              
              <p>Thank you for joining the newsletter list. The world is very loud right now, but you can rest here.</p>
              
              <p>As promised, here is your free journaling lead magnet:</p>
              
              <div style="margin: 40px 0; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; text-align: center;">
                <h2 style="font-weight: 300; font-size: 18px; margin-top: 0;">🎁 The 7-Day Soft Reset</h2>
                <p style="margin-bottom: 20px; font-size: 14px; color: #666;">A curated journaling guide for anxious minds and overthinkers.</p>
                <a href="https://quietlyhumans.space/7-day-soft-reset.pdf" style="display: inline-block; background-color: #A0724A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 20px; font-size: 12px; font-family: sans-serif; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">
                  Download Free Journal Kit (PDF)
                </a>
              </div>
              
              <p>I will write to you twice a month with soft essays and mental grounding notes. No spam, ever.</p>
              
              <p style="margin-top: 40px;">
                Warmly,<br/>
                Srijan
              </p>
            </div>
          `,
        });
        console.log(`Lead Magnet email sent successfully to ${email}`);
      } catch (err) {
        console.error("Failed to send welcome email via Gmail:", err);
      }
    }

    return NextResponse.json({ success: true, message: "Subscribed successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error subscribing:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
