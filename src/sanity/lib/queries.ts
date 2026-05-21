import { groq } from "next-sanity";

export const postsQuery = groq`*[_type == "post"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  mainImage,
  body,
  "categories": categories[]->title
}`;

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  mainImage,
  body
}`;

export const productsQuery = groq`*[_type == "product"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  price,
  link,
  coverImage
}`;

export const productBySlugQuery = groq`*[_type == "product" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  price,
  link,
  coverImage,
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
  coverImage
}`;

export const guideBySlugQuery = groq`*[_type == "guide" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  subtitle,
  coverImage,
  content
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
  coverImage,
  "fileUrl": ebookFile.asset->url,
  notionUrl,
  chapters
}`;

export const leadMagnetSettingsQuery = groq`*[_type == "leadMagnetSettings"][0] {
  notionLink,
  driveLink,
  successMessage
}`;
