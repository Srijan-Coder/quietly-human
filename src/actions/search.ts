"use server";

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

import { supabaseClient } from "@/lib/supabase";

export interface GlobalSearchResult {
  _id: string;
  _type: string;
  title?: string;
  subtitle?: string;
  excerpt?: string;
  slug?: { current: string };
  username?: string; // Added for profile search
  avatar_url?: string; // Added for profile search
  emotionTags?: string[];
  publishedAt?: string;
}

export async function searchSanctuary(query: string): Promise<GlobalSearchResult[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  // Convert to lowercase for matching, and escape double quotes
  const safeQuery = query.toLowerCase().replace(/"/g, '\\"');

  let results: GlobalSearchResult[] = [];

  try {
    // 1. Search Sanity CMS
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
      ] | order(_createdAt desc)[0...10] {
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
    const sanityResults = await client.fetch(searchQuery);
    results = [...sanityResults];
  } catch (error) {
    console.error("Sanctuary Search (Sanity) failed:", error);
  }

  try {
    // 2. Search Supabase Profiles (Creators)
    const { data: profiles } = await supabaseClient
      .from('profiles')
      .select('id, username, display_name, avatar_url, bio')
      .or(`username.ilike.%${safeQuery}%,display_name.ilike.%${safeQuery}%`)
      .limit(5);

    if (profiles && profiles.length > 0) {
      const profileResults: GlobalSearchResult[] = profiles.map(p => ({
        _id: p.id,
        _type: 'profile',
        title: p.display_name || p.username,
        subtitle: p.bio || `@${p.username}`,
        username: p.username,
        avatar_url: p.avatar_url
      }));
      results = [...profileResults, ...results]; // Put profiles at the top
    }
  } catch (error) {
    console.error("Sanctuary Search (Profiles) failed:", error);
  }

  return results;
}
