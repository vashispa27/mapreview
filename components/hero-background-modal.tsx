"use client"

import { useRef, useState, useCallback } from "react"
import { SitePhoto } from "@/lib/mock-data"
import { ImagePlus, Images, X, Loader2 } from "lucide-react"
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

interface HeroBackgroundModalProps {
  currentHero: string
  photos?: SitePhoto[]
  availablePhotos?: SitePhoto[]
  onChange: (url: string) => void
}

export function HeroBackgroundModal({
  currentHero,
  photos = [],
  availablePhotos = [],
  onChange,
}: HeroBackgroundModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [open, setOpen] = useState(false)

  // Combine both pools of photos so they have access to all scraped resources!
  const combinedPool = [...photos, ...availablePhotos].filter((v,i,a)=>a.findIndex(v2=>(v2.url===v.url))===i)

  const handleSelect = (url: string) => {
    onChange(url)
    setOpen(false)
  }

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    setIsUploading(true)
    try {
      const results = await Promise.all(
        files
          .filter((f) => f.type.startsWith("image/"))
          .map(async (file) => {
            const { blob } = await compressImageToBlob(file, 1920, 1080, 0.85)
            const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
              method: "POST",
              body: blob
            })
            if (!res.ok) throw new Error("Upload failed")
            const data = await res.json()
            return data.url
          })
      )
      return results
    } catch (err) {
      console.error("Upload failed:", err)
      return []
    } finally {
      setIsUploading(false)
    }
  }

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return
      const uploadedUrls = await uploadFiles(Array.from(files))
      if (uploadedUrls.length > 0) {
        handleSelect(uploadedUrls[0])
      }
    },
    [handleSelect]
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
        <Button variant="outline" size="sm" className="gap-2 backdrop-blur-md bg-white/20 text-white border-white/50 hover:bg-white/40">
          <Images className="w-4 h-4" />
          Change Background
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg w-[95vw] overflow-hidden">
        <DialogHeader className="min-w-0">
          <DialogTitle>Hero Background</DialogTitle>
          <DialogDescription>
            Select a new main background image from your scraped business photos or upload a local file.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4 w-full min-w-0 overflow-hidden">
          {/* Available Photo Pool */}
          {combinedPool && combinedPool.length > 0 && (
            <div className="space-y-3 w-full">
              <h3 className="font-semibold text-sm text-foreground/80">Available Scraped Photos</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted w-full">
                {combinedPool.map((photo, i) => {
                  return (
                    <div key={i} className="relative group w-32 h-24 shrink-0 rounded-md overflow-hidden border">
                      <img src={photo.url} alt="Scraped" className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleSelect(photo.url)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-[2px] font-medium text-sm"
                      >
                        Set as Background
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
                  <p className="font-medium">Upload Local Photo</p>
                  <p className="text-xs text-muted-foreground">Drag and drop or click</p>
                </>
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
