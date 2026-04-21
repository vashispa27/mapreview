"use client"

import { useState, useRef } from "react"
import { BusinessData, ServiceItem, ColorScheme } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Dumbbell, Plus, ImagePlus, Check, X, Trash2, Star } from "lucide-react"
import { compressImage } from "@/lib/compress-image"

interface MembershipPageProps {
  business: BusinessData
  colorScheme: ColorScheme
  fontClass: string
  onEnquire: (service: ServiceItem) => void
  onBusinessChange?: (b: BusinessData) => void
}

function nanoid() { return Math.random().toString(36).slice(2, 10) }

const EMPTY: Omit<ServiceItem, "id"> = { title: "", price: "", description: "", image: undefined }

const POPULAR_ID = "gym-halfyearly"

export function MembershipPage({ business, colorScheme, fontClass, onEnquire, onBusinessChange }: MembershipPageProps) {
  const memberships = business.services ?? []
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ ...EMPTY })
  const fileRef = useRef<HTMLInputElement>(null)

  const set = (k: keyof typeof EMPTY, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    set("image", await compressImage(file, 800, 800, 0.82))
  }

  const handleSave = () => {
    if (!form.title.trim() || !onBusinessChange) return
    const newItem: ServiceItem = { id: nanoid(), ...form }
    onBusinessChange({ ...business, services: [...memberships, newItem] })
    setForm({ ...EMPTY })
    setAdding(false)
  }

  const handleDelete = (id: string) => {
    if (!onBusinessChange) return
    onBusinessChange({ ...business, services: memberships.filter((s) => s.id !== id) })
  }

  return (
    <div className={cn("min-h-screen py-16 pb-28", fontClass)} style={{ backgroundColor: colorScheme.background, color: colorScheme.text }}>
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-4" style={{ backgroundColor: colorScheme.primary + "18", color: colorScheme.primary }}>
            Join Us Today
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Membership Plans</h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: colorScheme.muted }}>
            Choose the plan that fits your goals. All memberships include full gym access.
          </p>
        </div>

        {memberships.length === 0 && !adding ? (
          <div className="text-center py-24" style={{ color: colorScheme.muted }}>
            <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No membership plans listed yet.</p>
            {onBusinessChange && (
              <button
                onClick={() => setAdding(true)}
                className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: colorScheme.primary }}
              >
                + Add your first plan
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {memberships.map((plan) => {
              const isPopular = plan.id === POPULAR_ID
              return (
                <div
                  key={plan.id}
                  className={cn(
                    "rounded-2xl border overflow-hidden flex flex-col relative transition-all duration-300 hover:shadow-xl",
                    isPopular && "ring-2 shadow-lg"
                  )}
                  style={{
                    borderColor: isPopular ? colorScheme.primary : colorScheme.primary + "20",
                    backgroundColor: colorScheme.background,
                    ...(isPopular ? { ringColor: colorScheme.primary } : {}),
                  }}
                >
                  {/* Most Popular badge */}
                  {isPopular && (
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: colorScheme.primary }}>
                      <Star className="w-3 h-3 fill-white" />
                      Most Popular
                    </div>
                  )}

                  {/* Delete — preview only */}
                  {onBusinessChange && (
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-black/60 hover:bg-red-500 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-white" />
                    </button>
                  )}

                  {/* Image */}
                  <div className="h-40 overflow-hidden flex items-center justify-center shrink-0" style={{ backgroundColor: colorScheme.primary + "10" }}>
                    {plan.image ? (
                      <img src={plan.image} alt={plan.title} className="w-full h-full object-cover" />
                    ) : (
                      <Dumbbell className="w-10 h-10" style={{ color: colorScheme.primary + "50" }} />
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold mb-1">{plan.title}</h3>
                    <p className="text-2xl font-extrabold mb-3" style={{ color: colorScheme.primary }}>{plan.price}</p>
                    {plan.description && (
                      <p className="text-sm mb-5 flex-1 leading-relaxed" style={{ color: colorScheme.muted }}>{plan.description}</p>
                    )}
                    <button
                      onClick={() => onEnquire(plan)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-95 mt-auto"
                      style={{ backgroundColor: colorScheme.primary }}
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              )
            })}

            {/* Add form card */}
            {adding && onBusinessChange && (
              <div className="rounded-2xl border-2 overflow-hidden flex flex-col" style={{ borderColor: colorScheme.primary + "40", backgroundColor: colorScheme.background }}>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="h-40 flex flex-col items-center justify-center gap-2 transition hover:opacity-80"
                  style={{ backgroundColor: colorScheme.primary + "08" }}
                >
                  {form.image ? (
                    <img src={form.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImagePlus className="w-7 h-7" style={{ color: colorScheme.primary }} />
                      <span className="text-xs font-medium" style={{ color: colorScheme.primary }}>Add photo</span>
                    </>
                  )}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <div className="p-4 flex flex-col gap-2.5 flex-1">
                  <input autoFocus value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Plan name *" className="w-full px-3 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: colorScheme.primary + "30", backgroundColor: colorScheme.background, color: colorScheme.text }} />
                  <input value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="Price (e.g. ₹1,499 / month)" className="w-full px-3 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: colorScheme.primary + "30", backgroundColor: colorScheme.background, color: colorScheme.text }} />
                  <textarea rows={2} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} placeholder="What's included? (optional)" className="w-full px-3 py-2 text-sm rounded-lg border outline-none resize-none" style={{ borderColor: colorScheme.primary + "30", backgroundColor: colorScheme.background, color: colorScheme.text }} />
                  <div className="flex gap-2 mt-auto">
                    <button onClick={handleSave} disabled={!form.title.trim()} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: colorScheme.primary }}>
                      <Check className="w-4 h-4" /> Save
                    </button>
                    <button onClick={() => { setForm({ ...EMPTY }); setAdding(false) }} className="px-3 py-2.5 rounded-xl text-sm border" style={{ borderColor: colorScheme.primary + "30", color: colorScheme.muted }}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Add plan trigger */}
            {!adding && onBusinessChange && (
              <button
                onClick={() => setAdding(true)}
                className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 min-h-[280px] transition-all hover:scale-[1.02]"
                style={{ borderColor: colorScheme.primary + "35", color: colorScheme.primary, backgroundColor: colorScheme.primary + "05" }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colorScheme.primary + "15" }}>
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold">Add Plan</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
