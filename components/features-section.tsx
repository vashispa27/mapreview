"use client"

import { motion } from "framer-motion"
import { Star, Zap, ShoppingBag, Users, FileText, Receipt, Bell } from "lucide-react"
import { Card } from "@/components/ui/card"
import { MiniMascot } from "@/components/mascot"

const features = [
  {
    icon: Zap,
    title: "Gym website in 60 seconds",
    description: "Paste your Google Maps link. We pull your real photos, reviews, and location — and build a full gym website automatically. No designer. No developer.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Users,
    title: "Member management console",
    description: "Add members, track their membership duration, view expiry dates, and renew with one click. No Excel sheets, no chasing people on WhatsApp.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Receipt,
    title: "GST billing & invoices",
    description: "Every membership auto-generates a GST-compliant invoice (SAC 999723, 5% rate). Print or email it. Export GSTR-1 CSV for your CA in one click.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: FileText,
    title: "Diet & workout planner",
    description: "Build workout plans once — sessions, exercises, sets, reps, weight. Build diet plans with macros and meals. Assign to any member and email it instantly.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Bell,
    title: "Automatic renewal reminders",
    description: "Members get email reminders 7 days and 1 day before their membership expires. You don't have to remember or chase anyone. It just happens.",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    icon: ShoppingBag,
    title: "Sell supplements & gear",
    description: "Add products — protein, gear, apparel — with photos and prices. Members can order directly from your gym website with a WhatsApp checkout.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <MiniMascot className="w-16 h-20 mx-auto" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Not just a website — everything a gym owner actually needs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Members, billing, workout plans, diet plans, renewal reminders, ecommerce — all from one Google Maps link. Built in 60 seconds, runs itself after that.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full bg-card border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                <motion.div
                  className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </motion.div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
