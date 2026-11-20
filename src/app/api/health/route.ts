import { NextResponse } from "next/server";
import { getOpenPaymentsConfigStatus } from "@/lib/open-payments/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const opStatus = getOpenPaymentsConfigStatus();

  return NextResponse.json({
    name: "Veylo Open Payments Gateway",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    openPayments: {
      isConfigured: opStatus.isConfigured,
      walletAddress: opStatus.walletAddress || null,
      keyId: opStatus.keyId || null,
      missingVariables: opStatus.missingVariables,
      mode: opStatus.isConfigured ? "live_testnet" : "demo_simulated",
      statusMessage: opStatus.isConfigured
        ? "Connected to configured Open Payments wallet."
        : "Running in isolated demo mode. Open Payments testnet credentials required for live network signing.",
    },
  });
}
