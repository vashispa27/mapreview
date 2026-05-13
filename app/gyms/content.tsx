"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin, X, LayoutGrid, LogOut, Menu as MenuIcon,
  CheckCircle2, AlertTriangle, Zap, Sparkles, Users,
  MessageSquare, BarChart2, RefreshCw, Shield,
  ChevronDown, ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { LoginModal } from "@/components/login-modal"
import { GymHeroVisual } from "@/components/gym-hero-visual"
import { PricingSection } from "@/components/pricing-section"
import { Footer } from "@/components/footer"

// ─── Nav ─────────────────────────────────────────────────────────────────────

function GymNav() {
  const { data: session, status } = useSession()
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { label: "Home", href: "#" },
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Blog", href: "/blog" },
  ]

  return (
    <>
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
      <nav className="fixed top-10 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">
              MapToSite <span className="text-primary">Fitness</span>
            </span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {links.map(l => (
              <a key={l.label} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 rounded-full focus:outline-none">
                    <span className="text-sm font-medium text-muted-foreground">{session.user?.name}</span>
                    <Avatar className="w-8 h-8 border-2 border-primary/20 cursor-pointer">
                      <AvatarImage src={session.user?.image || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {session.user?.name?.[0]}
                      </AvatarFallback>
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
                    <Link href="/my-sites" className="flex items-center gap-2 cursor-pointer">
                      <LayoutGrid className="w-4 h-4" /> My Sites
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
                <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setLoginModalOpen(true)}>
                  Log in
                </Button>
                <Button size="sm" className="font-bold" onClick={() => setLoginModalOpen(true)}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
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
                      <Link href="/my-sites" onClick={() => setMobileOpen(false)}><LayoutGrid className="w-4 h-4" /> My Sites</Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-destructive" onClick={() => signOut()}>
                      <LogOut className="w-4 h-4" /> Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full" onClick={() => { setMobileOpen(false); setLoginModalOpen(true) }}>Log in</Button>
                    <Button className="w-full font-bold" onClick={() => { setMobileOpen(false); setLoginModalOpen(true) }}>Get Started</Button>
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

          {/* Left — text + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <motion.span
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-200 mb-5"
            >
              🛡️ If not live in 60s — website + management software — 50% off. We challenge you.
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-[1.1] tracking-tight mb-5"
            >
              Gym Management Software{" "}
              <span className="text-primary">+ Website</span>
              {" "}— Live in 60 Seconds
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed"
            >
              Manage members, payment reminders, GST filing &amp; leads — all from one dashboard.{" "}
              <span className="font-black text-foreground">Gym website included.</span> Ditch the spreadsheets. No tech knowledge needed.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
              className="flex flex-col items-center md:items-start gap-4"
            >
              <Button
                size="lg"
                className="h-14 px-8 font-black text-base shadow-lg shadow-primary/25"
                onClick={() => window.dispatchEvent(new Event("focus-gym-input"))}
              >
                Set Up My Gym Now
                <Zap className="ml-2 w-5 h-5" />
              </Button>

              {/* Secondary actions */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
                <a
                  href="/demo-console"
                  className="inline-flex items-center gap-1.5 h-11 px-5 text-sm font-black border-2 border-primary text-primary hover:bg-primary/5 rounded-xl transition-colors"
                >
                  📊 Try Instant Demo
                </a>
                <a
                  href="/gyms/template"
                  className="inline-flex items-center gap-1.5 h-11 px-5 text-sm font-black border-2 border-border text-foreground hover:bg-muted/60 rounded-xl transition-colors"
                >
                  🌐 Try Website Editor
                </a>
              </div>
            </motion.div>
          </motion.div>

            {/* Right — visual */}
            <motion.div
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            >
              <GymHeroVisual />
            </motion.div>

          </div>
        </div>
      </section>
  )
}

// ─── Problem ─────────────────────────────────────────────────────────────────

function Problem() {
  const pains = [
    { icon: "📊", title: "Members tracked in Excel or WhatsApp", desc: "You're managing renewals, payments and plans across chat threads and spreadsheets. Things get missed." },
    { icon: "🏃", title: "Leads go to competitors", desc: "The gym down the street has a proper website. You don't. They get the booking. You don't." },
    { icon: "🔕", title: "Renewals slip through", desc: "No system to remind members when their plan ends. You chase them manually — or just lose them." },
    { icon: "💸", title: "No record of who has paid", desc: "Payment tracking in WhatsApp or a notebook means you're always guessing who has paid and who hasn't." },
  ]

  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-red-200 mb-5">
            <AlertTriangle className="w-3 h-3" /> The Problem
          </span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            Why Your Gym Isn&apos;t Getting<br />Enough Enquiries
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
          className="bg-primary text-primary-foreground rounded-2xl p-8 text-center"
        >
          <p className="text-xl font-black mb-1">Your gym is growing. Your tools are not.</p>
          <p className="text-xl font-black opacity-80">It&apos;s time to ditch the spreadsheets.</p>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Solution ─────────────────────────────────────────────────────────────────

function Solution() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-primary/20 mb-5">
            <CheckCircle2 className="w-3 h-3" /> The Solution
          </span>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            MapToSite turns your Google traffic into actual enquiries using a simple, automated system —
            built from your Google Maps listing in 60 seconds.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Example Sites ────────────────────────────────────────────────────────────

const GYM_EXAMPLES = [
  {
    name: "Tiger Fitness",
    url: "https://maptosite.app/site/tigerfitness",
    thumb: "/example-tigerfitness.jpg",
    tag: "Strength & Conditioning",
  },
  {
    name: "Fitness Empire",
    url: "https://maptosite.app/site/fitness-empire",
    thumb: "/example-fitness-empire.jpg",
    tag: "Multi-sport Gym",
  },
  {
    name: "Dynamo Fitness Gym",
    url: "https://maptosite.app/site/dynamo-fitness-gym",
    thumb: "/example-dynamo-fitness.jpg",
    tag: "Personal Training",
  },
]

function ExampleSites() {
  return (
    <section id="examples" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-primary/20 mb-5">
            <Sparkles className="w-3 h-3" /> Live Examples
          </span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            Gyms Already on MapToSite
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Real websites built from Google Maps listings — live and converting.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6">
          {GYM_EXAMPLES.map(({ name, url, thumb, tag }, i) => (
            <motion.a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="group rounded-2xl border border-border overflow-hidden bg-card hover:border-primary/40 hover:shadow-xl transition-all duration-300 block"
            >
              <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumb}
                  alt={name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const t = e.currentTarget
                    t.style.display = "none"
                    const parent = t.parentElement
                    if (parent) {
                      parent.innerHTML = `<div class="w-full h-full flex items-center justify-center"><span class="text-5xl">🏋️</span></div>`
                    }
                  }}
                />
              </div>
              <div className="p-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
                <h3 className="font-black text-base mt-2 mb-0.5 group-hover:text-primary transition-colors">{name}</h3>
                <p className="text-xs text-muted-foreground font-medium">View live site →</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── How it works ─────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    { number: "01", emoji: "🔍", title: "Someone finds your gym on Google", desc: "They search 'gym near me' and your listing appears. Your Google reviews, photos, and location are all there already." },
    { number: "02", emoji: "🌐", title: "They land on your optimized page", desc: "MapToSite builds a professional page from your listing — your photos, reviews, membership plans, and a clear CTA to contact you." },
    { number: "03", emoji: "💬", title: "They message or book instantly", desc: "A WhatsApp enquiry button and booking form removes all friction. No missed calls, no lost leads — it goes straight to you." },
  ]

  const results = [
    { icon: BarChart2, label: "More enquiries from Google" },
    { icon: Users, label: "Increased walk-ins" },
    { icon: Sparkles, label: "Better first impression" },
    { icon: RefreshCw, label: "Less manual follow-up" },
  ]

  return (
    <section id="how-it-works" className="py-24 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground">Three steps. Fully automated.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map(({ number, emoji, title, desc }, i) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="relative text-center"
            >
              <div className="text-8xl font-black text-primary/6 absolute -top-4 left-1/2 -translate-x-1/2 select-none pointer-events-none leading-none">
                {number}
              </div>
              <div className="relative z-10">
                <div className="text-5xl mb-4">{emoji}</div>
                <h3 className="text-lg font-black mb-3 tracking-tight">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
              {i < 2 && <span className="hidden md:block absolute top-8 -right-5 text-primary/30 text-2xl font-black">→</span>}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-white border border-border rounded-2xl p-8"
        >
          <p className="text-center text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">What changes after this</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {results.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 bg-primary/5 rounded-xl p-4">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-bold text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── What you get ─────────────────────────────────────────────────────────────

function WhatYouGet() {
  const features = [
    { icon: "👥", title: "Member management", desc: "Add members, track their status, assign plans. See who is active, expired, or due for renewal — all in one place." },
    { icon: "💰", title: "Payment tracking", desc: "Record every payment as it comes in. No more chasing or guessing who has paid. Clear history for every member." },
    { icon: "📋", title: "Lead & enquiry tracking", desc: "Every enquiry from your website is logged automatically. Follow up on time and stop losing interested people." },
    { icon: "🔄", title: "Renewal reminders", desc: "Members get an automatic reminder before their plan expires. You collect on time without calling anyone." },
    { icon: "🌐", title: "Gym website — included free", desc: "A proper gym website built from your Google Maps listing in 60 seconds. Photos, reviews, and hours auto-filled." },
  ]

  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">All-in-One Gym Software</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Members, payments, leads and your website — all from one dashboard. No extra apps. No extra cost.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors text-2xl">
                {icon}
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
            We onboard only a limited number of gyms each month to ensure proper setup and support.
            If you&apos;re seeing this, spots are still open — but they fill up fast.
          </p>
          <a
            href={`https://wa.me/917452008033?text=${encodeURIComponent("Hi, I'd like to claim my spot and get a demo for MapToSite Fitness!")}`}
            target="_blank"
            rel="noopener noreferrer"
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
    { q: "Do I need to already be on Google Maps?", a: "Yes — and most gyms already are. If your gym has ever shown up in a Google search, you have a Maps listing. We pull your photos, reviews, hours, and contact info from there automatically." },
    { q: "How long does setup take?", a: "Your website is live in 60 seconds. Just paste your Google Maps link or search your gym name, and we build the page automatically. You can then customize it further." },
    { q: "How does the WhatsApp enquiry system work?", a: "We add a prominent WhatsApp button on your page. When a visitor clicks it, they go straight to a pre-filled WhatsApp chat with your gym number. No apps to install, no forms to fill — just a direct message." },
    { q: "What is the lead tracking dashboard?", a: "A simple dashboard where every enquiry from your website is logged automatically — name, contact, date, and status. No more losing leads in chat threads." },
    { q: "Will renewal reminders actually work?", a: "Yes. When a member is 7 days from their renewal date, we automatically send them a WhatsApp or email reminder. You stop chasing and start collecting." },
    { q: "Is there a contract or lock-in?", a: "No. You can cancel any time. We bill monthly or annually — your choice. No hidden fees, no setup costs." },
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
                    <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                      {a}
                    </div>
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

const WA_DEMO_URL = `https://wa.me/917452008033?text=${encodeURIComponent("Hi, I'd like to get a demo for MapToSite Fitness!")}`

function FinalCTA() {
  const { data: session } = useSession()
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  const handleOnboard = () => {
    if (!session) { setLoginModalOpen(true); return }
    window.scrollTo({ top: 0, behavior: "smooth" })
    setTimeout(() => window.dispatchEvent(new Event("focus-gym-input")), 600)
  }

  return (
    <>
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
      <section className="py-24 px-4 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-6xl mb-6">💪</div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
              Set up your gym software + website in 60 seconds
            </h2>
            <p className="text-primary-foreground/70 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Members, payments, leads — all in one place. Website included.
              If it takes longer than 60 seconds, you get 50% off. No questions asked.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={WA_DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 h-14 px-8 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-base rounded-xl shadow-lg transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Get Demo on WhatsApp
              </a>
              <Button
                size="lg"
                variant="secondary"
                className="h-14 px-8 font-black text-base"
                onClick={handleOnboard}
              >
                Onboard Yourself
                <Zap className="ml-2 w-5 h-5" />
              </Button>
            </div>
            <p className="text-primary-foreground/50 text-xs mt-6">
              Free to start · No credit card · 60 seconds to go live
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

function ChallengeBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto px-4 h-10 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold">
        <span>🇮🇳 For Gym Owners in India</span>
      </div>
    </div>
  )
}

export function GymLanding() {
  return (
    <div className="min-h-screen bg-background">
      <ChallengeBanner />
      <GymNav />
      <Hero />
      <Problem />
      <HowItWorks />
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
