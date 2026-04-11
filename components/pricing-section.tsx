"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const pricingPlans = [
  {
    name: "Free",
    description: "Perfect for trying out MapReview",
    price: "$0",
    period: "forever",
    features: [
      "1 website",
      "Basic templates",
      "MapReview branding",
      "Standard support",
      "Basic analytics",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    description: "For businesses ready to grow",
    price: "$19",
    period: "/month",
    features: [
      "Unlimited websites",
      "All premium templates",
      "Custom domain",
      "Remove branding",
      "Priority support",
      "Advanced analytics",
      "SEO optimization",
      "Custom colors & fonts",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
]

export function PricingSection() {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Simple Pricing
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose your plan
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Start free and upgrade when you need more. No hidden fees.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "relative rounded-2xl p-8 transition-all duration-300",
                plan.highlighted
                  ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/20 scale-[1.02]"
                  : "bg-card border border-border"
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className={cn(
                  "text-sm",
                  plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"
                )}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className={cn(
                  "text-sm ml-1",
                  plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                      plan.highlighted ? "bg-primary-foreground/20" : "bg-primary/10"
                    )}>
                      <Check className={cn(
                        "w-3 h-3",
                        plan.highlighted ? "text-primary-foreground" : "text-primary"
                      )} />
                    </div>
                    <span className={cn(
                      "text-sm",
                      plan.highlighted ? "text-primary-foreground/90" : "text-foreground"
                    )}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "w-full h-12 text-base font-semibold transition-all duration-300",
                  plan.highlighted
                    ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-sm text-muted-foreground mt-12"
        >
          All plans include SSL certificate, mobile optimization, and 99.9% uptime guarantee.
        </motion.p>
      </div>
    </section>
  )
}
