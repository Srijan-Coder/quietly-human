import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Quietly Humans",
  description: "Terms of service for using the Quietly Humans platform and digital products.",
};

export default function Terms() {
  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-3xl mx-auto w-full pb-24">
      <h1 className="text-4xl font-serif text-brand-text mb-8">Terms of Service</h1>
      <div className="prose prose-stone text-brand-soft space-y-8">
        <p className="text-lg font-serif italic text-brand-text/80">
          By using the Quietly Humans Studio website and digital products, you agree to treat this space — and yourself — with kindness.
        </p>

        <section>
          <h2 className="text-2xl font-serif text-brand-text mb-4">1. Acceptance of Terms</h2>
          <p>By accessing or using Quietly Humans (quietlyhumans.space), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use the site.</p>
          <p className="mt-3">We may update these terms from time to time. Your continued use of the platform after changes are posted constitutes acceptance of the revised terms.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-brand-text mb-4">2. User Accounts</h2>
          <p>Some features require creating an account via Clerk (our authentication provider). When you create an account, you agree to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Provide accurate and current information.</li>
            <li>Keep your account credentials secure.</li>
            <li>Be responsible for all activity under your account.</li>
            <li>Notify us immediately of any unauthorized use.</li>
          </ul>
          <p className="mt-3">We reserve the right to suspend or terminate accounts that violate these terms.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-brand-text mb-4">3. User Content</h2>
          <p>You retain ownership of any content you submit to Quietly Humans, including reader notes, messages, and form submissions.</p>
          <p className="mt-3">By submitting content, you grant Quietly Humans a non-exclusive, royalty-free, worldwide license to display, distribute, and use your content in connection with operating the platform. This includes displaying reader notes on the testimonials page (after approval).</p>
          <p className="mt-3">You represent that you have the right to submit any content you share and that it does not violate the rights of any third party.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-brand-text mb-4">4. Prohibited Conduct</h2>
          <p>This is a sanctuary. To keep it safe, you agree not to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Use the platform for any unlawful purpose.</li>
            <li>Harass, abuse, or harm other users.</li>
            <li>Submit spam, malicious code, or misleading content.</li>
            <li>Attempt to gain unauthorized access to any part of the platform.</li>
            <li>Scrape, crawl, or use automated means to access the site without permission.</li>
            <li>Redistribute, resell, or commercially exploit our content or digital products without authorization.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-brand-text mb-4">5. Intellectual Property</h2>
          <p>All content on Quietly Humans — including blog posts, letters, quotes, ebooks, designs, graphics, and code — is the intellectual property of Quietly Humans unless otherwise stated.</p>
          <p className="mt-3">All digital products, Notion templates, PDF workbooks, and quote graphics are licensed for <strong>personal use only</strong> and may not be redistributed, resold, or shared without written permission.</p>
          <p className="mt-3">Guest-submitted content remains the property of the respective authors, with a license granted to Quietly Humans for display purposes.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-brand-text mb-4">6. Sanctuary Pass &amp; Premium Features</h2>
          <p>Quietly Humans offers premium features through the Sanctuary Pass subscription and one-time digital product purchases.</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Payments</strong> are processed securely through Stripe or Gumroad. We never store your payment card details directly.</li>
            <li><strong>Subscriptions</strong> renew automatically unless cancelled before the renewal date.</li>
            <li><strong>Refunds</strong> — due to the digital nature of our products, all sales are generally final. However, if you experience a genuine issue, contact us within 7 days of purchase and we will do our best to help.</li>
            <li><strong>Access</strong> — premium content and features are available only while your subscription is active.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-brand-text mb-4">7. Disclaimers</h2>
          <p>Quietly Humans provides content for informational, educational, and emotional wellness purposes only. Our content is <strong>not a substitute for professional medical, psychological, or therapeutic advice</strong>.</p>
          <p className="mt-3">The platform is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, express or implied. We do not guarantee that the site will be uninterrupted, error-free, or secure at all times.</p>
          <p className="mt-3">If you are in crisis, please reach out to a qualified professional or a crisis helpline in your region.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-brand-text mb-4">8. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, Quietly Humans and its creators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform or digital products.</p>
          <p className="mt-3">Our total liability for any claim arising from these terms or your use of the platform shall not exceed the amount you paid to us in the 12 months preceding the claim.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-brand-text mb-4">9. Governing Law</h2>
          <p>These terms are governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in India.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-brand-text mb-4">10. Changes to Terms</h2>
          <p>We may revise these terms at any time. When we make significant changes, we will update the effective date below. We encourage you to review this page periodically.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-brand-text mb-4">11. Contact</h2>
          <p>If you have questions about these terms, please reach out:</p>
          <p className="mt-3">
            <strong>Email:</strong> <a href="mailto:srijanpandey2025@gmail.com" className="text-brand-accent hover:underline">srijanpandey2025@gmail.com</a>
          </p>
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
          Take what you need, and leave the rest.
        </p>
      </div>
    </div>
  );
}
