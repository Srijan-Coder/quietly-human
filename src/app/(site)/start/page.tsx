import Link from "next/link";

export const metadata = {
  title: "Start Here — Your Guide to Quietly Humans",
  description: "New to Quietly Humans? This page will guide you through everything — what we are, who we're for, and where to begin your quiet journey.",
};

const paths = [
  {
    emoji: "📖",
    title: "Read",
    desc: "Explore curated essays, midnight letters, and journals from quiet minds around the world.",
    path: "/reading-room",
    cta: "Enter Reading Room",
  },
  {
    emoji: "🧰",
    title: "Heal",
    desc: "Use 20 interactive clinical tools designed for anxiety, ADHD, panic, and overthinking.",
    path: "/toolkit",
    cta: "Open Soft Toolkit",
  },
  {
    emoji: "✍️",
    title: "Create",
    desc: "Publish your own quiet thoughts, midnight letters, and guides. Build your audience.",
    path: "/write",
    cta: "Start Writing",
  },
];

const whoItsFor = [
  "Overthinkers who can't turn off their brain at 3AM",
  "Introverts who need a quiet corner of the internet",
  "People recovering from burnout, anxiety, or emotional exhaustion",
  "Writers, journalers, and creators who want to build without the noise",
  "Anyone who just needs a moment to breathe",
];

export default function StartHerePage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text pt-24 md:pt-32 pb-24 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">

        {/* Hero */}
        <header className="text-center mb-16 md:mb-20">
          <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-4 block font-bold">Start Here</span>
          <h1 className="text-4xl md:text-6xl font-serif text-brand-text mb-6 leading-tight">
            Welcome, quiet human.
          </h1>
          <p className="text-brand-soft text-base md:text-lg max-w-xl mx-auto font-serif italic leading-relaxed">
            This is a digital sanctuary for overthinkers, soft hearts, and people who think too much at 3AM. You&apos;re in the right place.
          </p>
        </header>

        {/* What is this? */}
        <section className="mb-16 md:mb-20">
          <h2 className="text-2xl md:text-3xl font-serif text-brand-text mb-4">What is Quietly Humans?</h2>
          <div className="bg-brand-card border border-brand-border rounded-2xl p-6 md:p-8">
            <p className="text-brand-soft leading-relaxed mb-4">
              Quietly Humans is a <strong className="text-brand-text">digital sanctuary</strong> — part reading room, part therapy toolkit, part creative community. We build tools that help you breathe, think clearly, and feel less alone.
            </p>
            <p className="text-brand-soft leading-relaxed">
              We&apos;re not a social media platform. There are no likes, no follower counts, no algorithmic feeds. Just quiet writing, clinical tools, and a community that understands what it feels like to think too much.
            </p>
          </div>
        </section>

        {/* Who is it for? */}
        <section className="mb-16 md:mb-20">
          <h2 className="text-2xl md:text-3xl font-serif text-brand-text mb-4">Who is it for?</h2>
          <div className="bg-brand-card border border-brand-border rounded-2xl p-6 md:p-8">
            <ul className="space-y-3">
              {whoItsFor.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-brand-accent mt-1 shrink-0">✦</span>
                  <span className="text-brand-soft">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Choose your path */}
        <section className="mb-16 md:mb-20">
          <h2 className="text-2xl md:text-3xl font-serif text-brand-text mb-6 text-center">Choose your path</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paths.map((path) => (
              <Link
                key={path.path}
                href={path.path}
                className="group bg-brand-card border border-brand-border rounded-2xl p-6 text-center hover:border-brand-accent/50 transition-all flex flex-col items-center"
              >
                <span className="text-3xl mb-3 grayscale group-hover:grayscale-0 transition-all duration-300">{path.emoji}</span>
                <h3 className="text-xl font-serif text-brand-text group-hover:text-brand-accent transition-colors mb-2">{path.title}</h3>
                <p className="text-brand-soft text-sm mb-4 leading-relaxed">{path.desc}</p>
                <span className="text-[10px] uppercase tracking-widest text-brand-accent font-bold border-b border-brand-accent/50 pb-1 group-hover:border-brand-accent transition-colors mt-auto">
                  {path.cta} →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <p className="text-brand-soft text-sm mb-4">Not sure where to start?</p>
          <Link
            href="/reading-room"
            className="inline-block bg-brand-text text-brand-bg px-8 py-4 rounded-full text-[10px] tracking-widest uppercase font-bold hover:scale-105 transition-transform"
          >
            Explore everything →
          </Link>
        </div>
      </div>
    </div>
  );
}
