import { Metadata } from "next";
import Link from "next/link";
import { QuietAdInline, QuietAdBanner } from "@/components/global/QuietAd";

export const metadata: Metadata = {
  title: "Journaling for Anxiety: How to Start When You Feel Overwhelmed",
  description: "A practical guide to journaling for anxiety. Learn how to write your way out of panic, structure your thoughts, and find mental clarity without pressure.",
  alternates: {
    canonical: "https://www.quietlyhumans.space/articles/journaling-for-anxiety",
  },
  openGraph: {
    title: "Journaling for Anxiety: How to Start When You Feel Overwhelmed",
    description: "Learn how to write your way out of panic and find mental clarity without pressure.",
    url: "https://www.quietlyhumans.space/articles/journaling-for-anxiety",
    siteName: "Quietly Humans",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    type: "article",
  },
};

export default function JournalingForAnxietyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Journaling for Anxiety: How to Start When You Feel Overwhelmed",
    "description": "A practical guide to journaling for anxiety.",
    "author": {
      "@type": "Organization",
      "name": "Quietly Humans"
    }
  };

  return (
    <article className="min-h-screen pt-32 px-6 md:px-12 max-w-4xl mx-auto w-full pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/reading-room" className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mb-8 block">
        ← Back to Reading Room
      </Link>
      
      <header className="mb-16 text-center">
        <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-4 block font-bold">Mental Health Guide</span>
        <h1 className="text-4xl md:text-6xl font-serif text-brand-text mb-6 text-balance leading-tight">
          Journaling for Anxiety: Writing Through the Noise
        </h1>
        <p className="text-xl text-brand-soft font-serif italic max-w-2xl mx-auto leading-relaxed">
          You don't need a perfectly aesthetic notebook to heal. Here is how to journal when your brain is loud and your hands are tired.
        </p>
      </header>

      <div className="prose prose-lg prose-invert prose-brand max-w-none font-serif">
        <p>
          If you struggle with anxiety, the advice to "just keep a journal" can feel incredibly frustrating. 
          When your heart is racing and your thoughts are moving at a hundred miles an hour, sitting down to write in a blank notebook can feel like staring at a void. 
        </p>
        <p>
          But clinical psychology tells us that <strong>journaling for anxiety</strong> is one of the most effective ways to regulate the nervous system. The problem isn't the journaling—it's <em>how</em> we are taught to do it.
        </p>

        <h2>Why Journaling Works for Anxious Minds</h2>
        <p>
          Anxiety lives in the amygdala (the fear center) and the right hemisphere of the brain (the emotional center). 
          Writing forces you to engage the left hemisphere (the logical, language-processing center). By putting feelings into words, you literally build a bridge across your brain, slowing down the physiological panic response. 
          Psychologists call this "affect labeling."
        </p>

        <h2>How to Start Journaling When You Hate Journaling</h2>
        
        <h3>1. Lower the Bar to Zero</h3>
        <p>
          Forget the perfect handwriting. Forget grammar. Forget writing "Dear Diary." 
          If all you can write is a messy list of bullet points, or one giant run-on sentence complaining about your day, that counts. 
          The goal is emotional release, not a literary masterpiece.
        </p>

        <h3>2. Use the "Brain Dump" Method</h3>
        <p>
          When you have too many tabs open in your brain, use a <Link href="/toolkit/brain-dump" className="text-brand-accent underline">Brain Dump</Link>. 
          Take 5 minutes and aggressively write down every single thing you are worried about. 
          Don't solve the problems. Just get them out of your head and onto the paper. Once they are externalized, your brain stops feeling the need to constantly remind you of them.
        </p>

        <h3>3. Try the Cognitive Courtroom</h3>
        <p>
          Anxiety lies. It tells you that catastrophe is guaranteed. 
          When you feel this happening, write down the anxious thought. Then, play lawyer. What is the evidence that this thought is true? What is the evidence that it is false? 
          We built a digital version of this exercise called the <Link href="/toolkit/cognitive-courtroom" className="text-brand-accent underline">Cognitive Courtroom</Link> to help you structure this process.
        </p>

        <h2>Digital vs. Physical Journaling</h2>
        <p>
          Is it better to write by hand or type? 
          Writing by hand is generally slower, which can force an anxious mind to slow down and process feelings more deeply. 
          However, typing is faster, which might match the speed of a racing mind better during an acute panic attack. 
          Do whatever feels frictionless in the moment.
        </p>

        <h2>Prompts to Get You Started</h2>
        <ul>
          <li>What is the heaviest thing I am carrying right now?</li>
          <li>If my anxiety were a physical object in this room, what would it look like?</li>
          <li>What is one thing I know for absolute certain is true today?</li>
        </ul>
        
        <p>
          If you need more structure, explore our <Link href="/toolkit" className="text-brand-accent underline">Soft Toolkit</Link>. It includes guided journaling frameworks, emotional regulation tools, and safe digital spaces to leave your worries behind.
        </p>
        {/* Quiet House Ad */}
        <QuietAdInline tags={["book", "ebook"]} />
      </div>
      {/* Quiet House Ad — banner */}
      <QuietAdBanner tags={["membership", "notion"]} exclude={["toolkit-promo"]} />
    </article>
  );
}
