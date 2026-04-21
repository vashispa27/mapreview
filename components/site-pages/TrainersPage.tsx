"use client"

import { useRef, useState } from "react"
import { BusinessData, TrainerItem, ColorScheme } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { User, Pencil, Check, X, ImagePlus, Plus, Trash2, Loader2 } from "lucide-react"
import { compressImageToBlob } from "@/lib/compress-image"

interface TrainersPageProps {
  business: BusinessData
  colorScheme: ColorScheme
  fontClass: string
  onBusinessChange?: (b: BusinessData) => void
}

function nanoid() { return Math.random().toString(36).slice(2, 10) }

function TrainerCard({
  trainer,
  colorScheme,
  isPreview,
  onUpdate,
  onDelete,
}: {
  trainer: TrainerItem
  colorScheme: ColorScheme
  isPreview?: boolean
  onUpdate?: (t: TrainerItem) => void
  onDelete?: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<TrainerItem>(trainer)
  const [isUploading, setIsUploading] = useState(false)
  const photoRef = useRef<HTMLInputElement>(null)

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    try {
      const { blob } = await compressImageToBlob(file, 600, 800, 0.85)
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: blob,
      })
      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()
      setDraft((d) => ({ ...d, photo: data.url }))
    } catch (err) {
      console.error("Upload failed:", err)
    } finally {
      setIsUploading(false)
    }
  }

  const save = () => { onUpdate?.(draft); setEditing(false) }
  const cancel = () => { setDraft(trainer); setEditing(false) }

  // ── Edit form card ────────────────────────────────────────────────────────
  if (editing && isPreview) {
    return (
      <div className="break-inside-avoid mb-4 rounded-2xl overflow-hidden border-2" style={{ borderColor: colorScheme.primary + "40", backgroundColor: colorScheme.background }}>
        {/* Photo upload area */}
        <button
          onClick={() => !isUploading && photoRef.current?.click()}
          disabled={isUploading}
          className={cn("w-full aspect-[3/4] flex items-center justify-center overflow-hidden relative transition", isUploading ? "cursor-not-allowed" : "hover:opacity-90 cursor-pointer")}
          style={{ backgroundColor: colorScheme.primary + "10" }}
        >
          {draft.photo ? (
            <img src={draft.photo} alt="" className="w-full h-full object-cover" />
          ) : null}
          <div className={cn("absolute inset-0 flex flex-col items-center justify-center gap-2", draft.photo ? "bg-black/40" : "")}>
            {isUploading
              ? <Loader2 className="w-8 h-8 animate-spin text-white" />
              : <>
                  <ImagePlus className={cn("w-8 h-8", draft.photo ? "text-white" : "")} style={draft.photo ? undefined : { color: colorScheme.primary }} />
                  <span className={cn("text-xs font-semibold", draft.photo ? "text-white" : "")} style={draft.photo ? undefined : { color: colorScheme.primary }}>
                    {draft.photo ? "Change photo" : "Upload photo"}
                  </span>
                </>
            }
          </div>
        </button>
        <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />

        {/* Fields */}
        <div className="p-4 flex flex-col gap-2.5">
          <input
            autoFocus value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            placeholder="Trainer name"
            className="w-full px-3 py-2 text-sm rounded-lg border outline-none font-semibold"
            style={{ borderColor: colorScheme.primary + "30", backgroundColor: colorScheme.background, color: colorScheme.text }}
          />
          <input
            value={draft.specialization}
            onChange={(e) => setDraft((d) => ({ ...d, specialization: e.target.value }))}
            placeholder="Specialization (e.g. Yoga & Flexibility)"
            className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
            style={{ borderColor: colorScheme.primary + "30", backgroundColor: colorScheme.background, color: colorScheme.text }}
          />
          <input
            value={draft.experience ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, experience: e.target.value }))}
            placeholder="Experience (e.g. 5+ years)"
            className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
            style={{ borderColor: colorScheme.primary + "30", backgroundColor: colorScheme.background, color: colorScheme.text }}
          />
          <textarea
            rows={2} value={draft.bio ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
            placeholder="Short bio (optional)"
            className="w-full px-3 py-2 text-sm rounded-lg border outline-none resize-none"
            style={{ borderColor: colorScheme.primary + "30", backgroundColor: colorScheme.background, color: colorScheme.text }}
          />
          <div className="flex gap-2 pt-1">
            <button onClick={save} disabled={!draft.name.trim()} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-40 transition" style={{ backgroundColor: colorScheme.primary }}>
              <Check className="w-4 h-4" /> Save
            </button>
            <button onClick={cancel} className="px-3 py-2 rounded-xl text-sm border transition" style={{ borderColor: colorScheme.primary + "30", color: colorScheme.muted }}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Display card ──────────────────────────────────────────────────────────
  return (
    <div className="break-inside-avoid mb-4 rounded-2xl overflow-hidden relative group" style={{ backgroundColor: colorScheme.background }}>
      {/* Preview action buttons */}
      {isPreview && (
        <div className="absolute top-3 right-3 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity">
          <button onClick={() => setEditing(true)} className="w-7 h-7 rounded-full flex items-center justify-center bg-black/60 hover:bg-black/80 transition-colors">
            <Pencil className="w-3 h-3 text-white" />
          </button>
          <button onClick={onDelete} className="w-7 h-7 rounded-full flex items-center justify-center bg-black/60 hover:bg-red-500 transition-colors">
            <Trash2 className="w-3 h-3 text-white" />
          </button>
        </div>
      )}

      {/* Photo */}
      <div className="w-full aspect-[3/4] overflow-hidden relative" style={{ backgroundColor: colorScheme.primary + "12" }}>
        {trainer.photo ? (
          <img src={trainer.photo} alt={trainer.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3" style={{ color: colorScheme.primary + "50" }}>
            <User className="w-16 h-16" />
            {isPreview && (
              <button onClick={() => setEditing(true)} className="text-xs font-semibold px-3 py-1.5 rounded-full border transition hover:opacity-80" style={{ borderColor: colorScheme.primary + "40", color: colorScheme.primary, backgroundColor: colorScheme.primary + "10" }}>
                Add photo
              </button>
            )}
          </div>
        )}

        {/* Specialization badge — overlaid on photo bottom */}
        {trainer.photo && (
          <div className="absolute bottom-3 left-3">
            <span className="inline-block text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm" style={{ backgroundColor: colorScheme.primary, color: "#fff" }}>
              {trainer.specialization}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 pb-5">
        {!trainer.photo && (
          <span className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-3" style={{ backgroundColor: colorScheme.primary + "15", color: colorScheme.primary }}>
            {trainer.specialization}
          </span>
        )}
        <h3 className="text-lg font-bold leading-tight mb-1">{trainer.name}</h3>
        {trainer.experience && (
          <p className="text-xs font-medium mb-2" style={{ color: colorScheme.primary }}>{trainer.experience}</p>
        )}
        {trainer.bio && (
          <p className="text-sm leading-relaxed" style={{ color: colorScheme.muted }}>{trainer.bio}</p>
        )}
      </div>
    </div>
  )
}

export function TrainersPage({ business, colorScheme, fontClass, onBusinessChange }: TrainersPageProps) {
  const trainers = business.trainers ?? []
  const isPreview = !!onBusinessChange

  const handleUpdate = (id: string, updated: TrainerItem) =>
    onBusinessChange?.({ ...business, trainers: trainers.map((t) => t.id === id ? updated : t) })

  const handleDelete = (id: string) =>
    onBusinessChange?.({ ...business, trainers: trainers.filter((t) => t.id !== id) })

  const handleAdd = () => {
    const newTrainer: TrainerItem = { id: nanoid(), name: "Trainer Name", specialization: "Specialization", experience: "", bio: "", photo: undefined }
    onBusinessChange?.({ ...business, trainers: [...trainers, newTrainer] })
  }

  return (
    <div className={cn("min-h-screen py-16 pb-28", fontClass)} style={{ backgroundColor: colorScheme.background, color: colorScheme.text }}>
      <div className="max-w-5xl mx-auto px-4">

        {/* Page header */}
        <div className="mb-12">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-5" style={{ backgroundColor: colorScheme.primary + "18", color: colorScheme.primary }}>
            The Team
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Expert Coaches,<br />Exceptional Results
          </h1>
          <p className="text-base max-w-md" style={{ color: colorScheme.muted }}>
            Our dedicated trainers bring years of experience and passion to help you reach your peak performance.
          </p>
        </div>

        {/* Masonry grid */}
        {trainers.length === 0 && !isPreview ? (
          <div className="text-center py-24" style={{ color: colorScheme.muted }}>
            <User className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No trainers listed yet.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 gap-4">
            {trainers.map((trainer) => (
              <TrainerCard
                key={trainer.id}
                trainer={trainer}
                colorScheme={colorScheme}
                isPreview={isPreview}
                onUpdate={(updated) => handleUpdate(trainer.id, updated)}
                onDelete={() => handleDelete(trainer.id)}
              />
            ))}

            {/* Add Trainer card */}
            {isPreview && (
              <div className="break-inside-avoid mb-4">
                <button
                  onClick={handleAdd}
                  className="w-full rounded-2xl flex flex-col items-center justify-center gap-4 py-16 transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ backgroundColor: colorScheme.primary, color: "#fff" }}
                >
                  <div className="w-14 h-14 rounded-full border-2 border-white/40 flex items-center justify-center">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg">Add to the Team</p>
                    <p className="text-sm text-white/70 mt-1">Click to add a new trainer</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
