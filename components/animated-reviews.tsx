"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnimatedReviewsProps {
  reviews: any[]
  colorScheme: any
  layoutStyles: any
  isDark: boolean
  layout: string
}

export function AnimatedReviews({
  reviews,
  colorScheme,
  layoutStyles,
  isDark,
  layout
}: AnimatedReviewsProps) {
  // Always restrict to maximum 6 active cards, or fewer if the scrape was small
  const MAX_CARDS = Math.min(6, reviews.length)
  
  // State holds the actual array indexes from the original `reviews` prop
  const [activeIndices, setActiveIndices] = useState<number[]>([])

  // Initialize with the first N reviews
  useEffect(() => {
    setActiveIndices(Array.from({ length: MAX_CARDS }, (_, i) => i))
  }, [MAX_CARDS])

  // Interval logic to randomly swap one out
  useEffect(() => {
    if (reviews.length <= MAX_CARDS) return // No need to cycle if we have exactly 6 or less

    const interval = setInterval(() => {
      setActiveIndices((current) => {
        const next = [...current]
        
        // Pick a random slot (0 to MAX_CARDS-1) to replace
        const slotToReplace = Math.floor(Math.random() * MAX_CARDS)
        
        // Find pool of indices that are NOT currently displayed
        const availableIndices = Array.from({ length: reviews.length }, (_, i) => i)
          .filter(idx => !current.includes(idx))
          
        if (availableIndices.length === 0) return current

        // Pick a random index from the available pool
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
        
        // Swap it in
        next[slotToReplace] = randomIndex
        return next
      })
    }, 5000) // Swap once every 5 seconds for a calmer feel

    return () => clearInterval(interval)
  }, [reviews.length, MAX_CARDS])

  if (activeIndices.length === 0) return null;

  return (
    <div
      className={cn(
        "grid gap-6",
        layout === "minimal" ? "grid-cols-1" : "md:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {activeIndices.map((reviewIndex, slotPosition) => {
        const review = reviews[reviewIndex]
        if (!review) return null

        return (
          <div key={`slot-${slotPosition}`} className="relative h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={reviewIndex} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className={cn(
                  "p-6 h-full",
                  layoutStyles.cardStyle
                )}
                style={{
                  backgroundColor: isDark ? "#1e293b" : "#fff",
                  boxShadow: isDark ? "none" : "0 4px 6px -1px rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex flex-col h-full">
                  <h3 className="font-bold text-lg md:text-xl mb-4 leading-tight">
                    {review.jtbdHeader || `"A great experience waiting for you"`}
                  </h3>
                  <p
                    className={cn("line-clamp-4 flex-1 mb-6", layout === "minimal" ? "text-sm" : "")}
                    style={{ color: colorScheme.muted }}
                  >
                    "{review.text}"
                  </p>
                  
                  <div className="mt-auto pt-4 border-t flex items-center justify-between" style={{ borderColor: isDark ? "#334155" : "#e5e7eb" }}>
                    <div>
                      <h4 className="font-semibold leading-none mb-1.5">{review.author}</h4>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5"
                            fill={i < review.rating ? "#fbbf24" : "transparent"}
                            stroke={i < review.rating ? "#fbbf24" : "#d1d5db"}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs font-medium" style={{ color: colorScheme.muted }}>
                      {review.date}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
