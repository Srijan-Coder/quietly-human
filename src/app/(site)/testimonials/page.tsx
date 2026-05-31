import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { type Testimonial } from "@/components/global/TestimonialCarousel";
import SubmitNoteForm from "@/components/global/SubmitNoteForm";

export const revalidate = 30;
export const metadata = { title: "Reader Notes — Quietly Humans" };

export default async function TestimonialsPage() {
  let testimonials: Testimonial[] = [];
  try {
    testimonials = await client.fetch(groq`*[_type == "testimonial" && isApproved == true] | order(order asc, _createdAt desc)`);
  } catch { /* silently fail */ }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-xs uppercase tracking-widest text-brand-accent mb-4 block">Community</span>
          <h1 className="text-5xl md:text-6xl font-serif text-brand-text mb-6">Reader Notes</h1>
          <p className="text-brand-soft max-w-xl mx-auto leading-relaxed">
            Quiet messages left by readers passing through this space. 
            You are not the only one feeling this way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t: Testimonial) => (
            <div key={t._id} className="p-8 bg-brand-card border border-brand-border rounded-2xl flex flex-col justify-between">
              <p className="font-serif text-xl text-brand-text leading-relaxed italic mb-8">
                &quot;{t.quote}&quot;
              </p>
              <div className="flex flex-col gap-1 text-xs uppercase tracking-widest text-brand-soft">
                <span className="font-semibold text-brand-accent">{t.name}</span>
                <div className="flex gap-2 opacity-60">
                  {t.handle && <span>{t.handle}</span>}
                  {t.platform && <span>• {t.platform}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {testimonials.length === 0 && (
          <div className="text-center py-24 border border-dashed border-brand-border rounded-2xl mb-8">
            <p className="font-serif italic text-brand-soft">
              No reader notes yet. Be the first to leave a trace.
            </p>
          </div>
        )}

        <SubmitNoteForm />

      </div>
    </div>
  );
}
