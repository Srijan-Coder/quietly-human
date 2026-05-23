import EmotionColorWheelClient from "@/components/global/EmotionColorWheelClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Emotion Color Wheel — Quietly Humans",
  description: "Combat alexithymia by identifying your exact emotion and getting an actionable micro-step.",
};

export default function EmotionColorWheelPage() {
  return (
    <div className="pt-20 pb-0">
      <EmotionColorWheelClient />
    </div>
  );
}
