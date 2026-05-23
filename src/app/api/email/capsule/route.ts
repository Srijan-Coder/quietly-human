import { NextResponse } from 'next/server';
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs';
import nodemailer from 'nodemailer';

async function handler(req: Request) {
  try {
    const body = await req.json();
    const { email, message, capsuleId } = body;

    if (!email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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

    const htmlContent = `
      <div style="font-family: 'Georgia', serif; color: #1a1a1a; max-width: 500px; margin: 0 auto; line-height: 1.6; padding: 20px;">
        <p style="font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 2px;">The Quiet Archive</p>
        
        <h1 style="font-weight: 300; font-size: 24px; margin-top: 40px; margin-bottom: 20px;">
          A message from the past.
        </h1>
        
        <p>A while ago, you wrote a note to your future self and sealed it in the Quiet Archive.</p>
        <p>Today is the day you chose to open it.</p>
        
        <div style="margin: 40px 0; padding: 30px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #fafafa; font-style: italic;">
          "${message}"
        </div>
        
        <p>You can visit the <a href="https://quietlyhumans.space/archive" style="color: #fca311; text-decoration: none;">Quiet Archive</a> anytime to leave another message.</p>
        
        <p style="margin-top: 40px;">
          Warmly,<br/>
          Quietly Humans
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: '"Quietly Humans" <srijanpandey2025@gmail.com>',
      to: email,
      subject: "A message from your past self",
      html: htmlContent,
    });

    console.log(`Capsule email sent to ${email} for capsule ${capsuleId}`);
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Error in capsule email webhook:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Ensure ONLY Upstash can trigger this route
export const POST = verifySignatureAppRouter(handler);
