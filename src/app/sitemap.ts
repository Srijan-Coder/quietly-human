import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { allPostSlugsQuery, allGuideSlugsQuery, allLetterSlugsQuery } from '@/sanity/lib/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.quietlyhumans.space'

  // Fetch dynamic slugs
  const [postSlugs, guideSlugs, letterSlugs] = await Promise.all([
    client.fetch(allPostSlugsQuery) as Promise<string[]>,
    client.fetch(allGuideSlugsQuery) as Promise<string[]>,
    client.fetch(allLetterSlugsQuery) as Promise<string[]>,
  ])

  // Static routes
  const routes = [
    '',
    '/guides',
    '/breathe',
    '/reset',
    '/letters',
    '/blog',
    '/collection',
    '/search',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic routes
  const posts = postSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const guides = guideSlugs.map((slug) => ({
    url: `${baseUrl}/guides/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  const letters = letterSlugs.map((slug) => ({
    url: `${baseUrl}/letters/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...routes, ...posts, ...guides, ...letters]
}
