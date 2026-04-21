"use client"

import { useRef, useState, useCallback } from "react"
import { SitePhoto } from "@/lib/mock-data"
import { ImagePlus, Plus, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { compressImageToBlob } from "@/lib/compress-image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface PhotoManagerModalProps {
  photos: SitePhoto[]
  availablePhotos?: SitePhoto[]
  onChange: (photos: SitePhoto[]) => void
}

export function PhotoManagerModal({
  photos,
  availablePhotos = [],
  onChange,
}: PhotoManagerModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleAddFromPool = (photo: SitePhoto) => {
    if (!photos.some((p) => p.url === photo.url)) {
      onChange([photo, ...photos])
    }
    setOpen(false)
  }

  const uploadFile = async (file: File): Promise<SitePhoto> => {
    // 1. Compress
    const { blob } = await compressImageToBlob(file, 1200, 1200, 0.82)
    
    // 2. Upload to our API
    const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
      method: "POST",
      body: blob,
    })

    if (!response.ok) throw new Error("Upload failed")
    
    const data = await response.json()
    return {
      url: data.url,
      caption: file.name.replace(/\.[^.]+$/, ""),
    }
  }

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return
      setIsUploading(true)
      try {
        const fileArray = Array.from(files).filter(f => f.type.startsWith("image/"))
        const newPhotos = await Promise.all(fileArray.map(uploadFile))
        onChange([...newPhotos, ...photos])
        setOpen(false)
      } catch (err) {
        console.error("Upload failed:", err)
      } finally {
        setIsUploading(false)
      }
    },
    [photos, onChange]
  )

  const handleDropzoneDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingOver(false)
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ImagePlus className="w-4 h-4" />
          Manage Photos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg w-[95vw] overflow-hidden">
        <DialogHeader className="min-w-0">
          <DialogTitle>Add Photos</DialogTitle>
          <DialogDescription>
            Select from Google Maps images or upload your own local files.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4 w-full min-w-0 overflow-hidden">
          {/* Available Photo Pool */}
          {availablePhotos && availablePhotos.length > 0 && (
            <div className="space-y-3 w-full">
              <h3 className="font-semibold text-sm text-foreground/80">Available Scraped Photos</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted w-full">
                {availablePhotos.map((photo, i) => {
                  const isAdded = photos.some((p) => p.url === photo.url)
                  if (isAdded) return null;
                  return (
                    <div key={i} className="relative group w-24 h-24 shrink-0 rounded-md overflow-hidden border">
                      <img src={photo.url} alt="Scraped" className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleAddFromPool(photo)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-[2px]"
                      >
                        <Plus className="w-6 h-6" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Upload Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true) }}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={handleDropzoneDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-xl p-6 text-center transition-all w-full",
              isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary/50 hover:bg-muted/50",
              isDraggingOver ? "border-primary bg-primary/5 scale-[1.02]" : "border-border"
            )}
          >
            <div className="flex flex-col items-center gap-2">
              {isUploading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <p className="font-medium">Uploading...</p>
                  <p className="text-xs text-muted-foreground">Please wait</p>
                </>
              ) : (
                <>
                  <ImagePlus className="w-6 h-6 text-muted-foreground" />
                  <p className="font-medium">Upload Local Photos</p>
                  <p className="text-xs text-muted-foreground">Drag and drop or click</p>
                </>
              )}
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
