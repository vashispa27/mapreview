"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { BusinessData, SiteConfig, colorSchemes } from "@/lib/mock-data"
import { SiteTemplate } from "@/components/site-template"
import { PreviewCustomizer } from "@/components/preview-customizer"
import { Loader2 } from "lucide-react"

interface PreviewPageProps {
  params: Promise<{ id: string }>
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [business, setBusiness] = useState<BusinessData | null>(null)
  const [config, setConfig] = useState<SiteConfig>({
    colorScheme: colorSchemes[0],
    layout: "modern",
    fontStyle: "sans",
    animations: true,
  })
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await fetch(`/api/preview/${id}`)
        if (!res.ok) {
          if (res.status === 404) {
            setError("Preview not found. It may have expired.")
          } else {
            setError("Failed to load preview")
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
        setError("Failed to load preview")
      } finally {
        setLoading(false)
      }
    }

    fetchPreview()
  }, [id])

  const handleConfigChange = async (newConfig: SiteConfig) => {
    setConfig(newConfig)

    // Persist to server
    try {
      await fetch(`/api/preview/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          colorSchemeId: newConfig.colorScheme.id,
          layout: newConfig.layout,
          fontStyle: newConfig.fontStyle,
          animations: newConfig.animations,
        }),
      })
    } catch (err) {
      console.error("Failed to save config:", err)
    }
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    // Simulate publishing delay (in real app, this would save to blob storage)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // For now, just redirect to a "published" page
    router.push(`/site/${id}?published=true`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your preview...</p>
        </div>
      </div>
    )
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">!</span>
          </div>
          <h1 className="text-xl font-bold mb-2">Preview Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || "This preview may have expired or does not exist."}
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition"
          >
            Create New Site
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Site Preview */}
      <div className="pr-0 md:pr-[360px] transition-all duration-300">
        <SiteTemplate
          business={business}
          config={config}
          isPreview
        />
      </div>

      {/* Customization Sidebar */}
      <PreviewCustomizer
        business={business}
        config={config}
        onConfigChange={handleConfigChange}
        onPublish={handlePublish}
        isPublishing={isPublishing}
      />
    </div>
  )
}
