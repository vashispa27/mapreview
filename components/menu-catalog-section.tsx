"use client"

import { useState } from "react"
import { MenuItem, ColorScheme } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

interface MenuCatalogSectionProps {
  items: MenuItem[]
  categories: string[]
  colorScheme: ColorScheme
  layout: string
  animations: boolean
  isDark: boolean
  layoutStyles: {
    sectionGap: string
    headingSize: string
    cardStyle: string
  }
}

export function MenuCatalogSection({
  items,
  categories,
  colorScheme,
  layout,
  animations,
  isDark,
  layoutStyles,
}: MenuCatalogSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All")

  if (!items || items.length === 0) return null

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory)

  const featuredItems = items.filter((item) => item.featured)

  return (
    <section className={layoutStyles.sectionGap}>
      {layout === "elegant" && (
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs tracking-[0.3em] uppercase" style={{ color: colorScheme.muted }}>
            Our Menu
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
      )}

      <div className={cn(
        "flex items-center justify-between mb-8",
        layout === "elegant" && "justify-center flex-col gap-4",
        layout === "bold" && "justify-center flex-col gap-2"
      )}>
        <h2
          className={cn(
            "font-bold",
            layoutStyles.headingSize,
            layout === "elegant" && "font-serif text-center",
            layout === "bold" && "uppercase tracking-tight text-center",
            layout === "studio" && "font-light"
          )}
        >
          {layout === "bold" ? "OUR MENU" : layout === "elegant" ? "Culinary Delights" : "Menu"}
        </h2>
      </div>

      {/* Category Filter */}
      <div className={cn(
        "flex flex-wrap gap-2 mb-8",
        layout === "elegant" && "justify-center",
        layout === "bold" && "justify-center"
      )}>
        <button
          onClick={() => setActiveCategory("All")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-all",
            layoutStyles.cardStyle,
            activeCategory === "All"
              ? "text-white"
              : "bg-muted/50 hover:bg-muted"
          )}
          style={activeCategory === "All" ? { backgroundColor: colorScheme.primary } : undefined}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all",
              layoutStyles.cardStyle,
              activeCategory === category
                ? "text-white"
                : "bg-muted/50 hover:bg-muted"
            )}
            style={activeCategory === category ? { backgroundColor: colorScheme.primary } : undefined}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Featured Items (Only show when "All" is selected) */}
      {activeCategory === "All" && featuredItems.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5" style={{ color: colorScheme.primary }} />
            <h3 className={cn(
              "font-semibold text-lg",
              layout === "elegant" && "font-serif"
            )}>
              Chef&apos;s Recommendations
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredItems.slice(0, 4).map((item, index) => (
              <motion.div
                key={item.id}
                initial={animations ? { opacity: 0, y: 20 } : undefined}
                whileInView={animations ? { opacity: 1, y: 0 } : undefined}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "group relative overflow-hidden",
                  layoutStyles.cardStyle,
                  layout === "elegant" && "border",
                  animations && "transition-all duration-300 hover:shadow-lg"
                )}
                style={{
                  backgroundColor: isDark ? "#1e293b" : "#fff",
                }}
              >
                {item.image && (
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className={cn(
                        "w-full h-full object-cover",
                        animations && "transition-transform duration-500 group-hover:scale-110"
                      )}
                    />
                    <div
                      className="absolute top-3 right-3 px-2 py-1 text-xs font-bold text-white rounded-full"
                      style={{ backgroundColor: colorScheme.primary }}
                    >
                      Featured
                    </div>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className={cn(
                      "font-semibold",
                      layout === "elegant" && "font-serif"
                    )}>
                      {item.name}
                    </h4>
                    <span
                      className="text-lg font-bold shrink-0"
                      style={{ color: colorScheme.primary }}
                    >
                      {item.price}
                    </span>
                  </div>
                  <p className="text-sm line-clamp-2" style={{ color: colorScheme.muted }}>
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Menu Grid */}
      <div className={cn(
        "grid gap-4",
        layout === "minimal" && "grid-cols-1 md:grid-cols-2",
        layout === "modern" && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        layout === "classic" && "grid-cols-1 md:grid-cols-2",
        layout === "elegant" && "grid-cols-1 md:grid-cols-2 gap-6",
        layout === "bold" && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        layout === "studio" && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}>
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={animations ? { opacity: 0, y: 20 } : undefined}
            whileInView={animations ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true }}
            transition={{ delay: (index % 6) * 0.05 }}
            className={cn(
              "group flex gap-4 p-4",
              layoutStyles.cardStyle,
              layout === "elegant" && "border",
              layout === "bold" && "shadow-md hover:shadow-xl",
              animations && "transition-all duration-300 hover:scale-[1.02]"
            )}
            style={{
              backgroundColor: isDark ? "#1e293b" : "#fff",
            }}
          >
            {item.image && (
              <div className={cn(
                "w-24 h-24 shrink-0 overflow-hidden",
                layoutStyles.cardStyle
              )}>
                <img
                  src={item.image}
                  alt={item.name}
                  className={cn(
                    "w-full h-full object-cover",
                    animations && "transition-transform duration-500 group-hover:scale-110"
                  )}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className={cn(
                  "font-semibold truncate",
                  layout === "elegant" && "font-serif"
                )}>
                  {item.name}
                </h4>
                <span
                  className="text-lg font-bold shrink-0"
                  style={{ color: colorScheme.primary }}
                >
                  {item.price}
                </span>
              </div>
              <p className="text-sm line-clamp-2 mb-2" style={{ color: colorScheme.muted }}>
                {item.description}
              </p>
              <span
                className={cn(
                  "inline-block px-2 py-0.5 text-xs font-medium",
                  layoutStyles.cardStyle
                )}
                style={{ backgroundColor: colorScheme.accent + "30", color: colorScheme.primary }}
              >
                {item.category}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
