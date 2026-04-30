"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin, ArrowRight, Check, X, Sparkles, Star,
  UtensilsCrossed, Zap, Search, Loader2, HelpCircle,
  BookOpen, Gift, Tag, CalendarCheck,
  LayoutGrid, LogOut, Menu as MenuIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Footer } from "@/components/footer"
import { LoginModal } from "@/components/login-modal"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface SearchResult {
  id: string
  name: string
  address: string
  url: string
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function RestaurantNav() {
  const { data: session, status } = useSession()
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} accent="red" />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-foreground">
              MapToSite <span className="text-red-600">Food</span>
            </span>
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#pricing"
              className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 rounded-full focus:outline-none">
                    <span className="text-sm font-medium text-muted-foreground">{session.user?.name}</span>
                    <Avatar className="w-8 h-8 border-2 border-red-200 cursor-pointer">
                      <AvatarImage src={session.user?.image || ""} />
                      <AvatarFallback className="bg-red-50 text-red-600 text-xs font-bold">
                        {session.user?.name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel className="flex flex-col gap-0.5">
                    <span className="font-semibold text-sm">{session.user?.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">{session.user?.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/my-sites?from=food" className="flex items-center gap-2 cursor-pointer">
                      <LayoutGrid className="w-4 h-4" /> My Sites
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={() => signOut()} className="cursor-pointer">
                    <LogOut className="w-4 h-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setLoginModalOpen(true)}>
                  Log in
                </Button>
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white font-bold" onClick={() => window.dispatchEvent(new Event("focus-restaurant-input"))}>
                  Get Started Free
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg px-4 py-4 flex flex-col gap-3"
            >
              <a
                href="#pricing"
                className="text-sm font-semibold py-2 border-b border-border"
                onClick={() => setMobileOpen(false)}
              >
                Pricing
              </a>
              {session ? (
                <>
                  <div className="flex items-center gap-3 pb-3 border-b border-border">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={session.user?.image || ""} />
                      <AvatarFallback className="bg-red-50 text-red-600 text-xs font-bold">{session.user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{session.user?.name}</p>
                      <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
                    <Link href="/my-sites?from=food" onClick={() => setMobileOpen(false)}><LayoutGrid className="w-4 h-4" /> My Sites</Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-destructive" onClick={() => signOut()}>
                    <LogOut className="w-4 h-4" /> Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full" onClick={() => { setMobileOpen(false); setLoginModalOpen(true) }}>
                    Log in
                  </Button>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold" onClick={() => { setMobileOpen(false); window.dispatchEvent(new Event("focus-restaurant-input")) }}>
                    Get Started Free
                  </Button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}

// ─── Static Google Search mockup ──────────────────────────────────────────────

function GoogleSearchMockup() {
  return (
    <div className="relative mx-auto pb-10" style={{ maxWidth: 320 }}>
      {/* Phone shell */}
      <div className="bg-zinc-900 rounded-[2.5rem] p-3 shadow-2xl ring-1 ring-white/10">
        <div className="bg-zinc-800 rounded-[2rem] overflow-hidden">
          {/* Status bar */}
          <div className="bg-zinc-800 px-5 py-2 flex justify-between items-center">
            <span className="text-[10px] text-zinc-400 font-semibold">9:41</span>
            <span className="text-[9px] text-zinc-400">●●● 4G</span>
          </div>

          {/* Google Maps UI */}
          <div className="bg-[#f8f9fa]">
            {/* Search bar */}
            <div className="bg-white px-3 pt-2.5 pb-2 shadow-sm">
              <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow border border-zinc-200">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 via-red-500 to-yellow-400 shrink-0" />
                <span className="text-[12px] text-zinc-700 flex-1 font-medium">restaurants near me</span>
                <Search className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              {/* Category chips */}
              <div className="flex gap-1.5 mt-2 overflow-x-hidden">
                {["All", "Pizza", "Chinese", "Biryani"].map((c, i) => (
                  <span
                    key={c}
                    className={cn(
                      "text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0",
                      i === 0 ? "bg-zinc-800 text-white" : "bg-white text-zinc-600 border border-zinc-200"
                    )}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Results list */}
            <div className="px-3 pt-2 pb-3 space-y-2">
              {/* Competitor 1 */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-2.5 shadow-sm">
                <div className="flex gap-2.5">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-orange-200 shrink-0 flex items-center justify-center text-2xl">
                    🍕
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-bold text-zinc-900 leading-tight">Pizzeria Roma</p>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-[9px] text-zinc-500 ml-0.5">4.8 (312)</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      <span className="bg-blue-50 text-blue-600 text-[8px] font-bold px-1.5 py-0.5 rounded-full">🌐 Menu</span>
                      <span className="bg-green-50 text-green-700 text-[8px] font-bold px-1.5 py-0.5 rounded-full">🗓️ Book Table</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Competitor 2 */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-2.5 shadow-sm">
                <div className="flex gap-2.5">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-100 to-rose-200 shrink-0 flex items-center justify-center text-2xl">
                    🍔
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-bold text-zinc-900 leading-tight">Burger Republic</p>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-[9px] text-zinc-500 ml-0.5">4.6 (187)</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      <span className="bg-blue-50 text-blue-600 text-[8px] font-bold px-1.5 py-0.5 rounded-full">🌐 Menu</span>
                      <span className="bg-purple-50 text-purple-600 text-[8px] font-bold px-1.5 py-0.5 rounded-full">🏷️ Offer</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* YOUR restaurant — highlighted */}
              <div className="bg-red-50 rounded-2xl border-2 border-red-400 p-2.5 shadow-md relative">
                <div className="absolute -top-2.5 left-3 bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full">
                  👇 This is you
                </div>
                <div className="flex gap-2.5">
                  <div className="w-14 h-14 rounded-xl bg-zinc-100 shrink-0 flex items-center justify-center text-2xl opacity-50">
                    🍽️
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-bold text-zinc-900 leading-tight">Your Restaurant</p>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-[9px] text-zinc-500 ml-0.5">4.7 (156)</span>
                    </div>
                    <p className="text-[9px] text-red-500 font-bold mt-1.5">
                      ❌ No website · No menu · No booking
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Caption below phone */}
      <div className="absolute -bottom-1 left-0 right-0 flex justify-center">
        <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full shadow-sm">
          Customers tap competitors — not you
        </span>
      </div>
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [pendingResult, setPendingResult] = useState<SearchResult | null>(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isTutorialOpen, setIsTutorialOpen] = useState(false)

  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const clientCache = useRef(new Map<string, SearchResult[]>())

  useEffect(() => {
    const handleFocus = () => {
      inputRef.current?.focus()
      inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    }
    window.addEventListener("focus-restaurant-input", handleFocus)
    return () => window.removeEventListener("focus-restaurant-input", handleFocus)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (searchQuery.length < 3) { setSearchResults([]); setShowDropdown(false); return }
    const key = searchQuery.toLowerCase()
    if (clientCache.current.has(key)) { setSearchResults(clientCache.current.get(key)!); setShowDropdown(true); return }
    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await fetch(`/api/maps/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await res.json()
        if (res.ok && data.results) { clientCache.current.set(key, data.results); setSearchResults(data.results); setShowDropdown(data.results.length > 0) }
      } catch { /* silently fail */ } finally { setIsSearching(false) }
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const validateUrl = (u: string) => {
    if (u.trim().toLowerCase() === "admin") return null
    const valid = u.includes("maps.app.goo.gl") || u.includes("goo.gl/maps") || u.includes("google.com/maps") || u.includes("maps.google.com")
    return valid ? null : "invalid"
  }

  const handleGenerate = async (overrideUrl?: string) => {
    const finalUrl = (overrideUrl || url).trim()
    if (!session) { setIsLoginModalOpen(true); return }
    if (!finalUrl) { setError("Please enter a Google Maps URL"); return }
    if (validateUrl(finalUrl) === "invalid") { setIsTutorialOpen(true); return }
    setError(""); setIsLoading(true)
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: finalUrl }) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Failed to generate site"); return }
      window.dispatchEvent(new Event("challenge-start"))
      toast({ title: "Site Generation Started!", description: "Your restaurant page is being built. Check your My Sites dashboard." })
      router.push("/my-sites?from=food")
    } catch { setError("Something went wrong. Please try again.") } finally { setIsLoading(false) }
  }

  const handleSelectResult = (result: SearchResult) => {
    if (!session) { setIsLoginModalOpen(true); return }
    setSearchQuery(""); setShowDropdown(false); setPendingResult(result)
  }

  return (
    <>
      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} accent="red" />

      {/* URL tutorial dialog */}
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
              <Button className="w-full h-12 text-base font-bold bg-red-600 hover:bg-red-700 text-white" onClick={() => setIsTutorialOpen(false)}>
                Got it, I&apos;ll copy the right link!
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm dialog */}
      <Dialog open={!!pendingResult} onOpenChange={(o) => { if (!o) setPendingResult(null) }}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none z-[200]">
          <div className="bg-card rounded-3xl overflow-hidden shadow-2xl border border-border">
            <div className="p-6 border-b border-border bg-muted/30">
              <DialogTitle className="text-lg font-bold">Generate website for this restaurant?</DialogTitle>
              <DialogDescription className="sr-only">Confirm restaurant selection</DialogDescription>
            </div>
            {pendingResult && (
              <div className="p-6 flex flex-col gap-5">
                <div className="flex items-start gap-3 bg-muted/40 rounded-2xl p-4">
                  <div className="w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-foreground text-base leading-tight">{pendingResult.name}</p>
                    {pendingResult.address && <p className="text-sm text-muted-foreground mt-0.5 leading-snug">{pendingResult.address}</p>}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We will pull your <span className="font-semibold text-foreground">photos, reviews, ratings &amp; hours</span> from Google Maps and build your restaurant website in 60 seconds.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 h-12" onClick={() => setPendingResult(null)} disabled={isLoading}>Go back</Button>
                  <Button
                    className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-600/20"
                    onClick={() => { const u = pendingResult.url; setPendingResult(null); handleGenerate(u) }}
                    disabled={isLoading}
                  >
                    {isLoading ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Generating...</> : <>Yes, build my website<ArrowRight className="ml-2 w-4 h-4" /></>}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <section className="min-h-screen flex items-center px-4 pt-20 pb-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left — copy + inline search */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <motion.span
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-red-200 mb-5"
              >
                <Sparkles className="w-3 h-3" /> For Restaurant Owners
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-[1.1] tracking-tight mb-5"
              >
                Your restaurant is
                <br />
                <span className="text-red-600 relative inline-block">
                  invisible
                  <motion.svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 120 8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9, duration: 0.6 }}>
                    <motion.path d="M2 6 Q60 2 118 6" stroke="#dc2626" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </motion.svg>
                </span>{" "}
                to real customers.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-base md:text-lg text-muted-foreground mb-6 max-w-xl leading-relaxed"
              >
                Hundreds of people search &ldquo;restaurants near me&rdquo; every day in your area. They see your
                competitors&apos; menus, photos, and offers — then they choose.{" "}
                <span className="text-foreground font-semibold">
                  If you don&apos;t have a website, you&apos;re not even in the conversation.
                </span>
              </motion.p>

              {/* Inline search UI */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
                className="flex flex-col gap-3 max-w-xl"
              >
                {/* Info banner */}
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                  <span className="text-base leading-none mt-0.5">🗺️</span>
                  <p className="text-[12px] text-red-700 leading-snug">
                    <span className="font-semibold">We automatically pull your photos, reviews, ratings &amp; hours from Google Maps</span> — nothing to type manually.
                  </p>
                </div>

                {/* Search by name */}
                <div className="relative" ref={searchRef}>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
                  {isSearching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground z-10" />}
                  <Input
                    type="text"
                    placeholder="Search your restaurant name..."
                    value={searchQuery}
                    readOnly={!session}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => { if (searchResults.length > 0) setShowDropdown(true) }}
                    onClick={() => { if (!session) setIsLoginModalOpen(true) }}
                    onKeyDown={(e) => { if (e.key === "Escape") setShowDropdown(false) }}
                    className={cn("pl-12 h-14 text-base bg-card border-border shadow-sm", !session && "cursor-pointer")}
                  />
                  <AnimatePresence>
                    {showDropdown && searchResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-50 overflow-y-auto max-h-60"
                      >
                        {searchResults.map((result, i) => (
                          <button
                            key={result.id}
                            className={cn("w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-muted/60 transition-colors", i > 0 && "border-t border-border/50")}
                            onMouseDown={(e) => { e.preventDefault(); handleSelectResult(result) }}
                          >
                            <MapPin className="w-4 h-4 mt-0.5 text-red-600 shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium text-sm text-foreground truncate">{result.name}</p>
                              {result.address && <p className="text-xs text-muted-foreground truncate">{result.address}</p>}
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Divider */}
                <div className="relative flex items-center gap-4">
                  <div className="flex-1 h-px bg-border/50" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">or paste your Google Maps link</span>
                  <div className="flex-1 h-px bg-border/50" />
                </div>

                {/* URL paste + Generate */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      ref={inputRef}
                      type="url"
                      placeholder="Paste Google Maps link of your restaurant"
                      value={url}
                      onChange={(e) => { setUrl(e.target.value); setError("") }}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleGenerate() } }}
                      className="pl-10 h-11 text-sm bg-muted/30 border-dashed border-border"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    className="h-11 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md shadow-red-600/20 text-sm"
                    onClick={() => handleGenerate()}
                    disabled={isLoading}
                  >
                    {isLoading ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Building...</> : <>Get your restaurant live<ArrowRight className="ml-2 w-4 h-4" /></>}
                  </Button>
                </div>

                {error && <p className="text-destructive text-sm">{error}</p>}

                {/* Trust pills */}
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {[{ emoji: "⚡", label: "Live in 60 seconds" }, { emoji: "🚫", label: "No code" }, { emoji: "🚫", label: "No drag & drop" }, { emoji: "💳", label: "No credit card" }].map(({ emoji, label }) => (
                    <span key={label} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-muted/60 border border-border px-3 py-1.5 rounded-full">
                      <span className="text-sm leading-none">{emoji}</span>{label}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right — static Google search mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col items-center gap-6"
            >
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-center">What your customers see right now</p>
              <GoogleSearchMockup />
            </motion.div>
          </div>

          {/* Feature strip */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-20">
            <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
              Everything your restaurant website needs — built automatically
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { emoji: "🌐", title: "Free Website", desc: "Built from Google Maps in 60s" },
                { emoji: "📋", title: "Digital Menu", desc: "Photos, prices & categories" },
                { emoji: "⭐", title: "Google Reviews", desc: "Your real stars on display" },
                { emoji: "🗓️", title: "Table Booking", desc: "Reserve directly from site" },
                { emoji: "🎁", title: "Loyalty Program", desc: "Bring customers back" },
                { emoji: "🏷️", title: "Offers & Deals", desc: "Promote specials anytime" },
              ].map(({ emoji, title, desc }) => (
                <div key={title} className="flex flex-col items-center text-center gap-2 bg-white border border-border rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-red-200 transition-all">
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

// ─── The real cost ────────────────────────────────────────────────────────────

function TheCost() {
  const stats = [
    { number: "78%", label: "of diners research a restaurant online before deciding where to go" },
    { number: "3×", label: "more likely to choose a restaurant that shows a menu and photos online" },
    { number: "0", label: "new customers your Google reviews bring in without a website to land on" },
  ]

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
            Your restaurant is getting passed over{" "}
            <span className="text-red-400">every single day.</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            The decision of where to eat is made before they leave home. If you&apos;re not showing them
            a menu and photos, someone else is.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {stats.map(({ number, label }, i) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-8 bg-white/5 rounded-3xl border border-white/10"
            >
              <p className="text-6xl font-black text-red-400 mb-4">{number}</p>
              <p className="text-zinc-300 text-sm leading-relaxed">{label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-red-950/30 border border-red-900/40 rounded-3xl p-8"
          >
            <p className="text-red-400 text-sm font-black uppercase tracking-widest mb-6">Without a website</p>
            <div className="space-y-4">
              {[
                "Customers can't see your menu before visiting",
                "No way to show off your ambiance or signature dishes",
                "No place to announce Happy Hour or seasonal deals",
                "First-time customers have no reason to come back",
                "You're invisible on Google to anyone who doesn't already know you",
              ].map((pain) => (
                <div key={pain} className="flex items-start gap-3">
                  <X className="w-4 h-4 text-red-500 mt-0.5 shrink-0 stroke-[3]" />
                  <p className="text-sm text-zinc-300">{pain}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-green-950/30 border border-green-900/40 rounded-3xl p-8"
          >
            <p className="text-green-400 text-sm font-black uppercase tracking-widest mb-6">With MapToSite</p>
            <div className="space-y-4">
              {[
                "Full menu with photos — visible before they even step in",
                "Real Google photos show your restaurant at its best",
                "Post offers, deals, and seasonal menus anytime",
                "Send loyalty rewards to bring customers back automatically",
                "Table booking on your website — no calls, no friction",
              ].map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0 stroke-[3]" />
                  <p className="text-sm text-zinc-300">{benefit}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── What you get ─────────────────────────────────────────────────────────────

function WhatYouGet() {
  const features = [
    {
      icon: BookOpen,
      title: "Digital menu with photos",
      desc: "Every dish with a photo and price. Customers know exactly what to expect before walking in. Update it yourself in seconds.",
    },
    {
      icon: Star,
      title: "Google reviews on display",
      desc: "Your real star rating and customer reviews shown front-and-center. Social proof that turns a searcher into a booking.",
    },
    {
      icon: CalendarCheck,
      title: "Table booking",
      desc: "Customers reserve a table directly from your website. Simple form, instant notification to you — fills your tables without phone calls.",
    },
    {
      icon: Gift,
      title: "Loyalty programs",
      desc: "Reward your regulars. Set milestones — every 5th visit gets a free dessert — and send rewards automatically to keep people coming back.",
    },
    {
      icon: Tag,
      title: "Offers & promotions",
      desc: "Run Happy Hour deals, weekend specials, or seasonal menus directly on your website. Update in seconds, no developer needed.",
    },
    {
      icon: MapPin,
      title: "Photos & gallery from Google Maps",
      desc: "Your real restaurant photos pulled automatically. Real ambiance, real dishes — not stock images.",
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
            Everything your restaurant
            <br />
            website needs to win customers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built automatically from your Google Maps listing. Menu, photos, reviews, booking — live in 60 seconds.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-card border border-border rounded-2xl p-6 hover:border-red-200 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
                <Icon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-black text-base mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            className="h-14 px-8 bg-red-600 hover:bg-red-700 text-white font-black shadow-lg shadow-red-600/25"
            onClick={() => window.dispatchEvent(new Event("focus-restaurant-input"))}
          >
            Get Your Restaurant Online
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Loyalty spotlight ────────────────────────────────────────────────────────

function LoyaltySpotlight() {
  return (
    <section className="py-24 px-4 bg-red-50">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-600 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-red-200 mb-5">
              <Gift className="w-3 h-3" /> Turn one-time visitors into regulars
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-5">
              A great meal brings them once.
              <br />
              <span className="text-red-600">A loyalty program brings them back.</span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-6">
              Most restaurants have no way to reach customers after they leave. With MapToSite, you set up
              a loyalty program and send targeted offers to people who&apos;ve visited — so they come back
              instead of trying somewhere new.
            </p>
            <div className="space-y-4">
              {[
                { emoji: "🎁", title: "Reward your regulars", desc: "Every 5th visit gets a free dessert, a discount, or a special offer." },
                { emoji: "📢", title: "Promote deals instantly", desc: "Post a Happy Hour deal or weekend special in 30 seconds. No designer." },
                { emoji: "📅", title: "Seasonal menus", desc: "Holiday specials, festival offers, new dish launches — publish anytime." },
              ].map(({ emoji, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <span className="text-2xl leading-none shrink-0">{emoji}</span>
                  <div>
                    <p className="font-bold text-sm">{title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Offer card mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-red-100 overflow-hidden">
              <div className="bg-gradient-to-br from-red-600 to-red-700 p-6 text-white text-center">
                <div className="text-4xl mb-2">🍕</div>
                <h3 className="text-xl font-black">Spice Garden</h3>
                <p className="text-red-200 text-xs mt-1">Loyalty Rewards</p>
              </div>
              <div className="p-6">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Your Stamp Card</p>
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      className={cn(
                        "aspect-square rounded-xl flex items-center justify-center text-lg font-black",
                        n <= 3
                          ? "bg-red-600 text-white shadow-md"
                          : "bg-muted border-2 border-dashed border-border text-muted-foreground/30"
                      )}
                    >
                      {n <= 3 ? "⭐" : ""}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center mb-6">
                  2 more visits to unlock your{" "}
                  <span className="font-bold text-red-600">free dessert 🎂</span>
                </p>
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Today&apos;s Offer</span>
                    <span className="text-[10px] text-muted-foreground">Ends midnight</span>
                  </div>
                  <p className="font-black text-base text-foreground">Happy Hour 🍹</p>
                  <p className="text-sm text-muted-foreground mt-1">20% off all drinks · 5pm – 8pm</p>
                </div>
              </div>
            </div>
            <motion.div
              className="absolute -top-4 -right-4 bg-green-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              📲 Sent to 340 customers
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── How it works ─────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    { number: "01", emoji: "🔍", title: "Search your restaurant on Google Maps", desc: "Type your restaurant name. We find your listing — real photos, reviews, hours, location, everything already there." },
    { number: "02", emoji: "⚡", title: "Your website is built in 60 seconds", desc: "Photos, reviews, opening hours, and location are pulled automatically. Add your menu and set up your offers." },
    { number: "03", emoji: "🚀", title: "Customers find you. And come back.", desc: "Share your link. Add it to your Google Maps bio. Customers browse your menu, book a table, and join your loyalty program." },
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
            Live in <span className="text-red-600">60 seconds.</span>
            <br />
            No code. No drag &amp; drop.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            If your restaurant is on Google Maps, you&apos;re halfway there. We pull everything from
            your existing listing automatically.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map(({ number, emoji, title, desc }, i) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center"
            >
              <div className="text-8xl font-black text-red-600/8 absolute -top-4 left-1/2 -translate-x-1/2 select-none pointer-events-none leading-none">
                {number}
              </div>
              <div className="relative z-10">
                <div className="text-5xl mb-4">{emoji}</div>
                <h3 className="text-lg font-black mb-3 tracking-tight">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
              {i < 2 && (
                <span className="hidden md:block absolute top-8 -right-5 text-red-300 text-2xl font-black">→</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function RestaurantPricing() {
  const { data: session } = useSession()
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const handleCheckout = async (plan: string) => {
    if (!session) { setLoginModalOpen(true); return }
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
    } catch {
      alert("Something went wrong. Please try again.")
    } finally {
      setLoadingPlan(null)
    }
  }

  const tiers = [
    {
      id: "food-base",
      name: "Base",
      price: "₹149",
      period: "/month",
      desc: "Your restaurant website, live today",
      badge: null,
      features: [
        "Manage up to 10 restaurant chains",
        "Auto-sync photos & reviews from Google Maps",
        "Free hosting — no extra cost",
        "Unlimited campaigns & promotions on your page",
        "Send rewards & coupons to customers",
        "Free WhatsApp integration",
        "Unlimited table bookings",
      ],
      cta: "Get Base",
      highlight: false,
    },
    {
      id: "food-pro",
      name: "Pro",
      price: "₹1,299",
      period: "/year",
      desc: "Full restaurant marketing platform",
      badge: "Best Value",
      features: [
        "Everything in Base — billed annually",
        "Manage up to 10 restaurant chains",
        "Auto-sync photos & reviews from Google Maps",
        "Free hosting — no extra cost",
        "Unlimited campaigns & promotions on your page",
        "Send rewards & coupons to customers",
        "Free WhatsApp integration",
        "Unlimited table bookings",
      ],
      cta: "Get Pro",
      highlight: true,
    },
  ]

  return (
    <>
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} accent="red" />
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Simple, honest pricing</h2>
            <p className="text-lg text-muted-foreground">No hidden fees. Cancel any time.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "relative rounded-3xl border-2 p-8 flex flex-col",
                  tier.highlight
                    ? "border-red-500 bg-card shadow-2xl shadow-red-500/10"
                    : "border-border bg-card shadow-lg"
                )}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">
                    {tier.badge}
                  </div>
                )}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", tier.highlight ? "bg-red-600/10" : "bg-muted")}>
                      {tier.highlight
                        ? <Sparkles className="w-4 h-4 text-red-600" />
                        : <Zap className="w-4 h-4 text-muted-foreground" />}
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
                      <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5", tier.highlight ? "bg-red-600/10" : "bg-muted")}>
                        <Check className={cn("w-3 h-3", tier.highlight ? "text-red-600" : "text-muted-foreground")} strokeWidth={3} />
                      </div>
                      <span className="font-medium opacity-90">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={cn(
                    "w-full h-14 text-base font-black uppercase tracking-widest",
                    tier.highlight && "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25"
                  )}
                  variant={tier.highlight ? "default" : "outline"}
                  size="lg"
                  disabled={loadingPlan !== null}
                  onClick={() => handleCheckout(tier.id)}
                >
                  {loadingPlan === tier.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : tier.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  const faqs = [
    { q: "Do I need to already be on Google Maps?", a: "Yes — and most restaurants already are. If you've ever appeared in a Google Search result, you have a Maps listing. We pull your photos, reviews, hours, and contact info from there automatically." },
    { q: "Can I add my full menu with photos and prices?", a: "Yes. After your website is generated, you add menu items with photos, descriptions, and prices from your dashboard. Changes go live instantly." },
    { q: "How does table booking work?", a: "Your website includes a reservation form. Customers fill in their name, date, time, and party size — you get notified and can confirm. No third-party platform needed." },
    { q: "How do the loyalty programs work?", a: "You set up a loyalty scheme — for example, every 5th visit gets a free dessert. Customers opt in through your website, and you can send offers and rewards to your loyalty members." },
    { q: "How do I run offers and promotions?", a: "From your dashboard, publish any offer — Happy Hour deals, seasonal specials, new dish launches — and they appear on your website immediately. No developer, no waiting." },
    { q: "What if my hours or photos change on Google Maps?", a: "Your website syncs with your Google Maps listing. Update your hours on Google and your website reflects it automatically." },
  ]

  return (
    <section className="py-24 px-4 bg-muted/30">
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
              className="border border-border rounded-2xl overflow-hidden bg-card"
            >
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-bold text-sm">{q}</span>
                <span className="text-red-600 text-xl font-black shrink-0 leading-none">
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
            Stop losing customers
            <br />
            <span className="text-red-400">who are already searching for you.</span>
          </h2>
          <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Your Google Maps listing already has your photos, reviews, and hours. We turn it into a
            proper restaurant website — with your menu, table booking, loyalty programs, and offers
            — in 60 seconds.
          </p>
          <Button
            size="lg"
            className="h-14 px-10 bg-red-600 hover:bg-red-700 text-white font-black text-base shadow-lg shadow-red-600/25"
            onClick={() => window.dispatchEvent(new Event("focus-restaurant-input"))}
          >
            Get Your Restaurant Online
            <ArrowRight className="ml-2 w-5 h-5" />
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
      <TheCost />
      <WhatYouGet />
      <LoyaltySpotlight />
      <HowItWorks />
      <RestaurantPricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  )
}
