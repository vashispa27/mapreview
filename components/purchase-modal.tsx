"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Sparkles, Zap, Loader2, X, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PurchaseModalProps {
  open: boolean
  onClose: () => void
}

export function PurchaseModal({ open, onClose }: PurchaseModalProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const handleCheckout = async (plan: string) => {
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
        alert("Failed to start checkout. Please try again.")
      }
    } catch {
      alert("Something went wrong. Please try again.")
    } finally {
      setLoadingPlan(null)
    }
  }

  const tiers = [
    {
      id: "base",
      name: "Base",
      price: "$5",
      priceSuffix: "/month",
      icon: Zap,
      popular: false,
      features: [
        "50 reviews analysed per site",
        "Host upto 3 websites with unlimited edits",
        "Automatic updates with live reviews",
        "Custom URL with MapToSite branding",
        "7-day Discord support",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: "$10",
      priceSuffix: "/month",
      icon: Sparkles,
      popular: true,
      features: [
        "200 reviews analysed per site",
        "Host upto 10 websites with unlimited edits",
        "Request for custom domain",
        "Weekly reviews report analysis",
        "Automatic updates with live reviews",
        "7-day priority support",
      ],
    },
  ]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-border">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase italic tracking-tight">
                    Purchase a Plan to Publish
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    One-time payment. Full access for 1 year.
                  </p>
                </div>
              </div>
            </div>

            {/* Plans */}
            <div className="p-6 grid sm:grid-cols-2 gap-4">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className={cn(
                    "relative border-2 rounded-xl p-5 flex flex-col gap-4",
                    tier.popular
                      ? "border-primary bg-primary/5"
                      : "border-border bg-muted/30"
                  )}
                >
                  {tier.popular && (
                    <div className="absolute -top-px left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-b-lg flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      Most Popular
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-1">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      tier.popular ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      <tier.icon className="w-4 h-4" />
                    </div>
                    <span className="font-black uppercase italic tracking-tight text-lg">{tier.name}</span>
                    <div className="ml-auto text-right">
                      <span className="text-2xl font-black">{tier.price}</span>
                      <span className="text-xs text-muted-foreground font-medium ml-0.5">{tier.priceSuffix}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs">
                        <div className={cn(
                          "w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                          tier.popular ? "bg-primary/10" : "bg-muted"
                        )}>
                          <Check className={cn("w-2.5 h-2.5", tier.popular ? "text-primary" : "text-muted-foreground")} strokeWidth={3} />
                        </div>
                        <span className="opacity-90">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    size="sm"
                    variant={tier.popular ? "default" : "outline"}
                    className="w-full font-black uppercase tracking-wider"
                    disabled={loadingPlan !== null}
                    onClick={() => handleCheckout(tier.id)}
                  >
                    {loadingPlan === tier.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      `Get ${tier.name}`
                    )}
                  </Button>
                </div>
              ))}
            </div>

            <div className="px-6 pb-6 text-center">
              <p className="text-xs text-muted-foreground">
                Secure payment via Dodo Payments. You can cancel or upgrade at any time.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
