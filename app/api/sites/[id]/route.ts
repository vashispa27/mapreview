import { NextRequest, NextResponse } from "next/server"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  // Check if database is available
  if (!process.env.DATABASE_URL) {
    // Mock success for testing
    return NextResponse.json({ success: true, message: `Site ${id} deleted (mock)` })
  }

  try {
    const { auth } = await import("@/lib/auth")
    const { db } = await import("@/lib/db")
    
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Check if the site exists and belongs to the user
    const site = await db.site.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 })
    }

    if (site.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Delete the site
    await db.site.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting site:", error)
    return NextResponse.json({ error: "Failed to delete site" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  // Check if database is available
  if (!process.env.DATABASE_URL) {
    // Return mock data for testing
    return NextResponse.json({
      site: {
        id,
        url: "https://maps.google.com/maps/place/Mock+Business",
        businessName: "Mock Business",
        status: "COMPLETED",
        createdAt: new Date().toISOString(),
      }
    })
  }

  try {
    const { auth } = await import("@/lib/auth")
    const { db } = await import("@/lib/db")
    
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const site = await db.site.findUnique({
      where: { id },
      select: {
        id: true,
        url: true,
        businessName: true,
        status: true,
        createdAt: true,
        businessData: true,
        config: true,
        userId: true,
      },
    })

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 })
    }

    if (site.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json({ site })
  } catch (error) {
    console.error("Error fetching site:", error)
    return NextResponse.json({ error: "Failed to fetch site" }, { status: 500 })
  }
}
