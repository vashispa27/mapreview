"use client"

import { useEffect, useState, use } from "react"
import { useSearchParams } from "next/navigation"
import { BusinessData, SiteConfig, colorSchemes } from "@/lib/mock-data"
import { SiteTemplate } from "@/components/site-template"
import { Loader2, CheckCircle, X } from "lucide-react"

interface SitePageProps {
  params: Promise<{ id: string }>
}

export default function SitePage({ params }: SitePageProps) {
  const { id } = use(params)
  const searchParams = useSearchParams()
  const justPublished = searchParams.get("published") === "true"

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [business, setBusiness] = useState<BusinessData | null>(null)
  const [config, setConfig] = useState<SiteConfig>({
    colorScheme: colorSchemes[0],
    layout: "modern",
    fontStyle: "sans",
    animations: true,
  })
  const [showBanner, setShowBanner] = useState(justPublished)

  useEffect(() => {
    const fetchSite = async () => {
      try {
        // In production, this would fetch from blob storage
        // For now, we use the preview endpoint
        const res = await fetch(`/api/preview/${id}`)
        if (!res.ok) {
          if (res.status === 404) {
            setError("Site not found")
          } else {
            setError("Failed to load site")
          }
          return
        }
        const data = await res.json()
        setBusiness(data.business)
        // Merge with defaults in case server data is missing new fields
        setConfig({
          colorScheme: data.config?.colorScheme || colorSchemes[0],
          layout: data.config?.layout || "modern",
          fontStyle: data.config?.fontStyle || "sans",
          animations: data.config?.animations ?? true,
        })
      } catch (err) {
        setError("Failed to load site")
      } finally {
        setLoading(false)
      }
    }

    fetchSite()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">?</span>
          </div>
          <h1 className="text-xl font-bold mb-2">Site Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This site does not exist or has been removed.
          </p>
          <a
            href="/"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition inline-block"
          >
            Create Your Own Site
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Success Banner */}
      {showBanner && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground py-3 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">
                {"Your site is live! Share this URL with your customers."}
              </span>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="p-1 hover:bg-white/20 rounded transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Site Content */}
      <div className={showBanner ? "pt-12" : ""}>
        <SiteTemplate business={business} config={config} />
      </div>
    </div>
  )
}
