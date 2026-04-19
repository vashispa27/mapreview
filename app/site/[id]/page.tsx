import type { Metadata } from "next"
import { SiteTemplate } from "@/components/site-template"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { BusinessData, SiteConfig, colorSchemes } from "@/lib/mock-data"

export const dynamic = "force-dynamic"

interface PublicSitePageProps {
  params: Promise<{ id: string }>
}

async function getSite(id: string) {
  let site = await db.site.findUnique({ where: { slug: id } })
  if (!site) site = await db.site.findUnique({ where: { id } })
  return site
}

export async function generateMetadata({ params }: PublicSitePageProps): Promise<Metadata> {
  const { id } = await params
  const site = await getSite(id)

  if (!site || !site.businessData) {
    return { title: "Business Website" }
  }

  const business = site.businessData as unknown as BusinessData
  const heroImage = business.heroImage || business.photos?.[0]?.url

  return {
    title: `${business.name} — ${business.category}`,
    description: business.description?.slice(0, 160) || `Visit ${business.name}. Rated ${business.rating}★ by ${business.totalReviews} customers. ${business.address}`,
    openGraph: {
      title: `${business.name} — ${business.category}`,
      description: business.description?.slice(0, 160),
      images: heroImage ? [{ url: heroImage, width: 1200, height: 630 }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${business.name} — ${business.category}`,
      description: business.description?.slice(0, 160),
      images: heroImage ? [heroImage] : [],
    },
  }
}

export default async function PublicSitePage({ params }: PublicSitePageProps) {
  const { id } = await params
  const site = await getSite(id)

  // Return 404 if the site doesn't exist or is not completed
  if (!site || site.status !== "COMPLETED" || !site.businessData) {
    notFound()
  }

  // Cast the stored JSON back to our types. Override id with the site's DB
  // identifier so the contact form can resolve the owner's email correctly.
  const business = {
    ...(site.businessData as unknown as BusinessData),
    id: site.slug || site.id,
  }
  const rawConfig = site.config as any
  const config: SiteConfig = {
    colorScheme: colorSchemes.find(c => c.id === rawConfig?.colorSchemeId) || colorSchemes[0],
    layout: rawConfig?.layout || "modern",
    fontStyle: rawConfig?.fontStyle || "sans",
    animations: rawConfig?.animations ?? true,
  }

  // JSON-LD Restaurant schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: business.name,
    description: business.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address,
    },
    telephone: business.phone,
    aggregateRating: business.totalReviews > 0 ? {
      "@type": "AggregateRating",
      ratingValue: business.rating,
      reviewCount: business.totalReviews,
      bestRating: 5,
    } : undefined,
    image: business.heroImage || business.photos?.[0]?.url,
    priceRange: business.priceLevel,
    servesCuisine: business.category,
    openingHoursSpecification: business.hours?.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.day,
      opens: h.hours.split(" - ")[0] || "",
      closes: h.hours.split(" - ")[1] || "",
    })),
    url: `https://maptosite.app/site/${site.slug || site.id}`,
  }

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteTemplate
        business={business}
        config={config}
        isPreview={false}
      />
    </main>
  )
}
