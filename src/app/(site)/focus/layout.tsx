import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Deep Focus Timer — Pomodoro with Ambient Sounds | Quietly Humans",
  description: "A beautiful Pomodoro timer with ambient soundscapes for deep work and concentration."
};
export default function FocusLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
