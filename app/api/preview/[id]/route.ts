import { NextRequest, NextResponse } from "next/server"
import { getPreview, updatePreviewConfig } from "@/lib/preview-store"
import { colorSchemes, ColorScheme } from "@/lib/mock-data"

import { getJob } from "@/lib/job-store"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // 1. Verify finalized static JSON configuration
  const preview = getPreview(id)
  if (preview) {
    return NextResponse.json({
      status: "COMPLETED",
      business: preview.business,
      config: preview.config,
    })
  }

  // 2. Map directly against isolated async job process dictionary resolving status payloads!
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

  const preview = getPreview(id)
  if (!preview) {
    return NextResponse.json({ error: "Preview not found" }, { status: 404 })
  }

  // Update color scheme if provided
  if (body.colorSchemeId) {
    const colorScheme = colorSchemes.find((c) => c.id === body.colorSchemeId)
    if (colorScheme) {
      updatePreviewConfig(id, { colorScheme })
    }
  }

  // Update layout if provided
  if (body.layout) {
    updatePreviewConfig(id, { layout: body.layout })
  }

  // Update font style if provided
  if (body.fontStyle) {
    updatePreviewConfig(id, { fontStyle: body.fontStyle })
  }

  // Update animations if provided
  if (typeof body.animations === "boolean") {
    updatePreviewConfig(id, { animations: body.animations })
  }

  // Update business photos if provided
  if (body.photos) {
    preview.business.photos = body.photos;
  }
  
  if (body.heroImage) {
    preview.business.heroImage = body.heroImage;
  }
  
  if (body.description) {
    preview.business.description = body.description;
  }
  
  if (body.features) {
    preview.business.features = body.features;
  }

  const updated = getPreview(id)
  return NextResponse.json({
    business: updated?.business,
    config: updated?.config,
  })
}
