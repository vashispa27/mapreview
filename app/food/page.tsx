import { Metadata } from "next"
import { RestaurantLanding } from "./content"

export const metadata: Metadata = {
  title: "Restaurant Websites in 60 Seconds | MapToSite Food",
  description:
    "Turn your Google Maps listing into a professional restaurant website. Show your menu, get direct WhatsApp orders, and stop paying 25–30% commission to Zomato. Live in 60 seconds.",
  keywords: [
    "restaurant website builder India",
    "restaurant website from Google Maps",
    "Zomato alternative direct orders",
    "digital menu for restaurant",
    "restaurant website free",
    "online menu restaurant India",
  ].join(", "),
  alternates: {
    canonical: "https://food.maptosite.app",
  },
  openGraph: {
    title: "Restaurant Websites in 60 Seconds | MapToSite Food",
    description:
      "Turn your Google Maps listing into a professional restaurant website with your menu, reviews, and a direct WhatsApp order button. No designer, no code.",
    url: "https://food.maptosite.app",
    siteName: "MapToSite Food",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Restaurant Websites in 60 Seconds | MapToSite Food",
    description:
      "Stop paying 25% to Zomato. Get a free restaurant website built from your Google Maps listing in 60 seconds.",
  },
}

export default function RestaurantPage() {
  return <RestaurantLanding />
}
