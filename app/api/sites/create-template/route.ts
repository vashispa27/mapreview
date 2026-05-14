import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

const GYM_TEMPLATE_SERVICES = [
  {
    id: "gym-monthly",
    title: "Monthly Membership",
    price: "₹1,499 / month",
    description: "Full access to gym floor, all equipment, and cardio zone.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  },
  {
    id: "gym-quarterly",
    title: "Quarterly Plan",
    price: "₹3,999 / 3 months",
    description: "Save more with our 3-month plan. Includes full gym access plus group classes.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
  },
  {
    id: "gym-halfyearly",
    title: "Half-Yearly Plan",
    price: "₹6,999 / 6 months",
    description: "Our most popular plan. Full access, all group classes, and 2 personal training sessions.",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
  },
]

const GYM_TEMPLATE_TRAINERS = [
  {
    id: "trainer-1",
    name: "Trainer Name",
    specialization: "Strength & Conditioning",
    experience: "5+ years experience",
    bio: "Certified personal trainer specializing in strength training and weight management. Tap to update details.",
    photo: undefined,
  },
  {
    id: "trainer-2",
    name: "Trainer Name",
    specialization: "Yoga & Flexibility",
    experience: "3+ years experience",
    bio: "Experienced yoga instructor focused on flexibility, posture, and mental wellness. Tap to update details.",
    photo: undefined,
  },
]

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { gymName } = await request.json()
    if (!gymName || typeof gymName !== "string") {
      return NextResponse.json({ error: "gymName is required" }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    })

    const allSites = await db.site.findMany({
      where: { userId: session.user.id },
      select: { status: true },
    })

    const inProgress = allSites.some(s =>
      ["QUEUED", "SCRAPING_APIFY", "ANALYZING_GEMINI"].includes(s.status)
    )
    if (inProgress) {
      return NextResponse.json(
        { error: "You already have a site being generated. Please wait for it to finish." },
        { status: 403 }
      )
    }

    const activeSiteCount = allSites.filter(s => s.status !== "FAILED").length
    const limit = user?.plan === "pro" ? 10 : user?.plan === "base" ? 3 : 1
    if (activeSiteCount >= limit) {
      const message =
        user?.plan === "base" || !user?.plan
          ? "Usage limit reached. You can only have 1 active website on the free plan."
          : `Usage limit reached. Your ${user.plan} plan allows up to ${limit} active websites.`
      return NextResponse.json({ error: message }, { status: 403 })
    }

    const siteId = Math.random().toString(36).substring(2, 12)
    const name = gymName.trim()

    const businessData = {
      id: siteId,
      name,
      category: "Gym",
      rating: 5.0,
      totalReviews: 0,
      address: "",
      phone: "",
      website: "",
      socials: { instagram: "", facebook: "", twitter: "" },
      pages: { services: true, products: false, contact: true, trainers: true },
      services: GYM_TEMPLATE_SERVICES,
      products: [],
      isGym: true,
      trainers: GYM_TEMPLATE_TRAINERS,
      showTrainersSection: true,
      heroImage: "",
      hours: [],
      photos: [],
      availablePhotos: [],
      reviews: [],
      description: `Welcome to ${name}. Your fitness journey starts here.`,
      features: ["Modern Equipment", "Expert Trainers", "Flexible Timings", "Comfortable Atmosphere"],
      priceLevel: "$$",
    }

    await db.site.create({
      data: {
        id: siteId,
        userId: session.user.id,
        url: `manual://${encodeURIComponent(name)}`,
        businessName: name,
        status: "COMPLETED",
        businessData: businessData as any,
        config: {
          colorSchemeId: "default",
          layout: "modern",
          fontStyle: "sans",
          animations: true,
        } as any,
      },
    })

    return NextResponse.json({ success: true, siteId })
  } catch (error) {
    console.error("create-template error:", error)
    return NextResponse.json({ error: "Failed to create site." }, { status: 500 })
  }
}
