import { SiteTemplate } from "@/components/site-template"
import { GYM_BUSINESS, GYM_CONFIG } from "@/lib/gym-data"

export default function GymPreviewPage() {
  return (
    <SiteTemplate
      business={GYM_BUSINESS}
      config={GYM_CONFIG}
      isPreview={false}
    />
  )
}
