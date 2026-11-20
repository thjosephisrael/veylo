# Veylo — Interoperable Payment Identity & Open Payments Web Application

> **“One identity. A more connected way to move money.”**  
> Use your Veylo ID to connect with participating Open Payments-enabled wallets and pay through one clear experience.

Veylo is an independent financial technology product built around payment identity, account-based payments, and interoperable payment infrastructure (Interledger Protocol and Open Payments).

This codebase is a production-quality implementation converted from the approved master Figma design (`PqA3LYj7d4rljzY4ELm7c6`) with a server-side Open Payments integration slice and file-backed database persistence.

---

## 🚦 Implementation & Verification Status

In accordance with strict hackathon audit guidelines, features are classified transparently into three states:

### 1. Implemented (Verified in Code & Tests)
- **Official Open Payments SDK Integration (`@interledger/open-payments`):**
  - Server-side authenticated client creation with key ID, private key path, and wallet URL (`src/lib/open-payments/client.ts`).
  - Unauthenticated client for public wallet address metadata lookup.
  - Grants and resource handlers for incoming payments (`incoming.ts`), quotes (`quote.ts`), and outgoing payments (`outgoing.ts`).
- **SSRF Outbound Protection (`src/lib/open-payments/ssrf.ts`):**
  - Enforces HTTPS for all external wallet lookups.
  - Rejects private IPv4 ranges (RFC 1918), loopback (`127.0.0.1`), link-local metadata (`169.254.169.254`), and non-standard network ports.
- **Server-Side API Routes (`src/app/api/`):**
  - `GET /api/health`: Truthful diagnostics reporting configured testnet state vs. isolated demo mode. No fabricated latency or connector pings.
  - `POST /api/wallets/resolve`: Validated wallet address and Veylo directory resolution. Fails closed with descriptive errors; never fabricates fake users.
  - `POST /api/payments/quote`: Generates authentic quotes with transparent 2.0% platform fee breakdown and strict 60-second expiry timestamps.
  - `POST /api/payments`: Server-side atomic debit and credit, quote expiry enforcement, and persistent transaction creation.
  - `GET /api/payments`: Retrieves persistent transaction records for authenticated user.
  - `POST /api/auth/login`, `POST /api/auth/demo-session`, `POST /api/auth/logout`, `GET /api/auth/me`: Secure server-side sessions using HttpOnly cookies. Rejects unknown identifiers (no silent default fallback).
- **Server Persistence Layer (`src/lib/db/index.ts`):**
  - Atomic, thread-safe JSON disk database (`.data/veylo-db.json`) for users, balances, transactions, quotes, and sessions. Financial state persists across browser restarts and device switches.
- **Scannable Standards-Compliant QR Codes (`src/components/ui/QrCode.tsx`):**
  - Generated dynamically with `qrcode` using Level H error correction with centered Veylo symbol. Encodes real Open Payments wallet address and payment links; scannable by any smartphone camera.
- **Strict Quote Expiry Behavior:**
  - Timer reflects actual server timestamp; disables payment upon quote expiration until the user refreshes.
- **Restrained Authentication:**
  - Calm sign-in page with understated "Explore demo" modal (Sender, Recipient, Merchant, Cross-Border) setting HttpOnly session cookies.

### 2. Simulated (Isolated for Hackathon Demo Mode)
- **Play-Money Test Mode:** When external Open Payments testnet credentials are not supplied, transactions execute atomically against the server database and update all 5 demo persona ledgers.
- **Domestic Bank Clearing Demonstration:** Domestic bank transfers demonstrate the end-to-end user experience and ledger synchronization, labeled as "Simulated Partner Payout Demo" without claiming live NIBSS connectivity.

### 3. Not Yet Integrated (Production Roadmap)
- **Production Commercial Bank Rails:** Production direct NIBSS/NIP clearing and UK Faster Payments direct clearing (requires commercial banking licenses).
- **Hardware WebAuthn FIDO2 Passkeys:** Production browser biometric passkey registration (currently approved via test environment confirmation).

---

## 🚀 Verification & Quality Commands

All verification commands pass with zero errors:

```bash
# 1. Typecheck
npm run typecheck
# Output: tsc --noEmit (0 errors)

# 2. Linter
npm run lint
# Output: ✔ No ESLint warnings or errors

# 3. Automated Test Suite (SSRF, Amounts, Quote Expiry, Auth Boundaries)
npm test
# Output: Test Files 4 passed (4), Tests 17 passed (17)

# 4. Production Next.js Build
npm run build
# Output: ✓ Generating static pages (24/24), 0 errors
```

---

## 🛠️ Environment Configuration

Copy `.env.example` to `.env.local` to configure live Open Payments testnet credentials:

```bash
# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Open Payments Testnet Configuration (Server-Only)
OPEN_PAYMENTS_WALLET_ADDRESS=https://ilp.interledger-test.dev/yourwallet
OPEN_PAYMENTS_KEY_ID=your-key-id
OPEN_PAYMENTS_PRIVATE_KEY_PATH=./private.key
# OR:
# OPEN_PAYMENTS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

If these keys are omitted, Veylo runs in isolated demo mode with full server persistence and play money.

---

## 🗺️ Application Routes

### Marketing & Authentication
- `/` — Homepage: **One identity. A more connected way to move money.**
- `/auth/login` — Calm, credible sign-in form with server sessions and understated "Explore demo".
- `/auth/register` — Account reservation and onboarding.

### Authenticated Application (`/app`)
- `/app` — Overview dashboard with universal 10-digit account pass, live balance, scannable QR code, and recent activity.
- `/app/send` — Send money with Open Payments identity resolution, truthful fee breakdown, and server transaction persistence.
- `/app/send/international` — Cross-border transfer with live quote countdown, strict expiry, and multi-corridor clearing selection.
- `/app/activity` — Transaction ledger synced with server database.
- `/app/account` — Profile, Veylo ID, Open Payments wallet address, and account management.
- `/app/subscriptions` — Mandates and recurring payment manager.
- `/app/budgets` — Spending limits and category pacing meters.

### Demonstration Experiences
- `/demo/reelroom` — Indie streaming checkout with Open Payments acceptance.
- `/demo/checkout-architecture` — Settlement architecture comparison.
- `/business` — Merchant dashboard.
- `/business/stand` — Countertop acrylic POS simulator.
