"use client"

import { useEffect, useState, use, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { BusinessData, SiteConfig, colorSchemes, layoutOptions, generateMockBusinessData } from "@/lib/mock-data"
import { SiteTemplate } from "@/components/site-template"
import { PageManager } from "@/components/page-manager"
import { PurchaseModal } from "@/components/purchase-modal"
import { cn } from "@/lib/utils"
import {
  Loader2, Globe, Monitor, Tablet, Smartphone,
  LayoutGrid, Paintbrush, Sparkles, Phone, ChevronDown,
  Plus, Check, ExternalLink, Copy, QrCode, AlertCircle,
} from "lucide-react"

interface PreviewPageProps {
  params: Promise<{ id: string }>
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [business, setBusiness] = useState<BusinessData | null>(null)
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false)
  const [config, setConfig] = useState<SiteConfig>({
    colorScheme: colorSchemes[0],
    layout: "modern",
    fontStyle: "sans",
    animations: true,
  })
  const [isPublishing, setIsPublishing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [siteSlug, setSiteSlug] = useState<string | null>(null)

  // Track queue statuses exclusively
  const [jobStatus, setJobStatus] = useState<string>("QUEUED")

  // Check if this is admin-demo mode
  const isAdminDemo = id === "admin-demo"

  // ── Slug availability checking (must be top-level hooks) ──────────────────
  const [slug, setSlug]                         = useState("")
  const [isCheckingSlug, setIsCheckingSlug]     = useState(false)
  const [slugAvailable, setSlugAvailable]       = useState<boolean | null>(null)
  const [slugError, setSlugError]               = useState("")

  // ── Local UI state ─────────────────────────────────────────────────────────
  const [device, setDevice]     = useState<"mobile" | "tablet" | "desktop">("desktop")
  const [rightTab, setRightTab] = useState<"design" | "content" | "publish">("design")
  const [copied, setCopied]     = useState(false)

  // ── Iframe for accurate mobile/tablet preview ──────────────────────────────
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const iframeHeight = device === "mobile" ? 812 : 1024

  useEffect(() => {
    // For admin-demo, skip API entirely and use mock data directly
    if (isAdminDemo) {
      const mockBusiness = generateMockBusinessData("admin-demo")
      setBusiness(mockBusiness)
      setConfig({
        colorScheme: colorSchemes[0],
        layout: "modern",
        fontStyle: "sans",
        animations: true,
      })
      setJobStatus("COMPLETED")
      setLoading(false)
      return
    }
    
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
          setIsPublished(!!data.isPublished)
          setSiteSlug(data.slug)
          setConfig({
            colorScheme: data.config?.colorScheme || colorSchemes[0],
            layout: data.config?.layout || "modern",
            fontStyle: data.config?.fontStyle || "sans",
            animations: data.config?.animations ?? true,
          })
          setLoading(false)

          // Stop speed challenge timer — site is built, email sent
          const startTime = localStorage.getItem("challenge_start_time")
          if (startTime) {
            const seconds = Math.floor((Date.now() - Number(startTime)) / 1000)
            window.dispatchEvent(new CustomEvent("challenge-complete", { detail: { seconds } }))
            fetch("/api/promo-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ seconds }),
            }).catch(() => {})
          }
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
  }, [id, isAdminDemo])

  // ── Slug init from server slug or business name ────────────────────────────
  useEffect(() => {
    if (siteSlug) { setSlug(siteSlug); setSlugAvailable(true) }
    else if (business?.name && !slug) {
      setSlug(business.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""))
    }
  }, [siteSlug, business?.name])

  // ── Slug availability debounce ─────────────────────────────────────────────
  useEffect(() => {
    if (slug.length < 3) { setSlugAvailable(null); return }
    if (siteSlug && slug === siteSlug) { setSlugAvailable(true); setSlugError(""); return }
    const t = setTimeout(async () => {
      setIsCheckingSlug(true)
      try {
        const params = new URLSearchParams({ slug })
        if (id) params.set("siteId", id)
        const res = await fetch(`/api/sites/check-slug?${params}`)
        const data = await res.json()
        setSlugAvailable(data.available)
        setSlugError(data.error || "")
      } catch { setSlugAvailable(false) }
      finally { setIsCheckingSlug(false) }
    }, 500)
    return () => clearTimeout(t)
  }, [slug, siteSlug, id])

  // ── Sync business/config to iframe when in mobile/tablet mode ─────────────
  useEffect(() => {
    if (device === "desktop" || !business) return
    const payload = { business, config }
    try { sessionStorage.setItem("preview-canvas-data", JSON.stringify(payload)) } catch {}
    iframeRef.current?.contentWindow?.postMessage(
      { type: "CANVAS_UPDATE", business, config },
      "*",
    )
  }, [business, config, device])


  const handleConfigChange = async (newConfig: SiteConfig) => {
    setConfig(newConfig)

    // Skip API for admin-demo mode
    if (isAdminDemo) return

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

    // Skip API for admin-demo mode
    if (isAdminDemo) return

    // Persist to server
    try {
      const res = await fetch(`/api/preview/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photos: newBusiness.photos,
          heroImage: newBusiness.heroImage,
          menuImage: newBusiness.menuImage,
          description: newBusiness.description,
          features: newBusiness.features,
          pages: newBusiness.pages,
          services: newBusiness.services,
          products: newBusiness.products,
          socials: newBusiness.socials,
          trainers: newBusiness.trainers,
          showTrainersSection: newBusiness.showTrainersSection,
          isGym: newBusiness.isGym,
        }),
      })
      if (!res.ok) console.error("Failed to save business data:", res.status, await res.text())
    } catch (err) {
      console.error("Failed to save business logic:", err)
    }
  }

  const handlePublish = async (slug: string) => {
    // Gate: user must have an active paid plan to publish
    const userPlan = session?.user?.plan ?? "free"
    const planExpiresAt = session?.user?.planExpiresAt
    const isExpired = planExpiresAt ? new Date(planExpiresAt) < new Date() : false
    const hasPlan = (userPlan === "base" || userPlan === "pro") && !isExpired

    if (!isAdminDemo && !hasPlan) {
      setPurchaseModalOpen(true)
      return
    }

    setIsPublishing(true)
    try {
      // 1. Save the slug to the database via PATCH
      const res = await fetch(`/api/preview/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      })

      if (!res.ok) throw new Error("Failed to save custom URL")

      // 2. Redirect to the new custom public URL
      const finalSlug = slug || siteSlug || id
      router.push(`/site/${finalSlug}?published=true`)
    } catch (err) {
      console.error(err)
      alert("Something went wrong while publishing. Please try again.")
    } finally {
      setIsPublishing(false)
    }
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

  const siteUrl = siteSlug
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/site/${siteSlug}`
    : null
  const qrUrl = siteUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=12&data=${encodeURIComponent(siteUrl)}`
    : null

  const handleCopy = () => {
    if (siteUrl) { navigator.clipboard.writeText(siteUrl); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }

  const pages = business?.pages ?? {}
  const isGym = !!business?.isGym
  const enabledPages = [
    { key: "home",     label: "Home" },
    ...(pages.services  ? [{ key: "services",  label: isGym ? "Memberships" : "Services" }] : []),
    ...(pages.products  ? [{ key: "products",  label: "Products" }] : []),
    ...((pages as any).trainers ? [{ key: "trainers", label: "Trainers" }] : []),
    ...(pages.contact   ? [{ key: "contact",   label: "Contact" }] : []),
  ]

  const TEMPLATE_ACCENTS: Record<string, { header: string; hero: string; card: string; dark?: boolean }> = {
    modern:       { header: "#0077b6", hero: "#0096c7", card: "#caf0f8" },
    classic:      { header: "#7b3f00", hero: "#a0522d", card: "#f5deb3" },
    minimal:      { header: "#1a1a1a", hero: "#333",    card: "#f0f0f0" },
    luxury:       { header: "#c9a84c", hero: "#111",    card: "#1e1c18", dark: true },
    bold:         { header: "#7c3aed", hero: "#6d28d9", card: "#ede9fe" },
    executive:    { header: "#1e3a8a", hero: "#1e40af", card: "#dbeafe" },
    neon:         { header: "#00f5ff", hero: "#050510", card: "#0a0a20", dark: true },
    sport:        { header: "#ff4500", hero: "#ff6a00", card: "#fff3ee" },
    editorial:    { header: "#111",    hero: "#222",    card: "#f7f7f7" },
    "dark-power": { header: "#e63946", hero: "#111",    card: "#1a1a1a", dark: true },
    sunrise:      { header: "#f97316", hero: "#fb923c", card: "#fff7ed" },
  }
  const TemplateThumbnail = ({ tid, active }: { tid: string; active: boolean }) => {
    const t = TEMPLATE_ACCENTS[tid] ?? { header: "#6366f1", hero: "#818cf8", card: "#eef2ff" }
    return (
      <div className={cn("relative flex-shrink-0 w-[58px] h-[38px] rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 select-none",
        active ? "border-violet-500 scale-[1.08]" : "border-gray-200 hover:border-gray-300 hover:scale-[1.03]")}
        style={{
          background: t.dark ? "#0d0d0d" : "#f8f8f8",
          boxShadow: active ? "0 0 0 3px rgba(124,58,237,0.18), 0 4px 12px rgba(124,58,237,0.15)" : "0 1px 3px rgba(0,0,0,0.08)",
        }}>
        <div className="absolute top-0 left-0 right-0 h-3 flex items-center px-1.5 gap-1" style={{ background: t.dark ? "#111" : t.header }}>
          <div className="w-1.5 h-1 rounded-full" style={{ background: t.dark ? t.header : "rgba(255,255,255,0.6)" }} />
          <div className="flex-1" /><div className="w-3 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.35)" }} />
        </div>
        <div className="absolute top-3 left-0 right-0 h-[18px] flex items-end px-1.5 pb-0.5" style={{ background: `linear-gradient(135deg, ${t.hero}, ${t.header})` }}>
          <div className="h-1 w-8 rounded-full" style={{ background: "rgba(255,255,255,0.7)" }} />
        </div>
        <div className="absolute bottom-1 left-1 right-1 flex gap-0.5">
          {[0,1,2].map(i => <div key={i} className="flex-1 h-2.5 rounded-xs" style={{ background: t.card, opacity: 0.85 }} />)}
        </div>
      </div>
    )
  }

  const deviceWidthLabel = { mobile: "390 px", tablet: "768 px", desktop: "Full width" }[device]

  return (
    <>
      {/* Mobile not supported */}
      <div className="md:hidden fixed inset-0 z-[100] flex flex-col items-center justify-center text-center p-8 bg-slate-50">
        <div className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center shadow-lg"
          style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}>
          <Monitor className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Desktop Required</h2>
        <p className="text-gray-500 text-sm max-w-xs">
          The website editor needs a desktop screen to work properly.
        </p>
      </div>

      {/* Builder shell */}
      <div className="hidden md:flex h-screen flex-col overflow-hidden bg-[#F0F2F7] text-gray-900">

        {/* ── TOP BAR ───────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 h-[52px] flex items-center gap-3 px-4 border-b bg-white border-gray-200 shadow-sm">

          <div className="flex items-center gap-2 flex-shrink-0 mr-1">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm"
              style={{ background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)" }}>
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight text-gray-900">MapToSite</span>
          </div>

          <div className="w-px h-5 flex-shrink-0 bg-gray-200" />

          {/* Template picker */}
          <div className="flex items-center gap-2 overflow-x-auto flex-1 min-w-0" style={{ scrollbarWidth: "none" }}>
            {layoutOptions.map(opt => (
              <button key={opt.id}
                onClick={() => handleConfigChange({ ...config, layout: opt.id as SiteConfig["layout"] })}
                className="flex-shrink-0" title={opt.name}>
                <TemplateThumbnail tid={opt.id} active={config.layout === opt.id} />
              </button>
            ))}
          </div>

          <div className="w-px h-5 flex-shrink-0 bg-gray-200" />

          {/* Device toggle */}
          <div className="flex-shrink-0 flex items-center gap-0.5 p-1 rounded-lg bg-slate-100">
            {([
              { d: "mobile"  as const, Icon: Smartphone },
              { d: "tablet"  as const, Icon: Tablet     },
              { d: "desktop" as const, Icon: Monitor    },
            ]).map(({ d, Icon }) => (
              <button key={d} onClick={() => setDevice(d)} title={d}
                className="p-1.5 rounded-md transition-all"
                style={device === d ? { background: "#EDE9FE", color: "#7C3AED" } : { color: "#94A3B8" }}>
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* Demo badge */}
          {isAdminDemo && (
            <div className="flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
              style={{ background: "#FEF9C3", color: "#A16207", border: "1px solid #FDE68A" }}>
              Demo
            </div>
          )}

          {/* View published site */}
          {isPublished && siteSlug && (
            <a href={`/site/${siteSlug}`} target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
              style={{ borderColor: "#6EE7B7", color: "#059669", background: "#ECFDF5" }}>
              <ExternalLink className="w-3.5 h-3.5" />
              View Site
            </a>
          )}

          {/* Publish button */}
          <button
            onClick={() => setRightTab("publish")}
            className="flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "#7C3AED" }}>
            {isPublished ? "Update" : "Publish"}
          </button>
        </div>

        {/* ── MAIN AREA ─────────────────────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden">

          {/* ─ LEFT PANEL ─────────────────────────────────────────────── */}
          <div className="flex-shrink-0 w-48 flex flex-col overflow-y-auto border-r bg-white border-gray-200">
            <div className="p-3 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5 text-slate-400">Pages</p>
              <div className="space-y-0.5">
                {enabledPages.map(page => (
                  <div key={page.key}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium"
                    style={page.key === "home"
                      ? { background: "#EDE9FE", color: "#6D28D9" }
                      : { color: "#64748B" }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: page.key === "home" ? "#7C3AED" : "#CBD5E1" }} />
                    {page.label}
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-300">Add Page</p>
                <div className="space-y-0.5">
                  {!pages.services && (
                    <button
                      onClick={() => handleBusinessChange({ ...business, pages: { ...pages, services: true } })}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-colors text-slate-400 hover:text-slate-700 hover:bg-slate-50">
                      <Plus className="w-3 h-3" />{isGym ? "Memberships" : "Services"}
                    </button>
                  )}
                  {!pages.products && (
                    <button
                      onClick={() => handleBusinessChange({ ...business, pages: { ...pages, products: true } })}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-colors text-slate-400 hover:text-slate-700 hover:bg-slate-50">
                      <Plus className="w-3 h-3" />Products
                    </button>
                  )}
                  {!pages.contact && (
                    <button
                      onClick={() => handleBusinessChange({ ...business, pages: { ...pages, contact: true } })}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-colors text-slate-400 hover:text-slate-700 hover:bg-slate-50">
                      <Plus className="w-3 h-3" />Contact
                    </button>
                  )}
                  {!(pages as any).trainers && isGym && (
                    <button
                      onClick={() => handleBusinessChange({ ...business, pages: { ...pages, trainers: true } as any })}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-colors text-slate-400 hover:text-slate-700 hover:bg-slate-50">
                      <Plus className="w-3 h-3" />Trainers
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ─ CANVAS ─────────────────────────────────────────────────── */}
          <div className="flex-1 overflow-auto"
            style={{
              background: "#EEF1F8",
              backgroundImage: "radial-gradient(#C7D2E8 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}>
            <div className="min-h-full flex flex-col items-center py-8 px-6">

              {/* Dimension badge */}
              <div className="mb-5 flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-widest select-none bg-white border border-gray-200 text-slate-500 shadow-sm">
                {device === "mobile"  && <><Smartphone className="w-3 h-3" /> {deviceWidthLabel} — accurate mobile view</>}
                {device === "tablet"  && <><Tablet     className="w-3 h-3" /> {deviceWidthLabel} — accurate tablet view</>}
                {device === "desktop" && <><Monitor    className="w-3 h-3" /> {deviceWidthLabel} — click to edit inline</>}
              </div>

              <div
                className={cn(
                  "bg-white overflow-hidden transition-all duration-500",
                  device === "mobile"  && "w-[390px] rounded-[2.5rem]",
                  device === "tablet"  && "w-[768px] rounded-2xl",
                  device === "desktop" && "w-full max-w-[1280px] rounded-2xl",
                )}
                style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 20px 60px rgba(0,0,0,0.14)" }}>

                {/* Browser chrome (tablet/desktop) */}
                {device !== "mobile" && (
                  <div className="flex items-center gap-2 px-4 h-9 border-b flex-shrink-0"
                    style={{ background: "#F5F5F5", borderColor: "#E0E0E0" }}>
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                      <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                    </div>
                    <div className="flex-1 mx-6">
                      <div className="h-5 rounded flex items-center px-3 text-[11px]"
                        style={{ background: "#E8E8E8", color: "#888" }}>
                        {siteSlug ? `maptosite.com/${siteSlug}` : `${business.name.toLowerCase().replace(/\s+/g, "-")}.maptosite.com`}
                      </div>
                    </div>
                    {siteSlug && (
                      <a href={`/site/${siteSlug}`} target="_blank" rel="noopener noreferrer"
                        className="p-1 rounded hover:bg-black/5 transition text-gray-500">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}

                {/* Mobile status bar */}
                {device === "mobile" && (
                  <div className="h-7 flex items-center justify-center flex-shrink-0 bg-black">
                    <div className="w-20 h-4 rounded-full bg-[#1e1e1e]" />
                  </div>
                )}

                {/* Desktop: inline editable SiteTemplate. Mobile/Tablet: iframe for accurate viewport */}
                {device === "desktop" ? (
                  <SiteTemplate
                    business={business}
                    config={config}
                    isPreview
                    onBusinessChange={handleBusinessChange}
                  />
                ) : (
                  <iframe
                    ref={iframeRef}
                    src="/preview/canvas"
                    className="w-full border-0 block"
                    style={{ height: iframeHeight }}
                    title="Website Preview"
                    onLoad={() => {
                      iframeRef.current?.contentWindow?.postMessage(
                        { type: "CANVAS_UPDATE", business, config },
                        "*",
                      )
                    }}
                  />
                )}
              </div>

              <div className="h-12" />
            </div>
          </div>

          {/* ─ RIGHT PANEL ────────────────────────────────────────────── */}
          <div className="flex-shrink-0 w-[288px] flex flex-col border-l bg-white border-gray-200 overflow-hidden">

            {/* Tabs */}
            <div className="flex-shrink-0 flex gap-1 p-2.5 border-b border-gray-100">
              {([
                { id: "design",  label: "Design",  Icon: Paintbrush },
                { id: "content", label: "Content", Icon: LayoutGrid  },
                { id: "publish", label: "Publish",  Icon: Globe       },
              ] as const).map(({ id: tid, label, Icon }) => (
                <button key={tid} onClick={() => setRightTab(tid)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[11px] font-semibold transition-all"
                  style={rightTab === tid
                    ? { background: "#EDE9FE", color: "#6D28D9" }
                    : { color: "#94A3B8" }}>
                  <Icon className="w-3 h-3" />{label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4">

              {/* ── DESIGN TAB ─────────────────────────────────────────── */}
              {rightTab === "design" && (
                <div className="space-y-6">
                  <section>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-3 text-slate-400">Color Scheme</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {colorSchemes.map(scheme => (
                        <button key={scheme.id}
                          onClick={() => handleConfigChange({ ...config, colorScheme: scheme })}
                          className="p-2.5 rounded-xl border-2 transition-all text-left"
                          style={{
                            borderColor: config.colorScheme.id === scheme.id ? "#7C3AED" : "#E2E8F0",
                            background: config.colorScheme.id === scheme.id ? "#F5F3FF" : "#fff",
                            boxShadow: config.colorScheme.id === scheme.id ? "0 0 0 3px rgba(124,58,237,0.12)" : "none",
                          }}>
                          <div className="flex items-center gap-0.5 mb-1.5">
                            {[scheme.primary, scheme.secondary, scheme.accent].map((c, i) => (
                              <div key={i} className="w-3 h-3 rounded-full border border-black/10 shadow-sm" style={{ background: c }} />
                            ))}
                          </div>
                          <p className="text-[9px] font-semibold leading-tight text-slate-500">{scheme.name}</p>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-3 text-slate-400">Font Style</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {([
                        { id: "sans"    as const, name: "Clean",    cls: ""            },
                        { id: "serif"   as const, name: "Elegant",  cls: "font-serif"  },
                        { id: "rounded" as const, name: "Friendly", cls: "tracking-wide" },
                      ]).map(f => (
                        <button key={f.id}
                          onClick={() => handleConfigChange({ ...config, fontStyle: f.id })}
                          className="p-3 rounded-xl border-2 transition-all text-center"
                          style={{
                            borderColor: config.fontStyle === f.id ? "#7C3AED" : "#E2E8F0",
                            background: config.fontStyle === f.id ? "#F5F3FF" : "#fff",
                            boxShadow: config.fontStyle === f.id ? "0 0 0 3px rgba(124,58,237,0.12)" : "none",
                          }}>
                          <p className={cn("text-base font-bold text-gray-800 mb-0.5", f.cls)}>Aa</p>
                          <p className="text-[9px] font-semibold text-slate-400">{f.name}</p>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-3 text-slate-400">Effects</p>
                    <button
                      onClick={() => handleConfigChange({ ...config, animations: !config.animations })}
                      className="w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all"
                      style={{
                        borderColor: config.animations ? "#7C3AED" : "#E2E8F0",
                        background: config.animations ? "#F5F3FF" : "#fff",
                        boxShadow: config.animations ? "0 0 0 3px rgba(124,58,237,0.12)" : "none",
                      }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ background: config.animations ? "#7C3AED" : "#F1F5F9" }}>
                          <Sparkles className={cn("w-4 h-4", config.animations ? "text-white" : "text-slate-400")} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-semibold text-gray-800">Animations</p>
                          <p className="text-[10px] text-slate-400">Scroll & hover effects</p>
                        </div>
                      </div>
                      <div className="relative w-10 h-5 rounded-full transition-all"
                        style={{ background: config.animations ? "#7C3AED" : "#E2E8F0" }}>
                        <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                          style={{ left: config.animations ? "calc(100% - 18px)" : "2px" }} />
                      </div>
                    </button>
                  </section>
                </div>
              )}

              {/* ── CONTENT TAB ────────────────────────────────────────── */}
              {rightTab === "content" && (
                <div className="space-y-5">
                  <section>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-400">Contact Info</p>
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs">
                      <Phone className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                      <input
                        value={business.phone}
                        onChange={e => handleBusinessChange({ ...business, phone: e.target.value })}
                        placeholder="Phone number"
                        className="flex-1 bg-transparent outline-none text-gray-800 placeholder-slate-300 text-xs" />
                    </div>
                  </section>

                  <section>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-400">Social Links</p>
                    <div className="space-y-1.5">
                      {[
                        { key: "instagram", label: "Instagram" },
                        { key: "facebook",  label: "Facebook"  },
                        { key: "twitter",   label: "Twitter/X" },
                      ].map(s => (
                        <div key={s.key}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs">
                          <span className="w-16 flex-shrink-0 text-[10px] font-semibold text-slate-400">{s.label}</span>
                          <input
                            value={(business.socials as any)?.[s.key] || ""}
                            onChange={e => handleBusinessChange({ ...business, socials: { ...business.socials, [s.key]: e.target.value } })}
                            placeholder="URL"
                            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-slate-300 text-xs" />
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-400">Pages & Content</p>
                    <div className="rounded-2xl overflow-hidden border border-gray-100">
                      <PageManager business={business} onChange={handleBusinessChange} />
                    </div>
                  </section>
                </div>
              )}

              {/* ── PUBLISH TAB ────────────────────────────────────────── */}
              {rightTab === "publish" && (
                <div className="space-y-5">
                  {isPublished && siteUrl && (
                    <div className="rounded-xl overflow-hidden border border-emerald-200 bg-emerald-50">
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-semibold text-emerald-700">Site is live!</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] border border-emerald-200 bg-white">
                          <span className="flex-1 truncate text-gray-700">{siteUrl}</span>
                          <button onClick={handleCopy} className="flex-shrink-0 p-1 rounded transition hover:bg-gray-100">
                            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-gray-400" />}
                          </button>
                          <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 p-1 rounded transition hover:bg-gray-100">
                            <ExternalLink className="w-3 h-3 text-gray-400" />
                          </a>
                        </div>
                      </div>
                      {qrUrl && (
                        <div className="border-t border-emerald-200 flex justify-center p-4 bg-white">
                          <img src={qrUrl} alt="QR Code" className="w-32 h-32 rounded-lg" />
                        </div>
                      )}
                    </div>
                  )}

                  <section>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-400">Custom URL</p>
                    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                      <div className="flex items-center gap-1 px-3 py-1 border-b border-gray-100 text-[10px] text-slate-400 bg-gray-50">
                        maptosite.com/
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2.5">
                        <input
                          value={slug}
                          onChange={e => { setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")); setSlugAvailable(null) }}
                          placeholder="your-business-name"
                          className="flex-1 bg-transparent outline-none text-gray-900 text-xs"
                        />
                        {isCheckingSlug && <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0 text-slate-400" />}
                        {!isCheckingSlug && slugAvailable === true  && <Check className="w-3.5 h-3.5 flex-shrink-0 text-emerald-500" />}
                        {!isCheckingSlug && slugAvailable === false && <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-400" />}
                      </div>
                    </div>
                    {slugError && <p className="text-[10px] mt-1.5 text-red-500">{slugError}</p>}
                    {slugAvailable === false && !slugError && (
                      <p className="text-[10px] mt-1.5 text-red-500">This URL is already taken</p>
                    )}
                  </section>

                  <button
                    onClick={() => handlePublish(slug)}
                    disabled={isPublishing || !slugAvailable}
                    className={cn(
                      "w-full py-3 rounded-xl text-sm font-bold text-white transition-all",
                      isPublishing || !slugAvailable ? "opacity-40 cursor-not-allowed" : "hover:opacity-90",
                    )}
                    style={{ background: "#7C3AED" }}>
                    {isPublishing ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Publishing…
                      </span>
                    ) : isPublished ? "Update & Publish" : "Publish Site"}
                  </button>

                  <p className="text-[10px] text-center text-slate-400">
                    {isAdminDemo ? "Demo mode — no actual publish" : "Your site will be live at the URL above"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <PurchaseModal
        open={purchaseModalOpen}
        onClose={() => setPurchaseModalOpen(false)}
      />
    </>
  )
}
