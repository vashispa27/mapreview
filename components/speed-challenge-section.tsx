"use client"

import { motion } from "framer-motion"
import { Zap, Clock, ArrowRight, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"

export const discountTiers = [
  { time: "< 60s",  discount: "50% off", color: "text-pink-500",   bg: "bg-pink-500/10 border-pink-500/30",   ring: "ring-1 ring-pink-500/40" },
  { time: "< 80s",  discount: "40% off", color: "text-violet-500", bg: "bg-violet-500/10 border-violet-500/30", ring: "" },
  { time: "< 90s",  discount: "30% off", color: "text-blue-500",   bg: "bg-blue-500/10 border-blue-500/30",   ring: "" },
  { time: "< 100s", discount: "20% off", color: "text-teal-500",   bg: "bg-teal-500/10 border-teal-500/30",   ring: "" },
]

function TimerRing() {
  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 144 144">
        <circle cx="72" cy="72" r="60" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted/30" />
        <motion.circle
          cx="72" cy="72" r="60"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-primary"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 60}
          initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
          whileInView={{ strokeDashoffset: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-black text-foreground"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
        >
          60
        </motion.span>
        <span className="text-xs text-muted-foreground font-medium">seconds</span>
      </div>
    </div>
  )
}

export function SpeedChallengeSection() {
  const handleChallenge = () => {
    window.dispatchEvent(new Event("focus-input"))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, rgba(34,197,94,0.6) 0%, transparent 70%)" }}
        />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-primary/20">
            <Zap className="w-4 h-4" />
            Speed Challenge
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Build faster. Pay less.
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Build your full website under 60 seconds and earn a discount. The quicker you are, the more you save — up to 50% off.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-3xl p-8 shadow-xl"
        >
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Timer ring */}
            <div className="shrink-0">
              <div className="flex items-center gap-3 mb-4 justify-center">
                <Clock className="w-5 h-5 text-primary" />
                <span className="font-bold text-foreground">Your Target</span>
              </div>
              <TimerRing />
            </div>

            {/* Tiers */}
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-foreground">Discount Tiers</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {discountTiers.map((tier) => (
                  <motion.div
                    key={tier.time}
                    whileHover={{ scale: 1.03 }}
                    className={`border rounded-2xl p-4 text-center ${tier.bg} ${tier.ring}`}
                  >
                    <p className="text-sm text-muted-foreground mb-1">{tier.time}</p>
                    <p className={`font-black text-2xl ${tier.color}`}>{tier.discount}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Click <strong>Start Speed Challenge</strong> in the bottom-right corner, then paste your Google Maps link and hit Generate.
            </p>
            <Button
              className="h-12 px-8 font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
              onClick={handleChallenge}
            >
              <Zap className="mr-2 w-4 h-4" />
              Take the Challenge
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Compact card used in the hero right-side slot
export function SpeedChallengeHeroCard({ className = "" }: { className?: string }) {
  const startChallenge = () => {
    window.dispatchEvent(new Event("focus-input"))
  }

  return (
    <motion.div
      className={`bg-card rounded-3xl shadow-2xl overflow-hidden border border-border ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header bar */}
      <div className="bg-primary px-5 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <p className="font-black text-primary-foreground text-base leading-tight">Speed Challenge</p>
          <p className="text-primary-foreground/70 text-xs">Build faster. Pay less.</p>
        </div>
      </div>

      {/* Tiers */}
      <div className="p-5">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
          Discount tiers
        </p>
        <div className="space-y-2">
          {discountTiers.map((tier, i) => (
            <motion.div
              key={tier.time}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className={`flex items-center justify-between border rounded-xl px-4 py-2.5 ${tier.bg} ${tier.ring}`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">{tier.time}</span>
              </div>
              <span className={`font-black text-lg ${tier.color}`}>{tier.discount}</span>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={startChallenge}
          className="mt-5 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors"
        >
          <Zap className="w-4 h-4" />
          Start the Challenge
          <ArrowRight className="w-4 h-4" />
        </motion.button>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Timer starts now · promo code sent at the end
        </p>
      </div>
    </motion.div>
  )
}
