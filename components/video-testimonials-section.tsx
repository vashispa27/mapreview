"use client"

import { useState } from "react"
import { VideoTestimonial, ColorScheme } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Play, X, Quote, ChevronLeft, ChevronRight } from "lucide-react"

interface VideoTestimonialsSectionProps {
  videos: VideoTestimonial[]
  colorScheme: ColorScheme
  layout: string
  animations: boolean
  isDark: boolean
  layoutStyles: {
    sectionGap: string
    headingSize: string
    cardStyle: string
  }
}

export function VideoTestimonialsSection({
  videos,
  colorScheme,
  layout,
  animations,
  isDark,
  layoutStyles,
}: VideoTestimonialsSectionProps) {
  const [activeVideo, setActiveVideo] = useState<VideoTestimonial | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!videos || videos.length === 0) return null

  const visibleVideos = videos.slice(currentIndex, currentIndex + 3)
  const canGoNext = currentIndex + 3 < videos.length
  const canGoPrev = currentIndex > 0

  return (
    <>
      <section className={layoutStyles.sectionGap}>
        {layout === "elegant" && (
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: colorScheme.muted }}>
              Testimonials
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
        )}

        <div className={cn(
          "flex items-center justify-between mb-8",
          layout === "elegant" && "justify-center flex-col gap-4",
          layout === "bold" && "justify-center flex-col gap-2"
        )}>
          <h2
            className={cn(
              "font-bold",
              layoutStyles.headingSize,
              layout === "elegant" && "font-serif text-center",
              layout === "bold" && "uppercase tracking-tight text-center",
              layout === "studio" && "font-light"
            )}
          >
            {layout === "bold" ? "VIDEO STORIES" : "Customer Stories"}
          </h2>
          
          {videos.length > 3 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={!canGoPrev}
                className={cn(
                  "p-2 rounded-full transition-all",
                  canGoPrev 
                    ? "bg-muted hover:bg-muted/80" 
                    : "opacity-30 cursor-not-allowed"
                )}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                disabled={!canGoNext}
                className={cn(
                  "p-2 rounded-full transition-all",
                  canGoNext 
                    ? "bg-muted hover:bg-muted/80" 
                    : "opacity-30 cursor-not-allowed"
                )}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div className={cn(
          "grid gap-6",
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        )}>
          {visibleVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={animations ? { opacity: 0, y: 20 } : undefined}
              whileInView={animations ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "group relative overflow-hidden cursor-pointer",
                layoutStyles.cardStyle,
                layout === "elegant" && "border",
                layout === "bold" && "shadow-lg hover:shadow-xl",
                animations && "transition-all duration-300 hover:scale-[1.02]"
              )}
              style={{
                backgroundColor: isDark ? "#1e293b" : "#fff",
              }}
              onClick={() => setActiveVideo(video)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={video.thumbnailUrl}
                  alt={video.name}
                  className={cn(
                    "w-full h-full object-cover",
                    animations && "transition-transform duration-500 group-hover:scale-110"
                  )}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                  <motion.div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colorScheme.primary }}
                    whileHover={animations ? { scale: 1.1 } : undefined}
                    whileTap={animations ? { scale: 0.95 } : undefined}
                  >
                    <Play className="w-7 h-7 text-white ml-1" fill="white" />
                  </motion.div>
                </div>
                <span className="absolute bottom-3 right-3 text-xs bg-black/70 text-white px-2 py-1 rounded-md font-medium">
                  {video.duration}
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: colorScheme.primary + "20" }}
                  >
                    <Quote className="w-4 h-4" style={{ color: colorScheme.primary }} />
                  </div>
                  <div>
                    <h3 className={cn(
                      "font-semibold",
                      layout === "elegant" && "font-serif"
                    )}>
                      {video.name}
                    </h3>
                    {video.title && (
                      <p className="text-sm" style={{ color: colorScheme.muted }}>
                        {video.title}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <iframe
                src={`${activeVideo.videoUrl}?autoplay=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
            <div className="absolute bottom-8 text-center text-white">
              <p className="font-semibold text-lg">{activeVideo.name}</p>
              {activeVideo.title && (
                <p className="text-white/70">{activeVideo.title}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
