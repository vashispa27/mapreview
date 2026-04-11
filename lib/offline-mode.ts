// Offline mode configuration
// Set NEXT_PUBLIC_OFFLINE_MODE=true in .env.local to enable offline mode

export const isOfflineMode = process.env.NEXT_PUBLIC_OFFLINE_MODE === "true"

// Mock user for offline mode
export const mockUser = {
  id: "offline-user-123",
  name: "Offline User",
  email: "offline@example.com",
  image: "https://i.pravatar.cc/100?u=offline-user",
}

// Mock session for offline mode
export const mockSession = {
  user: mockUser,
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
}
