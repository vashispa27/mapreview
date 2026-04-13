"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Sparkles, Zap, Infinity, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession, signIn } from "next-auth/react"
import { cn } from "@/lib/utils"

export function PricingSection() {
  const { data: session } = useSession()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  const handleCheckout = async (plan: string) => {
    if (plan === "base") {
      window.dispatchEvent(new CustomEvent("focus-input"))
      return
    }

    if (!session) {
      signIn("google")
      return
    }

    setLoadingPlan(plan)
    try {
      const res = await fetch("/api/payments/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Failed to initiate checkout. Please try again.")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingPlan(null)
    }
  }

  const tiers = [
    {
      id: "base",
      name: "Base",
      description: "Perfect for getting started",
      price: "$0",
      priceSuffix: "/forever",
      features: [
        "Create up to 3 Websites",
        "maptosite.com/your-name URL",
        "Free 24/7 Hosting Support",
        "Unlimited Content Edits",
        "Standard Templates",
      ],
      buttonText: "Start for Free",
      popular: false,
      icon: Zap
    },
    {
      id: "pro",
      name: "Pro",
      description: "For growing businesses",
      price: "$19",
      priceSuffix: "/month",
      features: [
        "Create up to 5 Websites",
        "Custom Domain Support (.com)",
        "24/7 Priority Live Support",
        "Remove MapToSite Branding",
        "Advanced Elite Templates",
      ],
      buttonText: "Upgrade to Pro",
      popular: true,
      icon: Sparkles
    },
    {
      id: "lifetime",
      name: "Lifetime",
      description: "The ultimate deal",
      price: "$99",
      priceSuffix: "one-time",
      features: [
        "UNLIMITED Website Creations",
        "Free Custom Domain (.com)",
        "All current & future Elite features",
        "VIP Concierge Support",
        "Zero Recurring Fees",
      ],
      buttonText: "Get Lifetime Access",
      popular: false,
      icon: Infinity
    }
  ]

  return (
    <section id="pricing" className="py-24 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 italic uppercase">
            Choose Your <span className="text-primary">Plan</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Scale your online presence with professional, high-performance websites.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div 
              key={tier.name}
              {...fadeInUp}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="flex"
            >
              <Card className={cn(
                "relative overflow-hidden border-2 shadow-xl bg-card flex flex-col w-full transition-all hover:shadow-2xl hover:-translate-y-1",
                tier.popular ? "border-primary" : "border-border/50"
              )}>
                {tier.popular && (
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-bl-xl flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                )}

                <CardHeader className="p-8 border-b border-border/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      tier.popular ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      <tier.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl font-black uppercase italic tracking-tight">{tier.name}</CardTitle>
                  </div>
                  <CardDescription className="text-base h-10 line-clamp-2">{tier.description}</CardDescription>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-5xl font-black tracking-tighter">{tier.price}</span>
                    <span className="text-muted-foreground font-bold text-sm">{tier.priceSuffix}</span>
                  </div>
                </CardHeader>

                <CardContent className="p-8 space-y-6 flex-1">
                  <ul className="space-y-4">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm">
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                          tier.popular ? "bg-primary/10" : "bg-muted"
                        )}>
                          <Check className={cn(
                            "w-3 h-3",
                            tier.popular ? "text-primary" : "text-muted-foreground"
                          )} strokeWidth={3} />
                        </div>
                        <span className="font-medium opacity-90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="p-8 pt-0">
                  <Button 
                    className="w-full h-14 text-base font-black uppercase tracking-widest shadow-lg"
                    variant={tier.popular ? "default" : "outline"}
                    size="lg"
                    disabled={loadingPlan !== null}
                    onClick={() => handleCheckout(tier.id)}
                  >
                    {loadingPlan === tier.id ? <Loader2 className="w-5 h-5 animate-spin" /> : tier.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
