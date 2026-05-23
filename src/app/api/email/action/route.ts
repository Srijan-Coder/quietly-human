import nodemailer from 'nodemailer';
import { NextRequest } from 'next/server';

// Extremely basic in-memory rate limiting for serverless. 
// Prevents rapid multi-clicks from the same email in the same container.
const rateLimitCache = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    const { type, title, url, userEmail } = await req.json();

    if (!userEmail || !type || !title || !url) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Rate Limiting Logic: Prevent sending more than 1 email per 30 seconds to the same address
    const now = Date.now();
    const lastSent = rateLimitCache.get(userEmail);
    if (lastSent && now - lastSent < 30000) {
      return new Response('Rate limit exceeded. Please wait 30 seconds.', { status: 429 });
    }
    rateLimitCache.set(userEmail, now);

    if (!process.env.GMAIL_APP_PASSWORD) {
      console.error("Missing GMAIL_APP_PASSWORD in environment variables.");
      return new Response('Server configuration error', { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'srijanpandey2025@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    let subject = '';
    let headline = '';
    let message = '';
    let actionText = '';

    if (type === 'download') {
      subject = `Your requested resource: ${title}`;
      headline = "Your file is ready.";
      message = `You requested a backup copy of <strong>${title}</strong>. You can securely access and download your file using the link below. Keep this safe.`;
      actionText = "Access Resource";
    } else if (type === 'save') {
      subject = `Saved to your collection: ${title}`;
      headline = "Safely stored.";
      message = `You saved <strong>${title}</strong> to your quiet collection. It will be here waiting for you whenever you need to return to it.`;
      actionText = "Return to Article";
    } else {
      return new Response('Invalid action type', { status: 400 });
    }

    // Determine the absolute URL if it's a relative path
    const absoluteUrl = url.startsWith('http') ? url : `https://quietlyhumans.space${url}`;

    // The Aesthetic Email Template
    const htmlTemplate = `
      <div style="font-family: 'Georgia', serif; color: #1a1a1a; max-width: 500px; margin: 0 auto; line-height: 1.6; padding: 20px;">
        <p style="font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 2px;">Quietly Humans</p>
        
        <h1 style="font-weight: 300; font-size: 24px; margin-top: 40px; margin-bottom: 20px;">
          ${headline}
        </h1>
        
        <p style="color: #333;">${message}</p>
        
        <div style="margin: 40px 0;">
          <a href="${absoluteUrl}" style="display: inline-block; padding: 12px 24px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; text-transform: uppercase; font-family: 'Courier New', monospace; font-size: 12px; letter-spacing: 2px; border-radius: 4px;">
            ${actionText}
          </a>
        </div>
        
        <p style="margin-top: 60px; font-size: 14px; color: #666; font-style: italic;">
          "In the quiet, we find what the noise took away."
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: '"Quietly Humans" <srijanpandey2025@gmail.com>',
      to: userEmail,
      subject: subject,
      html: htmlTemplate,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error("Action Email Error:", error);
    return new Response('Failed to send email', { status: 500 });
  }
}
