import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Ecosystem | Quietly Humans",
  description: "Discover the complete Quietly Humans product ecosystem — from free emotional resets to premium toolkits for soft living."
};

export default function EcosystemLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
