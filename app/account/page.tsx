"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, ExternalLink, Pencil, Trash2, Plus, Globe, Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { format } from "date-fns"

interface Site {
  id: string
  url: string
  businessName: string | null
  status: "QUEUED" | "COMPLETED" | "FAILED"
  createdAt: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AccountPage() {
  const router = useRouter()
  const { data, error, isLoading, mutate } = useSWR<{ sites: Site[] }>("/api/sites", fetcher)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (siteId: string) => {
    setDeletingId(siteId)
    try {
      const res = await fetch(`/api/sites/${siteId}`, {
        method: "DELETE",
      })
      if (res.ok) {
        mutate()
      }
    } catch (err) {
      console.error("Failed to delete site:", err)
    } finally {
      setDeletingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Live</Badge>
      case "QUEUED":
        return <Badge variant="secondary">Building...</Badge>
      case "FAILED":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const sites = data?.sites || []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">MapToSite</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Sites</h1>
          <p className="text-muted-foreground">
            Manage all the websites you&apos;ve created from Google Maps listings.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-foreground">{sites.length}</div>
              <p className="text-sm text-muted-foreground">Total Sites</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">
                {sites.filter((s) => s.status === "COMPLETED").length}
              </div>
              <p className="text-sm text-muted-foreground">Live</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-muted-foreground">
                {3 - sites.length}
              </div>
              <p className="text-sm text-muted-foreground">Remaining</p>
            </CardContent>
          </Card>
        </div>

        {/* Sites List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Failed to load your sites.</p>
              <Button onClick={() => mutate()}>Try Again</Button>
            </CardContent>
          </Card>
        ) : sites.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No sites yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first website by pasting a Google Maps link on the homepage.
              </p>
              <Button asChild>
                <Link href="/">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Site
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {sites.map((site, index) => (
                <motion.div
                  key={site.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg text-foreground truncate">
                              {site.businessName || "Untitled Site"}
                            </h3>
                            {getStatusBadge(site.status)}
                          </div>
                          <p className="text-sm text-muted-foreground truncate mb-3">
                            {site.url}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(site.createdAt), "MMM d, yyyy")}
                            </span>
                            {site.status === "COMPLETED" && (
                              <a
                                href={`/site/${site.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary hover:underline"
                              >
                                <ExternalLink className="w-4 h-4" />
                                View Live Site
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {site.status === "COMPLETED" && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <Link href={`/preview/${site.id}`}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit
                              </Link>
                            </Button>
                          )}

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                disabled={deletingId === site.id}
                              >
                                {deletingId === site.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete this site?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete &quot;{site.businessName || "this site"}&quot; and remove it from the web. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(site.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete Site
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Create More CTA */}
        {sites.length > 0 && sites.length < 3 && (
          <div className="mt-8 text-center">
            <Button asChild size="lg">
              <Link href="/">
                <Plus className="w-4 h-4 mr-2" />
                Create Another Site ({3 - sites.length} remaining)
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
