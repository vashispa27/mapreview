import { NextRequest, NextResponse } from "next/server"
import { generateMockBusinessData } from "@/lib/mock-data"
import { createPreview } from "@/lib/preview-store"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Validate it looks like a Google Maps URL
    if (!url.includes("google.com/maps") && !url.includes("goo.gl") && !url.includes("maps.app")) {
      return NextResponse.json({ error: "Please provide a valid Google Maps URL" }, { status: 400 })
    }

    // Generate mock business data (in production, this would parse the actual Google Maps page)
    const businessData = generateMockBusinessData(url)

    // Create a preview session
    const previewId = createPreview(businessData)

    return NextResponse.json({
      success: true,
      previewId,
      business: businessData,
    })
  } catch (error) {
    console.error("Error generating site:", error)
    return NextResponse.json({ error: "Failed to generate site" }, { status: 500 })
  }
}
