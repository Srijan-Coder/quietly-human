import { Metadata } from "next";
import Link from "next/link";
import { QuietAdInline, QuietAdBanner } from "@/components/global/QuietAd";

export const metadata: Metadata = {
  title: "How to Calm Anxiety at Night: A Guide for 3AM Spirals",
  description: "Learn how to calm anxiety at night when you can't sleep. Understand cortisol spikes, the 3AM wake-up, and actionable ways to soothe your nervous system.",
  alternates: {
    canonical: "https://www.quietlyhumans.space/articles/how-to-calm-anxiety-at-night",
  },
  openGraph: {
    title: "How to Calm Anxiety at Night: A Guide for 3AM Spirals",
    description: "Understand the 3AM wake-up, and actionable ways to soothe your nervous system.",
    url: "https://www.quietlyhumans.space/articles/how-to-calm-anxiety-at-night",
    siteName: "Quietly Humans",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    type: "article",
  },
};

export default function CalmAnxietyAtNightPage() {
  return (
    <article className="min-h-screen pt-32 px-6 md:px-12 max-w-4xl mx-auto w-full pb-24">
      <Link href="/reading-room" className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mb-8 block">
        ← Back to Reading Room
      </Link>
      
      <header className="mb-16 text-center">
        <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-4 block font-bold">Mental Health Guide</span>
        <h1 className="text-4xl md:text-6xl font-serif text-brand-text mb-6 text-balance leading-tight">
          How to Calm Anxiety at Night
        </h1>
        <p className="text-xl text-brand-soft font-serif italic max-w-2xl mx-auto leading-relaxed">
          The world goes quiet, but your mind turns up the volume. Here is how to survive the 3 AM anxiety spikes.
        </p>
      </header>

      <div className="prose prose-lg prose-invert prose-brand max-w-none font-serif">
        <p>
          Nighttime anxiety is a deeply isolating experience. When the sun goes down and distractions fade away, many of us are left alone with the thoughts we successfully avoided all day. 
        </p>
        <p>
          If you are wondering <strong>how to calm anxiety at night</strong>, it is important to first understand that you are not losing your mind. Your biology is simply working against you.
        </p>

        <h2>The Biology of 3 AM Anxiety</h2>
        <p>
          Cortisol, the primary stress hormone, naturally fluctuates throughout the day. It is supposed to drop at night to allow you to sleep, and spike in the morning to wake you up. 
          However, for chronically anxious people, the HPA axis (hypothalamic-pituitary-adrenal axis) becomes dysregulated. Your brain might dump cortisol into your bloodstream at 2 or 3 AM, jolting you awake with a racing heart and a sense of impending doom.
        </p>
        <p>
          Furthermore, the prefrontal cortex—the part of your brain responsible for logic, reason, and emotional regulation—is essentially "powered down" during the night. 
          This means your amygdala (the fear center) is running the show unchecked. That is why problems that seem manageable in the daylight feel catastrophic at 3 AM.
        </p>

        <h2>Immediate Actions to Take When You Wake Up Panicking</h2>
        
        <h3>1. Break the Bed Association</h3>
        <p>
          If you have been lying awake for more than 20 minutes feeling anxious, <em>get out of bed</em>. 
          Staying in bed teaches your brain that the bed is a place for stress and panic, not sleep. Move to a dimly lit room, sit in a comfortable chair, and do something analog (read a book, knit, or draw).
        </p>

        <h3>2. The "Air Lock" Breathing Technique</h3>
        <p>
          Rapid breathing signals to your brain that you are in danger. You have to manually override this by slowing your exhale. 
          Try the 4-7-8 method, or use our visual <Link href="/toolkit/air-lock" className="text-brand-accent underline">Air Lock</Link> tool to pace your breathing until your heart rate slows down.
        </p>

        <h3>3. Do Not Look at the Clock</h3>
        <p>
          Looking at the time triggers "sleep math" ("If I fall asleep right now, I will get exactly 3 hours and 14 minutes of sleep..."). 
          This spikes your adrenaline. Turn your clock around. 
        </p>

        <h2>How to Prevent Nighttime Anxiety Before Bed</h2>
        <p>
          Prevention is easier than treatment. Establishing a "soft landing" routine can signal to your nervous system that it is safe to power down.
        </p>
        <ul>
          <li><strong>The Worry Postponer:</strong> Set aside 15 minutes in the late afternoon to actively worry. Write everything down. If a worry pops up at 11 PM, tell yourself, "I am scheduled to worry about this tomorrow at 4 PM." (Try our <Link href="/toolkit/worry-postponer" className="text-brand-accent underline">Worry Postponer tool</Link>).</li>
          <li><strong>Digital Curfew:</strong> Blue light suppresses melatonin, but more importantly, doomscrolling spikes dopamine and cortisol. Put the phone in another room.</li>
          <li><strong>Heavy Blankets & Cool Air:</strong> Deep pressure stimulation (weighted blankets) activates the parasympathetic nervous system, while a cool room (around 65°F/18°C) physically facilitates sleep onset.</li>
        </ul>

        <h2>A Note for the Weary</h2>
        <p>
          The night always ends. The sun always comes up. The things you are terrified of right now will look entirely different in the daylight. 
          If you need a safe place to land right now, visit the <Link href="/toolkit" className="text-brand-accent underline">Soft Toolkit</Link> for free, guided grounding exercises.
        </p>
        {/* Quiet House Ad */}
        <QuietAdInline tags={["book", "ebook"]} />
      </div>
      {/* Quiet House Ad — banner */}
      <QuietAdBanner tags={["membership", "notion"]} exclude={["toolkit-promo"]} />
    </article>
  );
}
