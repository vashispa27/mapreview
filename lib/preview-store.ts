import { BusinessData, SiteConfig, colorSchemes } from "./mock-data"

// In-memory store for preview data (persist across HMR reloads)
const previewStore = (globalThis as any).previewStore || new Map<
  string,
  {
    business: BusinessData
    config: SiteConfig
    createdAt: Date
  }
>()

if (process.env.NODE_ENV !== 'production') {
  (globalThis as any).previewStore = previewStore
}

export function createPreview(business: BusinessData, config?: SiteConfig, forceId?: string): string {
  const previewId = forceId || business.id + "_" + Date.now().toString(36)

  previewStore.set(previewId, {
    business,
    config: config || {
      colorScheme: colorSchemes[0],
      layout: "modern",
      fontStyle: "sans",
      animations: true,
    },
    createdAt: new Date(),
  })
  return previewId
}

export function getPreview(previewId: string) {
  return previewStore.get(previewId) || null
}

export function updatePreviewConfig(previewId: string, config: Partial<SiteConfig>) {
  const preview = previewStore.get(previewId)
  if (preview) {
    preview.config = { ...preview.config, ...config }
    previewStore.set(previewId, preview)
    return true
  }
  return false
}

// Clean up old previews (older than 1 hour)
export function cleanupOldPreviews() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  for (const [id, data] of previewStore.entries()) {
    if (data.createdAt < oneHourAgo) {
      previewStore.delete(id)
    }
  }
}
