import { getAuthenticatedClient } from "./client";
import { isPendingGrant, isFinalizedGrantWithAccessToken } from "@interledger/open-payments";

export interface InitiateOutgoingPaymentParams {
  senderWalletAddress: string;
  quoteId: string;
  debitAmount: {
    value: string;
    assetCode: string;
    assetScale: number;
  };
  clientRedirectUri?: string;
}

export interface OutgoingPaymentInitiationResult {
  requiresInteraction: boolean;
  redirectUrl?: string;
  interactRef?: string;
  continueUrl?: string;
  accessToken?: string;
  outgoingPaymentId?: string;
  state?: string;
}

/**
 * Requests an outgoing payment grant and either initiates interactive authorization
 * or creates the outgoing payment immediately if non-interactive token is granted.
 */
export async function initiateOutgoingPayment(
  params: InitiateOutgoingPaymentParams
): Promise<OutgoingPaymentInitiationResult> {
  const client = await getAuthenticatedClient();

  const senderWallet = await client.walletAddress.get({
    url: params.senderWalletAddress,
  });

  const redirectUri =
    params.clientRedirectUri || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/payments/callback`;

  // 1. Request outgoing-payment grant
  const grant = await client.grant.request(
    {
      url: senderWallet.authServer,
    },
    {
      access_token: {
        access: [
          {
            type: "outgoing-payment",
            actions: ["create", "read", "list"],
            identifier: senderWallet.id,
            limits: {
              debitAmount: params.debitAmount,
            },
          },
        ],
      },
      interact: {
        start: ["redirect"],
        finish: {
          method: "redirect",
          uri: redirectUri,
          nonce: Math.random().toString(36).substring(2, 15),
        },
      },
    }
  );

  // If interactive authorization is required:
  if (isPendingGrant(grant)) {
    return {
      requiresInteraction: true,
      redirectUrl: grant.interact.redirect,
      continueUrl: grant.continue.uri,
      interactRef: grant.interact.finish,
    };
  }

  // If non-interactive grant is issued directly:
  if (isFinalizedGrantWithAccessToken(grant)) {
    const outgoingPayment = await client.outgoingPayment.create(
      {
        url: new URL(senderWallet.resourceServer).origin,
        accessToken: grant.access_token.value,
      },
      {
        walletAddress: senderWallet.id,
        quoteId: params.quoteId,
      }
    );

    return {
      requiresInteraction: false,
      outgoingPaymentId: outgoingPayment.id,
      state: outgoingPayment.failed ? "FAILED" : "PROCESSING",
    };
  }

  throw new Error("Unexpected grant response state from Open Payments authorization server.");
}

/**
 * Continues an interactive grant after user authorization at the wallet consent screen.
 */
export async function continueOutgoingPaymentGrant(params: {
  continueUrl: string;
  continueToken: string;
  interactRef: string;
  senderWalletAddress: string;
  quoteId: string;
}) {
  const client = await getAuthenticatedClient();

  const continuation = await client.grant.continue(
    {
      url: params.continueUrl,
      accessToken: params.continueToken,
    },
    {
      interact_ref: params.interactRef,
    }
  );

  if (!isFinalizedGrantWithAccessToken(continuation)) {
    throw new Error("Grant continuation did not finalize with an access token.");
  }

  const senderWallet = await client.walletAddress.get({
    url: params.senderWalletAddress,
  });

  const outgoingPayment = await client.outgoingPayment.create(
    {
      url: new URL(senderWallet.resourceServer).origin,
      accessToken: continuation.access_token.value,
    },
    {
      walletAddress: senderWallet.id,
      quoteId: params.quoteId,
    }
  );

  return {
    outgoingPaymentId: outgoingPayment.id,
    state: outgoingPayment.failed ? "FAILED" : "COMPLETED",
    raw: outgoingPayment,
  };
}
