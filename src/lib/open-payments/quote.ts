import { getAuthenticatedClient } from "./client";
import { isFinalizedGrantWithAccessToken } from "@interledger/open-payments";

export interface CreateQuoteParams {
  senderWalletAddress: string;
  receiverIncomingPaymentUrl: string;
}

export interface OpenPaymentsQuoteResult {
  id: string;
  walletAddressId: string;
  receiver: string;
  debitAmount: {
    value: string;
    assetCode: string;
    assetScale: number;
  };
  receiveAmount: {
    value: string;
    assetCode: string;
    assetScale: number;
  };
  expiresAt: string;
  isExpired: boolean;
}

/**
 * Creates an Open Payments quote on the sender's wallet address for a receiver's incoming payment.
 */
export async function createOpenPaymentsQuote(
  params: CreateQuoteParams
): Promise<OpenPaymentsQuoteResult> {
  const client = await getAuthenticatedClient();

  // 1. Get sender wallet address metadata
  const senderWallet = await client.walletAddress.get({
    url: params.senderWalletAddress,
  });

  // 2. Request a quote grant from sender's authServer
  const grant = await client.grant.request(
    {
      url: senderWallet.authServer,
    },
    {
      access_token: {
        access: [
          {
            type: "quote",
            actions: ["create", "read"],
          },
        ],
      },
    }
  );

  if (!isFinalizedGrantWithAccessToken(grant)) {
    throw new Error("Failed to obtain finalized access token for quote grant.");
  }

  // 3. Create quote on sender's resource server
  const quote = await client.quote.create(
    {
      url: new URL(senderWallet.resourceServer).origin,
      accessToken: grant.access_token.value,
    },
    {
      method: "ilp",
      walletAddress: senderWallet.id,
      receiver: params.receiverIncomingPaymentUrl,
    }
  );

  const expiresAt = quote.expiresAt || new Date(Date.now() + 60 * 1000).toISOString();
  const isExpired = new Date(expiresAt).getTime() <= Date.now();

  return {
    id: quote.id,
    walletAddressId: quote.walletAddress,
    receiver: quote.receiver,
    debitAmount: quote.debitAmount,
    receiveAmount: quote.receiveAmount,
    expiresAt,
    isExpired,
  };
}
