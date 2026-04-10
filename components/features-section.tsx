"use client"

import { motion } from "framer-motion"
import { Star, Camera, Clock, Globe, Zap, Shield } from "lucide-react"
import { Card } from "@/components/ui/card"
import { MiniMascot } from "@/components/mascot"

const features = [
  {
    icon: Star,
    title: "Real Reviews",
    description: "Import genuine customer reviews directly from your Google Maps listing. Build trust instantly.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Camera,
    title: "Authentic Photos",
    description: "Showcase real photos from customers and your business. No stock images needed.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Clock,
    title: "30 Second Setup",
    description: "Paste your URL and your website is ready. No technical skills required.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Globe,
    title: "Custom Domain",
    description: "Use your own domain or get a free subdomain. Your brand, your way.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed. Your site loads instantly on any device.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: Shield,
    title: "Always Updated",
    description: "Reviews and info sync automatically. Always show your latest and best.",
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
            Why businesses love MapToSite
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Everything you need to convert your Google Maps presence into a professional website
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
