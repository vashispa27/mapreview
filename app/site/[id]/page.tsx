import { getPreview } from "@/lib/preview-store"
import { SiteTemplate } from "@/components/site-template"
import { notFound } from "next/navigation"

interface PublicSitePageProps {
  params: Promise<{ id: string }>
}

export default async function PublicSitePage({ params }: PublicSitePageProps) {
  // Await the params to resolve the dynamic route identifier
  const { id } = await params

  // In a real application, this would be a database fetch.
  // For the local dev server, we read from the globally persisted memory store!
  const preview = getPreview(id)

  if (!preview) {
    // Return a 404 block organically if the memory map is lost
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteTemplate
        business={preview.business}
        config={preview.config}
        isPreview={false}
      />
    </main>
  )
}
