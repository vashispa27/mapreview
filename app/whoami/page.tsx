"use client"

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowDown, Star, Cpu, Building2, Rocket, Mail } from "lucide-react"

// ─── Data ─────────────────────────────────────────────────────────────────────

const chapters = [
  {
    num: "01",
    label: "Curious Kid",
    year: "Age 8 →",
    icon: Star,
    title: "I asked weird questions.",
    bullets: [
      "Why doesn't the moon fall down on us?",
      "So many buildings are made every day — why isn't the Earth getting heavier?",
      "If rockets have pointy noses, how do they land on the moon?",
      "If we could come from nothing, is nothing actually nothing?",
    ],
    aside: "Science always came naturally to me. It never felt forced.",
    tags: ["First Principles", "Physics", "Childhood Wonder"],
  },
  {
    num: "02",
    label: "The Builder",
    year: "2016 → 2020",
    icon: Cpu,
    title: "Dropped out of physics. Built robots instead.",
    bullets: [
      "Enrolled in pure physics after school. Left after 6 months.",
      "Switched to electronics engineering.",
      "Started building robots as side projects. Then started selling them.",
      "Built PCBs by hand, wrote native code, built our own cheap Arduinos to improve margins.",
    ],
    aside: "I realised people care more about certificates than curiosity, so I built them things for money. They got accolades; I got paid.",
    tags: ["Physics Dropout", "Electronics", "Robotics", "PCB Design"],
  },
  {
    num: "03",
    label: "Industry",
    year: "2020 → 2025",
    icon: Building2,
    title: "Chip design. Then Amazon. Then a reputation.",
    bullets: [
      "Joined ANSYS — chip design and simulation.",
      "Joined Amazon Vega — helped build a new operating system. Worked on core native layers and developer kits. Learned how hardware and software meet in production.",
      "Joined Amazon Now — built infra that runs Amazon's delivery systems. Saw firsthand how legacy internal tooling is about to be disrupted by AI.",
      "Known across teams as the 'laziest' person — I automated everything in sight.",
    ],
    aside: "The most boring products are the most profitable and the hardest to replace.",
    tags: ["ANSYS", "Amazon", "Chip Design", "OS", "Delivery Infra"],
  },
  {
    num: "04",
    label: "What's Next",
    year: "Now → EF",
    icon: Rocket,
    title: "Left 3 months ago. Looking for something bigger and messier.",
    bullets: [
      "Left Amazon with no project lined up. Built a SaaS, got paying customers in weeks.",
      "Built something 'boring' to prove I could sell — I can.",
    ],
    aside: "EF is where I'd apply a decade of engineering — electronics, robotics, software — to build something that looks like magic.",
    tags: ["Deep Tech", "B2B", "Developer Tools", "Robotics", "EF"],
  },
]

// ─── Chapter Node ──────────────────────────────────────────────────────────────

function ChapterNode({ chapter, index }: { chapter: typeof chapters[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-15% 0px" })
  const isEven = index % 2 === 0
  const Icon = chapter.icon

  return (
    <div ref={ref} className="relative flex gap-0 md:gap-8 items-start">
      {/* Timeline icon */}
      <div className="hidden md:flex flex-col items-center shrink-0 pt-2" style={{ width: 48 }}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-11 h-11 border-2 border-primary bg-background flex items-center justify-center z-10"
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          <Icon className="w-5 h-5 text-primary" />
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? -32 : 32, y: 16 }}
        animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 pb-16 md:pb-20"
      >
        {/* Label row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="md:hidden w-8 h-8 border-2 border-primary bg-background flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <Badge variant="outline" className="text-xs font-medium border-primary/40 text-primary">
            {chapter.label}
          </Badge>
          <span className="text-xs text-muted-foreground font-medium">{chapter.year}</span>
        </div>

        <Card className="border-2 border-border" style={{ boxShadow: "var(--shadow-md)" }}>
          <CardContent className="p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold leading-snug mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>
              {chapter.title}
            </h3>

            <Separator className="mb-5" />

            {/* Bullet list */}
            <ul className="space-y-2.5 mb-5">
              {chapter.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm md:text-base text-muted-foreground">
                  <span className="text-primary font-bold mt-0.5 shrink-0">→</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {/* Aside */}
            {chapter.aside && (
              <blockquote
                className="border-l-4 border-primary bg-secondary px-4 py-3 mb-5 text-sm font-bold text-secondary-foreground"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                {chapter.aside}
              </blockquote>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// ─── Progress Line ─────────────────────────────────────────────────────────────

function ProgressLine() {
  const { scrollYProgress } = useScroll()
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <div className="hidden md:block absolute left-[23px] top-0 bottom-0 w-[2px] bg-border">
      <motion.div className="w-full bg-primary origin-top" style={{ height }} />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WhoAmIPage() {
  return (
    <div className="min-h-screen">

      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-16 py-24 relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-96 h-96 opacity-20"
          style={{ background: "radial-gradient(circle, oklch(0.6489 0.2370 26.9728) 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 opacity-10"
          style={{ background: "radial-gradient(circle, oklch(0.9680 0.2110 109.7692) 0%, transparent 70%)", transform: "translate(-30%, 30%)" }}
        />

        <div className="max-w-3xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="mb-6 text-xs font-semibold" style={{ boxShadow: "var(--shadow-sm)" }}>
              EF Application — 2025
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
            className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed mb-8"
          >
            The best products are built with logic and sold with emotion. I want to build them.
          </motion.p>

          {/* EF banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-xl mb-12 border-2 border-border bg-card p-5"
            style={{ boxShadow: "var(--shadow-md)" }}
          >
            <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-3" style={{ fontFamily: "'Space Mono', monospace" }}>
              Why EF
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "I want to build in core B2B deep tech.",
                "Developer/Agent tools, replacing old boring ERPs or adding AI layers on top of them.",
                "Or bring a 'ChatGPT 1.0 moment' to robotics and electronics.",
                "EF is where I can combine all of my domain experience across electronics, robots and software.",
              ].map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary font-bold shrink-0 mt-0.5">→</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="border-t-2 border-border pt-4">
              <img
                src="/ChatGPT%20Image%20May%2020%2C%202026%2C%2005_31_58%20PM.png"
                alt="Gaussian career outcomes vs. power law startup outcomes"
                className="w-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <ArrowDown className="w-4 h-4 animate-bounce" />
            <span>Scroll to read my story</span>
          </motion.div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="px-6 md:px-16 py-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">The Journey</h2>
          <p className="text-muted-foreground">Curious kid → dropout → engineer → Amazon → now.</p>
        </motion.div>

        <div className="relative md:pl-16">
          <ProgressLine />
          <div className="space-y-0">
            {chapters.map((chapter, i) => (
              <ChapterNode key={chapter.num} chapter={chapter} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
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
            I&apos;m applying to EF. If this resonates, reach out.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:27abhinav10@gmail.com"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity border-2 border-primary"
              style={{ boxShadow: "var(--shadow-md)" }}
            >
              <Mail className="w-4 h-4" />
              27abhinav10@gmail.com
            </a>
            <a
              href="https://wa.me/917452008033?text=Hi%20Abhinav%2C%20I%20read%20your%20EF%20application%20and%20would%20love%20to%20chat."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-card text-foreground font-bold text-sm hover:opacity-90 transition-opacity border-2 border-border"
              style={{ boxShadow: "var(--shadow-md)" }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366]" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>

          <p className="mt-10 text-xs text-muted-foreground">
            27abhinav10@gmail.com &nbsp;
          </p>
        </motion.div>
      </section>

    </div>
  )
}
