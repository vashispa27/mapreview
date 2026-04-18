"use client"

import { useState, useRef } from "react"
import { BusinessData, ServiceItem, ColorScheme } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Calendar, Plus, ImagePlus, Check, X, Trash2 } from "lucide-react"

interface ServicesPageProps {
  business: BusinessData
  colorScheme: ColorScheme
  fontClass: string
  onBook: (service: ServiceItem) => void
  onBusinessChange?: (b: BusinessData) => void
}

function nanoid() { return Math.random().toString(36).slice(2, 10) }

const EMPTY: Omit<ServiceItem, "id"> = { title: "", price: "", description: "", image: undefined }

export function ServicesPage({ business, colorScheme, fontClass, onBook, onBusinessChange }: ServicesPageProps) {
  const services = business.services ?? []
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ ...EMPTY })
  const fileRef = useRef<HTMLInputElement>(null)

  const set = (k: keyof typeof EMPTY, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => set("image", ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    if (!form.title.trim() || !onBusinessChange) return
    const newSvc: ServiceItem = { id: nanoid(), ...form }
    onBusinessChange({ ...business, services: [...services, newSvc] })
    setForm({ ...EMPTY })
    setAdding(false)
  }

  const handleDelete = (id: string) => {
    if (!onBusinessChange) return
    onBusinessChange({ ...business, services: services.filter((s) => s.id !== id) })
  }

  const handleCancel = () => {
    setForm({ ...EMPTY })
    setAdding(false)
  }

  return (
    <div className={cn("min-h-screen py-16 pb-28", fontClass)} style={{ backgroundColor: colorScheme.background, color: colorScheme.text }}>
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-4" style={{ backgroundColor: colorScheme.primary + "18", color: colorScheme.primary }}>
            What We Offer
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: colorScheme.muted }}>
            Book a session with us. Tap any service to get in touch.
          </p>
        </div>

        {services.length === 0 && !adding ? (
          <div className="text-center py-24" style={{ color: colorScheme.muted }}>
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No services listed yet.</p>
            {onBusinessChange && (
              <button
                onClick={() => setAdding(true)}
                className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: colorScheme.primary }}
              >
                + Add your first service
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="rounded-2xl border overflow-hidden flex flex-col group hover:shadow-xl transition-shadow duration-300 relative"
                style={{ borderColor: colorScheme.primary + "20", backgroundColor: colorScheme.background }}
              >
                {/* Delete button — preview only */}
                {onBusinessChange && (
                  <button
                    onClick={() => handleDelete(svc.id)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-red-500 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-white" />
                  </button>
                )}
                {/* Image */}
                <div className="h-72 overflow-hidden flex items-center justify-center" style={{ backgroundColor: colorScheme.primary + "08" }}>
                  {svc.image ? (
                    <img src={svc.image} alt={svc.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <Calendar className="w-14 h-14" style={{ color: colorScheme.primary + "50" }} />
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-2">{svc.title}</h3>
                  {svc.description && (
                    <p className="text-sm mb-4 flex-1" style={{ color: colorScheme.muted }}>{svc.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-4" style={{ borderTop: `1px solid ${colorScheme.primary}15` }}>
                    <span className="text-2xl font-bold" style={{ color: colorScheme.primary }}>{svc.price}</span>
                    <button
                      onClick={() => onBook(svc)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 hover:shadow-md active:scale-95"
                      style={{ backgroundColor: colorScheme.primary }}
                    >
                      <Calendar className="w-4 h-4" />
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add form card */}
            {adding && onBusinessChange && (
              <div className="rounded-2xl border-2 overflow-hidden flex flex-col" style={{ borderColor: colorScheme.primary + "40", backgroundColor: colorScheme.background }}>
                {/* Image picker */}
                <button
                  onClick={() => fileRef.current?.click()}
                  className="h-72 flex flex-col items-center justify-center gap-2 transition hover:opacity-80"
                  style={{ backgroundColor: colorScheme.primary + "08" }}
                >
                  {form.image ? (
                    <img src={form.image} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <>
                      <ImagePlus className="w-8 h-8" style={{ color: colorScheme.primary }} />
                      <span className="text-sm font-medium" style={{ color: colorScheme.primary }}>Add photo</span>
                    </>
                  )}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

                <div className="p-5 flex flex-col gap-3 flex-1">
                  <input
                    autoFocus
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder="Service name *"
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none transition"
                    style={{ borderColor: colorScheme.primary + "30", backgroundColor: colorScheme.background, color: colorScheme.text }}
                  />
                  <input
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                    placeholder="Price (e.g. $50 / session)"
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none transition"
                    style={{ borderColor: colorScheme.primary + "30", backgroundColor: colorScheme.background, color: colorScheme.text }}
                  />
                  <textarea
                    rows={2}
                    value={form.description ?? ""}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="Short description (optional)"
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none resize-none transition"
                    style={{ borderColor: colorScheme.primary + "30", backgroundColor: colorScheme.background, color: colorScheme.text }}
                  />
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={handleSave}
                      disabled={!form.title.trim()}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-white transition disabled:opacity-40"
                      style={{ backgroundColor: colorScheme.primary }}
                    >
                      <Check className="w-4 h-4" /> Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold border transition hover:bg-black/5"
                      style={{ borderColor: colorScheme.primary + "30", color: colorScheme.muted }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Add Service card (trigger) */}
            {!adding && onBusinessChange && (
              <button
                onClick={() => setAdding(true)}
                className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 min-h-[360px] transition-all hover:scale-[1.02]"
                style={{ borderColor: colorScheme.primary + "35", color: colorScheme.primary, backgroundColor: colorScheme.primary + "05" }}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: colorScheme.primary + "15" }}>
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold">Add Service</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
