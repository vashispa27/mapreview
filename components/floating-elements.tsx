"use client"

import { motion } from "framer-motion"

const floatingItems = [
  { icon: "⭐", size: 32, x: "10%", y: "20%", delay: 0 },
  { icon: "📍", size: 28, x: "85%", y: "15%", delay: 0.5 },
  { icon: "💬", size: 26, x: "5%", y: "60%", delay: 1 },
  { icon: "🏪", size: 30, x: "92%", y: "45%", delay: 1.5 },
  { icon: "📷", size: 24, x: "15%", y: "80%", delay: 2 },
  { icon: "✨", size: 22, x: "80%", y: "75%", delay: 2.5 },
  { icon: "🗺️", size: 28, x: "50%", y: "10%", delay: 0.3 },
  { icon: "⭐", size: 20, x: "70%", y: "85%", delay: 1.2 },
]

export function FloatingElements() {
  return (
    // Hidden on mobile — 11 infinite GPU animations destroy mobile perf
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 hidden lg:block">
      {floatingItems.map((item, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{ left: item.x, top: item.y, fontSize: item.size }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1], y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, delay: item.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          {item.icon}
        </motion.div>
      ))}

      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, rgba(34,197,94,0.4) 0%, transparent 70%)", left: "-10%", top: "20%" }}
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, rgba(251,146,60,0.3) 0%, transparent 70%)", right: "-5%", top: "50%" }}
        animate={{ scale: [1, 1.3, 1], y: [0, -40, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-72 h-72 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, rgba(34,197,94,0.3) 0%, transparent 70%)", right: "20%", bottom: "10%" }}
        animate={{ scale: [1, 1.1, 1], x: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}
