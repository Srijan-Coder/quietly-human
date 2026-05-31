import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Quietly Humans",
  description: "How we handle your data at Quietly Humans. Your privacy is sacred here.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-3xl mx-auto w-full pb-24">
      <h1 className="text-4xl font-serif text-brand-text mb-8">Privacy Policy</h1>
      <div className="prose prose-stone text-brand-soft space-y-8">
        <p className="text-lg font-serif italic text-brand-text/80">
          Your privacy is respected here in this digital sanctuary. We believe in transparency, simplicity, and treating your data with the same care we treat our words.
        </p>

        <section>
          <h2 className="text-2xl font-serif text-brand-text mb-4">Data We Collect</h2>
          <p>We collect only the minimum data required to serve you well:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Email address</strong> — when you subscribe to Midnight Letters, submit a contact form, or create an account.</li>
            <li><strong>Account information</strong> — if you sign in via Clerk (our authentication provider), we receive your name, email, and profile image from your chosen sign-in method.</li>
            <li><strong>Content you create</strong> — saved items, reader notes, and any content you submit through our forms.</li>
            <li><strong>Usage data</strong> — anonymous analytics data such as page views and general geographic region, collected via Vercel Analytics.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-brand-text mb-4">Third-Party Services</h2>
          <p>We use the following trusted services to operate this sanctuary:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Clerk</strong> — authentication and user management. <a href="https://clerk.com/privacy" className="text-brand-accent hover:underline" target="_blank" rel="noopener noreferrer">Their Privacy Policy</a></li>
            <li><strong>Supabase</strong> — database for storing subscriber emails, saved items, and user content. <a href="https://supabase.com/privacy" className="text-brand-accent hover:underline" target="_blank" rel="noopener noreferrer">Their Privacy Policy</a></li>
            <li><strong>Sanity</strong> — content management system for blog posts, letters, and quotes. <a href="https://www.sanity.io/legal/privacy" className="text-brand-accent hover:underline" target="_blank" rel="noopener noreferrer">Their Privacy Policy</a></li>
            <li><strong>Stripe / Gumroad</strong> — payment processing for digital products and Sanctuary Pass. We never store your payment card details directly. <a href="https://stripe.com/privacy" className="text-brand-accent hover:underline" target="_blank" rel="noopener noreferrer">Stripe Privacy</a></li>
            <li><strong>Vercel Analytics</strong> — privacy-friendly, anonymous website analytics. No personal data is collected. <a href="https://vercel.com/legal/privacy-policy" className="text-brand-accent hover:underline" target="_blank" rel="noopener noreferrer">Their Privacy Policy</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-brand-text mb-4">Cookies</h2>
          <p>We use minimal cookies, primarily for authentication:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Session cookies</strong> — set by Clerk to keep you signed in securely. These are essential for authentication and cannot be opted out of if you wish to use account features.</li>
            <li><strong>Preference cookies</strong> — to remember your theme preference (light/dark mode) and reading settings.</li>
          </ul>
          <p className="mt-3">We do not use advertising cookies or track you across other websites.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-brand-text mb-4">Data Retention</h2>
          <p>We keep your data only as long as necessary:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Account data</strong> is retained while your account is active. You can delete your account at any time.</li>
            <li><strong>Email subscriptions</strong> are retained until you unsubscribe. Every email includes an unsubscribe link.</li>
            <li><strong>Contact form submissions</strong> are retained for up to 12 months, then deleted.</li>
            <li><strong>Analytics data</strong> is anonymous and aggregated — it cannot be tied back to you.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-brand-text mb-4">Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Access</strong> — request a copy of the personal data we hold about you.</li>
            <li><strong>Correction</strong> — ask us to correct any inaccurate information.</li>
            <li><strong>Deletion</strong> — request that we delete your personal data. We will comply within 30 days.</li>
            <li><strong>Portability</strong> — request your data in a machine-readable format.</li>
            <li><strong>Unsubscribe</strong> — opt out of marketing emails at any time via the unsubscribe link.</li>
          </ul>
          <p className="mt-3">To exercise any of these rights, please email us at <a href="mailto:srijanpandey2025@gmail.com" className="text-brand-accent hover:underline">srijanpandey2025@gmail.com</a>.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-brand-text mb-4">Children&apos;s Privacy</h2>
          <p>Quietly Humans is intended for users aged 13 and older. We do not knowingly collect personal data from children under 13. If you believe a child under 13 has provided us with personal information, please contact us and we will promptly delete it.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-brand-text mb-4">Contact Information</h2>
          <p>If you have any questions about this privacy policy or how we handle your data, please reach out:</p>
          <p className="mt-3">
            <strong>Email:</strong> <a href="mailto:srijanpandey2025@gmail.com" className="text-brand-accent hover:underline">srijanpandey2025@gmail.com</a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-brand-text mb-4">Changes to This Policy</h2>
          <p>We may update this privacy policy from time to time. When we do, we will update the effective date below. We encourage you to review this page periodically. Continued use of the site after changes constitutes acceptance of the updated policy.</p>
        </section>

        <section className="border-t border-brand-border pt-8 mt-12">
          <p className="text-sm text-brand-soft">
            <strong>Effective Date:</strong> June 1, 2025
          </p>
          <p className="text-sm text-brand-soft mt-2">
            <strong>Last Updated:</strong> June 1, 2025
          </p>
        </section>

        <p className="font-serif italic text-brand-text/60 text-center mt-12">
          We do not sell your data. We do not track you across the internet. This is a sanctuary, not a marketplace.
        </p>
      </div>
    </div>
  );
}
