"use client"

import { BusinessData, SiteConfig } from "@/lib/mock-data"
import { Star, MapPin, Phone, Clock, Globe, Check, ChevronRight } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"

interface SiteTemplateProps {
  business: BusinessData
  config: SiteConfig
  isPreview?: boolean
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

export function SiteTemplate({ business, config, isPreview = false }: SiteTemplateProps) {
  const { colorScheme, layout, fontStyle, animations } = config
  const isDark = colorScheme.id === "midnight"

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
        <Image
          src={business.photos[0]?.url || "/placeholder.jpg"}
          alt={business.name}
          fill
          className={cn(
            "object-cover",
            animations && "transition-transform duration-700 hover:scale-105"
          )}
          crossOrigin="anonymous"
          priority
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
          <p
            className={cn(
              "leading-relaxed",
              layout === "modern" ? "text-lg" : "text-base"
            )}
            style={{ color: colorScheme.muted }}
          >
            {business.description}
          </p>
        </AnimatedDiv>

        {/* Features */}
        <AnimatedDiv animate={animations} {...fadeInUp} className={layoutStyles.sectionGap}>
          <h2 className={cn("font-bold mb-6", layoutStyles.headingSize)}>
            {layout === "minimal" ? "Features" : "What We Offer"}
          </h2>
          <div
            className={cn(
              "grid gap-3",
              layout === "modern" && "grid-cols-2 md:grid-cols-4",
              layout === "classic" && "grid-cols-2 md:grid-cols-3",
              layout === "minimal" && "grid-cols-2"
            )}
          >
            {business.features.map((feature, index) => (
              <AnimatedDiv
                key={feature}
                animate={animations}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex items-center gap-3 p-4",
                  layoutStyles.cardStyle,
                  animations && "hover:shadow-md transition-shadow"
                )}
                style={{
                  backgroundColor: isDark ? "#1e293b" : colorScheme.accent + "20",
                }}
              >
                <Check className="w-5 h-5 shrink-0" style={{ color: colorScheme.primary }} />
                <span className={cn(layout === "minimal" ? "text-sm" : "font-medium")}>{feature}</span>
              </AnimatedDiv>
            ))}
          </div>
        </AnimatedDiv>

        {/* Photo Gallery */}
        <AnimatedDiv animate={animations} {...fadeInUp} className={layoutStyles.sectionGap}>
          <h2 className={cn("font-bold mb-6", layoutStyles.headingSize)}>Gallery</h2>
          <div
            className={cn(
              "grid gap-4",
              layout === "modern" && "grid-cols-2 md:grid-cols-3",
              layout === "classic" && "grid-cols-2 md:grid-cols-3",
              layout === "minimal" && "grid-cols-2"
            )}
          >
            {business.photos.map((photo, index) => (
              <AnimatedDiv
                key={index}
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
                <Image
                  src={photo.url}
                  alt={photo.caption}
                  fill
                  className={cn(
                    "object-cover",
                    animations && "transition-transform duration-500 group-hover:scale-110"
                  )}
                  crossOrigin="anonymous"
                />
                {layout !== "minimal" && (
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4",
                      animations ? "opacity-0 group-hover:opacity-100 transition-opacity" : "opacity-100"
                    )}
                  >
                    <span className="text-white font-medium text-sm">{photo.caption}</span>
                  </div>
                )}
              </AnimatedDiv>
            ))}
          </div>
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
          <div
            className={cn(
              "grid gap-6",
              layout === "modern" && "md:grid-cols-2",
              layout === "classic" && "md:grid-cols-2",
              layout === "minimal" && "grid-cols-1"
            )}
          >
            {business.reviews.map((review, index) => (
              <AnimatedDiv
                key={index}
                animate={animations}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "p-6",
                  layoutStyles.cardStyle,
                  animations && "hover:shadow-lg transition-shadow"
                )}
                style={{
                  backgroundColor: isDark ? "#1e293b" : "#fff",
                  boxShadow: isDark ? "none" : "0 4px 6px -1px rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex items-start gap-4">
                  <Image
                    src={review.avatar}
                    alt={review.author}
                    width={layout === "minimal" ? 40 : 48}
                    height={layout === "minimal" ? 40 : 48}
                    className="rounded-full"
                    crossOrigin="anonymous"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold">{review.author}</h4>
                      <span className="text-sm" style={{ color: colorScheme.muted }}>
                        {review.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4"
                          fill={i < review.rating ? "#fbbf24" : "transparent"}
                          stroke={i < review.rating ? "#fbbf24" : "#d1d5db"}
                        />
                      ))}
                    </div>
                    <p
                      className={layout === "minimal" ? "text-sm" : ""}
                      style={{ color: colorScheme.muted }}
                    >
                      {review.text}
                    </p>
                  </div>
                </div>
              </AnimatedDiv>
            ))}
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
