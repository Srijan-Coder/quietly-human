import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import CustomCursor from "@/components/global/CustomCursor";
import SmoothScrolling from "@/components/global/SmoothScrolling";
import { ThemeProvider } from "@/components/global/ThemeProvider";
import { AudioPlayer } from "@/components/global/AudioPlayer";
import { ReadingModeProvider } from "@/context/ReadingModeContext";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL('https://quietlyhumans.space'),
  title: {
    default: "Quietly Human Studio | Emotional Wellness",
    template: "%s | Quietly Human"
  },
  description: "A cinematic digital sanctuary for emotional wellness, overthinking, and soft living.",
  keywords: ["emotional wellness", "overthinking", "soft living", "mental health", "journaling", "introverts"],
  openGraph: {
    title: "Quietly Human Studio",
    description: "A cinematic digital sanctuary for emotional wellness, overthinking, and soft living.",
    url: "https://quietlyhumans.space",
    siteName: "Quietly Human",
    images: [
      {
        url: "/og-image.jpg", // The user can upload this to the public folder later
        width: 1200,
        height: 630,
        alt: "Quietly Human Studio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quietly Human Studio",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col font-sans bg-brand-bg text-brand-text selection:bg-brand-accent/20 selection:text-brand-text transition-colors duration-1000">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ReadingModeProvider>
            <AudioPlayer />
            {children}
          </ReadingModeProvider>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
