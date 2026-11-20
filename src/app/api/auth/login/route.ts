import { NextRequest, NextResponse } from "next/server";
import { getUserByVeyloNumberOrHandle, createServerSession } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier } = body;

    if (!identifier || typeof identifier !== "string" || !identifier.trim()) {
      return NextResponse.json(
        { error: "Please enter your Veylo ID, handle, or email." },
        { status: 400 }
      );
    }

    const user = getUserByVeyloNumberOrHandle(identifier.trim());

    // Fail closed: Never silently fall back to another user!
    if (!user) {
      return NextResponse.json(
        {
          error:
            "No account found matching this Veylo ID or email. Please check your credentials or explore the demo.",
        },
        { status: 401 }
      );
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

    response.cookies.set("veylo_session", session.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: `Login failed: ${message}` }, { status: 500 });
  }
}
