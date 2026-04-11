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
  
  // Track queue statuses exclusively
  const [jobStatus, setJobStatus] = useState<string>("QUEUED")

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const fetchPreviewStatus = async () => {
      try {
        const res = await fetch(`/api/preview/${id}`)
        
        if (res.status === 401 || res.status === 403) {
          setError("Unauthorized: You do not have permission to edit this site preview.")
          setJobStatus("FAILED")
          setLoading(false)
          return
        }

        if (res.status === 404) {
          setError("Site preview not found or has expired.")
          setJobStatus("FAILED")
          setLoading(false)
          return
        }
        
        const data = await res.json()
        setJobStatus(data.status)
        
        if (data.status === "COMPLETED") {
          setBusiness(data.business)
          setConfig({
            colorScheme: data.config?.colorScheme || colorSchemes[0],
            layout: data.config?.layout || "modern",
            fontStyle: data.config?.fontStyle || "sans",
            animations: data.config?.animations ?? true,
          })
          setLoading(false)
        } else if (data.status === "FAILED") {
          setError(data.errorMessage || "Application compiler encountered systemic rejection securely")
          setLoading(false)
        } else {
          // Continuous Loop tracking securely checking isolated states
          timeoutId = setTimeout(fetchPreviewStatus, 10000)
        }
      } catch (err) {
        setError("Network boundary disconnected temporarily checking remote status")
        setJobStatus("FAILED")
        setLoading(false)
      }
    }

    fetchPreviewStatus()
    return () => clearTimeout(timeoutId)
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

  const handleBusinessChange = async (newBusiness: BusinessData) => {
    setBusiness(newBusiness)

    // Persist to server
    try {
      await fetch(`/api/preview/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photos: newBusiness.photos,
          heroImage: newBusiness.heroImage,
          description: newBusiness.description,
          features: newBusiness.features,
        }),
      })
    } catch (err) {
      console.error("Failed to save business logic:", err)
    }
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    router.push(`/site/${id}?published=true`)
  }

  // Purely Abstracted Loading Layout hiding exact API mechanical limitations
  if (jobStatus !== "COMPLETED" && jobStatus !== "FAILED") {
    return (
      <div className="min-h-screen bg-background relative flex items-center justify-center p-8">
        <div className="max-w-4xl w-full mx-auto space-y-12 animate-pulse opacity-50">
          <div className="h-[400px] w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="space-y-4 max-w-2xl">
            <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-4 w-4/6 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-[160px] bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-[160px] bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-[160px] bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-[160px] bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>

        {/* Ticker Center */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 border shadow-2xl rounded-2xl p-8 max-w-md w-full text-center z-50">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-2">Building your page...</h2>
          <p className="text-muted-foreground font-medium text-lg">
            This usually takes a few seconds.
          </p>
          <div className="mt-6 h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-primary/20 animate-pulse" />
            <div 
              className="h-full bg-primary transition-all duration-[3000ms] ease-out"
              style={{ width: jobStatus === 'SCRAPING_APIFY' ? '40%' : jobStatus === 'ANALYZING_GEMINI' ? '80%' : '15%' }}
            />
           </div>
        </div>
      </div>
    )
  }

  // Standard Failure
  if (error || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">!</span>
          </div>
          <h1 className="text-xl font-bold mb-2">Build Process Rejections</h1>
          <p className="text-muted-foreground mb-6">
            {error || "Compilation architecture disconnected temporarily"}
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition"
          >
            Return System Securely
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="pr-0 md:pr-[360px] transition-all duration-300">
        <SiteTemplate
          business={business}
          config={config}
          isPreview
          onBusinessChange={handleBusinessChange}
        />
      </div>

      <PreviewCustomizer
        business={business}
        config={config}
        onConfigChange={handleConfigChange}
        onBusinessChange={handleBusinessChange}
        onPublish={handlePublish}
        isPublishing={isPublishing}
      />
    </div>
  )
}
