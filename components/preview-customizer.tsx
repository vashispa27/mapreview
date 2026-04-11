"use client"

import { useState } from "react"
import { BusinessData, SiteConfig } from "@/lib/mock-data"
import { CustomizationOptions } from "./customization-options"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Star,
} from "lucide-react"

interface PreviewCustomizerProps {
  business: BusinessData
  config: SiteConfig
  onConfigChange: (config: SiteConfig) => void
  onBusinessChange?: (business: BusinessData) => void
  onPublish: () => void
  isPublishing?: boolean
}

export function PreviewCustomizer({
  business,
  config,
  onConfigChange,
  onBusinessChange,
  onPublish,
  isPublishing,
}: PreviewCustomizerProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
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
          <CustomizationOptions 
            config={config} 
            onConfigChange={onConfigChange} 
            business={business}
            onBusinessChange={onBusinessChange}
          />

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t">
            <Button
              className="w-full gap-2"
              size="lg"
              onClick={onPublish}
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
            <p>
              Your site will be available at a unique URL that you can share
              with customers.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
