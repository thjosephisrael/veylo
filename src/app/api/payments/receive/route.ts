import { NextRequest, NextResponse } from "next/server";
import {
  getUserById,
  updateUserBalance,
  createTransactionRecord,
} from "@/lib/db";
import { Transaction } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      amount,
      senderName = "Open Payments Interledger Testnet",
      senderIdentifier = "https://ilp.interledger-test.dev/sender",
      description = "Inbound Open Payments Settlement",
    } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required." }, { status: 400 });
    }

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "A positive incoming amount is required." },
        { status: 400 }
      );
    }

    const user = getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Credit user's balance in server DB
    const updateResult = updateUserBalance(user.id, 0, amount);
    if (!updateResult.success) {
      return NextResponse.json(
        { error: updateResult.error || "Failed to credit account." },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const reference = `VYL-REC-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const incomingTransaction: Transaction = {
      id: `tx_in_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`,
      userId: user.id,
      title: `Received from ${senderName}`,
      destinationType: "veylo",
      recipientName: user.name,
      recipientIdentifier: user.veyloAccountNumber,
      destinationBankOrProvider: "Interledger Peer Connector",
      sourceFunding: senderIdentifier,
      amountNgn: amount,
      destinationAmount: amount,
      destinationCurrency: "NGN",
      feeNgn: 0,
      status: "settled",
      timestamp,
      reference,
      category: "deposit",
    };

    createTransactionRecord(incomingTransaction);

    return NextResponse.json({
      success: true,
      transaction: incomingTransaction,
      newBalance: updateResult.newBalance,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json(
      { error: `Receive payment failed: ${message}` },
      { status: 500 }
    );
  }
}
