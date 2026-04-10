"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface InlineEditorProps {
  value: string
  onChange: (val: string) => void
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
  rows?: number
}

export function InlineTextArea({ value, onChange, disabled, className, style, rows = 4 }: InlineEditorProps) {
  const [localValue, setLocalValue] = useState(value)
  
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  if (disabled) {
    return <p className={className} style={style}>{value}</p>
  }

  return (
    <textarea
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={() => {
        if (localValue !== value) onChange(localValue)
      }}
      className={cn(
        "w-full bg-transparent resize-none outline-none border border-transparent hover:border-dashed hover:border-primary/50 focus:border-solid focus:border-primary transition-all rounded p-1 -ml-1", 
        className
      )}
      style={style}
      rows={rows}
    />
  )
}

export function InlineInput({ value, onChange, disabled, className, style }: InlineEditorProps) {
  const [localValue, setLocalValue] = useState(value)
  
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  if (disabled) {
    return <span className={className} style={style}>{value}</span>
  }

  return (
    <input
      type="text"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={() => {
        if (localValue !== value) onChange(localValue)
      }}
      className={cn(
        "w-full bg-transparent outline-none border-b border-transparent hover:border-dashed hover:border-primary/50 focus:border-solid focus:border-primary transition-all px-1 -ml-1", 
        className
      )}
      style={style}
    />
  )
}
