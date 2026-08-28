import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Godwill Barasa',
    short_name: 'Godwill Barasa',
    description:
      'Godwill Barasa is a software engineer in Nairobi. He founded Lock & Mercer, a venture studio, and builds and operates web platforms in Kenya.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f4f2ed',
    theme_color: '#101012',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}
