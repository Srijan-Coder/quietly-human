import { NextResponse } from 'next/server';
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs';
import nodemailer from 'nodemailer';

// Email templates
const getEmailTemplate = (day: number, name: string) => {
  const baseStyle = `font-family: 'Georgia', serif; color: #1a1a1a; max-width: 500px; margin: 0 auto; line-height: 1.6; padding: 20px;`;
  const headerStyle = `font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 2px;`;
  const h1Style = `font-weight: 300; font-size: 24px; margin-top: 40px; margin-bottom: 20px;`;
  const boxStyle = `margin: 40px 0; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;`;

  switch (day) {
    case 3:
      return {
        subject: "A toolkit for heavy days",
        html: `
          <div style="${baseStyle}">
            <p style="${headerStyle}">Quietly Humans</p>
            <h1 style="${h1Style}">Hello again, ${name}.</h1>
            <p>I wanted to check in and see how you are doing.</p>
            <p>When you feel overwhelmed, your brain often forgets how to help itself. That is why I built the <strong>Soft Toolkit</strong>.</p>
            <div style="${boxStyle}">
              <p style="margin-top: 0;">It is a collection of 22 interactive tools designed for specific emotional states. If you are catastrophizing, paralyzed, or just exhausted—there is a tool waiting for you.</p>
              <p style="margin-bottom: 0;"><strong><a href="https://quietlyhumans.space/toolkit" style="color: #fca311; text-decoration: none;">Bookmark the Toolkit here.</a></strong></p>
            </div>
            <p>You don't need to use it today. Just know it is there when things get loud.</p>
            <p style="margin-top: 40px;">Warmly,<br/>Srijan</p>
          </div>
        `
      };
    case 5:
      return {
        subject: "A gentle reminder",
        html: `
          <div style="${baseStyle}">
            <p style="${headerStyle}">Quietly Humans</p>
            <h1 style="${h1Style}">Just a reminder, ${name}...</h1>
            <p>You do not have to have it all figured out right now.</p>
            <p>You are allowed to rest. You are allowed to take a break. The world will keep spinning if you close your eyes for a moment.</p>
            <p>Take care of yourself today.</p>
            <p style="margin-top: 40px;">Warmly,<br/>Srijan</p>
          </div>
        `
      };
    case 7:
      return {
        subject: "Checking in (and what's next)",
        html: `
          <div style="${baseStyle}">
            <p style="${headerStyle}">Quietly Humans</p>
            <h1 style="${h1Style}">It has been a week, ${name}.</h1>
            <p>I hope the sanctuary has brought you some quiet moments.</p>
            <p>Moving forward, I will only send you the occasional midnight letter when I have something meaningful to share. No spam. No noise.</p>
            <div style="${boxStyle}">
              <p style="margin-top: 0;">If you find these tools helpful and want to support the project, consider exploring the Premium Guides in the library. But if you just need a free place to rest, you are always welcome here exactly as you are.</p>
            </div>
            <p>Until next time.</p>
            <p style="margin-top: 40px;">Warmly,<br/>Srijan</p>
          </div>
        `
      };
    default:
      return null;
  }
};

async function handler(req: Request) {
  try {
    const body = await req.json();
    const { email, name, day } = body;

    if (!email || !day) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const template = getEmailTemplate(day, name || "there");
    if (!template) {
      return NextResponse.json({ error: 'Invalid day for sequence' }, { status: 400 });
    }

    if (!process.env.GMAIL_APP_PASSWORD) {
      console.error("Missing GMAIL_APP_PASSWORD");
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'srijanpandey2025@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: '"Quietly Humans" <srijanpandey2025@gmail.com>',
      to: email,
      subject: template.subject,
      html: template.html,
    });

    console.log(`Sequence email Day ${day} sent to ${email}`);
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Error in email sequence webhook:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Wrap the handler with QStash signature verification for security
// Ensure ONLY Upstash can trigger this route
export const POST = verifySignatureAppRouter(handler, {
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY || "placeholder",
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY || "placeholder",
});
