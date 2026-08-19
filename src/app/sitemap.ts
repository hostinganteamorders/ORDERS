import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://ordersapp.tech'

    // Static pages
    const routes = [
        '',
        '/contact',
        '/portfolio',
        '/pricing',
        '/team',
        '/dashboard'
    ]

    const sitemap = routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' as const : 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    return sitemap
}