import { MetadataRoute } from "next"
import { db } from "@/lib/db"
import { blogs } from "@/lib/blog-data"

const BASE = "https://maptosite.app"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/gyms`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/restaurants`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ]

  // Blog posts
  const blogPages: MetadataRoute.Sitemap = blogs.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  // Published sites
  let sitePages: MetadataRoute.Sitemap = []
  try {
    const sites = await db.site.findMany({
      where: { status: "COMPLETED" },
      select: { id: true, slug: true, createdAt: true },
    })
    sitePages = sites.map((site) => ({
      url: `${BASE}/site/${site.slug ?? site.id}`,
      lastModified: site.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }))
  } catch {
    // DB unavailable at build time — skip dynamic pages
  }

  return [...staticPages, ...blogPages, ...sitePages]
}
