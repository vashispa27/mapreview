"use client"

import { useState, useRef } from "react"
import { BusinessData, ProductItem, ColorScheme } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { ShoppingBag, Plus, ImagePlus, Check, X, Trash2 } from "lucide-react"

interface ProductsPageProps {
  business: BusinessData
  colorScheme: ColorScheme
  fontClass: string
  cartItems: { product: ProductItem; qty: number }[]
  onAddToCart: (product: ProductItem) => void
  onBusinessChange?: (b: BusinessData) => void
}

function nanoid() { return Math.random().toString(36).slice(2, 10) }

const EMPTY: Omit<ProductItem, "id"> = { title: "", price: "", description: "", image: undefined }

export function ProductsPage({ business, colorScheme, fontClass, cartItems, onAddToCart, onBusinessChange }: ProductsPageProps) {
  const products = business.products ?? []
  const getQty = (id: string) => cartItems.find((c) => c.product.id === id)?.qty ?? 0

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
    const newProduct: ProductItem = { id: nanoid(), ...form }
    onBusinessChange({ ...business, products: [...products, newProduct] })
    setForm({ ...EMPTY })
    setAdding(false)
  }

  const handleCancel = () => {
    setForm({ ...EMPTY })
    setAdding(false)
  }

  const handleDelete = (id: string) => {
    if (!onBusinessChange) return
    onBusinessChange({ ...business, products: products.filter((p) => p.id !== id) })
  }

  return (
    <div className={cn("min-h-screen py-16 pb-28", fontClass)} style={{ backgroundColor: colorScheme.background, color: colorScheme.text }}>
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-4" style={{ backgroundColor: colorScheme.primary + "18", color: colorScheme.primary }}>
            Shop
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: colorScheme.muted }}>
            Quality products, delivered to you.
          </p>
        </div>

        {products.length === 0 && !adding ? (
          <div className="text-center py-24" style={{ color: colorScheme.muted }}>
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No products listed yet.</p>
            {onBusinessChange && (
              <button
                onClick={() => setAdding(true)}
                className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: colorScheme.primary }}
              >
                + Add your first product
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const qty = getQty(product.id)
              return (
                <div
                  key={product.id}
                  className="rounded-2xl border overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300 relative"
                  style={{ borderColor: colorScheme.primary + "20", backgroundColor: colorScheme.background }}
                >
                  {/* Delete button — preview only */}
                  {onBusinessChange && (
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-red-500 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-white" />
                    </button>
                  )}
                  {/* Image */}
                  <div className="h-80 overflow-hidden flex items-center justify-center" style={{ backgroundColor: colorScheme.primary + "06" }}>
                    {product.image ? (
                      <img src={product.image} alt={product.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <ShoppingBag className="w-16 h-16" style={{ color: colorScheme.primary + "40" }} />
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-base mb-1 leading-snug">{product.title}</h3>
                    {product.description && (
                      <p className="text-xs mb-3 leading-relaxed line-clamp-2" style={{ color: colorScheme.muted }}>{product.description}</p>
                    )}
                    <div className="mt-auto">
                      <p className="text-xl font-bold mb-3" style={{ color: colorScheme.primary }}>{product.price}</p>
                      <button
                        onClick={() => onAddToCart(product)}
                        className={cn(
                          "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95",
                          qty > 0 ? "text-white" : "border-2"
                        )}
                        style={qty > 0
                          ? { backgroundColor: colorScheme.primary }
                          : { borderColor: colorScheme.primary, color: colorScheme.primary, backgroundColor: "transparent" }
                        }
                      >
                        {qty > 0 ? (
                          <><span>In Cart ({qty})</span><Plus className="w-4 h-4" /></>
                        ) : (
                          <><ShoppingBag className="w-4 h-4" /><span>Add to Cart</span></>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Add form card */}
            {adding && onBusinessChange && (
              <div className="rounded-2xl border-2 overflow-hidden flex flex-col" style={{ borderColor: colorScheme.primary + "40", backgroundColor: colorScheme.background }}>
                {/* Image picker */}
                <button
                  onClick={() => fileRef.current?.click()}
                  className="h-80 flex flex-col items-center justify-center gap-2 transition hover:opacity-80"
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

                <div className="p-4 flex flex-col gap-2.5 flex-1">
                  <input
                    autoFocus
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder="Product name *"
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none transition"
                    style={{ borderColor: colorScheme.primary + "30", backgroundColor: colorScheme.background, color: colorScheme.text }}
                  />
                  <input
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                    placeholder="Price (e.g. $29.99)"
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none transition"
                    style={{ borderColor: colorScheme.primary + "30", backgroundColor: colorScheme.background, color: colorScheme.text }}
                  />
                  <textarea
                    rows={2}
                    value={form.description ?? ""}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="Description (optional)"
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

            {/* Add Product card (trigger) */}
            {!adding && onBusinessChange && (
              <button
                onClick={() => setAdding(true)}
                className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 min-h-[420px] transition-all hover:scale-[1.02]"
                style={{ borderColor: colorScheme.primary + "35", color: colorScheme.primary, backgroundColor: colorScheme.primary + "05" }}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: colorScheme.primary + "15" }}>
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold">Add Product</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
