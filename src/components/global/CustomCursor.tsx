"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 40, stiffness: 600, mass: 0.1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const dotSpringConfig = { damping: 40, stiffness: 1000, mass: 0.05 };
  const dotX = useSpring(mouseX, dotSpringConfig);
  const dotY = useSpring(mouseY, dotSpringConfig);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
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
  }, [mouseX, mouseY]);

  return (
    <div className="hidden md:block pointer-events-none z-[9999] fixed inset-0">
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 border border-brand-accent rounded-full border-dashed"
        animate={{
          scale: isHovering ? 1.5 : 1,
          rotate: 360,
        }}
        transition={{
          scale: { type: "spring", stiffness: 300, damping: 20 },
          rotate: { duration: 10, repeat: Infinity, ease: "linear" }
        }}
        style={{ 
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          width: 40, 
          height: 40, 
          opacity: 0.5,
          willChange: "transform"
        }}
      />

      {/* Inner Glowing Diamond */}
      <motion.div
        className="fixed top-0 left-0 bg-brand-text"
        animate={{
          scale: isHovering ? 0 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 1000,
          damping: 40,
        }}
        style={{ 
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: 8, 
          height: 8, 
          rotate: "45deg",
          boxShadow: "0 0 12px 2px var(--color-accent)",
          willChange: "transform"
        }}
      />
    </div>
  );
}
