"use client"

import { motion } from "framer-motion"
import { Globe, LayoutDashboard, Users, Zap, CheckCircle2, TrendingUp, ShieldCheck } from "lucide-react"
import { Card } from "@/components/ui/card"

export function WhyBothSection() {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Why do you need a Website AND a Dashboard?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            A website brings new people through your door. A dashboard makes sure they stay and pay on time. You need both to grow your gym without the stress.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: The Website */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold">1. A Professional Website</h3>
            </div>
            <p className="text-lg text-muted-foreground">
              When someone searches "gym near me" on Google, your website needs to show up. If you don't have one, they'll go to your competitor.
            </p>
            <Card className="p-6 bg-background border-primary/20 shadow-lg">
              <ul className="space-y-4">
                {[
                  { title: "Look Professional", desc: "Show your real gym photos & reviews instantly." },
                  { title: "Get Found on Google", desc: "Local people will find you when they search for gyms." },
                  { title: "Share Your Plans", desc: "No more explaining prices over phone calls." },
                  { title: "Sell Supplements", desc: "Collect orders on WhatsApp while you sleep." },
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>

          {/* Right: The Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                <LayoutDashboard className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold">2. A Simple Dashboard</h3>
            </div>
            <p className="text-lg text-muted-foreground">
              Running a gym on WhatsApp and paper is a headache. A dashboard keeps everything organized so you never lose a single rupee.
            </p>
            <Card className="p-6 bg-background border-blue-200 shadow-lg">
              <ul className="space-y-4">
                {[
                  { title: "Track Every Member", desc: "See who is active and who hasn't shown up." },
                  { title: "Auto Renewal Reminders", desc: "We email members before their plan ends." },
                  { title: "Fast Billing", desc: "Create professional bills in 10 seconds." },
                  { title: "Diet & Workout Plans", desc: "Send plans directly to their email." },
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Stat/Trust */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-8 rounded-3xl bg-primary text-primary-foreground flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <Zap className="w-8 h-8 fill-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">Live in 60 seconds</p>
              <p className="text-primary-foreground/80">No designers. No developers. No headache.</p>
            </div>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold">0</p>
              <p className="text-xs uppercase tracking-widest opacity-80">Tech Skills Needed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">100%</p>
              <p className="text-xs uppercase tracking-widest opacity-80">Automatic Setup</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
