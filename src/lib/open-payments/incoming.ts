import { getAuthenticatedClient } from "./client";
import { isFinalizedGrantWithAccessToken } from "@interledger/open-payments";

export interface CreateIncomingPaymentParams {
  receiverWalletAddress: string;
  amountMinor: string;
  assetCode: string;
  assetScale: number;
  description?: string;
  expiresInSeconds?: number;
}

export interface CreatedIncomingPayment {
  id: string;
  walletAddress: string;
  incomingAmount?: {
    value: string;
    assetCode: string;
    assetScale: number;
  };
  receivedAmount: {
    value: string;
    assetCode: string;
    assetScale: number;
  };
  completed: boolean;
  expiresAt?: string;
}

/**
 * Creates an incoming payment resource on the receiver's wallet.
 */
export async function createIncomingPayment(
  params: CreateIncomingPaymentParams
): Promise<CreatedIncomingPayment> {
  const client = await getAuthenticatedClient();

  // 1. Get receiver wallet address metadata to identify its authServer and resourceServer
  const walletAddress = await client.walletAddress.get({
    url: params.receiverWalletAddress,
  });

  // 2. Request an incoming payment grant from receiver's authServer
  const grant = await client.grant.request(
    {
      url: walletAddress.authServer,
    },
    {
      access_token: {
        access: [
          {
            type: "incoming-payment",
            actions: ["read", "create", "complete"],
            identifier: walletAddress.id,
          },
        ],
      },
    }
  );

  if (!isFinalizedGrantWithAccessToken(grant)) {
    throw new Error("Failed to obtain finalized access token for incoming payment grant.");
  }

  const expiresAt = params.expiresInSeconds
    ? new Date(Date.now() + params.expiresInSeconds * 1000).toISOString()
    : new Date(Date.now() + 10 * 60 * 1000).toISOString();

  // 3. Create incoming payment resource
  const incomingPayment = await client.incomingPayment.create(
    {
      url: new URL(walletAddress.resourceServer).origin,
      accessToken: grant.access_token.value,
    },
    {
      walletAddress: walletAddress.id,
      incomingAmount: {
        value: params.amountMinor,
        assetCode: params.assetCode,
        assetScale: params.assetScale,
      },
      expiresAt,
      metadata: {
        description: params.description || "Veylo Open Payments Transfer",
      },
    }
  );

  return {
    id: incomingPayment.id,
    walletAddress: incomingPayment.walletAddress,
    incomingAmount: incomingPayment.incomingAmount,
    receivedAmount: incomingPayment.receivedAmount,
    completed: incomingPayment.completed,
    expiresAt: incomingPayment.expiresAt,
  };
}
