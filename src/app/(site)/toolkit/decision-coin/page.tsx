import DecisionCoinClient from "@/components/global/DecisionCoinClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Decision Coin — Quietly Humans",
  description: "For chronic overthinkers. The universe will give you a definitive answer.",
};

export default function DecisionCoinPage() {
  return (
    <div className="pt-32 pb-20">
      <DecisionCoinClient />
    </div>
  );
}
