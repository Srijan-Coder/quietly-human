"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ShareQuoteButtonProps {
  text: string;
}

export function ShareQuoteButton({ text }: ShareQuoteButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async () => {
    setIsGenerating(true);
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // High-res Pinterest size (1080x1080)
      const width = 1080;
      const height = 1080;
      canvas.width = width;
      canvas.height = height;

      // Draw background (dark brand theme)
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      // Add a subtle border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      // Text styling
      ctx.fillStyle = "#e0e0e0";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Function to wrap text
      const wrapText = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
        const words = text.split(" ");
        let line = "";
        const lines = [];

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const metrics = context.measureText(testLine);
          const testWidth = metrics.width;
          
          if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + " ";
          } else {
            line = testLine;
          }
        }
        lines.push(line);

        let startY = y - ((lines.length - 1) * lineHeight) / 2;
        for (let i = 0; i < lines.length; i++) {
          context.fillText(lines[i], x, startY);
          startY += lineHeight;
        }
      };

      // Draw Quote text
      ctx.font = "italic 300 54px Georgia, serif"; // Approximate our font-serif
      wrapText(ctx, `"${text}"`, width / 2, height / 2 - 50, width - 200, 80);

      // Draw Footer / Brand
      ctx.font = "300 24px Arial, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillText("quietlyhumans.space", width / 2, height - 100);

      // Trigger download
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "quietly-humans-quote.png";
      link.href = dataUrl;
      link.click();

    } catch (error) {
      console.error("Failed to generate quote image", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generateImage}
      disabled={isGenerating}
      className="group flex items-center gap-2 text-[10px] uppercase tracking-widest text-brand-soft hover:text-brand-accent transition-colors disabled:opacity-50"
      aria-label="Save Quote as Image"
    >
      <motion.svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </motion.svg>
      {isGenerating ? "Generating..." : "Save Image"}
    </button>
  );
}
