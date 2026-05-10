import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free Gym Website Templates — Build Yours in 60 Seconds | MapToSite",
  description: "Browse gym website templates and build your own in 60 seconds. Auto-filled from your Google Maps listing — photos, reviews, hours, and memberships included. No design skills needed.",
  keywords: [
    "gym website templates",
    "gym website builder India",
    "fitness website template",
    "gym website design",
    "free gym website",
    "gym landing page template",
    "gym website builder free",
    "fitness center website template",
  ].join(", "),
  alternates: {
    canonical: "https://maptosite.app/gyms/template",
  },
  openGraph: {
    title: "Free Gym Website Templates | MapToSite",
    description: "Pick a template and get your gym website live in 60 seconds. Auto-built from your Google Maps listing.",
    url: "https://maptosite.app/gyms/template",
    type: "website",
    siteName: "MapToSite",
  },
}

export default function GymTemplateLayout({ children }: { children: React.ReactNode }) {
  return children
}
