"use client"

import { ProductItem, ColorScheme } from "@/lib/mock-data"
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export interface CartItem {
  product: ProductItem
  qty: number
}

interface CartDrawerProps {
  open: boolean
  items: CartItem[]
  colorScheme: ColorScheme
  onClose: () => void
  onUpdateQty: (productId: string, qty: number) => void
  onCheckout: () => void
}

function parsePrice(str: string): number {
  const n = parseFloat(str.replace(/[^0-9.]/g, ""))
  return isNaN(n) ? 0 : n
}

export function CartDrawer({ open, items, colorScheme, onClose, onUpdateQty, onCheckout }: CartDrawerProps) {
  const total = items.reduce((sum, c) => sum + parsePrice(c.product.price) * c.qty, 0)
  const currency = items[0]?.product.price.replace(/[0-9.,]/g, "").trim() || "$"

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm z-[70] flex flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" style={{ color: colorScheme.primary }} />
                <span className="font-bold text-lg">Your Cart</span>
                <span className="text-sm font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: colorScheme.primary + "15", color: colorScheme.primary }}>
                  {items.reduce((s, c) => s + c.qty, 0)}
                </span>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">Your cart is empty</p>
                </div>
              ) : items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  {item.product.image ? (
                    <img src={item.product.image} alt={item.product.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-gray-100" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center border border-gray-100" style={{ backgroundColor: colorScheme.primary + "10" }}>
                      <ShoppingBag className="w-6 h-6" style={{ color: colorScheme.primary + "60" }} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{item.product.title}</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: colorScheme.primary }}>{item.product.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => onUpdateQty(item.product.id, item.qty - 1)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-50 transition">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                      <button onClick={() => onUpdateQty(item.product.id, item.qty + 1)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-50 transition">
                        <Plus className="w-3 h-3" />
                      </button>
                      <button onClick={() => onUpdateQty(item.product.id, 0)} className="ml-auto text-gray-400 hover:text-red-500 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 py-5 border-t space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Subtotal</span>
                  <span className="font-bold text-lg">{currency}{total.toFixed(2)}</span>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-sm hover:opacity-90 active:scale-95 transition-all"
                  style={{ backgroundColor: colorScheme.primary }}
                >
                  Request Order →
                </button>
                <p className="text-center text-xs text-gray-400">We'll contact you to confirm your order</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
