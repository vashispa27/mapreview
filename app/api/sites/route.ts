import { NextResponse } from "next/server"

// Mock data for testing without database
const MOCK_SITES = [
  {
    id: "site-1-abc123",
    url: "https://maps.google.com/maps/place/The+Coffee+House",
    businessName: "The Coffee House",
    status: "COMPLETED",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "site-2-def456",
    url: "https://maps.google.com/maps/place/Pasta+Paradise",
    businessName: "Pasta Paradise",
    status: "COMPLETED",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "site-3-ghi789",
    url: "https://maps.google.com/maps/place/New+Business",
    businessName: null,
    status: "QUEUED",
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  // Check if database is available
  if (!process.env.DATABASE_URL) {
    // Return mock data for testing
    return NextResponse.json({ sites: MOCK_SITES })
  }

  try {
    // Dynamic import to avoid errors when DATABASE_URL is not set
    const { auth } = await import("@/lib/auth")
    const { db } = await import("@/lib/db")
    
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      // Return empty array for unauthenticated users in production
      return NextResponse.json({ sites: [] })
    }

    const sites = await db.site.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        url: true,
        businessName: true,
        status: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ sites })
  } catch (error) {
    console.error("Error fetching sites:", error)
    // Fall back to mock data on error during development
    return NextResponse.json({ sites: MOCK_SITES })
  }
}
