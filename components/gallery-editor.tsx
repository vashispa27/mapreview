"use client"

import { useRef, useState, useCallback } from "react"
import { SitePhoto } from "@/lib/mock-data"
import { X, Upload, ImagePlus, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface GalleryEditorProps {
  photos: SitePhoto[]
  onChange: (photos: SitePhoto[]) => void
}

export function GalleryEditor({ photos, onChange }: GalleryEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleRemove = (index: number) => {
    onChange(photos.filter((_, i) => i !== index))
  }

  const readFilesAsDataURLs = (files: File[]): Promise<SitePhoto[]> => {
    return Promise.all(
      files
        .filter((f) => f.type.startsWith("image/"))
        .map(
          (file) =>
            new Promise<SitePhoto>((resolve) => {
              const reader = new FileReader()
              reader.onload = (e) => {
                resolve({
                  url: e.target?.result as string,
                  caption: file.name.replace(/\.[^.]+$/, ""),
                })
              }
              reader.readAsDataURL(file)
            })
        )
    )
  }

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return
      const newPhotos = await readFilesAsDataURLs(Array.from(files))
      onChange([...photos, ...newPhotos])
    },
    [photos, onChange]
  )

  // Drop zone on the whole panel
  const handleDropzoneDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingOver(false)
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  // Reorder via drag
  const handleThumbDragStart = (index: number) => setDragIndex(index)
  const handleThumbDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }
  const handleThumbDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null)
      setDragOverIndex(null)
      return
    }
    const reordered = [...photos]
    const [moved] = reordered.splice(dragIndex, 1)
    reordered.splice(index, 0, moved)
    onChange(reordered)
    setDragIndex(null)
    setDragOverIndex(null)
  }
  const handleThumbDragEnd = () => {
    setDragIndex(null)
    setDragOverIndex(null)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-foreground/80">Gallery Photos</h3>
        <span className="text-xs text-muted-foreground">{photos.length} photo{photos.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Thumbnails grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => handleThumbDragStart(index)}
              onDragOver={(e) => handleThumbDragOver(e, index)}
              onDrop={() => handleThumbDrop(index)}
              onDragEnd={handleThumbDragEnd}
              className={cn(
                "relative group aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing",
                dragOverIndex === index && dragIndex !== index
                  ? "border-primary scale-105 shadow-lg"
                  : "border-transparent",
                dragIndex === index && "opacity-40"
              )}
            >
              <Image
                src={photo.url}
                alt={photo.caption}
                fill
                className="object-cover"
                crossOrigin="anonymous"
                unoptimized={photo.url.startsWith("data:")}
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                <GripVertical className="w-4 h-4 text-white/80" />
                <span className="text-white text-[10px] leading-tight text-center px-1 truncate w-full text-center">
                  {photo.caption}
                </span>
              </div>

              {/* Remove button */}
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 z-10"
                title="Remove photo"
              >
                <X className="w-3 h-3" />
              </button>

              {/* Hero badge */}
              {index === 0 && (
                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-primary text-primary-foreground">
                  Cover
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true) }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDropzoneDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all",
          isDraggingOver
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
            isDraggingOver ? "bg-primary text-primary-foreground" : "bg-muted"
          )}>
            {isDraggingOver ? <Upload className="w-5 h-5" /> : <ImagePlus className="w-5 h-5 text-muted-foreground" />}
          </div>
          <div>
            <p className="text-sm font-medium">
              {isDraggingOver ? "Drop to add photos" : "Add Photos"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click or drag & drop images here
            </p>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {photos.length === 0 && (
        <p className="text-xs text-muted-foreground text-center">
          No photos yet. Add some to showcase your business.
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        Drag thumbnails to reorder. The first photo is used as the cover image.
      </p>
    </div>
  )
}
