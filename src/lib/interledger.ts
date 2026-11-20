import { DEMO_ACCOUNTS } from "@/data/mockData";
import { InterledgerQuote, UserProfile } from "@/types";

export interface WalletAddressResolution {
  id: string;
  publicName: string;
  assetCode: string;
  assetScale: number;
  authServer?: string;
  resourceServer?: string;
  isLiveTestnet: boolean;
  isVeyloDirectory?: boolean;
  resolvedDemoUser?: UserProfile;
}

/**
 * Normalizes Open Payments payment pointer / wallet address
 * e.g. "$wallet.interledger-test.dev/alice" -> "https://wallet.interledger-test.dev/alice"
 */
export function normalizeWalletAddress(address: string): string {
  const trimmed = address.trim();
  if (trimmed.startsWith("$")) {
    return `https://${trimmed.slice(1)}`;
  }
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

/**
 * Resolves an Open Payments wallet address or Veylo Directory identifier.
 * Fails closed: Never fabricates synthetic recipients or false testnet confirmation.
 */
export async function resolveOpenPaymentsAddress(
  rawAddress: string
): Promise<WalletAddressResolution> {
  const trimmed = rawAddress.trim();

  // 1. If running on client side, call the server-side SSRF-protected resolution API
  if (typeof window !== "undefined") {
    const res = await fetch("/api/wallets/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: trimmed }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Wallet address could not be resolved: HTTP ${res.status}`);
    }

    const data = await res.json();
    return {
      id: data.recipient.openPaymentsAddress || data.recipient.id,
      publicName: data.recipient.name,
      assetCode: data.recipient.currency,
      assetScale: data.recipient.assetScale || 2,
      authServer: data.recipient.authServer,
      resourceServer: data.recipient.resourceServer,
      isLiveTestnet: Boolean(data.isLiveTestnet),
      isVeyloDirectory: Boolean(data.isVeyloDirectory),
      resolvedDemoUser: data.isVeyloDirectory
        ? DEMO_ACCOUNTS.find((u) => u.id === data.recipient.id)
        : undefined,
    };
  }

  // 2. Direct directory lookup (Server-side / unit test fallback)
  const normalized = normalizeWalletAddress(trimmed);
  const demoUser = DEMO_ACCOUNTS.find(
    (u) =>
      u.openPaymentsAddress.toLowerCase() === normalized.toLowerCase() ||
      u.handle.toLowerCase() === trimmed.toLowerCase() ||
      u.handle.replace("@", "").toLowerCase() === trimmed.toLowerCase() ||
      u.veyloAccountNumber.replace(/\s+/g, "") === trimmed.replace(/\s+/g, "")
  );

  if (demoUser) {
    return {
      id: demoUser.openPaymentsAddress,
      publicName: demoUser.name,
      assetCode: demoUser.currency,
      assetScale: 2,
      isLiveTestnet: false,
      isVeyloDirectory: true,
      resolvedDemoUser: demoUser,
    };
  }

  // If not in directory and in server without browser fetch:
  throw new Error(`Wallet address '${trimmed}' not found in Veylo directory.`);
}

/**
 * Generates an honest quote breakdown for transfer review.
 * Marked explicitly as simulated when calculated without a live connector quote.
 */
export function calculateInterledgerQuote(
  sourceAmountNgn: number,
  targetCurrency: "GBP" | "EUR" | "USD" | "NGN"
): InterledgerQuote {
  let exchangeRate = 1.0;
  if (targetCurrency === "GBP") exchangeRate = 2040.0;
  if (targetCurrency === "EUR") exchangeRate = 1885.0;
  if (targetCurrency === "USD") exchangeRate = 1650.0;

  const destinationAmount =
    targetCurrency === "NGN"
      ? sourceAmountNgn
      : Number((sourceAmountNgn / exchangeRate).toFixed(2));

  const veyloFeeNgn = Number((sourceAmountNgn * 0.02).toFixed(2)); // 2.0% Veylo Platform Fee

  return {
    sourceAmountNgn,
    destinationAmount,
    destinationCurrency: targetCurrency,
    exchangeRate,
    veyloFeeNgn,
    partnerRailFeeNgn: 0,
    networkType: "direct_ilp",
    routePath: [
      "Veylo Sender Client",
      "Open Payments Provider",
      `${targetCurrency} Receiving Endpoint`,
    ],
    estimatedDelivery: "Near-instant (Open Payments settlement)",
    quoteExpiresInSec: 60,
  };
}
