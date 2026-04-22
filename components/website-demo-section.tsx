"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, ShoppingBag, Star, Play } from "lucide-react"

const demos = [
  {
    id: "website",
    icon: Globe,
    label: "Gym Website",
    title: "A full gym website — from your Google Maps link, in 60 seconds",
    description: "Real photos, real reviews, your trainers, membership plans, contact form — all pulled automatically from Google Maps. No templates to fill, no design decisions to make.",
    gif: "/website-demo.gif",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    activeBg: "bg-primary",
    bullets: [
      "Hero section with your actual gym photos",
      "Google reviews front and centre",
      "Trainer profiles, class schedules, membership plans",
      "Contact form + WhatsApp button + Google Maps embed",
    ],
  },
  {
    id: "ecommerce",
    icon: ShoppingBag,
    label: "Sell Products",
    title: "Sell supplements, gear & apparel directly from your gym site",
    description: "Add protein, gym accessories, or apparel with photos and prices. Customers browse, add to cart, and order via WhatsApp — no payment gateway setup needed.",
    gif: "/ecommerce-demo.gif",
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-200",
    activeBg: "bg-pink-600",
    bullets: [
      "Add products with photos, descriptions, and prices",
      "Cart and checkout built-in",
      "Orders sent directly to your WhatsApp",
      "No payment gateway setup required",
    ],
  },
  {
    id: "reviews",
    icon: Star,
    label: "Reviews & Trust",
    title: "Your Google reviews — displayed where they actually convert",
    description: "Every review you've earned on Google is automatically pulled in and shown on your website. Social proof that builds trust before a new member even walks in.",
    gif: "/reviews-demo.gif",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    activeBg: "bg-amber-600",
    bullets: [
      "Reviews synced automatically from Google Maps",
      "Star rating displayed prominently",
      "Member photos and review text included",
      "Updates automatically as you get new reviews",
    ],
  },
]

function GifPlaceholder({ src, label }: { src: string; label: string }) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  if (errored) {
    return (
      <div className="w-full aspect-video bg-muted/60 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
          <Play className="w-7 h-7 opacity-40" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-sm">GIF preview coming soon</p>
          <p className="text-xs mt-1 opacity-60">Drop <span className="font-mono">{src}</span> into <span className="font-mono">/public</span></p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border shadow-xl bg-muted/30">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={label}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
      />
    </div>
  )
}

export function WebsiteDemoSection() {
  const [active, setActive] = useState("website")
  const demo = demos.find((d) => d.id === active)!

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm tracking-wide uppercase mb-3 block">Website & Ecommerce</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            A real gym website — not a template, not a form
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your actual photos, reviews, and info from Google Maps — turned into a professional website with ecommerce, in 60 seconds flat.
          </p>
        </motion.div>

        {/* Tab buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {demos.map((d) => (
            <button
              key={d.id}
              onClick={() => setActive(d.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                active === d.id
                  ? `${d.activeBg} text-white border-transparent shadow-md`
                  : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              <d.icon className="w-4 h-4" />
              {d.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: GIF */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
            >
              <GifPlaceholder src={demo.gif} label={demo.label} />
            </motion.div>
          </AnimatePresence>

          {/* Right: description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${demo.bg} ${demo.color} border ${demo.border}`}>
                <demo.icon className="w-4 h-4" />
                {demo.label}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold leading-snug">{demo.title}</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">{demo.description}</p>
              <ul className="space-y-2 pt-2">
                {demo.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className={`mt-1 w-4 h-4 rounded-full ${demo.bg} ${demo.color} border ${demo.border} flex items-center justify-center shrink-0 text-[10px] font-black`}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
