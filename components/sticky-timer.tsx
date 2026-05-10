"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Copy, Check, X } from "lucide-react"

const PROMO_50 = {
  code: process.env.NEXT_PUBLIC_PROMO_UNDER_30 ?? "",
  discount: "50%",
}

// Challenge: if it took MORE than 60 seconds, they earn 50% off
function getPromo(seconds: number) {
  return seconds > 60 ? PROMO_50 : null
}

type TimerState = "hidden" | "running" | "slow" | "fast"

export function StickyTimer() {
  const [state, setState] = useState<TimerState>("hidden")
  const [elapsed, setElapsed] = useState(0)
  const [promo, setPromo] = useState<{ code: string; discount: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const startRef = useRef<number | null>(null)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTick = () => {
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null }
  }

  const dismiss = () => {
    clearTick()
    localStorage.removeItem("challenge_start_time")
    localStorage.removeItem("challenge_site_id")
    setState("hidden")
    setElapsed(0)
    setPromo(null)
  }

  const copyCode = () => {
    if (!promo?.code) return
    navigator.clipboard.writeText(promo.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Start timer when Generate Site is clicked
  useEffect(() => {
    const handleStart = () => {
      clearTick()
      const now = Date.now()
      startRef.current = now
      localStorage.setItem("challenge_start_time", String(now))
      setState("running")
      setElapsed(0)
      tickRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - now) / 1000))
      }, 500)
    }
    window.addEventListener("challenge-start", handleStart)
    return () => window.removeEventListener("challenge-start", handleStart)
  }, [])

  // Stop timer when site is published
  useEffect(() => {
    const handleComplete = (e: Event) => {
      const seconds = (e as CustomEvent<{ seconds: number }>).detail?.seconds
        ?? Math.floor((Date.now() - (startRef.current ?? Date.now())) / 1000)
      clearTick()
      setElapsed(seconds)
      const earned = getPromo(seconds)
      if (earned) {
        setPromo(earned)
        setState("slow") // took > 60s — give 50% off as promised
      } else {
        setState("fast") // under 60s — challenge met, no coupon needed
      }
      localStorage.removeItem("challenge_start_time")
    }
    window.addEventListener("challenge-complete", handleComplete)
    return () => window.removeEventListener("challenge-complete", handleComplete)
  }, [])

  // Resume if page reloaded mid-challenge
  useEffect(() => {
    const saved = localStorage.getItem("challenge_start_time")
    if (saved) {
      const start = Number(saved)
      const age = Math.floor((Date.now() - start) / 1000)
      if (age < 300) {
        startRef.current = start
        setState("running")
        setElapsed(age)
        tickRef.current = setInterval(() => {
          setElapsed(Math.floor((Date.now() - start) / 1000))
        }, 500)
      } else {
        localStorage.removeItem("challenge_start_time")
      }
    }
    return clearTick
  }, [])

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
      <AnimatePresence mode="wait">

        {/* Timer running */}
        {state === "running" && (
          <motion.div
            key="running"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="pointer-events-auto flex items-center gap-3 bg-primary text-primary-foreground pl-4 pr-2 py-2 rounded-full shadow-2xl shadow-primary/40"
          >
            <Zap className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium">60s challenge</span>
            <span className={`font-mono font-bold text-base tabular-nums ${elapsed > 60 ? "text-red-300" : ""}`}>
              {fmt(elapsed)}
            </span>
            <button
              onClick={dismiss}
              className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
              aria-label="Cancel"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}

        {/* Took > 60s — promo earned */}
        {state === "slow" && promo && (
          <motion.div
            key="slow"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="pointer-events-auto flex items-center gap-3 bg-card border border-primary/30 pl-4 pr-2 py-2 rounded-full shadow-2xl shadow-primary/20"
          >
            <span className="text-base">🎉</span>
            <span className="text-sm font-semibold text-foreground">
              Took {elapsed}s — <span className="text-primary">{promo.discount} off</span> as promised!
            </span>
            {promo.code ? (
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 font-mono font-bold text-xs hover:bg-primary/20 transition-colors"
              >
                {promo.code}
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3 opacity-60" />}
              </button>
            ) : (
              <span className="text-xs text-muted-foreground">Code sent to your email</span>
            )}
            <button
              onClick={dismiss}
              className="w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors text-muted-foreground"
              aria-label="Dismiss"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}

        {/* Under 60s — challenge met, no coupon */}
        {state === "fast" && (
          <motion.div
            key="fast"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="pointer-events-auto flex items-center gap-3 bg-card border border-border pl-4 pr-2 py-2 rounded-full shadow-xl"
          >
            <span className="text-base">⚡</span>
            <span className="text-sm font-semibold text-foreground">
              Done in {elapsed}s — challenge beaten!
            </span>
            <button
              onClick={dismiss}
              className="w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors text-muted-foreground"
              aria-label="Dismiss"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
