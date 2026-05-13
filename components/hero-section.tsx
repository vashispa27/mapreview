"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles, MapPin, Loader2, HelpCircle, X, Search, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mascot } from "@/components/mascot"
import dynamic from "next/dynamic"
const InteractiveConsoleWidget = dynamic(
  () => import("@/components/interactive-console-widget").then(m => m.InteractiveConsoleWidget),
  { ssr: false }
)
import { useSession, signIn } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { LoginModal } from "@/components/login-modal"
import { track } from "@/lib/analytics"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface SearchResult {
  id: string
  name: string
  address: string
  url: string
}

const businessTypes = ["Free gym website", "Private member dashboard", "Simple bills (No GST needed)", "Workout & diet plans", "Sell protein online", "Auto renewal reminders", "Live in 60 seconds", "No tech skills required"]

export function HeroSection() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isTutorialOpen, setIsTutorialOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [businessTypeIndex, setBusinessTypeIndex] = useState(0)

  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  // Confirm generate modal
  const [pendingResult, setPendingResult] = useState<SearchResult | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const clientCache = useRef(new Map<string, SearchResult[]>())
  const hasTrackedTyping = useRef(false)

  useEffect(() => {
    const handleFocusEvent = () => {
      inputRef.current?.focus()
      inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    }
    window.addEventListener("focus-input", handleFocusEvent)
    return () => window.removeEventListener("focus-input", handleFocusEvent)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setBusinessTypeIndex(prev => (prev + 1) % businessTypes.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    const key = searchQuery.toLowerCase()
    if (clientCache.current.has(key)) {
      setSearchResults(clientCache.current.get(key)!)
      setShowDropdown(true)
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await fetch(`/api/maps/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await res.json()
        if (res.ok && data.results) {
          clientCache.current.set(key, data.results)
          setSearchResults(data.results)
          setShowDropdown(data.results.length > 0)
        }
      } catch {
        // silently fail — search is a convenience feature
      } finally {
        setIsSearching(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const validateUrl = (testUrl: string) => {
    if (testUrl.trim().toLowerCase() === "admin") return null

    const isValid =
      testUrl.includes("maps.app.goo.gl") ||
      testUrl.includes("goo.gl/maps") ||
      testUrl.includes("google.com/maps") ||
      testUrl.includes("maps.google.com")

    return isValid ? null : "invalid"
  }

  const handleSelectResult = (result: SearchResult) => {
    setSearchQuery("")
    setShowDropdown(false)
    setPendingResult(result)
  }

  const handleGenerate = async (overrideUrl?: string) => {
    const finalUrl = (overrideUrl || url).trim()

    // ADMIN BYPASS
    if (finalUrl.toLowerCase() === "admin") {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      router.push(`/preview/admin-demo`)
      return
    }

    // OFFLINE MODE BYPASS
    if (process.env.NEXT_PUBLIC_OFFLINE_MODE === "true") {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 2000))
      router.push(`/preview/mock-site-id`)
      setIsLoading(false)
      return
    }

    if (!session) {
      signIn("google")
      return
    }

    if (!finalUrl) {
      setError("Please enter a Google Maps URL")
      return
    }

    const validationResult = validateUrl(finalUrl)
    if (validationResult === "invalid") {
      setIsTutorialOpen(true)
      return
    }

    setError("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: finalUrl }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to generate site")
        return
      }

      localStorage.setItem("challenge_site_id", data.jobId)
      window.dispatchEvent(new Event("challenge-start"))
      if (typeof window.gtag === "function") {
        window.gtag("event", "conversion", { send_to: "AW-18101188882/OEIxCP_ElJ4cEJLyqLdD" })
      }

      toast({
        title: "Site Generation Started!",
        description: "Your page is being built. Check the status in your My Sites dashboard.",
      })

      router.push("/my-sites")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* URL Tutorial Modal */}
      <Dialog open={isTutorialOpen} onOpenChange={setIsTutorialOpen}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-none bg-transparent shadow-none z-[200]">
          <div className="bg-card rounded-3xl overflow-hidden shadow-2xl border border-border">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold">Wrong Link Format</DialogTitle>
                  <DialogDescription>The link you pasted isn&apos;t a Google Maps &quot;Share&quot; link.</DialogDescription>
                </div>
              </div>
              <button onClick={() => setIsTutorialOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 bg-black">
              <img src="/url-tutorial.gif" alt="How to copy Google Maps URL" loading="lazy" decoding="async" className="w-full h-auto rounded-xl shadow-inner" />
            </div>
            <div className="p-6 bg-muted/30 text-center">
              <Button className="w-full h-12 text-base font-bold" onClick={() => setIsTutorialOpen(false)}>
                Got it, I&apos;ll copy the right link!
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Generate Modal */}
      <Dialog open={!!pendingResult} onOpenChange={(open) => { if (!open) setPendingResult(null) }}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none z-[200]">
          <div className="bg-card rounded-3xl overflow-hidden shadow-2xl border border-border">
            <div className="p-6 border-b border-border bg-muted/30">
              <DialogTitle className="text-lg font-bold text-foreground">Generate website for this gym?</DialogTitle>
              <DialogDescription className="sr-only">Confirm gym selection</DialogDescription>
            </div>
            {pendingResult && (
              <div className="p-6 flex flex-col gap-5">
                <div className="flex items-start gap-3 bg-muted/40 rounded-2xl p-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-foreground text-base leading-tight">{pendingResult.name}</p>
                    {pendingResult.address && (
                      <p className="text-sm text-muted-foreground mt-0.5 leading-snug">{pendingResult.address}</p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We will pull your <span className="font-semibold text-foreground">photos, reviews, ratings &amp; hours</span> from Google Maps and build your free website in 60 seconds.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-12"
                    onClick={() => setPendingResult(null)}
                    disabled={isLoading}
                  >
                    Go back
                  </Button>
                  <Button
                    className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/20"
                    onClick={() => {
                      const url = pendingResult.url
                      setPendingResult(null)
                      handleGenerate(url)
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Yes, generate my website
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />

      <section className="relative min-h-screen flex items-center justify-center px-4 py-12 md:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-12 items-center">
            {/* Left side - Content */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center lg:text-left pt-10 lg:pt-0 min-w-0"
            >
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 mb-5"
              >
                <span className="bg-[#22c55e]/10 text-[#16a34a] px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-[#22c55e]/20">
                  <Sparkles className="w-3 h-3" /> For Gym Owners · 100% Free
                </span>
              </motion.div>

              {/* Pain pills */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6"
              >
                {[
                  "Members not renewing?",
                  "New people can't find your gym?",
                  "Doing everything on WhatsApp?",
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
                Your gym is great.
                <br />
                <span className="text-primary relative inline-block">
                  Stop running it
                  <motion.svg
                    className="absolute -bottom-1 left-0 w-full"
                    viewBox="0 0 200 8"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.9, duration: 0.7 }}
                  >
                    <motion.path
                      d="M2 6 Q100 2 198 6"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </motion.svg>
                </span>{" "}
                <span className="text-muted-foreground/60">on WhatsApp.</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-base md:text-lg text-muted-foreground mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                Members stop paying and you find out too late. New people search for a gym and go somewhere else.{" "}
                <span className="text-foreground font-semibold">We give you gym software + a free website — both ready in 60 seconds.</span>
              </motion.p>

              {/* Problem → Solution trio */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42 }}
                className="space-y-3 mb-7 max-w-xl mx-auto lg:mx-0"
              >
                {[
                  { prob: "Members stop renewing",          sol: "We remind them automatically before they leave" },
                  { prob: "New people can't find your gym", sol: "Your gym gets a free website in 60 seconds"   },
                  { prob: "You track everything manually",  sol: "See all members and money in one place"       },
                ].map(({ prob, sol }) => (
                  <div key={prob} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground/50 line-through min-w-0">
                      <X className="w-3 h-3 text-red-400 stroke-[3] shrink-0" />
                      <span className="truncate">{prob}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 hidden sm:block" />
                    <div className="flex items-center gap-1.5 text-[#16a34a] font-semibold min-w-0 pl-[18px] sm:pl-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                      <span className="truncate">{sol}</span>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Outcomes */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-3 gap-2 mb-7 max-w-xl mx-auto lg:mx-0"
              >
                {[
                  { emoji: "📈", result: "More people join your gym",    sub: "They find you online" },
                  { emoji: "💰", result: "More money every month",       sub: "Fewer renewals missed" },
                  { emoji: "😌", result: "Less work for you",            sub: "It runs on its own" },
                ].map(({ emoji, result, sub }) => (
                  <div
                    key={result}
                    className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-3 text-center flex flex-col items-center gap-1"
                  >
                    <span className="text-xl leading-none">{emoji}</span>
                    <p className="text-[11px] font-bold text-[#166534] leading-tight">{result}</p>
                    <p className="text-[10px] text-[#16a34a]/70 leading-tight hidden sm:block">{sub}</p>
                  </div>
                ))}
              </motion.div>

              {/* URL Input Area */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col gap-3 max-w-xl mx-auto lg:mx-0"
              >
                {/* Auto-pull info banner */}
                <div className="flex items-start gap-2.5 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-3.5 py-2.5">
                  <span className="text-base leading-none mt-0.5">🗺️</span>
                  <p className="text-[12px] text-[#166534] leading-snug">
                    <span className="font-semibold">We automatically pull your photos, reviews, ratings &amp; hours from Google Maps</span> — nothing to type manually.
                  </p>
                </div>

                {/* Primary: Search your gym name */}
                <div className="relative" ref={searchRef}>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
                  {isSearching && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground z-10" />
                  )}
                  <Input
                    type="text"
                    placeholder="Search your gym name..."
                    value={searchQuery}
                    onChange={(e) => {
                      if (!session) { track("login_modal_opened"); setIsLoginModalOpen(true); return }
                      setSearchQuery(e.target.value)
                      if (!hasTrackedTyping.current) { hasTrackedTyping.current = true; track("search_typing") }
                    }}
                    onFocus={() => {
                      track("search_bar_clicked")
                      if (!session) { track("login_modal_opened"); setIsLoginModalOpen(true); return }
                      if (searchResults.length > 0) setShowDropdown(true)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setShowDropdown(false)
                    }}
                    className="pl-12 h-14 text-base bg-card border-border shadow-sm"
                  />

                  <AnimatePresence>
                    {showDropdown && searchResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-50 overflow-y-auto max-h-60"
                      >
                        {searchResults.map((result, i) => (
                          <button
                            key={result.id}
                            className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-muted/60 transition-colors ${i > 0 ? "border-t border-border/50" : ""}`}
                            onMouseDown={(e) => {
                              e.preventDefault()
                              handleSelectResult(result)
                            }}
                          >
                            <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium text-sm text-foreground truncate">{result.name}</p>
                              {result.address && (
                                <p className="text-xs text-muted-foreground truncate">{result.address}</p>
                              )}
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Divider */}
                <div className="relative flex items-center gap-4">
                  <div className="flex-1 h-px bg-border/50"></div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">or paste your Google Maps link</span>
                  <div className="flex-1 h-px bg-border/50"></div>
                </div>

                {/* Secondary: Paste link + Generate button */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      ref={inputRef}
                      type="url"
                      placeholder="Paste Google Maps link of your gym"
                      value={url}
                      onClick={() => track("search_bar_clicked")}
                      onChange={(e) => {
                        setUrl(e.target.value)
                        setError("")
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleGenerate()
                        }
                      }}
                      className="pl-10 h-11 text-sm bg-muted/30 border-dashed border-border"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    id="generate-btn"
                    size="default"
                    className="h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md shadow-primary/20 text-sm"
                    onClick={() => handleGenerate()}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate Site
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>

              {/* Error message */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-sm mt-2 max-w-xl mx-auto lg:mx-0"
                >
                  {error}
                </motion.p>
              )}
            </motion.div>

            {/* Right side - Interactive Widget */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative w-full min-w-0"
            >
              <InteractiveConsoleWidget />

              <motion.div
                className="absolute -left-16 -bottom-10 hidden lg:block z-20"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
              >
                <Mascot className="w-32 h-40" />
              </motion.div>
            </motion.div>
          </div>

          {/* Feature strip — visible without scrolling on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="mt-10 md:mt-14"
          >
            <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
              Everything included in one package
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { emoji: "💪", title: "Gym Software",       desc: "Manage all members & money" },
                { emoji: "🌐", title: "Free Website",       desc: "People find your gym online" },
                { emoji: "📱", title: "WhatsApp/Email Reminders", desc: "Auto alerts before renewal" },
                { emoji: "🧾", title: "GST Bills",          desc: "Send receipts in one click" },
                { emoji: "🥗", title: "Diet & Workout",     desc: "Send plans to members" },
                { emoji: "🏋️", title: "PT Sessions",        desc: "Track training & payments" },
              ].map(({ emoji, title, desc }) => (
                <div
                  key={title}
                  className="flex flex-col items-center text-center gap-2 bg-white border border-border rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
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
    </>
  )
}
