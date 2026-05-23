import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import HomeContent from "./HomeContent";

import { type Testimonial } from "@/components/global/TestimonialCarousel";

export default async function Home() {
  let testimonials: Testimonial[] = [];
  try {
    testimonials = await client.fetch(
      groq`*[_type == "testimonial" && featured == true] | order(order asc, _createdAt desc)`
    );
  } catch (error) { console.error(error); }

  let ebooks = [];
  try {
    ebooks = await client.fetch(
      groq`*[_type == "book"] | order(_createdAt desc)[0...3] {
        title,
        "tag": tagline,
        "slug": slug.current
      }`
    );
  } catch (error) { console.error(error); }

  let products = [];
  try {
    products = await client.fetch(
      groq`*[_type == "book" && bookFormat == "premium"] | order(_createdAt desc)[0...3] {
        title,
        price,
        "slug": slug.current
      }`
    );
  } catch (error) { console.error(error); }

  return <HomeContent testimonials={testimonials} ebooks={ebooks} products={products} />;
}
