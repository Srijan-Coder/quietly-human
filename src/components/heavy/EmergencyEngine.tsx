"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ---------------------------------------------------------
// THE HEAVY DATABASE
// ---------------------------------------------------------
type HeavyContent = {
  id: string;
  label: string; // The button text
  paragraphs: string[]; // The soothing content
};

const heavyDatabase: HeavyContent[] = [
  {
    id: "panic",
    label: "I am panicking",
    paragraphs: [
      "Let's ground you. Your body is here. The floor is holding you.",
      "Look around the room. Find 5 things you can see. Name them out loud.",
      "Now, find 4 things you can feel. The chair, your clothes, the floor.",
      "Listen closely. What are 3 sounds you hear?",
      "Find 2 things you can smell.",
      "And 1 good thing about yourself.",
      "You are going to be okay. This wave will break."
    ]
  },
  {
    id: "sleep",
    label: "I cannot sleep",
    paragraphs: [
      "You don't have to force it.",
      "If sleep refuses to come right now, that is okay. The pressure to sleep is often what keeps us awake.",
      "For the next ten minutes, you are officially off the hook. You don't have to solve your life tonight. You don't have to plan for tomorrow. You don't even have to fall asleep.",
      "Your only job is to let your body rest horizontally. Even resting awake is a form of healing.",
      "Close your eyes, not to sleep, but just to give them a break from the light."
    ]
  },
  {
    id: "alone",
    label: "I feel completely alone",
    paragraphs: [
      "It is profoundly quiet in the exact spot you are sitting right now.",
      "But zoom out. Across the world, right in this very second, there are millions of people awake in the dark. Some are staring at ceilings. Some are drinking water in dim kitchens.",
      "Some are feeling the exact same aching, heavy isolation you are feeling right now.",
      "You do not know their names, and they do not know yours, but you are not doing this alone. You are part of a massive, quiet chorus of humans surviving the night together.",
      "I am glad you are here. Tomorrow will come, and the sun will rise for you, too."
    ]
  },
  {
    id: "exhausted",
    label: "I am completely exhausted",
    paragraphs: [
      "You do not have to do anything right now.",
      "If survival is taking 100% of your energy today, then survival is a perfectly acceptable accomplishment.",
      "You are not lazy. You are running on empty. A car without gas is not broken, it just needs to be refilled.",
      "Put everything down. The emails, the texts, the expectations. They can wait.",
      "Just exist for a while."
    ]
  },
  {
    id: "running_out_of_time",
    label: "I feel like I'm running out of time",
    paragraphs: [
      "Take a deep breath.",
      "There is no invisible scoreboard keeping track of your milestones. The timeline you are failing against was made up by people who do not know you.",
      "You are not behind. You are exactly where you are, and you have time.",
      "Flowers do not bloom all year round. Do not expect yourself to either."
    ]
  },
  {
    id: "hate_myself",
    label: "I hate myself right now",
    paragraphs: [
      "That is a very heavy feeling.",
      "But I want you to notice something: 'I hate myself' is a thought occurring in your brain. It is not an objective truth.",
      "Your brain is simply playing a very cruel trick on you right now because it is tired, stressed, or overwhelmed.",
      "You do not have to love yourself right now. You just have to be gentle with yourself until this feeling passes."
    ]
  },
  {
    id: "numb",
    label: "I feel completely numb",
    paragraphs: [
      "Numbness is not emptiness. Numbness is your brain's defense mechanism when things have been too loud for too long.",
      "It is a heavy blanket your nervous system threw over you to protect you from the noise.",
      "Don't try to force feelings right now. Just try to feel one physical thing.",
      "Run your hands under warm water. Hold an ice cube. Feel the texture of your shirt.",
      "You are still here."
    ]
  },
  {
    id: "grieving_past",
    label: "I am grieving a past version of myself",
    paragraphs: [
      "It is okay to miss who you used to be.",
      "Before the stress, before the burnout, before the heartbreak. That person was beautiful.",
      "But you cannot walk backwards into the past. You are a new shape now.",
      "Mourn the old you, thank them for getting you this far, and then gently introduce yourself to the person you are becoming."
    ]
  },
  {
    id: "burden",
    label: "I feel like a burden",
    paragraphs: [
      "You are not a burden. You are a human being requiring support, which is the baseline condition of being alive.",
      "If a friend came to you with the exact same weight you are carrying, would you call them a burden? Or would you pull up a chair?",
      "Please give yourself the same grace you so freely give to others."
    ]
  },
  {
    id: "failing",
    label: "I am terrified of failing",
    paragraphs: [
      "What if you fail? What then?",
      "You will wake up the next day. You will eat breakfast. The sky will still be there. People will still love you.",
      "Failure is an event, it is not an identity.",
      "You are allowed to try things and have them not work out. That is the only way anything gets done."
    ]
  },
  {
    id: "guilty_resting",
    label: "I feel guilty for resting",
    paragraphs: [
      "Capitalism has convinced you that your worth is tied to your productivity.",
      "It is a lie.",
      "You do not need to earn rest. Rest is a biological requirement, not a reward for burning yourself out.",
      "Stay exactly where you are. Doing nothing is exactly what you need to be doing right now."
    ]
  },
  {
    id: "invisible",
    label: "I feel invisible to the people I love",
    paragraphs: [
      "It hurts deeply to be in a room full of people and feel unseen.",
      "Sometimes, people are so wrapped up in their own heavy things that they forget to look up and see yours.",
      "It does not mean you do not matter. It just means everyone is a little bit lost right now.",
      "I see you. You are here, and you are trying."
    ]
  },
  {
    id: "too_much",
    label: "I feel like I am too much",
    paragraphs: [
      "You are not too much. They are simply not enough to hold you right now.",
      "Do not shrink yourself to fit into spaces that were never built for you.",
      "Your depth, your emotions, your intensity—these are features, not bugs. Find the people who want to swim in the deep end with you."
    ]
  },
  {
    id: "not_enough",
    label: "I feel like I am not enough",
    paragraphs: [
      "Not enough for what? Not enough for who?",
      "You are breathing. Your heart is beating. You survived every single bad day you have ever had up until this exact moment.",
      "By every metric that actually matters, you are entirely, profoundly enough."
    ]
  },
  {
    id: "pretending",
    label: "I am exhausted from pretending to be okay",
    paragraphs: [
      "Drop the mask.",
      "Just for right now, in this space, you do not have to hold it together.",
      "You can be messy. You can be sad. You can be frustrated.",
      "It is exhausting to be strong all the time. Let yourself be weak for a minute. It is safe here."
    ]
  },
  {
    id: "decisions",
    label: "I am paralyzed by my choices",
    paragraphs: [
      "There is no 'perfect' choice waiting to be found.",
      "There are only different paths, and you have the resilience to handle whichever one you take.",
      "If you cannot make the big choice right now, make a tiny one. Choose to drink water. Choose to stretch. The big choices will wait."
    ]
  },
  {
    id: "world_heavy",
    label: "The whole world feels too heavy",
    paragraphs: [
      "You were not evolutionarily designed to carry the suffering of the entire globe in your pocket.",
      "It is okay to look away. It is not ignorant, it is survival.",
      "Put the phone down. Focus only on the square footage of the room you are in. You can only save the world if you save yourself first."
    ]
  },
  {
    id: "healing_hurts",
    label: "I am trying to heal but it hurts",
    paragraphs: [
      "Healing is not a linear upward trajectory. It is messy, and sometimes it feels exactly like breaking.",
      "Just because it hurts today does not mean you are going backwards.",
      "Growing pains are real. You are stretching into a new version of yourself. Be incredibly gentle with your body right now."
    ]
  },
  {
    id: "overthinking",
    label: "I am overthinking everything",
    paragraphs: [
      "Your brain is trying to protect you by anticipating every possible danger.",
      "Thank your brain for trying to keep you safe, but kindly tell it to stand down.",
      "Most of the things you are worrying about will never happen. Step out of the future and come back to right now."
    ]
  },
  {
    id: "lost_joy",
    label: "I don't know what makes me happy anymore",
    paragraphs: [
      "That is okay. You don't need to have a grand passion right now.",
      "When the big joys fade, look for the micro-joys. The smell of coffee. The feeling of warm water. The texture of a soft blanket.",
      "Start painfully small. Joy will return, but you have to let it sneak up on you."
    ]
  },
  {
    id: "misunderstood",
    label: "I feel deeply misunderstood",
    paragraphs: [
      "It is a lonely thing to speak your truth and have it echo back untranslated.",
      "People can only understand you from their own level of perception.",
      "You do not need to over-explain your soul to people committed to misunderstanding you. Your truth remains true, even if they don't get it."
    ]
  },
  {
    id: "fading",
    label: "I feel like I am fading away",
    paragraphs: [
      "When we give too much of ourselves to others, we become ghosts in our own lives.",
      "It is time to pull your energy back into your own bones.",
      "Say no. Cancel the plan. Draw the boundary. You are allowed to be selfish until you feel solid again."
    ]
  },
  {
    id: "cant_ask_help",
    label: "I don't know how to ask for help",
    paragraphs: [
      "You have been the strong one for so long that people assume you don't need saving.",
      "You don't need a perfectly articulated speech. You can just say: 'I am not doing well.'",
      "The people who love you want to help you. Let them."
    ]
  },
  {
    id: "wasted_time",
    label: "I feel like I've wasted so much time",
    paragraphs: [
      "Time spent surviving is never wasted.",
      "Time spent healing is never wasted.",
      "Time spent resting is never wasted.",
      "You had to go through everything you went through to become who you are right now. The clock has not run out on you."
    ]
  },
  {
    id: "grieving_alive",
    label: "I am grieving someone who is still alive",
    paragraphs: [
      "This is one of the hardest griefs to carry, because society doesn't give us a script for it.",
      "It is okay to mourn the loss of a relationship, a friendship, or a version of someone that no longer exists.",
      "Your heartbreak is valid, even if there is no funeral. Hold space for the absence."
    ]
  },
  {
    id: "apologizing",
    label: "I am constantly apologizing for existing",
    paragraphs: [
      "You have a right to take up space.",
      "You do not need to shrink. You do not need to whisper. You do not need to apologize for having needs.",
      "Take a deep breath, expand your shoulders, and refuse to apologize for being a human being."
    ]
  },
  {
    id: "scared_mind",
    label: "I am scared of my own mind",
    paragraphs: [
      "Intrusive thoughts are terrifying, but they are just thoughts. They are not actions, and they are not who you are.",
      "Your brain is essentially throwing junk mail at you. You do not have to open it.",
      "Let the thought pass like a weird commercial on TV. You are the observer, not the thought."
    ]
  },
  {
    id: "unforgivable",
    label: "I don't know how to forgive myself",
    paragraphs: [
      "You made a decision based on the information and emotional capacity you had at the time.",
      "You cannot judge your past self with the wisdom of your present self. It is an unfair trial.",
      "Punishing yourself forever will not change the past. It will only ruin the present. Let it go."
    ]
  },
  {
    id: "anger",
    label: "I am holding onto too much anger",
    paragraphs: [
      "Anger is just sadness's bodyguard.",
      "It is exhausting to carry all that armor. Underneath the rage, what is actually hurting?",
      "You do not have to forgive the people who hurt you, but you do have to release the poison. Drink water. Unclench your jaw. Exhale."
    ]
  },
  {
    id: "scared_trust",
    label: "I am scared to trust again",
    paragraphs: [
      "Your walls kept you safe when you needed them. Thank them for doing their job.",
      "But now, they are keeping the light out.",
      "You do not have to trust the whole world tomorrow. Just leave the door cracked open an inch. Start there."
    ]
  }
];

