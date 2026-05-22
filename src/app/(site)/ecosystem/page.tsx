"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const ecosystem = [
  {
    step: 1,
    label: "Start Here — Free",
    title: "7-Day Emotional Reset",
    description: "A gentle first step. No pressure, no performance. Just 7 days of soft prompts delivered to your inbox.",
    price: "Free",
    cta: "Get the Reset",
    url: "/reset",
    accent: true,
  },
  {
    step: 2,
    label: "Read",
    title: "Books & Journals",
    description: "Short, warm books for tired hearts. Written for people who are quietly rebuilding.",
    price: "From ₹199",
    cta: "Browse Books",
    url: "/library",
  },
  {
    step: 3,
    label: "Go Deeper",
    title: "Tired Hearts Workbook",
    description: "A structured workbook with prompts, reflections, and gentle exercises for emotional clarity.",
    price: "₹399",
    cta: "Get the Workbook",
    url: "/products",
  },
  {
    step: 4,
    label: "Organise",
    title: "Healing Notion Dashboard",
    description: "A beautiful Notion system to track your emotional wellbeing, habits, and quiet wins.",
    price: "₹499",
    cta: "See the Dashboard",
    url: "/products",
  },
  {
    step: 5,
    label: "The Complete System",
    title: "Quiet Life Bundle",
    description: "Everything above, bundled at a deep discount. The complete toolkit for soft living.",
    price: "₹799",
    cta: "Get the Bundle",
    url: "/products",
  },
];

export default function EcosystemPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-24">
          <span className="text-xs uppercase tracking-widest text-brand-accent mb-4 block">The Path</span>
          <h1 className="text-5xl md:text-6xl font-serif text-brand-text mb-6">Product Ecosystem</h1>
          <p className="text-brand-soft max-w-xl mx-auto leading-relaxed">
            There is no rush. Begin where you are. Every step on this path was designed to gently support the next one.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-brand-border -translate-x-px hidden md:block" />

          <div className="flex flex-col gap-12">
            {ecosystem.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className={`relative flex flex-col md:flex-row gap-8 items-start md:items-center ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
              >
                {/* Step number — centered on the line */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-2 items-center justify-center text-xs font-medium z-10 bg-brand-bg" style={{ borderColor: item.accent ? "var(--color-accent)" : "var(--color-border)", color: item.accent ? "var(--color-accent)" : "var(--color-soft)" }}>
                  {item.step}
                </div>

                {/* Empty spacer for alternating layout */}
                <div className="hidden md:block flex-1" />

                {/* Card */}
                <div className={`flex-1 p-8 rounded-2xl border transition-all duration-500 hover:shadow-lg group ${item.accent ? "border-brand-accent bg-brand-accent/5" : "border-brand-border bg-brand-card hover:border-brand-accent"}`}>
                  <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-2 block">{item.label}</span>
                  <h3 className="font-serif text-2xl text-brand-text mb-3">{item.title}</h3>
                  <p className="text-brand-soft text-sm leading-relaxed mb-6">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xl text-brand-text">{item.price}</span>
                    <Link
                      href={item.url}
                      className={`text-xs uppercase tracking-widest px-5 py-2.5 rounded-full transition-colors ${item.accent ? "bg-brand-accent text-white hover:bg-brand-accent/80" : "border border-brand-border hover:border-brand-accent hover:text-brand-accent text-brand-text"}`}
                    >
                      {item.cta}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
