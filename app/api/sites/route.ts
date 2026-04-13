import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true }
    })

    const sites = await db.site.findMany({
      where: {
        userId: session.user.id,
        deleted: false
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

    return NextResponse.json({ 
      sites, 
      plan: user?.plan || "base"
    })
  } catch (error) {
    console.error("Failed to fetch sites:", error)
    return NextResponse.json({ error: "Failed to fetch sites" }, { status: 500 })
  }
}
