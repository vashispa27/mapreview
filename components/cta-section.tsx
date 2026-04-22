"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, MapPin, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mascot } from "@/components/mascot"

export function CTASection() {
  const [url, setUrl] = useState("")

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

      {/* Animated background elements */}
      <motion.div
        className="absolute top-10 left-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-accent/10 blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
      />

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Mascot */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring" }}
            className="mb-6"
          >
            <Mascot className="w-24 h-32 mx-auto" />
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>Free to try, no credit card required</span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Your gym website, member console &amp; billing — live in 60 seconds.
          </h2>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Paste your gym's Google Maps link. We build your website, set up your member management console, and configure GST billing — all automatically. No developer, no setup call, no waiting.
          </p>

          {/* CTA Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="url"
                placeholder="Paste your Google Maps URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-12 h-14 text-base bg-card border-border shadow-lg"
              />
            </div>
            <Button
              size="lg"
              className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25"
              onClick={() => window.dispatchEvent(new CustomEvent("focus-input"))}
            >
              Create My Site
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-sm text-muted-foreground"
          >
            Under 60 seconds • Members + billing + website • No developers needed
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
