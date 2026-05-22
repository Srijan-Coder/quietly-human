import { Metadata } from "next";
import Link from "next/link";
import SocialConnectCTA from "@/components/global/SocialConnectCTA";

export const metadata: Metadata = {
  title: "About — Quietly Humans",
  description: "The story behind Quietly Humans and the person writing to you in the dark.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-32 px-6 md:px-12 max-w-3xl mx-auto w-full">
      <header className="mb-20 text-center">
        <span className="text-xs uppercase tracking-widest text-brand-accent mb-6 block">The Story</span>
        <h1 className="text-5xl md:text-6xl font-serif text-brand-text mb-6">About the Author</h1>
      </header>

      <div className="space-y-12 text-lg md:text-xl text-brand-soft leading-relaxed font-serif mb-24">
        <p className="text-brand-text font-medium text-2xl">
          Hi, I'm Srijan.
        </p>
        
        <p>
          I didn't build Quietly Humans because I had life figured out. I built it because there were so many nights when I was awake at 2 AM, feeling entirely overwhelmed by the noise of the internet, the pressure to "hustle," and a profound sense of falling behind.
        </p>

        <p>
          I looked for a corner of the internet that wasn't trying to sell me a 10-step productivity routine or optimize my morning. I just wanted a place that felt like a deep breath. A place that said: <em className="italic text-brand-text">"You are doing enough. It is okay to rest."</em>
        </p>

        <p>
          I couldn't find it, so I decided to build it.
        </p>

        <div className="my-16 p-10 bg-brand-card border border-brand-border rounded-2xl text-center">
          <p className="font-sans text-brand-text text-xl mb-4 italic text-balance">
            "Quietly Humans is an attempt to build a digital sanctuary for tired hearts, overthinkers, and anyone who feels emotionally unseen online."
          </p>
        </div>

        <p>
          Every Midnight Letter, every guide, and every quote you read here is written by me. There are no ghostwriters. There is no AI writing the content. It's just me, usually sitting at my desk late at night, writing the things I wish someone had said to me when I was struggling.
        </p>

        <p>
          When you read these words, I want you to know that there is a real person behind them. You are not just scrolling through a brand—you are sharing a quiet moment with a friend.
        </p>

        <p>
          Thank you for being here. I'm so glad you found this place.
        </p>
      </div>

      <div className="border-t border-brand-border pt-16 text-center">
        <h3 className="font-serif text-3xl text-brand-text mb-8">Where to begin?</h3>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link 
            href="/letters"
            className="px-8 py-4 bg-brand-card border border-brand-border rounded-full text-brand-text hover:border-brand-accent transition-colors text-xs uppercase tracking-widest"
          >
            Read the Midnight Letters
          </Link>
          <Link 
            href="/toolkit"
            className="px-8 py-4 bg-brand-card border border-brand-border rounded-full text-brand-text hover:border-brand-accent transition-colors text-xs uppercase tracking-widest"
          >
            Visit the Soft Toolkit
          </Link>
        </div>
      </div>

      <div className="mt-24">
        <SocialConnectCTA />
      </div>
    </div>
  );
}
