import { NextRequest, NextResponse } from "next/server";
import { getUserByVeyloNumberOrHandle } from "@/lib/db";
import { resolveOpenPaymentsWalletAddress } from "@/lib/open-payments/wallet";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address } = body;

    if (!address || typeof address !== "string") {
      return NextResponse.json(
        { error: "Address or identifier is required." },
        { status: 400 }
      );
    }

    const trimmed = address.trim();

    // 1. Check Veylo Internal Directory first
    const directoryUser = getUserByVeyloNumberOrHandle(trimmed);
    if (directoryUser) {
      return NextResponse.json({
        resolved: true,
        source: "veylo_directory",
        isVeyloDirectory: true,
        isLiveTestnet: false, // Internal directory match
        recipient: {
          id: directoryUser.id,
          name: directoryUser.name,
          handle: directoryUser.handle,
          veyloAccountNumber: directoryUser.veyloAccountNumber,
          openPaymentsAddress: directoryUser.openPaymentsAddress,
          currency: directoryUser.currency,
          assetScale: 2,
          avatarUrl: directoryUser.avatarUrl,
        },
      });
    }

    // 2. Query Open Payments Network with SSRF protection
    const allowHttp = process.env.NODE_ENV === "development";
    const result = await resolveOpenPaymentsWalletAddress(trimmed, allowHttp);

    if (!result.resolved || !result.wallet) {
      return NextResponse.json(
        {
          resolved: false,
          error:
            result.error ||
            "Wallet address could not be resolved on the Open Payments network.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      resolved: true,
      source: "open_payments_testnet",
      isVeyloDirectory: false,
      isLiveTestnet: true,
      recipient: {
        id: result.wallet.id,
        name: result.wallet.publicName,
        openPaymentsAddress: result.wallet.id,
        currency: result.wallet.assetCode,
        assetScale: result.wallet.assetScale,
        authServer: result.wallet.authServer,
        resourceServer: result.wallet.resourceServer,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json(
      { error: `Wallet resolution failed: ${message}` },
      { status: 500 }
    );
  }
}
