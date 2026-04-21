/**
 * Resizes and JPEG-compresses an image File on a canvas before it is stored.
 * Now supports returning a Blob for cloud uploads (Vercel Blob).
 */

export type CompressionResult = {
  dataUrl: string;
  blob: Blob;
};

export async function compressImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8
): Promise<string> {
  const result = await compressImageToBlob(file, maxWidth, maxHeight, quality);
  return result.dataUrl;
}

export async function compressImageToBlob(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      let { width, height } = img
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")
      if (!ctx) return reject(new Error("canvas context unavailable"))

      ctx.drawImage(img, 0, 0, width, height)
      
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("blob creation failed"));
        resolve({ dataUrl, blob });
      }, "image/jpeg", quality);
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error("image load failed"))
    }

    img.src = objectUrl
  })
}
