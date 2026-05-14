"use client"

/**
 * Headless canvas page embedded in the editor via <iframe>.
 * Receives business/config data from the parent through:
 *   1. sessionStorage key "preview-canvas-data" (initial load)
 *   2. window.postMessage({ type: "CANVAS_UPDATE", business, config }) (live updates)
 *
 * Reports its scroll height back so the parent can size the iframe correctly:
 *   window.parent.postMessage({ type: "CANVAS_HEIGHT", height: number })
 */

import { useEffect, useState } from "react"
import { SiteTemplate } from "@/components/site-template"
import { BusinessData, SiteConfig, generateMockBusinessData, colorSchemes } from "@/lib/mock-data"

const DEFAULT_BUSINESS = generateMockBusinessData("test")
const DEFAULT_CONFIG: SiteConfig = {
  colorScheme: colorSchemes[0],
  layout: "modern",
  fontStyle: "sans",
  animations: true,
}

export default function PreviewCanvasPage() {
  const [business, setBusiness] = useState<BusinessData>(DEFAULT_BUSINESS)
  const [config, setConfig]     = useState<SiteConfig>(DEFAULT_CONFIG)
  const [ready, setReady]       = useState(false)

  // ── Load initial data, then listen for live updates ────────────────────────
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("preview-canvas-data")
      if (raw) {
        const { business: b, config: c } = JSON.parse(raw)
        if (b) setBusiness(b)
        if (c) setConfig(c)
      }
    } catch {}
    setReady(true)

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "CANVAS_UPDATE") {
        if (e.data.business) setBusiness(e.data.business)
        if (e.data.config)   setConfig(e.data.config)
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])


  // ── Blank white screen while loading (avoids flash of default data) ────────
  if (!ready) {
    return <div style={{ minHeight: "100vh", background: "#fff" }} />
  }

  const handleBusinessChange = (updated: BusinessData) => {
    setBusiness(updated)
    window.parent.postMessage({ type: "BUSINESS_UPDATE", business: updated }, "*")
  }

  return (
    <SiteTemplate
      business={business}
      config={config}
      isPreview={true}
      onBusinessChange={handleBusinessChange}
    />
  )
}
