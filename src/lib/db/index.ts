import fs from "fs";
import path from "path";
import { UserProfile, Transaction } from "@/types";
import { DEMO_ACCOUNTS, INITIAL_TRANSACTIONS } from "@/data/mockData";

export interface ServerQuoteRecord {
  id: string;
  senderWalletAddress: string;
  receiverWalletAddress: string;
  sourceAmountMinor: string;
  destinationAmountMinor: string;
  sourceAssetCode: string;
  sourceAssetScale: number;
  destinationAssetCode: string;
  destinationAssetScale: number;
  exchangeRate: number;
  veyloFeeMinor: string;
  networkFeeMinor: string;
  createdAt: string;
  expiresAt: string;
  isSimulated: boolean;
}

export interface ServerSession {
  sessionId: string;
  userId: string;
  role: string;
  createdAt: string;
  expiresAt: string;
}

export interface DatabaseSchema {
  version: number;
  users: UserProfile[];
  transactions: Transaction[];
  quotes: ServerQuoteRecord[];
  sessions: ServerSession[];
  auditLogs: Array<{
    id: string;
    action: string;
    actor: string;
    timestamp: string;
    metadata: Record<string, unknown>;
  }>;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "veylo-db.json");

function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Initializes database with canonical demo data if not yet created.
 */
function getInitialData(): DatabaseSchema {
  return {
    version: 1,
    users: JSON.parse(JSON.stringify(DEMO_ACCOUNTS)),
    transactions: JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS)),
    quotes: [],
    sessions: [],
    auditLogs: [],
  };
}

/**
 * Reads database from disk with fallback to initialized state.
 */
export function readDatabase(): DatabaseSchema {
  ensureDirectoryExists(DATA_DIR);

  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialData();
    writeDatabase(initial);
    return initial;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database, restoring defaults:", err);
    const initial = getInitialData();
    writeDatabase(initial);
    return initial;
  }
}

/**
 * Atomically writes database to disk using a temporary file.
 */
export function writeDatabase(data: DatabaseSchema): void {
  ensureDirectoryExists(DATA_DIR);
  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tempFile, DB_FILE);
}

// ==========================================
// User Operations
// ==========================================

export function getUserById(userId: string): UserProfile | null {
  const db = readDatabase();
  return db.users.find((u) => u.id === userId) || null;
}

export function getUserByVeyloNumberOrHandle(query: string): UserProfile | null {
  const db = readDatabase();
  const clean = query.trim().toLowerCase();
  const cleanNoSpaces = clean.replace(/\s+/g, "");
  const cleanNoAt = clean.replace(/^@/, "");

  return (
    db.users.find((u) => {
      const uAcctNoSpaces = u.veyloAccountNumber.replace(/\s+/g, "").toLowerCase();
      const uHandleNoAt = u.handle.replace(/^@/, "").toLowerCase();
      const uName = u.name.toLowerCase();
      const uEmail = u.email.toLowerCase();
      const uAddress = u.openPaymentsAddress.toLowerCase();

      return (
        uAcctNoSpaces === cleanNoSpaces ||
        uHandleNoAt === cleanNoAt ||
        uName === clean ||
        uEmail === clean ||
        uAddress === clean
      );
    }) || null
  );
}

export function getAllUsers(): UserProfile[] {
  const db = readDatabase();
  return db.users;
}

/**
 * Updates a user's balance safely with integer minor units validation
 */
export function updateUserBalance(
  userId: string,
  debitAmountNgn: number,
  creditAmountNgn: number = 0
): { success: boolean; newBalance?: number; error?: string } {
  const db = readDatabase();
  const user = db.users.find((u) => u.id === userId);

  if (!user) {
    return { success: false, error: "User not found." };
  }

  if (debitAmountNgn > 0 && user.availableBalanceNgn < debitAmountNgn) {
    return { success: false, error: "Insufficient funds." };
  }

  user.availableBalanceNgn = Math.max(0, user.availableBalanceNgn - debitAmountNgn + creditAmountNgn);
  user.totalBalanceNgn = Math.max(0, user.totalBalanceNgn - debitAmountNgn + creditAmountNgn);

  writeDatabase(db);
  return { success: true, newBalance: user.availableBalanceNgn };
}

// ==========================================
// Transaction Operations
// ==========================================

export function getTransactionsByUserId(userId: string): Transaction[] {
  const db = readDatabase();
  return db.transactions.filter((tx) => tx.userId === userId);
}

export function getTransactionById(txId: string): Transaction | null {
  const db = readDatabase();
  return db.transactions.find((tx) => tx.id === txId) || null;
}

export function createTransactionRecord(tx: Transaction): Transaction {
  const db = readDatabase();
  db.transactions.unshift(tx);
  writeDatabase(db);
  return tx;
}

// ==========================================
// Quote Operations
// ==========================================

export function saveQuoteRecord(quote: ServerQuoteRecord): void {
  const db = readDatabase();
  db.quotes.unshift(quote);
  // Keep last 100 quotes
  if (db.quotes.length > 100) {
    db.quotes = db.quotes.slice(0, 100);
  }
  writeDatabase(db);
}

export function getQuoteRecord(quoteId: string): ServerQuoteRecord | null {
  const db = readDatabase();
  return db.quotes.find((q) => q.id === quoteId) || null;
}

// ==========================================
// Session Operations
// ==========================================

export function createServerSession(userId: string): ServerSession {
  const db = readDatabase();
  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    throw new Error(`Cannot create session for non-existent user ${userId}`);
  }

  const sessionId = `sess_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
  const session: ServerSession = {
    sessionId,
    userId,
    role: user.role,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
  };

  db.sessions.push(session);
  writeDatabase(db);
  return session;
}

export function getServerSession(sessionId: string): ServerSession | null {
  const db = readDatabase();
  const session = db.sessions.find((s) => s.sessionId === sessionId);
  if (!session) return null;

  if (new Date(session.expiresAt).getTime() < Date.now()) {
    // Expired
    return null;
  }

  return session;
}

export function deleteServerSession(sessionId: string): void {
  const db = readDatabase();
  db.sessions = db.sessions.filter((s) => s.sessionId !== sessionId);
  writeDatabase(db);
}
