import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename") || "file"

    if (!request.body) {
      return NextResponse.json({ error: "No body" }, { status: 400 })
    }

    const blob = await put(filename, request.body, {
      access: "public",
    })

    return NextResponse.json(blob)
  } catch (error) {
    console.error("Upload Error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
