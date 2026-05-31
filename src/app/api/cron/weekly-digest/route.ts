import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { clerkClient } from "@clerk/nextjs/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");

    // Secure the cron endpoint
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerk = await clerkClient();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString();

    // 1. Fetch all creator profiles
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, username, display_name");

    if (profileError || !profiles) {
      return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
    }

    const digestsSent = [];

    // Setup Nodemailer transporter if environment variables are provided
    const hasSmtpConfig = 
      process.env.SMTP_HOST && 
      process.env.SMTP_USER && 
      process.env.SMTP_PASS;

    const transporter = hasSmtpConfig 
      ? nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        })
      : null;

    // 2. Fetch engagement details for each creator
    for (const profile of profiles) {
      // Query views in the last 7 days
      const { count: viewsCount } = await supabaseAdmin
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", profile.id)
        .gte("created_at", sevenDaysAgoStr);

      // Query link clicks in the last 7 days
      const { count: clicksCount } = await supabaseAdmin
        .from("link_clicks")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", profile.id)
        .gte("created_at", sevenDaysAgoStr);

      // Query new follows in the last 7 days
      const { count: followsCount } = await supabaseAdmin
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", profile.id)
        .gte("created_at", sevenDaysAgoStr);

      // Only send if there is actual activity to report
      if ((viewsCount || 0) > 0 || (followsCount || 0) > 0 || (clicksCount || 0) > 0) {
        let recipientEmail = "";
        
        try {
          // Fetch creator email from Clerk
          const clerkUser = await clerk.users.getUser(profile.id);
          recipientEmail = clerkUser.emailAddresses[0]?.emailAddress || "";
        } catch (e) {
          console.error(`Failed to retrieve Clerk email for creator ${profile.id}:`, e);
        }

        if (recipientEmail) {
          const name = profile.display_name || profile.username;
          const emailSubject = "Your Weekly Sanctuary Digest 🕊️";
          
          const emailHtml = `
            <div style="font-family: serif; background-color: #FAF8F5; color: #1C1917; padding: 40px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #E7E5E4;">
              <h1 style="font-size: 24px; font-weight: normal; margin-bottom: 20px; color: #1C1917;">Your Weekly Sanctuary Digest</h1>
              <p style="font-style: italic; color: #78716C; margin-bottom: 30px; line-height: 1.6;">
                Hello ${name}, here is how your quiet space engaged over the past 7 days.
              </p>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 40px; text-align: center;">
                <div style="background-color: #F5F5F4; padding: 16px; border-radius: 12px; border: 1px solid #E7E5E4;">
                  <span style="font-size: 20px; block; margin-bottom: 4px;">👁️</span>
                  <p style="font-size: 10px; uppercase; tracking-wider; margin: 0; color: #78716C;">Views</p>
                  <strong style="font-size: 20px; color: #1C1917;">${viewsCount || 0}</strong>
                </div>
                <div style="background-color: #F5F5F4; padding: 16px; border-radius: 12px; border: 1px solid #E7E5E4;">
                  <span style="font-size: 20px; block; margin-bottom: 4px;">🏷️</span>
                  <p style="font-size: 10px; uppercase; tracking-wider; margin: 0; color: #78716C;">Link Clicks</p>
                  <strong style="font-size: 20px; color: #1C1917;">${clicksCount || 0}</strong>
                </div>
                <div style="background-color: #F5F5F4; padding: 16px; border-radius: 12px; border: 1px solid #E7E5E4;">
                  <span style="font-size: 20px; block; margin-bottom: 4px;">✨</span>
                  <p style="font-size: 10px; uppercase; tracking-wider; margin: 0; color: #78716C;">Followers</p>
                  <strong style="font-size: 20px; color: #1C1917;">${followsCount || 0}</strong>
                </div>
              </div>
              
              <hr style="border: 0; border-top: 1px solid #E7E5E4; margin-bottom: 30px;" />
              
              <p style="font-size: 12px; color: #78716C; line-height: 1.6; text-align: center;">
                Track detailed post performance or manage your store links anytime in your dashboard.
              </p>
              <div style="text-align: center; margin-top: 24px;">
                <a href="https://www.quietlyhumans.space/dashboard" style="background-color: #1C1917; color: #FAF8F5; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">
                  Go to Dashboard
                </a>
              </div>
            </div>
          `;

          if (transporter) {
            await transporter.sendMail({
              from: `"Quietly Humans" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
              to: recipientEmail,
              subject: emailSubject,
              html: emailHtml,
            });
            digestsSent.push({ username: profile.username, email: recipientEmail, status: "sent" });
          } else {
            // Log compile output if SMTP credentials aren't set yet (for development)
            console.log(`[Weekly Digest Sandbox Log] Email to: ${recipientEmail} with contents:`, {
              views: viewsCount,
              clicks: clicksCount,
              follows: followsCount
            });
            digestsSent.push({ username: profile.username, email: recipientEmail, status: "sandbox_logged" });
          }
        }
      }
    }

    return NextResponse.json({ success: true, digestsSent });
  } catch (error: any) {
    console.error("Weekly Digest Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
