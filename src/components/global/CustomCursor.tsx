"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        !!target.closest("a") ||
        !!target.closest("button")
      );
    };

    window.addEventListener("mousemove", updateMousePosition, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <div className="hidden md:block pointer-events-none z-[9999] fixed inset-0">
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 border border-brand-accent rounded-full border-dashed"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 1.5 : 1,
          rotate: 360,
        }}
        transition={{
          x: { type: "spring", stiffness: 150, damping: 25, mass: 0.5 },
          y: { type: "spring", stiffness: 150, damping: 25, mass: 0.5 },
          scale: { type: "spring", stiffness: 300, damping: 20 },
          rotate: { duration: 10, repeat: Infinity, ease: "linear" }
        }}
        style={{ width: 40, height: 40, opacity: 0.5 }}
      />

      {/* Inner Glowing Diamond */}
      <motion.div
        className="fixed top-0 left-0 bg-brand-text"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 0 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 1000,
          damping: 40,
        }}
        style={{ 
          width: 8, 
          height: 8, 
          rotate: "45deg",
          boxShadow: "0 0 12px 2px var(--color-accent)",
        }}
      />
    </div>
  );
}
