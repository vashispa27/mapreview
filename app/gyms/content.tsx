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
import { GymSearchBlock } from "@/components/gym-search-block"
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
  ]

  return (
    <>
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
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
  const { data: session } = useSession()
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  return (
    <>
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
      <section className="pt-20 pb-12 px-4">
        <div className="max-w-5xl mx-auto w-full">

          {/* Text + CTA — centered */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <motion.span
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-primary/20 mb-5"
            >
              <Zap className="w-3 h-3" /> For Gym Owners
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-[1.1] tracking-tight mb-5"
            >
              Turn Your Gym&apos;s{" "}
              <span className="text-primary">Google Visitors</span>
              <br className="hidden sm:block" />
              {" "}into Paying Members
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto"
            >
              Most gyms get views on Google — but don&apos;t convert them.
              MapToSite helps you turn those visitors into real enquiries and walk-ins.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
              className="flex flex-col items-center gap-4"
            >
              {session ? (
                <div className="w-full max-w-xl text-left">
                  <GymSearchBlock />
                </div>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="h-14 px-8 font-black text-base shadow-lg shadow-primary/25"
                    onClick={() => setLoginModalOpen(true)}
                  >
                    Go Live Now
                    <Zap className="ml-2 w-5 h-5" />
                  </Button>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {["A", "R", "S", "M"].map((l, i) => (
                        <div key={i} className="w-7 h-7 rounded-full bg-primary/10 border-2 border-white flex items-center justify-center text-[10px] font-black text-primary">
                          {l}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                      <span className="font-bold text-foreground">120+</span> gyms already converting more visitors
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Image — full section width */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }}
          >
            <img
              src="/image.png"
              alt="From Google Maps to more gym customers in 60 seconds"
              className="w-full h-auto object-contain"
              loading="eager"
            />
          </motion.div>

        </div>
      </section>
    </>
  )
}

// ─── Problem ─────────────────────────────────────────────────────────────────

function Problem() {
  const pains = [
    { icon: "👁️", title: "People check your gym but don't contact you", desc: "They find your Google listing, browse your photos — then leave without ever reaching out." },
    { icon: "🏃", title: "Leads go to competitors", desc: "While you have no proper online presence, the gym down the street with a website gets the booking." },
    { icon: "🔕", title: "No proper follow-up system", desc: "Interested visitors don't get a follow-up. You lose them before they ever walk through the door." },
    { icon: "💬", title: "Everything runs on scattered WhatsApp messages", desc: "Enquiries, renewals, plans — all tracked manually in chat threads. Things fall through the cracks." },
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
          <p className="text-xl font-black mb-1">You don&apos;t have a traffic problem.</p>
          <p className="text-xl font-black opacity-80">You have a conversion problem.</p>
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
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
            Fix Your Gym&apos;s Conversion System
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            MapToSite turns your Google traffic into actual enquiries using a simple, automated system —
            built from your Google Maps listing in 60 seconds.
          </p>
        </motion.div>
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
    { icon: "🌐", title: "Professional gym website", desc: "Built from your Google Maps listing in 60 seconds. Photos, reviews, hours — all auto-pulled. No design skills needed." },
    { icon: "💬", title: "WhatsApp enquiry system", desc: "A prominent WhatsApp button on every page. Visitors tap it and go straight to your chat. Zero friction, zero missed leads." },
    { icon: "📊", title: "Lead tracking dashboard", desc: "See every enquiry, where it came from, and its status. Stop tracking leads in chat threads." },
    { icon: "🔄", title: "Automated follow-ups", desc: "Renewal reminders sent automatically before memberships expire. You get paid on time without chasing anyone." },
    { icon: "⚙️", title: "Simple management system", desc: "Add members, record payments, assign diet and workout plans — all from one dashboard. No spreadsheets." },
  ]

  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">What You Get</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Everything your gym needs to convert Google visitors into paying members.</p>
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
          <Button
            size="lg"
            className="mt-6 h-12 px-8 font-black bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/25"
            onClick={() => window.dispatchEvent(new Event("focus-gym-input"))}
          >
            Claim Your Spot Now
          </Button>
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

function FinalCTA() {
  const { data: session } = useSession()
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  return (
    <>
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
      <section className="py-24 px-4 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-6xl mb-6">💪</div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
              Stop losing members who are already searching for you.
            </h2>
            <p className="text-primary-foreground/70 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Your Google Maps listing already has everything. We turn it into a proper gym website —
              with WhatsApp enquiries, member management, and renewal reminders — in 60 seconds.
            </p>
            {session ? (
              <div className="max-w-xl mx-auto">
                <GymSearchBlock />
              </div>
            ) : (
              <Button
                size="lg"
                variant="secondary"
                className="h-14 px-10 font-black text-base shadow-lg"
                onClick={() => setLoginModalOpen(true)}
              >
                Go Live Now — It&apos;s Free
                <Zap className="ml-2 w-5 h-5" />
              </Button>
            )}
            <p className="text-primary-foreground/50 text-xs mt-5">
              Free to start · No credit card · 60 seconds to go live
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function GymLanding() {
  return (
    <div className="min-h-screen bg-background">
      <GymNav />
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
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
