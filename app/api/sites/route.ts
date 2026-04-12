import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const sites = await db.site.findMany({
      where: {
        userId: session.user.id,
        deleted: false // Only return non-deleted sites to the UI
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        slug: true,
        url: true,
        businessName: true,
        status: true,
        createdAt: true,
        businessData: true,
      },
    })

    // Also get the total count (including deleted) for the usage limit
    const totalGenerated = await db.site.count({
      where: { userId: session.user.id }
    })

    return NextResponse.json({ sites, totalGenerated })
  } catch (error) {
    console.error("Failed to fetch sites:", error)
    return NextResponse.json({ error: "Failed to fetch sites" }, { status: 500 })
  }
}
