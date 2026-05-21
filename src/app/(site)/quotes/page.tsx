export default function QuoteGallery() {
  const quotes = [
    "You do not need to become someone else to belong here.",
    "Rest is not a reward for the work. It is the foundation of it.",
    "Be gentle with the version of you that is still learning.",
    "A soft life requires hard boundaries.",
    "You are allowed to take up space simply by existing.",
    "Overthinking is just your brain trying to protect you from things that haven't happened yet."
  ];

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full pb-24">
      <div className="mb-24 text-center">
        <h1 className="text-5xl md:text-6xl font-serif text-brand-charcoal mb-4">Quiet Words</h1>
        <p className="opacity-60 text-lg max-w-xl mx-auto text-balance">
          Save these to your camera roll for when the loud thoughts return.
        </p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {quotes.map((quote, idx) => (
          <div key={idx} className="break-inside-avoid bg-brand-cream border border-brand-charcoal/10 shadow-lg p-12 flex items-center justify-center aspect-square transition-transform duration-700 hover:scale-[1.02]">
            <p className="font-serif text-2xl md:text-3xl text-center text-balance leading-snug">
              "{quote}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
