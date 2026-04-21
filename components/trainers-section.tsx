"use client"

import { useRef, useState } from "react"
import { BusinessData, TrainerItem, ColorScheme } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { User, Pencil, Check, X, ImagePlus, Plus, Trash2, EyeOff } from "lucide-react"
import { compressImage } from "@/lib/compress-image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface TrainersSectionProps {
  business: BusinessData
  colorScheme: ColorScheme
  isPreview?: boolean
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
  const photoRef = useRef<HTMLInputElement>(null)

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const compressed = await compressImage(file, 400, 400, 0.85)
    setDraft((d) => ({ ...d, photo: compressed }))
  }

  const save = () => {
    onUpdate?.(draft)
    setEditing(false)
  }

  const cancel = () => {
    setDraft(trainer)
    setEditing(false)
  }

  if (editing && isPreview) {
    return (
      <div
        className="rounded-2xl border-2 p-5 flex flex-col gap-3 h-full"
        style={{ borderColor: colorScheme.primary + "40", backgroundColor: colorScheme.background }}
      >
        {/* Photo upload */}
        <button
          onClick={() => photoRef.current?.click()}
          className="w-24 h-24 rounded-full mx-auto flex items-center justify-center overflow-hidden border-2 border-dashed transition hover:opacity-80"
          style={{ borderColor: colorScheme.primary + "50", backgroundColor: colorScheme.primary + "08" }}
        >
          {draft.photo ? (
            <img src={draft.photo} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImagePlus className="w-7 h-7" style={{ color: colorScheme.primary }} />
          )}
        </button>
        <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />

        <input
          autoFocus
          value={draft.name}
          onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
          placeholder="Trainer name"
          className="w-full px-3 py-2 text-sm rounded-lg border outline-none text-center font-semibold"
          style={{ borderColor: colorScheme.primary + "30", backgroundColor: colorScheme.background, color: colorScheme.text }}
        />
        <input
          value={draft.specialization}
          onChange={(e) => setDraft((d) => ({ ...d, specialization: e.target.value }))}
          placeholder="Specialization (e.g. Yoga & Flexibility)"
          className="w-full px-3 py-2 text-sm rounded-lg border outline-none text-center"
          style={{ borderColor: colorScheme.primary + "30", backgroundColor: colorScheme.background, color: colorScheme.text }}
        />
        <input
          value={draft.experience ?? ""}
          onChange={(e) => setDraft((d) => ({ ...d, experience: e.target.value }))}
          placeholder="Experience (e.g. 5+ years)"
          className="w-full px-3 py-2 text-sm rounded-lg border outline-none text-center"
          style={{ borderColor: colorScheme.primary + "30", backgroundColor: colorScheme.background, color: colorScheme.text }}
        />
        <textarea
          rows={2}
          value={draft.bio ?? ""}
          onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
          placeholder="Short bio (optional)"
          className="w-full px-3 py-2 text-sm rounded-lg border outline-none resize-none"
          style={{ borderColor: colorScheme.primary + "30", backgroundColor: colorScheme.background, color: colorScheme.text }}
        />
        <div className="flex gap-2">
          <button
            onClick={save}
            disabled={!draft.name.trim()}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-40"
            style={{ backgroundColor: colorScheme.primary }}
          >
            <Check className="w-4 h-4" /> Save
          </button>
          <button
            onClick={cancel}
            className="px-3 py-2 rounded-xl text-sm border"
            style={{ borderColor: colorScheme.primary + "30", color: colorScheme.muted }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl border p-6 flex flex-col items-center text-center relative group h-full"
      style={{ borderColor: colorScheme.primary + "20", backgroundColor: colorScheme.background }}
    >
      {/* Action buttons — preview only */}
      {isPreview && (
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity">
          <button
            onClick={() => setEditing(true)}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-black/60 hover:bg-black/80 transition-colors"
            title="Edit trainer"
          >
            <Pencil className="w-3 h-3 text-white" />
          </button>
          <button
            onClick={onDelete}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-black/60 hover:bg-red-500 transition-colors"
            title="Remove trainer"
          >
            <Trash2 className="w-3 h-3 text-white" />
          </button>
        </div>
      )}

      {/* Photo */}
      <div
        className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 flex items-center justify-center"
        style={{ borderColor: colorScheme.primary + "30", backgroundColor: colorScheme.primary + "10" }}
      >
        {trainer.photo ? (
          <img src={trainer.photo} alt={trainer.name} className="w-full h-full object-cover" />
        ) : (
          <User className="w-10 h-10" style={{ color: colorScheme.primary + "60" }} />
        )}
      </div>

      <h3 className="text-lg font-bold mb-1">{trainer.name}</h3>
      <span
        className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3"
        style={{ backgroundColor: colorScheme.primary + "15", color: colorScheme.primary }}
      >
        {trainer.specialization}
      </span>
      {trainer.experience && (
        <p className="text-xs font-medium mb-2" style={{ color: colorScheme.muted }}>{trainer.experience}</p>
      )}
      {trainer.bio && (
        <p className="text-sm leading-relaxed" style={{ color: colorScheme.muted }}>{trainer.bio}</p>
      )}

      {/* Edit hint — preview only, no photo */}
      {isPreview && !trainer.photo && (
        <button
          onClick={() => setEditing(true)}
          className="mt-4 text-xs font-medium underline underline-offset-2 transition hover:opacity-70"
          style={{ color: colorScheme.primary }}
        >
          Tap to edit
        </button>
      )}
    </div>
  )
}

export function TrainersSection({ business, colorScheme, isPreview, onBusinessChange }: TrainersSectionProps) {
  const trainers = business.trainers ?? []

  if (!business.showTrainersSection && !isPreview) return null
  if (!business.showTrainersSection && isPreview) {
    return (
      <div className="py-6 px-4 rounded-2xl border-2 border-dashed text-center" style={{ borderColor: colorScheme.primary + "25", color: colorScheme.muted }}>
        <p className="text-sm font-medium">Trainers section is hidden.</p>
        <button
          onClick={() => onBusinessChange?.({ ...business, showTrainersSection: true })}
          className="mt-2 text-xs font-semibold underline underline-offset-2"
          style={{ color: colorScheme.primary }}
        >
          Show trainers section
        </button>
      </div>
    )
  }

  const handleUpdate = (id: string, updated: TrainerItem) => {
    onBusinessChange?.({
      ...business,
      trainers: trainers.map((t) => (t.id === id ? updated : t)),
    })
  }

  const handleDelete = (id: string) => {
    onBusinessChange?.({
      ...business,
      trainers: trainers.filter((t) => t.id !== id),
    })
  }

  const handleAdd = () => {
    const newTrainer: TrainerItem = {
      id: nanoid(),
      name: "Trainer Name",
      specialization: "Specialization",
      experience: "",
      bio: "",
      photo: undefined,
    }
    onBusinessChange?.({ ...business, trainers: [...trainers, newTrainer] })
  }

  const handleHide = () => {
    onBusinessChange?.({ ...business, showTrainersSection: false })
  }

  return (
    <div className="relative">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl md:text-4xl font-bold">Meet Our Trainers</h2>
        {isPreview && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: colorScheme.primary }}
            >
              <Plus className="w-3.5 h-3.5" /> Add Trainer
            </button>
            <button
              onClick={handleHide}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition hover:bg-black/5"
              style={{ borderColor: colorScheme.primary + "30", color: colorScheme.muted }}
              title="Remove section"
            >
              <EyeOff className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
        )}
      </div>

      {trainers.length === 0 ? (
        <div className="text-center py-12" style={{ color: colorScheme.muted }}>
          <User className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No trainers added yet.</p>
          {isPreview && (
            <button
              onClick={handleAdd}
              className="mt-3 px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: colorScheme.primary }}
            >
              + Add Trainer
            </button>
          )}
        </div>
      ) : (
        <Carousel opts={{ align: "start", loop: trainers.length > 3 }} className="w-full">
          <CarouselContent className="-ml-4">
            {trainers.map((trainer) => (
              <CarouselItem key={trainer.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <TrainerCard
                  trainer={trainer}
                  colorScheme={colorScheme}
                  isPreview={isPreview}
                  onUpdate={(updated) => handleUpdate(trainer.id, updated)}
                  onDelete={() => handleDelete(trainer.id)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {trainers.length > 1 && (
            <div className="flex items-center justify-end gap-2 mt-6">
              <CarouselPrevious className="static translate-y-0 relative border-2" />
              <CarouselNext className="static translate-y-0 relative border-2" />
            </div>
          )}
        </Carousel>
      )}
    </div>
  )
}
