"use server";

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

export interface GlobalSearchResult {
  _id: string;
  _type: string;
  title?: string;
  subtitle?: string;
  excerpt?: string;
  slug?: { current: string };
  emotionTags?: string[];
  publishedAt?: string;
}

export async function searchSanctuary(query: string): Promise<GlobalSearchResult[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  // Convert to lowercase for matching, and escape double quotes
  const safeQuery = query.toLowerCase().replace(/"/g, '\\"');

  // We search across post, letter, guide, ebook.
  // We match if the title matches, subtitle matches, excerpt matches, emotionTags match, OR the plain text of the body matches.
  // pt::text(body) converts portable text blocks to a searchable plain string!
  const searchQuery = groq`
    *[
      _type in ["post", "letter", "guide", "ebook"] 
      && (
        title match "*${safeQuery}*" ||
        subtitle match "*${safeQuery}*" ||
        excerpt match "*${safeQuery}*" ||
        "${safeQuery}" in emotionTags ||
        pt::text(body) match "*${safeQuery}*" ||
        pt::text(content) match "*${safeQuery}*" ||
        pt::text(chapters[].content) match "*${safeQuery}*"
      )
    ] | order(_createdAt desc)[0...15] {
      _id,
      _type,
      title,
      subtitle,
      excerpt,
      slug,
      emotionTags,
      publishedAt
    }
  `;

  try {
    const results = await client.fetch(searchQuery);
    return results;
  } catch (error) {
    console.error("Sanctuary Search failed:", error);
    return [];
  }
}
