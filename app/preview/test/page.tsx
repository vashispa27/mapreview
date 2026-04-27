"use client"

import { useState } from "react"
import { BusinessData, SiteConfig, colorSchemes, generateMockBusinessData } from "@/lib/mock-data"
import { SiteTemplate } from "@/components/site-template"
import { PreviewCustomizer } from "@/components/preview-customizer"

const mockBusiness = generateMockBusinessData("test")

export default function TestPreviewPage() {
  const [business, setBusiness] = useState<BusinessData>(mockBusiness)
  const [config, setConfig] = useState<SiteConfig>({
    colorScheme: colorSchemes[0],
    layout: "modern",
    fontStyle: "sans",
    animations: true,
  })

  return (
    <div className="relative">
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-amber-200 whitespace-nowrap pointer-events-none">
        Test Mode — No auth, no DB
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
        onPublish={async () => {}}
        isPublishing={false}
        isPublished={false}
        siteSlug={null}
        siteId="test"
      />
    </div>
  )
}
