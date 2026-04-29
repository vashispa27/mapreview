import { Metadata } from "next"
import { RestaurantLanding } from "./content"

export const metadata: Metadata = {
  title: "Your Restaurant Is Invisible Online. Let's Fix That. | MapToSite Food",
  description:
    "78% of diners research a restaurant online before visiting. If you don't have a website, they choose your competitor. Get your restaurant website, menu, table booking, and loyalty program live in 60 seconds.",
  keywords: [
    "restaurant website builder India",
    "restaurant website from Google Maps",
    "digital menu for restaurant",
    "restaurant table booking website",
    "restaurant loyalty program",
    "restaurant website free India",
  ].join(", "),
  alternates: {
    canonical: "https://food.maptosite.app",
  },
  openGraph: {
    title: "Your Restaurant Is Invisible Online. Let's Fix That.",
    description:
      "Get your restaurant website with menu, gallery, Google reviews, table booking, and loyalty programs — built from your Google Maps listing in 60 seconds.",
    url: "https://food.maptosite.app",
    siteName: "MapToSite Food",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Restaurant Is Invisible Online. Let's Fix That.",
    description:
      "Customers search 'restaurants near me' and go to your competitors who have websites. Get yours in 60 seconds.",
  },
}

export default function RestaurantPage() {
  return <RestaurantLanding />
}
