import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia" as any, // Bypass TS strict check to ensure compatibility with installed stripe package
  appInfo: {
    name: "Quietly Humans",
    version: "0.1.0"
  }
});
