import { NextRequest, NextResponse } from "next/server";
import { getUserById, saveQuoteRecord } from "@/lib/db";
import { getOpenPaymentsConfigStatus } from "@/lib/open-payments/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      senderId,
      destinationAddress,
      sourceAmountNgn,
      targetCurrency = "NGN",
    } = body;

    if (!sourceAmountNgn || typeof sourceAmountNgn !== "number" || sourceAmountNgn <= 0) {
      return NextResponse.json(
        { error: "A positive source amount is required." },
        { status: 400 }
      );
    }

    const sender = senderId ? getUserById(senderId) : null;
    const senderWallet = sender?.openPaymentsAddress || "https://ilp.interledger-test.dev/tomiade";

    // FX rates for demonstration corridors
    let exchangeRate = 1.0;
    if (targetCurrency === "GBP") exchangeRate = 2040.0;
    if (targetCurrency === "EUR") exchangeRate = 1885.0;
    if (targetCurrency === "USD") exchangeRate = 1650.0;

    const destinationAmount =
      targetCurrency === "NGN"
        ? sourceAmountNgn
        : Number((sourceAmountNgn / exchangeRate).toFixed(2));

    const veyloFeeNgn = Number((sourceAmountNgn * 0.02).toFixed(2)); // 2.0%
    const totalDebitNgn = sourceAmountNgn + veyloFeeNgn;

    const opConfig = getOpenPaymentsConfigStatus();
    const quoteId = `quote_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 60 * 1000).toISOString(); // 60 seconds

    const quoteRecord = {
      id: quoteId,
      senderWalletAddress: senderWallet,
      receiverWalletAddress: destinationAddress || "https://ilp.interledger-test.dev/recipient",
      sourceAmountMinor: Math.round(sourceAmountNgn * 100).toString(),
      destinationAmountMinor: Math.round(destinationAmount * 100).toString(),
      sourceAssetCode: "NGN",
      sourceAssetScale: 2,
      destinationAssetCode: targetCurrency,
      destinationAssetScale: 2,
      exchangeRate,
      veyloFeeMinor: Math.round(veyloFeeNgn * 100).toString(),
      networkFeeMinor: "0",
      createdAt: new Date().toISOString(),
      expiresAt,
      isSimulated: !opConfig.isConfigured,
    };

    saveQuoteRecord(quoteRecord);

    return NextResponse.json({
      quoteId,
      sourceAmountNgn,
      destinationAmount,
      targetCurrency,
      exchangeRate,
      veyloFeeNgn,
      totalDebitNgn,
      networkFeeNgn: 0,
      expiresAt,
      expiresInSeconds: 60,
      isSimulated: !opConfig.isConfigured,
      settlementPath: opConfig.isConfigured
        ? "Open Payments Testnet Direct Settlement"
        : "Isolated Demo Mode (Simulated)",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: `Quote creation failed: ${message}` }, { status: 500 });
  }
}
