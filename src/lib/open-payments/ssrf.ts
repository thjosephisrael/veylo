/**
 * SSRF Protection and Outbound URL Validation
 * Validates wallet addresses and endpoints to prevent Server-Side Request Forgery.
 */

const BLOCKED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "169.254.169.254", // AWS/Cloud metadata
  "::1",
  "::ffff:127.0.0.1",
]);

const ALLOWED_PROTOCOLS = new Set(["https:"]);

export interface UrlValidationResult {
  isValid: boolean;
  error?: string;
  normalizedUrl?: string;
}

/**
 * Validates that a user-supplied wallet URL is safe for server-side resolution
 */
export function validateWalletUrl(rawUrl: string, allowHttpInDev: boolean = false): UrlValidationResult {
  let trimmed = rawUrl.trim();

  // Normalize Open Payments payment pointer if provided with '$' prefix
  if (trimmed.startsWith("$")) {
    trimmed = `https://${trimmed.slice(1)}`;
  } else if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    trimmed = `https://${trimmed}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { isValid: false, error: "Invalid URL format." };
  }

  // Enforce HTTPS unless running in explicit local dev testing
  if (parsed.protocol === "http:" && !allowHttpInDev) {
    return { isValid: false, error: "HTTPS is strictly required for Open Payments wallet addresses." };
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { isValid: false, error: `Protocol '${parsed.protocol}' is not supported. Use HTTPS.` };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block localhost and loopback targets
  if (BLOCKED_HOSTS.has(hostname) && !allowHttpInDev) {
    return { isValid: false, error: "Access to private or loopback addresses is prohibited." };
  }

  // Block private IPv4 ranges (RFC 1918)
  const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const [, a, b] = ipv4Match.map(Number);
    if (
      a === 10 || // 10.0.0.0/8
      a === 127 || // 127.0.0.0/8
      (a === 172 && b >= 16 && b <= 31) || // 172.16.0.0/12
      (a === 192 && b === 168) || // 192.168.0.0/16
      (a === 169 && b === 254) // 169.254.0.0/16
    ) {
      if (!allowHttpInDev) {
        return { isValid: false, error: "Access to private IP networks is prohibited." };
      }
    }
  }

  // Block ports other than standard 443 / 80 unless localhost dev
  if (parsed.port && parsed.port !== "443" && parsed.port !== "80" && !allowHttpInDev) {
    return { isValid: false, error: "Non-standard network ports are not permitted." };
  }

  return {
    isValid: true,
    normalizedUrl: parsed.toString().replace(/\/$/, ""),
  };
}
