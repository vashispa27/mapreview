"use client"

import { useState, useEffect } from "react"
import { BusinessData, SiteConfig } from "@/lib/mock-data"
import { CustomizationOptions } from "./customization-options"
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
  X
} from "lucide-react"
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

            {/* Business Preview */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <h3 className="font-semibold truncate">{business.name}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {business.category}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium">{business.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({business.totalReviews} reviews)
                </span>
              </div>
            </div>

            {/* Customization Options */}
            <CustomizationOptions config={config} onConfigChange={onConfigChange} />

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
                    <span className="text-sm font-medium">dashlinkapp.com/site/</span>
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
    </>
  )
}
