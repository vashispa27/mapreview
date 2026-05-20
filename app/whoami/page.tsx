"use client"

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowDown, MapPin, Zap, Users, IndianRupee, Globe, TrendingUp, Handshake } from "lucide-react"

// ─── Data ─────────────────────────────────────────────────────────────────────

const chapters = [
  {
    num: "01",
    label: "The Observation",
    year: "Early 2024",
    icon: MapPin,
    color: "bg-primary text-primary-foreground",
    title: "63 million businesses. Almost none online.",
    body: "I walked into 40+ gyms, restaurants, and salons across Delhi NCR. Every single one had a Google Maps listing — photos, reviews, hours, phone number. None had a functioning website. None had a management system. When I asked why, the answer was always the same: agencies quoted ₹40,000–₹80,000 upfront and months of waiting.",
    tags: ["Market Research", "Delhi NCR", "40+ interviews"],
    aside: "The gap between what businesses had and what they needed was hiding in plain sight.",
  },
  {
    num: "02",
    label: "The Insight",
    year: "Mid 2024",
    icon: Zap,
    color: "bg-secondary text-secondary-foreground",
    title: "Everything is already on Google Maps.",
    body: "Photos. Reviews. Hours. Location. Phone number. Menu. Service list. Category. Every piece of data a business website needs — already exists on Google Maps, verified, and up to date. The question wasn't how to collect this data. The question was: why isn't anyone using it to generate the website automatically?",
    tags: ["Product Insight", "Data Layer", "Automation"],
    aside: "What if setup took 60 seconds instead of 6 weeks?",
  },
  {
    num: "03",
    label: "The Build",
    year: "Late 2024",
    icon: Globe,
    color: "bg-accent text-accent-foreground",
    title: "MapToSite. Paste a link. Go live.",
    body: "I built it solo. Paste a Google Maps URL → we pull all the data → a professional website and management console go live in under 60 seconds. For gyms: member management, GST billing, diet and workout planners, renewal reminders, WhatsApp integration. For restaurants: table bookings, lead tracking, enquiry management, ecommerce ordering.",
    tags: ["Solo Build", "Full-Stack", "Two Verticals"],
    aside: null,
    features: [
      { icon: "🏋️", label: "Gym vertical", desc: "Members · Payments · GST billing · Diet & workout plans" },
      { icon: "🍽️", label: "Restaurant vertical", desc: "Table bookings · Lead tracking · Ecommerce · WhatsApp" },
    ],
  },
  {
    num: "04",
    label: "The Signal",
    year: "2025",
    icon: IndianRupee,
    color: "bg-primary text-primary-foreground",
    title: "Paying customers. Real problems solved.",
    body: "Both verticals are live with paying customers. Gym owners are running their entire business — member sign-ups, payments, plan delivery — from one dashboard. Restaurant owners are tracking every lead and booking without WhatsApp threads and missed calls. Pricing: ₹259/month Base · ₹999/month Pro. vs ₹40,000+ one-time from an agency.",
    tags: ["Revenue", "Live Customers", "Two Verticals"],
    aside: "The 60-second setup guarantee: if it takes longer, you get 50% off automatically.",
    metrics: [
      { val: "₹259", label: "Base plan / month" },
      { val: "₹999", label: "Pro plan / month" },
      { val: "60s", label: "Setup time" },
      { val: "0", label: "Developers needed" },
    ],
  },
  {
    num: "05",
    label: "The Market",
    year: "2025 →",
    icon: TrendingUp,
    color: "bg-secondary text-secondary-foreground",
    title: "Every business category. Same 60-second setup.",
    body: "This isn't a gym product or a restaurant product. It's a category. Every business with a Google Maps listing — dental clinics, salons, barbershops, yoga studios, tuition centres, pet services, real estate agencies — needs the same thing: a website, a management system, and a way to get found online. India has 63 million registered SMBs. The playbook is identical across all of them.",
    tags: ["63M businesses", "India → SEA", "Vertical SaaS"],
    aside: null,
    verticals: ["🦷 Dental Clinics", "💇 Salons & Barbershops", "🧘 Yoga Studios", "🎓 Tuition Centres", "🐾 Pet Services", "🏥 Clinics", "🏠 Real Estate"],
  },
  {
    num: "06",
    label: "Why EF",
    year: "Now",
    icon: Handshake,
    color: "bg-primary text-primary-foreground",
    title: "I've built the product. Now I need to scale it.",
    body: "I've proven I can build. The product is live, the customers are real, and the market is enormous. What I need now is the right co-founder — someone who can help me think about distribution, channel strategy, or deepen the AI and automation layer. EF is the best environment I know of for finding that person.",
    tags: ["EF Application", "Co-founder Search", "Scale"],
    aside: "Looking for: GTM depth in Indian SMB distribution, or technical depth in AI/automation for vertical SaaS.",
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ChapterNode({ chapter, index }: { chapter: typeof chapters[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-15% 0px" })
  const isEven = index % 2 === 0

  return (
    <div ref={ref} className="relative flex gap-0 md:gap-8 items-start">
      {/* Timeline dot */}
      <div className="hidden md:flex flex-col items-center shrink-0 pt-2" style={{ width: 48 }}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-11 h-11 rounded-full border-2 border-primary bg-background flex items-center justify-center shadow-sm font-bold text-xs text-primary z-10"
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          {chapter.num}
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? -32 : 32, y: 16 }}
        animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 pb-16 md:pb-20"
      >
        {/* Year badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="md:hidden w-8 h-8 rounded-full border-2 border-primary bg-background flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
            {chapter.num}
          </div>
          <Badge variant="outline" className="text-xs font-medium border-primary/40 text-primary">
            {chapter.label}
          </Badge>
          <span className="text-xs text-muted-foreground font-medium">{chapter.year}</span>
        </div>

        <Card className="border-2 border-border" style={{ boxShadow: "var(--shadow-md)" }}>
          <CardContent className="p-6 md:p-8">
            {/* Title */}
            <h3 className="text-xl md:text-2xl font-bold leading-snug mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>
              {chapter.title}
            </h3>

            <Separator className="mb-5" />

            {/* Body */}
            <p className="text-sm md:text-base leading-relaxed text-muted-foreground mb-5">
              {chapter.body}
            </p>

            {/* Aside quote */}
            {chapter.aside && (
              <blockquote className="border-l-4 border-primary bg-secondary px-4 py-3 mb-5 text-sm font-bold text-secondary-foreground" style={{ fontFamily: "'Space Mono', monospace" }}>
                → {chapter.aside}
              </blockquote>
            )}

            {/* Feature grid */}
            {"features" in chapter && chapter.features && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                {chapter.features.map(f => (
                  <div key={f.label} className="bg-accent/60 rounded-lg p-4 border border-border">
                    <div className="text-xl mb-1">{f.icon}</div>
                    <div className="font-semibold text-sm mb-1">{f.label}</div>
                    <div className="text-xs text-muted-foreground">{f.desc}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Metrics */}
            {"metrics" in chapter && chapter.metrics && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {chapter.metrics.map(m => (
                  <div key={m.label} className="bg-primary/8 rounded-lg p-3 text-center border border-primary/20">
                    <div className="text-xl font-black text-primary">{m.val}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Verticals */}
            {"verticals" in chapter && chapter.verticals && (
              <div className="flex flex-wrap gap-2 mb-5">
                {chapter.verticals.map(v => (
                  <span key={v} className="text-xs px-3 py-1 rounded-full bg-secondary/60 border border-border font-medium">
                    {v}
                  </span>
                ))}
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {chapter.tags.map(t => (
                <Badge key={t} className="text-[11px] font-semibold" style={{ boxShadow: "var(--shadow-xs)" }}>
                  {t}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// ─── Progress Line ─────────────────────────────────────────────────────────────

function ProgressLine() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <div ref={ref} className="hidden md:block absolute left-[23px] top-0 bottom-0 w-[2px] bg-border">
      <motion.div className="w-full bg-primary origin-top rounded-full" style={{ height }} />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WhoAmIPage() {
  const heroRef = useRef<HTMLDivElement>(null)

  return (
    <div className="min-h-screen">

      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-16 py-24 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, oklch(0.6209 0.1801 348.1385) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, oklch(0.8095 0.0694 198.1863) 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />

        <div className="max-w-3xl relative z-10" ref={heroRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 text-xs font-semibold" style={{ boxShadow: "var(--shadow-sm)" }}>
              EF Application — May 2025
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tight leading-none mb-6"
          >
            Hi, I&apos;m<br />
            <span className="text-primary">Abhinav.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed mb-4"
          >
            Solo founder. I&apos;m building the digital infrastructure layer for India&apos;s small businesses —
            starting with a Google Maps link and ending with a complete management system.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-sm max-w-lg leading-relaxed mb-12 px-4 py-3 border-2 border-border bg-secondary text-secondary-foreground"
            style={{ fontFamily: "'Space Mono', monospace", boxShadow: "var(--shadow-sm)" }}
          >
            // Built it alone. Looking for the right co-founder at EF to scale it.
          </motion.p>

          {/* Hero stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap gap-4 mb-16"
          >
            {[
              { val: "2", label: "Live verticals" },
              { val: "60s", label: "Setup time" },
              { val: "₹0", label: "VC raised (yet)" },
              { val: "1", label: "Founder" },
            ].map(s => (
              <div key={s.label} className="px-4 py-3 rounded-lg border-2 border-border bg-card"
                style={{ boxShadow: "var(--shadow-sm)" }}>
                <div className="text-2xl font-black text-primary leading-none">{s.val}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <ArrowDown className="w-4 h-4 animate-bounce" />
            <span>Scroll to read my story</span>
          </motion.div>
        </div>
      </section>

      {/* ── ROADMAP ── */}
      <section className="px-6 md:px-16 py-8 max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">The Journey</h2>
          <p className="text-muted-foreground">From observation to product to traction — in six chapters.</p>
        </motion.div>

        {/* Timeline */}
        <div className="relative md:pl-16">
          <ProgressLine />

          <div className="space-y-0">
            {chapters.map((chapter, i) => (
              <ChapterNode key={chapter.num} chapter={chapter} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER ── */}
      <section className="px-6 md:px-16 py-24 border-t-2 border-border">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Let&apos;s talk.
          </h2>
          <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
            See the product live, read my thinking, or just message me directly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://maptosite.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity border-2 border-primary"
              style={{ boxShadow: "var(--shadow-md)" }}
            >
              <Globe className="w-4 h-4" />
              See maptosite.app live
            </a>
            <a
              href="https://wa.me/917452008033?text=Hi%20Abhinav%2C%20I%20read%20your%20EF%20application%20and%20would%20love%20to%20chat."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-card text-foreground font-bold text-sm hover:opacity-90 transition-opacity border-2 border-border"
              style={{ boxShadow: "var(--shadow-md)" }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366]" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Message on WhatsApp
            </a>
          </div>

          <p className="mt-10 text-xs text-muted-foreground">
            maptosite.app &nbsp;·&nbsp; blurr2710@gmail.com &nbsp;·&nbsp; Delhi NCR, India
          </p>
        </motion.div>
      </section>

    </div>
  )
}
