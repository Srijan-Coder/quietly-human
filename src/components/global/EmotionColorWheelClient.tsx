"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type EmotionNode = {
  name: string;
  color: string;
  children?: EmotionNode[];
  action?: string;
};

const emotionData: EmotionNode[] = [
  {
    name: "Anger", color: "#ef4444", children: [
      { name: "Frustrated", color: "#f87171", children: [
        { name: "Infuriated", color: "#fca5a5", action: "Punch a pillow, do 10 pushups, or scream into a towel." },
        { name: "Annoyed", color: "#fca5a5", action: "Step away from the trigger for 5 minutes." }
      ]},
      { name: "Bitter", color: "#f87171", children: [
        { name: "Indignant", color: "#fca5a5", action: "Write a letter you will never send." },
        { name: "Resentful", color: "#fca5a5", action: "Acknowledge what boundary was crossed." }
      ]}
    ]
  },
  {
    name: "Sadness", color: "#3b82f6", children: [
      { name: "Lonely", color: "#60a5fa", children: [
        { name: "Isolated", color: "#93c5fd", action: "Send a text to one person you trust." },
        { name: "Abandoned", color: "#93c5fd", action: "Wrap yourself tightly in a heavy blanket." }
      ]},
      { name: "Despair", color: "#60a5fa", children: [
        { name: "Grief", color: "#93c5fd", action: "Let yourself cry without trying to stop it." },
        { name: "Powerless", color: "#93c5fd", action: "Do one tiny thing you can control (make the bed)." }
      ]}
    ]
  },
  {
    name: "Fear", color: "#8b5cf6", children: [
      { name: "Anxious", color: "#a78bfa", children: [
        { name: "Overwhelmed", color: "#c4b5fd", action: "Use the 5-4-3-2-1 grounding method." },
        { name: "Worried", color: "#c4b5fd", action: "Write it down. Put it in a box until tomorrow." }
      ]},
      { name: "Insecure", color: "#a78bfa", children: [
        { name: "Inadequate", color: "#c4b5fd", action: "Name one thing you are genuinely okay at." },
        { name: "Inferior", color: "#c4b5fd", action: "Remember that everyone is pretending." }
      ]}
    ]
  },
  {
    name: "Joy", color: "#eab308", children: [
      { name: "Peaceful", color: "#facc15", children: [
        { name: "Relieved", color: "#fde047", action: "Take a deep breath and savor it." },
        { name: "Satisfied", color: "#fde047", action: "Rest. You earned it." }
      ]},
      { name: "Optimistic", color: "#facc15", children: [
        { name: "Hopeful", color: "#fde047", action: "Write down what you are looking forward to." },
        { name: "Inspired", color: "#fde047", action: "Channel this energy into something creative." }
      ]}
    ]
  }
];

export default function EmotionColorWheelClient() {
  const [path, setPath] = useState<EmotionNode[]>([]);

  const currentOptions = path.length === 0 
    ? emotionData 
    : path[path.length - 1].children;

  const handleSelect = (node: EmotionNode) => {
    setPath([...path, node]);
  };

  const goBack = () => {
    setPath(path.slice(0, -1));
  };

  const finalNode = path.length > 0 && !path[path.length - 1].children ? path[path.length - 1] : null;

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center max-w-4xl mx-auto w-full px-6">
      
      <div className="text-4xl mb-6 grayscale opacity-50 mt-12">🎨</div>
      <h2 className="font-serif text-2xl md:text-3xl text-brand-text mb-4 text-center">
        Emotion Color Wheel
      </h2>
      <p className="text-brand-soft text-sm text-center mb-12 max-w-lg">
        Alexithymia is the inability to identify or describe emotions. Start with the core feeling, and drill down until you find the exact word.
      </p>

      {/* Breadcrumb Trail */}
      <div className="flex items-center gap-2 mb-12 h-8">
        <button 
          onClick={() => setPath([])} 
          className={`text-xs uppercase tracking-widest transition-colors ${path.length === 0 ? "text-brand-text font-bold" : "text-brand-soft hover:text-brand-text"}`}
        >
          Core
        </button>
        {path.map((node, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-brand-soft">/</span>
            <button 
              onClick={() => setPath(path.slice(0, idx + 1))}
              className={`text-xs uppercase tracking-widest transition-colors ${idx === path.length - 1 ? "text-brand-text font-bold" : "text-brand-soft hover:text-brand-text"}`}
              style={{ color: idx === path.length - 1 ? node.color : undefined }}
            >
              {node.name}
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!finalNode ? (
          <motion.div
            key="selecting"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-lg"
          >
            {currentOptions?.map((node, i) => (
              <motion.button
                key={node.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleSelect(node)}
                className="aspect-square flex items-center justify-center rounded-2xl border-2 transition-all hover:scale-105"
                style={{ 
                  borderColor: node.color,
                  backgroundColor: `${node.color}15`,
                  boxShadow: `0 0 20px ${node.color}10`
                }}
              >
                <span className="font-serif text-xl" style={{ color: node.color }}>
                  {node.name}
                </span>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center w-full max-w-lg p-12 border-2 rounded-3xl"
            style={{ 
              borderColor: finalNode.color,
              backgroundColor: `${finalNode.color}10`,
              boxShadow: `0 0 40px ${finalNode.color}20`
            }}
          >
            <p className="text-brand-soft text-xs uppercase tracking-widest mb-4">You are feeling</p>
            <h2 className="font-serif text-5xl mb-8" style={{ color: finalNode.color }}>
              {finalNode.name}
            </h2>
            
            <div className="bg-brand-bg/80 backdrop-blur border border-brand-border/50 p-6 rounded-xl w-full">
              <p className="text-brand-soft text-[10px] uppercase tracking-widest mb-2">Micro-Action</p>
              <p className="text-brand-text text-sm">
                {finalNode.action}
              </p>
            </div>

            <div className="mt-12 flex gap-4">
              <button
                onClick={goBack}
                className="px-6 py-2 border border-brand-border rounded-full text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => setPath([])}
                className="px-6 py-2 rounded-full text-xs uppercase tracking-widest text-brand-bg transition-colors"
                style={{ backgroundColor: finalNode.color }}
              >
                Start Over
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-16 mb-12">
        <Link
          href="/toolkit"
          className="px-6 py-2 text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors"
        >
          Back to Toolkit
        </Link>
      </div>

    </div>
  );
}
