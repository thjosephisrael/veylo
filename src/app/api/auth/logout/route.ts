import { NextRequest, NextResponse } from "next/server";
import { deleteServerSession } from "@/lib/db";

export async function POST(req: NextRequest) {
  const sessionId = req.cookies.get("veylo_session")?.value;

  if (sessionId) {
    deleteServerSession(sessionId);
  }

  const response = NextResponse.json({ success: true, message: "Logged out successfully." });

  // Clear cookie
  response.cookies.set("veylo_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
