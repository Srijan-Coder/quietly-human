import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-4xl mx-auto w-full pb-24 flex flex-col items-center text-center">
      <div className="mb-16">
        <h1 className="text-5xl md:text-6xl font-serif text-brand-text mb-8 text-balance">
          We are all just walking each other home.
        </h1>
        <div className="w-24 h-[1px] bg-brand-border mx-auto mb-8"></div>
        <div className="prose prose-lg prose-stone max-w-none font-sans text-brand-soft text-balance mx-auto">
          <p>
            Quietly Human Studio was founded by Srijan Pandey. It is an emotional wellness brand dedicated to those who overthink, those experiencing burnout, and those who feel a little behind in life.
          </p>
          <p>
            This space is a cinematic digital sanctuary. A place to reflect, heal, and learn to live a soft life in a loud world.
          </p>
          <p>
            Through books, digital products, and Notion systems, we build ecosystems of self-care.
          </p>
        </div>
      </div>
    </div>
  );
}
