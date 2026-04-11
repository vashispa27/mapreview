"use client"

import { useState } from "react"
import { BusinessData, SiteConfig, colorSchemes, generateMockBusinessData } from "@/lib/mock-data"
import { SiteTemplate } from "@/components/site-template"
import { PreviewCustomizer } from "@/components/preview-customizer"
import { useRouter } from "next/navigation"

export default function AdminDemoPage() {
  const router = useRouter()
  const [business, setBusiness] = useState<BusinessData>(() => generateMockBusinessData("admin-demo"))
  const [config, setConfig] = useState<SiteConfig>({
    colorScheme: colorSchemes[0],
    layout: "modern",
    fontStyle: "sans",
    animations: true,
  })
  const [isPublishing, setIsPublishing] = useState(false)

  const handlePublish = async () => {
    setIsPublishing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsPublishing(false)
    // In demo mode, just show a success state
  }

  return (
    <div className="relative">
      {/* Admin Demo Indicator */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-amber-200">
        Demo Mode - Using mock data for testing
      </div>
      
      <div className="pr-0 md:pr-[360px] transition-all duration-300">
        <SiteTemplate
          business={business}
          config={config}
          isPreview
          onBusinessChange={setBusiness}
        />
      </div>

      <PreviewCustomizer
        business={business}
        config={config}
        onConfigChange={setConfig}
        onBusinessChange={setBusiness}
        onPublish={handlePublish}
        isPublishing={isPublishing}
      />
    </div>
  )
}
