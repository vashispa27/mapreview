"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  MapPin, ArrowRight, Check, X, Sparkles, Star,
  UtensilsCrossed, Globe, Zap, ChefHat,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import Link from "next/link"

// ─── Nav ─────────────────────────────────────────────────────────────────────

function RestaurantNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
            <UtensilsCrossed className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-foreground">
            MapToSite <span className="text-orange-500">Food</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="https://maptosite.app/blog"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Blog
          </Link>
          <Button
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold"
            asChild
          >
            <Link href="https://maptosite.app">Get Started Free</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}

// ─── Restaurant website mockup ────────────────────────────────────────────────

function RestaurantMockup() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Browser chrome */}
      <div className="bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
        <div className="bg-zinc-800 px-4 py-3 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 bg-zinc-700 rounded-md px-3 py-1 text-[11px] text-zinc-400 flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-orange-400" />
            spicegarden.maptosite.app
          </div>
        </div>

        <div className="bg-zinc-950 text-white">
          {/* Hero band */}
          <div className="relative bg-gradient-to-br from-orange-900/60 to-zinc-900 p-6 text-center">
            <div className="text-4xl mb-2">🍛</div>
            <h3 className="text-xl font-black tracking-tight">Spice Garden</h3>
            <p className="text-orange-300 text-xs mt-1">North Indian · Mughlai · Koramangala</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-3 h-3 fill-orange-400 text-orange-400" />
              ))}
              <span className="text-[10px] text-zinc-400 ml-1">4.7 · 342 reviews</span>
            </div>
            <div className="mt-4 flex gap-2 justify-center">
              <span className="bg-green-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
                📱 Order on WhatsApp
              </span>
              <span className="bg-white/10 text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
                📞 Call Us
              </span>
            </div>
          </div>

          {/* Info row */}
          <div className="bg-zinc-900 px-4 py-3 flex justify-around text-center border-b border-zinc-800">
            {[
              { icon: "🕐", label: "11am – 11pm" },
              { icon: "📍", label: "Koramangala" },
              { icon: "💰", label: "₹400 for two" },
            ].map(({ icon, label }) => (
              <div key={label}>
                <div className="text-sm">{icon}</div>
                <div className="text-[9px] text-zinc-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Menu preview */}
          <div className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
              Popular Dishes
            </p>
            <div className="space-y-2">
              {[
                { name: "Butter Chicken", price: "₹320", desc: "Rich tomato gravy" },
                { name: "Dal Makhani", price: "₹240", desc: "Slow-cooked lentils" },
                { name: "Garlic Naan", price: "₹60", desc: "Fresh from tandoor" },
              ].map(({ name, price, desc }) => (
                <div
                  key={name}
                  className="flex items-center justify-between bg-zinc-800 rounded-xl px-3 py-2"
                >
                  <div>
                    <p className="text-[11px] font-bold">{name}</p>
                    <p className="text-[9px] text-zinc-500">{desc}</p>
                  </div>
                  <span className="text-[11px] font-black text-orange-400">{price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <motion.div
        className="absolute -top-4 -right-4 bg-green-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ⚡ Live in 60 seconds
      </motion.div>

      <motion.div
        className="absolute -bottom-4 -left-4 bg-white border-2 border-orange-200 rounded-xl p-2.5 shadow-xl"
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide">vs. Zomato</p>
        <p className="text-sm font-black text-red-500">−25% commission</p>
        <p className="text-[10px] text-green-600 font-bold">→ 100% profit stays with you</p>
      </motion.div>
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="min-h-screen flex items-center px-4 pt-20 pb-16">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Eyebrow */}
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-orange-200 mb-5"
            >
              <Sparkles className="w-3 h-3" /> For Restaurant Owners · Free to Start
            </motion.span>

            {/* Pain pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {[
                "Zomato taking 25% commission?",
                "No menu online?",
                "Customers can't find your hours?",
              ].map((p) => (
                <span
                  key={p}
                  className="flex items-center gap-1.5 bg-red-50 text-red-500 border border-red-100 px-3 py-1 rounded-full text-[11px] font-semibold"
                >
                  <X className="w-3 h-3 stroke-[3]" /> {p}
                </span>
              ))}
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-[1.1] tracking-tight mb-5"
            >
              Your restaurant is great.
              <br />
              <span className="text-orange-500 relative inline-block">
                Stop losing orders
                <motion.svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 200 8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.9, duration: 0.7 }}
                >
                  <motion.path
                    d="M2 6 Q100 2 198 6"
                    stroke="#f97316"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </span>{" "}
              <span className="text-muted-foreground/60">to Zomato.</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-base md:text-lg text-muted-foreground mb-6 max-w-xl leading-relaxed"
            >
              Every Zomato order costs you 25–30%. Every Google search goes somewhere else because you have no website.{" "}
              <span className="text-foreground font-semibold">
                We build your restaurant a free website from your Google Maps listing in 60 seconds — with your menu, reviews, and a direct WhatsApp order button.
              </span>
            </motion.p>

            {/* Problem → Solution */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42 }}
              className="space-y-3 mb-7 max-w-xl"
            >
              {[
                {
                  prob: "Paying 25% commission to Zomato on every order",
                  sol: "Direct WhatsApp orders — 0% commission, 100% yours",
                },
                {
                  prob: "Customers can't find your menu or timings online",
                  sol: "Full digital menu, live in 60 seconds",
                },
                {
                  prob: "Your Google reviews aren't converting anyone",
                  sol: "Reviews shown on your website, building trust instantly",
                },
              ].map(({ prob, sol }) => (
                <div
                  key={prob}
                  className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm"
                >
                  <div className="flex items-center gap-1.5 text-muted-foreground/50 line-through min-w-0">
                    <X className="w-3 h-3 text-red-400 stroke-[3] shrink-0" />
                    <span className="truncate">{prob}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 hidden sm:block" />
                  <div className="flex items-center gap-1.5 text-green-700 font-semibold min-w-0 pl-[18px] sm:pl-0">
                    <Check className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                    <span>{sol}</span>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Outcome cards */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-2 mb-8 max-w-xl"
            >
              {[
                { emoji: "💸", result: "0% commission", sub: "vs. 25% on Zomato" },
                { emoji: "📋", result: "Menu online", sub: "Photos + prices" },
                { emoji: "⚡", result: "60 seconds", sub: "To go live" },
              ].map(({ emoji, result, sub }) => (
                <div
                  key={result}
                  className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-center flex flex-col items-center gap-1"
                >
                  <span className="text-xl leading-none">{emoji}</span>
                  <p className="text-[11px] font-bold text-orange-900 leading-tight">{result}</p>
                  <p className="text-[10px] text-orange-700/70 leading-tight hidden sm:block">{sub}</p>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button
                size="lg"
                className="h-14 px-8 bg-orange-500 hover:bg-orange-600 text-white font-black text-base shadow-lg shadow-orange-500/25"
                asChild
              >
                <Link href="https://maptosite.app">
                  Get Your Free Restaurant Website
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xs text-muted-foreground mt-3"
            >
              No credit card · 60 seconds to go live · Pulls from Google Maps automatically
            </motion.p>
          </motion.div>

          {/* Right — mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:block"
          >
            <RestaurantMockup />
          </motion.div>
        </div>

        {/* Feature strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16"
        >
          <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
            Everything your restaurant website needs — built automatically
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { emoji: "🌐", title: "Free Website", desc: "Built from Google Maps in 60s" },
              { emoji: "📋", title: "Digital Menu", desc: "Photos, prices & categories" },
              { emoji: "📱", title: "Direct Orders", desc: "WhatsApp — 0% commission" },
              { emoji: "⭐", title: "Google Reviews", desc: "Your real stars on display" },
              { emoji: "🗺️", title: "Location Map", desc: "Directions embedded auto" },
              { emoji: "🕐", title: "Live Hours", desc: "Synced from Google Maps" },
            ].map(({ emoji, title, desc }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center gap-2 bg-white border border-border rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-orange-200 transition-all"
              >
                <span className="text-2xl leading-none">{emoji}</span>
                <div>
                  <p className="text-xs font-bold text-foreground">{title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Zomato problem ───────────────────────────────────────────────────────────

function ZomatoProblem() {
  return (
    <section className="py-24 px-4 bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            Every order on Zomato costs you{" "}
            <span className="text-orange-400">₹250 on a ₹1,000 order.</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Zomato and Swiggy charge 25–30% commission. On 50 orders a day at ₹800 average, that&apos;s
            over ₹1,00,000 a month leaving your pocket.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Without */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-red-950/30 border border-red-900/40 rounded-3xl p-8"
          >
            <p className="text-red-400 text-sm font-black uppercase tracking-widest mb-6">
              Without a website
            </p>
            <div className="space-y-4">
              {[
                "Every online order goes through Zomato — you pay 25% commission",
                "People search Google, can't find your menu, go elsewhere",
                "No way to show daily specials or seasonal dishes online",
                "Your visibility depends on Zomato's algorithm, not your reputation",
                "No direct relationship with customers who order online",
              ].map((pain) => (
                <div key={pain} className="flex items-start gap-3">
                  <X className="w-4 h-4 text-red-500 mt-0.5 shrink-0 stroke-[3]" />
                  <p className="text-sm text-zinc-300">{pain}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-red-900/20 rounded-2xl">
              <p className="text-sm text-zinc-400">Yearly Zomato commission at 50 orders/day:</p>
              <p className="text-3xl font-black text-red-400 mt-1">₹12,00,000+</p>
              <p className="text-xs text-zinc-500">paid to Zomato annually</p>
            </div>
          </motion.div>

          {/* With */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-green-950/30 border border-green-900/40 rounded-3xl p-8"
          >
            <p className="text-green-400 text-sm font-black uppercase tracking-widest mb-6">
              With MapToSite
            </p>
            <div className="space-y-4">
              {[
                "Customers order via WhatsApp directly — 0% commission to anyone",
                "Full menu with photos visible the moment they search Google",
                "Update daily specials in seconds from your dashboard",
                "You control your online presence — not an algorithm",
                "Build a direct customer list you actually own",
              ].map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0 stroke-[3]" />
                  <p className="text-sm text-zinc-300">{benefit}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-green-900/20 rounded-2xl">
              <p className="text-sm text-zinc-400">Cost of MapToSite Pro:</p>
              <p className="text-3xl font-black text-green-400 mt-1">₹9,999</p>
              <p className="text-xs text-zinc-500">per year · all features included</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── How it works ─────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      number: "01",
      emoji: "🔍",
      title: "Search your restaurant on Google Maps",
      desc: "Type your restaurant name. We find your listing — real photos, reviews, hours, location, everything already there.",
    },
    {
      number: "02",
      emoji: "⚡",
      title: "We build your website in 60 seconds",
      desc: "Your Google reviews, real photos, opening hours, and location are pulled automatically. Nothing to type, nothing to upload.",
    },
    {
      number: "03",
      emoji: "🚀",
      title: "Go live and take direct orders",
      desc: "Share your website link. Add it to your Google Maps bio. Watch WhatsApp inquiries start arriving — commission-free.",
    },
  ]

  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            Live in <span className="text-orange-500">60 seconds.</span>
            <br />
            No setup. No designer. No coding.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We pull everything from your existing Google Maps listing. If you&apos;re already on Google Maps,
            you&apos;re halfway there.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map(({ number, emoji, title, desc }, i) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center"
            >
              <div className="text-8xl font-black text-orange-500/8 absolute -top-4 left-1/2 -translate-x-1/2 select-none pointer-events-none leading-none">
                {number}
              </div>
              <div className="relative z-10">
                <div className="text-5xl mb-4">{emoji}</div>
                <h3 className="text-lg font-black mb-3 tracking-tight">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
              {i < 2 && (
                <span className="hidden md:block absolute top-8 -right-5 text-orange-300 text-2xl font-black">
                  →
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── What you get ─────────────────────────────────────────────────────────────

function WhatYouGet() {
  const features = [
    {
      emoji: "📋",
      title: "Digital menu with photos",
      desc: "Show every dish with a photo and price. Update from your dashboard anytime — changes go live instantly.",
    },
    {
      emoji: "⭐",
      title: "Google reviews on display",
      desc: "Your real star rating and customer reviews shown front-and-center. No fake testimonials — just your actual Google reviews.",
    },
    {
      emoji: "📱",
      title: "Direct WhatsApp ordering",
      desc: "One tap opens WhatsApp with a pre-filled order message. Zero commission. 100% of every order stays with you.",
    },
    {
      emoji: "📍",
      title: "Location & directions",
      desc: "Google Maps embedded so customers get directions in one click. No more 'how do I find you?' calls.",
    },
    {
      emoji: "🕐",
      title: "Live opening hours",
      desc: "Auto-synced from your Google Maps listing. Shows Open / Closed status in real time — always accurate.",
    },
    {
      emoji: "📸",
      title: "Your real restaurant photos",
      desc: "Pulled from your Google Maps profile automatically. Real ambiance, real dishes — not stock photos.",
    },
  ]

  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            Everything your restaurant website needs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            All built automatically from your Google Maps listing. No designer, no content to write,
            no photos to upload.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ emoji, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-2xl p-6 hover:border-orange-200 hover:shadow-lg transition-all"
            >
              <div className="text-3xl mb-4">{emoji}</div>
              <h3 className="font-black text-base mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function RestaurantPricing() {
  const tiers = [
    {
      name: "Base",
      price: "₹999",
      period: "/month",
      desc: "Your restaurant website, live today",
      badge: null,
      features: [
        "Restaurant website from Google Maps",
        "Digital menu with photos & prices",
        "WhatsApp direct order button",
        "Google reviews auto-displayed",
        "Live opening hours & location map",
        "Custom branding & colors",
        "Free hosting & unlimited edits",
      ],
      cta: "Get Started Free",
      highlight: false,
    },
    {
      name: "Pro",
      price: "₹9,999",
      period: "/year",
      desc: "Full restaurant management platform",
      badge: "Best Value",
      features: [
        "Everything in Base",
        "GST billing — auto invoices for orders",
        "Restaurant analytics dashboard",
        "Free custom domain (yourrestaurant.com)",
        "Priority support",
        "Advanced SEO — rank higher on Google",
        "Automatic photo sync from Google Maps",
      ],
      cta: "Get Pro",
      highlight: true,
    },
  ]

  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-lg text-muted-foreground">No hidden fees. No long-term contracts. Cancel any time.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-3xl border-2 p-8 flex flex-col ${
                tier.highlight
                  ? "border-orange-500 bg-card shadow-2xl shadow-orange-500/10"
                  : "border-border bg-card shadow-lg"
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">
                  {tier.badge}
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      tier.highlight ? "bg-orange-500/10" : "bg-muted"
                    }`}
                  >
                    {tier.highlight ? (
                      <Sparkles className={`w-4 h-4 ${tier.highlight ? "text-orange-500" : "text-muted-foreground"}`} />
                    ) : (
                      <Zap className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tight">{tier.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{tier.desc}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter">{tier.price}</span>
                  <span className="text-muted-foreground font-bold text-sm">{tier.period}</span>
                </div>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        tier.highlight ? "bg-orange-500/10" : "bg-muted"
                      }`}
                    >
                      <Check
                        className={`w-3 h-3 ${tier.highlight ? "text-orange-500" : "text-muted-foreground"}`}
                        strokeWidth={3}
                      />
                    </div>
                    <span className="font-medium opacity-90">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full h-14 text-base font-black uppercase tracking-widest ${
                  tier.highlight
                    ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25"
                    : ""
                }`}
                variant={tier.highlight ? "default" : "outline"}
                size="lg"
                asChild
              >
                <Link href="https://maptosite.app">{tier.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  const faqs = [
    {
      q: "Do I need to already be on Google Maps?",
      a: "Yes — and most restaurants already are. If you've ever appeared in a Google Search result, you have a Maps listing. We pull your photos, reviews, hours, and contact details from there automatically. Nothing to type.",
    },
    {
      q: "Does this replace Zomato / Swiggy?",
      a: "You can keep your Zomato presence for discovery if you want. But for customers who find you directly on Google, your MapToSite website gives them a way to order without Zomato's 25–30% commission.",
    },
    {
      q: "Can I add my full menu with prices?",
      a: "Yes. After your website is generated, you can add every dish with a photo, description, and price from your dashboard. Changes go live instantly.",
    },
    {
      q: "How do customers actually place an order?",
      a: "Your website has a WhatsApp button. Customers tap it, WhatsApp opens with a pre-filled message, and they place their order directly with you. No app, no third party, no commission.",
    },
    {
      q: "How long does setup take?",
      a: "60 seconds to generate your website from Google Maps. Adding your full menu takes another 15–30 minutes depending on how many dishes you have. That's it — you're live.",
    },
    {
      q: "What if my hours or photos change on Google Maps?",
      a: "Your website stays in sync with your Google Maps listing. Update your hours on Google, your website reflects it automatically.",
    },
  ]

  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">Common questions</h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map(({ q, a }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border border-border rounded-2xl overflow-hidden"
            >
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-bold text-sm">{q}</span>
                <span className="text-orange-500 text-xl font-black shrink-0 leading-none">
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                  {a}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="py-24 px-4 bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-6xl mb-6">🍽️</div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
            Ready to keep more of
            <br />
            <span className="text-orange-400">every order you earn?</span>
          </h2>
          <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Your Google Maps listing already has your photos, reviews, and hours. We turn it into a
            professional website in 60 seconds — with a direct order button that pays you, not Zomato.
          </p>
          <Button
            size="lg"
            className="h-14 px-10 bg-orange-500 hover:bg-orange-600 text-white font-black text-base shadow-lg shadow-orange-500/25"
            asChild
          >
            <Link href="https://maptosite.app">
              Get Your Free Restaurant Website
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <p className="text-zinc-600 text-xs mt-5">
            Free to start · No credit card · 60 seconds to go live
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function RestaurantLanding() {
  return (
    <div className="min-h-screen bg-background">
      <RestaurantNav />
      <Hero />
      <ZomatoProblem />
      <HowItWorks />
      <WhatYouGet />
      <RestaurantPricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  )
}
