"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { questions, ArchetypeId, archetypes } from "@/lib/quizData";
import { useRouter } from "next/navigation";

type Step = 'welcome' | 'question' | 'email' | 'calculating';

export default function QuizEngine() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('welcome');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [scores, setScores] = useState<Record<ArchetypeId, number>>({
    tired: 0, overthinker: 0, pleaser: 0, behind: 0, lonely: 0
  });
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStart = () => setStep('question');

  const handleAnswer = (archetype: ArchetypeId) => {
    setScores(prev => ({ ...prev, [archetype]: prev[archetype] + 1 }));
    
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      setStep('email');
    }
  };

  const calculateResult = (): ArchetypeId => {
    let maxArchetype: ArchetypeId = 'tired';
    let maxScore = -1;
    (Object.keys(scores) as ArchetypeId[]).forEach(arch => {
      if (scores[arch] > maxScore) {
        maxScore = scores[arch];
        maxArchetype = arch;
      }
    });
    return maxArchetype;
  };

  const finishQuiz = async (skipEmail: boolean = false) => {
    const result = calculateResult();
    
    if (!skipEmail && email) {
      setIsSubmitting(true);
      try {
        await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email, 
            firstName, 
            source: `Quiz - ${archetypes[result].title}` 
          }),
        });
      } catch (err) {
        console.error(err);
      }
    }
    
    setStep('calculating');
    setTimeout(() => {
      router.push(`/quiz?result=${result}`);
    }, 1500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto min-h-[60vh] flex flex-col justify-center relative">
      <AnimatePresence mode="wait">
        
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <span className="text-brand-accent text-4xl mb-6 block">🤍</span>
            <h1 className="text-4xl md:text-6xl font-serif text-brand-text mb-6 leading-tight">What Is Your Heart Carrying?</h1>
            <p className="text-brand-soft text-lg mb-12 max-w-lg mx-auto leading-relaxed">
              Answer 5 gentle questions to uncover what your soul is currently holding, and receive curated resources to help you put it down.
            </p>
            <button
              onClick={handleStart}
              className="px-10 py-4 bg-brand-text text-brand-bg rounded-full text-xs uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all duration-500"
            >
              Begin Reflection
            </button>
          </motion.div>
        )}

        {step === 'question' && (
          <motion.div
            key={`q-${currentQIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <span className="text-xs uppercase tracking-widest text-brand-accent mb-6 block text-center">
              Question {currentQIndex + 1} of {questions.length}
            </span>
            <h2 className="text-2xl md:text-4xl font-serif text-brand-text mb-12 text-center text-balance leading-relaxed">
              {questions[currentQIndex].question}
            </h2>
            <div className="flex flex-col gap-4">
              {questions[currentQIndex].answers.map((ans, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(ans.archetype)}
                  className="w-full text-left p-6 md:p-8 rounded-2xl border border-brand-border bg-brand-card hover:border-brand-accent hover:bg-brand-bg transition-all duration-300 group"
                >
                  <span className="text-brand-soft group-hover:text-brand-text transition-colors text-lg leading-relaxed block">
                    {ans.text}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'email' && (
          <motion.div
            key="email"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center bg-brand-card p-8 md:p-12 rounded-3xl border border-brand-border"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-brand-text mb-4">Where should we send your results?</h2>
            <p className="text-brand-soft mb-10 max-w-md mx-auto">
              We'll reveal your archetype immediately, and send you a gentle email with your curated reading list so you can save it for later.
            </p>
            
            <div className="flex flex-col gap-4 max-w-sm mx-auto">
              <input 
                type="text" 
                placeholder="First Name (Optional)" 
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full bg-transparent border-b border-brand-border focus:border-brand-accent px-4 py-3 text-brand-text outline-none transition-colors"
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-brand-border focus:border-brand-accent px-4 py-3 text-brand-text outline-none transition-colors mb-6"
              />
              <button
                onClick={() => finishQuiz(false)}
                disabled={!email || isSubmitting}
                className="w-full px-8 py-4 bg-brand-text text-brand-bg rounded-full text-xs uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Reveal My Results"}
              </button>
              <button
                onClick={() => finishQuiz(true)}
                className="text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors mt-4"
              >
                Skip and view results
              </button>
            </div>
          </motion.div>
        )}

        {step === 'calculating' && (
          <motion.div
            key="calculating"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center flex flex-col items-center justify-center"
          >
            <div className="w-12 h-12 border-t-2 border-brand-accent rounded-full animate-spin mb-8"></div>
            <h2 className="text-2xl font-serif text-brand-text">Listening to your heart...</h2>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
