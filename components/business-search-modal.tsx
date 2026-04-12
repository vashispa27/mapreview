"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Star, Loader2, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface BusinessSearchResult {
  id: string
  name: string
  address: string
  rating: number
  reviews: number
  url: string
}

// MOCK DATA for Offline Mode
const MOCK_RESULTS: BusinessSearchResult[] = [
  {
    id: "1",
    name: "Mario's Authentic Pizzeria",
    address: "123 Pizza Lane, Brooklyn, NY 11201",
    rating: 4.8,
    reviews: 1240,
    url: "https://www.google.com/maps/place/marios-pizza"
  },
  {
    id: "2",
    name: "The Golden Bean Coffee",
    address: "456 Espresso St, Seattle, WA 98101",
    rating: 4.6,
    reviews: 890,
    url: "https://www.google.com/maps/place/golden-bean"
  },
  {
    id: "3",
    name: "Urban Fitness Gym",
    address: "789 Muscle Ave, Austin, TX 78701",
    rating: 4.9,
    reviews: 2100,
    url: "https://www.google.com/maps/place/urban-fitness"
  }
]

interface BusinessSearchModalProps {
  onSelect: (url: string) => void
  isOpen: boolean
  onClose: () => void
}

export function BusinessSearchModal({ onSelect, isOpen, onClose }: BusinessSearchModalProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<BusinessSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Simulate search logic
  useEffect(() => {
    if (query.length < 3) {
      setResults([])
      return
    }

    setIsSearching(true)
    const timer = setTimeout(() => {
      const filtered = MOCK_RESULTS.filter(r => 
        r.name.toLowerCase().includes(query.toLowerCase()) || 
        r.address.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
      setIsSearching(false)
    }, 500)

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
              className="pl-10 h-12 text-base"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            {isSearching ? (
              <div className="flex items-center justify-center py-10 text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Searching Google Maps...
              </div>
            ) : results.length > 0 ? (
              results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => {
                    onSelect(result.url)
                    onClose()
                  }}
                  className="w-full flex items-start gap-4 p-4 rounded-xl border bg-card hover:bg-muted/50 hover:border-primary/50 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground truncate">{result.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{result.address}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-amber-500 fill-current" />
                      <span className="text-xs font-medium">{result.rating}</span>
                      <span className="text-xs text-muted-foreground">({result.reviews} reviews)</span>
                    </div>
                  </div>
                </button>
              ))
            ) : query.length >= 3 ? (
              <p className="text-center py-10 text-muted-foreground">No businesses found. Try a different name.</p>
            ) : (
              <div className="text-center py-10 text-muted-foreground space-y-2">
                <p>Start typing to search on Google Maps</p>
                <p className="text-xs italic">(Currently in Mock Mode - Try typing "Mario" or "Bean")</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
