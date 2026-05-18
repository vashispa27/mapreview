"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin, X, LayoutGrid, LogOut, Menu as MenuIcon,
  CheckCircle2, Zap, Sparkles, Users,
  ChevronDown, ChevronUp,
  CheckCircle, Clock, AlertCircle, Phone, Calendar,
  IndianRupee, Search, Dumbbell, Plus,
  Inbox,
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
import { daysUntil, formatDate } from "@/lib/gym-utils"
import { track } from "@/lib/analytics"

// ─── Nav ─────────────────────────────────────────────────────────────────────

function GymNav() {
  const { data: session, status } = useSession()
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { label: "Home", href: "#" },
    { label: "Features", href: "#features" },
    { label: "Console Demo", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Blog", href: "/blog" },
  ]

  return (
    <>
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
      <nav className="fixed top-10 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">
              MapToSite <span className="text-primary">Fitness</span>
            </span>
          </Link>

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
              Automated Gym Management{" "}
              <span className="text-primary">System + Website</span>
              {" "}— Live in 60 Seconds
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed"
            >
              Automated renewal reminders, GST billing, lead tracking &amp; member management — all from one dashboard.{" "}
              <span className="font-black text-foreground">Free gym website included.</span> No spreadsheets. No tech knowledge needed.
            </motion.p>

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

// ─── Console Widget ───────────────────────────────────────────────────────────

function makeWDate(offsetDays: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

const WIDGET_MEMBERS = [
  { id: "m1", name: "Rahul Sharma", phone: "9876543210", membershipTitle: "3-Month Plan", membershipPrice: "₹1,500/mo", durationMonths: 3, pricePerMonth: 1500, startDate: makeWDate(-68), endDate: makeWDate(22), status: "active" },
  { id: "m2", name: "Priya Mehta", phone: "9123456789", membershipTitle: "6-Month Plan", membershipPrice: "₹1,200/mo", durationMonths: 6, pricePerMonth: 1200, startDate: makeWDate(-130), endDate: makeWDate(50), status: "active" },
  { id: "m3", name: "Amit Patel", phone: "9988776655", membershipTitle: "1-Month Plan", membershipPrice: "₹1,000/mo", durationMonths: 1, pricePerMonth: 1000, startDate: makeWDate(-27), endDate: makeWDate(3), status: "active" },
  { id: "m4", name: "Sunita Rao", phone: "9871234560", membershipTitle: "1-Month Plan", membershipPrice: "₹900/mo", durationMonths: 1, pricePerMonth: 900, startDate: makeWDate(-25), endDate: makeWDate(5), status: "active" },
  { id: "m5", name: "Vikram Singh", phone: "9845671230", membershipTitle: "1-Month Plan", membershipPrice: "₹1,000/mo", durationMonths: 1, pricePerMonth: 1000, startDate: makeWDate(-70), endDate: makeWDate(-40), status: "expired" },
]


function widgetStatusBadge(member: typeof WIDGET_MEMBERS[0]) {
  const days = daysUntil(new Date(member.endDate))
  if (member.status === "expired" || days < 0)
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700"><AlertCircle className="w-3 h-3" />Expired</span>
  if (days <= 7)
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700"><Clock className="w-3 h-3" />Expires in {days}d</span>
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700"><CheckCircle className="w-3 h-3" />Active</span>
}

function ConsoleWidget() {
  const activeTab = "members" as const

  useEffect(() => { track("console_demo_viewed") }, [])

  const memberStats = {
    total: WIDGET_MEMBERS.length,
    active: WIDGET_MEMBERS.filter((m) => m.status === "active" && daysUntil(new Date(m.endDate)) > 7).length,
    expiring: WIDGET_MEMBERS.filter((m) => m.status === "active" && daysUntil(new Date(m.endDate)) >= 0 && daysUntil(new Date(m.endDate)) <= 7).length,
    expired: WIDGET_MEMBERS.filter((m) => m.status === "expired" || daysUntil(new Date(m.endDate)) < 0).length,
  }

  return (
    <section id="how-it-works" className="py-24 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-primary/20 mb-5">
            <Dumbbell className="w-3 h-3" /> Management Console
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            Your Gym Dashboard,<br />Ready in 60 Seconds
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Members, payments, GST invoices and workout plans — all from one place. This is the actual console you get.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border shadow-2xl overflow-hidden bg-background pointer-events-none select-none"
        >
          {/* Browser chrome */}
          <div className="bg-muted/60 px-4 py-2.5 border-b border-border flex items-center gap-3">
            <div className="flex gap-1.5 shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 bg-background/70 rounded-md px-3 py-1 text-xs text-muted-foreground font-mono hidden sm:block truncate">
              maptosite.app/console/iron-arena-fitness
            </div>
            <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-semibold shrink-0 ml-auto sm:ml-0">Demo</span>
          </div>

          {/* Console header bar */}
          <div className="border-b border-border bg-background px-4 h-14 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <Dumbbell className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground text-sm">Iron Arena Fitness</span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium hidden sm:inline">Console</span>
            </div>
          </div>

          {/* Tab bar */}
          <div className="border-b border-border bg-background overflow-x-auto">
            <div className="flex gap-0 min-w-max">
              {([
                { key: "members" as const, label: "Members", icon: Users, badge: 1 },
                { key: "leads" as const, label: "Leads", icon: Inbox, badge: 2 },
                { key: "earnings" as const, label: "Earnings & Billing", icon: IndianRupee },
                { key: "plans" as const, label: "Workout Plans", icon: Dumbbell },
              ]).map(({ key, label, icon: Icon, badge }) => (
                <div
                  key={key}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-3.5 text-sm font-medium border-b-2 whitespace-nowrap ${
                    activeTab === key ? "border-primary text-primary" : "border-transparent text-muted-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />{label}
                  {badge ? <span className="ml-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{badge}</span> : null}
                </div>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="p-4 sm:p-6 space-y-4 bg-background">

            {/* ── MEMBERS TAB ── */}
            {activeTab === "members" && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Total Members", value: memberStats.total, icon: Users, color: "text-foreground", bg: "bg-muted/50" },
                    { label: "Active", value: memberStats.active, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
                    { label: "Expiring Soon", value: memberStats.expiring, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Expired", value: memberStats.expired, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
                  ].map((s) => (
                    <div key={s.label} className={`${s.bg} rounded-xl p-3 sm:p-4 border border-border/50`}>
                      <div className={`flex items-center gap-1.5 mb-1.5 ${s.color}`}>
                        <s.icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs font-semibold uppercase tracking-wider leading-tight">{s.label}</span>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold">{s.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <div className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-muted/30 text-sm text-muted-foreground select-none">
                      Search by name, phone or email…
                    </div>
                  </div>
                  <button
                    onClick={() => {}}
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shrink-0"
                  >
                    <Plus className="w-4 h-4" /><span className="hidden sm:inline">Add Member</span>
                  </button>
                </div>

                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Member</th>
                          <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Contact</th>
                          <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Plan</th>
                          <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden sm:table-cell">Expires</th>
                          <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {WIDGET_MEMBERS.map((member, i) => (
                          <tr key={member.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                  {member.name.charAt(0)}
                                </div>
                                <span className="font-medium">{member.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Phone className="w-3 h-3" />{member.phone}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-medium">{member.membershipTitle}</p>
                              <p className="text-xs text-muted-foreground">{member.membershipPrice}</p>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Calendar className="w-3.5 h-3.5" />{formatDate(new Date(member.endDate))}
                              </div>
                            </td>
                            <td className="px-4 py-3">{widgetStatusBadge(member)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

          </div>
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
      <ConsoleWidget />
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
