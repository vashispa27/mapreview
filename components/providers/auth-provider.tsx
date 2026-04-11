"use client"

import { SessionProvider } from "next-auth/react"
import { createContext, useContext, ReactNode } from "react"

// Check if auth is configured by checking for the auth secret
const isAuthConfigured = typeof window === "undefined" 
  ? !!process.env.AUTH_SECRET 
  : true // On client, we let SessionProvider handle it

// Mock session context for when auth is not configured
const MockSessionContext = createContext<{
  data: null
  status: "unauthenticated"
}>({
  data: null,
  status: "unauthenticated",
})

export function useMockSession() {
  return useContext(MockSessionContext)
}

function MockSessionProvider({ children }: { children: ReactNode }) {
  return (
    <MockSessionContext.Provider value={{ data: null, status: "unauthenticated" }}>
      {children}
    </MockSessionContext.Provider>
  )
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Always use SessionProvider but with refetchInterval disabled when auth might not be configured
  // This prevents constant refetch errors while still allowing auth to work when configured
  return (
    <SessionProvider 
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  )
}
