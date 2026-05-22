"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function TestimonialCarousel({ testimonials = [] }: { testimonials: any[] }) {
  const [index, setIndex] = useState(0);

  const safeTestimonials = Array.isArray(testimonials) ? testimonials : [];

  useEffect(() => {
    if (safeTestimonials.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % safeTestimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [safeTestimonials.length]);

  if (safeTestimonials.length === 0) return null;

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden px-4 md:px-12 py-16">
      <div className="flex justify-center items-center relative h-64 md:h-48">
        {testimonials.map((t, i) => (
          <motion.div
            key={t._id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{
              opacity: index === i ? 1 : 0,
              x: index === i ? 0 : index > i ? -50 : 50,
              scale: index === i ? 1 : 0.95,
              zIndex: index === i ? 10 : 0,
              pointerEvents: index === i ? "auto" : "none",
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
          >
            <p className="font-serif text-xl md:text-3xl text-brand-text leading-relaxed italic text-balance mb-6">
              "{t.quote}"
            </p>
            <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-brand-soft">
              <span className="font-semibold text-brand-accent">{t.name}</span>
              {t.handle && <span>{t.handle}</span>}
              {t.platform && <span className="opacity-60">via {t.platform}</span>}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === i ? "bg-brand-accent w-4" : "bg-brand-border hover:bg-brand-soft"
            }`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
