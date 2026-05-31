"use client";

import { useState } from "react";
import Link from "next/link";
import PilgrimSubmitForm from "./PilgrimSubmitForm";
import CandleButton from "../room/[username]/[slug]/CandleButton";
import { AnimatePresence, motion } from "framer-motion";

export default function PilgrimClient({ initialNotes }: { initialNotes: any[] }) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Helper to determine opacity based on age (fade effect for older notes)
  const getNoteOpacity = (createdAt: string) => {
    const daysOld = (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 3600 * 24);
    if (daysOld > 30) return "opacity-40";
    if (daysOld > 14) return "opacity-60";
    if (daysOld > 7) return "opacity-80";
    return "opacity-100";
  };

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full pb-32 font-sans bg-[#0d0d0d] text-white">
      <header className="mb-20 border-b border-white/5 pb-12 text-center flex flex-col items-center">
        <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-4 font-bold">Community</span>
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">Pilgrim Notes</h1>
        <p className="text-brand-soft text-lg max-w-2xl mx-auto font-serif italic text-balance mb-8">
          Leave a quiet thought for the next traveler. What is heavy on your mind today?
        </p>
      </header>

      {/* Floating CTA Button */}
      <div className="fixed bottom-10 right-10 z-50">
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-brand-accent text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(201,164,106,0.3)] hover:scale-110 transition-transform duration-300"
          aria-label="Leave a pilgrim note"
        >
          +
        </button>
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#121212] border border-white/10 p-8 md:p-12 rounded-[2rem] w-full max-w-2xl shadow-2xl relative"
            >
              <button 
                onClick={() => setIsFormOpen(false)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors text-xl"
                aria-label="Close"
              >
                ✕
              </button>
              <h2 className="text-3xl font-serif text-white mb-8">Leave a note.</h2>
              <PilgrimSubmitForm onSuccess={() => setIsFormOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Masonry-style Grid for Notes */}
      {initialNotes && initialNotes.length > 0 ? (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {initialNotes.map((note: any) => (
            <div 
              key={note.id} 
              className={`break-inside-avoid relative group transition-all duration-700 ${getNoteOpacity(note.created_at)}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#F4EFE6]/10 to-[#EAE3D5]/5 pointer-events-none rounded-sm" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)' }} />
              <div className="bg-[#1A1816] p-8 pb-12 relative shadow-[2px_4px_10px_rgba(0,0,0,0.5)] border border-[#2E2A27] transition-all duration-500 hover:shadow-[0_0_20px_rgba(201,164,106,0.1)] hover:border-brand-accent/30" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)' }}>
                
                {/* Folded Corner Effect */}
                <div className="absolute bottom-0 right-0 w-[15px] h-[15px] bg-[#2E2A27] shadow-[-2px_-2px_4px_rgba(0,0,0,0.3)] transition-colors group-hover:bg-brand-accent/50" style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }} />

                <p className="text-lg md:text-xl text-[#D8C9B5] leading-relaxed mb-8 whitespace-pre-wrap font-serif italic relative z-10">
                  "{note.content}"
                </p>
                
                <div className="flex justify-between items-end relative z-10">
                  <div className="flex flex-col gap-1">
                    <Link href={`/room/${note.profiles?.username || 'anonymous'}`} className="text-[10px] font-sans tracking-widest uppercase text-brand-accent hover:text-white transition-colors font-bold">
                      — {note.profiles?.display_name || note.profiles?.username || 'anonymous'}
                    </Link>
                    <span className="text-[9px] text-white/30 font-sans uppercase tracking-widest">
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="transform origin-bottom-right z-20">
                    <CandleButton targetId={note.id} targetType="note" initialCount={note.candle_count || 0} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 text-brand-soft italic font-serif text-xl">
          The wall is completely bare. Be the first to leave a mark.
        </div>
      )}
    </div>
  );
}
