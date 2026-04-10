"use client"

import { ColorScheme, SiteConfig, colorSchemes, layoutOptions, fontOptions } from "@/lib/mock-data"
import { Check, LayoutGrid, LayoutList, LayoutTemplate, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"

interface CustomizationOptionsProps {
  config: SiteConfig
  onConfigChange: (config: SiteConfig) => void
}

const layoutIcons = {
  "layout-grid": LayoutGrid,
  "layout-list": LayoutList,
  "layout-template": LayoutTemplate,
}

export function CustomizationOptions({ config, onConfigChange }: CustomizationOptionsProps) {
  return (
    <div className="space-y-6">
      {/* Color Scheme */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-foreground/80">Color Scheme</h3>
        <div className="grid grid-cols-2 gap-2">
          {colorSchemes.map((scheme) => (
            <button
              key={scheme.id}
              onClick={() => onConfigChange({ ...config, colorScheme: scheme })}
              className={cn(
                "relative p-3 rounded-xl border-2 transition-all text-left",
                config.colorScheme.id === scheme.id
                  ? "border-primary shadow-md"
                  : "border-transparent hover:border-border bg-muted/50"
              )}
            >
              {config.colorScheme.id === scheme.id && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <div className="flex items-center gap-1.5 mb-2">
                <div
                  className="w-4 h-4 rounded-full border border-black/10"
                  style={{ backgroundColor: scheme.primary }}
                />
                <div
                  className="w-4 h-4 rounded-full border border-black/10"
                  style={{ backgroundColor: scheme.secondary }}
                />
                <div
                  className="w-4 h-4 rounded-full border border-black/10"
                  style={{ backgroundColor: scheme.accent }}
                />
              </div>
              <span className="text-xs font-medium">{scheme.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Layout Style */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-foreground/80">Layout Style</h3>
        <div className="space-y-2">
          {layoutOptions.map((layout) => {
            const Icon = layoutIcons[layout.icon as keyof typeof layoutIcons]
            return (
              <button
                key={layout.id}
                onClick={() => onConfigChange({ ...config, layout: layout.id })}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left",
                  config.layout === layout.id
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:border-border bg-muted/50"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    config.layout === layout.id ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{layout.name}</p>
                  <p className="text-xs text-muted-foreground">{layout.description}</p>
                </div>
                {config.layout === layout.id && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Font Style */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-foreground/80">Font Style</h3>
        <div className="grid grid-cols-3 gap-2">
          {fontOptions.map((font) => (
            <button
              key={font.id}
              onClick={() => onConfigChange({ ...config, fontStyle: font.id })}
              className={cn(
                "p-3 rounded-xl border-2 transition-all text-center",
                config.fontStyle === font.id
                  ? "border-primary bg-primary/5"
                  : "border-transparent hover:border-border bg-muted/50"
              )}
            >
              <p
                className={cn(
                  "text-lg font-semibold mb-1",
                  font.id === "serif" && "font-serif",
                  font.id === "rounded" && "tracking-wide"
                )}
              >
                Aa
              </p>
              <p className="text-xs font-medium">{font.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Animations Toggle */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-foreground/80">Effects</h3>
        <div
          className={cn(
            "flex items-center justify-between p-4 rounded-xl border-2 transition-all",
            config.animations ? "border-primary/30 bg-primary/5" : "border-transparent bg-muted/50"
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                config.animations ? "bg-primary text-primary-foreground" : "bg-muted"
              )}
            >
              <Sparkles className={cn("w-5 h-5", config.animations && "animate-pulse")} />
            </div>
            <div>
              <p className="font-medium text-sm">Animations</p>
              <p className="text-xs text-muted-foreground">Smooth scroll & hover effects</p>
            </div>
          </div>
          <Switch
            checked={config.animations}
            onCheckedChange={(checked) => onConfigChange({ ...config, animations: checked })}
          />
        </div>
      </div>
    </div>
  )
}
