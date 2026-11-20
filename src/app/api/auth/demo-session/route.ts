import { NextRequest, NextResponse } from "next/server";
import { getUserById, createServerSession } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required." }, { status: 400 });
    }

    const user = getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "Demo account not found." }, { status: 404 });
    }

    const session = createServerSession(user.id);

    const response = NextResponse.json({
      success: true,
      user,
      session: {
        sessionId: session.sessionId,
        role: session.role,
        expiresAt: session.expiresAt,
      },
    });

    // Set HttpOnly, Secure cookie
    response.cookies.set("veylo_session", session.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: `Session creation failed: ${message}` }, { status: 500 });
  }
}
