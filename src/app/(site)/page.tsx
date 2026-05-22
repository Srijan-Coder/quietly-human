import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import HomeContent from "./HomeContent";

export default async function Home() {
  let testimonials: any[] = [];
  try {
    testimonials = await client.fetch(
      groq`*[_type == "testimonial" && featured == true] | order(order asc, _createdAt desc)`
    );
  } catch (_) {}

  return <HomeContent testimonials={testimonials} />;
}
