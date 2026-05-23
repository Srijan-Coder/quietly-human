import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


import { ThemeProvider } from "@/components/global/ThemeProvider";
import { ReadingModeProvider } from "@/context/ReadingModeContext";
import { AnnouncementBar } from "@/components/global/AnnouncementBar";
import { client } from "@/sanity/lib/client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL('https://quietlyhumans.space'),
  title: {
    default: "Quietly Humans Studio | Emotional Wellness",
    template: "%s | Quietly Humans"
  },
  description: "A cinematic digital sanctuary for emotional wellness, overthinking, and soft living.",
  keywords: ["emotional wellness", "overthinking", "soft living", "mental health", "journaling", "introverts"],
  openGraph: {
    title: "Quietly Humans Studio",
    description: "A cinematic digital sanctuary for emotional wellness, overthinking, and soft living.",
    url: "https://quietlyhumans.space",
    siteName: "Quietly Humans",
    images: [
      {
        url: "/og-image.jpg", // The user can upload this to the public folder later
        width: 1200,
        height: 630,
        alt: "Quietly Humans Studio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quietly Humans Studio",
    description: "A cinematic digital sanctuary for emotional wellness, overthinking, and soft living.",
    creator: "@quietlyhuman",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let announcement = null;
  try {
    announcement = await client.fetch(`*[_type == "announcement"][0]`, {}, { next: { revalidate: 60 } });
  } catch (error) { console.error(error); }

  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${cormorant.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Quietly Humans Studio",
                "url": "https://quietlyhumans.space",
                "description": "A cinematic digital sanctuary for emotional wellness, overthinking, and soft living.",
              })
            }}
          />
        </head>
        <body className="min-h-screen flex flex-col font-sans bg-brand-bg text-brand-text selection:bg-brand-accent/20 selection:text-brand-text transition-colors duration-1000">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            <ReadingModeProvider>
              <AnnouncementBar data={announcement} />
              {children}
            </ReadingModeProvider>
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
