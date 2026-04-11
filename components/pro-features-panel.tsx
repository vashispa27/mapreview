"use client"

import { useState } from "react"
import { BusinessData, VideoTestimonial, MenuItem } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Video,
  UtensilsCrossed,
  Globe,
  Crown,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Play,
} from "lucide-react"

interface ProFeaturesPanelProps {
  business: BusinessData
  onBusinessChange: (business: BusinessData) => void
}

export function ProFeaturesPanel({ business, onBusinessChange }: ProFeaturesPanelProps) {
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [menuModalOpen, setMenuModalOpen] = useState(false)
  const [domainModalOpen, setDomainModalOpen] = useState(false)
  const [newDomain, setNewDomain] = useState(business.proFeatures?.customDomain?.customDomain || "")

  const proFeatures = business.proFeatures || {
    showVideoTestimonials: false,
    showMenu: false,
    videoTestimonials: [],
    menuItems: [],
    menuCategories: [],
    customDomain: { status: "not_configured" as const, sslEnabled: false },
  }

  const updateProFeatures = (updates: Partial<typeof proFeatures>) => {
    onBusinessChange({
      ...business,
      proFeatures: { ...proFeatures, ...updates },
    })
  }

  const getDomainStatusBadge = () => {
    const status = proFeatures.customDomain?.status || "not_configured"
    switch (status) {
      case "verified":
        return (
          <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="default" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive" className="bg-red-500/10 text-red-600 border-red-500/20">
            <AlertCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            Not Configured
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-4">
      {/* Pro Badge Header */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/20">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
          <Crown className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">Pro Features</p>
          <p className="text-xs text-muted-foreground">Premium tools for your site</p>
        </div>
      </div>

      {/* Video Testimonials */}
      <div className="space-y-2">
        <div
          className={cn(
            "flex items-center justify-between p-4 rounded-xl border-2 transition-all",
            proFeatures.showVideoTestimonials
              ? "border-primary/30 bg-primary/5"
              : "border-transparent bg-muted/50"
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                proFeatures.showVideoTestimonials
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <Video className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-sm">Video Testimonials</p>
              <p className="text-xs text-muted-foreground">
                {proFeatures.videoTestimonials?.length || 0} videos
              </p>
            </div>
          </div>
          <Switch
            checked={proFeatures.showVideoTestimonials}
            onCheckedChange={(checked) => updateProFeatures({ showVideoTestimonials: checked })}
          />
        </div>

        {proFeatures.showVideoTestimonials && (
          <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Manage Video Testimonials
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Video Testimonials</DialogTitle>
                <DialogDescription>
                  Add customer video testimonials to build trust and showcase real experiences.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {/* Video List */}
                <div className="space-y-3">
                  {proFeatures.videoTestimonials?.map((video, index) => (
                    <div
                      key={video.id}
                      className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 border"
                    >
                      <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="w-6 h-6 text-white" fill="white" />
                        </div>
                        <span className="absolute bottom-1 right-1 text-[10px] bg-black/70 text-white px-1 rounded">
                          {video.duration}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{video.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{video.title}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          const newVideos = proFeatures.videoTestimonials?.filter((_, i) => i !== index)
                          updateProFeatures({ videoTestimonials: newVideos })
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Add Video Form */}
                <div className="p-4 rounded-xl border-2 border-dashed border-muted-foreground/25 text-center">
                  <Video className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">
                    Paste a YouTube or Vimeo link to add a video testimonial
                  </p>
                  <div className="flex gap-2">
                    <Input placeholder="https://youtube.com/watch?v=..." className="flex-1" />
                    <Button size="sm">Add Video</Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Menu / Catalog */}
      <div className="space-y-2">
        <div
          className={cn(
            "flex items-center justify-between p-4 rounded-xl border-2 transition-all",
            proFeatures.showMenu
              ? "border-primary/30 bg-primary/5"
              : "border-transparent bg-muted/50"
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                proFeatures.showMenu ? "bg-primary text-primary-foreground" : "bg-muted"
              )}
            >
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-sm">Menu / Catalog</p>
              <p className="text-xs text-muted-foreground">
                {proFeatures.menuItems?.length || 0} items
              </p>
            </div>
          </div>
          <Switch
            checked={proFeatures.showMenu}
            onCheckedChange={(checked) => updateProFeatures({ showMenu: checked })}
          />
        </div>

        {proFeatures.showMenu && (
          <Dialog open={menuModalOpen} onOpenChange={setMenuModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Manage Menu Items
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Menu / Catalog</DialogTitle>
                <DialogDescription>
                  Add your products or menu items with prices and descriptions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2">
                  {proFeatures.menuCategories?.map((cat) => (
                    <Badge key={cat} variant="secondary" className="cursor-pointer hover:bg-primary/10">
                      {cat}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted gap-1">
                    <Plus className="w-3 h-3" />
                    Add Category
                  </Badge>
                </div>

                {/* Menu Items Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {proFeatures.menuItems?.map((item, index) => (
                    <div
                      key={item.id}
                      className="group relative p-3 rounded-xl bg-muted/50 border hover:border-primary/30 transition-all"
                    >
                      {item.featured && (
                        <Badge className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px]">
                          Featured
                        </Badge>
                      )}
                      {item.image && (
                        <div className="w-full h-24 rounded-lg overflow-hidden mb-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-primary shrink-0">{item.price}</span>
                      </div>
                      <Badge variant="secondary" className="mt-2 text-[10px]">
                        {item.category}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          const newItems = proFeatures.menuItems?.filter((_, i) => i !== index)
                          updateProFeatures({ menuItems: newItems })
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}

                  {/* Add Item Card */}
                  <div className="p-4 rounded-xl border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center text-center min-h-[180px] cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                    <Plus className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Add Item</p>
                    <p className="text-xs text-muted-foreground">Click to add a menu item</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Custom Domain */}
      <div className="space-y-2">
        <Dialog open={domainModalOpen} onOpenChange={setDomainModalOpen}>
          <DialogTrigger asChild>
            <div
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-primary/30",
                proFeatures.customDomain?.status === "verified"
                  ? "border-green-500/30 bg-green-500/5"
                  : "border-transparent bg-muted/50"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                    proFeatures.customDomain?.status === "verified"
                      ? "bg-green-500 text-white"
                      : "bg-muted"
                  )}
                >
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-sm">Custom Domain</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                    {proFeatures.customDomain?.customDomain || "Not configured"}
                  </p>
                </div>
              </div>
              {getDomainStatusBadge()}
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Custom Domain</DialogTitle>
              <DialogDescription>
                Connect your own domain to make your site more professional.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* Current Status */}
              <div className="p-4 rounded-xl bg-muted/50 border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  {getDomainStatusBadge()}
                </div>
                {proFeatures.customDomain?.customDomain && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Domain</span>
                    <span className="text-sm text-muted-foreground">
                      {proFeatures.customDomain.customDomain}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">SSL Certificate</span>
                  <Badge
                    variant={proFeatures.customDomain?.sslEnabled ? "default" : "secondary"}
                    className={proFeatures.customDomain?.sslEnabled ? "bg-green-500/10 text-green-600" : ""}
                  >
                    {proFeatures.customDomain?.sslEnabled ? "Enabled" : "Pending"}
                  </Badge>
                </div>
              </div>

              {/* Domain Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Domain</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="yourbusiness.com"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => {
                      updateProFeatures({
                        customDomain: {
                          customDomain: newDomain,
                          status: "pending",
                          sslEnabled: false,
                        },
                      })
                    }}
                  >
                    Connect
                  </Button>
                </div>
              </div>

              {/* DNS Instructions */}
              {proFeatures.customDomain?.status === "pending" && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">DNS Configuration Required</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add the following DNS records to your domain provider:
                  </p>
                  <div className="bg-background rounded-lg p-3 font-mono text-xs space-y-1">
                    <p>
                      <span className="text-muted-foreground">Type:</span> CNAME
                    </p>
                    <p>
                      <span className="text-muted-foreground">Name:</span> @
                    </p>
                    <p>
                      <span className="text-muted-foreground">Value:</span> cname.maptosite.com
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <ExternalLink className="w-3 h-3" />
                    View Full Instructions
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
