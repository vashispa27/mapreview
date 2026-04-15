"use client"

import { ColorScheme, SiteConfig, colorSchemes, layoutOptions, fontOptions } from "@/lib/mock-data"
import { Check, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CustomizationOptionsProps {
  config: SiteConfig
  onConfigChange: (config: SiteConfig) => void
}

export function CustomizationOptions({ config, onConfigChange }: CustomizationOptionsProps) {
  const selectedLayout = layoutOptions.find((l) => l.id === config.layout)

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
                <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: scheme.primary }} />
                <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: scheme.secondary }} />
                <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: scheme.accent }} />
              </div>
              <span className="text-xs font-medium">{scheme.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Layout Style — Dropdown */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-foreground/80">Layout Style</h3>
        <Select
          value={config.layout}
          onValueChange={(value) =>
            onConfigChange({ ...config, layout: value as SiteConfig["layout"] })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              <span className="flex items-center gap-2">
                <span>{selectedLayout?.name}</span>
                {selectedLayout?.isPro && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-400 to-orange-500 text-white tracking-wide">
                    PRO
                  </span>
                )}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {layoutOptions.map((layout) => (
              <SelectItem key={layout.id} value={layout.id}>
                <div className="flex items-center justify-between gap-6 w-full">
                  <div>
                    <p className="font-medium text-sm">{layout.name}</p>
                    <p className="text-xs text-muted-foreground">{layout.description}</p>
                  </div>
                  {layout.isPro && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-400 to-orange-500 text-white tracking-wide">
                      PRO
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
