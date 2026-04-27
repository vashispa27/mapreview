"use client"

import { useState, useEffect, useRef } from "react"
import {
  BusinessData, SiteConfig, colorSchemes, layoutOptions,
  generateMockBusinessData,
} from "@/lib/mock-data"
import { PageManager } from "@/components/page-manager"
import {
  Monitor, Tablet, Smartphone, Database, Sparkles, Globe,
  Plus, LayoutGrid, Paintbrush, ChevronDown, Phone, Loader2,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import sampleData from "@/sample_scraped_data.json"

// ─── Sample data parser ───────────────────────────────────────────────────────
function parseSampleToBusinessData(scraped: any): BusinessData {
  const allPhotos: Array<{ url: string; caption: string }> = []

  ;(scraped.reviews || []).forEach((r: any) => {
    ;(r.reviewImageUrls || []).forEach((url: string) => {
      if (url && allPhotos.length < 20) allPhotos.push({ url, caption: r.name || "" })
    })
  })

  const reviews = (scraped.reviews || [])
    .filter((r: any) => r.text && r.stars >= 4)
    .slice(0, 8)
    .map((r: any) => ({
      author: r.name || "Anonymous",
      avatar: r.reviewerPhotoUrl || undefined,
      rating: r.stars,
      date: r.publishAt
        ? new Date(r.publishAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "Recently",
      text: r.text,
    }))

  const hours = (scraped.openingHours || []).map((h: any) => ({
    day: h.day,
    hours: Array.isArray(h.hours) ? h.hours.join(", ") : (h.hours || "Closed"),
  }))

  const name = (scraped.title || "Business Name").split(",")[0].trim()

  return {
    id: Math.random().toString(36).slice(2, 14),
    name,
    category: scraped.categoryName || scraped.categories?.[0] || "Business",
    rating: scraped.totalScore || 4.5,
    totalReviews: scraped.reviewsCount || 0,
    address: scraped.address || "",
    phone: scraped.phone || "",
    website: scraped.website || undefined,
    heroImage: allPhotos[0]?.url || undefined,
    hours: hours.length > 0 ? hours : [
      { day: "Mon – Fri", hours: "9:00 AM – 6:00 PM" },
      { day: "Saturday",  hours: "10:00 AM – 4:00 PM" },
      { day: "Sunday",    hours: "Closed" },
    ],
    photos: allPhotos.slice(1, 7),
    availablePhotos: allPhotos,
    reviews: reviews.length > 0 ? reviews : generateMockBusinessData("test").reviews,
    description: `Welcome to ${name}. Rated ${scraped.totalScore}/5 by ${scraped.reviewsCount?.toLocaleString()} customers.`,
    features: (scraped.categories || []).slice(0, 4).length > 0
      ? scraped.categories.slice(0, 4)
      : ["Quality Service", "Expert Team", "Customer First", "Premium Experience"],
    priceLevel: "$$",
  }
}

// ─── Template thumbnail ───────────────────────────────────────────────────────
const TEMPLATE_ACCENTS: Record<string, { header: string; hero: string; card: string; dark?: boolean }> = {
  modern:      { header: "#0077b6", hero: "#0096c7", card: "#caf0f8" },
  classic:     { header: "#7b3f00", hero: "#a0522d", card: "#f5deb3" },
  minimal:     { header: "#1a1a1a", hero: "#333",    card: "#f0f0f0" },
  luxury:      { header: "#c9a84c", hero: "#111",    card: "#1e1c18", dark: true },
  bold:        { header: "#7c3aed", hero: "#6d28d9", card: "#ede9fe" },
  executive:   { header: "#1e3a8a", hero: "#1e40af", card: "#dbeafe" },
  neon:        { header: "#00f5ff", hero: "#050510", card: "#0a0a20", dark: true },
  sport:       { header: "#ff4500", hero: "#ff6a00", card: "#fff3ee" },
  editorial:   { header: "#111",    hero: "#222",    card: "#f7f7f7" },
  "dark-power":{ header: "#e63946", hero: "#111",    card: "#1a1a1a", dark: true },
  sunrise:     { header: "#f97316", hero: "#fb923c", card: "#fff7ed" },
}

function TemplateThumbnail({ id, active }: { id: string; active: boolean }) {
  const t = TEMPLATE_ACCENTS[id] ?? { header: "#6366f1", hero: "#818cf8", card: "#eef2ff" }
  return (
    <div
      className={cn(
        "relative flex-shrink-0 w-[58px] h-[38px] rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 select-none",
        active
          ? "border-violet-500 scale-[1.08]"
          : "border-gray-200 hover:border-gray-300 hover:scale-[1.03]",
      )}
      style={{
        background: t.dark ? "#0d0d0d" : "#f8f8f8",
        boxShadow: active ? "0 0 0 3px rgba(124,58,237,0.18), 0 4px 12px rgba(124,58,237,0.15)" : "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-3 flex items-center px-1.5 gap-1"
        style={{ background: t.dark ? "#111" : t.header }}>
        <div className="w-1.5 h-1 rounded-full" style={{ background: t.dark ? t.header : "rgba(255,255,255,0.6)" }} />
        <div className="flex-1" />
        <div className="w-3 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.35)" }} />
      </div>
      <div className="absolute top-3 left-0 right-0 h-[18px] flex items-end px-1.5 pb-0.5"
        style={{ background: `linear-gradient(135deg, ${t.hero}, ${t.header})` }}>
        <div className="h-1 w-8 rounded-full" style={{ background: "rgba(255,255,255,0.7)" }} />
      </div>
      <div className="absolute bottom-1 left-1 right-1 flex gap-0.5">
        {[0, 1, 2].map(i => (
          <div key={i} className="flex-1 h-2.5 rounded-xs" style={{ background: t.card, opacity: 0.85 }} />
        ))}
      </div>
    </div>
  )
}

const BUSINESS_TYPES = [
  { id: "generic",    label: "General Business" },
  { id: "gym",        label: "Gym / Fitness"    },
  { id: "salon",      label: "Salon / Spa"      },
  { id: "restaurant", label: "Restaurant / Café" },
]

// ─── Main page ────────────────────────────────────────────────────────────────
export default function TestPreviewPage() {
  const [business, setBusiness] = useState<BusinessData>(generateMockBusinessData("test"))
  const [config, setConfig]     = useState<SiteConfig>({
    colorScheme: colorSchemes[0],
    layout: "modern",
    fontStyle: "sans",
    animations: true,
  })
  const [device, setDevice]         = useState<"mobile" | "tablet" | "desktop">("desktop")
  const [rightTab, setRightTab]     = useState<"design" | "content">("design")
  const [loadingData, setLoadingData] = useState(false)
  const [dataLoaded, setDataLoaded]   = useState(false)
  // Iframe canvas
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const iframeHeight = device === "mobile" ? 812 : device === "tablet" ? 1024 : 900

  // Sync business/config to iframe whenever they change
  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "CANVAS_UPDATE", business, config },
      "*",
    )
  }, [business, config])

  const pages = business.pages ?? {}
  const enabledPages = [
    { key: "home",     label: "Home" },
    ...(pages.services  ? [{ key: "services",  label: business.isGym ? "Memberships" : "Services" }] : []),
    ...(pages.products  ? [{ key: "products",  label: "Products" }] : []),
    ...((pages as any).trainers ? [{ key: "trainers", label: "Trainers" }] : []),
    ...(pages.contact   ? [{ key: "contact",   label: "Contact" }] : []),
  ]

  const handleLoadSample = () => {
    setLoadingData(true)
    setTimeout(() => {
      setBusiness(parseSampleToBusinessData((sampleData as any[])[0]))
      setDataLoaded(true)
      setLoadingData(false)
    }, 700)
  }

  const setIsGym = (isGym: boolean) => {
    setBusiness(prev => ({
      ...prev,
      isGym,
      showTrainersSection: isGym,
      trainers: isGym && (!prev.trainers || prev.trainers.length === 0) ? [
        { id: "t1", name: "Trainer Name", specialization: "Strength & Conditioning", experience: "5+ years", bio: "Certified personal trainer.", photo: undefined },
        { id: "t2", name: "Trainer Name", specialization: "Yoga & Flexibility",      experience: "3+ years", bio: "Experienced yoga instructor.",  photo: undefined },
      ] : prev.trainers,
      services: isGym && (!prev.services || prev.services.length === 0) ? [
        { id: "gym-monthly",    title: "Monthly Membership",  price: "₹1,499 / month",   description: "Full gym access, all equipment.", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" },
        { id: "gym-quarterly",  title: "Quarterly Plan",      price: "₹3,999 / 3 months",description: "Save more with 3-month plan.",   image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80" },
        { id: "gym-halfyearly", title: "Half-Yearly Plan",    price: "₹6,999 / 6 months",description: "Full access + 2 PT sessions.",   image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80" },
        { id: "gym-annual",     title: "Annual Membership",   price: "₹11,999 / year",   description: "Everything + 12 PT sessions.",  image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80" },
      ] : prev.services,
      pages: { ...prev.pages, services: true, products: isGym ? false : prev.pages?.products, trainers: isGym ? true : false } as any,
    }))
  }

  // ─── Device frame widths ────────────────────────────────────────────────────
  const deviceLabel = { mobile: "390 px", tablet: "768 px", desktop: "Full width" }[device]

  return (
    <>
      {/* ── Mobile-not-supported overlay ──────────────────────────────────── */}
      <div className="md:hidden fixed inset-0 z-[100] flex flex-col items-center justify-center text-center p-8 bg-slate-50">
        <div className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center shadow-lg"
          style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}>
          <Monitor className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Desktop Required</h2>
        <p className="text-gray-500 text-sm max-w-xs">
          The website builder is designed for desktop screens. Please open it on a larger display.
        </p>
      </div>

      {/* ── Builder shell ─────────────────────────────────────────────────── */}
      <div className="hidden md:flex h-screen flex-col overflow-hidden bg-[#F0F2F7] text-gray-900">

        {/* ─── TOP BAR ──────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 h-[52px] flex items-center gap-3 px-4 border-b bg-white border-gray-200 shadow-sm">

          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0 mr-1">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm"
              style={{ background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)" }}>
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight text-gray-900">MapToSite</span>
          </div>

          <div className="w-px h-5 flex-shrink-0 bg-gray-200" />

          {/* Template Thumbnails — scrollable */}
          <div className="flex items-center gap-2 overflow-x-auto flex-1 min-w-0" style={{ scrollbarWidth: "none" }}>
            {layoutOptions.map(opt => (
              <button key={opt.id}
                onClick={() => setConfig(c => ({ ...c, layout: opt.id as SiteConfig["layout"] }))}
                className="flex-shrink-0" title={opt.name}>
                <TemplateThumbnail id={opt.id} active={config.layout === opt.id} />
              </button>
            ))}
          </div>

          <div className="w-px h-5 flex-shrink-0 bg-gray-200" />

          {/* Load sample */}
          <button onClick={handleLoadSample} disabled={loadingData || dataLoaded}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
            style={dataLoaded
              ? { borderColor: "#6EE7B7", color: "#059669", background: "#ECFDF5", cursor: "default" }
              : { borderColor: "#E2E8F0", color: "#64748B", background: "#fff" }}>
            {loadingData ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : dataLoaded ? <Check className="w-3.5 h-3.5" />
              : <Database className="w-3.5 h-3.5" />}
            {dataLoaded ? "Live Data" : "Load Sample"}
          </button>

          {/* Device Toggle */}
          <div className="flex-shrink-0 flex items-center gap-0.5 p-1 rounded-lg bg-slate-100">
            {([
              { d: "mobile"  as const, Icon: Smartphone },
              { d: "tablet"  as const, Icon: Tablet     },
              { d: "desktop" as const, Icon: Monitor    },
            ]).map(({ d, Icon }) => (
              <button key={d} onClick={() => setDevice(d)} title={d}
                className="p-1.5 rounded-md transition-all"
                style={device === d
                  ? { background: "#EDE9FE", color: "#7C3AED" }
                  : { color: "#94A3B8" }}>
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* Test badge */}
          <div className="flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
            style={{ background: "#FEF9C3", color: "#A16207", border: "1px solid #FDE68A" }}>
            Test Mode
          </div>

          {/* Publish (disabled) */}
          <button disabled
            className="flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-semibold text-white opacity-40 cursor-not-allowed"
            style={{ background: "#7C3AED" }}>
            Publish
          </button>
        </div>

        {/* ─── MAIN AREA ────────────────────────────────────────────────── */}
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

              {/* Add pages */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-300">Add Page</p>
                <div className="space-y-0.5">
                  {!pages.services && (
                    <button
                      onClick={() => setBusiness(p => ({ ...p, pages: { ...p.pages, services: true } }))}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-colors text-slate-400 hover:text-slate-700 hover:bg-slate-50">
                      <Plus className="w-3 h-3" />
                      {business.isGym ? "Memberships" : "Services"}
                    </button>
                  )}
                  {!pages.products && (
                    <button
                      onClick={() => setBusiness(p => ({ ...p, pages: { ...p.pages, products: true } }))}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-colors text-slate-400 hover:text-slate-700 hover:bg-slate-50">
                      <Plus className="w-3 h-3" />
                      Products
                    </button>
                  )}
                  {!pages.contact && (
                    <button
                      onClick={() => setBusiness(p => ({ ...p, pages: { ...p.pages, contact: true } }))}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-colors text-slate-400 hover:text-slate-700 hover:bg-slate-50">
                      <Plus className="w-3 h-3" />
                      Contact
                    </button>
                  )}
                  {!(pages as any).trainers && business.isGym && (
                    <button
                      onClick={() => setBusiness(p => ({ ...p, pages: { ...p.pages, trainers: true } as any }))}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-colors text-slate-400 hover:text-slate-700 hover:bg-slate-50">
                      <Plus className="w-3 h-3" />
                      Trainers
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Business type */}
            <div className="p-3 border-t border-gray-100 flex-shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-300">Business Type</p>
              <div className="relative">
                <select
                  value={business.isGym ? "gym" : "generic"}
                  onChange={e => setIsGym(e.target.value === "gym")}
                  className="w-full appearance-none px-2.5 py-2 pr-6 rounded-lg text-xs font-medium outline-none border border-gray-200 bg-gray-50 text-gray-700">
                  {BUSINESS_TYPES.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
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
                {device === "mobile"  && <><Smartphone className="w-3 h-3" /> {deviceLabel}</>}
                {device === "tablet"  && <><Tablet     className="w-3 h-3" /> {deviceLabel}</>}
                {device === "desktop" && <><Monitor    className="w-3 h-3" /> {deviceLabel}</>}
              </div>

              {/* Device frame */}
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
                        {business.name.toLowerCase().replace(/\s+/g, "-")}.maptosite.com
                      </div>
                    </div>
                  </div>
                )}

                {/* Mobile status bar */}
                {device === "mobile" && (
                  <div className="h-7 flex items-center justify-center flex-shrink-0 bg-black">
                    <div className="w-20 h-4 rounded-full bg-[#1e1e1e]" />
                  </div>
                )}

                {/* Iframe — renders template at actual device viewport width */}
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
              ] as const).map(({ id, label, Icon }) => (
                <button key={id} onClick={() => setRightTab(id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
                  style={rightTab === id
                    ? { background: "#EDE9FE", color: "#6D28D9" }
                    : { color: "#94A3B8" }}>
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {rightTab === "design" && (
                <div className="space-y-6">

                  {/* Color Scheme */}
                  <section>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-3 text-slate-400">Color Scheme</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {colorSchemes.map(scheme => (
                        <button key={scheme.id}
                          onClick={() => setConfig(c => ({ ...c, colorScheme: scheme }))}
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

                  {/* Font */}
                  <section>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-3 text-slate-400">Font Style</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {([
                        { id: "sans"    as const, name: "Clean",    cls: ""           },
                        { id: "serif"   as const, name: "Elegant",  cls: "font-serif" },
                        { id: "rounded" as const, name: "Friendly", cls: "tracking-wide" },
                      ]).map(f => (
                        <button key={f.id}
                          onClick={() => setConfig(c => ({ ...c, fontStyle: f.id }))}
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

                  {/* Animations */}
                  <section>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-3 text-slate-400">Effects</p>
                    <button
                      onClick={() => setConfig(c => ({ ...c, animations: !c.animations }))}
                      className="w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all"
                      style={{
                        borderColor: config.animations ? "#7C3AED" : "#E2E8F0",
                        background: config.animations ? "#F5F3FF" : "#fff",
                        boxShadow: config.animations ? "0 0 0 3px rgba(124,58,237,0.12)" : "none",
                      }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                          style={{ background: config.animations ? "#7C3AED" : "#F1F5F9" }}>
                          <Sparkles className={cn("w-4 h-4", config.animations ? "text-white" : "text-slate-400")} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-semibold text-gray-800">Animations</p>
                          <p className="text-[10px] text-slate-400">Scroll & hover</p>
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

              {rightTab === "content" && (
                <div className="space-y-5">
                  <section>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-400">Contact Info</p>
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs">
                      <Phone className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                      <input
                        value={business.phone}
                        onChange={e => setBusiness(p => ({ ...p, phone: e.target.value }))}
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
                            onChange={e => setBusiness(p => ({ ...p, socials: { ...p.socials, [s.key]: e.target.value } }))}
                            placeholder="URL"
                            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-slate-300 text-xs" />
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-400">Pages & Content</p>
                    <div className="rounded-2xl overflow-hidden border border-gray-100">
                      <PageManager business={business} onChange={setBusiness} />
                    </div>
                  </section>
                </div>
              )}
            </div>

            {/* Disabled publish footer */}
            <div className="flex-shrink-0 p-4 border-t border-gray-100">
              <p className="text-center text-[10px] mb-3 text-slate-400">
                Test mode — publishing disabled
              </p>
              <button disabled
                className="w-full py-2.5 rounded-xl text-sm font-bold text-white opacity-30 cursor-not-allowed"
                style={{ background: "#7C3AED" }}>
                Publish Site
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
