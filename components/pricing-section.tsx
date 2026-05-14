"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Check, Sparkles, Zap, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession, signIn } from "next-auth/react"
import { cn } from "@/lib/utils"
import { track } from "@/lib/analytics"

export function PricingSection() {
  const { data: session } = useSession()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { track("viewed_pricing"); observer.disconnect() } },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  const handleCheckout = async (plan: string) => {
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
      description: "Website + ecommerce for any business",
      price: "₹259",
      priceSuffix: "/month",
      badge: null,
      features: [
        "Up to 10 websites",
        "Full website from Google Maps in 60 seconds",
        "Ecommerce — cart, products & services",
        "Automatic sync of reviews & photos",
        "Custom branding & colors",
        "Free hosting & unlimited edits",
        "Request for custom domain",
        "Basic SEO setup",
        "7-day support",
      ],
      buttonText: "Get Started",
      popular: false,
      icon: Zap,
    },
    {
      id: "pro",
      name: "Pro",
      description: "Full management platform for gyms & businesses",
      price: "₹999",
      priceSuffix: "/month",
      badge: "Most Popular",
      features: [
        "Everything in Base",
        "Gym member management console",
        "Diet & workout planner with email delivery",
        "GST billing — auto invoices, GSTR-1 export",
        "Member renewal reminders (email)",
        "Free custom domain",
        "Priority support",
        "Website analytics dashboard",
        "Advanced SEO — rank higher on Google",
      ],
      buttonText: "Get Pro",
      popular: true,
      icon: Sparkles,
    },
  ]

  return (
    <section id="pricing" ref={sectionRef} className="py-24 px-6 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 italic uppercase">
            Choose Your <span className="text-primary">Plan</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple pricing. No hidden fees. Cancel any time.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted px-4 py-2 rounded-full">
            <RefreshCw className="w-3.5 h-3.5" />
            Both plans billed monthly · Cancel any time · No contracts
          </div>
        </motion.div>

        <motion.div {...fadeInUp} transition={{ delay: 0.15 }} className="max-w-3xl mx-auto mb-6 space-y-3">
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
            <span className="text-2xl shrink-0">⚡</span>
            <p className="text-sm text-amber-800 leading-snug">
              <span className="font-black">60-second challenge:</span> if your website + management system takes longer than 60 seconds to set up, you get{" "}
              <span className="font-black">50% off any plan</span> — automatically, no questions asked.
            </p>
          </div>
          <a
            href={`https://wa.me/917452008033?text=${encodeURIComponent("Hi! I'd like to book a demo for MapToSite and claim the 50% off discount coupon.")}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("pricing_book_demo_clicked")}
            className="flex items-center justify-between gap-3 bg-[#25D366]/8 border border-[#25D366]/30 hover:border-[#25D366]/60 rounded-2xl px-5 py-4 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#25D366] shrink-0" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <p className="text-sm font-bold text-foreground">Book a demo now and get a <span className="text-[#128C7E]">50% off discount coupon</span></p>
            </div>
            <span className="text-xs font-bold text-[#25D366] shrink-0 group-hover:translate-x-0.5 transition-transform">Book Demo →</span>
          </a>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
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
                {tier.badge && (
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-bl-xl flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    {tier.badge}
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
                  <CardDescription className="text-base">{tier.description}</CardDescription>
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
                    {loadingPlan === tier.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      tier.buttonText
                    )}
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
