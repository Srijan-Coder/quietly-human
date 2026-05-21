import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import CustomCursor from "@/components/global/CustomCursor";
import SmoothScrolling from "@/components/global/SmoothScrolling";

export const metadata: Metadata = {
  title: "Quietly Human | Emotional Wellness",
  description: "A cinematic digital sanctuary for emotional wellness, overthinking, and soft living.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col font-sans bg-brand-cream text-brand-charcoal selection:bg-brand-coffee/20 selection:text-brand-charcoal">
        {children}
      </body>
    </html>
  );
}
