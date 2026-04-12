import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")

    if (!slug || slug.length < 3) {
      return NextResponse.json({ available: false, error: "Too short" })
    }

    // Regex to ensure slug is URL friendly
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(slug)) {
      return NextResponse.json({ available: false, error: "Invalid characters" })
    }

    const existing = await db.site.findUnique({
      where: { slug }
    })

    return NextResponse.json({ available: !existing })
  } catch (error) {
    console.error("Check slug error:", error)
    return NextResponse.json({ available: false, error: "Internal server error" }, { status: 500 })
  }
}
