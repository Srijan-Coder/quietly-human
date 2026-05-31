import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Reach Out Quietly | Quietly Humans",
  description: "Get in touch with Quietly Humans. We'd love to hear from you."
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
