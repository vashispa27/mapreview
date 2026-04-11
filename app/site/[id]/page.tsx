import { SiteTemplate } from "@/components/site-template"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { BusinessData, SiteConfig, colorSchemes } from "@/lib/mock-data"

interface PublicSitePageProps {
  params: Promise<{ id: string }>
}

export default async function PublicSitePage({ params }: PublicSitePageProps) {
  const { id } = await params

  // 1. Fetch the site from Supabase (Prisma)
  const site = await db.site.findUnique({
    where: { id }
  })

  // 2. Return 404 if the site doesn't exist or is not completed
  if (!site || site.status !== "COMPLETED" || !site.businessData) {
    notFound()
  }

  // 3. Cast the stored JSON back to our types
  const business = site.businessData as unknown as BusinessData
  const rawConfig = site.config as any
  const config: SiteConfig = {
    colorScheme: colorSchemes.find(c => c.id === rawConfig?.colorSchemeId) || colorSchemes[0],
    layout: rawConfig?.layout || "modern",
    fontStyle: rawConfig?.fontStyle || "sans",
    animations: rawConfig?.animations ?? true
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteTemplate
        business={business}
        config={config}
        isPreview={false}
      />
    </main>
  )
}
