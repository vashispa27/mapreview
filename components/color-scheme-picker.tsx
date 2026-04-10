"use client"

import { ColorScheme, colorSchemes } from "@/lib/mock-data"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface ColorSchemePickerProps {
  selected: ColorScheme
  onSelect: (scheme: ColorScheme) => void
}

export function ColorSchemePicker({ selected, onSelect }: ColorSchemePickerProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm text-foreground/80">Color Scheme</h3>
      <div className="grid grid-cols-2 gap-3">
        {colorSchemes.map((scheme) => (
          <button
            key={scheme.id}
            onClick={() => onSelect(scheme)}
            className={cn(
              "relative p-3 rounded-xl border-2 transition-all text-left",
              selected.id === scheme.id
                ? "border-primary shadow-md"
                : "border-transparent hover:border-border"
            )}
            style={{ backgroundColor: scheme.background }}
          >
            {selected.id === scheme.id && (
              <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: scheme.primary }}
              />
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: scheme.secondary }}
              />
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: scheme.accent }}
              />
            </div>
            <span
              className="text-sm font-medium"
              style={{ color: scheme.text }}
            >
              {scheme.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
