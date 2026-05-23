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

  let latestAdditions = [];
  try {
    latestAdditions = await client.fetch(
      groq`*[_type in ["book", "guide", "letter", "post"]] | order(_createdAt desc)[0...5] {
        _type,
        _id,
        title,
        "slug": slug.current,
        tagline,
        bookFormat,
        subtitle,
        excerpt,
        coverImage {
          ...,
          "alt": alt
        }
      }`
    );
  } catch (error) { console.error(error); }

  return <HomeContent testimonials={testimonials} latestAdditions={latestAdditions} />;
}
