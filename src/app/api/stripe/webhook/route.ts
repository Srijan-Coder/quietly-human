import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const supabaseAdmin = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"),
  (process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder")
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed.", error.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // If it's a subscription, upgrade them to premium
      if (session.mode === "subscription" && session.customer) {
        const { data: updatedData } = await supabaseAdmin
          .from("profiles")
          .update({ is_premium: true })
          .eq("stripe_customer_id", session.customer)
          .select("id");

        // Webhook resilience fallback: If DB record didn't match the customer id, fetch metadata from Stripe
        if (!updatedData || updatedData.length === 0) {
          const customer = await stripe.customers.retrieve(session.customer as string);
          if (customer && !customer.deleted && customer.metadata?.clerkUserId) {
            await supabaseAdmin
              .from("profiles")
              .update({ 
                is_premium: true,
                stripe_customer_id: session.customer as string 
              })
              .eq("id", customer.metadata.clerkUserId);
          }
        }
      }
      
      // If we implement one-off purchases later (The Store), we handle it here
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      await supabaseAdmin
        .from("profiles")
        .update({ is_premium: false })
        .eq("stripe_customer_id", subscription.customer);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

