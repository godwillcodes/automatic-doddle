import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Godwill Barasa - Full-Stack Engineer & Performance Architect',
    short_name: 'Godwill Barasa',
    description: 'Full-Stack Engineer specializing in high-performance content delivery systems, WordPress-to-React pipelines, and enterprise architecture.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
