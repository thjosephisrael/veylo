import { NextRequest, NextResponse } from "next/server";
import { createUser, createServerSession } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, role = "consumer", handle, currency, location } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Legal full name or business name is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const newUser = createUser({
      name: name.trim(),
      email: email.trim(),
      role: role === "business" ? "business" : "consumer",
      handle,
      currency,
      location,
    });

    const session = createServerSession(newUser.id);

    const response = NextResponse.json({
      success: true,
      user: newUser,
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
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Registration failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
