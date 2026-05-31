import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Midnight Letters — Weekly Reflections | Quietly Humans",
  description: "Quiet letters written at midnight for overthinkers, soft hearts, and people who think too much."
};

export default function LettersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
