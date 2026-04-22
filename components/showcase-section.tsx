"use client"

import { motion } from "framer-motion"
import { ShowcaseCards, ShowcaseMarquee } from "@/components/showcase-cards"

export function ShowcaseSection() {
  return (
    <section id="examples" className="py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold mb-2 block">Showcase</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Gym websites built with MapToSite
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Real gyms, real results. Each one took under 60 seconds to go live.
          </p>
        </motion.div>

        {/* Marquee for mobile */}
        <div className="md:hidden">
          <ShowcaseMarquee />
        </div>

        {/* Grid for desktop */}
        <div className="hidden md:block">
          <ShowcaseCards />
        </div>

        {/* View all button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.a
            href="#"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            whileHover={{ x: 5 }}
          >
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
