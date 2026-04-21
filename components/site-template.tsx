"use client"
//hello;
import { useRef, useState } from "react"
import { BusinessData, SiteConfig, ColorScheme } from "@/lib/mock-data"
import { Star, MapPin, Phone, Clock, Globe, Check, ChevronRight, ChevronDown, X, Instagram, Facebook, Twitter, UtensilsCrossed, ShoppingCart } from "lucide-react"
import { ServicesPage } from "./site-pages/ServicesPage"
import { MembershipPage } from "./site-pages/MembershipPage"
import { ProductsPage } from "./site-pages/ProductsPage"
import { ContactPage } from "./site-pages/ContactPage"
import { TrainersPage } from "./site-pages/TrainersPage"
import { CartDrawer, CartItem } from "./site-pages/CartDrawer"
import { ServiceItem, ProductItem } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion"
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

// ─── Floating bottom page nav — shared by all templates ──────────────────────
function FloatingPageNav({
  activePage, onNavigate, pages, colorScheme, cartCount, onCartClick, isPreview, isGym,
}: {
  activePage: string
  onNavigate: (page: string) => void
  pages: { services?: boolean; products?: boolean; contact?: boolean }
  colorScheme: ColorScheme
  cartCount: number
  onCartClick: () => void
  isPreview?: boolean
  isGym?: boolean
}) {
  const tabs = [
    { key: "home", label: "Home" },
    ...(pages.services ? [{ key: "services", label: isGym ? "Memberships" : "Services" }] : []),
    ...(pages.products ? [{ key: "products", label: "Products" }] : []),
    ...((pages as any).trainers ? [{ key: "trainers", label: "Our Trainers" }] : []),
    ...(pages.contact ? [{ key: "contact", label: "Contact" }] : []),
  ]

  const allTabs = [
    ...tabs,
    ...(pages.products && !isPreview ? [{ key: "__cart__", label: "Cart" }] : []),
  ]

  return (
    <>
      {/* Mobile: full-width bottom tab bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-border shadow-2xl flex">
        {allTabs.map((tab) => {
          const isCart = tab.key === "__cart__"
          const isActive = !isCart && activePage === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => isCart ? onCartClick() : onNavigate(tab.key)}
              className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-[11px] font-semibold transition-colors relative"
              style={{ color: isActive ? colorScheme.primary : "#9ca3af" }}
            >
              {isCart && cartCount > 0 && (
                <span className="absolute top-2 right-1/4 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
                  style={{ backgroundColor: colorScheme.primary }}>{cartCount}</span>
              )}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full" style={{ backgroundColor: colorScheme.primary }} />
              )}
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Desktop: floating pill */}
      <div className="hidden sm:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-50 items-center gap-1 bg-white/95 backdrop-blur-md border border-border shadow-2xl rounded-2xl px-2 py-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onNavigate(tab.key)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap"
            style={{
              backgroundColor: activePage === tab.key ? colorScheme.primary : "transparent",
              color: activePage === tab.key ? "#fff" : "#6b7280",
            }}
          >
            {tab.label}
          </button>
        ))}
        {pages.products && !isPreview && (
          <button
            onClick={onCartClick}
            className="relative ml-1 p-2 rounded-xl transition hover:bg-black/5"
            style={{ color: colorScheme.primary }}
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                style={{ backgroundColor: colorScheme.primary }}
              >
                {cartCount}
              </span>
            )}
          </button>
        )}
      </div>
    </>
  )
}

