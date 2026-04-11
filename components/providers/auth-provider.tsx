"use client"

import { SessionProvider } from "next-auth/react"
import { createContext, useContext } from "react"
import { isOfflineMode, mockSession } from "@/lib/offline-mode"

// Create a context to expose offline mode status to components
const OfflineModeContext = createContext<boolean>(false)

export function useOfflineMode() {
  return useContext(OfflineModeContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // In offline mode, provide the mock session directly
  // This bypasses the need for actual NextAuth session
  if (isOfflineMode) {
    return (
      <OfflineModeContext.Provider value={true}>
        <SessionProvider session={mockSession as any}>
          {children}
        </SessionProvider>
      </OfflineModeContext.Provider>
    )
  }

  return (
    <OfflineModeContext.Provider value={false}>
      <SessionProvider>{children}</SessionProvider>
    </OfflineModeContext.Provider>
  )
}
