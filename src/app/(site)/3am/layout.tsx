import { Metadata } from "next";
export const metadata: Metadata = {
  title: "The 3AM Room — For When You Can't Sleep | Quietly Humans",
  description: "A late-night sanctuary for when the world is asleep but your mind isn't. You are not the only one awake."
};
export default function ThreeAMLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
