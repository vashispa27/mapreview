import { NextRequest, NextResponse } from "next/server"
import { getPreview, updatePreviewConfig } from "@/lib/preview-store"
import { colorSchemes, ColorScheme, generateMockBusinessData } from "@/lib/mock-data"
import { getJob } from "@/lib/job-store"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Handle admin-demo case - return mock data without auth or db access
  if (id === "admin-demo") {
    const mockBusiness = generateMockBusinessData("admin-demo")
    return NextResponse.json({
      status: "COMPLETED",
      business: mockBusiness,
      config: {
        colorScheme: colorSchemes[0],
        layout: "modern",
        fontStyle: "sans",
        animations: true
      },
    })
  }
  
  // Only import db when needed (for non-admin-demo requests)
  const { db } = await import("@/lib/db")
  
  // 1. Get the current user session
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  // 2. Fetch from DB and verify ownership
  const dbSite = await db.site.findUnique({
    where: { id }
  })

  if (!dbSite) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 })
  }

  // SECURITY CHECK: Only the owner can view the preview
  if (dbSite.userId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized access to this preview" }, { status: 403 })
  }

  if (dbSite.status === "COMPLETED" && dbSite.businessData) {
    return NextResponse.json({
      status: "COMPLETED",
      business: dbSite.businessData,
      config: dbSite.config || {
        colorSchemeId: "default",
        layout: "modern",
        fontStyle: "sans",
        animations: true
      },
    })
  }

  // 3. Fallback to in-memory job status (also verify ownership)
  const job = getJob(id)
  if (job) {
    return NextResponse.json({
      status: job.status,
      errorMessage: job.errorMessage
    })
  }

  return NextResponse.json({ error: "Preview not initialized on background queue engine limits natively" }, { status: 404 })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()

  // Handle admin-demo case - just return success without persisting
  if (id === "admin-demo") {
    const mockBusiness = generateMockBusinessData("admin-demo")
    // Merge body changes with mock data for response
    return NextResponse.json({
      business: { ...mockBusiness, ...body },
      config: {
        colorScheme: body.colorSchemeId ? colorSchemes.find(c => c.id === body.colorSchemeId) || colorSchemes[0] : colorSchemes[0],
        layout: body.layout || "modern",
        fontStyle: body.fontStyle || "sans",
        animations: body.animations ?? true
      },
    })
  }

  // Only import db when needed (for non-admin-demo requests)
  const { db } = await import("@/lib/db")
  
  // 1. Get the current user session
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  // 2. Fetch current data from DB and verify ownership
  const site = await db.site.findUnique({
    where: { id }
  })

  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 })
  }

  // SECURITY CHECK: Only the owner can edit the site
  if (site.userId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized: You do not own this site" }, { status: 403 })
  }

  const currentBusiness = (site.businessData as any) || {}
  const currentConfig = (site.config as any) || {}

  // 2. Update Business and Config based on body
  if (body.colorSchemeId) currentConfig.colorSchemeId = body.colorSchemeId
  if (body.layout) currentConfig.layout = body.layout
  if (body.fontStyle) currentConfig.fontStyle = body.fontStyle
  if (typeof body.animations === "boolean") currentConfig.animations = body.animations

  if (body.photos) currentBusiness.photos = body.photos
  if (body.heroImage) currentBusiness.heroImage = body.heroImage
  if (body.description) currentBusiness.description = body.description
  if (body.features) currentBusiness.features = body.features

  // 3. Save to Prisma
  const updated = await db.site.update({
    where: { id },
    data: {
      businessData: currentBusiness,
      config: currentConfig
    }
  })

  // Purge the ISR cache so the public site updates immediately after an edit!
  revalidatePath(`/site/${id}`)

  return NextResponse.json({
    business: updated.businessData,
    config: updated.config,
  })
}
