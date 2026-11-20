import fs from "fs";
import path from "path";
import {
  createAuthenticatedClient,
  createUnauthenticatedClient,
  AuthenticatedClient,
  UnauthenticatedClient,
} from "@interledger/open-payments";

export interface OpenPaymentsConfigStatus {
  isConfigured: boolean;
  missingVariables: string[];
  walletAddress?: string;
  keyId?: string;
}

let authenticatedClientCache: AuthenticatedClient | null = null;
let unauthenticatedClientCache: UnauthenticatedClient | null = null;

/**
 * Checks the status of Open Payments environment variables on the server.
 */
export function getOpenPaymentsConfigStatus(): OpenPaymentsConfigStatus {
  const missing: string[] = [];

  const walletAddress = process.env.OPEN_PAYMENTS_WALLET_ADDRESS;
  const keyId = process.env.OPEN_PAYMENTS_KEY_ID;
  const privateKey = process.env.OPEN_PAYMENTS_PRIVATE_KEY;
  const privateKeyPath = process.env.OPEN_PAYMENTS_PRIVATE_KEY_PATH;

  if (!walletAddress) missing.push("OPEN_PAYMENTS_WALLET_ADDRESS");
  if (!keyId) missing.push("OPEN_PAYMENTS_KEY_ID");
  if (!privateKey && !privateKeyPath) {
    missing.push("OPEN_PAYMENTS_PRIVATE_KEY or OPEN_PAYMENTS_PRIVATE_KEY_PATH");
  }

  return {
    isConfigured: missing.length === 0,
    missingVariables: missing,
    walletAddress: walletAddress || undefined,
    keyId: keyId || undefined,
  };
}

/**
 * Loads the private key either from an environment variable or a file path on disk.
 */
function loadPrivateKey(): string | null {
  if (process.env.OPEN_PAYMENTS_PRIVATE_KEY) {
    return process.env.OPEN_PAYMENTS_PRIVATE_KEY.replace(/\\n/g, "\n");
  }

  const keyPath = process.env.OPEN_PAYMENTS_PRIVATE_KEY_PATH;
  if (keyPath) {
    const resolvedPath = path.isAbsolute(keyPath)
      ? keyPath
      : path.join(process.cwd(), keyPath);
    if (fs.existsSync(resolvedPath)) {
      return fs.readFileSync(resolvedPath, "utf8");
    }
  }

  return null;
}

/**
 * Returns an unauthenticated Open Payments client for public wallet address lookups.
 */
export async function getUnauthenticatedClient(): Promise<UnauthenticatedClient> {
  if (!unauthenticatedClientCache) {
    unauthenticatedClientCache = await createUnauthenticatedClient({
      requestTimeoutMs: 8000,
    });
  }
  return unauthenticatedClientCache;
}

/**
 * Returns an authenticated Open Payments client for grants, quotes, and payment execution.
 * Fails closed if testnet credentials are not configured.
 */
export async function getAuthenticatedClient(): Promise<AuthenticatedClient> {
  if (authenticatedClientCache) {
    return authenticatedClientCache;
  }

  const status = getOpenPaymentsConfigStatus();
  if (!status.isConfigured) {
    throw new Error(
      `Open Payments credentials not configured on server. Missing: ${status.missingVariables.join(", ")}`
    );
  }

  const privateKey = loadPrivateKey();
  if (!privateKey) {
    throw new Error(
      "Open Payments private key could not be loaded from environment or file path."
    );
  }

  authenticatedClientCache = await createAuthenticatedClient({
    walletAddressUrl: status.walletAddress!,
    keyId: status.keyId!,
    privateKey,
    requestTimeoutMs: 10000,
  });

  return authenticatedClientCache;
}
