import { NextRequest, NextResponse } from "next/server"
import { getPreview, updatePreviewConfig } from "@/lib/preview-store"
import { colorSchemes, ColorScheme } from "@/lib/mock-data"
import { getJob } from "@/lib/job-store"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // 1. Get the current user session
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  // 2. Fetch from DB and verify ownership
  // We search for either ID or Slug that matches the parameter
  const dbSite = await db.site.findFirst({
    where: {
      OR: [
        { id: id },
        { slug: id }
      ]
    }
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
      isPublished: !!dbSite.slug,
      slug: dbSite.slug,
      config: dbSite.config || {
        colorSchemeId: "default",
        layout: "modern",
        fontStyle: "sans",
        animations: true
      },
    })
  }

  // 3. Fallback to in-memory job status (for brand new generation)
  const job = getJob(id)
  if (job) {
    return NextResponse.json({
      status: job.status,
      errorMessage: job.errorMessage
    })
  }

  return NextResponse.json({ error: "Preview not initialized" }, { status: 404 })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()

  // 1. Get the current user session
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  // 2. Fetch current data from DB (Search by slug or ID)
  const site = await db.site.findFirst({
    where: {
      OR: [
        { id: id },
        { slug: id }
      ]
    }
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

  // Update Business and Config based on body
  if (body.colorSchemeId) currentConfig.colorSchemeId = body.colorSchemeId
  if (body.layout) currentConfig.layout = body.layout
  if (body.fontStyle) currentConfig.fontStyle = body.fontStyle
  if (typeof body.animations === "boolean") currentConfig.animations = body.animations

  if (body.photos) currentBusiness.photos = body.photos
  if (body.heroImage) currentBusiness.heroImage = body.heroImage
  if (body.menuImage !== undefined) currentBusiness.menuImage = body.menuImage || null
  if (body.description) currentBusiness.description = body.description
  if (body.features) currentBusiness.features = body.features
  if (body.pages !== undefined) currentBusiness.pages = body.pages
  if (body.services !== undefined) currentBusiness.services = body.services
  if (body.products !== undefined) currentBusiness.products = body.products
  if (body.socials !== undefined) currentBusiness.socials = body.socials
  if (body.trainers !== undefined) currentBusiness.trainers = body.trainers
  if (typeof body.showTrainersSection === "boolean") currentBusiness.showTrainersSection = body.showTrainersSection

  // 3. Save to Prisma
  const updated = await db.site.update({
    where: { id: site.id }, // Use the internal primary ID for the update
    data: {
      businessData: currentBusiness,
      config: currentConfig,
      slug: body.slug || site.slug
    }
  })

  // Purge the ISR cache
  if (updated.slug) revalidatePath(`/site/${updated.slug}`)
  revalidatePath(`/site/${updated.id}`)

  return NextResponse.json({
    business: updated.businessData,
    config: updated.config,
  })
}