// ─── Floating menu button + styled dialog — shared by all templates ───────────
function MenuFloater({ business, colorScheme }: { business: BusinessData; colorScheme: ColorScheme }) {
  const ref = useRef<HTMLDialogElement>(null)
  if (!business.menuImage) return null
  const isPdf = business.menuImage.startsWith("data:application/pdf")
  return (
    <>
      <button
        onClick={() => ref.current?.showModal()}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-white shadow-2xl hover:scale-105 active:scale-95 transition-transform"
        style={{ backgroundColor: colorScheme.primary }}
      >
        <UtensilsCrossed className="w-4 h-4" />
        View Menu
      </button>

      <dialog
        ref={ref}
        style={{
          padding: 0,
          border: "none",
          borderRadius: 16,
          width: "min(580px, calc(100vw - 40px))",
          maxHeight: "90vh",
          overflow: "hidden",
          margin: "auto",
          inset: 0,
          position: "fixed",
        }}
        className="shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm"
        onClick={(e) => { if (e.target === ref.current) ref.current?.close() }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxHeight: "90vh" }}>
          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 20px", borderBottom: "1px solid #e5e7eb",
            background: "#fff", position: "sticky", top: 0, zIndex: 10, flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, display: "flex",
                alignItems: "center", justifyContent: "center",
                backgroundColor: colorScheme.primary + "20",
              }}>
                <UtensilsCrossed style={{ width: 16, height: 16, color: colorScheme.primary }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>Our Menu</span>
            </div>
            <button
              onClick={() => ref.current?.close()}
              style={{
                width: 32, height: 32, borderRadius: "50%", border: "none",
                background: "#f3f4f6", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <X style={{ width: 14, height: 14, color: "#555" }} />
            </button>
          </div>
          {/* Content */}
          <div style={{ overflowY: "auto", flex: 1 }}>
            {isPdf ? (
              <iframe src={business.menuImage} style={{ width: "100%", height: "70vh", display: "block", border: "none" }} title="Menu" />
            ) : (
              <img src={business.menuImage} alt="Our Menu" style={{ width: "100%", height: "auto", display: "block" }} />
            )}
          </div>
        </div>
      </dialog>
    </>
  )
}

export function SiteTemplate({ business, config, isPreview = false, onBusinessChange }: SiteTemplateProps) {
  const { colorScheme, layout, fontStyle, animations } = config
  const isDark = colorScheme.id === "midnight"

  type Page = "home" | "services" | "products" | "contact" | "trainers"
  const [activePage, setActivePage] = useState<Page>("home")
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [prefilledService, setPrefilledService] = useState<ServiceItem | null>(null)

  const pages = business.pages ?? {}
  const cartCount = cartItems.reduce((s, c) => s + c.qty, 0)

  const addToCart = (product: ProductItem) => {
    setCartItems((prev) => {
      const existing = prev.find((c) => c.product.id === product.id)
      if (existing) return prev.map((c) => c.product.id === product.id ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { product, qty: 1 }]
    })
    setCartOpen(true)
  }

  const updateQty = (productId: string, qty: number) => {
    setCartItems((prev) => qty <= 0 ? prev.filter((c) => c.product.id !== productId) : prev.map((c) => c.product.id === productId ? { ...c, qty } : c))
  }

  const bookService = (svc: ServiceItem) => {
    setPrefilledService(svc)
    setActivePage("contact")
  }

  const handleCartCheckout = () => {
    const summary = cartItems.map((c) => `${c.product.title} x${c.qty} @ ${c.product.price}`).join(", ")
    setPrefilledService({ id: "cart", title: "Product Order", price: "", description: summary })
    setCartOpen(false)
    setActivePage("contact")
  }


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

  const hasPages = !!(pages.services || pages.products || pages.contact || pages.trainers)

  const navigate = (p: string) => {
    setActivePage(p as Page)
    if (p !== "contact") setPrefilledService(null)
  }

  const floatingNav = hasPages ? (
    <FloatingPageNav
      activePage={activePage}
      onNavigate={navigate}
      pages={pages}
      colorScheme={colorScheme}
      cartCount={cartCount}
      onCartClick={() => setCartOpen(true)}
      isPreview={isPreview}
      isGym={!!business.isGym}
    />
  ) : null

  const cartDrawer = (
    <CartDrawer open={cartOpen} items={cartItems} colorScheme={colorScheme} onClose={() => setCartOpen(false)} onUpdateQty={updateQty} onCheckout={handleCartCheckout} />
  )

  // For non-home pages: same content across all layouts
  if (activePage !== "home") {
    return (
      <div className={cn("min-h-screen pb-16 sm:pb-0", fontClass)} style={{ backgroundColor: colorScheme.background, color: colorScheme.text }}>
        {activePage === "services" && pages.services && (
          business.isGym
            ? <MembershipPage business={business} colorScheme={colorScheme} fontClass={fontClass} onEnquire={bookService} onBusinessChange={onBusinessChange} />
            : <ServicesPage business={business} colorScheme={colorScheme} fontClass={fontClass} onBook={bookService} onBusinessChange={onBusinessChange} />
        )}
        {activePage === "products" && pages.products && (
          <ProductsPage business={business} colorScheme={colorScheme} fontClass={fontClass} cartItems={cartItems} onAddToCart={isPreview ? undefined : addToCart} onBusinessChange={onBusinessChange} />
        )}
        {activePage === "trainers" && (pages as any).trainers && (
          <TrainersPage business={business} colorScheme={colorScheme} fontClass={fontClass} onBusinessChange={onBusinessChange} />
        )}
        {activePage === "contact" && pages.contact && (
          <ContactPage business={business} colorScheme={colorScheme} fontClass={fontClass} prefilledService={prefilledService} />
        )}
        {floatingNav}
        {cartDrawer}
        <MenuFloater business={business} colorScheme={colorScheme} />
      </div>
    )
  }

  // Route to pro templates (home page only)
  if (layout === "luxury") return (
    <>
      <LuxuryTemplate business={business} config={config} isPreview={isPreview} onBusinessChange={onBusinessChange} />
      {floatingNav}
      {cartDrawer}
    </>
  )
  if (layout === "bold") return (
    <>
      <BoldTemplate business={business} config={config} isPreview={isPreview} onBusinessChange={onBusinessChange} />
      {floatingNav}
      {cartDrawer}
    </>
  )
  if (layout === "executive") return (
    <>
      <ExecutiveTemplate business={business} config={config} isPreview={isPreview} onBusinessChange={onBusinessChange} />
      {floatingNav}
      {cartDrawer}
    </>
  )

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

      {/* Sticky Nav */}
      <div
        className={cn("sticky top-0 z-10 border-b", animations && "transition-all duration-300")}
        style={{ backgroundColor: isDark ? "#1e293b" : "#fff", borderColor: isDark ? "#334155" : "#e5e7eb" }}
      >
        {/* Top row: phone + directions */}
        <div className={cn("max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4", layout === "minimal" ? "py-2" : "py-3")}>
          <div className="flex flex-wrap items-center gap-5">
            <a href={`tel:${business.phone}`} className={cn("flex items-center gap-2 transition text-sm", animations && "hover:opacity-80")} style={{ color: colorScheme.primary }}>
              <Phone className="w-3.5 h-3.5" /><span className="font-medium">{business.phone}</span>
            </a>
            <div className="hidden sm:flex items-center gap-2 text-sm" style={{ color: colorScheme.muted }}>
              <MapPin className="w-3.5 h-3.5" /><span>{business.address}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pages.products && (
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded-lg hover:bg-black/5 transition"
                style={{ color: colorScheme.primary }}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center" style={{ backgroundColor: colorScheme.primary }}>
                    {cartCount}
                  </span>
                )}
              </button>
            )}
            <a href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`} target="_blank" rel="noopener noreferrer"
              className={cn("px-3 py-1.5 text-sm font-medium text-white transition", layoutStyles.cardStyle, animations && "hover:opacity-90")}
              style={{ backgroundColor: colorScheme.primary }}>
              Directions
            </a>
          </div>
        </div>

      </div>

      {/* Home page content */}
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
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity hover:bg-destructive z-20 backdrop-blur-sm"
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

      {floatingNav}
      {cartDrawer}
      <MenuFloater business={business} colorScheme={colorScheme} />
    </div>
  )
}

// ─────────────────────────────────────────────
// PRO TEMPLATE: LUXURY
// Dark, elegant, cinematic. Full-screen hero, centered refined layout.
// ─────────────────────────────────────────────
function LuxuryTemplate({ business, config, isPreview = false, onBusinessChange }: SiteTemplateProps) {
  const { colorScheme, fontStyle, animations } = config
  const isDark = colorScheme.id === "midnight"

  const handleRemovePhoto = (i: number) => {
    if (onBusinessChange) onBusinessChange({ ...business, photos: business.photos.filter((_, idx) => idx !== i) })
  }
  const handleUpdatePhotos = (newPhotos: any[]) => {
    if (onBusinessChange) onBusinessChange({ ...business, photos: newPhotos })
  }
  const handleUpdateDescription = (val: string) => {
    if (onBusinessChange) onBusinessChange({ ...business, description: val })
  }
  const handleUpdateFeature = (index: number, val: string) => {
    if (onBusinessChange) {
      const f = [...business.features]; f[index] = val
      onBusinessChange({ ...business, features: f })
    }
  }

  const fontClass = { sans: "font-sans", serif: "font-serif", rounded: "font-sans tracking-wide" }[fontStyle]
  const fadeIn = animations ? { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" as any }, transition: { duration: 0.65 } } : {}

  const bg = isDark ? "#0c0c0e" : "#f9f7f4"
  const cardBg = isDark ? "#161618" : "#ffffff"
  const border = isDark ? "#252528" : "#e8e4de"
  const muted = isDark ? "#8a8a90" : "#6b6560"

  return (
    <div className={cn("min-h-screen", fontClass)} style={{ backgroundColor: bg, color: isDark ? "#e8e8ec" : "#1a1817" }}>

      {/* HERO */}
      <header className="relative h-screen min-h-[620px] overflow-hidden">
        {isPreview && onBusinessChange && (
          <div className="absolute top-6 right-6 z-20">
            <HeroBackgroundModal currentHero={business.heroImage || business.photos[0]?.url || ""} photos={business.photos} availablePhotos={business.availablePhotos} onChange={(url) => onBusinessChange({ ...business, heroImage: url })} />
          </div>
        )}
        <img src={business.heroImage || business.photos[0]?.url || "/placeholder.jpg"} alt={business.name}
          className={cn("absolute inset-0 w-full h-full object-cover", animations && "transition-transform duration-[8s] hover:scale-105")} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/50 to-black/88" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent" />

        <AnimatedDiv animate={animations} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="text-xs tracking-[0.35em] uppercase font-medium mb-5" style={{ color: colorScheme.primary }}>
            {business.category}
          </span>
          <div className="flex items-center gap-5 mb-7">
            <div className="h-px w-20 opacity-40" style={{ background: `linear-gradient(to right, transparent, ${colorScheme.primary})` }} />
            <Star className="w-3.5 h-3.5" fill={colorScheme.primary} stroke={colorScheme.primary} />
            <div className="h-px w-20 opacity-40" style={{ background: `linear-gradient(to left, transparent, ${colorScheme.primary})` }} />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-7 tracking-tight leading-[1.05]">
            {business.name}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm tracking-widest uppercase text-white/65">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3" fill={i < Math.floor(business.rating) ? colorScheme.primary : "transparent"} stroke={i < Math.floor(business.rating) ? colorScheme.primary : "rgba(255,255,255,0.4)"} />
              ))}
            </div>
            <span className="text-white/80 font-semibold">{business.rating}</span>
            <span className="opacity-40">·</span>
            <span>{business.totalReviews} Reviews</span>
            <span className="opacity-40">·</span>
            <span>{business.priceLevel}</span>
          </div>
        </AnimatedDiv>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 text-white/40">
          <span className="text-[10px] tracking-[0.3em] uppercase">Explore</span>
          <ChevronDown className={cn("w-4 h-4", animations && "animate-bounce")} />
        </div>
      </header>

      {/* STICKY BAR */}
      <div className="sticky top-0 z-10 border-b" style={{ backgroundColor: isDark ? "#111113" : "#111111", borderColor: isDark ? "#222" : "#1a1a1a" }}>
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-5">
            <a href={`tel:${business.phone}`} className="flex items-center gap-2 text-sm font-medium tracking-wide transition-opacity hover:opacity-80" style={{ color: colorScheme.primary }}>
              <Phone className="w-3.5 h-3.5" />{business.phone}
            </a>
            <div className="hidden sm:flex items-center gap-2 text-sm text-white/50">
              <MapPin className="w-3.5 h-3.5" /><span>{business.address}</span>
            </div>
          </div>
          <a href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`} target="_blank" rel="noopener noreferrer"
            className="px-5 py-1.5 text-xs font-semibold tracking-[0.15em] uppercase rounded-full border transition-all hover:bg-white/10"
            style={{ borderColor: colorScheme.primary, color: colorScheme.primary }}>
            Get Directions
          </a>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-20 space-y-28">

        {/* ABOUT */}
        <AnimatedDiv animate={animations} {...fadeIn} className="max-w-3xl mx-auto text-center">
          <span className="text-xs tracking-[0.35em] uppercase font-medium mb-3 inline-block" style={{ color: colorScheme.primary }}>Our Story</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-10">About Us</h2>
          <div className="relative px-6">
            <span className="absolute -top-6 left-0 text-[80px] leading-none font-serif select-none pointer-events-none" style={{ color: colorScheme.primary, opacity: 0.12 }}>"</span>
            <InlineTextArea value={business.description} onChange={handleUpdateDescription} disabled={!isPreview || !onBusinessChange}
              className="text-lg leading-[1.85] italic text-center block" style={{ color: muted }} />
          </div>
        </AnimatedDiv>

        {/* DIVIDER */}
        <div className="flex items-center gap-6 max-w-xs mx-auto">
          <div className="flex-1 h-px" style={{ backgroundColor: border }} />
          <Star className="w-3.5 h-3.5 shrink-0" fill={colorScheme.primary} stroke={colorScheme.primary} />
          <div className="flex-1 h-px" style={{ backgroundColor: border }} />
        </div>

        {/* FEATURES */}
        <AnimatedDiv animate={animations} {...fadeIn}>
          <div className="text-center mb-14">
            <span className="text-xs tracking-[0.35em] uppercase font-medium mb-3 inline-block" style={{ color: colorScheme.primary }}>Highlights</span>
            <h2 className="text-3xl md:text-4xl font-bold">What We Offer</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...(business.features || []), "Edit Feature...", "Edit Feature...", "Edit Feature...", "Edit Feature..."].slice(0, 4).map((feature, i) => (
              <AnimatedDiv key={i} animate={animations} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className={cn("p-7 rounded-2xl border-t-2", animations && "transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl")}
                style={{ borderTopColor: colorScheme.primary, backgroundColor: cardBg, boxShadow: isDark ? "none" : "0 2px 20px rgba(0,0,0,0.06)" }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: colorScheme.primary + "18" }}>
                  <Check className="w-5 h-5" style={{ color: colorScheme.primary }} />
                </div>
                <InlineTextArea value={feature} rows={3} onChange={(v) => handleUpdateFeature(i, v)} disabled={!isPreview || !onBusinessChange}
                  className="text-sm leading-relaxed font-medium w-full" />
              </AnimatedDiv>
            ))}
          </div>
        </AnimatedDiv>

        {/* GALLERY */}
        <AnimatedDiv animate={animations} {...fadeIn}>
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs tracking-[0.35em] uppercase font-medium block mb-2" style={{ color: colorScheme.primary }}>Visual Tour</span>
              <h2 className="text-3xl md:text-4xl font-bold">Gallery</h2>
            </div>
            {isPreview && onBusinessChange && <PhotoManagerModal photos={business.photos} availablePhotos={business.availablePhotos} onChange={handleUpdatePhotos} />}
          </div>
          {business.photos.length > 0 ? (
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent className="-ml-4">
                {business.photos.map((photo, index) => (
                  <CarouselItem key={index} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                    <AnimatedDiv animate={animations} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}
                      className="relative overflow-hidden group rounded-2xl aspect-[3/4]">
                      <img src={photo.url} alt={photo.caption} className={cn("w-full h-full object-cover", animations && "transition-transform duration-700 group-hover:scale-110")} />
                      <div className={cn("absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-5",
                        animations ? "opacity-0 group-hover:opacity-100 transition-opacity duration-300" : "opacity-100")}>
                        <span className="text-white text-sm font-medium">{photo.caption}</span>
                      </div>
                      {isPreview && onBusinessChange && (
                        <button onClick={() => handleRemovePhoto(index)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity hover:bg-destructive z-20 backdrop-blur-sm">
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
          ) : <p className="text-sm" style={{ color: muted }}>No photos available.</p>}
        </AnimatedDiv>

        {/* REVIEWS */}
        <AnimatedDiv animate={animations} {...fadeIn}>
          <div className="text-center mb-14">
            <span className="text-xs tracking-[0.35em] uppercase font-medium mb-3 inline-block" style={{ color: colorScheme.primary }}>Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">What Guests Say</h2>
            <div className="flex items-center justify-center gap-2">
              <Star className="w-5 h-5" fill="#fbbf24" stroke="#fbbf24" />
              <span className="text-xl font-bold">{business.rating}</span>
              <span style={{ color: muted }}>({business.totalReviews} reviews)</span>
            </div>
          </div>
          {animations ? (
            <AnimatedReviews
              reviews={business.reviews}
              colorScheme={colorScheme}
              isDark={isDark}
              customStyles={{
                cardBg: cardBg,
                border: border,
                muted: muted,
                padding: "p-7",
                rounded: "rounded-2xl",
                boxShadow: isDark ? "none" : "0 2px 20px rgba(0,0,0,0.07)"
              }}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {business.reviews.slice(0, 6).map((review, index) => (
                <div key={index} 
                  className="relative p-7 rounded-2xl flex flex-col"
                  style={{ backgroundColor: cardBg, border: `1px solid ${border}`, boxShadow: isDark ? "none" : "0 2px 20px rgba(0,0,0,0.07)" }}>
                  <span className="absolute top-3 right-5 text-6xl font-serif leading-none select-none pointer-events-none" style={{ color: colorScheme.primary, opacity: 0.18 }}>"</span>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5" fill={i < review.rating ? "#fbbf24" : "transparent"} stroke={i < review.rating ? "#fbbf24" : "#d1d5db"} />
                    ))}
                  </div>
                  <p className="text-sm leading-[1.8] flex-1 mb-5 italic" style={{ color: muted }}>"{review.text}"</p>
                  <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: border }}>
                    <div>
                      <p className="font-semibold text-sm">{review.author}</p>
                      <p className="text-xs mt-0.5" style={{ color: muted }}>{review.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AnimatedDiv>

        {/* HOURS */}
        <AnimatedDiv animate={animations} {...fadeIn} className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs tracking-[0.35em] uppercase font-medium mb-3 inline-block" style={{ color: colorScheme.primary }}>Schedule</span>
            <h2 className="text-3xl md:text-4xl font-bold">Opening Hours</h2>
          </div>
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: border, backgroundColor: cardBg }}>
            {business.hours.map((item, i) => (
              <div key={item.day} className={cn("flex justify-between items-center px-7 py-4", i !== business.hours.length - 1 && "border-b")} style={{ borderColor: border }}>
                <span className="font-medium text-sm tracking-wide">{item.day}</span>
                <span className="text-sm" style={{ color: muted }}>{item.hours}</span>
              </div>
            ))}
          </div>
        </AnimatedDiv>

        {/* CTA */}
        <AnimatedDiv animate={animations} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden px-8 md:px-16 py-16 md:py-20 text-center"
          style={{ backgroundColor: isDark ? "#161618" : "#111111" }}>
          <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse at center, ${colorScheme.primary} 0%, transparent 70%)` }} />
          <div className="relative z-10">
            <span className="text-xs tracking-[0.35em] uppercase font-medium mb-4 inline-block" style={{ color: colorScheme.primary }}>Reserve Your Experience</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight">Ready to Visit Us?</h2>
            <p className="text-white/60 mb-10 max-w-lg mx-auto text-lg">{"We'd love to welcome you. Call us or get directions to plan your visit."}</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href={`tel:${business.phone}`} className="px-8 py-3.5 rounded-full font-semibold text-sm tracking-wide transition-all hover:opacity-90 hover:shadow-lg"
                style={{ backgroundColor: colorScheme.primary, color: "#fff" }}>
                <Phone className="inline-block w-4 h-4 mr-2 -mt-0.5" />Call Now
              </a>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`} target="_blank" rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-full font-semibold text-sm tracking-wide border-2 border-white/30 text-white transition-all hover:border-white/60 hover:bg-white/10">
                <MapPin className="inline-block w-4 h-4 mr-2 -mt-0.5" />Directions
              </a>
            </div>
          </div>
        </AnimatedDiv>

      </main>

      {/* FOOTER */}
      <footer className="border-t py-12" style={{ backgroundColor: isDark ? "#0a0a0c" : "#111111", borderColor: isDark ? "#1e1e20" : "#222" }}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center gap-4 justify-center mb-8">
            <div className="h-px w-16 bg-white/10" />
            <Star className="w-3.5 h-3.5" fill={colorScheme.primary} stroke={colorScheme.primary} />
            <div className="h-px w-16 bg-white/10" />
          </div>
          <p className="text-lg font-semibold text-white mb-2">{business.name}</p>
          <p className="text-sm text-white/40">{business.address}</p>
          {business.website && (
            <a href={business.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-sm hover:underline" style={{ color: colorScheme.primary }}>
              <Globe className="w-3.5 h-3.5" />{business.website.replace(/^https?:\/\//, "")}
            </a>
          )}
          {business.socials && (
            <div className="flex items-center justify-center gap-5 mt-6">
              {business.socials.instagram && <a href={business.socials.instagram} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-75" style={{ color: colorScheme.primary }}><Instagram className="w-4 h-4" /></a>}
              {business.socials.facebook && <a href={business.socials.facebook} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-75" style={{ color: colorScheme.primary }}><Facebook className="w-4 h-4" /></a>}
              {business.socials.twitter && <a href={business.socials.twitter} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-75" style={{ color: colorScheme.primary }}><Twitter className="w-4 h-4" /></a>}
            </div>
          )}
          {!isPreview && (
            <p className="mt-8 text-xs text-white/25">Website created with <a href="/" className="underline" style={{ color: colorScheme.primary }}>MapToSite</a></p>
          )}
        </div>
      </footer>
      <MenuFloater business={business} colorScheme={colorScheme} />
    </div>
  )
}

// ─────────────────────────────────────────────
// PRO TEMPLATE: BOLD
// High-contrast, energetic. Numbered features, stats grid, color-accent sections.
// ─────────────────────────────────────────────
function BoldTemplate({ business, config, isPreview = false, onBusinessChange }: SiteTemplateProps) {
  const { colorScheme, fontStyle, animations } = config
  const isDark = colorScheme.id === "midnight"

  const handleRemovePhoto = (i: number) => {
    if (onBusinessChange) onBusinessChange({ ...business, photos: business.photos.filter((_, idx) => idx !== i) })
  }
  const handleUpdatePhotos = (newPhotos: any[]) => {
    if (onBusinessChange) onBusinessChange({ ...business, photos: newPhotos })
  }
  const handleUpdateDescription = (val: string) => {
    if (onBusinessChange) onBusinessChange({ ...business, description: val })
  }
  const handleUpdateFeature = (index: number, val: string) => {
    if (onBusinessChange) {
      const f = [...business.features]; f[index] = val
      onBusinessChange({ ...business, features: f })
    }
  }

  const fontClass = { sans: "font-sans", serif: "font-serif", rounded: "font-sans tracking-wide" }[fontStyle]
  const fadeIn = animations ? { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" as any }, transition: { duration: 0.55 } } : {}

  const bg = isDark ? "#0e0e10" : "#ffffff"
  const cardBg = isDark ? "#1a1a1e" : "#f4f4f6"
  const border = isDark ? "#2a2a30" : "#e4e4e8"
  const muted = isDark ? "#8a8a90" : "#6b6b70"

  return (
    <div className={cn("min-h-screen", fontClass)} style={{ backgroundColor: bg, color: isDark ? "#f0f0f4" : "#0e0e10" }}>

      {/* HERO */}
      <header className="relative h-screen min-h-[600px] overflow-hidden">
        {isPreview && onBusinessChange && (
          <div className="absolute top-6 right-6 z-20">
            <HeroBackgroundModal currentHero={business.heroImage || business.photos[0]?.url || ""} photos={business.photos} availablePhotos={business.availablePhotos} onChange={(url) => onBusinessChange({ ...business, heroImage: url })} />
          </div>
        )}
        <img src={business.heroImage || business.photos[0]?.url || "/placeholder.jpg"} alt={business.name}
          className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/65" />
        {/* Left accent stripe */}
        <div className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: colorScheme.primary }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(105deg, ${colorScheme.primary}28 0%, transparent 55%)` }} />

        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24 pb-20">
          <AnimatedDiv animate={animations} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-bold tracking-widest uppercase"
              style={{ backgroundColor: colorScheme.primary, color: "#fff" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
              {business.category}
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[0.95] tracking-tight">
              {business.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5" fill={i < Math.floor(business.rating) ? "#fbbf24" : "transparent"} stroke={i < Math.floor(business.rating) ? "#fbbf24" : "rgba(255,255,255,0.4)"} />
                ))}
                <span className="text-white font-bold text-sm ml-1">{business.rating}</span>
                <span className="text-white/60 text-sm">({business.totalReviews})</span>
              </div>
              <span className="text-white/60 text-sm font-medium">{business.priceLevel}</span>
            </div>
          </AnimatedDiv>
        </div>

        {/* Bottom contact strip */}
        <div className="absolute bottom-0 left-0 right-0 py-3.5 px-8 md:px-16 flex items-center justify-between"
          style={{ backgroundColor: colorScheme.primary }}>
          <div className="flex items-center gap-2 text-white text-sm">
            <MapPin className="w-4 h-4 shrink-0" /><span className="truncate">{business.address}</span>
          </div>
          <a href={`tel:${business.phone}`} className="flex items-center gap-2 text-white font-bold text-sm shrink-0">
            <Phone className="w-4 h-4" />{business.phone}
          </a>
        </div>
      </header>

      {/* STICKY BAR */}
      <div className="sticky top-0 z-10 border-b" style={{ backgroundColor: isDark ? "#1a1a1e" : "#ffffff", borderColor: border }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-5">
            <a href={`tel:${business.phone}`} className="flex items-center gap-2 font-bold text-sm transition-opacity hover:opacity-70" style={{ color: colorScheme.primary }}>
              <Phone className="w-4 h-4" />{business.phone}
            </a>
            <div className="hidden sm:flex items-center gap-2 text-sm" style={{ color: muted }}>
              <MapPin className="w-4 h-4" />{business.address}
            </div>
          </div>
          <a href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`} target="_blank" rel="noopener noreferrer"
            className="px-5 py-2 rounded-full font-bold text-sm text-white transition-all hover:opacity-90"
            style={{ backgroundColor: colorScheme.primary }}>
            Get Directions
          </a>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-16 space-y-24">

        {/* ABOUT + STATS */}
        <AnimatedDiv animate={animations} {...fadeIn} className="grid md:grid-cols-2 gap-12 items-center">
          <div className="min-w-0 overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-0.5 w-10" style={{ backgroundColor: colorScheme.primary }} />
              <span className="text-xs font-black tracking-[0.3em] uppercase" style={{ color: colorScheme.primary }}>About Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Who We Are</h2>
            <InlineTextArea value={business.description} onChange={handleUpdateDescription} disabled={!isPreview || !onBusinessChange}
              className="text-base leading-relaxed break-words" style={{ color: muted }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: cardBg }}>
              <p className="text-4xl font-black mb-1" style={{ color: colorScheme.primary }}>{business.rating}</p>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: muted }}>Rating</p>
            </div>
            <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: cardBg }}>
              <p className="text-4xl font-black mb-1" style={{ color: colorScheme.primary }}>{business.totalReviews}+</p>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: muted }}>Reviews</p>
            </div>
            <div className="col-span-2 p-6 rounded-2xl text-center" style={{ backgroundColor: colorScheme.primary }}>
              <p className="text-3xl font-black text-white mb-1">{business.features?.length || 4}+</p>
              <p className="text-xs font-bold uppercase tracking-wider text-white/80">Services Offered</p>
            </div>
          </div>
        </AnimatedDiv>

        {/* FEATURES — NUMBERED */}
        <AnimatedDiv animate={animations} {...fadeIn}>
          <div className="flex items-center gap-3 mb-12">
            <div className="h-0.5 w-10" style={{ backgroundColor: colorScheme.primary }} />
            <span className="text-xs font-black tracking-[0.3em] uppercase" style={{ color: colorScheme.primary }}>What We Offer</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...(business.features || []), "Edit Feature...", "Edit Feature...", "Edit Feature...", "Edit Feature..."].slice(0, 4).map((feature, i) => (
              <AnimatedDiv key={i} animate={animations} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={cn("p-6 rounded-2xl", animations && "transition-all hover:-translate-y-1")} style={{ backgroundColor: cardBg }}>
                <span className="block text-5xl font-black mb-3 leading-none select-none" style={{ color: colorScheme.primary + "38" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="h-0.5 w-8 mb-4" style={{ backgroundColor: colorScheme.primary }} />
                <InlineTextArea value={feature} rows={3} onChange={(v) => handleUpdateFeature(i, v)} disabled={!isPreview || !onBusinessChange}
                  className="text-sm font-semibold leading-relaxed w-full" />
              </AnimatedDiv>
            ))}
          </div>
        </AnimatedDiv>

        {/* GALLERY */}
        <AnimatedDiv animate={animations} {...fadeIn}>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="h-0.5 w-10" style={{ backgroundColor: colorScheme.primary }} />
              <h2 className="text-4xl font-black">Gallery</h2>
            </div>
            {isPreview && onBusinessChange && <PhotoManagerModal photos={business.photos} availablePhotos={business.availablePhotos} onChange={handleUpdatePhotos} />}
          </div>
          {business.photos.length > 0 ? (
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent className="-ml-4">
                {business.photos.map((photo, index) => (
                  <CarouselItem key={index} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                    <AnimatedDiv animate={animations} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}
                      className="relative overflow-hidden group rounded-xl aspect-square">
                      <img src={photo.url} alt={photo.caption} className={cn("w-full h-full object-cover", animations && "transition-transform duration-500 group-hover:scale-110")} />
                      <div className={cn("absolute inset-0 flex items-end p-4", animations ? "opacity-0 group-hover:opacity-100 transition-opacity" : "opacity-100")}
                        style={{ background: `linear-gradient(to top, ${colorScheme.primary}cc, transparent)` }}>
                        <span className="text-white font-bold text-sm">{photo.caption}</span>
                      </div>
                      {isPreview && onBusinessChange && (
                        <button onClick={() => handleRemovePhoto(index)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity hover:bg-destructive z-20 backdrop-blur-sm">
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
          ) : <p className="text-sm" style={{ color: muted }}>No photos available.</p>}
        </AnimatedDiv>

        {/* REVIEWS */}
        <AnimatedDiv animate={animations} {...fadeIn}>
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="h-0.5 w-10" style={{ backgroundColor: colorScheme.primary }} />
              <h2 className="text-4xl font-black">Reviews</h2>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: colorScheme.primary }}>
              <Star className="w-4 h-4 text-white" fill="white" stroke="white" />
              <span className="text-white font-black">{business.rating}</span>
              <span className="text-white/80 text-sm">({business.totalReviews})</span>
            </div>
          </div>
          {animations ? (
            <AnimatedReviews
              reviews={business.reviews}
              colorScheme={colorScheme}
              isDark={isDark}
              customStyles={{
                cardBg: cardBg,
                border: border,
                muted: muted,
                padding: "p-6",
                rounded: "rounded-xl",
                boxShadow: "none"
              }}
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {business.reviews.slice(0, 6).map((review, index) => (
                <div key={index} className="p-6 rounded-xl flex flex-col" style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}>
                  <div className="text-4xl font-black leading-none mb-3 select-none" style={{ color: colorScheme.primary }}>"</div>
                  <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: muted }}>"{review.text}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-black text-sm">{review.author}</p>
                      <div className="flex gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3" fill={i < review.rating ? "#fbbf24" : "transparent"} stroke={i < review.rating ? "#fbbf24" : "#d1d5db"} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs font-medium" style={{ color: muted }}>{review.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AnimatedDiv>

        {/* HOURS */}
        <AnimatedDiv animate={animations} {...fadeIn}>
          <div className="flex items-center gap-3 mb-10">
            <div className="h-0.5 w-10" style={{ backgroundColor: colorScheme.primary }} />
            <h2 className="text-4xl font-black">Hours</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {business.hours.map((item) => (
              <div key={item.day} className="p-4 rounded-xl flex flex-col gap-1" style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}>
                <span className="text-xs font-black uppercase tracking-wider" style={{ color: colorScheme.primary }}>{item.day}</span>
                <span className="font-semibold text-sm">{item.hours}</span>
              </div>
            ))}
          </div>
        </AnimatedDiv>

        {/* CTA */}
        <AnimatedDiv animate={animations} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden px-8 md:px-16 py-16 text-center"
          style={{ backgroundColor: colorScheme.primary }}>
          <span className="absolute inset-0 flex items-center justify-center text-[10rem] md:text-[14rem] font-black text-white/[0.04] select-none pointer-events-none leading-none">
            VISIT
          </span>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">Ready to Visit?</h2>
            <p className="text-white/75 text-lg mb-10 max-w-lg mx-auto">{"Come experience what makes us different. We can't wait to welcome you."}</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href={`tel:${business.phone}`} className="px-8 py-3.5 rounded-full font-black text-sm tracking-wide bg-white transition-all hover:opacity-90"
                style={{ color: colorScheme.primary }}>
                <Phone className="inline-block w-4 h-4 mr-2 -mt-0.5" />Call Now
              </a>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`} target="_blank" rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-full font-black text-sm tracking-wide border-2 border-white text-white transition-all hover:bg-white/15">
                <MapPin className="inline-block w-4 h-4 mr-2 -mt-0.5" />Directions
              </a>
            </div>
          </div>
        </AnimatedDiv>

      </main>

      {/* FOOTER */}
      <footer className="border-t py-10" style={{ borderColor: border, backgroundColor: bg }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-black text-lg">{business.name}</p>
              <p className="text-sm mt-1" style={{ color: muted }}>{business.address}</p>
              {business.website && (
                <a href={business.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-1 text-sm hover:underline" style={{ color: colorScheme.primary }}>
                  <Globe className="w-3.5 h-3.5" />{business.website.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
            {business.socials && (
              <div className="flex items-center gap-5">
                {business.socials.instagram && <a href={business.socials.instagram} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-75" style={{ color: colorScheme.primary }}><Instagram className="w-5 h-5" /></a>}
                {business.socials.facebook && <a href={business.socials.facebook} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-75" style={{ color: colorScheme.primary }}><Facebook className="w-5 h-5" /></a>}
                {business.socials.twitter && <a href={business.socials.twitter} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-75" style={{ color: colorScheme.primary }}><Twitter className="w-5 h-5" /></a>}
              </div>
            )}
          </div>
          {!isPreview && (
            <p className="mt-8 text-xs text-center" style={{ color: muted }}>
              Website created with <a href="/" className="underline" style={{ color: colorScheme.primary }}>MapToSite</a>
            </p>
          )}
        </div>
      </footer>
      <MenuFloater business={business} colorScheme={colorScheme} />
    </div>
  )
}

// ─────────────────────────────────────────────
// PRO TEMPLATE: EXECUTIVE
// Split-screen hero, sidebar stats, horizontal feature rows, trust-focused layout.
// ─────────────────────────────────────────────
function ExecutiveTemplate({ business, config, isPreview = false, onBusinessChange }: SiteTemplateProps) {
  const { colorScheme, fontStyle, animations } = config
  const isDark = colorScheme.id === "midnight"

  const handleRemovePhoto = (i: number) => {
    if (onBusinessChange) onBusinessChange({ ...business, photos: business.photos.filter((_, idx) => idx !== i) })
  }
  const handleUpdatePhotos = (newPhotos: any[]) => {
    if (onBusinessChange) onBusinessChange({ ...business, photos: newPhotos })
  }
  const handleUpdateDescription = (val: string) => {
    if (onBusinessChange) onBusinessChange({ ...business, description: val })
  }
  const handleUpdateFeature = (index: number, val: string) => {
    if (onBusinessChange) {
      const f = [...business.features]; f[index] = val
      onBusinessChange({ ...business, features: f })
    }
  }

  const fontClass = { sans: "font-sans", serif: "font-serif", rounded: "font-sans tracking-wide" }[fontStyle]
  const fadeIn = animations ? { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" as any }, transition: { duration: 0.55 } } : {}

  const bg = isDark ? "#0f1117" : "#f9fafb"
  const cardBg = isDark ? "#171923" : "#ffffff"
  const border = isDark ? "#252830" : "#e5e7eb"
  const muted = isDark ? "#8890a4" : "#6b7280"

  return (
    <div className={cn("min-h-screen", fontClass)} style={{ backgroundColor: bg, color: isDark ? "#e8ebf4" : "#111827" }}>

      {/* HERO — SPLIT SCREEN */}
      <header className="flex flex-col md:flex-row min-h-[85vh]">
        {/* Left: dark text panel */}
        <div className="relative flex-1 flex flex-col justify-center px-8 md:px-12 lg:px-20 py-16 md:py-0"
          style={{ backgroundColor: isDark ? "#0f1117" : "#111827" }}>
          <AnimatedDiv animate={animations} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2.5 mb-6">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colorScheme.primary }} />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-white/60">{business.category}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {business.name}
            </h1>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4" fill={i < Math.floor(business.rating) ? colorScheme.primary : "transparent"} stroke={i < Math.floor(business.rating) ? colorScheme.primary : "rgba(255,255,255,0.3)"} />
                ))}
              </div>
              <span className="text-white/80 font-semibold">{business.rating}</span>
              <span className="text-white/40">/</span>
              <span className="text-white/50 text-sm">{business.totalReviews} reviews</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={`tel:${business.phone}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90"
                style={{ backgroundColor: colorScheme.primary }}>
                <Phone className="w-4 h-4" />{business.phone}
              </a>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white/80 border border-white/20 transition-all hover:bg-white/10">
                <MapPin className="w-4 h-4" />Directions
              </a>
            </div>
          </AnimatedDiv>
        </div>
        {/* Right: image panel */}
        <div className="relative flex-1 min-h-[300px] md:min-h-0">
          {isPreview && onBusinessChange && (
            <div className="absolute top-6 right-6 z-20">
              <HeroBackgroundModal currentHero={business.heroImage || business.photos[0]?.url || ""} photos={business.photos} availablePhotos={business.availablePhotos} onChange={(url) => onBusinessChange({ ...business, heroImage: url })} />
            </div>
          )}
          <img src={business.heroImage || business.photos[0]?.url || "/placeholder.jpg"} alt={business.name}
            className={cn("w-full h-full object-cover", animations && "transition-transform duration-[6s] hover:scale-105")} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        </div>
      </header>

      {/* STICKY BAR */}
      <div className="sticky top-0 z-10 border-b" style={{ backgroundColor: isDark ? "#171923" : "#ffffff", borderColor: border }}>
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-5">
            <a href={`tel:${business.phone}`} className="flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70" style={{ color: colorScheme.primary }}>
              <Phone className="w-3.5 h-3.5" />{business.phone}
            </a>
            <div className="hidden sm:flex items-center gap-2 text-sm" style={{ color: muted }}>
              <MapPin className="w-3.5 h-3.5" />{business.address}
            </div>
          </div>
          <a href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`} target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90"
            style={{ backgroundColor: colorScheme.primary }}>
            Get Directions
          </a>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-16 space-y-20">

        {/* ABOUT + SIDEBAR STATS */}
        <AnimatedDiv animate={animations} {...fadeIn}>
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 rounded-full" style={{ backgroundColor: colorScheme.primary }} />
                <h2 className="text-2xl md:text-3xl font-bold">About Us</h2>
              </div>
              <InlineTextArea value={business.description} onChange={handleUpdateDescription} disabled={!isPreview || !onBusinessChange}
                className="text-base leading-[1.85] mb-6" style={{ color: muted }} />
            </div>
            <div className="space-y-4">
              <div className="p-5 rounded-xl border" style={{ backgroundColor: cardBg, borderColor: border }}>
                <div className="flex items-center gap-3 mb-1">
                  <Star className="w-5 h-5" fill={colorScheme.primary} stroke={colorScheme.primary} />
                  <span className="text-2xl font-bold">{business.rating}/5</span>
                </div>
                <p className="text-sm font-medium" style={{ color: muted }}>Average Rating</p>
              </div>
              <div className="p-5 rounded-xl border" style={{ backgroundColor: cardBg, borderColor: border }}>
                <div className="flex items-center gap-3 mb-1">
                  <Check className="w-5 h-5" style={{ color: colorScheme.primary }} />
                  <span className="text-2xl font-bold">{business.totalReviews}+</span>
                </div>
                <p className="text-sm font-medium" style={{ color: muted }}>Verified Reviews</p>
              </div>
              <div className="p-5 rounded-xl border" style={{ backgroundColor: cardBg, borderColor: border }}>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: colorScheme.primary }} />
                  <p className="text-sm font-semibold">{business.address}</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedDiv>

        {/* FEATURES — HORIZONTAL ROWS */}
        <AnimatedDiv animate={animations} {...fadeIn}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 rounded-full" style={{ backgroundColor: colorScheme.primary }} />
            <h2 className="text-2xl md:text-3xl font-bold">What We Offer</h2>
          </div>
          <div className="space-y-3">
            {[...(business.features || []), "Edit Feature...", "Edit Feature...", "Edit Feature...", "Edit Feature..."].slice(0, 4).map((feature, i) => (
              <AnimatedDiv key={i} animate={animations} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className={cn("flex items-center gap-6 p-5 rounded-xl border", animations && "transition-all hover:shadow-md")}
                style={{ backgroundColor: cardBg, borderColor: border }}>
                <span className="text-2xl font-black w-10 text-center flex-shrink-0" style={{ color: colorScheme.primary + "45" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="w-px h-8 flex-shrink-0" style={{ backgroundColor: border }} />
                <Check className="w-5 h-5 flex-shrink-0" style={{ color: colorScheme.primary }} />
                <InlineTextArea value={feature} rows={1} onChange={(v) => handleUpdateFeature(i, v)} disabled={!isPreview || !onBusinessChange}
                  className="font-semibold w-full text-sm" />
              </AnimatedDiv>
            ))}
          </div>
        </AnimatedDiv>

        {/* GALLERY */}
        <AnimatedDiv animate={animations} {...fadeIn}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 rounded-full" style={{ backgroundColor: colorScheme.primary }} />
              <h2 className="text-2xl md:text-3xl font-bold">Gallery</h2>
            </div>
            {isPreview && onBusinessChange && <PhotoManagerModal photos={business.photos} availablePhotos={business.availablePhotos} onChange={handleUpdatePhotos} />}
          </div>
          {business.photos.length > 0 ? (
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent className="-ml-4">
                {business.photos.map((photo, index) => (
                  <CarouselItem key={index} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                    <AnimatedDiv animate={animations} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.07 }}
                      className="relative overflow-hidden group rounded-xl aspect-[4/3] border" style={{ borderColor: border }}>
                      <img src={photo.url} alt={photo.caption} className={cn("w-full h-full object-cover", animations && "transition-transform duration-500 group-hover:scale-105")} />
                      <div className={cn("absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4",
                        animations ? "opacity-0 group-hover:opacity-100 transition-opacity" : "opacity-100")}>
                        <span className="text-white text-sm font-medium">{photo.caption}</span>
                      </div>
                      {isPreview && onBusinessChange && (
                        <button onClick={() => handleRemovePhoto(index)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity hover:bg-destructive z-20 backdrop-blur-sm">
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
          ) : <p className="text-sm" style={{ color: muted }}>No photos available.</p>}
        </AnimatedDiv>

        {/* REVIEWS */}
        <AnimatedDiv animate={animations} {...fadeIn}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 rounded-full" style={{ backgroundColor: colorScheme.primary }} />
              <h2 className="text-2xl md:text-3xl font-bold">Client Reviews</h2>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" fill="#fbbf24" stroke="#fbbf24" />
              <span className="text-xl font-bold">{business.rating}</span>
              <span className="text-sm" style={{ color: muted }}>({business.totalReviews})</span>
            </div>
          </div>
          {animations ? (
            <AnimatedReviews
              reviews={business.reviews}
              colorScheme={colorScheme}
              isDark={isDark}
              customStyles={{
                cardBg: cardBg,
                border: border,
                muted: muted,
                padding: "p-6",
                rounded: "rounded-xl",
                boxShadow: "none"
              }}
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {business.reviews.slice(0, 6).map((review, index) => (
                <div key={index} className="p-6 rounded-xl border flex flex-col" style={{ backgroundColor: cardBg, borderColor: border }}>
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5" fill={i < review.rating ? "#fbbf24" : "transparent"} stroke={i < review.rating ? "#fbbf24" : "#d1d5db"} />
                    ))}
                  </div>
                  {review.jtbdHeader && <h3 className="font-semibold text-sm mb-2">{review.jtbdHeader}</h3>}
                  <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: muted }}>"{review.text}"</p>
                  <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: border }}>
                    <p className="font-semibold text-sm">{review.author}</p>
                    <span className="text-xs" style={{ color: muted }}>{review.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AnimatedDiv>

        {/* HOURS + CONTACT */}
        <AnimatedDiv animate={animations} {...fadeIn}>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 rounded-full" style={{ backgroundColor: colorScheme.primary }} />
                <h2 className="text-2xl md:text-3xl font-bold">Opening Hours</h2>
              </div>
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: border }}>
                {business.hours.map((item, i) => (
                  <div key={item.day} className={cn("flex justify-between items-center px-5 py-3.5", i !== business.hours.length - 1 && "border-b")}
                    style={{ borderColor: border, backgroundColor: i % 2 === 0 ? cardBg : "transparent" }}>
                    <span className="font-semibold text-sm">{item.day}</span>
                    <span className="text-sm" style={{ color: muted }}>{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-8 rounded-xl border" style={{ borderColor: border, backgroundColor: cardBg }}>
              <h3 className="font-bold text-lg mb-5">Contact Us</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: colorScheme.primary }} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: muted }}>Phone</p>
                    <a href={`tel:${business.phone}`} className="font-semibold text-sm hover:underline" style={{ color: colorScheme.primary }}>{business.phone}</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: colorScheme.primary }} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: muted }}>Location</p>
                    <p className="font-semibold text-sm">{business.address}</p>
                  </div>
                </div>
                {business.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: colorScheme.primary }} />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: muted }}>Website</p>
                      <a href={business.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-sm hover:underline break-all" style={{ color: colorScheme.primary }}>
                        {business.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </AnimatedDiv>

        {/* CTA */}
        <AnimatedDiv animate={animations} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12 rounded-2xl border"
          style={{ backgroundColor: cardBg, borderColor: colorScheme.primary + "50" }}>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Ready to Visit Us?</h2>
            <p className="text-sm md:text-base" style={{ color: muted }}>{"We'd love to hear from you. Reach out anytime during our business hours."}</p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <a href={`tel:${business.phone}`} className="px-6 py-3 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90"
              style={{ backgroundColor: colorScheme.primary }}>
              <Phone className="inline-block w-4 h-4 mr-2 -mt-0.5" />Call Now
            </a>
            <a href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`} target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg font-semibold text-sm border-2 transition-all hover:bg-muted/50"
              style={{ borderColor: colorScheme.primary, color: colorScheme.primary }}>
              <MapPin className="inline-block w-4 h-4 mr-2 -mt-0.5" />Directions
            </a>
          </div>
        </AnimatedDiv>

      </main>

      {/* FOOTER */}
      <footer className="border-t py-10" style={{ borderColor: border, backgroundColor: bg }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colorScheme.primary }} />
                <p className="font-bold text-lg">{business.name}</p>
              </div>
              <p className="text-sm" style={{ color: muted }}>{business.address}</p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2">
              {business.website && (
                <a href={business.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm hover:underline" style={{ color: colorScheme.primary }}>
                  <Globe className="w-3.5 h-3.5" />{business.website.replace(/^https?:\/\//, "")}
                </a>
              )}
              {business.socials && (
                <div className="flex items-center gap-4 mt-2">
                  {business.socials.instagram && <a href={business.socials.instagram} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-75" style={{ color: colorScheme.primary }}><Instagram className="w-4 h-4" /></a>}
                  {business.socials.facebook && <a href={business.socials.facebook} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-75" style={{ color: colorScheme.primary }}><Facebook className="w-4 h-4" /></a>}
                  {business.socials.twitter && <a href={business.socials.twitter} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-75" style={{ color: colorScheme.primary }}><Twitter className="w-4 h-4" /></a>}
                </div>
              )}
            </div>
          </div>
          {!isPreview && (
            <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: border }}>
              <p className="text-xs" style={{ color: muted }}>
                Website created with <a href="/" className="underline" style={{ color: colorScheme.primary }}>MapToSite</a>
              </p>
            </div>
          )}
        </div>
      </footer>
      <MenuFloater business={business} colorScheme={colorScheme} />
    </div>
  )
}
