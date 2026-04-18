"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Star, Loader2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

interface BusinessSearchResult {
  id: string
  name: string
  address: string
  rating: number
  reviews: number
  url: string
}

interface BusinessSearchModalProps {
  onSelect: (url: string) => void
  isOpen: boolean
  onClose: () => void
}

export function BusinessSearchModal({ onSelect, isOpen, onClose }: BusinessSearchModalProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<BusinessSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Real search logic using our new API
  useEffect(() => {
    if (query.length < 3) {
      setResults([])
      return
    }

    const searchBusinesses = async () => {
      setIsSearching(true)
      try {
        const res = await fetch(`/api/maps/search?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data.results || [])
        }
      } catch (err) {
        console.error("Search failed:", err)
      } finally {
        setIsSearching(false)
      }
    }

    const timer = setTimeout(searchBusinesses, 800) // Debounce search
    return () => clearTimeout(timer)
  }, [query])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card border shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Find your business</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Type your business name (e.g. Mario's Pizzeria)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 text-base border-primary/20 focus-visible:ring-primary"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                <p className="font-medium">Searching Google Maps...</p>
                <p className="text-xs mt-1">This might take a few seconds</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Top results</p>
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => {
                      onSelect(result.url)
                      onClose()
                    }}
                    className="w-full flex items-start gap-4 p-4 rounded-xl border bg-card hover:bg-primary/5 hover:border-primary/50 transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground truncate group-hover:text-primary transition-colors">{result.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{result.address}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-amber-500 fill-current" />
                        <span className="text-xs font-medium">{result.rating}</span>
                        <span className="text-xs text-muted-foreground">({result.reviews} reviews)</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : query.length >= 3 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="font-medium">No businesses found.</p>
                <p className="text-sm">Try typing the business name and city.</p>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
                <Search className="w-8 h-8 mx-auto mb-3 opacity-20" />
                <p className="font-medium text-sm">Start typing to search directly on Google Maps</p>
                <p className="text-xs mt-1 px-8">We'll find your business so you don't have to copy-paste links.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 bg-muted/50 border-t text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Powered by Google Maps Data</p>
        </div>
      </motion.div>
    </div>
  )
}
