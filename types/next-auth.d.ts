import NextAuth, { DefaultSession } from "next-auth"

// Extend the built-in session types to include user.id
declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}
