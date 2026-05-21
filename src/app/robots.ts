import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio/'], // Prevent indexing the private Sanity CMS
    },
    sitemap: 'https://quietlyhumans.space/sitemap.xml',
  }
}
