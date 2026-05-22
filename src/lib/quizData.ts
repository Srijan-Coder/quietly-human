export type ArchetypeId = 'tired' | 'overthinker' | 'pleaser' | 'behind' | 'lonely';

export interface Answer {
  text: string;
  archetype: ArchetypeId;
}

export interface Question {
  id: number;
  question: string;
  answers: Answer[];
}

export interface Archetype {
  id: ArchetypeId;
  title: string;
  description: string;
  tags: string[];
}

export const archetypes: Record<ArchetypeId, Archetype> = {
  tired: {
    id: 'tired',
    title: 'The Tired Heart',
    description: "You have been carrying the weight of the world for far too long. You are exhausted not just in your body, but in your spirit. It is okay to put the heavy things down. Rest is not something you have to earn.",
    tags: ['exhausted', 'burnout']
  },
  overthinker: {
    id: 'overthinker',
    title: 'The Overthinker at Night',
    description: "Your mind is a busy place. When the world goes quiet, your thoughts get louder. You try to predict every outcome to protect yourself. Remember: you do not have to have everything figured out right now.",
    tags: ['overthinking', 'anxious']
  },
  pleaser: {
    id: 'pleaser',
    title: 'The Quiet People-Pleaser',
    description: "You are so deeply attuned to the needs of others that you often forget your own. You say 'yes' when your body is screaming 'no'. It is safe to disappoint others if it means being honest with yourself.",
    tags: ['people-pleasing', 'boundaries']
  },
  behind: {
    id: 'behind',
    title: 'The One Who Feels Behind',
    description: "You look around and feel like everyone else has the manual to life except you. You feel late, off-track, and pressured by invisible timelines. Take a deep breath: your path is not a race. You are exactly where you need to be.",
    tags: ['behind', 'pressure']
  },
  lonely: {
    id: 'lonely',
    title: 'The Lonely Strong One',
    description: "Everyone comes to you for advice, support, and strength. You are the rock. But inside, you wonder who is holding you. It is okay to take off the armor. You are allowed to be soft, and you are allowed to ask for help.",
    tags: ['lonely', 'strong']
  }
};

export const questions: Question[] = [
  {
    id: 1,
    question: "When you finally lie down at night, what is the loudest feeling?",
    answers: [
      { text: "A deep, heavy exhaustion that sleep doesn't seem to fix.", archetype: 'tired' },
      { text: "A racing mind replaying every conversation and mistake.", archetype: 'overthinker' },
      { text: "Worrying if I upset someone or let them down today.", archetype: 'pleaser' },
      { text: "A sinking panic that I didn't get enough done.", archetype: 'behind' },
      { text: "A quiet hollow feeling, wondering if anyone really sees me.", archetype: 'lonely' }
    ]
  },
  {
    id: 2,
    question: "What is your relationship with the word 'no'?",
    answers: [
      { text: "I try to say it, but end up agreeing to keep the peace.", archetype: 'pleaser' },
      { text: "I don't say it often because everyone relies on me to handle things.", archetype: 'lonely' },
      { text: "I wish I could say it to my own endless to-do list.", archetype: 'tired' },
      { text: "I over-explain and apologize profusely if I have to use it.", archetype: 'overthinker' },
      { text: "I feel guilty saying no because I should be working harder.", archetype: 'behind' }
    ]
  },
  {
    id: 3,
    question: "If your heart could speak right now, what would it ask for?",
    answers: [
      { text: "Please, just let me pause and rest.", archetype: 'tired' },
      { text: "I just want some peace and quiet in my head.", archetype: 'overthinker' },
      { text: "I wish someone would hold me without needing anything from me.", archetype: 'lonely' },
      { text: "Permission to stop living by everyone else's rules.", archetype: 'pleaser' },
      { text: "Reassurance that everything is going to be okay and I'm not failing.", archetype: 'behind' }
    ]
  },
  {
    id: 4,
    question: "How do you usually handle difficult emotions?",
    answers: [
      { text: "I push them down so I can keep being the strong one for others.", archetype: 'lonely' },
      { text: "I analyze them from every angle trying to 'solve' them.", archetype: 'overthinker' },
      { text: "I channel them into working harder so I don't fall behind.", archetype: 'behind' },
      { text: "I hide them so I don't burden or inconvenience anyone else.", archetype: 'pleaser' },
      { text: "I just feel numb and completely drained by them.", archetype: 'tired' }
    ]
  },
  {
    id: 5,
    question: "What is the hardest truth for you to accept?",
    answers: [
      { text: "I am allowed to take up space even if I'm not useful.", archetype: 'pleaser' },
      { text: "Life is not a checklist, and I am not running out of time.", archetype: 'behind' },
      { text: "I cannot control the future, no matter how much I worry.", archetype: 'overthinker' },
      { text: "I don't have to be the strong one all the time.", archetype: 'lonely' },
      { text: "My worth is not tied to my productivity or output.", archetype: 'tired' }
    ]
  }
];
