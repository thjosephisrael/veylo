import { NextRequest, NextResponse } from "next/server";
import {
  getUserById,
  getUserByVeyloNumberOrHandle,
  updateUserBalance,
  createTransactionRecord,
  getTransactionsByUserId,
  getQuoteRecord,
} from "@/lib/db";
import { Transaction } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId parameter is required." }, { status: 400 });
  }

  const transactions = getTransactionsByUserId(userId);
  return NextResponse.json({ transactions });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      senderId,
      quoteId,
      recipientIdentifier,
      amount,
      destinationType = "veylo",
      destinationCurrency = "NGN",
      reference = `TX-${Date.now().toString().slice(-8)}`,
    } = body;

    if (!senderId) {
      return NextResponse.json({ error: "senderId is required." }, { status: 400 });
    }

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "A positive payment amount is required." }, { status: 400 });
    }

    if (!recipientIdentifier) {
      return NextResponse.json({ error: "Recipient identifier is required." }, { status: 400 });
    }

    const sender = getUserById(senderId);
    if (!sender) {
      return NextResponse.json({ error: "Sender account not found." }, { status: 404 });
    }

    // 1. Verify Quote expiry if quoteId is provided
    if (quoteId) {
      const quote = getQuoteRecord(quoteId);
      if (quote) {
        if (new Date(quote.expiresAt).getTime() < Date.now()) {
          return NextResponse.json(
            { error: "Payment quote has expired. Please refresh the quote to proceed." },
            { status: 400 }
          );
        }
      }
    }

    // Calculate fees (2.0% Veylo fee)
    const feeNgn = Number((amount * 0.02).toFixed(2));
    const totalDebitNgn = amount + feeNgn;

    // 2. Validate sender balance
    if (sender.availableBalanceNgn < totalDebitNgn) {
      return NextResponse.json(
        {
          error: `Insufficient funds. Available: ₦${sender.availableBalanceNgn.toLocaleString()}, required: ₦${totalDebitNgn.toLocaleString()}`,
        },
        { status: 400 }
      );
    }

    // 3. Resolve recipient in Veylo directory if applicable
    const recipientUser = getUserByVeyloNumberOrHandle(recipientIdentifier);

    // 4. Update balances in server DB atomically
    const debitResult = updateUserBalance(sender.id, totalDebitNgn, 0);
    if (!debitResult.success) {
      return NextResponse.json({ error: debitResult.error || "Failed to debit sender account." }, { status: 400 });
    }

    if (recipientUser) {
      updateUserBalance(recipientUser.id, 0, amount);
    }

    const timestamp = new Date().toISOString();
    const recipientName = recipientUser ? recipientUser.name : recipientIdentifier;

    // 5. Create sender transaction record in DB
    const senderTransaction: Transaction = {
      id: `tx_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`,
      userId: sender.id,
      title: `Transfer to ${recipientName}`,
      destinationType,
      recipientName,
      recipientIdentifier,
      destinationBankOrProvider: recipientUser
        ? "Veylo Directory (Open Payments)"
        : destinationType === "nigerian_bank"
        ? "Commercial Bank Payout"
        : "International Open Payments Rail",
      sourceFunding: `${sender.connectedBank.bankName} • ${sender.connectedBank.accountNumber}`,
      amountNgn: -totalDebitNgn,
      destinationAmount: amount,
      destinationCurrency,
      feeNgn,
      status: "settled",
      timestamp,
      reference,
      category: "transfer",
    };

    createTransactionRecord(senderTransaction);

    // 6. If recipient is a registered Veylo user, create recipient credit transaction
    if (recipientUser) {
      const recipientTransaction: Transaction = {
        id: `tx_${Math.random().toString(36).substring(2, 10)}_${Date.now() + 1}`,
        userId: recipientUser.id,
        title: `Transfer from ${sender.name}`,
        destinationType: "veylo",
        recipientName: sender.name,
        recipientIdentifier: sender.veyloAccountNumber,
        destinationBankOrProvider: "Veylo Internal Directory",
        sourceFunding: "Veylo Direct Value Settlement",
        amountNgn: amount,
        destinationAmount: amount,
        destinationCurrency: "NGN",
        feeNgn: 0,
        status: "settled",
        timestamp,
        reference: `${reference}-IN`,
        category: "transfer",
      };

      createTransactionRecord(recipientTransaction);
    }

    return NextResponse.json({
      success: true,
      transaction: senderTransaction,
      newSenderBalance: debitResult.newBalance,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: `Payment failed: ${message}` }, { status: 500 });
  }
}
