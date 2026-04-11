import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const { db } = await import("@/lib/db")
    
    // Verify the site belongs to the user
    const site = await db.site.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 })
    }

    // Delete the site
    await db.site.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete site:", error)
    return NextResponse.json({ error: "Failed to delete site" }, { status: 500 })
  }
}
