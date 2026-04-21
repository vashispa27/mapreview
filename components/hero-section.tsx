"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles, MapPin, Loader2, HelpCircle, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mascot } from "@/components/mascot"
import { SpeedChallengeHeroCard } from "@/components/speed-challenge-section"
import { useSession, signIn } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { LoginModal } from "@/components/login-modal"
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

const businessTypes = ["Live in 60 seconds", "Gym management software", "Member billing & GST invoices", "Diet & workout planner", "Ecommerce built-in", "No drag and drop. Ever.", "Restaurants & dhabas", "Zero coding required"]

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

  const inputRef = useRef<HTMLInputElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  // Client-side cache: query → results (lives for the page session)
  const clientCache = useRef(new Map<string, SearchResult[]>())

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
    setUrl(result.url)
    setError("")
    setSearchQuery("")
    setShowDropdown(false)
    // Focus the main URL input so the user can immediately hit Generate
    setTimeout(() => inputRef.current?.focus(), 50)
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

      // Start the speed challenge timer — stops when user publishes
      window.dispatchEvent(new Event("challenge-start"))

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
              <img
                src="/url-tutorial.gif"
                alt="How to copy Google Maps URL"
                loading="lazy"
                decoding="async"
                className="w-full h-auto rounded-xl shadow-inner"
              />
            </div>
            <div className="p-6 bg-muted/30 text-center">
              <Button className="w-full h-12 text-base font-bold" onClick={() => setIsTutorialOpen(false)}>
                Got it, I&apos;ll copy the right link!
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />

      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 mb-6 h-10"
              >
                <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={businessTypeIndex}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className="inline-block"
                    >
                      {businessTypes[businessTypeIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="text-sm text-muted-foreground font-medium">— no page builder needed.</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
              >
                <span className="text-balance">Your business, fully managed.</span>{" "}
                <span className="text-primary relative">
                  Built in 60 seconds.
                  <motion.svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 12"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  >
                    <motion.path
                      d="M2 8 Q100 2 198 8"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </motion.svg>
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 text-pretty"
              >
                Paste your Google Maps link and we build your website, ecommerce store, gym member console, diet & workout planner, and GST billing system — all in one.{" "}
                <span className="text-foreground font-medium">No developers. No drag and drop. Just 60 seconds.</span>
              </motion.p>

              {/* URL Input Area */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col gap-4 max-w-xl mx-auto lg:mx-0"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      ref={inputRef}
                      type="url"
                      placeholder="Paste Google Maps link..."
                      value={url}
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
                      className="pl-12 h-14 text-base bg-card border-border shadow-sm"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    id="generate-btn"
                    size="lg"
                    className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25"
                    onClick={() => handleGenerate()}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate Site
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>
                </div>

                  <div className="relative py-2 flex items-center gap-4">
                    <div className="flex-1 h-px bg-border/50"></div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">or search directly</span>
                    <div className="flex-1 h-px bg-border/50"></div>
                  </div>

                  {/* Inline search with autocomplete dropdown */}
                  <div className="relative" ref={searchRef}>
                    <Search className="absolute left-4 top-[18px] w-5 h-5 text-muted-foreground pointer-events-none z-10" />
                    {isSearching && (
                      <Loader2 className="absolute right-4 top-[18px] w-4 h-4 animate-spin text-muted-foreground z-10" />
                    )}
                    <Input
                      type="text"
                      placeholder="Search for your business name..."
                      value={searchQuery}
                      onChange={(e) => {
                        if (!session) { setIsLoginModalOpen(true); return }
                        setSearchQuery(e.target.value)
                      }}
                      onFocus={() => {
                        if (!session) { setIsLoginModalOpen(true); return }
                        if (searchResults.length > 0) setShowDropdown(true)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") setShowDropdown(false)
                      }}
                      className="pl-12 h-14 text-base bg-muted/30 border-dashed border-border"
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
                                  // onMouseDown fires before onBlur so the input doesn't lose focus first
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

            {/* Right side - Speed Challenge Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <SpeedChallengeHeroCard className="w-full max-w-md mx-auto" />

              <motion.div
                className="absolute -left-16 bottom-0 hidden lg:block"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
              >
                <Mascot className="w-32 h-40" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