export default function EmergencyEngine() {
  const [selectedContent, setSelectedContent] = useState<HeavyContent | null>(null);
  
  // We need exactly 3 random options at all times
  const [currentOptions, setCurrentOptions] = useState<HeavyContent[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);

  // Function to pick 3 random unique items from the database
  const pickRandomOptions = useCallback((excludeIds: string[] = []) => {
    const available = heavyDatabase.filter(item => !excludeIds.includes(item.id));
    // If we somehow run out of unique ones, reset the exclude list
    const pool = available.length >= 3 ? available : heavyDatabase;
    
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, []);

  // Hydration safety
  useEffect(() => {
    setCurrentOptions(pickRandomOptions());
  }, [pickRandomOptions]);

  const handleShuffle = () => {
    if (isShuffling) return;
    setIsShuffling(true);
    
    const currentIds = currentOptions.map(opt => opt.id);
    
    setTimeout(() => {
      setCurrentOptions(pickRandomOptions(currentIds));
      setIsShuffling(false);
    }, 400); // Wait for fade out
  };

  return (
    <div className="relative w-full min-h-screen bg-[#050505]">
      
      {/* Back to Home Button */}
      <Link href="/" className="absolute top-8 left-8 md:top-12 md:left-12 text-xs tracking-widest uppercase text-white/30 hover:text-white/70 transition-colors z-50">
        Exit to Home
      </Link>
      
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: THE MENU */}
        {!selectedContent ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 1.5 }}
            className="flex flex-col items-center justify-center min-h-screen text-center px-6 py-20"
          >
            {/* Soft, organic breathing circle */}
            <motion.div
              animate={{ 
                scale: [1, 1.15, 1],
                opacity: [0.1, 0.4, 0.1]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="w-32 h-32 rounded-full mb-16"
              style={{
                background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)",
                boxShadow: "0 0 60px rgba(255,255,255,0.1)"
              }}
            />
            
            <h1 className="font-serif text-2xl md:text-3xl text-white/90 mb-16 font-light tracking-wide">
              It is okay. You are safe here.<br/>
              <span className="text-white/40 text-lg md:text-xl mt-6 block italic">What is the heaviest thing right now?</span>
            </h1>

            <div className="flex flex-col gap-6 w-full max-w-sm min-h-[240px]">
              <AnimatePresence mode="wait">
                {!isShuffling && (
                  <motion.div 
                    key="buttons"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col gap-4 w-full"
                  >
                    {currentOptions.map((opt) => (
                      <button 
                        key={opt.id}
                        onClick={() => setSelectedContent(opt)}
                        className="px-8 py-5 border border-white/10 bg-white/5 rounded-full text-white/70 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all tracking-widest text-xs uppercase"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={handleShuffle}
              disabled={isShuffling}
              className="mt-12 text-[10px] tracking-widest uppercase text-white/30 hover:text-white/70 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              None of these fit (Shuffle)
            </button>
          </motion.div>
        ) : (
          
          /* VIEW 2: THE CONTENT */
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="flex flex-col items-center justify-center min-h-screen px-6 py-24 max-w-2xl mx-auto"
          >
            <div className="text-left space-y-12 text-white/70 text-lg md:text-xl font-light leading-relaxed">
              {selectedContent.paragraphs.map((para, i) => (
                <motion.p 
                  key={i}
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: i * 3 + 1, duration: 2 }} // Slow, staggered fade-in
                >
                  {/* Highlight specific words dynamically for certain paragraphs if needed, or just display text */}
                  {para.split(/(\d+)/).map((part, idx) => 
                    !isNaN(Number(part)) && part.trim() !== "" ? (
                      <strong key={idx} className="text-white font-normal">{part}</strong>
                    ) : (
                      <span key={idx}>{part}</span>
                    )
                  )}
                </motion.p>
              ))}
            </div>

            <div className="mt-32 flex flex-col items-center gap-8">
              <a 
                href="https://findahelpline.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs tracking-widest uppercase text-white/40 border-b border-white/20 pb-1 hover:text-white hover:border-white/50 transition-colors"
              >
                Find international crisis support
              </a>
              <button 
                onClick={() => setSelectedContent(null)} 
                className="text-[10px] tracking-widest uppercase text-white/30 hover:text-white/70 transition-colors"
              >
                Go Back
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
