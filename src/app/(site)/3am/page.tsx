"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import html2canvas from "html2canvas";
import { toast } from 'sonner';

interface Candle {
  id: number;
  x: number;
  y: number;
  opacity: number;
  size: number;
}

export default function ThreeAMRoom() {
  const [activeUsers, setActiveUsers] = useState(0);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [hasLeftCandle, setHasLeftCandle] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const roomRef = useRef<HTMLDivElement>(null);

  // The Algorithmic "Live" Counter
  useEffect(() => {
    const calculateBaseUsers = () => {
      const hour = new Date().getHours();
      let base = 40; // baseline
      if (hour >= 20 || hour <= 4) base = 120; // peak night
      if (hour > 4 && hour < 8) base = 15; // early morning slump
      return base + Math.floor(Math.random() * 20);
    };

    let currentUserCount = calculateBaseUsers();
    setActiveUsers(currentUserCount);

    const interval = setInterval(() => {
      const change = Math.floor(Math.random() * 5) - 2; // -2, -1, 0, 1, 2
      currentUserCount = Math.max(5, currentUserCount + change);
      setActiveUsers(currentUserCount);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Fade out candles over time
  useEffect(() => {
    const interval = setInterval(() => {
      setCandles(prev => 
        prev.map(c => ({ ...c, opacity: c.opacity - 0.05 }))
            .filter(c => c.opacity > 0)
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const leaveCandle = () => {
    if (candles.length > 30) return;

    const x = 5 + Math.random() * 90;
    const y = 5 + Math.random() * 90;
    
    const newCandle: Candle = {
      id: Date.now() + Math.random(),
      x,
      y,
      opacity: 1,
      size: 15 + Math.random() * 20,
    };
    
    setCandles(prev => [...prev, newCandle]);
    setHasLeftCandle(true);
    setActiveUsers(prev => prev + 1);
  };

  const shareMoment = async () => {
    if (!roomRef.current) return;
    setIsSharing(true);
    
    // Wait for the DOM changes (opacity-0 transition) to render fully
    await new Promise((resolve) => setTimeout(resolve, 350));
    
    try {
      let blob: Blob | null = null;
      
      try {
        const { toBlob } = await import('html-to-image');
        blob = await toBlob(roomRef.current, {
          quality: 1,
          pixelRatio: 2,
          backgroundColor: "#050505",
        });
      } catch (err) {
        console.warn("html-to-image failed, falling back to html2canvas:", err);
        const canvas = await html2canvas(roomRef.current, {
          backgroundColor: "#050505",
          scale: 2,
          useCORS: true,
          logging: false,
        });
        blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((b) => resolve(b), "image/png");
        });
      }

      if (!blob) throw new Error("Generated blob is null");
      
      const file = new File([blob], "3am-room.png", { type: "image/png" });
      
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "The 3AM Room",
          text: "You are not the only one awake.",
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "3am-room.png";
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      }
    } catch (error: any) {
      console.error("Failed to share:", error);
      toast.error("Failed to capture the moment. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <>
      <div ref={roomRef} className="fixed inset-0 bg-[#050505] z-[100] flex flex-col justify-center items-center text-[#e0e0e0] overflow-hidden font-serif">
        {/* Candles Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <AnimatePresence>
            {candles.map(candle => (
              <motion.div
                key={candle.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: candle.opacity, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 }}
                className="absolute rounded-full bg-[#fca311]"
                style={{
                  left: `${candle.x}%`,
                  top: `${candle.y}%`,
                  width: `${candle.size}px`,
                  height: `${candle.size}px`,
                  boxShadow: "0 0 40px 10px rgba(252, 163, 17, 0.4)",
                  filter: "blur(4px)",
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* HUD Back Button (Hidden during capture) */}
        <div className={`absolute top-8 left-6 md:left-12 z-20 transition-opacity duration-300 ${isSharing ? "opacity-0 pointer-events-none" : ""}`}>
          <Link href="/" className="text-[10px] uppercase tracking-widest text-[#666] hover:text-[#fff] transition-colors flex items-center gap-2">
            <span>←</span> Leave the 3AM Room
          </Link>
        </div>

        <div className="z-10 flex flex-col items-center text-center max-w-lg px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 3, delay: 1 }}
          >
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#666] block mb-12">The 3AM Room</span>
            
            <h1 className="text-3xl md:text-5xl font-light tracking-wide mb-8">
              You are not the only one awake.
            </h1>
            
            <div className="flex items-center justify-center gap-4 mb-20">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fca311] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#fca311]"></span>
              </span>
              <p className="text-sm tracking-widest text-[#aaa] font-mono">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={activeUsers}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="inline-block font-bold text-[#fff]"
                  >
                    {activeUsers}
                  </motion.span>
                </AnimatePresence>
                {" "}people are here right now, in the quiet.
              </p>
            </div>

            {/* Interaction Buttons (Hidden during capture) */}
            <div className={`flex flex-col items-center gap-4 transition-opacity duration-300 ${isSharing ? "opacity-0 pointer-events-none" : ""}`}>
              <button 
                onClick={leaveCandle}
                className="px-6 py-4 border border-[#333] hover:border-[#fca311] hover:text-[#fca311] rounded-full text-[10px] uppercase tracking-[0.2em] transition-all duration-700 bg-black/50 backdrop-blur-md cursor-pointer"
              >
                Leave a light for someone else 🕯️
              </button>
              
              <AnimatePresence>
                {hasLeftCandle && (
                  <motion.button
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    onClick={shareMoment}
                    className="px-4 py-2 text-[#aaa] hover:text-[#fff] text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    Share this moment
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Loading Overlay (Rendered outside the capture target so it doesn't show in the screenshot) */}
      <AnimatePresence>
        {isSharing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 z-[200] flex flex-col items-center justify-center font-sans gap-4"
          >
            <div className="w-8 h-8 border-2 border-[#fca311] border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#888] font-mono">Capturing your quiet moment...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
