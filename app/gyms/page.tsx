import { Metadata } from "next"
import { GymLanding } from "./content"

export const metadata: Metadata = {
  title: "Automated Gym Management System + Website | MapToSite Fitness",
  description:
    "Automated fitness management system for gyms in India. Auto renewal reminders, GST billing, lead tracking & a gym website — all live in 60 seconds from your Google Maps listing.",
  keywords: [
    "automated fitness management system",
    "automated gym management system",
    "gym management software India",
    "gym management system",
    "gym software India",
    "gym member management software",
    "automated renewal reminders gym",
    "gym website builder India",
    "gym lead tracking",
  ].join(", "),
  alternates: {
    canonical: "https://maptosite.app/gyms",
  },
  openGraph: {
    title: "Automated Gym Management System + Website in 60 Seconds",
    description:
      "Automated fitness management system for gyms — renewal reminders, GST billing, lead tracking & gym website. Live in 60 seconds from your Google Maps listing.",
    url: "https://maptosite.app/gyms",
    siteName: "MapToSite Fitness",
    type: "website",
  },
}

export default function GymsPage() {
  return <GymLanding />
}
