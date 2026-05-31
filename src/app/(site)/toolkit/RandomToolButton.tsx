"use client";
import { useRouter } from "next/navigation";
const toolPaths = ["/toolkit/worry-dissolver","/toolkit/daily-anchor","/toolkit/panic-redirector","/toolkit/brain-dump","/toolkit/decision-coin","/toolkit/control-sorter","/toolkit/leaves-on-stream","/toolkit/view-from-above","/toolkit/air-lock","/toolkit/task-atomizer","/toolkit/dopamine-menu","/toolkit/energy-battery","/toolkit/cognitive-courtroom","/toolkit/urge-surfer","/toolkit/yes-but-flipper","/toolkit/emotion-color-wheel","/toolkit/friction-generator","/toolkit/worry-postponer","/toolkit/done-list","/toolkit/grounding-sandbox"];
export default function RandomToolButton() {
  const router = useRouter();
  return (
    <button onClick={() => router.push(toolPaths[Math.floor(Math.random() * toolPaths.length)])} className="px-8 py-4 rounded-full border border-brand-border text-brand-soft hover:text-brand-text hover:border-brand-accent transition-all text-xs uppercase tracking-widest cursor-pointer">
      Pick a Random Tool
    </button>
  );
}
