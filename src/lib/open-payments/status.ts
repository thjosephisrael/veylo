import { getAuthenticatedClient } from "./client";

export interface PaymentStatusReport {
  id: string;
  state: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  sentAmount?: {
    value: string;
    assetCode: string;
    assetScale: number;
  };
  receiveAmount?: {
    value: string;
    assetCode: string;
    assetScale: number;
  };
  failed: boolean;
  raw?: unknown;
}

/**
 * Retrieves the status of an Open Payments outgoing payment from its resource URL.
 */
export async function getOutgoingPaymentStatus(params: {
  outgoingPaymentUrl: string;
  accessToken: string;
}): Promise<PaymentStatusReport> {
  const client = await getAuthenticatedClient();

  const outgoingPayment = await client.outgoingPayment.get({
    url: params.outgoingPaymentUrl,
    accessToken: params.accessToken,
  });

  let state: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" = "PROCESSING";
  if (outgoingPayment.failed) {
    state = "FAILED";
  } else if (
    outgoingPayment.sentAmount &&
    outgoingPayment.receiveAmount &&
    outgoingPayment.sentAmount.value !== "0"
  ) {
    state = "COMPLETED";
  }

  return {
    id: outgoingPayment.id,
    state,
    sentAmount: outgoingPayment.sentAmount,
    receiveAmount: outgoingPayment.receiveAmount,
    failed: outgoingPayment.failed,
    raw: outgoingPayment,
  };
}
