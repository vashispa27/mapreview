"use client"

import { BusinessData, SiteConfig } from "@/lib/mock-data"
import { Star, MapPin, Phone, Clock, Globe, Check, ChevronRight, X, Instagram, Facebook, Twitter } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"
import { PhotoManagerModal } from "./photo-manager-modal"
import { HeroBackgroundModal } from "./hero-background-modal"
import { AnimatedReviews } from "./animated-reviews"
import { InlineTextArea, InlineInput } from "./inline-editor"
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
      <header className={cn("relative overflow-hidden", layoutStyles.heroHeight)}>
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
            animations && "transition-transform duration-700 hover:scale-105"
          )}
        />
        <div
          className={cn(
            "absolute inset-0",
            layout === "minimal"
              ? "bg-black/60"
              : "bg-gradient-to-t from-black/80 via-black/40 to-black/20"
          )}
        />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
          <AnimatedDiv
            animate={animations}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            {layout !== "minimal" && (
              <span
                className={cn(
                  "inline-block px-3 py-1 text-sm font-medium mb-4",
                  layout === "modern" ? "rounded-full" : "rounded"
                )}
                style={{ backgroundColor: colorScheme.primary, color: "#fff" }}
              >
                {business.category}
              </span>
            )}
            <h1
              className={cn(
                "font-bold text-white mb-4",
                layout === "modern" && "text-4xl md:text-6xl",
                layout === "classic" && "text-3xl md:text-5xl",
                layout === "minimal" && "text-2xl md:text-4xl"
              )}
            >
              {business.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      layout === "minimal" ? "w-4 h-4" : "w-5 h-5"
                    )}
                    fill={i < Math.floor(business.rating) ? "#fbbf24" : "transparent"}
                    stroke={i < Math.floor(business.rating) ? "#fbbf24" : "currentColor"}
                  />
                ))}
                <span className="ml-2 font-semibold">{business.rating}</span>
                <span className="text-white/70">({business.totalReviews} reviews)</span>
              </div>
              {layout !== "minimal" && (
                <span className="text-white/70">{business.priceLevel}</span>
              )}
            </div>
          </AnimatedDiv>
        </div>
      </header>

      {/* Quick Info Bar */}
      <div
        className={cn(
          "sticky top-0 z-10 border-b",
          animations && "transition-all duration-300"
        )}
        style={{
          backgroundColor: isDark ? "#1e293b" : "#fff",
          borderColor: isDark ? "#334155" : "#e5e7eb",
        }}
      >
        <div
          className={cn(
            "max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4",
            layout === "minimal" ? "py-3" : "py-4"
          )}
        >
          <div className="flex flex-wrap items-center gap-6">
            <a
              href={`tel:${business.phone}`}
              className={cn(
                "flex items-center gap-2 transition",
                animations && "hover:opacity-80"
              )}
              style={{ color: colorScheme.primary }}
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">{business.phone}</span>
            </a>
            <div className="flex items-center gap-2 hidden sm:flex" style={{ color: colorScheme.muted }}>
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{business.address}</span>
            </div>
          </div>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "px-4 py-2 font-medium text-white transition",
              layoutStyles.cardStyle,
              animations && "hover:opacity-90 hover:shadow-lg"
            )}
            style={{ backgroundColor: colorScheme.primary }}
          >
            Get Directions
          </a>
        </div>
      </div>

      <main className={cn("max-w-6xl mx-auto px-4", layout === "minimal" ? "py-8" : "py-12")}>
        {/* About Section */}
        <AnimatedDiv animate={animations} {...fadeInUp} className={layoutStyles.sectionGap}>
          <h2 className={cn("font-bold mb-6", layoutStyles.headingSize)}>
            {layout === "minimal" ? "About" : "About Us"}
          </h2>
          <InlineTextArea
            value={business.description}
            onChange={handleUpdateDescription}
            disabled={!isPreview || !onBusinessChange}
            className={cn(
              "leading-relaxed",
              layout === "modern" ? "text-lg" : "text-base"
            )}
            style={{ color: colorScheme.muted }}
          />
        </AnimatedDiv>

        {/* Features */}
        <AnimatedDiv animate={animations} {...fadeInUp} className={layoutStyles.sectionGap}>
          <h2 className={cn("font-bold mb-6", layoutStyles.headingSize)}>
            {layout === "minimal" ? "Features" : "What We Offer"}
          </h2>
          <div
            className={cn(
              "grid gap-4",
              layout === "modern" && "grid-cols-2 lg:grid-cols-4",
              layout === "classic" && "grid-cols-2 lg:grid-cols-4",
              layout === "minimal" && "grid-cols-2"
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
                    animations && "hover:shadow-md transition-shadow"
                  )}
                  style={{
                    backgroundColor: isDark ? "#1e293b" : colorScheme.accent + "20",
                  }}
                >
                  <Check className="w-6 h-6 shrink-0 mt-1" style={{ color: colorScheme.primary }} />
                  <div className="flex-1">
                    <InlineTextArea
                      value={feature}
                      rows={3}
                      onChange={(v) => handleUpdateFeature(index, v)}
                      disabled={!isPreview || !onBusinessChange}
                      className={cn("leading-relaxed w-full", layout === "minimal" ? "text-base" : "text-lg font-medium")}
                    />
                  </div>
                </AnimatedDiv>
              ))}
          </div>
        </AnimatedDiv>

        {/* Photo Gallery */}
        <AnimatedDiv animate={animations} {...fadeInUp} className={layoutStyles.sectionGap}>
          <div className="flex items-center gap-4 mb-6">
            <h2 className={cn("font-bold", layoutStyles.headingSize)}>Gallery</h2>
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
                        layout === "minimal" && "aspect-[3/2]"
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

        {/* Reviews */}
        <AnimatedDiv animate={animations} {...fadeInUp} className={layoutStyles.sectionGap}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={cn("font-bold", layoutStyles.headingSize)}>
              {layout === "minimal" ? "Reviews" : "Customer Reviews"}
            </h2>
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6" fill="#fbbf24" stroke="#fbbf24" />
              <span className="text-2xl font-bold">{business.rating}</span>
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
                layout === "minimal" && "grid-cols-1"
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
                    "Find the best experience for your family"
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
          <h2 className={cn("font-bold mb-6 flex items-center gap-2", layoutStyles.headingSize)}>
            <Clock className="w-6 h-6" style={{ color: colorScheme.primary }} />
            {layout === "minimal" ? "Hours" : "Opening Hours"}
          </h2>
          <div
            className={cn("p-6", layoutStyles.cardStyle)}
            style={{
              backgroundColor: isDark ? "#1e293b" : "#fff",
              boxShadow: isDark ? "none" : "0 4px 6px -1px rgba(0,0,0,0.1)",
            }}
          >
            <div className={cn("grid gap-3", layout === "modern" && "md:grid-cols-2")}>
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
            layout === "minimal" && "rounded-lg"
          )}
          style={{ backgroundColor: colorScheme.primary }}
        >
          <h2 className={cn("font-bold text-white mb-4", layout === "minimal" ? "text-xl" : "text-2xl md:text-3xl")}>
            {layout === "minimal" ? "Visit Us" : "Ready to Visit Us?"}
          </h2>
          {layout !== "minimal" && (
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              {"We'd love to welcome you! Call us to make a reservation or just stop by during our opening hours."}
            </p>
          )}
          <div className={cn("flex flex-wrap items-center justify-center gap-4", layout === "minimal" && "mt-6")}>
            <a
              href={`tel:${business.phone}`}
              className={cn(
                "px-6 py-3 font-semibold transition",
                layoutStyles.cardStyle,
                animations && "hover:opacity-90 hover:shadow-lg"
              )}
              style={{ backgroundColor: "#fff", color: colorScheme.primary }}
            >
              <Phone className="inline-block w-4 h-4 mr-2 -mt-0.5" />
              Call Now
            </a>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "px-6 py-3 font-semibold border-2 border-white text-white transition",
                layoutStyles.cardStyle,
                animations && "hover:bg-white/10"
              )}
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
