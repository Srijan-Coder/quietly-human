import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
// import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

// We could use verifySignatureAppRouter to ensure only QStash can call this,
// but for maximum ease-of-use during development without full QStash setup,
// we will just do a standard POST. In production, wrap the handler in verifySignatureAppRouter.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, word } = body;

    if (!email || !word) {
      return NextResponse.json({ error: "Missing email or word" }, { status: 400 });
    }

    if (!process.env.GMAIL_APP_PASSWORD) {
      console.error("Missing GMAIL_APP_PASSWORD. Cannot send anchor email.");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'srijanpandey2025@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const htmlTemplate = `
      <div style="font-family: 'Georgia', serif; color: #1a1a1a; max-width: 500px; margin: 0 auto; line-height: 1.6; padding: 20px;">
        <p style="font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 2px;">Quietly Humans</p>
        
        <h1 style="font-weight: 300; font-size: 24px; margin-top: 40px; margin-bottom: 20px;">
          Return to your anchor.
        </h1>
        
        <p style="color: #333;">You asked us to remind you. Your anchor is:</p>
        
        <div style="margin: 40px 0; padding: 30px; border: 1px solid #e0e0e0; text-align: center; background-color: #fafafa;">
          <h2 style="font-size: 32px; letter-spacing: 4px; text-transform: uppercase; margin: 0; color: #1a1a1a;">
            ${word}
          </h2>
        </div>
        
        <p style="color: #666;">Take a deep breath. Let the noise fade.</p>
        
        <p style="margin-top: 60px; font-size: 14px; color: #666; font-style: italic;">
          "In the quiet, we find what the noise took away."
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: '"Quietly Humans" <srijanpandey2025@gmail.com>',
      to: email,
      subject: `Your anchor: ${word}`,
      html: htmlTemplate,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to deliver anchor email:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
