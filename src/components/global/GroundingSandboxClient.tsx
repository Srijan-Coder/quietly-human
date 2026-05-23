"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function GroundingSandboxClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas to match container
    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Physics constants
    const PARTICLE_COUNT = 150;
    const MOUSE_REPEL_RADIUS = 150;
    const RESTORE_FORCE = 0.02;

    // Mouse tracking
    let mouse = { x: -1000, y: -1000 };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handlePointerLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);

    // Particle Setup
    class Particle {
      x: number;
      y: number;
      originX: number;
      originY: number;
      vx: number;
      vy: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.originX = this.x;
        this.originY = this.y;
        this.vx = 0;
        this.vy = 0;
        this.size = Math.random() * 2 + 1;
        
        // Brand accent variations (warm amber/orange)
        const alpha = Math.random() * 0.5 + 0.2;
        this.color = `rgba(252, 163, 17, ${alpha})`; 
      }

      update() {
        // Repel from mouse
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < MOUSE_REPEL_RADIUS) {
          const force = (MOUSE_REPEL_RADIUS - distance) / MOUSE_REPEL_RADIUS;
          const angle = Math.atan2(dy, dx);
          
          // Push away
          this.vx -= Math.cos(angle) * force * 2;
          this.vy -= Math.sin(angle) * force * 2;
        }

        // Return to origin
        this.vx += (this.originX - this.x) * RESTORE_FORCE;
        this.vy += (this.originY - this.y) * RESTORE_FORCE;

        // Friction
        this.vx *= 0.9;
        this.vy *= 0.9;

        this.x += this.vx;
        this.y += this.vy;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Glowing effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(252, 163, 17, 0.5)";
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw faint connections between close particles
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          if (dist < 60) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(252, 163, 17, ${0.1 * (1 - dist/60)})`;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative h-screen w-full bg-brand-bg overflow-hidden flex flex-col">
      
      {/* Background Canvas */}
      <div ref={containerRef} className="absolute inset-0 z-0">
        <canvas ref={canvasRef} className="w-full h-full touch-none" />
      </div>

      {/* Floating UI overlay */}
      <div className="z-10 p-6 pointer-events-none flex justify-between items-start">
        <div>
          <h2 className="font-serif text-xl md:text-2xl text-brand-text mb-2 drop-shadow-md">
            The Grounding Sandbox
          </h2>
          <p className="text-brand-soft text-xs tracking-widest uppercase drop-shadow-md">
            Move your cursor. Breathe.
          </p>
        </div>

        <div className="pointer-events-auto">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-brand-soft hover:text-brand-text transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </button>
          
          {isMenuOpen && (
            <div className="absolute top-16 right-6 bg-brand-card/90 backdrop-blur border border-brand-border rounded-xl p-2 flex flex-col items-end shadow-xl">
              <Link
                href="/toolkit"
                className="px-4 py-2 text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text hover:bg-brand-bg rounded-lg transition-colors w-full text-right"
              >
                Exit Sandbox
              </Link>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
