import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Digital Minimalism for Anxious Minds: How to Reclaim Your Focus",
  description: "A gentle guide to digital minimalism. Learn how to stop doomscrolling, reduce screen time, and curate a digital environment that protects your mental health.",
  alternates: {
    canonical: "https://www.quietlyhumans.space/articles/digital-minimalism",
  },
  openGraph: {
    title: "Digital Minimalism for Anxious Minds",
    description: "Learn how to stop doomscrolling and curate a digital environment that protects your mental health.",
    url: "https://www.quietlyhumans.space/articles/digital-minimalism",
    siteName: "Quietly Humans",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    type: "article",
  },
};

export default function DigitalMinimalismPage() {
  return (
    <article className="min-h-screen pt-32 px-6 md:px-12 max-w-4xl mx-auto w-full pb-24">
      <Link href="/reading-room" className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mb-8 block">
        ← Back to Reading Room
      </Link>
      
      <header className="mb-16 text-center">
        <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-4 block font-bold">Mental Health Guide</span>
        <h1 className="text-4xl md:text-6xl font-serif text-brand-text mb-6 text-balance leading-tight">
          Digital Minimalism for Anxious Minds
        </h1>
        <p className="text-xl text-brand-soft font-serif italic max-w-2xl mx-auto leading-relaxed">
          Your phone is not a window to the world; it is a casino for your attention. Here is how to step away.
        </p>
      </header>

      <div className="prose prose-lg prose-invert prose-brand max-w-none font-serif">
        <p>
          We are the first generation in human history to carry the entire world's suffering in our pockets, receiving push notifications about global catastrophes while trying to buy groceries. 
          It is no wonder we are exhausted.
        </p>
        <p>
          <strong>Digital minimalism</strong> isn't about throwing your smartphone into the ocean and moving to a cabin in the woods (though that sounds nice). 
          It is about intentionality. It is about recognizing that your attention is your most valuable resource, and tech companies are spending billions to steal it from you.
        </p>

        <h2>The Anxiety of the Infinite Scroll</h2>
        <p>
          Social media platforms are designed using variable ratio schedules—the exact same psychological mechanism used in slot machines. 
          When you swipe down to refresh your feed, you don't know what you are going to get. It might be a funny meme, it might be enraging political news, or it might be nothing. 
          This unpredictability spikes your dopamine, forcing you to keep scrolling.
        </p>
        <p>
          For an anxious mind, this is devastating. Your nervous system is constantly reacting to micro-stressors, keeping you in a low-grade state of fight-or-flight all day long.
        </p>

        <h2>How to Implement Gentle Digital Minimalism</h2>
        
        <h3>1. The Grayscale Challenge</h3>
        <p>
          App icons are brightly colored (especially red) to trigger an immediate, instinctual response in your brain. 
          Go into your phone's accessibility settings and turn the color filter to "Grayscale." 
          Without the candy-colored slots, your phone immediately becomes a tool rather than a toy. You will be shocked at how boring Instagram is in black and white.
        </p>

        <h3>2. Audit Your Notifications</h3>
        <p>
          Turn off every single push notification except for direct messages from humans (texts, phone calls, WhatsApp). 
          No app should have the right to tap you on the shoulder and demand your attention unless it is a real person who needs you. 
          Check email on your schedule, not on the app's schedule.
        </p>

        <h3>3. Curate Your Feed for Softness</h3>
        <p>
          You don't have to follow people who make you feel inadequate, angry, or exhausted. 
          Mute words, unfollow accounts, and intentionally seek out quiet corners of the internet. 
          At Quietly Humans, we deliberately designed our platform without infinite scrolls, without algorithms, and without follower counts. It is a <Link href="/about" className="text-brand-accent underline">digital sanctuary</Link> by design.
        </p>

        <h2>What to Do With the Quiet</h2>
        <p>
          When you first practice digital minimalism, you might actually feel <em>more</em> anxious. 
          This is withdrawal. You are suddenly forced to sit with your own thoughts without the pacifier of a screen. 
        </p>
        <p>
          When the urge to doomscroll hits, try using the <Link href="/toolkit/urge-surfer" className="text-brand-accent underline">Urge Surfer</Link> tool in our Soft Toolkit. 
          It will guide you through the discomfort until the craving passes.
        </p>
        <p>
          Reclaiming your attention is an act of rebellion. You are allowed to unplug. You are allowed to be unreachable. 
          The world will keep spinning without you watching it.
        </p>
      </div>
    </article>
  );
}
