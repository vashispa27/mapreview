import { Metadata } from "next"
import { GymLanding } from "./content"

export const metadata: Metadata = {
  title: "Turn Your Gym's Google Visitors into Paying Members | MapToSite Fitness",
  description:
    "Most gyms get views on Google but don't convert them. MapToSite builds a professional gym website from your Google Maps listing in 60 seconds — with WhatsApp enquiries, member management, and automated renewal reminders.",
  keywords: [
    "gym website builder India",
    "gym website from Google Maps",
    "gym member management software",
    "gym WhatsApp enquiry system",
    "gym lead tracking",
    "gym software India",
  ].join(", "),
  alternates: {
    canonical: "https://maptosite.app/gyms",
  },
  openGraph: {
    title: "Turn Your Gym's Google Visitors into Paying Members",
    description:
      "MapToSite builds a professional gym website from your Google Maps listing in 60 seconds — with WhatsApp enquiries, member management, and automated renewal reminders.",
    url: "https://maptosite.app/gyms",
    siteName: "MapToSite Fitness",
    type: "website",
  },
}

export default function GymsPage() {
  return <GymLanding />
}
