import { NextResponse } from "next/server";
import { getAllUsers } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const users = getAllUsers();
  return NextResponse.json({ users });
}
