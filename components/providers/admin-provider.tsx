"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface AdminModeContextType {
  isAdminMode: boolean
  setAdminMode: (value: boolean) => void
}

const AdminModeContext = createContext<AdminModeContextType>({
  isAdminMode: false,
  setAdminMode: () => {},
})

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdminMode, setAdminMode] = useState(false)

  return (
    <AdminModeContext.Provider value={{ isAdminMode, setAdminMode }}>
      {children}
    </AdminModeContext.Provider>
  )
}

export function useAdminMode() {
  const context = useContext(AdminModeContext)
  if (!context) {
    throw new Error("useAdminMode must be used within an AdminProvider")
  }
  return context
}
