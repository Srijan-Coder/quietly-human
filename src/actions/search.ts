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
    // 1. Search Supabase Posts (Writings)
    const { data: posts } = await supabaseClient
      .from('posts')
      .select('id, title, excerpt, type, slug, profiles!inner(username)')
      .eq('is_draft', false)
      .or(`title.ilike.%${safeQuery}%,content.ilike.%${safeQuery}%`)
      .limit(10);

    if (posts && posts.length > 0) {
      const postResults: GlobalSearchResult[] = posts.map(p => ({
        _id: p.id,
        _type: 'post',
        title: p.title,
        subtitle: p.excerpt,
        slug: { current: p.slug || p.id },
        username: p.profiles?.username
      }));
      results = [...postResults];
    }
  } catch (error) {
    console.error("Sanctuary Search (Posts) failed:", error);
  }

  try {
    // 2. Search Supabase Profiles (Creators)
    // Strip '@' if the user types it
    const profileSearchQuery = safeQuery.startsWith('@') ? safeQuery.substring(1) : safeQuery;

    const { data: profiles } = await supabaseClient
      .from('profiles')
      .select('id, username, display_name, avatar_url, bio')
      .or(`username.ilike.%${profileSearchQuery}%,display_name.ilike.%${profileSearchQuery}%`)
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

  // 3. Search Soft Toolkit
  const tools = [
    { id: "worry-dissolver", title: "Worry Dissolver", desc: "Type out what is weighing heavy on your mind, and watch it turn to smoke." },
    { id: "daily-anchor", title: "The Daily Anchor", desc: "Set a single word as your intention for the day, carved into digital stone." },
    { id: "panic-redirector", title: "Panic Redirector", desc: "A guided visual exercise to break thought spirals using the 5-4-3-2-1 clinical grounding method." },
    { id: "brain-dump", title: "The Brain Dump", desc: "An unreadable canvas. Type everything that is overwhelming you. It blurs out instantly." },
    { id: "decision-coin", title: "The Decision Coin", desc: "For chronic overthinkers. Type your dilemma and let the universe give you a definitive answer." },
    { id: "control-sorter", title: "The Control Sorter", desc: "Sort your anxieties into what you can and cannot control, and watch the uncontrollable ones disintegrate." },
    { id: "leaves-on-stream", title: "Leaves on a Stream", desc: "An ACT exercise. Place intrusive thoughts on a leaf and watch them float away." },
    { id: "view-from-above", title: "The View From Above", desc: "A Stoic visualization. Type a localized stressor, and smoothly zoom out to cosmic scale." },
    { id: "task-atomizer", title: "The Task Atomizer", desc: "Shatter an overwhelming task into micro-steps, and enter a hyper-focus mode." },
    { id: "air-lock", title: "The Air Lock", desc: "A guided 2-minute transition to help you mentally disconnect from work before entering rest mode." },
    { id: "dopamine-menu", title: "The Dopamine Menu", desc: "Consult your menu. Get a random 'Chef's Recommendation' for healthy, low-friction stimulation." },
    { id: "energy-battery", title: "The Energy Battery", desc: "Manage your daily capacity based on Spoon Theory. Set your energy level, assign costs to tasks." },
    { id: "cognitive-courtroom", title: "The Cognitive Courtroom", desc: "Put your anxious thoughts on trial by stripping away the story and extracting only the hard facts." },
    { id: "urge-surfer", title: "Urge Surfing", desc: "A DBT tool for cravings. Watch a visual 5-minute wave and log your urge intensity." },
    { id: "yes-but-flipper", title: "The 'Yes, But' Flipper", desc: "Combat black-and-white thinking. Force your brain to find the nuance in absolute thoughts." },
    { id: "emotion-color-wheel", title: "Emotion Color Wheel", desc: "Drill down into an interactive color wheel to find the exact word for what you're feeling." },
    { id: "friction-generator", title: "The Friction Generator", desc: "A speed bump for impulsive decisions. Hold a button for 30 unbroken seconds before acting." },
    { id: "worry-postponer", title: "The Worry Postponer", desc: "Lock your worry in a box and schedule a 15-minute window for it later today." },
    { id: "done-list", title: "The 'Done' List", desc: "A reverse to-do list where you only log what you've already accomplished." },
    { id: "grounding-sandbox", title: "The Grounding Sandbox", desc: "Sometimes you just need to distract your hands. A calming, interactive physics sandbox." }
  ];

  const matchedTools = tools.filter(t => 
    t.title.toLowerCase().includes(safeQuery) || 
    t.desc.toLowerCase().includes(safeQuery) ||
    // Some secret keywords for better matching
    (safeQuery === "anxiety" && ["panic-redirector", "worry-dissolver", "control-sorter", "cognitive-courtroom"].includes(t.id)) ||
    (safeQuery === "overthinking" && ["decision-coin", "yes-but-flipper", "brain-dump"].includes(t.id)) ||
    (safeQuery === "dopamine" && t.id === "dopamine-menu") ||
    (safeQuery === "adhd" && ["task-atomizer", "dopamine-menu"].includes(t.id))
  );

  if (matchedTools.length > 0) {
    const toolResults: GlobalSearchResult[] = matchedTools.map(t => ({
      _id: t.id,
      _type: 'tool',
      title: t.title,
      subtitle: t.desc,
      slug: { current: t.id }
    }));
    results = [...toolResults, ...results]; // Put tools at the very top if they match!
  }

  return results;
}
