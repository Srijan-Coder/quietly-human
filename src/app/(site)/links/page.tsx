import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;
export const metadata = { title: "Links — Quietly Humans" };

const iconMap: Record<string, string> = {
  instagram: "📷", youtube: "▶️", twitter: "✦", notion: "◻", email: "✉",
  book: "📖", gift: "🎁", heart: "♡", link: "→", download: "↓",
};

export interface SocialLink {
  _id: string;
  label: string;
  url: string;
  icon: string;
  highlighted: boolean;
}

export interface Profile {
  name?: string;
  bio?: Array<{ children?: Array<{ text?: string }> }>; // Sanity block content
  image?: unknown;
}

export default async function LinksPage() {
  let links: SocialLink[] = [];
  let profile: Profile | null = null;

  try {
    [links, profile] = await Promise.all([
      client.fetch(groq`*[_type == "socialLink" && active == true] | order(order asc) { _id, label, url, icon, highlighted }`),
      client.fetch(groq`*[_type == "author"][0] { name, bio, image }`),
    ]);
  } catch (error) { console.error(error); }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-24 pb-24 px-6">
      <div className="w-full max-w-md flex flex-col items-center gap-4">

        {/* Profile */}
        <div className="mb-6 text-center flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full border-2 border-brand-border overflow-hidden bg-brand-card flex items-center justify-center">
            {profile?.image ? (
              <Image src={urlFor(profile.image).width(200).height(200).url()} alt="Srijan" width={96} height={96} className="object-cover" />
            ) : (
              <span className="font-serif text-3xl text-brand-text">S</span>
            )}
          </div>
          <div>
            <h1 className="font-serif text-2xl text-brand-text">{profile?.name || "Srijan"}</h1>
            <p className="text-brand-soft text-sm mt-1 max-w-xs leading-relaxed">
              {profile?.bio?.[0]?.children?.[0]?.text || "A quiet digital space for tired hearts."}
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3 w-full">
          {links.length === 0 ? (
            // Demo links when Sanity is empty
            [
              { label: "7-Day Free Emotional Reset", url: "/reset", highlighted: true, icon: "gift" },
              { label: "Read the Midnight Letters", url: "/letters", highlighted: false, icon: "book" },
              { label: "Quiet Words — Quote Wall", url: "/quotes", highlighted: false, icon: "heart" },
              { label: "The Soft Toolkit", url: "/toolkit", highlighted: false, icon: "heart" },
              { label: "Books & Journals", url: "/library", highlighted: false, icon: "book" },
              { label: "Emotional Search", url: "/search", highlighted: false, icon: "link" },
            ].map((link, i) => (
              <a
                key={i}
                href={link.url}
                className={`w-full py-4 px-6 rounded-full border text-sm tracking-wide text-center transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 ${
                  link.highlighted
                    ? "bg-brand-accent text-white border-brand-accent hover:bg-brand-accent/90"
                    : "border-brand-border text-brand-text hover:border-brand-accent hover:text-brand-accent"
                }`}
              >
                <span className="text-base">{iconMap[link.icon] || "→"}</span>
                {link.label}
              </a>
            ))
          ) : links.map((link: SocialLink) => (
            <a
              key={link._id}
              href={link.url}
              target={link.url.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className={`w-full py-4 px-6 rounded-full border text-sm tracking-wide text-center transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 ${
                link.highlighted
                  ? "bg-brand-accent text-white border-brand-accent"
                  : "border-brand-border text-brand-text hover:border-brand-accent hover:text-brand-accent"
              }`}
            >
              <span className="text-base">{iconMap[link.icon] || "→"}</span>
              {link.label}
            </a>
          ))}
        </div>

        {/* Dedicated Social Icons */}
        <div className="flex justify-center gap-6 mt-6">
          <a href="https://instagram.com/quietlyhumansspace" target="_blank" rel="noopener noreferrer" className="text-brand-soft hover:text-brand-accent transition-colors hover:scale-110 duration-300">
            <span className="text-2xl">📷</span>
          </a>
          <a href="https://pinterest.com/quietlyhumansspace" target="_blank" rel="noopener noreferrer" className="text-brand-soft hover:text-brand-accent transition-colors hover:scale-110 duration-300">
            <span className="text-2xl">📌</span>
          </a>
          <a href="https://www.youtube.com/@quietlyhumansspace" target="_blank" rel="noopener noreferrer" className="text-brand-soft hover:text-brand-accent transition-colors hover:scale-110 duration-300">
            <span className="text-2xl">▶️</span>
          </a>
        </div>

        <p className="text-[10px] uppercase tracking-widest text-brand-soft mt-8 opacity-50">
          quietlyhumans.space
        </p>
      </div>
    </div>
  );
}
