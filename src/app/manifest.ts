import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Quietly Humans',
    short_name: 'Quietly Humans',
    description: 'A quiet toolkit and sanctuary for the overwhelmed.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0D0E15',
    theme_color: '#0D0E15',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
