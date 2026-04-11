"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SiteConfig, layoutOptions } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { 
  LayoutGrid, 
  LayoutList, 
  LayoutTemplate, 
  Sparkles, 
  Zap, 
  Palette,
  Check,
  Lock,
  Wand2
} from "lucide-react"

interface TemplateSelectorModalProps {
  config: SiteConfig
  onConfigChange: (config: SiteConfig) => void
}

const layoutIcons = {
  "layout-grid": LayoutGrid,
  "layout-list": LayoutList,
  "layout-template": LayoutTemplate,
  "sparkles": Sparkles,
  "zap": Zap,
  "palette": Palette,
}

// Template preview thumbnails - abstract representations
const templatePreviews: Record<string, { gradient: string; pattern: string }> = {
  modern: {
    gradient: "from-emerald-500 to-teal-600",
    pattern: "Modern grid with bold hero",
  },
  classic: {
    gradient: "from-amber-500 to-orange-600",
    pattern: "Traditional centered layout",
  },
  minimal: {
    gradient: "from-slate-400 to-slate-600",
    pattern: "Clean whitespace design",
  },
  elegant: {
    gradient: "from-rose-400 to-pink-600",
    pattern: "Luxury serif typography",
  },
  bold: {
    gradient: "from-violet-500 to-purple-700",
    pattern: "Dynamic asymmetric layout",
  },
  studio: {
    gradient: "from-cyan-500 to-blue-600",
    pattern: "Creative portfolio style",
  },
}

export function TemplateSelectorModal({ config, onConfigChange }: TemplateSelectorModalProps) {
  const [open, setOpen] = useState(false)
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)

  const handleSelectTemplate = (layoutId: SiteConfig["layout"]) => {
    onConfigChange({ ...config, layout: layoutId })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2 h-12">
          <Wand2 className="w-4 h-4" />
          Choose Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Choose a Template</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Select a template that best represents your business. Premium templates unlock with Pro plan.
          </p>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {layoutOptions.map((layout) => {
              const Icon = layoutIcons[layout.icon as keyof typeof layoutIcons]
              const preview = templatePreviews[layout.id]
              const isSelected = config.layout === layout.id
              const isHovered = hoveredTemplate === layout.id
              
              return (
                <button
                  key={layout.id}
                  onClick={() => handleSelectTemplate(layout.id)}
                  onMouseEnter={() => setHoveredTemplate(layout.id)}
                  onMouseLeave={() => setHoveredTemplate(null)}
                  className={cn(
                    "group relative rounded-xl border-2 overflow-hidden transition-all duration-300 text-left",
                    isSelected 
                      ? "border-primary ring-2 ring-primary/20" 
                      : "border-border hover:border-primary/50",
                    isHovered && !isSelected && "shadow-lg scale-[1.02]"
                  )}
                >
                  {/* Template Preview */}
                  <div className={cn(
                    "h-32 relative bg-gradient-to-br",
                    preview.gradient
                  )}>
                    {/* Abstract layout representation */}
                    <div className="absolute inset-4 flex flex-col gap-2">
                      {layout.id === "modern" && (
                        <>
                          <div className="h-8 w-full bg-white/30 rounded-lg" />
                          <div className="flex-1 grid grid-cols-3 gap-1.5">
                            <div className="bg-white/20 rounded" />
                            <div className="bg-white/20 rounded" />
                            <div className="bg-white/20 rounded" />
                          </div>
                        </>
                      )}
                      {layout.id === "classic" && (
                        <>
                          <div className="h-6 w-1/2 mx-auto bg-white/30 rounded" />
                          <div className="flex-1 flex flex-col gap-1.5 items-center">
                            <div className="h-8 w-3/4 bg-white/20 rounded" />
                            <div className="h-4 w-1/2 bg-white/20 rounded" />
                          </div>
                        </>
                      )}
                      {layout.id === "minimal" && (
                        <>
                          <div className="h-4 w-16 bg-white/30 rounded" />
                          <div className="flex-1 flex items-center">
                            <div className="h-12 w-3/4 bg-white/20 rounded" />
                          </div>
                        </>
                      )}
                      {layout.id === "elegant" && (
                        <>
                          <div className="h-10 w-full bg-white/20 rounded-lg flex items-center justify-center">
                            <div className="h-3 w-20 bg-white/40 rounded" />
                          </div>
                          <div className="flex-1 flex gap-2">
                            <div className="flex-1 bg-white/15 rounded border border-white/20" />
                            <div className="w-8 bg-white/15 rounded" />
                          </div>
                        </>
                      )}
                      {layout.id === "bold" && (
                        <>
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <div className="bg-white/30 rounded-xl row-span-2" />
                            <div className="bg-white/20 rounded-lg" />
                            <div className="bg-white/20 rounded-lg" />
                          </div>
                        </>
                      )}
                      {layout.id === "studio" && (
                        <>
                          <div className="h-4 w-12 bg-white/40 rounded-full" />
                          <div className="flex-1 flex gap-2">
                            <div className="flex-1 bg-white/20 rounded-2xl" />
                            <div className="w-12 flex flex-col gap-1.5">
                              <div className="flex-1 bg-white/15 rounded-lg" />
                              <div className="flex-1 bg-white/15 rounded-lg" />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {/* Selected checkmark */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    
                    {/* Premium badge */}
                    {layout.isPremium && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="bg-black/60 text-white border-0 gap-1 text-xs">
                          <Lock className="w-3 h-3" />
                          Pro
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {/* Template Info */}
                  <div className="p-3 bg-card">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="font-semibold text-sm">{layout.name}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">{layout.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
        
        <div className="border-t pt-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Currently using: <span className="font-medium text-foreground capitalize">{config.layout}</span>
          </p>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
