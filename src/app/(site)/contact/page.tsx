export default function ContactPage() {
  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-3xl mx-auto w-full pb-24 text-center">
      <div className="mb-16">
        <h1 className="text-5xl md:text-6xl font-serif text-brand-text mb-4">Say Hello</h1>
        <p className="opacity-60 text-lg max-w-xl mx-auto text-balance">
          Whether you want to collaborate, share a quiet thought, or just say hi.
        </p>
      </div>

      <form className="flex flex-col gap-8 text-left">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-xs uppercase tracking-widest opacity-60">Name</label>
          <input type="text" id="name" className="w-full bg-transparent border-b border-brand-border py-2 focus:outline-none focus:border-brand-accent transition-colors text-brand-text placeholder-brand-soft/50" placeholder="Your name" />
        </div>
        
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-xs uppercase tracking-widest opacity-60">Email</label>
          <input type="email" id="email" className="w-full bg-transparent border-b border-brand-border py-2 focus:outline-none focus:border-brand-accent transition-colors text-brand-text placeholder-brand-soft/50" placeholder="your@email.com" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="text-xs uppercase tracking-widest opacity-60">Message</label>
          <textarea id="message" rows={5} className="w-full bg-transparent border-b border-brand-border py-2 focus:outline-none focus:border-brand-accent transition-colors resize-none text-brand-text placeholder-brand-soft/50" placeholder="What's on your mind?"></textarea>
        </div>

        <button type="button" className="mt-8 px-8 py-4 bg-brand-text text-brand-bg hover:bg-brand-accent hover:text-white transition-colors duration-500 rounded-full text-sm tracking-widest uppercase w-max mx-auto">
          Send Message
        </button>
      </form>
    </div>
  );
}
