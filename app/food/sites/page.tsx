"use client"

import { useEffect, useState, Suspense } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  UtensilsCrossed,
  MapPin,
  ExternalLink,
  Pencil,
  Trash2,
  Loader2,
  Plus,
  Globe,
  Calendar,
  LayoutDashboard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
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

function FoodSitesContent() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [sites, setSites] = useState<Site[]>([])
  const [totalActive, setTotalActive] = useState(0)
  const [userPlan, setUserPlan] = useState("base")
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    if (!session) { router.push("/food"); return }

    let pollTimer: ReturnType<typeof setTimeout> | null = null

    const fetchSites = async () => {
      try {
        const res = await fetch("/api/sites")
        if (res.ok) {
          const data = await res.json()
          // Only show non-gym (restaurant) sites
          const restaurantSites = data.sites.filter(
            (s: Site) => s.businessData?.isGym !== true
          )
          setSites(restaurantSites)
          setUserPlan(data.plan)
          setTotalActive(restaurantSites.filter((s: Site) => s.status !== "FAILED").length)

          const hasPending = restaurantSites.some(
            (s: Site) => s.status !== "COMPLETED" && s.status !== "FAILED"
          )
          if (hasPending) pollTimer = setTimeout(fetchSites, 8000)
        }
      } catch (error) {
        console.error("Failed to fetch sites:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSites()
    return () => { if (pollTimer) clearTimeout(pollTimer) }
  }, [status, session, router])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await fetch(`/api/sites/${deleteId}`, { method: "DELETE" })
      setSites(prev => prev.filter(s => s.id !== deleteId))
      setTotalActive(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Failed to delete site:", error)
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const limit = userPlan === "food-pro" ? 10 : userPlan === "food-base" ? 3 : 1

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    )
  }

  return (
    <>
      <AlertDialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this restaurant site?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the site and all its data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/food" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-foreground hidden sm:block">
                  MapToSite <span className="text-red-600">Food</span>
                </span>
              </Link>
              {/* Switcher */}
              <div className="flex items-center bg-muted rounded-lg p-1 text-xs font-semibold">
                <Link href="/gym/sites" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors">
                  <MapPin className="w-3.5 h-3.5" /> Gym Sites
                </Link>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-background shadow-sm text-foreground">
                  <UtensilsCrossed className="w-3.5 h-3.5" /> Food Sites
                </span>
              </div>
            </div>
            <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
              <Link href="/food">
                <Plus className="w-4 h-4 mr-2" />
                New Restaurant Site
              </Link>
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Restaurants</h1>
              <p className="text-muted-foreground mt-2">
                Manage all your restaurant websites in one place.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${
                userPlan === "food-pro"
                  ? "bg-red-50 text-red-600 border-red-200"
                  : "bg-muted text-muted-foreground border-border"
              }`}>
                {userPlan === "food-pro" ? "✦ Pro Plan" : userPlan === "food-base" ? "Base Plan" : "Free"}
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
                    className="h-full bg-red-600 transition-all duration-500"
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
              <h2 className="text-xl font-semibold text-foreground mb-2">No restaurant sites yet</h2>
              <p className="text-muted-foreground mb-6">
                Create your first restaurant website from a Google Maps listing.
              </p>
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
                <Link href="/food">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Restaurant Site
                </Link>
              </Button>
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
                    className="bg-card border border-border rounded-xl overflow-hidden group hover:border-red-300 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Thumbnail */}
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

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground truncate">
                        {site.businessName || site.businessData?.name || "Untitled Site"}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(site.createdAt).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 mt-4">
                        {site.status === "COMPLETED" && (
                          <>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" className="flex-1 hover:border-red-300" asChild>
                                <Link href={`/site/${site.slug || site.id}`} target="_blank">
                                  <ExternalLink className="w-4 h-4 mr-1" />
                                  View
                                </Link>
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1 hover:border-red-300" asChild>
                                <Link href={`/preview/${site.slug || site.id}`}>
                                  <Pencil className="w-4 h-4 mr-1" />
                                  Edit
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-red-600 hover:bg-red-50 px-2"
                                onClick={() => setDeleteId(site.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <Button
                              size="sm"
                              className="w-full bg-red-600 hover:bg-red-700 text-white"
                              asChild
                            >
                              <Link href={`/food/console/${site.id}`}>
                                <LayoutDashboard className="w-4 h-4 mr-1" />
                                Restaurant Console
                              </Link>
                            </Button>
                          </>
                        )}
                        {(site.status !== "COMPLETED" && site.status !== "FAILED") && (
                          <div className="flex items-center gap-2 text-amber-600 text-xs font-medium">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Building your site…
                          </div>
                        )}
                        {site.status === "FAILED" && (
                          <p className="text-xs text-red-600 font-medium">Generation failed. Please try again.</p>
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
    </>
  )
}

export default function FoodSitesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    }>
      <FoodSitesContent />
    </Suspense>
  )
}
