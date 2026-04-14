"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Search, Star, PhoneOff } from "lucide-react"

const scenarios = [
  {
    icon: Search,
    iconColor: "text-red-500",
    iconBg: "bg-red-500/10",
    headline: "They search. They don't find you.",
    body: "Someone types 'best salon near me.' You're not there. A competitor with a website is. They get the booking.",
  },
  {
    icon: Star,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    headline: "Your hard-earned reviews go to waste.",
    body: "You have dozens of 5-star reviews. But customers deciding where to go never see them — because they never reach your Maps page.",
  },
  {
    icon: PhoneOff,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-500/10",
    headline: "They call your competitor instead.",
    body: "People trust businesses with websites. No website = no credibility. That's the first filter customers apply — before they even read a review.",
  },
]

const stats = [
  { value: 81, suffix: "%", label: "of customers research online before visiting a local business" },
  { value: 75, suffix: "%", label: "judge a business's credibility by its website alone" },
  { value: 2.8, suffix: "×", label: "more leads for businesses that have a website vs those that don't" },
]

function AnimatedStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const steps = 40
    const duration = 1200
    const isFloat = value % 1 !== 0
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const current = value * progress
      setCount(isFloat ? Math.round(current * 10) / 10 : Math.floor(current))
      if (step >= steps) {
        setCount(value)
        clearInterval(timer)
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, value])

  return (
    <div ref={ref} className="text-center px-4">
      <div className="text-4xl md:text-5xl font-bold text-foreground tabular-nums">
        {count}{suffix}
      </div>
      <p className="text-sm text-muted-foreground mt-2 max-w-[180px] mx-auto leading-snug">{label}</p>
    </div>
  )
}

export function WhyWebsiteSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-primary font-semibold mb-2 block text-sm uppercase tracking-wider">The reality</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Here&apos;s what&apos;s happening<br className="hidden sm:block" /> without a website.
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Every day, customers search for businesses like yours. If they don&apos;t find a website, they find someone who has one.
          </p>
        </motion.div>

        {/* Scenario cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {scenarios.map((scenario, index) => (
            <motion.div
              key={scenario.headline}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-card border border-border rounded-2xl p-6 hover:border-destructive/30 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${scenario.iconBg} flex items-center justify-center mb-4`}>
                <scenario.icon className={`w-6 h-6 ${scenario.iconColor}`} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{scenario.headline}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{scenario.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-4 border-t border-border pt-16"
        >
          {stats.map(stat => (
            <AnimatedStat key={stat.label} {...stat} />
          ))}
        </motion.div>

      </div>
    </section>
  )
}
