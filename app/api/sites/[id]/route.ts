import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

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
    // Soft delete: keep the record for usage tracking but hide it from the user
    const site = await db.site.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        deleted: true
      }
    })

    // Purge the public cache if it was published
    if (site.slug) {
      revalidatePath(`/site/${site.slug}`)
    }
    revalidatePath(`/site/${id}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete site:", error)
    return NextResponse.json({ error: "Failed to delete site" }, { status: 500 })
  }
}
