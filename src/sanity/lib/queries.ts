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
