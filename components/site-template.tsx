"use client"

import { BusinessData, SiteConfig } from "@/lib/mock-data"
import { Star, MapPin, Phone, Clock, Globe, Check, ChevronRight, X, Instagram, Facebook, Twitter, Play, Camera } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"
import { PhotoManagerModal } from "./photo-manager-modal"
import { HeroBackgroundModal } from "./hero-background-modal"
import { AnimatedReviews } from "./animated-reviews"
import { InlineTextArea, InlineInput } from "./inline-editor"
import { VideoTestimonialsSection } from "./video-testimonials-section"
import { MenuCatalogSection } from "./menu-catalog-section"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface SiteTemplateProps {
  business: BusinessData
  config: SiteConfig
  isPreview?: boolean
  onBusinessChange?: (business: BusinessData) => void
}

// Animation wrapper that respects the animations toggle
function AnimatedDiv({
  children,
  animate,
  className,
  ...props
}: {
  children: React.ReactNode
  animate: boolean
  className?: string
} & Omit<HTMLMotionProps<"div">, "animate">) {
  if (!animate) {
    return <div className={className}>{children}</div>
  }
  return (
    <motion.div className={className} {...props}>
      {children}
    </motion.div>
  )
}

export function SiteTemplate({ business, config, isPreview = false, onBusinessChange }: SiteTemplateProps) {
  const { colorScheme, layout, fontStyle, animations } = config
  const isDark = colorScheme.id === "midnight"

  const handleRemovePhoto = (indexToRemove: number) => {
    if (onBusinessChange) {
      const newPhotos = business.photos.filter((_, i) => i !== indexToRemove)
      onBusinessChange({ ...business, photos: newPhotos })
    }
  }

  const handleUpdatePhotos = (newPhotos: any[]) => {
    if (onBusinessChange) {
      onBusinessChange({ ...business, photos: newPhotos })
    }
  }

  const handleUpdateDescription = (val: string) => {
    if (onBusinessChange) onBusinessChange({ ...business, description: val })
  }

  const handleUpdateFeature = (index: number, val: string) => {
    if (onBusinessChange) {
      const newFeatures = [...business.features]
      newFeatures[index] = val
      onBusinessChange({ ...business, features: newFeatures })
    }
  }

  const fontClass = {
    sans: "font-sans",
    serif: "font-serif",
    rounded: "font-sans tracking-wide",
  }[fontStyle]

  // Layout-specific styles - COMPLETELY REDESIGNED
  const layoutStyles = {
    modern: {
      sectionGap: "mb-24",
      headingSize: "text-3xl md:text-5xl",
      cardStyle: "rounded-3xl",
      heroHeight: "min-h-[85vh]",
    },
    classic: {
      sectionGap: "mb-20",
      headingSize: "text-3xl md:text-4xl",
      cardStyle: "rounded-2xl",
      heroHeight: "min-h-[70vh]",
    },
    minimal: {
      sectionGap: "mb-16",
      headingSize: "text-2xl md:text-3xl",
      cardStyle: "rounded-xl",
      heroHeight: "min-h-[60vh]",
    },
    elegant: {
      sectionGap: "mb-28",
      headingSize: "text-4xl md:text-6xl",
      cardStyle: "rounded-none",
      heroHeight: "min-h-[90vh]",
    },
    bold: {
      sectionGap: "mb-20",
      headingSize: "text-5xl md:text-7xl",
      cardStyle: "rounded-[2rem]",
      heroHeight: "min-h-[95vh]",
    },
    studio: {
      sectionGap: "mb-24",
      headingSize: "text-3xl md:text-5xl",
      cardStyle: "rounded-[1.5rem]",
      heroHeight: "min-h-[80vh]",
    },
  }[layout]

  const fadeInUp = animations
    ? {
      initial: { opacity: 0, y: 40 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-100px" },
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    }
    : {}

  // Compute darker/lighter variants of primary for gradients
  const primaryWithOpacity = (opacity: number) => {
    const hex = colorScheme.primary.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  return (
    <div
      className={cn("min-h-screen", fontClass)}
      style={{
        backgroundColor: colorScheme.background,
        color: colorScheme.text,
      }}
    >
      {/* ========== HERO SECTION - COMPLETELY REDESIGNED ========== */}
      <header className={cn("relative overflow-hidden", layoutStyles.heroHeight)}>
        {isPreview && onBusinessChange && (
          <div className="absolute top-6 right-6 z-30">
            <HeroBackgroundModal
              currentHero={business.heroImage || business.photos[0]?.url || ""}
              photos={business.photos}
              availablePhotos={business.availablePhotos}
              onChange={(url) => onBusinessChange({ ...business, heroImage: url })}
            />
          </div>
        )}

        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={business.heroImage || business.photos[0]?.url || "/placeholder.jpg"}
            alt={business.name}
            className={cn(
              "w-full h-full object-cover",
              animations && "transition-transform duration-[1.5s]",
              layout === "bold" && "scale-110"
            )}
          />
        </div>

        {/* Overlay - Template Specific */}
        <div
          className={cn(
            "absolute inset-0",
            // Modern: Gradient from bottom with color tint
            layout === "modern" && "bg-gradient-to-t from-black via-black/60 to-black/20",
            // Classic: Elegant vignette
            layout === "classic" && "bg-gradient-to-t from-black/90 via-black/40 to-transparent",
            // Minimal: Clean dark overlay
            layout === "minimal" && "bg-black/70",
            // Elegant: Side gradient for text legibility
            layout === "elegant" && "bg-gradient-to-r from-black/90 via-black/70 to-transparent",
            // Bold: Dramatic bottom fade like PowerHouse
            layout === "bold" && "bg-gradient-to-t from-black via-black/30 to-transparent",
            // Studio: Modern asymmetric gradient
            layout === "studio" && "bg-gradient-to-br from-black/80 via-black/50 to-transparent"
          )}
        />

        {/* Decorative Elements */}
        {layout === "bold" && (
          <>
            {/* Top accent bar */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ backgroundColor: colorScheme.primary }}
              initial={animations ? { scaleX: 0, transformOrigin: "left" } : {}}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            {/* Floating stat badges like PowerHouse */}
            <div className="absolute bottom-32 right-8 md:right-16 flex gap-3 z-20">
              <motion.div
                initial={animations ? { opacity: 0, y: 20 } : {}}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="px-5 py-3 rounded-xl border-2 backdrop-blur-sm"
                style={{ borderColor: colorScheme.primary, backgroundColor: "rgba(0,0,0,0.5)" }}
              >
                <div className="text-2xl font-bold text-white">{business.rating}</div>
                <div className="text-xs uppercase tracking-wider" style={{ color: colorScheme.primary }}>Rating</div>
              </motion.div>
              <motion.div
                initial={animations ? { opacity: 0, y: 20 } : {}}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="px-5 py-3 rounded-xl backdrop-blur-sm"
                style={{ backgroundColor: colorScheme.primary }}
              >
                <div className="text-2xl font-bold text-white">{business.totalReviews}+</div>
                <div className="text-xs uppercase tracking-wider text-white/80">Reviews</div>
              </motion.div>
            </div>
          </>
        )}

        {layout === "elegant" && (
          <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-20">
            <div className="flex items-center gap-4">
              <div className="w-16 h-px bg-white/40" />
              <span className="text-xs tracking-[0.4em] uppercase text-white/60">{business.category}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs tracking-[0.4em] uppercase text-white/60">{business.priceLevel}</span>
              <div className="w-16 h-px bg-white/40" />
            </div>
          </div>
        )}

        {layout === "studio" && (
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent z-10" />
        )}

        {/* Hero Content */}
        <div className={cn(
          "relative z-20 h-full flex flex-col px-6 md:px-12 lg:px-20",
          layout === "modern" && "justify-end pb-20",
          layout === "classic" && "justify-end pb-16",
          layout === "minimal" && "justify-center items-center text-center",
          layout === "elegant" && "justify-center items-start max-w-4xl",
          layout === "bold" && "justify-end pb-24",
          layout === "studio" && "justify-end pb-16"
        )}>
          <AnimatedDiv
            animate={animations}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className={cn(
              layout === "minimal" && "max-w-2xl",
              layout === "bold" && "max-w-4xl"
            )}
          >
            {/* Category Badge */}
            {(layout === "modern" || layout === "studio") && (
              <motion.span
                initial={animations ? { opacity: 0, x: -20 } : {}}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className={cn(
                  "inline-block px-4 py-1.5 text-sm font-medium mb-6",
                  layout === "modern" && "rounded-full",
                  layout === "studio" && "rounded-full backdrop-blur-md bg-white/10 border border-white/20"
                )}
                style={{
                  backgroundColor: layout === "modern" ? colorScheme.primary : undefined,
                  color: "#fff"
                }}
              >
                {business.category}
              </motion.span>
            )}

            {/* Bold Pre-title */}
            {layout === "bold" && (
              <motion.div
                initial={animations ? { width: 0 } : {}}
                animate={{ width: "5rem" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="h-1 mb-6 rounded-full"
                style={{ backgroundColor: colorScheme.primary }}
              />
            )}

            {/* Main Title */}
            <h1
              className={cn(
                "font-bold text-white leading-[0.95]",
                layout === "modern" && "text-5xl md:text-7xl lg:text-8xl tracking-tight",
                layout === "classic" && "text-4xl md:text-6xl lg:text-7xl",
                layout === "minimal" && "text-3xl md:text-5xl lg:text-6xl font-medium",
                layout === "elegant" && "text-5xl md:text-7xl lg:text-8xl font-serif italic tracking-tight",
                layout === "bold" && "text-6xl md:text-8xl lg:text-9xl uppercase tracking-tighter",
                layout === "studio" && "text-4xl md:text-6xl lg:text-7xl font-light tracking-tight"
              )}
            >
              {layout === "bold" ? (
                <>
                  {business.name.split(' ').map((word, i) => (
                    <span key={i} className={i === 1 ? "" : ""} style={i === 1 ? { color: colorScheme.primary } : {}}>
                      {word}{' '}
                    </span>
                  ))}
                </>
              ) : layout === "elegant" ? (
                <>
                  {business.name.split(' ').slice(0, -1).join(' ')}{' '}
                  <span style={{ color: colorScheme.primary }}>{business.name.split(' ').slice(-1)}</span>
                </>
              ) : (
                business.name
              )}
            </h1>

            {/* Subtitle / Address */}
            {layout === "elegant" && (
              <p className="text-xl md:text-2xl text-white/60 mt-6 font-serif">
                {business.address.split(',')[1]?.trim() || business.category}
              </p>
            )}

            {/* Description for Minimal */}
            {layout === "minimal" && (
              <p className="text-white/70 text-lg mt-4 max-w-xl">
                {business.description.slice(0, 120)}...
              </p>
            )}

            {/* Rating Row */}
            <div className={cn(
              "flex flex-wrap items-center gap-4 mt-6 text-white/90",
              layout === "minimal" && "justify-center",
              layout === "bold" && "hidden" // Bold shows stats in floating badges
            )}>
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-5 h-5",
                      layout === "elegant" && "w-4 h-4"
                    )}
                    fill={i < Math.floor(business.rating) ? "#fbbf24" : "transparent"}
                    stroke={i < Math.floor(business.rating) ? "#fbbf24" : "currentColor"}
                  />
                ))}
                <span className="ml-2 font-semibold text-lg">{business.rating}</span>
                <span className="text-white/60">({business.totalReviews} reviews)</span>
              </div>
              {layout !== "elegant" && (
                <span className="text-white/60">{business.priceLevel}</span>
              )}
            </div>

            {/* CTA Buttons for some layouts */}
            {(layout === "modern" || layout === "studio") && (
              <div className="flex flex-wrap gap-4 mt-8">
                <a
                  href={`tel:${business.phone}`}
                  className={cn(
                    "px-6 py-3 font-semibold text-white transition-all",
                    layout === "modern" && "rounded-full hover:scale-105",
                    layout === "studio" && "rounded-xl hover:brightness-110"
                  )}
                  style={{ backgroundColor: colorScheme.primary }}
                >
                  Book Now
                </a>
                <a
                  href="#gallery"
                  className={cn(
                    "px-6 py-3 font-semibold border-2 border-white/30 text-white backdrop-blur-sm transition-all hover:border-white/60",
                    layout === "modern" && "rounded-full",
                    layout === "studio" && "rounded-xl"
                  )}
                >
                  View Gallery
                </a>
              </div>
            )}
          </AnimatedDiv>
        </div>

        {/* Scroll indicator for some layouts */}
        {(layout === "elegant" || layout === "bold") && animations && (
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5"
            >
              <div className="w-1.5 h-3 rounded-full bg-white/60" />
            </motion.div>
          </motion.div>
        )}
      </header>

      {/* ========== QUICK INFO BAR - REDESIGNED ========== */}
      <div
        className={cn(
          "sticky top-0 z-40 backdrop-blur-md border-b transition-all",
          layout === "bold" && "border-none",
          layout === "studio" && "mx-4 mt-4 rounded-2xl border shadow-lg",
          layout === "elegant" && "border-t border-b"
        )}
        style={{
          backgroundColor: layout === "bold"
            ? colorScheme.primary
            : isDark ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.9)",
          borderColor: isDark ? "rgba(51, 65, 85, 0.5)" : "rgba(229, 231, 235, 0.5)",
        }}
      >
        <div className={cn(
          "max-w-7xl mx-auto px-4 md:px-8 flex flex-wrap items-center justify-between gap-4 py-4",
          layout === "elegant" && "py-5"
        )}>
          <div className="flex flex-wrap items-center gap-6">
            <a
              href={`tel:${business.phone}`}
              className="flex items-center gap-2 font-medium transition-opacity hover:opacity-80"
              style={{ color: layout === "bold" ? "#fff" : colorScheme.primary }}
            >
              <Phone className="w-4 h-4" />
              <span>{business.phone}</span>
            </a>
            <div
              className="hidden sm:flex items-center gap-2 text-sm"
              style={{ color: layout === "bold" ? "rgba(255,255,255,0.8)" : colorScheme.muted }}
            >
              <MapPin className="w-4 h-4" />
              <span>{business.address}</span>
            </div>
          </div>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "px-5 py-2.5 font-semibold transition-all",
              layout === "modern" && "rounded-full hover:scale-105",
              layout === "classic" && "rounded-xl hover:shadow-lg",
              layout === "minimal" && "rounded-lg",
              layout === "elegant" && "rounded-none border-2 hover:bg-black/5",
              layout === "bold" && "rounded-xl bg-white hover:bg-gray-100",
              layout === "studio" && "rounded-xl hover:shadow-lg"
            )}
            style={{
              backgroundColor: layout === "bold" ? "#fff" : layout === "elegant" ? "transparent" : colorScheme.primary,
              color: layout === "bold" ? colorScheme.primary : layout === "elegant" ? colorScheme.primary : "#fff",
              borderColor: layout === "elegant" ? colorScheme.primary : undefined
            }}
          >
            Get Directions
          </a>
        </div>
      </div>

      {/* ========== MAIN CONTENT ========== */}
      <main className={cn(
        "max-w-7xl mx-auto px-4 md:px-8",
        layout === "minimal" ? "py-12" : "py-16 md:py-24",
        layout === "studio" && "py-16"
      )}>

        {/* ========== ABOUT SECTION ========== */}
        <AnimatedDiv animate={animations} {...fadeInUp} className={layoutStyles.sectionGap}>
          {/* Section Label */}
          {(layout === "elegant" || layout === "bold" || layout === "studio") && (
            <div className={cn(
              "flex items-center gap-4 mb-6",
              layout === "elegant" && "justify-center",
              layout === "bold" && "justify-start"
            )}>
              {layout === "elegant" ? (
                <>
                  <div className="h-px flex-1 max-w-[100px]" style={{ backgroundColor: colorScheme.primary + "40" }} />
                  <span className="text-xs tracking-[0.3em] uppercase" style={{ color: colorScheme.primary }}>Our Story</span>
                  <div className="h-px flex-1 max-w-[100px]" style={{ backgroundColor: colorScheme.primary + "40" }} />
                </>
              ) : (
                <span className="text-xs tracking-[0.25em] uppercase font-semibold" style={{ color: colorScheme.primary }}>
                  {layout === "bold" ? "WHO WE ARE" : "About Us"}
                </span>
              )}
            </div>
          )}

          <h2 className={cn(
            "font-bold mb-8",
            layoutStyles.headingSize,
            layout === "modern" && "tracking-tight",
            layout === "elegant" && "font-serif text-center italic",
            layout === "bold" && "uppercase tracking-tighter",
            layout === "studio" && "font-light"
          )}>
            {layout === "minimal" ? "About" : layout === "elegant" ? "Our Story" : layout === "bold" ? "THE EXPERIENCE" : "About Us"}
          </h2>

          <div className={cn(
            layout === "elegant" && "max-w-3xl mx-auto text-center",
            layout === "bold" && "max-w-4xl"
          )}>
            <InlineTextArea
              value={business.description}
              onChange={handleUpdateDescription}
              disabled={!isPreview || !onBusinessChange}
              className={cn(
                "leading-relaxed",
                layout === "modern" && "text-lg md:text-xl",
                layout === "classic" && "text-lg",
                layout === "minimal" && "text-base",
                layout === "elegant" && "text-xl md:text-2xl font-serif leading-relaxed",
                layout === "bold" && "text-xl md:text-2xl font-medium",
                layout === "studio" && "text-lg md:text-xl"
              )}
              style={{ color: colorScheme.muted }}
            />
          </div>
        </AnimatedDiv>

        {/* ========== FEATURES SECTION - BENTO GRID STYLE ========== */}
        <AnimatedDiv animate={animations} {...fadeInUp} className={layoutStyles.sectionGap}>
          {/* Section Label */}
          {(layout === "elegant" || layout === "bold" || layout === "studio") && (
            <div className={cn(
              "flex items-center gap-4 mb-6",
              layout === "elegant" && "justify-center"
            )}>
              {layout === "elegant" ? (
                <>
                  <div className="h-px flex-1 max-w-[100px]" style={{ backgroundColor: colorScheme.primary + "40" }} />
                  <span className="text-xs tracking-[0.3em] uppercase" style={{ color: colorScheme.primary }}>Services</span>
                  <div className="h-px flex-1 max-w-[100px]" style={{ backgroundColor: colorScheme.primary + "40" }} />
                </>
              ) : (
                <span className="text-xs tracking-[0.25em] uppercase font-semibold" style={{ color: colorScheme.primary }}>
                  {layout === "bold" ? "WHAT WE OFFER" : "Features"}
                </span>
              )}
            </div>
          )}

          <h2 className={cn(
            "font-bold mb-10",
            layoutStyles.headingSize,
            layout === "modern" && "tracking-tight",
            layout === "elegant" && "font-serif text-center italic",
            layout === "bold" && "uppercase tracking-tighter",
            layout === "studio" && "font-light"
          )}>
            {layout === "minimal" ? "Features" : layout === "elegant" ? "What We Offer" : layout === "bold" ? "THE EXPERIENCE" : "What We Offer"}
          </h2>

          {/* Bento Grid Layout - Different for each template */}
          <div className={cn(
            "grid gap-4 md:gap-6",
            // Modern: 2x2 grid with varying sizes
            layout === "modern" && "grid-cols-2 lg:grid-cols-4",
            // Classic: Simple 4-col
            layout === "classic" && "grid-cols-2 lg:grid-cols-4",
            // Minimal: 2-col simple
            layout === "minimal" && "grid-cols-1 sm:grid-cols-2",
            // Elegant: 2x2 with large cards
            layout === "elegant" && "grid-cols-2 lg:grid-cols-4 gap-8",
            // Bold: Bento-style asymmetric (like VibeFlow)
            layout === "bold" && "grid-cols-2 lg:grid-cols-3 gap-6",
            // Studio: Cards with hover effects
            layout === "studio" && "grid-cols-2 lg:grid-cols-4 gap-5"
          )}>
            {[...(business.features || []), "Edit Feature...", "Edit Feature...", "Edit Feature...", "Edit Feature..."]
              .slice(0, layout === "bold" ? 4 : 4)
              .map((feature, index) => (
                <AnimatedDiv
                  key={index}
                  animate={animations}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "relative overflow-hidden group transition-all duration-300",
                    layoutStyles.cardStyle,
                    // Modern: Clean cards with hover lift
                    layout === "modern" && "p-6 md:p-8 hover:shadow-xl hover:-translate-y-1",
                    // Classic: Bordered cards
                    layout === "classic" && "p-6 border hover:shadow-lg",
                    // Minimal: Simple flat cards
                    layout === "minimal" && "p-5 hover:bg-opacity-80",
                    // Elegant: Luxury cards with border
                    layout === "elegant" && "p-8 border text-center hover:border-2",
                    // Bold: Bento cards with accent
                    layout === "bold" && cn(
                      "p-6 md:p-8",
                      index === 0 && "col-span-2 row-span-2", // First card is large
                      index === 1 && "border-l-4",
                    ),
                    // Studio: Gradient cards
                    layout === "studio" && "p-6 hover:scale-[1.02] hover:shadow-xl"
                  )}
                  style={{
                    backgroundColor: isDark ? "#1e293b" : 
                      layout === "bold" && index === 1 ? colorScheme.primary : 
                      layout === "modern" ? "#fff" :
                      colorScheme.accent + "15",
                    borderColor: layout === "elegant" ? colorScheme.primary + "30" : 
                      layout === "bold" && index === 1 ? colorScheme.primary : 
                      layout === "classic" ? (isDark ? "#334155" : "#e5e7eb") : undefined,
                    boxShadow: layout === "modern" && !isDark ? "0 4px 6px -1px rgba(0,0,0,0.05)" : undefined
                  }}
                >
                  {/* Icon Container */}
                  <div className={cn(
                    "flex items-center justify-center mb-4",
                    layout === "elegant" && "w-16 h-16 mx-auto rounded-full",
                    layout === "bold" && "w-12 h-12 rounded-2xl",
                    layout === "studio" && "w-12 h-12 rounded-xl",
                    layout === "modern" && "w-12 h-12 rounded-2xl"
                  )}
                    style={{
                      backgroundColor: layout === "elegant" || layout === "studio" || layout === "modern"
                        ? colorScheme.primary + "15"
                        : layout === "bold" && index === 1 ? "rgba(255,255,255,0.2)" : colorScheme.primary + "15"
                    }}
                  >
                    <Check
                      className={cn(
                        "w-6 h-6",
                        layout === "bold" && index === 0 && "w-8 h-8"
                      )}
                      style={{
                        color: layout === "bold" && index === 1 ? "#fff" : colorScheme.primary
                      }}
                    />
                  </div>

                  {/* Feature Text */}
                  <InlineTextArea
                    value={feature}
                    rows={layout === "bold" && index === 0 ? 4 : 3}
                    onChange={(v) => handleUpdateFeature(index, v)}
                    disabled={!isPreview || !onBusinessChange}
                    className={cn(
                      "leading-relaxed w-full",
                      layout === "minimal" && "text-base",
                      layout === "modern" && "text-lg font-semibold",
                      layout === "classic" && "text-lg font-medium",
                      layout === "elegant" && "text-lg font-serif text-center",
                      layout === "bold" && cn(
                        "font-bold",
                        index === 0 ? "text-xl md:text-2xl" : "text-lg",
                        index === 1 && "text-white"
                      ),
                      layout === "studio" && "text-lg font-medium"
                    )}
                  />

                  {/* Decorative accent line for Bold layout */}
                  {layout === "bold" && index === 0 && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1"
                      style={{ backgroundColor: colorScheme.primary }}
                    />
                  )}
                </AnimatedDiv>
              ))}
          </div>
        </AnimatedDiv>

        {/* ========== MENU / CATALOG (Pro Feature) ========== */}
        {business.proFeatures?.showMenu && business.proFeatures.menuItems && (
          <AnimatedDiv animate={animations} {...fadeInUp}>
            <MenuCatalogSection
              items={business.proFeatures.menuItems}
              categories={business.proFeatures.menuCategories || []}
              colorScheme={colorScheme}
              layout={layout}
              animations={animations}
              isDark={isDark}
              layoutStyles={layoutStyles}
            />
          </AnimatedDiv>
        )}

        {/* ========== GALLERY SECTION - REDESIGNED BENTO STYLE ========== */}
        <AnimatedDiv animate={animations} {...fadeInUp} className={layoutStyles.sectionGap} id="gallery">
          {/* Section Label */}
          {(layout === "elegant" || layout === "bold" || layout === "studio") && (
            <div className={cn(
              "flex items-center gap-4 mb-6",
              layout === "elegant" && "justify-center"
            )}>
              {layout === "elegant" ? (
                <>
                  <div className="h-px flex-1 max-w-[100px]" style={{ backgroundColor: colorScheme.primary + "40" }} />
                  <span className="text-xs tracking-[0.3em] uppercase" style={{ color: colorScheme.primary }}>Gallery</span>
                  <div className="h-px flex-1 max-w-[100px]" style={{ backgroundColor: colorScheme.primary + "40" }} />
                </>
              ) : (
                <span className="text-xs tracking-[0.25em] uppercase font-semibold" style={{ color: colorScheme.primary }}>
                  {layout === "bold" ? "SOCIAL FEED" : "Gallery"}
                </span>
              )}
            </div>
          )}

          <div className={cn(
            "flex items-center justify-between mb-8",
            layout === "elegant" && "flex-col gap-4"
          )}>
            <h2 className={cn(
              "font-bold",
              layoutStyles.headingSize,
              layout === "modern" && "tracking-tight",
              layout === "elegant" && "font-serif text-center italic",
              layout === "bold" && "uppercase tracking-tighter",
              layout === "studio" && "font-light"
            )}>
              {layout === "bold" ? "THE GALLERY" : "Gallery"}
            </h2>
            {isPreview && onBusinessChange && (
              <PhotoManagerModal
                photos={business.photos}
                availablePhotos={business.availablePhotos}
                onChange={handleUpdatePhotos}
              />
            )}
          </div>

          {business.photos.length > 0 ? (
            <>
              {/* Bento Gallery Grid for Bold/Studio */}
              {(layout === "bold" || layout === "studio") ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {business.photos.slice(0, 6).map((photo, index) => (
                    <AnimatedDiv
                      key={index}
                      animate={animations}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "relative overflow-hidden group cursor-pointer",
                        layoutStyles.cardStyle,
                        // Bento-style varying sizes
                        index === 0 && "col-span-2 row-span-2 aspect-square md:aspect-[4/3]",
                        index !== 0 && "aspect-square",
                        // CTA card in middle
                        index === 2 && layout === "bold" && "bg-black flex items-center justify-center"
                      )}
                    >
                      {/* CTA Card */}
                      {index === 2 && layout === "bold" ? (
                        <div className="text-center p-6">
                          <div
                            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                            style={{ backgroundColor: colorScheme.primary + "20" }}
                          >
                            <Camera className="w-8 h-8" style={{ color: colorScheme.primary }} />
                          </div>
                          <p className="text-white/80 text-sm">
                            Tag us to be featured<br />in our gallery
                          </p>
                        </div>
                      ) : (
                        <>
                          <img
                            src={photo.url}
                            alt={photo.caption}
                            className={cn(
                              "w-full h-full object-cover",
                              animations && "transition-transform duration-500 group-hover:scale-110"
                            )}
                          />
                          <div className={cn(
                            "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent",
                            "flex items-end p-4 transition-opacity",
                            animations ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                          )}>
                            <span className="text-white font-medium text-sm">{photo.caption}</span>
                          </div>
                          {isPreview && onBusinessChange && (
                            <button
                              onClick={() => handleRemovePhoto(index)}
                              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive z-20 backdrop-blur-sm"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </AnimatedDiv>
                  ))}
                </div>
              ) : (
                /* Carousel for other layouts */
                <Carousel opts={{ align: "start", loop: true }} className="w-full">
                  <CarouselContent className="-ml-4">
                    {business.photos.map((photo, index) => (
                      <CarouselItem
                        key={index}
                        className={cn(
                          "pl-4",
                          layout === "elegant" ? "basis-full sm:basis-1/2 lg:basis-1/3" :
                            "basis-full sm:basis-1/2 lg:basis-1/4"
                        )}
                      >
                        <AnimatedDiv
                          animate={animations}
                          initial={{ opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className={cn(
                            "relative overflow-hidden group",
                            layoutStyles.cardStyle,
                            layout === "modern" && "aspect-[4/3]",
                            layout === "classic" && "aspect-square",
                            layout === "minimal" && "aspect-[3/2]",
                            layout === "elegant" && "aspect-[3/4]"
                          )}
                        >
                          <img
                            src={photo.url}
                            alt={photo.caption}
                            className={cn(
                              "w-full h-full object-cover",
                              animations && "transition-transform duration-500 group-hover:scale-110"
                            )}
                          />
                          {layout !== "minimal" && (
                            <div className={cn(
                              "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4",
                              animations ? "opacity-0 group-hover:opacity-100 transition-opacity" : "opacity-100"
                            )}>
                              <span className="text-white font-medium text-sm truncate">{photo.caption}</span>
                            </div>
                          )}
                          {isPreview && onBusinessChange && (
                            <button
                              onClick={() => handleRemovePhoto(index)}
                              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive z-20 backdrop-blur-sm"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </AnimatedDiv>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="flex items-center justify-end gap-2 mt-6">
                    <CarouselPrevious className="static translate-y-0 relative border-2" />
                    <CarouselNext className="static translate-y-0 relative border-2" />
                  </div>
                </Carousel>
              )}
            </>
          ) : (
            <p style={{ color: colorScheme.muted }} className="text-sm">No photos available.</p>
          )}
        </AnimatedDiv>

        {/* ========== VIDEO TESTIMONIALS (Pro Feature) ========== */}
        {business.proFeatures?.showVideoTestimonials && business.proFeatures.videoTestimonials && (
          <AnimatedDiv animate={animations} {...fadeInUp}>
            <VideoTestimonialsSection
              videos={business.proFeatures.videoTestimonials}
              colorScheme={colorScheme}
              layout={layout}
              animations={animations}
              isDark={isDark}
              layoutStyles={layoutStyles}
            />
          </AnimatedDiv>
        )}

        {/* ========== REVIEWS SECTION - REDESIGNED ========== */}
        <AnimatedDiv animate={animations} {...fadeInUp} className={layoutStyles.sectionGap}>
          {/* Section Label */}
          {(layout === "elegant" || layout === "bold" || layout === "studio") && (
            <div className={cn(
              "flex items-center gap-4 mb-6",
              layout === "elegant" && "justify-center"
            )}>
              {layout === "elegant" ? (
                <>
                  <div className="h-px flex-1 max-w-[100px]" style={{ backgroundColor: colorScheme.primary + "40" }} />
                  <span className="text-xs tracking-[0.3em] uppercase" style={{ color: colorScheme.primary }}>Testimonials</span>
                  <div className="h-px flex-1 max-w-[100px]" style={{ backgroundColor: colorScheme.primary + "40" }} />
                </>
              ) : (
                <span className="text-xs tracking-[0.25em] uppercase font-semibold" style={{ color: colorScheme.primary }}>
                  {layout === "bold" ? "COMMUNITY FEEDBACK" : "Reviews"}
                </span>
              )}
            </div>
          )}

          <div className={cn(
            "flex items-center justify-between mb-10",
            layout === "elegant" && "flex-col gap-6",
            layout === "bold" && "flex-col gap-4 text-center"
          )}>
            <h2 className={cn(
              "font-bold",
              layoutStyles.headingSize,
              layout === "modern" && "tracking-tight",
              layout === "elegant" && "font-serif text-center italic",
              layout === "bold" && "uppercase tracking-tighter",
              layout === "studio" && "font-light"
            )}>
              {layout === "minimal" ? "Reviews" : layout === "bold" ? "LOCAL TRUSTED STORIES" : layout === "elegant" ? "What Our Guests Say" : "Customer Reviews"}
            </h2>
            <div className={cn(
              "flex items-center gap-3",
              layout === "bold" && "gap-4"
            )}>
              <Star
                className={cn("w-7 h-7", layout === "bold" && "w-9 h-9")}
                fill="#fbbf24"
                stroke="#fbbf24"
              />
              <span className={cn("text-3xl font-bold", layout === "bold" && "text-5xl")}>{business.rating}</span>
              <span className="text-lg" style={{ color: colorScheme.muted }}>({business.totalReviews} reviews)</span>
            </div>
          </div>

          {animations ? (
            <AnimatedReviews
              reviews={business.reviews}
              colorScheme={colorScheme}
              layoutStyles={layoutStyles}
              isDark={isDark}
              layout={layout}
            />
          ) : (
            <div className={cn(
              "grid gap-6",
              layout === "modern" && "md:grid-cols-2 lg:grid-cols-3",
              layout === "classic" && "md:grid-cols-2 lg:grid-cols-3",
              layout === "minimal" && "grid-cols-1 max-w-2xl",
              layout === "elegant" && "md:grid-cols-3 gap-8",
              layout === "bold" && "md:grid-cols-3 gap-6",
              layout === "studio" && "md:grid-cols-2 lg:grid-cols-3 gap-5"
            )}>
              {business.reviews.slice(0, 3).map((review, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-6 md:p-8 h-full flex flex-col transition-all",
                    layoutStyles.cardStyle,
                    layout === "bold" && "border-t-4",
                    layout === "studio" && "hover:shadow-xl hover:-translate-y-1"
                  )}
                  style={{
                    backgroundColor: isDark ? "#1e293b" : "#fff",
                    boxShadow: isDark ? "none" : "0 4px 20px -5px rgba(0,0,0,0.1)",
                    borderTopColor: layout === "bold" ? colorScheme.primary : undefined
                  }}
                >
                  {/* Stars at top for Bold layout */}
                  {layout === "bold" && (
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5"
                          fill={i < review.rating ? colorScheme.primary : "transparent"}
                          stroke={i < review.rating ? colorScheme.primary : "#d1d5db"}
                        />
                      ))}
                    </div>
                  )}

                  <p
                    className={cn(
                      "flex-1 mb-6 leading-relaxed",
                      layout === "minimal" && "text-base",
                      layout === "elegant" && "text-lg font-serif italic",
                      layout === "bold" && "text-base"
                    )}
                    style={{ color: colorScheme.muted }}
                  >
                    "{review.text}"
                  </p>

                  <div className={cn(
                    "mt-auto pt-4 border-t flex items-center gap-4",
                    layout === "elegant" && "border-dashed justify-center"
                  )} style={{ borderColor: isDark ? "#334155" : "#e5e7eb" }}>
                    {review.avatar && (
                      <img
                        src={review.avatar}
                        alt={review.author}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h4 className={cn(
                        "font-semibold",
                        layout === "elegant" && "font-serif"
                      )}>{review.author}</h4>
                      {layout !== "bold" && (
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-3.5 h-3.5"
                              fill={i < review.rating ? "#fbbf24" : "transparent"}
                              stroke={i < review.rating ? "#fbbf24" : "#d1d5db"}
                            />
                          ))}
                        </div>
                      )}
                      {layout === "bold" && (
                        <span className="text-sm" style={{ color: colorScheme.muted }}>{review.date}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AnimatedDiv>

        {/* ========== HOURS SECTION - REDESIGNED ========== */}
        <AnimatedDiv animate={animations} {...fadeInUp} className={layoutStyles.sectionGap}>
          {/* Section Label */}
          {(layout === "elegant" || layout === "bold" || layout === "studio") && (
            <div className={cn(
              "flex items-center gap-4 mb-6",
              layout === "elegant" && "justify-center"
            )}>
              {layout === "elegant" ? (
                <>
                  <div className="h-px flex-1 max-w-[100px]" style={{ backgroundColor: colorScheme.primary + "40" }} />
                  <span className="text-xs tracking-[0.3em] uppercase" style={{ color: colorScheme.primary }}>Visit Us</span>
                  <div className="h-px flex-1 max-w-[100px]" style={{ backgroundColor: colorScheme.primary + "40" }} />
                </>
              ) : (
                <span className="text-xs tracking-[0.25em] uppercase font-semibold" style={{ color: colorScheme.primary }}>
                  {layout === "bold" ? "LOCATION & HOURS" : "Hours"}
                </span>
              )}
            </div>
          )}

          <h2 className={cn(
            "font-bold mb-8 flex items-center gap-3",
            layoutStyles.headingSize,
            layout === "elegant" && "font-serif justify-center italic",
            layout === "bold" && "uppercase tracking-tighter",
            layout === "studio" && "font-light"
          )}>
            {layout !== "elegant" && layout !== "bold" && (
              <Clock className="w-8 h-8" style={{ color: colorScheme.primary }} />
            )}
            {layout === "minimal" ? "Hours" : layout === "bold" ? "FIND THE PULSE" : layout === "elegant" ? "Opening Hours" : "Opening Hours"}
          </h2>

          {/* Hours Card - Bold gets special two-column layout */}
          {layout === "bold" ? (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Address Column */}
              <div
                className={cn("p-8", layoutStyles.cardStyle)}
                style={{ backgroundColor: isDark ? "#1e293b" : "#fff" }}
              >
                <h3 className="text-sm uppercase tracking-wider font-semibold mb-4" style={{ color: colorScheme.primary }}>
                  The Compound
                </h3>
                <p className="text-2xl font-bold leading-tight mb-6">{business.address}</p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
                  style={{ backgroundColor: colorScheme.primary }}
                >
                  <MapPin className="w-4 h-4" />
                  Get Directions
                </a>
              </div>

              {/* Hours Column */}
              <div
                className={cn("p-8", layoutStyles.cardStyle)}
                style={{ backgroundColor: isDark ? "#1e293b" : "#fff" }}
              >
                <div className="grid gap-4">
                  {business.hours.slice(0, 3).map((item) => (
                    <div key={item.day} className="flex justify-between items-center">
                      <span className="text-sm uppercase tracking-wider" style={{ color: colorScheme.muted }}>{item.day}</span>
                      <span className="font-bold" style={{ color: item.hours.toLowerCase().includes('closed') ? colorScheme.primary : colorScheme.text }}>
                        {item.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "p-6 md:p-8",
                layoutStyles.cardStyle,
                layout === "elegant" && "max-w-2xl mx-auto border"
              )}
              style={{
                backgroundColor: isDark ? "#1e293b" : "#fff",
                boxShadow: isDark ? "none" : "0 4px 20px -5px rgba(0,0,0,0.1)",
                borderColor: layout === "elegant" ? colorScheme.primary + "30" : undefined
              }}
            >
              <div className={cn(
                "grid gap-4",
                layout === "modern" && "md:grid-cols-2",
                layout === "studio" && "md:grid-cols-2"
              )}>
                {business.hours.map((item) => (
                  <div
                    key={item.day}
                    className={cn(
                      "flex justify-between py-3 border-b last:border-b-0",
                      layout === "modern" && "md:border-b-0 md:p-4 md:rounded-xl md:bg-muted/30"
                    )}
                    style={{ borderColor: isDark ? "#334155" : "#e5e7eb" }}
                  >
                    <span className="font-medium">{item.day}</span>
                    <span style={{ color: colorScheme.muted }}>{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </AnimatedDiv>

        {/* ========== CONTACT CTA - REDESIGNED ========== */}
        <AnimatedDiv
          animate={animations}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={cn(
            "relative overflow-hidden p-10 md:p-16 text-center",
            layout === "modern" && "rounded-[2.5rem]",
            layout === "classic" && "rounded-3xl",
            layout === "minimal" && "rounded-2xl",
            layout === "elegant" && "rounded-none border-y-2",
            layout === "bold" && "rounded-[2.5rem]",
            layout === "studio" && "rounded-[2rem]"
          )}
          style={{
            backgroundColor: layout === "elegant" ? "transparent" : colorScheme.primary,
            borderColor: layout === "elegant" ? colorScheme.primary : undefined
          }}
        >
          {/* Background Pattern for Bold */}
          {layout === "bold" && (
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full border-[40px]" style={{ borderColor: "#fff" }} />
              <div className="absolute -left-10 -bottom-10 w-60 h-60 rounded-full border-[30px]" style={{ borderColor: "#fff" }} />
            </div>
          )}

          <div className="relative z-10">
            <h2 className={cn(
              "font-bold mb-4",
              layout === "minimal" ? "text-2xl" : "text-3xl md:text-5xl",
              layout === "elegant" && "font-serif italic",
              layout === "bold" && "uppercase tracking-tighter"
            )} style={{ color: layout === "elegant" ? colorScheme.text : "#fff" }}>
              {layout === "minimal" ? "Visit Us" : layout === "bold" ? "VISIT THE TEMPLE" : layout === "elegant" ? "We Look Forward to Seeing You" : "Ready to Visit Us?"}
            </h2>

            {layout !== "minimal" && (
              <p className={cn(
                "mb-10 max-w-2xl mx-auto text-lg",
                layout === "elegant" && "font-serif"
              )} style={{ color: layout === "elegant" ? colorScheme.muted : "rgba(255,255,255,0.8)" }}>
                {"We'd love to welcome you! Call us to make a reservation or just stop by during our opening hours."}
              </p>
            )}

            <div className={cn(
              "flex flex-wrap items-center justify-center gap-4",
              layout === "minimal" && "mt-6",
              layout === "bold" && "gap-6"
            )}>
              <a
                href={`tel:${business.phone}`}
                className={cn(
                  "px-8 py-4 font-semibold transition-all",
                  layout === "modern" && "rounded-full hover:scale-105",
                  layout === "classic" && "rounded-xl",
                  layout === "minimal" && "rounded-lg",
                  layout === "elegant" && "rounded-none border-2",
                  layout === "bold" && "rounded-xl text-lg",
                  layout === "studio" && "rounded-xl"
                )}
                style={{
                  backgroundColor: layout === "elegant" ? colorScheme.primary : "#fff",
                  color: layout === "elegant" ? "#fff" : colorScheme.primary
                }}
              >
                <Phone className="inline-block w-5 h-5 mr-2 -mt-0.5" />
                Call Now
              </a>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "px-8 py-4 font-semibold border-2 transition-all",
                  layout === "modern" && "rounded-full hover:bg-white/10",
                  layout === "classic" && "rounded-xl hover:bg-white/10",
                  layout === "minimal" && "rounded-lg hover:bg-white/10",
                  layout === "elegant" && "rounded-none hover:bg-black/5",
                  layout === "bold" && "rounded-xl text-lg hover:bg-white/10",
                  layout === "studio" && "rounded-xl hover:bg-white/10"
                )}
                style={{
                  borderColor: layout === "elegant" ? colorScheme.primary : "#fff",
                  color: layout === "elegant" ? colorScheme.primary : "#fff"
                }}
              >
                <MapPin className="inline-block w-5 h-5 mr-2 -mt-0.5" />
                Directions
              </a>
            </div>
          </div>
        </AnimatedDiv>
      </main>

      {/* ========== FOOTER - REDESIGNED ========== */}
      <footer
        className={cn(
          "border-t py-12 md:py-16",
          layout === "bold" && "border-none pt-0"
        )}
        style={{
          backgroundColor: layout === "bold" ? "#000" : isDark ? "#0f172a" : colorScheme.background,
          borderColor: isDark ? "#334155" : "#e5e7eb",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {layout === "bold" ? (
            /* Bold Footer - Full width dark style */
            <div className="grid md:grid-cols-3 gap-12 py-12 border-t border-white/10">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">{business.name}</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {business.description.slice(0, 100)}...
                </p>
                {business.socials && (
                  <div className="flex items-center gap-4 mt-6">
                    {business.socials.instagram && (
                      <a href={business.socials.instagram} className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10" style={{ color: "#fff" }}>
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                    {business.socials.facebook && (
                      <a href={business.socials.facebook} className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10" style={{ color: "#fff" }}>
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                    {business.socials.twitter && (
                      <a href={business.socials.twitter} className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10" style={{ color: "#fff" }}>
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-sm uppercase tracking-wider font-semibold mb-4" style={{ color: colorScheme.primary }}>Navigation</h4>
                <ul className="space-y-3 text-white/60">
                  <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                  <li><a href="#gallery" className="hover:text-white transition-colors">Gallery</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm uppercase tracking-wider font-semibold mb-4" style={{ color: colorScheme.primary }}>Contact</h4>
                <ul className="space-y-3 text-white/60">
                  <li>{business.phone}</li>
                  <li className="text-sm">{business.address}</li>
                </ul>
              </div>
            </div>
          ) : (
            /* Standard Footer */
            <div className="text-center">
              <p className={cn(
                "font-semibold mb-2",
                layout === "elegant" && "font-serif text-xl"
              )}>{business.name}</p>
              <p className="text-sm" style={{ color: colorScheme.muted }}>{business.address}</p>
              {business.website && (
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-sm hover:underline"
                  style={{ color: colorScheme.primary }}
                >
                  <Globe className="w-4 h-4" />
                  {business.website.replace(/^https?:\/\//, "")}
                </a>
              )}

              {business.socials && (
                <div className="flex items-center justify-center gap-4 mt-6">
                  {business.socials.instagram && (
                    <a href={business.socials.instagram} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-75" style={{ color: colorScheme.primary }}>
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {business.socials.facebook && (
                    <a href={business.socials.facebook} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-75" style={{ color: colorScheme.primary }}>
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {business.socials.twitter && (
                    <a href={business.socials.twitter} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-75" style={{ color: colorScheme.primary }}>
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {!isPreview && (
            <p className={cn(
              "mt-8 text-sm text-center",
              layout === "bold" && "text-white/40 border-t border-white/10 pt-8"
            )} style={{ color: layout === "bold" ? undefined : colorScheme.muted }}>
              Website created with{" "}
              <a href="/" className="underline" style={{ color: colorScheme.primary }}>
                MapToSite
              </a>
            </p>
          )}
        </div>
      </footer>
    </div>
  )
}
