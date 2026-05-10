"use client"

import { useEffect, useState, Suspense } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin,
  UtensilsCrossed,
  ExternalLink,
  Pencil,
  Trash2,
  Loader2,
  Plus,
  Globe,
  Calendar,
  AlertCircle,
  LayoutDashboard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAdminMode } from "@/components/providers/admin-provider"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Site {
  id: string
  slug: string | null
  url: string
  businessName: string | null
  status: string
  createdAt: string
  businessData: {
    name?: string
    heroImage?: string
    isGym?: boolean
  } | null
}

function MySitesContent() {
  const { data: session, status } = useSession()
  const { isAdminMode } = useAdminMode()
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromFood = searchParams.get("from") === "restaurants"
  const [persistedSource, setPersistedSource] = useState<string | null>(null)

  useEffect(() => {
    if (fromFood) localStorage.setItem("mts_source", "restaurants")
    setPersistedSource(localStorage.getItem("mts_source"))
  }, [fromFood])
  const [sites, setSites] = useState<Site[]>([])
  const [totalActive, setTotalActive] = useState(0)
  const [userPlan, setUserPlan] = useState("base")
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const isLoggedIn = !!session || isAdminMode

  useEffect(() => {
    if (status === "loading") return

    if (!isLoggedIn) {
      router.push("/")
      return
    }

    let pollTimer: ReturnType<typeof setTimeout> | null = null

    const fetchSites = async () => {
      try {
        const res = await fetch("/api/sites")
        if (res.ok) {
          const data = await res.json()
          setSites(data.sites)
          setUserPlan(data.plan)
          const activeCount = data.sites.filter((s: Site) => s.status !== "FAILED").length
          setTotalActive(activeCount)

          // Fire challenge-complete when the specific site being generated reaches COMPLETED
          const challengeStart = localStorage.getItem("challenge_start_time")
          const challengeSiteId = localStorage.getItem("challenge_site_id")
          if (challengeStart && challengeSiteId) {
            const targetSite = data.sites.find(
              (s: Site) => s.id === challengeSiteId && s.status === "COMPLETED"
            )
            if (targetSite) {
              const seconds = Math.floor((Date.now() - Number(challengeStart)) / 1000)
              localStorage.removeItem("challenge_start_time")
              localStorage.removeItem("challenge_site_id")
              window.dispatchEvent(new CustomEvent("challenge-complete", { detail: { seconds } }))
              if (seconds > 60) {
                fetch("/api/promo-email", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ seconds }),
                }).catch(() => {})
              }
            }
          }

          // Keep polling while any site is still building
          const hasPending = data.sites.some(
            (s: Site) => s.status !== "COMPLETED" && s.status !== "FAILED"
          )
          if (hasPending) {
            pollTimer = setTimeout(fetchSites, 8000)
          }
        }
      } catch (error) {
        console.error("Failed to fetch sites:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSites()
    return () => { if (pollTimer) clearTimeout(pollTimer) }
  }, [status, isLoggedIn, isAdminMode, router])

  const limit = (userPlan === "base" || userPlan === "food-base") ? 3 : (userPlan === "pro" || userPlan === "food-pro") ? 10 : 1

  const hasGymSites = sites.some(s => s.businessData?.isGym === true)
  const hasRestaurantSites = sites.some(s => s.businessData && s.businessData.isGym !== true)

  // Branding: food if they only have restaurant sites, or came from food page
  const isFoodBranding = (hasRestaurantSites && !hasGymSites)
    || (!hasGymSites && (fromFood || persistedSource === "restaurants"))

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={isFoodBranding ? "https://food.maptosite.app" : "/"} className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isFoodBranding ? "bg-red-600" : "bg-primary"}`}>
              {isFoodBranding
                ? <UtensilsCrossed className="w-5 h-5 text-white" />
                : <MapPin className="w-5 h-5 text-primary-foreground" />}
            </div>
            <span className="text-lg font-bold text-foreground">
              MapToSite{isFoodBranding && <span className="text-red-600"> Food</span>}
            </span>
          </Link>
          {isFoodBranding ? (
            <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
              <Link href="https://food.maptosite.app">
                <Plus className="w-4 h-4 mr-2" />
                New Restaurant Site
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/">
                <Plus className="w-4 h-4 mr-2" />
                Create New Site
              </Link>
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Sites</h1>
            <p className="text-muted-foreground mt-2">
              Manage all your generated websites in one place.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Plan badge */}
            <div className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${
              userPlan === "pro" || userPlan === "food-pro"
                ? "bg-primary/10 text-primary border-primary/30"
                : userPlan === "base" || userPlan === "food-base"
                ? "bg-muted text-muted-foreground border-border"
                : "bg-muted text-muted-foreground border-border"
            }`}>
              {userPlan === "pro" || userPlan === "food-pro" ? "✦ Pro Plan" : userPlan === "base" || userPlan === "food-base" ? "Base Plan" : "Free"}
            </div>
            <div className="bg-muted/50 px-4 py-2 rounded-lg border border-border flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground leading-none mb-1">Sites Used</span>
                <span className="text-sm font-bold">
                  {totalActive} / {limit} <span className="text-muted-foreground font-medium">active</span>
                </span>
              </div>
              <div className="w-12 h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${isFoodBranding ? "bg-red-600" : "bg-primary"}`}
                  style={{ width: `${Math.min((totalActive / limit) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {sites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 border border-dashed border-border rounded-xl"
          >
            <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No sites yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first website from a Google Maps listing.
            </p>
            {isFoodBranding ? (
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
                <Link href="https://food.maptosite.app">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Restaurant Site
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Site
                </Link>
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {sites.map((site, index) => (
                <motion.div
                  key={site.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card border border-border rounded-xl overflow-hidden group hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  {/* Site Thumbnail */}
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {site.businessData?.heroImage ? (
                      <img
                        src={site.businessData.heroImage}
                        alt={site.businessName || "Site preview"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Globe className="w-12 h-12 text-muted-foreground/50" />
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                      site.status === "COMPLETED" 
                        ? "bg-green-100 text-green-700" 
                        : site.status === "FAILED"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {site.status === "COMPLETED" ? "Live" : site.status === "FAILED" ? "Failed" : "Processing"}
                    </div>
                  </div>

                  {/* Site Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground truncate">
                      {site.businessName || site.businessData?.name || "Untitled Site"}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(site.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 mt-4">
                      {site.status === "COMPLETED" && (
                        <>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              asChild
                            >
                              <Link href={`/site/${site.slug || site.id}`} target="_blank">
                                <ExternalLink className="w-4 h-4 mr-1" />
                                View
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              asChild
                            >
                              <Link href={`/preview/${site.slug || site.id}`}>
                                <Pencil className="w-4 h-4 mr-1" />
                                Edit
                              </Link>
                            </Button>
                          </div>
                          {site.businessData?.isGym && (
                            <Button
                              variant="default"
                              size="sm"
                              className="w-full"
                              asChild
                            >
                              <Link href={`/console/${site.id}`}>
                                <LayoutDashboard className="w-4 h-4 mr-1" />
                                Gym Console
                              </Link>
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  )
}

export default function MySitesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <MySitesContent />
    </Suspense>
  )
}
