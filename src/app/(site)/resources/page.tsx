import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

export const revalidate = 60;
export const metadata = { title: "Free Resources — Quietly Humans" };

export interface Resource {
  _id: string;
  title: string;
  description?: string;
  resourceType: string;
  file?: { asset?: { url?: string } };
  externalUrl?: string;
  coverImage?: unknown;
  requiresEmail?: boolean;
}

export default async function ResourcesPage() {
  let resources: Resource[] = [];
  try {
    resources = await client.fetch(groq`*[_type == "resource"] | order(order asc, _createdAt desc) {
      _id, title, description, resourceType, file { asset->{ url } }, externalUrl, coverImage, requiresEmail, featured
    }`);
  } catch (error) { console.error(error); }

  const typeColors: Record<string, string> = {
    PDF: "text-amber-600 dark:text-amber-400",
    Wallpaper: "text-rose-500 dark:text-rose-400",
    "Prompt Card": "text-teal-600 dark:text-teal-400",
    Audio: "text-purple-600 dark:text-purple-400",
    Checklist: "text-blue-600 dark:text-blue-400",
    Template: "text-orange-500 dark:text-orange-400",
  };

  const demoItems = [
    { _id: "1", title: "7-Day Emotional Reset Guide", description: "Daily prompts for a gentle week of release.", resourceType: "PDF", requiresEmail: false, externalUrl: "/reset" },
    { _id: "2", title: "Quiet Words Wallpaper Pack", description: "Phone wallpapers with soft affirmations.", resourceType: "Wallpaper", requiresEmail: false, externalUrl: "/quotes" },
    { _id: "3", title: "Morning Softness Prompts", description: "5 gentle journaling questions to start your day.", resourceType: "Prompt Card", requiresEmail: false, externalUrl: "/toolkit" },
  ];

  const items = resources.length > 0 ? resources : demoItems;

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-xs uppercase tracking-widest text-brand-accent mb-4 block">All Free</span>
          <h1 className="text-5xl md:text-6xl font-serif text-brand-text mb-6">Free Resource Library</h1>
          <p className="text-brand-soft max-w-xl mx-auto leading-relaxed">
            Everything here is free. No catch. Just resources made for tired hearts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item: Resource) => {
            const downloadUrl = item.file?.asset?.url || item.externalUrl;
            return (
              <a
                key={item._id}
                href={downloadUrl || "#"}
                target={downloadUrl?.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group flex flex-col border border-brand-border rounded-2xl overflow-hidden hover:border-brand-accent transition-colors duration-300 bg-brand-card"
              >
                {item.coverImage ? (
                  <div className="aspect-video relative overflow-hidden">
                    <Image src={urlFor(item.coverImage).width(600).height(338).url()} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                ) : (
                  <div className="aspect-video flex items-center justify-center bg-brand-bg border-b border-brand-border">
                    <span className={`text-4xl ${typeColors[item.resourceType] || "text-brand-accent"}`}>
                      {item.resourceType === "PDF" ? "📄" : item.resourceType === "Wallpaper" ? "🖼" : item.resourceType === "Audio" ? "🎵" : "✦"}
                    </span>
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <span className={`text-[10px] uppercase tracking-widest mb-2 block ${typeColors[item.resourceType] || "text-brand-accent"}`}>{item.resourceType}</span>
                    <h3 className="font-serif text-xl text-brand-text group-hover:text-brand-accent transition-colors mb-2">{item.title}</h3>
                    {item.description && <p className="text-brand-soft text-sm leading-relaxed">{item.description}</p>}
                  </div>
                  <div className="mt-6 text-xs uppercase tracking-widest text-brand-accent group-hover:opacity-70 transition-opacity">
                    {item.requiresEmail ? "Unlock Free →" : "Download Free →"}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
