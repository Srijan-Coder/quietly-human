import { Metadata } from "next";
import Link from "next/link";
import { QuietAdInline, QuietAdBanner } from "@/components/global/QuietAd";

export const metadata: Metadata = {
  title: "How to Stop Overthinking: A Clinical & Empathetic Guide",
  description: "Learn how to stop overthinking at night and break the cycle of anxiety with clinical tools, grounding techniques, and a compassionate approach to mental health.",
  alternates: {
    canonical: "https://www.quietlyhumans.space/articles/how-to-stop-overthinking",
  },
  openGraph: {
    title: "How to Stop Overthinking: A Clinical & Empathetic Guide",
    description: "Break the cycle of anxiety and overthinking with clinical tools and a compassionate approach to mental health.",
    url: "https://www.quietlyhumans.space/articles/how-to-stop-overthinking",
    siteName: "Quietly Humans",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    type: "article",
  },
};

export default function HowToStopOverthinkingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "How to Stop Overthinking: A Clinical & Empathetic Guide",
    "description": "Learn how to stop overthinking at night and break the cycle of anxiety.",
    "author": {
      "@type": "Organization",
      "name": "Quietly Humans"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Quietly Humans",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.quietlyhumans.space/icon.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.quietlyhumans.space/articles/how-to-stop-overthinking"
    }
  };

  return (
    <article className="min-h-screen pt-32 px-6 md:px-12 max-w-4xl mx-auto w-full pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/reading-room" className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mb-8 block">
        ← Back to Reading Room
      </Link>
      
      <header className="mb-16 text-center">
        <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-4 block font-bold">Mental Health Guide</span>
        <h1 className="text-4xl md:text-6xl font-serif text-brand-text mb-6 text-balance leading-tight">
          How to Stop Overthinking: A Guide for Tired Minds
        </h1>
        <p className="text-xl text-brand-soft font-serif italic max-w-2xl mx-auto leading-relaxed">
          Overthinking isn't a personality flaw—it's a clinical loop of anxiety. Here is how to break it when your brain refuses to shut up.
        </p>
      </header>

      <div className="prose prose-lg prose-invert prose-brand max-w-none font-serif">
        <p>
          It usually happens when you are finally trying to rest. The house is quiet, the lights are off, and your brain decides that right now—at 2 AM—is the perfect time to analyze a conversation you had three years ago, or spiral into catastrophic scenarios about tomorrow's inbox.
        </p>
        <p>
          If you are searching for <strong>how to stop overthinking</strong>, you already know how exhausting it is. 
          You know that logic doesn't work. Telling yourself to "just stop thinking about it" is like telling water not to be wet.
        </p>
        <p>
          At Quietly Humans, we don't believe in toxic positivity. We look at overthinking through a clinical lens, combined with profound empathy. 
          Here is a breakdown of what is actually happening in your brain, and practical, clinical tools to stop the spiral.
        </p>

        <h2>Why Do We Overthink? The Science of the Spiral</h2>
        <p>
          Overthinking is often a symptom of generalized anxiety or an overactive amygdala—the part of your brain responsible for processing fear and threats. 
          When you feel uncertain or unsafe (even emotionally), your brain attempts to regain control by predicting every possible outcome. It believes that if it can just think hard enough, it can protect you from getting hurt, making a mistake, or failing.
        </p>
        <p>
          This is called <strong>rumination</strong>. The problem is that rumination doesn't solve problems; it just burns energy.
        </p>

        <h2>3 Clinical Techniques to Stop Overthinking</h2>
        
        <h3>1. The Cognitive Defusion Technique</h3>
        <p>
          In Acceptance and Commitment Therapy (ACT), there is a concept called <em>Cognitive Defusion</em>. This means untangling yourself from your thoughts. 
          Instead of saying, "I am going to fail this project," you change the framing to: "I am having the <em>thought</em> that I am going to fail this project." 
          This creates psychological distance. You are not your thoughts; you are the sky, and your thoughts are just weather passing through.
        </p>

        <h3>2. The "Worry Dissolver" Approach</h3>
        <p>
          When thoughts are trapped in your head, they echo and magnify. The act of externalizing them—getting them out of your body—breaks the echo chamber. 
          We built a free digital tool specifically for this called the <Link href="/toolkit/worry-dissolver" className="text-brand-accent underline">Worry Dissolver</Link>. 
          It allows you to type exactly what you are overthinking, and then visually watch the text dissolve into smoke. The physical act of typing it out signals to your brain that the thought has been processed.
        </p>

        <h3>3. Grounding via Sensory Redirection (5-4-3-2-1)</h3>
        <p>
          If your overthinking escalates into panic, you need to pull your nervous system out of the abstract future and into the physical present. 
          Use the 5-4-3-2-1 method: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. 
          If you need guidance through this, you can use our free interactive <Link href="/toolkit/panic-redirector" className="text-brand-accent underline">Panic Redirector</Link>.
        </p>

        <h2>How to Stop Overthinking at Night</h2>
        <p>
          Nighttime overthinking is the hardest to fight because your brain is exhausted, making your prefrontal cortex (the logic center) weaker. 
          To combat this:
        </p>
        <ul>
          <li><strong>Implement a "Brain Dump":</strong> Keep a journal (or use our <Link href="/toolkit/brain-dump" className="text-brand-accent underline">Brain Dump tool</Link>) by your bed. Write down everything before you close your eyes.</li>
          <li><strong>Drop the temperature:</strong> Anxiety raises your core body temperature. A cool room signals to your biology that it is time to hibernate.</li>
          <li><strong>Embrace the "Done" List:</strong> Overthinkers often fixate on what they didn't finish. Instead, write a <Link href="/toolkit/done-list" className="text-brand-accent underline">Done List</Link> of what you actually accomplished today, no matter how small.</li>
        </ul>

        <h2>You Are Not Broken</h2>
        <p>
          Overthinking means you care. It means you have a vivid imagination and a deep desire to do things right. 
          The goal is not to stop thinking altogether; it is to build a softer relationship with your own mind.
        </p>
        <p>
          If you found this helpful, you are welcome to explore our <Link href="/toolkit" className="text-brand-accent underline">Soft Toolkit</Link>—a collection of 20 clinical tools designed for tired minds and anxious hearts. 
          You don't have to carry the weight all by yourself.
        </p>
      </div>
      
      {/* Quiet House Ad — inline recommendation */}
      <QuietAdInline tags={["book", "ebook"]} />

      <div className="mt-16 pt-8 border-t border-brand-border/30 text-center">
        <Link href="/toolkit" className="inline-block px-8 py-4 bg-brand-text text-brand-bg rounded-full text-sm uppercase tracking-widest font-bold hover:scale-105 transition-transform shadow-xl">
          Explore the Soft Toolkit
        </Link>
      </div>

      {/* Quiet House Ad — banner at end */}
      <QuietAdBanner tags={["membership", "notion"]} exclude={["toolkit-promo"]} />
    </article>
  );
}
