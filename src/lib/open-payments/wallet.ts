import { validateWalletUrl } from "./ssrf";
import { getUnauthenticatedClient } from "./client";

export interface ResolvedWalletAddress {
  id: string;
  publicName: string;
  assetCode: string;
  assetScale: number;
  authServer: string;
  resourceServer: string;
  rawResponse?: Record<string, unknown>;
}

export interface WalletResolutionResult {
  resolved: boolean;
  wallet?: ResolvedWalletAddress;
  error?: string;
}

/**
 * Resolves an Open Payments wallet address with SSRF validation
 * and actual metadata parsing from the host.
 */
export async function resolveOpenPaymentsWalletAddress(
  rawAddress: string,
  allowHttpInDev: boolean = false
): Promise<WalletResolutionResult> {
  const validation = validateWalletUrl(rawAddress, allowHttpInDev);
  if (!validation.isValid || !validation.normalizedUrl) {
    return {
      resolved: false,
      error: validation.error || "Invalid wallet address.",
    };
  }

  const normalizedUrl = validation.normalizedUrl;

  try {
    const client = await getUnauthenticatedClient();
    const walletAddress = await client.walletAddress.get({
      url: normalizedUrl,
    });

    if (!walletAddress || !walletAddress.id) {
      return {
        resolved: false,
        error: "Wallet address not found on Open Payments host.",
      };
    }

    return {
      resolved: true,
      wallet: {
        id: walletAddress.id,
        publicName: walletAddress.publicName || "Open Payments Wallet",
        assetCode: walletAddress.assetCode,
        assetScale: walletAddress.assetScale,
        authServer: walletAddress.authServer,
        resourceServer: walletAddress.resourceServer,
        rawResponse: walletAddress as unknown as Record<string, unknown>,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error";
    return {
      resolved: false,
      error: `Could not resolve wallet address at ${normalizedUrl}: ${message}`,
    };
  }
}
