"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const trailIdRef = useRef(0);

  useEffect(() => {
    let ringX = -100;
    let ringY = -100;
    let rafId: number;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      ringX = lerp(ringX, position.x, 0.12);
      ringY = lerp(ringY, position.y, 0.12);
      setRingPos({ x: ringX, y: ringY });
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [position]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      setPosition({ x, y });

      // Add trail particle
      const id = trailIdRef.current++;
      setTrail(prev => [...prev.slice(-6), { x, y, id }]);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        !!target.closest("a") ||
        !!target.closest("button")
      );
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Clean up trail particles
  useEffect(() => {
    const timer = setTimeout(() => {
      setTrail(prev => prev.slice(1));
    }, 80);
    return () => clearTimeout(timer);
  }, [trail]);

  return (
    <div className="hidden md:block pointer-events-none">
      {/* Comet Trail */}
      {trail.map((point, i) => (
        <div
          key={point.id}
          className="fixed rounded-full pointer-events-none z-[98]"
          style={{
            left: point.x - 3,
            top: point.y - 3,
            width: 6,
            height: 6,
            opacity: (i / trail.length) * 0.4,
            backgroundColor: "var(--color-accent)",
            transform: `scale(${(i / trail.length) * 0.8})`,
            transition: "opacity 0.1s ease",
          }}
        />
      ))}

      {/* Outer rotating ring */}
      <motion.div
        className="fixed z-[99] pointer-events-none"
        style={{
          width: 44,
          height: 44,
          left: ringPos.x - 22,
          top: ringPos.y - 22,
        }}
      >
        <motion.div
          className="w-full h-full rounded-full border-2"
          style={{
            borderColor: isHovering ? "var(--color-accent)" : "var(--color-border)",
            borderStyle: "dashed",
          }}
          animate={{
            rotate: 360,
            scale: isHovering ? 1.5 : isClicking ? 0.8 : 1,
          }}
          transition={{
            rotate: { duration: 6, repeat: Infinity, ease: "linear" },
            scale: { duration: 0.2, ease: "easeOut" },
          }}
        />
        {/* Inner cross */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-full h-[1px]" style={{ backgroundColor: "var(--color-accent)" }} />
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="h-full w-[1px]" style={{ backgroundColor: "var(--color-accent)" }} />
        </motion.div>
      </motion.div>

      {/* Dot (instant, sharp) */}
      <motion.div
        className="fixed z-[100] pointer-events-none rounded-full"
        style={{
          width: 8,
          height: 8,
          left: position.x - 4,
          top: position.y - 4,
          backgroundColor: isHovering ? "var(--color-accent)" : "var(--color-text)",
        }}
        animate={{
          scale: isClicking ? 0.5 : 1,
        }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}
