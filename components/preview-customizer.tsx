"use client"

import { useState, useEffect, useRef } from "react"
import { BusinessData, SiteConfig } from "@/lib/mock-data"
import { compressImageToBlob } from "@/lib/compress-image"
import { CustomizationOptions } from "./customization-options"
import { PageManager } from "./page-manager"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Star,
  Globe,
  AlertCircle,
  X,
  UtensilsCrossed,
  Upload,
  Paintbrush,
  LayoutGrid,
  QrCode,
  Download,
  Phone,
  ChevronDown,
} from "lucide-react"

const BUSINESS_TYPES = [
  { id: "generic", label: "General Business", isGym: false },
  { id: "gym", label: "Gym / Fitness", isGym: true },
  { id: "salon", label: "Salon / Spa", isGym: false },
  { id: "restaurant", label: "Restaurant / Café", isGym: false },
]
import { motion, AnimatePresence } from "framer-motion"

interface PreviewCustomizerProps {
  business: BusinessData
  config: SiteConfig
  onConfigChange: (config: SiteConfig) => void
  onBusinessChange?: (business: BusinessData) => void
  onPublish: (slug: string) => void
  isPublishing?: boolean
  isPublished?: boolean
  siteSlug?: string | null
  siteId?: string
}

export function PreviewCustomizer({
  business,
  config,
  onConfigChange,
  onBusinessChange,
  onPublish,
  isPublishing,
  isPublished,
  siteSlug,
  siteId,
}: PreviewCustomizerProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [copied, setCopied] = useState(false)
  const [widgetsOpen, setWidgetsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"design" | "pages">("design")
  const [qrOpen, setQrOpen] = useState(false)
  const [isUploadingMenu, setIsUploadingMenu] = useState(false)
  const menuFileRef = useRef<HTMLInputElement>(null)

  const qrUrl = siteId ? `${typeof window !== "undefined" ? window.location.origin : ""}/site/${siteId}` : null
  const qrImageUrl = qrUrl ? `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=12&data=${encodeURIComponent(qrUrl)}` : null

  const setSocial = (key: string, val: string) => {
    if (!onBusinessChange) return
    onBusinessChange({ ...business, socials: { ...business.socials, [key]: val } })
  }
  const setPhone = (val: string) => {
    if (!onBusinessChange) return
    onBusinessChange({ ...business, phone: val })
  }

  const handleMenuUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onBusinessChange) return
    
    setIsUploadingMenu(true)
    try {
      const { blob } = await compressImageToBlob(file, 1200, 1600, 0.85)
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: blob
      })
      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()
      onBusinessChange({ ...business, menuImage: data.url })
    } catch (err) {
      console.error("Menu upload failed:", err)
    } finally {
      setIsUploadingMenu(false)
    }
  }

  const handleMenuRemove = () => {
    if (onBusinessChange) onBusinessChange({ ...business, menuImage: undefined })
  }

  // Slug Selection State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [slug, setSlug] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [slugError, setSlugError] = useState("")

  // Pre-fill from existing published slug, otherwise derive from business name
  useEffect(() => {
    if (siteSlug) {
      setSlug(siteSlug)
      setIsAvailable(true) // own slug is always available to reuse
    } else if (business.name && !slug) {
      setSlug(business.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""))
    }
  }, [siteSlug, business.name])

  // Check slug availability as user types
  useEffect(() => {
    if (slug.length < 3) {
      setIsAvailable(null)
      return
    }

    // If the slug matches the site's own published slug, no check needed
    if (siteSlug && slug === siteSlug) {
      setIsAvailable(true)
      setSlugError("")
      return
    }

    const timer = setTimeout(async () => {
      setIsChecking(true)
      try {
        const params = new URLSearchParams({ slug })
        if (siteId) params.set("siteId", siteId)
        const res = await fetch(`/api/sites/check-slug?${params}`)
        if (!res.ok) {
          setIsAvailable(false)
          return
        }
        const data = await res.json()
        setIsAvailable(data.available)
        setSlugError(data.error || "")
      } catch (err) {
        console.error("Failed to check slug:", err)
        setIsAvailable(false)
      } finally {
        setIsChecking(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [slug, siteSlug, siteId])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFinalPublish = () => {
    if (isAvailable) {
      onPublish(slug)
    }
  }

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full z-50 flex transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-[360px]"
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 bg-card border border-border rounded-l-lg p-2 shadow-lg hover:bg-accent transition"
        >
          {isSidebarOpen ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>

        {/* Sidebar Content */}
        <Card className="w-[360px] h-full rounded-none border-l shadow-2xl overflow-y-auto">
          <div className="p-5 space-y-5">
            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-lg">Customize Your Site</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Personalize colors, layout, and style.
              </p>
            </div>

            {/* Business Type Selector */}
            {onBusinessChange && (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Business Type</p>
                <div className="relative">
                  <select
                    value={business.isGym ? "gym" : "generic"}
                    onChange={(e) => {
                      const isGym = e.target.value === "gym"
                      onBusinessChange({
                        ...business,
                        isGym,
                        showTrainersSection: isGym,
                        trainers: isGym && (!business.trainers || business.trainers.length === 0)
                          ? [
                              { id: "trainer-1", name: "Trainer Name", specialization: "Strength & Conditioning", experience: "5+ years experience", bio: "Certified personal trainer. Tap to update details.", photo: undefined },
                              { id: "trainer-2", name: "Trainer Name", specialization: "Yoga & Flexibility", experience: "3+ years experience", bio: "Experienced yoga instructor. Tap to update details.", photo: undefined },
                            ]
                          : business.trainers,
                        services: isGym && (!business.services || business.services.length === 0)
                          ? [
                              { id: "gym-monthly", title: "Monthly Membership", price: "₹1,499 / month", description: "Full access to gym floor, all equipment, and cardio zone.", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" },
                              { id: "gym-quarterly", title: "Quarterly Plan", price: "₹3,999 / 3 months", description: "Save more with our 3-month plan. Includes group classes like yoga and Zumba.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80" },
                              { id: "gym-halfyearly", title: "Half-Yearly Plan", price: "₹6,999 / 6 months", description: "Our most popular plan. Full access, all group classes, and 2 personal training sessions.", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80" },
                              { id: "gym-annual", title: "Annual Membership", price: "₹11,999 / year", description: "Best value. Unlimited access to everything — gym floor, all classes, and 12 PT sessions.", image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80" },
                            ]
                          : business.services,
                        pages: { ...business.pages, services: true, products: isGym ? false : business.pages?.products, trainers: isGym ? true : false },
                      })
                    }}
                    className="w-full appearance-none px-3 py-2.5 pr-9 rounded-xl border border-border bg-background text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition cursor-pointer"
                  >
                    {BUSINESS_TYPES.map((type) => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            )}

            {/* Tab Bar */}
            <div className="flex rounded-xl bg-muted p-1 gap-1">
              <button
                onClick={() => setActiveTab("design")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "design" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Paintbrush className="w-3.5 h-3.5" />
                Design
              </button>
              <button
                onClick={() => setActiveTab("pages")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "pages" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Pages
              </button>
            </div>

            {/* Design Tab */}
            {activeTab === "design" && (
              <>
                <CustomizationOptions config={config} onConfigChange={onConfigChange} />

                {/* Add Widgets */}
                {onBusinessChange && (
                  <div className="pt-2 border-t">
                    <button
                      onClick={() => setWidgetsOpen(true)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-border text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all"
                    >
                      <span className="text-base leading-none">＋</span>
                      Add Widgets
                    </button>
                    <input ref={menuFileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleMenuUpload} />
                  </div>
                )}
              </>
            )}

            {/* Pages Tab */}
            {activeTab === "pages" && onBusinessChange && (
              <>
                {/* Business Info — always editable */}
                <div className="rounded-xl border border-border p-3.5 space-y-2.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Business Info</p>
                  <div className="flex items-center gap-2.5 bg-muted/30 rounded-lg border border-border px-3 py-2 focus-within:border-primary transition">
                    <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <input value={business.phone ?? ""} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="flex-1 text-sm outline-none bg-transparent" />
                  </div>
                  {[
                    { key: "instagram", label: "IG", placeholder: "Instagram URL" },
                    { key: "facebook",  label: "fb", placeholder: "Facebook URL" },
                    { key: "twitter",   label: "𝕏",  placeholder: "Twitter / X URL" },
                    { key: "linkedin",  label: "in", placeholder: "LinkedIn URL" },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key} className="flex items-center gap-2.5 bg-muted/30 rounded-lg border border-border px-3 py-2 focus-within:border-primary transition">
                      <span className="text-xs font-bold text-muted-foreground w-5 text-center flex-shrink-0">{label}</span>
                      <input
                        value={(business.socials as any)?.[key] ?? ""}
                        onChange={(e) => setSocial(key, e.target.value)}
                        placeholder={placeholder}
                        className="flex-1 text-sm outline-none bg-transparent"
                      />
                    </div>
                  ))}
                </div>

                <PageManager business={business} onChange={onBusinessChange} />
              </>
            )}
            {activeTab === "pages" && !onBusinessChange && (
              <p className="text-sm text-muted-foreground text-center py-4">Page editing not available.</p>
            )}

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t">
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={() => setIsModalOpen(true)}
                disabled={isPublishing}
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    Publish Site
                  </>
                )}
              </Button>

              {siteId && (
                <Button variant="outline" className="w-full gap-2" onClick={() => setQrOpen(true)}>
                  <QrCode className="w-4 h-4" />
                  Get QR Code
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Preview Link
                  </>
                )}
              </Button>
            </div>

            {/* Info */}
            <div className="text-xs text-muted-foreground space-y-2 pt-4 border-t">
              <p>
                <strong>Preview Mode:</strong> Changes are saved automatically.
                Click Publish when ready to go live.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Publish Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-card border shadow-2xl rounded-2xl w-full max-w-md p-6 relative"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Choose your site URL</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This will be your permanent public address.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">maptosite.app/site/</span>
                    <Input 
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                      placeholder="my-business-name"
                      className={`flex-1 h-10 ${isAvailable === false ? 'border-destructive' : isAvailable === true ? 'border-green-500' : ''}`}
                    />
                  </div>
                  
                  {/* Status indicators */}
                  <div className="h-5 flex items-center gap-2 px-1">
                    {isChecking && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Checking availability...
                      </div>
                    )}
                    {!isChecking && isAvailable === true && (
                      <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                        <Check className="w-3.5 h-3.5" />
                        URL is available!
                      </div>
                    )}
                    {!isChecking && isAvailable === false && (
                      <div className="flex items-center gap-1.5 text-xs text-destructive font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {slugError || "This URL is already taken."}
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  className="w-full h-12" 
                  disabled={!isAvailable || isPublishing}
                  onClick={handleFinalPublish}
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Finalizing...
                    </>
                  ) : (
                    "Confirm & Go Live"
                  )}
                </Button>
                
                <p className="text-[10px] text-center text-muted-foreground">
                  By clicking confirm, your site will be accessible to the public.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Widgets Modal */}
      <AnimatePresence>
        {widgetsOpen && (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-card border shadow-2xl rounded-2xl w-full max-w-sm p-5 relative"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base">Widgets</h3>
                <button onClick={() => setWidgetsOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Floater Widget */}
              <div className="rounded-xl border-2 border-border overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <UtensilsCrossed className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">Menu Floater</p>
                    <p className="text-xs text-muted-foreground">A floating button visitors tap to view your menu</p>
                  </div>
                  {business.menuImage ? (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">Active</span>
                  ) : isUploadingMenu ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  ) : null}
                </div>

                {/* Configured state — thumbnail */}
                {business.menuImage && (
                  <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
                    <div className="relative rounded-lg overflow-hidden border border-border">
                      <img src={business.menuImage} alt="Menu preview" className="w-full max-h-32 object-cover" />
                      {isUploadingMenu && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Loader2 className="w-6 h-6 animate-spin text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => !isUploadingMenu && menuFileRef.current?.click()}
                        disabled={isUploadingMenu}
                        className="flex-1 py-2 text-xs font-medium rounded-lg border border-border hover:bg-muted transition disabled:opacity-50"
                      >
                        Replace
                      </button>
                      <button
                        onClick={handleMenuRemove}
                        disabled={isUploadingMenu}
                        className="flex-1 py-2 text-xs font-medium rounded-lg border border-destructive/40 text-destructive hover:bg-destructive/5 transition disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {/* Unconfigured state — upload prompt */}
                {!business.menuImage && (
                  <div className="border-t border-border p-4">
                    <button
                      onClick={() => !isUploadingMenu && menuFileRef.current?.click()}
                      disabled={isUploadingMenu}
                      className="w-full border-2 border-dashed border-border rounded-xl py-5 flex flex-col items-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all disabled:opacity-50"
                    >
                      {isUploadingMenu ? (
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      ) : (
                        <Upload className="w-5 h-5 text-muted-foreground" />
                      )}
                      <p className="text-sm font-medium">{isUploadingMenu ? "Uploading Menu..." : "Upload menu image or PDF"}</p>
                      <p className="text-xs text-muted-foreground">{isUploadingMenu ? "Please wait" : "Tap to select a file"}</p>
                    </button>
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4">
                More widgets coming soon
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <AnimatePresence>
        {qrOpen && qrImageUrl && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-card border shadow-2xl rounded-2xl w-full max-w-xs p-6 relative text-center"
            >
              <button onClick={() => setQrOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>

              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <QrCode className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-base mb-1">QR Code</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Scan to open your site. Works even if you change the URL later.
              </p>

              <div className="bg-white rounded-xl p-3 inline-block border mx-auto mb-4">
                <img src={qrImageUrl} alt="QR Code" width={200} height={200} className="block" />
              </div>

              <a
                href={qrImageUrl + "&download=1"}
                download={`${business.name}-qr.png`}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: "hsl(var(--primary))" }}
              >
                <Download className="w-4 h-4" />
                Download PNG
              </a>

              <p className="text-[10px] text-muted-foreground mt-3 break-all opacity-60">{qrUrl}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
