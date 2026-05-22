import { groq } from "next-sanity";

// --- Sitemap Queries ---
export const allPostSlugsQuery = groq`*[_type == "post" && defined(slug.current)][].slug.current`;
export const allGuideSlugsQuery = groq`*[_type == "guide" && defined(slug.current)][].slug.current`;
export const allLetterSlugsQuery = groq`*[_type == "letter" && defined(slug.current)][].slug.current`;

// --- Content Queries ---
export const postsQuery = groq`*[_type == "post"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  mainImage {
    ...,
    "alt": alt
  },
  body,
  "categories": categories[]->title
}`;

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  mainImage {
    ...,
    "alt": alt
  },
  body,
  publishedAt,
  "authorName": author->name
}`;

export const productsQuery = groq`*[_type == "product"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  price,
  link,
  coverImage {
    ...,
    "alt": alt
  }
}`;

export const productBySlugQuery = groq`*[_type == "product" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  price,
  link,
  coverImage {
    ...,
    "alt": alt
  },
  description,
  whatsIncluded,
  whoItsFor,
  faq
}`;

export const guidesQuery = groq`*[_type == "guide"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  subtitle,
  coverImage {
    ...,
    "alt": alt
  }
}`;

export const guideBySlugQuery = groq`*[_type == "guide" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  subtitle,
  coverImage {
    ...,
    "alt": alt
  },
  content,
  _createdAt
}`;

export const lettersQuery = groq`*[_type == "letter"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  publishedAt
}`;

export const letterBySlugQuery = groq`*[_type == "letter" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  body
}`;

export const ebookBySlugQuery = groq`*[_type == "ebook" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  author,
  coverImage {
    ...,
    "alt": alt
  },
  "fileUrl": ebookFile.asset->url,
  notionUrl,
  chapters
}`;

export const leadMagnetSettingsQuery = groq`*[_type == "leadMagnetSettings"][0] {
  notionLink,
  driveLink,
  successMessage
}`;
