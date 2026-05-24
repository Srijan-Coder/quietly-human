import { supabaseClient } from "@/lib/supabase";
import { MetadataRoute } from "next";

const BASE_URL = "https://www.quietlyhumans.space";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/reading-room`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE_URL}/toolkit`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/pilgrim`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/breathe`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/focus`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/3am`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/store`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/books`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/start`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/sanctuary-pass`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/quotes`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/library`, lastModified: new Date(), changeFrequency: "daily", priority: 0.6 },
  ];

  // Dynamic post pages
  let postPages: MetadataRoute.Sitemap = [];
  try {
    const { data: posts } = await supabaseClient
      .from("posts")
      .select("slug, published_at, profiles!inner(username)")
      .eq("is_draft", false)
      .not("slug", "is", null)
      .order("published_at", { ascending: false })
      .limit(500);

    if (posts) {
      postPages = posts.map((post: any) => ({
        url: `${BASE_URL}/room/${post.profiles?.username}/${post.slug}`,
        lastModified: new Date(post.published_at),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    }
  } catch { /* sitemap generation should never crash */ }

  // Dynamic creator room pages
  let roomPages: MetadataRoute.Sitemap = [];
  try {
    const { data: profiles } = await supabaseClient
      .from("profiles")
      .select("username, created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    if (profiles) {
      roomPages = profiles.map((p: any) => ({
        url: `${BASE_URL}/room/${p.username}`,
        lastModified: new Date(p.created_at),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
  } catch { /* sitemap generation should never crash */ }

  return [...staticPages, ...postPages, ...roomPages];
}
