"use client";

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* 
        Pure CSS animated gradients — no framer-motion, no JS.
        Uses CSS animations for ultra-light GPU performance on mobile.
        No solid background color — inherits from parent so light mode works.
      */}
      <div
        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(252, 163, 17, 0.12) 0%, transparent 70%)',
          animation: 'ambientPulse1 15s ease-in-out infinite',
        }}
      />
      
      <div
        className="absolute top-[40%] -right-[10%] w-[50%] h-[70%] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(20, 33, 61, 0.15) 0%, transparent 70%)',
          animation: 'ambientPulse2 20s ease-in-out infinite',
        }}
      />
      
      <div
        className="absolute -bottom-[20%] left-[20%] w-[70%] h-[50%] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(229, 229, 229, 0.04) 0%, transparent 70%)',
          animation: 'ambientPulse3 12s ease-in-out infinite',
        }}
      />

      <style jsx>{`
        @keyframes ambientPulse1 {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes ambientPulse2 {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }
        @keyframes ambientPulse3 {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
