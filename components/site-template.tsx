"use client"

import { BusinessData, SiteConfig } from "@/lib/mock-data"
import { Star, MapPin, Phone, Clock, Globe, Check, ChevronRight, X, Instagram, Facebook, Twitter } from "lucide-react"
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

  // Layout-specific styles
  const layoutStyles = {
    modern: {
      sectionGap: "mb-20",
      headingSize: "text-3xl md:text-4xl",
      cardStyle: "rounded-2xl",
      heroHeight: "h-[60vh] min-h-[500px]",
    },
    classic: {
      sectionGap: "mb-16",
      headingSize: "text-2xl md:text-3xl",
      cardStyle: "rounded-lg",
      heroHeight: "h-[50vh] min-h-[400px]",
    },
    minimal: {
      sectionGap: "mb-12",
      headingSize: "text-xl md:text-2xl",
      cardStyle: "rounded-md",
      heroHeight: "h-[40vh] min-h-[350px]",
    },
    elegant: {
      sectionGap: "mb-24",
      headingSize: "text-3xl md:text-5xl",
      cardStyle: "rounded-none border",
      heroHeight: "h-[70vh] min-h-[600px]",
    },
    bold: {
      sectionGap: "mb-16",
      headingSize: "text-4xl md:text-6xl",
      cardStyle: "rounded-3xl",
      heroHeight: "h-[80vh] min-h-[650px]",
    },
    studio: {
      sectionGap: "mb-20",
      headingSize: "text-2xl md:text-4xl",
      cardStyle: "rounded-[2rem]",
      heroHeight: "h-[55vh] min-h-[450px]",
    },
  }[layout]

  const fadeInUp = animations
    ? {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-50px" },
      transition: { duration: 0.5 },
    }
    : {}

  const staggerChildren = animations
    ? {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      viewport: { once: true },
      transition: { staggerChildren: 0.1 },
    }
    : {}

  return (
    <div
      className={cn("min-h-screen", fontClass)}
      style={{
        backgroundColor: colorScheme.background,
        color: colorScheme.text,
      }}
    >
      {/* Hero Section */}
      <header className={cn(
        "relative overflow-hidden", 
        layoutStyles.heroHeight,
        layout === "studio" && "mx-4 mt-4 rounded-[2rem]",
        layout === "bold" && "mx-0"
      )}>
        {isPreview && onBusinessChange && (
          <div className="absolute top-6 right-6 z-20">
            <HeroBackgroundModal
              currentHero={business.heroImage || business.photos[0]?.url || ""}
              photos={business.photos}
              availablePhotos={business.availablePhotos}
              onChange={(url) => onBusinessChange({ ...business, heroImage: url })}
            />
          </div>
        )}
        <img
          src={business.heroImage || business.photos[0]?.url || "/placeholder.jpg"}
          alt={business.name}
          className={cn(
            "w-full h-full object-cover",
            animations && "transition-transform duration-700 hover:scale-105",
            layout === "bold" && "scale-105"
          )}
        />
        <div
          className={cn(
            "absolute inset-0",
            layout === "minimal" && "bg-black/60",
            layout === "modern" && "bg-gradient-to-t from-black/80 via-black/40 to-black/20",
            layout === "classic" && "bg-gradient-to-t from-black/80 via-black/40 to-black/20",
            layout === "elegant" && "bg-gradient-to-r from-black/80 via-black/50 to-transparent",
            layout === "bold" && "bg-gradient-to-b from-transparent via-transparent to-black/90",
            layout === "studio" && "bg-gradient-to-t from-black/70 via-black/30 to-black/10"
          )}
        />
        
        {/* Elegant template decorative elements */}
        {layout === "elegant" && (
          <div className="absolute top-8 left-8 right-8 flex justify-between items-start text-white/80 z-10">
            <div className="w-12 h-px bg-white/40" />
            <div className="text-xs tracking-[0.3em] uppercase">{business.category}</div>
            <div className="w-12 h-px bg-white/40" />
          </div>
        )}
        
        {/* Bold template accent */}
        {layout === "bold" && animations && (
          <motion.div 
            className="absolute top-0 left-0 w-full h-2"
            style={{ backgroundColor: colorScheme.primary }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        )}
        
        <div className={cn(
          "absolute inset-0 flex flex-col p-6 md:p-12",
          layout === "elegant" && "justify-center items-start pl-8 md:pl-16",
          layout === "bold" && "justify-end items-center text-center pb-16",
          layout === "studio" && "justify-end items-start",
          (layout === "modern" || layout === "classic" || layout === "minimal") && "justify-end"
        )}>
          <AnimatedDiv
            animate={animations}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={cn(
              "max-w-4xl",
              layout === "bold" && "max-w-3xl"
            )}
          >
            {(layout === "modern" || layout === "classic" || layout === "studio") && (
              <span
                className={cn(
                  "inline-block px-3 py-1 text-sm font-medium mb-4",
                  layout === "modern" && "rounded-full",
                  layout === "classic" && "rounded",
                  layout === "studio" && "rounded-full bg-white/20 backdrop-blur-sm border border-white/30"
                )}
                style={{ 
                  backgroundColor: layout === "studio" ? "transparent" : colorScheme.primary, 
                  color: "#fff" 
                }}
              >
                {business.category}
              </span>
            )}
            
            {layout === "bold" && (
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "6rem" }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="h-1 mx-auto mb-6 rounded-full"
                style={{ backgroundColor: colorScheme.primary }}
              />
            )}
            
            <h1
              className={cn(
                "font-bold text-white mb-4",
                layout === "modern" && "text-4xl md:text-6xl",
                layout === "classic" && "text-3xl md:text-5xl",
                layout === "minimal" && "text-2xl md:text-4xl",
                layout === "elegant" && "text-4xl md:text-6xl font-serif tracking-tight",
                layout === "bold" && "text-5xl md:text-7xl tracking-tight uppercase",
                layout === "studio" && "text-3xl md:text-5xl font-light"
              )}
            >
              {business.name}
            </h1>
            
            {layout === "elegant" && (
              <p className="text-white/70 text-lg md:text-xl mb-6 max-w-md font-serif italic">
                {business.priceLevel} dining experience
              </p>
            )}
            
            <div className={cn(
              "flex flex-wrap items-center gap-4 text-white/90",
              layout === "bold" && "justify-center"
            )}>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      (layout === "minimal" || layout === "studio") ? "w-4 h-4" : "w-5 h-5",
                      layout === "bold" && "w-6 h-6"
                    )}
                    fill={i < Math.floor(business.rating) ? "#fbbf24" : "transparent"}
                    stroke={i < Math.floor(business.rating) ? "#fbbf24" : "currentColor"}
                  />
                ))}
                <span className={cn("ml-2 font-semibold", layout === "bold" && "text-xl")}>{business.rating}</span>
                <span className="text-white/70">({business.totalReviews} reviews)</span>
              </div>
              {(layout !== "minimal" && layout !== "elegant") && (
                <span className="text-white/70">{business.priceLevel}</span>
              )}
            </div>
          </AnimatedDiv>
        </div>
      </header>

      {/* Quick Info Bar */}
      <div
        className={cn(
          "sticky top-0 z-10",
          layout !== "bold" && "border-b",
          layout === "bold" && "border-none shadow-lg",
          layout === "studio" && "mx-4 mt-4 rounded-2xl border",
          animations && "transition-all duration-300"
        )}
        style={{
          backgroundColor: layout === "bold" 
            ? colorScheme.primary 
            : isDark ? "#1e293b" : "#fff",
          borderColor: isDark ? "#334155" : "#e5e7eb",
        }}
      >
        <div
          className={cn(
            "max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4",
            layout === "minimal" ? "py-3" : "py-4",
            layout === "elegant" && "py-5",
            layout === "bold" && "py-4"
          )}
        >
          <div className="flex flex-wrap items-center gap-6">
            <a
              href={`tel:${business.phone}`}
              className={cn(
                "flex items-center gap-2 transition",
                animations && "hover:opacity-80"
              )}
              style={{ color: layout === "bold" ? "#fff" : colorScheme.primary }}
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">{business.phone}</span>
            </a>
            <div 
              className="flex items-center gap-2 hidden sm:flex" 
              style={{ color: layout === "bold" ? "rgba(255,255,255,0.8)" : colorScheme.muted }}
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{business.address}</span>
            </div>
          </div>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "px-4 py-2 font-medium transition",
              layoutStyles.cardStyle,
              animations && "hover:opacity-90 hover:shadow-lg",
              layout === "bold" && "bg-white text-gray-900 hover:bg-gray-100",
              layout === "elegant" && "border-2 border-current bg-transparent hover:bg-black/5"
            )}
            style={{ 
              backgroundColor: layout === "bold" ? "#fff" : layout === "elegant" ? "transparent" : colorScheme.primary, 
              color: layout === "bold" ? colorScheme.primary : layout === "elegant" ? colorScheme.primary : "#fff" 
            }}
          >
            Get Directions
          </a>
        </div>
      </div>

      <main className={cn(
        "max-w-6xl mx-auto px-4", 
        layout === "minimal" ? "py-8" : "py-12",
        layout === "elegant" && "py-16",
        layout === "bold" && "py-12",
        layout === "studio" && "py-10"
      )}>
        {/* About Section */}
        <AnimatedDiv animate={animations} {...fadeInUp} className={layoutStyles.sectionGap}>
          {layout === "elegant" && (
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs tracking-[0.3em] uppercase" style={{ color: colorScheme.muted }}>Our Story</span>
              <div className="h-px flex-1 bg-border" />
            </div>
          )}
          <h2 className={cn(
            "font-bold mb-6", 
            layoutStyles.headingSize,
            layout === "elegant" && "font-serif text-center",
            layout === "bold" && "uppercase tracking-tight",
            layout === "studio" && "font-light"
          )}>
            {layout === "minimal" ? "About" : layout === "elegant" ? "Our Story" : layout === "bold" ? "WHO WE ARE" : "About Us"}
          </h2>
          <InlineTextArea
            value={business.description}
            onChange={handleUpdateDescription}
            disabled={!isPreview || !onBusinessChange}
            className={cn(
              "leading-relaxed",
              layout === "modern" ? "text-lg" : "text-base",
              layout === "elegant" && "text-lg text-center max-w-3xl mx-auto font-serif",
              layout === "bold" && "text-xl font-medium",
              layout === "studio" && "text-lg"
            )}
            style={{ color: colorScheme.muted }}
          />
        </AnimatedDiv>

        {/* Features */}
        <AnimatedDiv animate={animations} {...fadeInUp} className={layoutStyles.sectionGap}>
          {layout === "elegant" && (
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs tracking-[0.3em] uppercase" style={{ color: colorScheme.muted }}>Services</span>
              <div className="h-px flex-1 bg-border" />
            </div>
          )}
          <h2 className={cn(
            "font-bold mb-6", 
            layoutStyles.headingSize,
            layout === "elegant" && "font-serif text-center",
            layout === "bold" && "uppercase tracking-tight",
            layout === "studio" && "font-light"
          )}>
            {layout === "minimal" ? "Features" : layout === "elegant" ? "What We Offer" : layout === "bold" ? "FEATURES" : "What We Offer"}
          </h2>
          <div
            className={cn(
              "grid gap-4",
              layout === "modern" && "grid-cols-2 lg:grid-cols-4",
              layout === "classic" && "grid-cols-2 lg:grid-cols-4",
              layout === "minimal" && "grid-cols-2",
              layout === "elegant" && "grid-cols-2 lg:grid-cols-4 gap-6",
              layout === "bold" && "grid-cols-2 lg:grid-cols-4 gap-6",
              layout === "studio" && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            )}
          >
            {[...(business.features || []), "Edit Feature...", "Edit Feature...", "Edit Feature...", "Edit Feature..."]
              .slice(0, 4)
              .map((feature, index) => (
                <AnimatedDiv
                  key={index}
                  animate={animations}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "flex items-start gap-3 p-6 min-h-[160px]",
                    layoutStyles.cardStyle,
                    animations && "hover:shadow-md transition-shadow",
                    layout === "elegant" && "border text-center flex-col items-center",
                    layout === "bold" && "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900",
                    layout === "studio" && "bg-gradient-to-r hover:scale-[1.02] transition-transform"
                  )}
                  style={{
                    backgroundColor: layout === "bold" || layout === "studio" 
                      ? undefined 
                      : isDark ? "#1e293b" : colorScheme.accent + "20",
                  }}
                >
                  <div className={cn(
                    layout === "elegant" && "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                    layout === "bold" && "w-10 h-10 rounded-xl flex items-center justify-center",
                    layout === "studio" && "w-8 h-8 rounded-lg flex items-center justify-center"
                  )} style={layout === "elegant" || layout === "bold" || layout === "studio" ? { backgroundColor: colorScheme.primary + "20" } : undefined}>
                    <Check 
                      className={cn(
                        "w-6 h-6 shrink-0",
                        layout !== "elegant" && layout !== "bold" && layout !== "studio" && "mt-1"
                      )} 
                      style={{ color: colorScheme.primary }} 
                    />
                  </div>
                  <div className="flex-1">
                    <InlineTextArea
                      value={feature}
                      rows={3}
                      onChange={(v) => handleUpdateFeature(index, v)}
                      disabled={!isPreview || !onBusinessChange}
                      className={cn(
                        "leading-relaxed w-full", 
                        layout === "minimal" ? "text-base" : "text-lg font-medium",
                        layout === "elegant" && "text-center font-serif",
                        layout === "bold" && "font-semibold",
                        layout === "studio" && "font-medium"
                      )}
                    />
                  </div>
                </AnimatedDiv>
              ))}
          </div>
        </AnimatedDiv>

        {/* Menu / Catalog Section (Pro Feature) */}
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

        {/* Photo Gallery */}
        <AnimatedDiv animate={animations} {...fadeInUp} className={layoutStyles.sectionGap}>
          {layout === "elegant" && (
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs tracking-[0.3em] uppercase" style={{ color: colorScheme.muted }}>Gallery</span>
              <div className="h-px flex-1 bg-border" />
            </div>
          )}
          <div className={cn(
            "flex items-center gap-4 mb-6",
            layout === "elegant" && "justify-center"
          )}>
            <h2 className={cn(
              "font-bold", 
              layoutStyles.headingSize,
              layout === "elegant" && "font-serif text-center",
              layout === "bold" && "uppercase tracking-tight",
              layout === "studio" && "font-light"
            )}>
              {layout === "bold" ? "GALLERY" : "Gallery"}
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
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {business.photos.map((photo, index) => (
                  <CarouselItem key={index} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
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
                        layout === "elegant" && "aspect-[3/4]",
                        layout === "bold" && "aspect-square",
                        layout === "studio" && "aspect-[4/3]"
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
                        <div
                          className={cn(
                            "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4",
                            animations ? "opacity-0 group-hover:opacity-100 transition-opacity" : "opacity-100"
                          )}
                        >
                          <span className="text-white font-medium text-sm truncate">{photo.caption}</span>
                        </div>
                      )}

                      {/* Delete Overlay */}
                      {isPreview && onBusinessChange && (
                        <button
                          onClick={() => handleRemovePhoto(index)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive z-20 backdrop-blur-sm"
                          title="Remove photo"
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
          ) : (
            <p style={{ color: colorScheme.muted }} className="text-sm">No photos available.</p>
          )}
        </AnimatedDiv>

        {/* Video Testimonials Section (Pro Feature) */}
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

        {/* Reviews */}
        <AnimatedDiv animate={animations} {...fadeInUp} className={layoutStyles.sectionGap}>
          {layout === "elegant" && (
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs tracking-[0.3em] uppercase" style={{ color: colorScheme.muted }}>Reviews</span>
              <div className="h-px flex-1 bg-border" />
            </div>
          )}
          <div className={cn(
            "flex items-center justify-between mb-6",
            layout === "elegant" && "flex-col gap-4",
            layout === "bold" && "flex-col gap-2 text-center"
          )}>
            <h2 className={cn(
              "font-bold", 
              layoutStyles.headingSize,
              layout === "elegant" && "font-serif text-center",
              layout === "bold" && "uppercase tracking-tight",
              layout === "studio" && "font-light"
            )}>
              {layout === "minimal" ? "Reviews" : layout === "bold" ? "REVIEWS" : "Customer Reviews"}
            </h2>
            <div className={cn(
              "flex items-center gap-2",
              layout === "bold" && "gap-3"
            )}>
              <Star className={cn("w-6 h-6", layout === "bold" && "w-8 h-8")} fill="#fbbf24" stroke="#fbbf24" />
              <span className={cn("text-2xl font-bold", layout === "bold" && "text-4xl")}>{business.rating}</span>
              <span style={{ color: colorScheme.muted }}>({business.totalReviews})</span>
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
            <div
              className={cn(
                "grid gap-6",
                layout === "modern" && "md:grid-cols-2 lg:grid-cols-3",
                layout === "classic" && "md:grid-cols-2 lg:grid-cols-3",
                layout === "minimal" && "grid-cols-1",
                layout === "elegant" && "md:grid-cols-2 lg:grid-cols-3",
                layout === "bold" && "md:grid-cols-2 lg:grid-cols-3 gap-8",
                layout === "studio" && "md:grid-cols-2 lg:grid-cols-3"
              )}
            >
              {business.reviews.slice(0, 6).map((review, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-6 h-full flex flex-col",
                    layoutStyles.cardStyle
                  )}
                  style={{
                    backgroundColor: isDark ? "#1e293b" : "#fff",
                    boxShadow: isDark ? "none" : "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                >
                  <h3 className="font-bold text-lg md:text-xl mb-4 leading-tight">
                    {review.jtbdHeader || `"A great experience waiting for you"`}
                  </h3>
                  <p
                    className={cn("line-clamp-4 flex-1 mb-6", layout === "minimal" ? "text-sm" : "")}
                    style={{ color: colorScheme.muted }}
                  >
                    "{review.text}"
                  </p>

                  <div className="mt-auto pt-4 border-t flex items-center justify-between" style={{ borderColor: isDark ? "#334155" : "#e5e7eb" }}>
                    <div>
                      <h4 className="font-semibold leading-none mb-1.5">{review.author}</h4>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5"
                            fill={i < review.rating ? "#fbbf24" : "transparent"}
                            stroke={i < review.rating ? "#fbbf24" : "#d1d5db"}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs font-medium" style={{ color: colorScheme.muted }}>
                      {review.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AnimatedDiv>

        {/* Hours */}
        <AnimatedDiv animate={animations} {...fadeInUp} className={layoutStyles.sectionGap}>
          {layout === "elegant" && (
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs tracking-[0.3em] uppercase" style={{ color: colorScheme.muted }}>Hours</span>
              <div className="h-px flex-1 bg-border" />
            </div>
          )}
          <h2 className={cn(
            "font-bold mb-6 flex items-center gap-2", 
            layoutStyles.headingSize,
            layout === "elegant" && "font-serif justify-center",
            layout === "bold" && "uppercase tracking-tight",
            layout === "studio" && "font-light"
          )}>
            <Clock className={cn("w-6 h-6", layout === "elegant" && "hidden")} style={{ color: colorScheme.primary }} />
            {layout === "minimal" ? "Hours" : layout === "bold" ? "HOURS" : "Opening Hours"}
          </h2>
          <div
            className={cn("p-6", layoutStyles.cardStyle)}
            style={{
              backgroundColor: isDark ? "#1e293b" : "#fff",
              boxShadow: isDark ? "none" : "0 4px 6px -1px rgba(0,0,0,0.1)",
            }}
          >
            <div className={cn(
              "grid gap-3", 
              layout === "modern" && "md:grid-cols-2",
              layout === "elegant" && "max-w-md mx-auto",
              layout === "bold" && "md:grid-cols-2",
              layout === "studio" && "md:grid-cols-2"
            )}>
              {business.hours.map((item) => (
                <div
                  key={item.day}
                  className={cn(
                    "flex justify-between py-2 border-b last:border-b-0",
                    layout === "modern" && "md:border-b-0 md:p-3 md:rounded-lg md:bg-muted/30"
                  )}
                  style={{ borderColor: isDark ? "#334155" : "#e5e7eb" }}
                >
                  <span className="font-medium">{item.day}</span>
                  <span style={{ color: colorScheme.muted }}>{item.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedDiv>

        {/* Contact CTA */}
        <AnimatedDiv
          animate={animations}
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={cn(
            "p-8 md:p-12 text-center",
            layout === "modern" && "rounded-3xl",
            layout === "classic" && "rounded-xl",
            layout === "minimal" && "rounded-lg",
            layout === "elegant" && "rounded-none border-y",
            layout === "bold" && "rounded-[2rem]",
            layout === "studio" && "rounded-[2rem]"
          )}
          style={{ 
            backgroundColor: layout === "elegant" ? "transparent" : colorScheme.primary,
            borderColor: layout === "elegant" ? colorScheme.primary : undefined
          }}
        >
          <h2 className={cn(
            "font-bold mb-4", 
            layout === "minimal" ? "text-xl text-white" : "text-2xl md:text-3xl text-white",
            layout === "elegant" && "font-serif text-3xl md:text-4xl",
            layout === "bold" && "text-3xl md:text-5xl uppercase tracking-tight"
          )} style={{ color: layout === "elegant" ? colorScheme.text : "#fff" }}>
            {layout === "minimal" ? "Visit Us" : layout === "bold" ? "VISIT US" : layout === "elegant" ? "We Look Forward to Seeing You" : "Ready to Visit Us?"}
          </h2>
          {layout !== "minimal" && (
            <p className={cn(
              "mb-8 max-w-xl mx-auto",
              layout === "elegant" && "font-serif text-lg"
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
                "px-6 py-3 font-semibold transition",
                layoutStyles.cardStyle,
                animations && "hover:opacity-90 hover:shadow-lg",
                layout === "elegant" && "border-2",
                layout === "bold" && "px-8 py-4 text-lg"
              )}
              style={{ 
                backgroundColor: layout === "elegant" ? colorScheme.primary : "#fff", 
                color: layout === "elegant" ? "#fff" : colorScheme.primary 
              }}
            >
              <Phone className="inline-block w-4 h-4 mr-2 -mt-0.5" />
              Call Now
            </a>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "px-6 py-3 font-semibold border-2 transition",
                layoutStyles.cardStyle,
                animations && "hover:bg-white/10",
                layout === "bold" && "px-8 py-4 text-lg"
              )}
              style={{ 
                borderColor: layout === "elegant" ? colorScheme.primary : "#fff",
                color: layout === "elegant" ? colorScheme.primary : "#fff"
              }}
            >
              <MapPin className="inline-block w-4 h-4 mr-2 -mt-0.5" />
              Directions
            </a>
          </div>
        </AnimatedDiv>
      </main>

      {/* Footer */}
      <footer
        className="border-t py-8"
        style={{
          backgroundColor: isDark ? "#0f172a" : colorScheme.background,
          borderColor: isDark ? "#334155" : "#e5e7eb",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="font-semibold mb-2">{business.name}</p>
          <p className="text-sm" style={{ color: colorScheme.muted }}>{business.address}</p>
          {business.website && (
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-1 mt-2 text-sm",
                animations && "hover:underline"
              )}
              style={{ color: colorScheme.primary }}
            >
              <Globe className="w-4 h-4" />
              {business.website.replace(/^https?:\/\//, "")}
            </a>
          )}

          {/* Socials Integration */}
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

          {!isPreview && (
            <p className="mt-6 text-sm" style={{ color: colorScheme.muted }}>
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
