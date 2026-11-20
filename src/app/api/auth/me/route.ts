import { NextRequest, NextResponse } from "next/server";
import { getServerSession, getUserById } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sessionId = req.cookies.get("veylo_session")?.value;

  if (!sessionId) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const session = getServerSession(sessionId);
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const user = getUserById(session.userId);
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user,
    session: {
      sessionId: session.sessionId,
      role: session.role,
      expiresAt: session.expiresAt,
    },
  });
}
