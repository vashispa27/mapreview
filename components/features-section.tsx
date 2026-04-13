"use client"

import { motion } from "framer-motion"
import { Star, Camera, Clock, Globe, Zap, Shield } from "lucide-react"
import { Card } from "@/components/ui/card"
import { MiniMascot } from "@/components/mascot"

const features = [
  {
    icon: Star,
    title: "Your Reviews, Front and Center",
    description: "73% of customers trust a business more when they see reviews on a dedicated website. Yours are already on Google — now put them where it converts.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Camera,
    title: "Real Photos, Real Credibility",
    description: "Stock photos scream \"fake.\" Your real customer photos and business shots tell an authentic story that makes people choose you over the competition.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Clock,
    title: "No Designers. No Developers.",
    description: "A professional website used to cost $3,000–$10,000 and months of back-and-forth. With MapToSite, you're live in 30 seconds — no technical skills required.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Globe,
    title: "Own Your Online Presence",
    description: "A Google Maps listing is rented space — Google can change it anytime. Your own website is yours forever, with your brand, your URL, your rules.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Zap,
    title: "Show Up in Search Results",
    description: "Websites rank on Google. A Maps pin doesn't. Give your business a real shot at appearing when customers in your area search for what you offer.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: Shield,
    title: "Always Accurate, Automatically",
    description: "Outdated hours or wrong info drives customers away. Your site stays in sync with your Google listing — so it's always current without any extra work.",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
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
            Your Google Maps listing is a goldmine. Are you using it?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            You already have reviews, photos, and credibility on Google. A website turns all of that into customers — instead of just leaving it on a platform you don&apos;t own.
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
