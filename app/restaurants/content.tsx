"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  UtensilsCrossed, X, LayoutGrid, LogOut, Menu as MenuIcon,
  Zap, Sparkles, Globe, Tag, CalendarCheck, MessageCircle,
  ChevronDown, ChevronUp, ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { LoginModal } from "@/components/login-modal"
import { RestaurantHeroVisual } from "@/components/restaurant-hero-visual"
import { PricingSection } from "@/components/pricing-section"
import { Footer } from "@/components/footer"

// ─── Banner ───────────────────────────────────────────────────────────────────

function ChallengeBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-red-600 text-white">
      <div className="max-w-6xl mx-auto px-4 h-10 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold">
        <span>🇮🇳 For Restaurant Owners in India</span>
      </div>
    </div>
  )
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function RestaurantNav() {
  const { data: session, status } = useSession()
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { label: "Home", href: "#" },
    { label: "Features", href: "#features" },
    { label: "Examples", href: "#examples" },
    { label: "Pricing", href: "#pricing" },
    { label: "Blog", href: "/blog" },
  ]

  return (
    <>
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} accent="red" />
      <nav className="fixed top-10 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-foreground">
              MapToSite <span className="text-red-600">Restaurants</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-7">
            {links.map(l => (
              <a key={l.label} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 rounded-full focus:outline-none">
                    <span className="text-sm font-medium text-muted-foreground">{session.user?.name}</span>
                    <Avatar className="w-8 h-8 border-2 border-red-200 cursor-pointer">
                      <AvatarImage src={session.user?.image || ""} />
                      <AvatarFallback className="bg-red-50 text-red-600 text-xs font-bold">{session.user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel className="flex flex-col gap-0.5">
                    <span className="font-semibold text-sm">{session.user?.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">{session.user?.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/gym/sites" className="flex items-center gap-2 cursor-pointer">
                      <LayoutGrid className="w-4 h-4" /> Gym Sites
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/food/sites" className="flex items-center gap-2 cursor-pointer">
                      <LayoutGrid className="w-4 h-4" /> Food Sites
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={() => signOut()} className="cursor-pointer">
                    <LogOut className="w-4 h-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setLoginModalOpen(true)}>Log in</Button>
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white font-bold" onClick={() => setLoginModalOpen(true)}>Get Started</Button>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg px-4 py-4 flex flex-col gap-3"
            >
              {links.map(l => (
                <a key={l.label} href={l.href} className="text-sm font-semibold py-1" onClick={() => setMobileOpen(false)}>{l.label}</a>
              ))}
              <div className="border-t border-border pt-3 flex flex-col gap-2">
                {session ? (
                  <>
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
                      <Link href="/gym/sites" onClick={() => setMobileOpen(false)}><LayoutGrid className="w-4 h-4" /> Gym Sites</Link>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
                      <Link href="/food/sites" onClick={() => setMobileOpen(false)}><LayoutGrid className="w-4 h-4" /> Food Sites</Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-destructive" onClick={() => signOut()}>
                      <LogOut className="w-4 h-4" /> Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full" onClick={() => { setMobileOpen(false); setLoginModalOpen(true) }}>Log in</Button>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold" onClick={() => { setMobileOpen(false); setLoginModalOpen(true) }}>Get Started</Button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="pt-32 pb-12 px-4">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-10 items-center">

          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <motion.span
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-200 mb-5"
            >
              🛡️ If not live in 60s — website + lead system — 50% off. We challenge you.
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-[1.1] tracking-tight mb-5"
            >
              Restaurant Website{" "}
              <span className="text-red-600">+ Lead Management</span>
              {" "}— Live in 60 Seconds
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed"
            >
              Run offers, accept bookings &amp; manage customer leads — all from one dashboard.{" "}
              <span className="font-black text-foreground">Restaurant website included.</span> No tech knowledge needed.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
              className="flex flex-col items-center md:items-start gap-4"
            >
              <Button
                size="lg"
                className="h-14 px-8 font-black text-base shadow-lg bg-red-600 hover:bg-red-700 text-white shadow-red-600/25"
                onClick={() => window.dispatchEvent(new Event("focus-gym-input"))}
              >
                Get My Restaurant Online
                <Zap className="ml-2 w-5 h-5" />
              </Button>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
                <a href="#examples" className="inline-flex items-center gap-1.5 h-11 px-5 text-sm font-black border-2 border-red-600 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                  🌐 See Live Examples
                </a>
                <a href="#features" className="inline-flex items-center gap-1.5 h-11 px-5 text-sm font-black border-2 border-border text-foreground hover:bg-muted/60 rounded-xl transition-colors">
                  ✨ See All Features
                </a>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
          >
            <RestaurantHeroVisual />
          </motion.div>

        </div>
      </div>
    </section>
  )
}

// ─── Problem ─────────────────────────────────────────────────────────────────

function Problem() {
  const pains = [
    { icon: "💸", title: "Paying 20–30% to Zomato & Swiggy", desc: "Every order from a food aggregator takes a huge cut. You're doing all the work, they're keeping the profit." },
    { icon: "📵", title: "No way to reach your own customers", desc: "Hundreds of visitors find you on Google but you can't send them offers or bring them back. You don't have their contacts." },
    { icon: "📞", title: "Bookings coming in on scattered calls", desc: "Table reservations by phone, orders on WhatsApp — no record, no system. Things fall through constantly." },
    { icon: "🏃", title: "Competitors look more professional", desc: "The restaurant nearby has a website with menu, photos and online booking. You're just a Google listing." },
  ]

  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-red-200 mb-5">
            The Problem
          </span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            Why Your Restaurant Isn&apos;t Getting<br />Enough Direct Orders
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          {pains.map(({ icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="bg-white border border-border rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl leading-none shrink-0 mt-0.5">{icon}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <X className="w-4 h-4 text-red-500 shrink-0 stroke-[3]" />
                    <h3 className="font-bold text-sm text-foreground leading-tight">{title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-red-600 text-white rounded-2xl p-8 text-center"
        >
          <p className="text-xl font-black mb-1">You don&apos;t have a discovery problem.</p>
          <p className="text-xl font-black opacity-80">You have a conversion + retention problem.</p>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Example Sites ────────────────────────────────────────────────────────────

const EXAMPLES = [
  { name: "The Pizza Bakery", cuisine: "Pizza & Bakery", url: "https://maptosite.app/site/the-pizza-bakery-hsr-layout", thumb: "/example-pizza-bakery.png" },
  { name: "Desano Pizzeria Napoletana", cuisine: "Neapolitan Pizza", url: "https://maptosite.app/site/desano-pizzeria-napoletana?published=true", thumb: "/example-desano.png" },
  { name: "Masa of Echo Park", cuisine: "Bakery & Cafe", url: "https://maptosite.app/site/masa-of-echo-park-bakery-cafe?published=true", thumb: "/example-masa.png" },
]

function ExampleSites() {
  return (
    <section id="examples" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-red-200 mb-5">
            <Sparkles className="w-3 h-3" /> Live Examples
          </span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Restaurants Already on MapToSite</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Real websites built from Google Maps listings — live and converting.</p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6">
          {EXAMPLES.map(({ name, cuisine, url, thumb }, i) => (
            <motion.a
              key={name} href={url} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="group rounded-2xl border border-border overflow-hidden bg-card hover:border-red-400 hover:shadow-xl transition-all duration-300 block"
            >
              <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
                <img src={thumb} alt={name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{cuisine}</span>
                <h3 className="font-black text-base mt-2 mb-0.5 group-hover:text-red-600 transition-colors">{name}</h3>
                <p className="text-xs text-muted-foreground font-medium">View live site →</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── What you get ─────────────────────────────────────────────────────────────

function WhatYouGet() {
  const features = [
    { icon: Globe,         title: "Restaurant website — included", desc: "Built from your Google Maps listing in 60 seconds. Photos, menu, reviews and hours — all auto-filled. No design skills needed." },
    { icon: Tag,           title: "Offers & promotions",           desc: "Run happy hour deals, festive specials, new dish launches — live on your website instantly. No developer, no waiting." },
    { icon: "📲",          title: "Send offers to customers",      desc: "Broadcast your deals directly to existing customers and bring them back more often. No third-party app needed." },
    { icon: CalendarCheck, title: "Booking & reservation system",  desc: "Accept table reservations directly from your website. Simple form, instant notification — no phone calls needed." },
    { icon: MessageCircle, title: "Lead & enquiry management",     desc: "Track every booking and enquiry in one dashboard. Stop managing leads in WhatsApp threads and missed calls." },
  ]

  return (
    <section id="features" className="py-24 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">All-in-One Restaurant Platform</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Website, offers, bookings and leads — all from one place. No extra apps. No commissions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="bg-card border border-border rounded-2xl p-6 hover:border-red-200 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors text-2xl">
                {typeof icon === "string" ? icon : (() => { const Icon = icon; return <Icon className="w-6 h-6 text-red-600" /> })()}
              </div>
              <h3 className="font-black text-base mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Urgency ─────────────────────────────────────────────────────────────────

function Urgency() {
  return (
    <section className="py-16 px-4 bg-amber-50 border-y border-amber-200">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-4xl mb-4">⏳</div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3 text-amber-900">
            Limited spots available each month
          </h2>
          <p className="text-amber-800 text-base leading-relaxed max-w-xl mx-auto">
            We onboard only a limited number of restaurants each month to ensure proper setup and support.
            If you&apos;re seeing this, spots are still open — but they fill up fast.
          </p>
          <a
            href={`https://wa.me/917452008033?text=${encodeURIComponent("Hi, I'd like to claim my spot and get a demo for MapToSite Restaurants!")}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 h-12 px-8 font-black bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/25 rounded-lg text-sm transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Claim Your Spot Now
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  const faqs = [
    { q: "Do I need to already be on Google Maps?", a: "Yes — and most restaurants already are. If you've ever appeared in a Google Search, you have a Maps listing. We pull your photos, reviews, hours and contact info from there automatically." },
    { q: "How does the booking system work?", a: "Your website includes a reservation form. Customers fill in their name, date, time and party size — you get notified instantly. No third-party platform, no commission." },
    { q: "How do I run offers and promotions?", a: "From your dashboard, publish any offer — Happy Hour deals, festive specials, new dish launches — and they appear on your website immediately. No developer, no waiting." },
    { q: "How do I send offers to my customers?", a: "Customers who enquire or book through your website are saved in your dashboard. You can broadcast offers directly to them without any third-party app." },
    { q: "Will my menu, photos and hours stay updated?", a: "Yes. Your website syncs with your Google Maps listing. Update your hours on Google and your website reflects it automatically." },
    { q: "Is there a contract or lock-in?", a: "No. Cancel any time. We bill monthly. No hidden fees, no setup costs." },
  ]

  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">Common questions</h2>
        </motion.div>
        <div className="space-y-3">
          {faqs.map(({ q, a }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="border border-border rounded-2xl overflow-hidden bg-card"
            >
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-bold text-sm">{q}</span>
                {open === i ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

const WA_DEMO_URL = `https://wa.me/917452008033?text=${encodeURIComponent("Hi, I'd like to get a demo for MapToSite Restaurants!")}`

function FinalCTA() {
  return (
    <section className="py-24 px-4 bg-red-600 text-white">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-6xl mb-6">🍽️</div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
            Set up your restaurant website + management in 60 seconds
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Website, offers, bookings and leads — all in one place. If it takes longer than 60 seconds, you get 50% off. No questions asked.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={WA_DEMO_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 h-14 px-8 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-base rounded-xl shadow-lg transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Get Demo on WhatsApp
            </a>
            <Button
              size="lg" variant="secondary"
              className="h-14 px-8 font-black text-base"
              onClick={() => window.dispatchEvent(new Event("focus-gym-input"))}
            >
              Set Up Myself <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
          <p className="text-white/40 text-xs mt-6">Free to start · No credit card · 60 seconds to go live</p>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function RestaurantLanding() {
  return (
    <div className="min-h-screen bg-background">
      <ChallengeBanner />
      <RestaurantNav />
      <Hero />
      <Problem />
      <ExampleSites />
      <WhatYouGet />
      <div id="pricing">
        <PricingSection />
      </div>
      <Urgency />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  )
}
