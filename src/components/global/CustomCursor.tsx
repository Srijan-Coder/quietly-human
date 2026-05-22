"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // We bypass React state entirely — all animation is done via direct DOM for zero lag
    let mouseX = -200;
    let mouseY = -200;
    let ringX = -200;
    let ringY = -200;
    let isHovering = false;
    let rafId: number;

    // Trail positions ring-buffer
    const TRAIL_COUNT = 6;
    const trailX = new Array(TRAIL_COUNT).fill(-200);
    const trailY = new Array(TRAIL_COUNT).fill(-200);
    let trailFrame = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      // Smooth ring follow
      ringX = lerp(ringX, mouseX, 0.1);
      ringY = lerp(ringY, mouseY, 0.1);

      // Dot — instant
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px) rotate(45deg)`;
      }

      // Ring
      if (ringRef.current) {
        const rotation = (Date.now() / 20) % 360;
        ringRef.current.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px) rotate(${rotation}deg)`;
        ringRef.current.style.borderColor = isHovering
          ? "var(--color-accent)"
          : "var(--color-accent)";
        ringRef.current.style.scale = isHovering ? "1.6" : "1";
      }

      // Trail — update every other frame for perf
      trailFrame++;
      if (trailFrame % 2 === 0) {
        trailX.pop(); trailX.unshift(mouseX);
        trailY.pop(); trailY.unshift(mouseY);

        trailRefs.current.forEach((el, i) => {
          if (!el) return;
          el.style.transform = `translate(${trailX[i] - 3}px, ${trailY[i] - 3}px) rotate(45deg)`;
          el.style.opacity = String((1 - i / TRAIL_COUNT) * 0.35);
          el.style.scale = String(1 - i * 0.12);
        });
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      isHovering =
        t.tagName === "A" ||
        t.tagName === "BUTTON" ||
        !!t.closest("a") ||
        !!t.closest("button");
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  return (
    <div className="hidden md:block pointer-events-none select-none">
      {/* Dot - Diamond shape */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[101] pointer-events-none"
        style={{
          width: 8,
          height: 8,
          backgroundColor: "var(--color-text)",
          boxShadow: "0 0 10px 2px var(--color-text)",
          willChange: "transform",
          transition: "background-color 0.2s, scale 0.2s",
        }}
      />

      {/* Ring - Rotating Dashed */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[100] pointer-events-none rounded-full border border-dashed"
        style={{
          width: 40,
          height: 40,
          borderColor: "var(--color-accent)",
          willChange: "transform",
          transition: "border-color 0.3s, scale 0.25s ease",
          opacity: 0.6,
        }}
      />

      {/* Trail - Glowing diamonds */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { trailRefs.current[i] = el; }}
          className="fixed top-0 left-0 z-[99] pointer-events-none"
          style={{
            width: 6,
            height: 6,
            backgroundColor: "var(--color-accent)",
            boxShadow: "0 0 8px 1px var(--color-accent)",
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}
