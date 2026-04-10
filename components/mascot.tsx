"use client"

import { motion } from "framer-motion"

export function Mascot({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        viewBox="0 0 120 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Body */}
        <motion.ellipse
          cx="60"
          cy="85"
          rx="45"
          ry="50"
          fill="url(#bodyGradient)"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Belly */}
        <ellipse cx="60" cy="95" rx="30" ry="35" fill="#F5F5DC" />
        
        {/* Left ear */}
        <motion.path
          d="M25 45 Q15 10 35 30 Q40 40 35 50 Z"
          fill="url(#bodyGradient)"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: "30px 45px" }}
        />
        <path d="M28 42 Q22 20 36 34" fill="#FFB6C1" />
        
        {/* Right ear */}
        <motion.path
          d="M95 45 Q105 10 85 30 Q80 40 85 50 Z"
          fill="url(#bodyGradient)"
          animate={{ rotate: [5, -5, 5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: "90px 45px" }}
        />
        <path d="M92 42 Q98 20 84 34" fill="#FFB6C1" />
        
        {/* Face */}
        <ellipse cx="60" cy="60" rx="35" ry="30" fill="url(#bodyGradient)" />
        
        {/* Left eye */}
        <motion.g
          animate={{ scaleY: [1, 0.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          style={{ transformOrigin: "45px 55px" }}
        >
          <ellipse cx="45" cy="55" rx="8" ry="10" fill="white" />
          <motion.circle
            cx="47"
            cy="56"
            r="5"
            fill="#2D1B0E"
            animate={{ x: [-1, 1, -1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <circle cx="49" cy="54" r="2" fill="white" />
        </motion.g>
        
        {/* Right eye */}
        <motion.g
          animate={{ scaleY: [1, 0.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          style={{ transformOrigin: "75px 55px" }}
        >
          <ellipse cx="75" cy="55" rx="8" ry="10" fill="white" />
          <motion.circle
            cx="77"
            cy="56"
            r="5"
            fill="#2D1B0E"
            animate={{ x: [-1, 1, -1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <circle cx="79" cy="54" r="2" fill="white" />
        </motion.g>
        
        {/* Nose */}
        <ellipse cx="60" cy="68" rx="4" ry="3" fill="#2D1B0E" />
        
        {/* Mouth */}
        <motion.path
          d="M52 75 Q60 82 68 75"
          stroke="#2D1B0E"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          animate={{ d: ["M52 75 Q60 82 68 75", "M52 76 Q60 84 68 76", "M52 75 Q60 82 68 75"] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Cheeks */}
        <ellipse cx="32" cy="65" rx="6" ry="4" fill="#FFB6C1" opacity="0.6" />
        <ellipse cx="88" cy="65" rx="6" ry="4" fill="#FFB6C1" opacity="0.6" />
        
        {/* Map pin on head */}
        <motion.g
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <path
            d="M60 15 C60 15 50 25 50 32 C50 38 54 42 60 42 C66 42 70 38 70 32 C70 25 60 15 60 15 Z"
            fill="#22C55E"
          />
          <circle cx="60" cy="30" r="5" fill="white" />
        </motion.g>
        
        {/* Left arm waving */}
        <motion.path
          d="M18 90 Q5 85 8 70 Q10 65 15 68 Q18 75 20 85"
          fill="url(#bodyGradient)"
          animate={{ rotate: [-10, 20, -10] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{ transformOrigin: "18px 90px" }}
        />
        
        {/* Right arm */}
        <path
          d="M102 90 Q115 95 112 105 Q110 110 105 107 Q102 100 100 92"
          fill="url(#bodyGradient)"
        />
        
        {/* Left foot */}
        <ellipse cx="40" cy="132" rx="12" ry="6" fill="url(#bodyGradient)" />
        
        {/* Right foot */}
        <ellipse cx="80" cy="132" rx="12" ry="6" fill="url(#bodyGradient)" />
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#16A34A" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  )
}

export function MiniMascot({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`${className}`}
      animate={{
        y: [0, -5, 0],
        rotate: [-5, 5, -5],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <ellipse cx="30" cy="42" rx="22" ry="25" fill="#22C55E" />
        <ellipse cx="30" cy="47" rx="15" ry="17" fill="#F5F5DC" />
        <ellipse cx="30" cy="30" rx="17" ry="15" fill="#22C55E" />
        <circle cx="23" cy="28" r="4" fill="white" />
        <circle cx="24" cy="29" r="2" fill="#2D1B0E" />
        <circle cx="37" cy="28" r="4" fill="white" />
        <circle cx="38" cy="29" r="2" fill="#2D1B0E" />
        <ellipse cx="30" cy="34" rx="2" ry="1.5" fill="#2D1B0E" />
        <path d="M26 38 Q30 42 34 38" stroke="#2D1B0E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M30 8 C30 8 23 15 23 20 C23 24 26 27 30 27 C34 27 37 24 37 20 C37 15 30 8 30 8 Z" fill="#22C55E" />
        <circle cx="30" cy="18" r="3" fill="white" />
      </svg>
    </motion.div>
  )
}
