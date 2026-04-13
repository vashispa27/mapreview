"use client"

import { motion } from "framer-motion"
import { Link2, Wand2, Rocket } from "lucide-react"

const steps = [
  {
    step: "01",
    icon: Link2,
    title: "Paste your Google Maps link",
    description: "That Maps listing you already have — with all your reviews and photos? That's your raw material. Just share the link.",
    color: "from-green-500 to-emerald-400",
  },
  {
    step: "02",
    icon: Wand2,
    title: "We build your website automatically",
    description: "Our AI pulls your reviews, photos, hours, and business details from Google and assembles a professional, mobile-ready website.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    step: "03",
    icon: Rocket,
    title: "Publish and start winning customers",
    description: "Share your link, add it to your business cards, and watch customers arrive already trusting you — because they've seen your reviews.",
    color: "from-orange-500 to-amber-400",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold mb-2 block">You already have everything you need</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            From zero to live website in 3 steps
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Your reviews, photos, and business info are already on Google. We just put them on a website you own.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-green-500 via-blue-500 to-orange-500 opacity-20" />

          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative text-center"
            >
              {/* Step number circle */}
              <motion.div
                className={`w-20 h-20 rounded-full bg-gradient-to-br ${item.color} mx-auto mb-6 flex items-center justify-center shadow-lg relative z-10`}
                whileHover={{ scale: 1.1 }}
                whileInView={{
                  boxShadow: [
                    "0 0 0 0 rgba(34, 197, 94, 0.4)",
                    "0 0 0 20px rgba(34, 197, 94, 0)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <item.icon className="w-8 h-8 text-white" />
              </motion.div>

              {/* Step label */}
              <div className="text-sm font-bold text-primary mb-2">STEP {item.step}</div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>

              {/* Description */}
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Demo animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 relative"
        >
          <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden max-w-4xl mx-auto">
            {/* Browser chrome */}
            <div className="bg-muted px-4 py-3 flex items-center gap-3 border-b border-border">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-background rounded-lg px-4 py-1.5 text-sm text-muted-foreground mx-4 flex items-center gap-2">
                <span className="text-primary">maptosite.com/create</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 bg-gradient-to-br from-muted/50 to-background">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Input side */}
                <div className="flex-1 space-y-4">
                  <div className="text-sm font-medium text-foreground">Google Maps URL</div>
                  <div className="bg-background border border-border rounded-lg p-4 text-sm text-muted-foreground overflow-hidden">
                    <motion.span
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, delay: 0.5 }}
                      className="inline-block overflow-hidden whitespace-nowrap"
                    >
                      https://maps.google.com/maps?cid=12345...
                    </motion.span>
                  </div>
                  <motion.div
                    className="h-10 w-32 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-medium"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 2 }}
                  >
                    Generate
                  </motion.div>
                </div>

                {/* Arrow */}
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-4xl"
                >
                  →
                </motion.div>

                {/* Output preview */}
                <motion.div
                  className="flex-1 bg-background rounded-xl p-4 border border-border shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.5 }}
                >
                  <div className="h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-2xl">🍕</span>
                  </div>
                  <div className="h-3 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-2 bg-muted rounded w-1/2" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
