"use client"

import { motion } from "framer-motion"
import { Star, MapPin, Clock, Phone, ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"

const showcaseWebsites = [
  {
    name: "Mario's Pizzeria",
    rating: 4.8,
    reviews: 342,
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&h=250&fit=crop",
    category: "Restaurant",
    location: "Brooklyn, NY",
    color: "from-red-500 to-orange-400",
  },
  {
    name: "Zen Wellness Spa",
    rating: 4.9,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=250&fit=crop",
    category: "Spa & Wellness",
    location: "San Francisco, CA",
    color: "from-teal-500 to-emerald-400",
  },
  {
    name: "Urban Fitness Gym",
    rating: 4.7,
    reviews: 521,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=250&fit=crop",
    category: "Fitness",
    location: "Austin, TX",
    color: "from-blue-500 to-indigo-400",
  },
  {
    name: "Bloom Flower Shop",
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&h=250&fit=crop",
    category: "Retail",
    location: "Portland, OR",
    color: "from-pink-500 to-rose-400",
  },
  {
    name: "Golden Bean Cafe",
    rating: 4.6,
    reviews: 278,
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=250&fit=crop",
    category: "Coffee Shop",
    location: "Seattle, WA",
    color: "from-amber-500 to-yellow-400",
  },
  {
    name: "Tech Repair Pro",
    rating: 4.8,
    reviews: 423,
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=250&fit=crop",
    category: "Services",
    location: "Denver, CO",
    color: "from-violet-500 to-purple-400",
  },
]

export function ShowcaseCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {showcaseWebsites.map((site, index) => (
        <motion.div
          key={site.name}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="group cursor-pointer"
        >
          <Card className="overflow-hidden bg-card border-border/50 shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="relative h-40 overflow-hidden">
              <motion.img
                src={site.image}
                alt={site.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${site.color} opacity-20`} />
              <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-card-foreground">
                {site.category}
              </div>
              <motion.div 
                className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
              >
                <ExternalLink className="w-8 h-8 text-primary-foreground" />
              </motion.div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg text-card-foreground mb-1">{site.name}</h3>
              <div className="flex items-center gap-1 text-amber-500 mb-2">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-medium text-card-foreground">{site.rating}</span>
                <span className="text-muted-foreground text-sm">({site.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <MapPin className="w-3 h-3" />
                <span>{site.location}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export function ShowcaseMarquee() {
  const duplicatedSites = [...showcaseWebsites, ...showcaseWebsites]

  return (
    <div className="overflow-hidden py-8">
      <motion.div
        className="flex gap-6"
        animate={{ x: [0, -1200] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {duplicatedSites.map((site, index) => (
          <motion.div
            key={`${site.name}-${index}`}
            className="flex-shrink-0 w-72"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Card className="overflow-hidden bg-card border-border/50 shadow-md">
              <div className="relative h-32 overflow-hidden">
                <img
                  src={site.image}
                  alt={site.name}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${site.color} opacity-20`} />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-card-foreground">{site.name}</h3>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-sm text-card-foreground">{site.rating}</span>
                  <span className="text-xs text-muted-foreground">({site.reviews})</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

// Mini website preview cards for the demo section
export function WebsitePreviewCard({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`bg-card rounded-xl shadow-2xl overflow-hidden border border-border ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Browser chrome */}
      <div className="bg-muted px-4 py-2 flex items-center gap-2 border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-background rounded-md px-3 py-1 text-xs text-muted-foreground mx-4">
          mariospizzeria.maptosite.com
        </div>
      </div>
      
      {/* Website content */}
      <div className="p-4">
        <div className="relative h-32 rounded-lg overflow-hidden mb-4">
          <img
            src="https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&h=200&fit=crop"
            alt="Pizza restaurant"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-3 left-3 text-white">
            <h4 className="font-bold">{"Mario's Pizzeria"}</h4>
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>4.8</span>
              <span className="opacity-75">(342 reviews)</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span>123 Pizza Lane, Brooklyn, NY</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>Open until 11 PM</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="w-4 h-4 text-primary" />
            <span>(555) 123-4567</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
