"use client"

import { useRef, useState } from "react"
import { BusinessData, ServiceItem, ProductItem } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import {
  Calendar, ShoppingBag, Phone, Plus, Trash2,
  ChevronDown, ChevronUp, ImagePlus, Instagram, Linkedin,
  X,
} from "lucide-react"

interface PageManagerProps {
  business: BusinessData
  onChange: (b: BusinessData) => void
}

function nanoid() { return Math.random().toString(36).slice(2, 10) }

const ALL_PAGES = [
  { key: "services" as const, label: "Services", icon: Calendar, description: "Showcase your services with booking" },
  { key: "products" as const, label: "Products", icon: ShoppingBag, description: "Sell products with a cart checkout" },
  { key: "contact" as const, label: "Contact Us", icon: Phone, description: "Inquiry form and social links" },
]

export function PageManager({ business, onChange }: PageManagerProps) {
  const [addOpen, setAddOpen] = useState(false)
  const pages = business.pages ?? {}

  const activePagesKeys = ALL_PAGES.filter((p) => !!pages[p.key])
  const availableToAdd = ALL_PAGES.filter((p) => !pages[p.key])

  const addPage = (key: "services" | "products" | "contact") => {
    onChange({ ...business, pages: { ...pages, [key]: true } })
    setAddOpen(false)
  }

  const removePage = (key: "services" | "products" | "contact") => {
    onChange({ ...business, pages: { ...pages, [key]: false } })
  }

  return (
    <div className="space-y-3">
      {/* Empty state */}
      {activePagesKeys.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
            <Plus className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium">No pages yet</p>
          <p className="text-xs mt-1">Add a page below to get started</p>
        </div>
      )}

      {/* Active pages */}
      {ALL_PAGES.map((p) =>
        pages[p.key] ? (
          <PageCard
            key={p.key}
            label={p.label}
            icon={p.icon}
            onDelete={() => removePage(p.key)}
          >
            {p.key === "services" && <ServicesEditor business={business} onChange={onChange} />}
            {p.key === "products" && <ProductsEditor business={business} onChange={onChange} />}
            {p.key === "contact" && <ContactEditor business={business} onChange={onChange} />}
          </PageCard>
        ) : null
      )}

      {/* Add page button */}
      {availableToAdd.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setAddOpen((v) => !v)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-border text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Page
          </button>
          {addOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-10">
              {availableToAdd.map((p) => {
                const Icon = p.icon
                return (
                  <button
                    key={p.key}
                    onClick={() => addPage(p.key)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{p.label}</p>
                      <p className="text-xs text-muted-foreground">{p.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Page card ─────────────────────────────────────────────────────────────
function PageCard({ label, icon: Icon, onDelete, children }: {
  label: string
  icon: React.ElementType
  onDelete: () => void
  children: React.ReactNode
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-xl border-2 border-primary/20 overflow-hidden">
      <div className="flex items-center justify-between p-3.5 bg-primary/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm">{label}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1.5 rounded-lg hover:bg-black/5 transition"
            title="Edit page content"
          >
            {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition"
            title="Remove page"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      {expanded && (
        <div className="border-t border-primary/10 px-3.5 pb-3.5 pt-3 bg-muted/10">
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Services editor ───────────────────────────────────────────────────────
function ServicesEditor({ business, onChange }: { business: BusinessData; onChange: (b: BusinessData) => void }) {
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const services = business.services ?? []

  const update = (updated: ServiceItem[]) => onChange({ ...business, services: updated })

  const add = () => update([...services, { id: nanoid(), title: "New Service", price: "$0", description: "" }])

  const edit = (id: string, field: keyof ServiceItem, value: string) =>
    update(services.map((s) => s.id === id ? { ...s, [field]: value } : s))

  const remove = (id: string) => update(services.filter((s) => s.id !== id))

  const uploadImage = (id: string, file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => edit(id, "image", e.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-3">
      {services.map((svc) => (
        <div key={svc.id} className="bg-background rounded-xl border border-border p-3 space-y-2.5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => fileRefs.current[svc.id]?.click()}
              className="w-14 h-14 rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden hover:border-primary/50 transition flex-shrink-0"
            >
              {svc.image
                ? <img src={svc.image} className="w-full h-full object-cover" />
                : <ImagePlus className="w-5 h-5 text-muted-foreground" />}
            </button>
            <input
              ref={(el) => { fileRefs.current[svc.id] = el }}
              type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(svc.id, f) }}
            />
            <div className="flex-1 space-y-1.5">
              <input
                value={svc.title} onChange={(e) => edit(svc.id, "title", e.target.value)}
                placeholder="Service name" className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-border bg-background outline-none focus:border-primary transition"
              />
              <input
                value={svc.price} onChange={(e) => edit(svc.id, "price", e.target.value)}
                placeholder="$0 / session" className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-border bg-background outline-none focus:border-primary transition"
              />
            </div>
            <button onClick={() => remove(svc.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <textarea
            rows={2} value={svc.description ?? ""}
            onChange={(e) => edit(svc.id, "description", e.target.value)}
            placeholder="Short description (optional)"
            className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-border bg-background outline-none focus:border-primary transition resize-none"
          />
        </div>
      ))}
      <button
        onClick={add}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-dashed border-border text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-primary transition"
      >
        <Plus className="w-4 h-4" /> Add Service
      </button>
    </div>
  )
}

// ─── Products editor ───────────────────────────────────────────────────────
function ProductsEditor({ business, onChange }: { business: BusinessData; onChange: (b: BusinessData) => void }) {
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const products = business.products ?? []

  const update = (updated: ProductItem[]) => onChange({ ...business, products: updated })
  const add = () => update([...products, { id: nanoid(), title: "New Product", price: "$0", description: "" }])
  const edit = (id: string, field: keyof ProductItem, value: string) =>
    update(products.map((p) => p.id === id ? { ...p, [field]: value } : p))
  const remove = (id: string) => update(products.filter((p) => p.id !== id))
  const uploadImage = (id: string, file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => edit(id, "image", e.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-3">
      {products.map((p) => (
        <div key={p.id} className="bg-background rounded-xl border border-border p-3 space-y-2.5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => fileRefs.current[p.id]?.click()}
              className="w-14 h-14 rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden hover:border-primary/50 transition flex-shrink-0"
            >
              {p.image
                ? <img src={p.image} className="w-full h-full object-cover" />
                : <ImagePlus className="w-5 h-5 text-muted-foreground" />}
            </button>
            <input
              ref={(el) => { fileRefs.current[p.id] = el }}
              type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(p.id, f) }}
            />
            <div className="flex-1 space-y-1.5">
              <input
                value={p.title} onChange={(e) => edit(p.id, "title", e.target.value)}
                placeholder="Product name" className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-border bg-background outline-none focus:border-primary transition"
              />
              <input
                value={p.price} onChange={(e) => edit(p.id, "price", e.target.value)}
                placeholder="$0.00" className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-border bg-background outline-none focus:border-primary transition"
              />
            </div>
            <button onClick={() => remove(p.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <textarea
            rows={2} value={p.description ?? ""}
            onChange={(e) => edit(p.id, "description", e.target.value)}
            placeholder="Short description (optional)"
            className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-border bg-background outline-none focus:border-primary transition resize-none"
          />
        </div>
      ))}
      <button onClick={add} className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-dashed border-border text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-primary transition">
        <Plus className="w-4 h-4" /> Add Product
      </button>
    </div>
  )
}

// ─── Contact editor ────────────────────────────────────────────────────────
function ContactEditor({ business, onChange }: { business: BusinessData; onChange: (b: BusinessData) => void }) {
  const socials = business.socials ?? {}
  const setSocial = (key: string, val: string) =>
    onChange({ ...business, socials: { ...socials, [key]: val } })

  return (
    <div className="space-y-2.5">
      <p className="text-xs text-muted-foreground mb-1">Phone is pulled from your Google Maps data. Add your social links below.</p>
      <SocialInput icon={<Instagram className="w-4 h-4" />} label="Instagram URL" value={socials.instagram ?? ""} onChange={(v) => setSocial("instagram", v)} />
      <SocialInput icon={<Linkedin className="w-4 h-4" />} label="LinkedIn URL" value={socials.linkedin ?? ""} onChange={(v) => setSocial("linkedin", v)} />
      <SocialInput icon={<span className="text-xs font-bold">f</span>} label="Facebook URL" value={socials.facebook ?? ""} onChange={(v) => setSocial("facebook", v)} />
    </div>
  )
}

function SocialInput({ icon, label, value, onChange }: { icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2.5 bg-background rounded-lg border border-border px-3 py-2 focus-within:border-primary transition">
      <span className="text-muted-foreground flex-shrink-0">{icon}</span>
      <input
        value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={label} className="flex-1 text-sm outline-none bg-transparent"
      />
    </div>
  )
}
