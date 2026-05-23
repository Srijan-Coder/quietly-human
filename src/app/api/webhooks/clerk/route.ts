import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name } = evt.data;
    
    if (email_addresses && email_addresses.length > 0) {
      const email = email_addresses[0].email_address;
      const name = first_name || "there";

      if (!process.env.GMAIL_APP_PASSWORD) {
        console.error("Missing GMAIL_APP_PASSWORD in environment variables.");
        return new Response('Server configuration error', { status: 500 });
      }

      // Configure Nodemailer for Gmail
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
          subject: 'Welcome to the Sanctuary',
          html: `
            <div style="font-family: 'Georgia', serif; color: #1a1a1a; max-width: 500px; margin: 0 auto; line-height: 1.6; padding: 20px;">
              <p style="font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 2px;">Quietly Humans</p>
              
              <h1 style="font-weight: 300; font-size: 24px; margin-top: 40px; margin-bottom: 20px;">
                I am glad you found us, ${name}.
              </h1>
              
              <p>The internet is very loud. You are here because you needed it to be quiet.</p>
              
              <p>As promised, your free resources and ebooks are now unlocked. You can access them anytime by visiting the library while logged in.</p>
              
              <div style="margin: 40px 0; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="font-weight: 300; font-size: 18px; margin-top: 0;">Your next step:</h2>
                <p style="margin-bottom: 0;">If it is late, or if your mind is racing, I highly recommend visiting <a href="https://quietlyhumans.space/3am" style="color: #fca311; text-decoration: none;">The 3AM Room</a> right now. You are not the only one awake.</p>
              </div>
              
              <p>I will send you another letter in a few days. Until then, take a deep breath.</p>
              
              <p style="margin-top: 40px;">
                Warmly,<br/>
                Srijan
              </p>
            </div>
          `,
        });
        console.log(`Welcome email sent successfully to ${email}`);
      } catch (error) {
        console.error("Failed to send welcome email via Gmail:", error);
      }
    }
  }

  return new Response('', { status: 200 });
}
