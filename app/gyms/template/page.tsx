"use client"

import { useState, useEffect, useRef } from "react"
import {
  SiteConfig, colorSchemes, layoutOptions,
} from "@/lib/mock-data"
import { GYM_BUSINESS, GYM_CONFIG } from "@/lib/gym-data"
import { PageManager } from "@/components/page-manager"
import { SiteTemplate } from "@/components/site-template"
import {
  Monitor, Tablet, Smartphone, Sparkles, ArrowRight,
  LayoutGrid, Paintbrush, ArrowLeft, Phone, Plus, Check,
  MapPin, Dumbbell,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { track } from "@/lib/analytics"

// ─── Template thumbnail ───────────────────────────────────────────────────────
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
  glass:        { header: "#7c3aed", hero: "#070b14", card: "#0d1220", dark: true },
  retro:        { header: "#c9a84c", hero: "#2C1A0E", card: "#FBF6EE" },
  coastal:      { header: "#0891b2", hero: "#06b6d4", card: "#e0f7fa" },
}

function TemplateThumbnail({ id, active }: { id: string; active: boolean }) {
  const t = TEMPLATE_ACCENTS[id] ?? { header: "#16a34a", hero: "#22c55e", card: "#f0fdf4" }
  return (
    <div
      className={cn(
        "relative flex-shrink-0 w-[58px] h-[38px] rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 select-none",
        active ? "border-green-600 scale-[1.08]" : "border-gray-200 hover:border-gray-300 hover:scale-[1.03]",
      )}
      style={{
        background: t.dark ? "#0d0d0d" : "#f8f8f8",
        boxShadow: active
          ? "0 0 0 3px rgba(22,163,74,0.2), 0 4px 12px rgba(22,163,74,0.15)"
          : "0 1px 3px rgba(0,0,0,0.08)",
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

export default function GymTemplatePage() {
  const [business, setBusiness] = useState(GYM_BUSINESS)
  const [config, setConfig] = useState<SiteConfig>(GYM_CONFIG)
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">("desktop")
  const [rightTab, setRightTab] = useState<"design" | "content">("design")
  const [mobileTab, setMobileTab] = useState<"preview" | "design" | "content">("preview")

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const iframeHeight = device === "mobile" ? 812 : device === "tablet" ? 1024 : 900

  useEffect(() => { track("gym_template_viewed") }, [])

  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "CANVAS_UPDATE", business, config }, "*",
    )
  }, [business, config])

  const pages = business.pages ?? {}
  const enabledPages = [
    { key: "home",     label: "Home" },
    ...(pages.services  ? [{ key: "services",  label: "Memberships" }] : []),
    ...(pages.products  ? [{ key: "products",  label: "Products" }] : []),
    ...((pages as any).trainers ? [{ key: "trainers", label: "Trainers" }] : []),
    ...(pages.contact   ? [{ key: "contact",   label: "Contact" }] : []),
  ]

  const deviceLabel = { mobile: "390 px", tablet: "768 px", desktop: "Full width" }[device]

  return (
    <>
      {/* ── Mobile Builder ─────────────────────────────────────────── */}
      <div className="md:hidden flex flex-col h-screen bg-white text-gray-900 overflow-hidden">

        {/* Top bar */}
        <div className="flex-shrink-0 h-12 flex items-center gap-3 px-4 border-b bg-white border-gray-200 shadow-sm z-30">
          <Link href="/gyms" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center bg-green-600">
              <Dumbbell className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight text-gray-900">MapToSite</span>
          </Link>
          <div className="ml-auto">
            <Link
              href="/gyms"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
              style={{ background: "#16a34a" }}
            >
              Get Mine <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Main area */}
        <div className="flex-1 overflow-hidden relative">
          {/* Preview */}
          <div className={cn("absolute inset-0 overflow-auto", mobileTab !== "preview" && "invisible")}>
            <SiteTemplate business={business} config={config} isPreview={false} />
          </div>

          {/* Floating pill */}
          {mobileTab === "preview" && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
              <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200"
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}>
                {([
                  { id: "design"  as const, label: "Style",   Icon: Paintbrush },
                  { id: "content" as const, label: "Content", Icon: LayoutGrid  },
                ] as const).map(({ id, label, Icon }, i) => (
                  <button key={id}
                    onClick={() => setMobileTab(id)}
                    className={cn("flex flex-col items-center gap-1 px-3.5 py-3 active:bg-green-50 transition-colors", i > 0 && "border-t border-gray-100")}
                    style={{ color: "#16a34a" }}>
                    <Icon className="w-[18px] h-[18px]" />
                    <span className="text-[9px] font-bold">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Edit panel overlay */}
          {mobileTab !== "preview" && (
            <div className="absolute inset-0 bg-white flex flex-col z-10">
              <div className="flex-shrink-0 flex items-center gap-3 px-3 h-11 border-b border-gray-200 bg-white">
                <button onClick={() => setMobileTab("preview")}
                  className="flex items-center gap-1 text-xs font-semibold text-gray-500 shrink-0">
                  <ArrowLeft className="w-4 h-4" /> Preview
                </button>
                <div className="flex-1 flex justify-center">
                  <div className="flex gap-0.5 p-0.5 bg-gray-100 rounded-lg">
                    {([{ id: "design" as const, label: "Style" }, { id: "content" as const, label: "Content" }] as const).map(({ id, label }) => (
                      <button key={id} onClick={() => setMobileTab(id)}
                        className="px-3 py-1 rounded-md text-[11px] font-semibold transition-all"
                        style={mobileTab === id
                          ? { background: "#fff", color: "#16a34a", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }
                          : { color: "#94A3B8" }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {mobileTab === "design" && <DesignPanel config={config} setConfig={setConfig} accent="green" />}
                {mobileTab === "content" && <GymContentPanel business={business} setBusiness={setBusiness} pages={pages} />}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Desktop Builder ─────────────────────────────────────────── */}
      <div className="hidden md:flex h-screen flex-col overflow-hidden bg-[#F0F2F7] text-gray-900">

        {/* TOP BAR */}
        <div className="flex-shrink-0 h-[52px] flex items-center gap-3 px-4 border-b bg-white border-gray-200 shadow-sm">

          {/* Logo */}
          <Link href="/gyms" className="flex items-center gap-2 flex-shrink-0 mr-1">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm bg-green-600">
              <Dumbbell className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight text-gray-900">MapToSite</span>
          </Link>

          <div className="w-px h-5 flex-shrink-0 bg-gray-200" />

          {/* Badge */}
          <div className="flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
            style={{ background: "#DCFCE7", color: "#15803D", border: "1px solid #BBF7D0" }}>
            Gym Website Templates
          </div>

          {/* Device Toggle */}
          <div className="flex-shrink-0 flex items-center gap-0.5 p-1 rounded-lg bg-slate-100">
            {([
              { d: "mobile"  as const, Icon: Smartphone },
              { d: "tablet"  as const, Icon: Tablet     },
              { d: "desktop" as const, Icon: Monitor    },
            ]).map(({ d, Icon }) => (
              <button key={d} onClick={() => setDevice(d)} title={d}
                className="p-1.5 rounded-md transition-all"
                style={device === d ? { background: "#DCFCE7", color: "#16a34a" } : { color: "#94A3B8" }}>
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* CTA */}
          <Link
            href="/gyms"
            onClick={() => track("gym_template_cta_clicked")}
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90"
            style={{ background: "#16a34a" }}
          >
            <MapPin className="w-4 h-4" />
            Generate My Gym Website
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* MAIN AREA */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT PANEL */}
          <div className="flex-shrink-0 w-48 flex flex-col overflow-y-auto border-r bg-white border-gray-200">
            <div className="p-3 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5 text-slate-400">Pages</p>
              <div className="space-y-0.5">
                {enabledPages.map(page => (
                  <div key={page.key}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium"
                    style={page.key === "home"
                      ? { background: "#DCFCE7", color: "#15803D" }
                      : { color: "#64748B" }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: page.key === "home" ? "#16a34a" : "#CBD5E1" }} />
                    {page.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Gym locked indicator */}
            <div className="p-3 border-t border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold"
                style={{ background: "#DCFCE7", color: "#15803D" }}>
                <Dumbbell className="w-3.5 h-3.5 flex-shrink-0" />
                Gym / Fitness
              </div>
            </div>
          </div>

          {/* CANVAS */}
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

                {device === "mobile" && (
                  <div className="h-7 flex items-center justify-center flex-shrink-0 bg-black">
                    <div className="w-20 h-4 rounded-full bg-[#1e1e1e]" />
                  </div>
                )}

                <iframe
                  ref={iframeRef}
                  src="/preview/canvas"
                  className="w-full border-0 block"
                  style={{ height: iframeHeight }}
                  title="Gym Website Preview"
                  onLoad={() => {
                    iframeRef.current?.contentWindow?.postMessage(
                      { type: "CANVAS_UPDATE", business, config }, "*",
                    )
                  }}
                />
              </div>

              <div className="h-12" />
            </div>
          </div>

          {/* RIGHT PANEL */}
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
                    ? { background: "#DCFCE7", color: "#15803D" }
                    : { color: "#94A3B8" }}>
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {rightTab === "design" && <DesignPanel config={config} setConfig={setConfig} accent="green" />}
              {rightTab === "content" && <GymContentPanel business={business} setBusiness={setBusiness} pages={pages} />}
            </div>

            {/* CTA footer */}
            <div className="flex-shrink-0 p-4 border-t border-gray-100 space-y-2">
              <p className="text-center text-[10px] text-slate-400">
                Like this template? Build yours in 60 seconds.
              </p>
              <Link
                href="/gyms"
                onClick={() => track("gym_template_cta_clicked")}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white shadow-md hover:opacity-90 transition-opacity"
                style={{ background: "#16a34a" }}
              >
                Generate My Gym Website
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Shared design panel ──────────────────────────────────────────────────────
function DesignPanel({
  config,
  setConfig,
  accent = "green",
}: {
  config: SiteConfig
  setConfig: React.Dispatch<React.SetStateAction<SiteConfig>>
  accent?: string
}) {
  const activeColor = accent === "green" ? "#16a34a" : "#7C3AED"
  const activeBg    = accent === "green" ? "#DCFCE7"  : "#EDE9FE"
  const ringColor   = accent === "green" ? "rgba(22,163,74,0.15)" : "rgba(124,58,237,0.12)"

  return (
    <div className="space-y-6">
      {/* Template picker */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3 text-slate-400">Template</p>
        <div className="grid grid-cols-3 gap-2">
          {layoutOptions.map(opt => {
            const active = config.layout === opt.id
            return (
              <button key={opt.id}
                onClick={() => setConfig(c => ({ ...c, layout: opt.id as SiteConfig["layout"] }))}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all"
                style={{
                  borderColor: active ? activeColor : "#E2E8F0",
                  background: active ? activeBg : "#fff",
                  boxShadow: active ? `0 0 0 3px ${ringColor}` : "none",
                }}>
                <TemplateThumbnail id={opt.id} active={active} />
                <p className="text-[9px] font-bold leading-tight text-center truncate w-full"
                  style={{ color: active ? activeColor : "#64748B" }}>{opt.name}</p>
              </button>
            )
          })}
        </div>
      </section>

      {/* Theme */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3 text-slate-400">Theme</p>
        <div className="grid grid-cols-2 gap-2">
          {(["light", "dark"] as const).map(t => (
            <button key={t}
              onClick={() => setConfig(c => ({ ...c, theme: t }))}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all capitalize"
              style={{
                borderColor: config.theme === t ? activeColor : "#E2E8F0",
                background: config.theme === t ? activeBg : t === "dark" ? "#111" : "#fff",
                color: config.theme === t ? activeColor : t === "dark" ? "#e0e0e0" : "#374151",
                boxShadow: config.theme === t ? `0 0 0 3px ${ringColor}` : "none",
              }}>
              {t === "light" ? "☀️ Light" : "🌙 Dark"}
            </button>
          ))}
        </div>
      </section>

      {/* Colors */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3 text-slate-400">Color Scheme</p>
        <div className="grid grid-cols-3 gap-1.5">
          {colorSchemes.map(scheme => (
            <button key={scheme.id}
              onClick={() => setConfig(c => ({ ...c, colorScheme: scheme }))}
              className="p-2.5 rounded-xl border-2 transition-all text-left"
              style={{
                borderColor: config.colorScheme.id === scheme.id ? activeColor : "#E2E8F0",
                background: config.colorScheme.id === scheme.id ? activeBg : "#fff",
                boxShadow: config.colorScheme.id === scheme.id ? `0 0 0 3px ${ringColor}` : "none",
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
            { id: "sans"    as const, name: "Clean",    cls: ""            },
            { id: "serif"   as const, name: "Elegant",  cls: "font-serif"  },
            { id: "rounded" as const, name: "Friendly", cls: "tracking-wide" },
          ]).map(f => (
            <button key={f.id}
              onClick={() => setConfig(c => ({ ...c, fontStyle: f.id }))}
              className="p-3 rounded-xl border-2 transition-all text-center"
              style={{
                borderColor: config.fontStyle === f.id ? activeColor : "#E2E8F0",
                background: config.fontStyle === f.id ? activeBg : "#fff",
                boxShadow: config.fontStyle === f.id ? `0 0 0 3px ${ringColor}` : "none",
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
            borderColor: config.animations ? activeColor : "#E2E8F0",
            background: config.animations ? activeBg : "#fff",
            boxShadow: config.animations ? `0 0 0 3px ${ringColor}` : "none",
          }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ background: config.animations ? activeColor : "#F1F5F9" }}>
              <Sparkles className={cn("w-4 h-4", config.animations ? "text-white" : "text-slate-400")} />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-gray-800">Animations</p>
              <p className="text-[10px] text-slate-400">Scroll & hover</p>
            </div>
          </div>
          <div className="relative w-10 h-5 rounded-full transition-all"
            style={{ background: config.animations ? activeColor : "#E2E8F0" }}>
            <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
              style={{ left: config.animations ? "calc(100% - 18px)" : "2px" }} />
          </div>
        </button>
      </section>
    </div>
  )
}

// ─── Gym-specific content panel ───────────────────────────────────────────────
function GymContentPanel({
  business,
  setBusiness,
  pages,
}: {
  business: typeof GYM_BUSINESS
  setBusiness: React.Dispatch<React.SetStateAction<typeof GYM_BUSINESS>>
  pages: Record<string, unknown>
}) {
  return (
    <div className="space-y-5">
      <section>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-400">Gym Name</p>
        <input
          value={business.name}
          onChange={e => setBusiness(p => ({ ...p, name: e.target.value }))}
          placeholder="Your gym name"
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none text-sm text-gray-800 placeholder-slate-300 focus:border-green-400"
        />
      </section>

      <section>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-400">Contact Info</p>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs">
          <Phone className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
          <input
            value={business.phone}
            onChange={e => setBusiness(p => ({ ...p, phone: e.target.value }))}
            placeholder="Phone number"
            className="flex-1 bg-transparent outline-none text-gray-800 placeholder-slate-300 text-xs"
          />
        </div>
      </section>

      <section>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-400">Social Links</p>
        <div className="space-y-1.5">
          {[
            { key: "instagram", label: "Instagram" },
            { key: "facebook",  label: "Facebook"  },
          ].map(s => (
            <div key={s.key}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs">
              <span className="w-16 flex-shrink-0 text-[10px] font-semibold text-slate-400">{s.label}</span>
              <input
                value={(business.socials as any)?.[s.key] || ""}
                onChange={e => setBusiness(p => ({ ...p, socials: { ...p.socials, [s.key]: e.target.value } }))}
                placeholder="URL"
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-slate-300 text-xs"
              />
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-400">Add Page</p>
        <div className="space-y-1">
          {([
            { key: "services", label: "Memberships", enabled: !!pages.services },
            { key: "products", label: "Products",    enabled: !!pages.products },
            { key: "contact",  label: "Contact",     enabled: !!pages.contact  },
            { key: "trainers", label: "Trainers",    enabled: !!(pages as any).trainers },
          ]).map(({ key, label, enabled }) => (
            <button key={key}
              onClick={() => !enabled && setBusiness(p => ({ ...p, pages: { ...p.pages, [key]: true } }))}
              disabled={enabled}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all"
              style={enabled
                ? { background: "#DCFCE7", color: "#15803D", cursor: "default" }
                : { color: "#64748B", border: "1px dashed #E2E8F0" }}>
              {enabled ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              {label}
              {enabled && <span className="ml-auto text-[10px] text-green-600">Active</span>}
            </button>
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
  )
}
