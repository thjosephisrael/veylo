"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  UserProfile,
  Transaction,
  SubscriptionMandate,
  PaymentDestinationType,
  InterledgerNetworkStatus,
} from "@/types";
import {
  DEMO_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  MOCK_SUBSCRIPTIONS,
  INTERLEDGER_TESTNET_STATUS,
} from "@/data/mockData";

interface SendPaymentParams {
  recipientIdentifier: string;
  recipientName: string;
  amountNgn: number;
  destinationType: PaymentDestinationType;
  destinationBankOrProvider?: string;
  destinationAmount?: number;
  destinationCurrency?: string;
  quoteId?: string;
}

interface AccountContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  switchUser: (userId: string) => Promise<void>;
  transactions: Transaction[];
  userTransactions: Transaction[];
  subscriptions: SubscriptionMandate[];
  userSubscriptions: SubscriptionMandate[];
  testnetStatus: InterledgerNetworkStatus;
  sendPayment: (params: SendPaymentParams) => Promise<{ success: boolean; reference: string; error?: string }>;
  receivePayment: (amountNgn: number, senderName?: string) => Promise<{ success: boolean; error?: string }>;
  revokeMandate: (mandateId: string) => void;
  resetAllDemoData: () => void;
  refreshTransactions: () => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(DEMO_ACCOUNTS);
  const [currentUserId, setCurrentUserId] = useState<string>("usr_tomi");
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [subscriptions, setSubscriptions] = useState<SubscriptionMandate[]>(MOCK_SUBSCRIPTIONS);
  const [testnetStatus, setTestnetStatus] = useState<InterledgerNetworkStatus>(
    INTERLEDGER_TESTNET_STATUS
  );

  const refreshUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        if (data.users && Array.isArray(data.users)) {
          setUsers(data.users);
        }
      }
    } catch {
      // Fall back
    }
  }, []);

  // Check health and server session on mount
  useEffect(() => {
    async function init() {
      // 0. Fetch latest users and live balances from server DB
      try {
        const usersRes = await fetch("/api/users");
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          if (usersData.users && Array.isArray(usersData.users)) {
            setUsers(usersData.users);
          }
        }
      } catch {
        // Fall back to DEMO_ACCOUNTS
      }

      // 1. Fetch real Open Payments health
      try {
        const healthRes = await fetch("/api/health");
        if (healthRes.ok) {
          const healthData = await healthRes.json();
          setTestnetStatus({
            endpoint: healthData.openPayments.walletAddress || "https://wallet.interledger-test.dev",
            connected: healthData.openPayments.isConfigured,
            isConfigured: healthData.openPayments.isConfigured,
            mode: healthData.openPayments.mode,
            statusMessage: healthData.openPayments.statusMessage,
          });
        }
      } catch {
        // Fall back to offline defaults
      }

      // 2. Fetch active server session if available
      try {
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.authenticated && meData.user) {
            setCurrentUserId(meData.user.id);
          }
        }
      } catch {
        // Fall back to saved or default user
        const savedUserId = localStorage.getItem("veylo_current_user_id");
        if (savedUserId && DEMO_ACCOUNTS.some((u) => u.id === savedUserId)) {
          setCurrentUserId(savedUserId);
        }
      }
    }

    init();
  }, []);

  const refreshTransactions = useCallback(async () => {
    try {
      const res = await fetch(`/api/payments?userId=${currentUserId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.transactions) {
          setTransactions((prev) => {
            const others = prev.filter((t) => t.userId !== currentUserId);
            return [...data.transactions, ...others];
          });
        }
      }
    } catch {
      // Ignore
    }
  }, [currentUserId]);

  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const switchUser = async (userId: string) => {
    if (users.some((u) => u.id === userId)) {
      setCurrentUserId(userId);
      localStorage.setItem("veylo_current_user_id", userId);

      // Create server demo session
      try {
        await fetch("/api/auth/demo-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
      } catch {
        // Continue
      }

      await refreshUsers();
      await refreshTransactions();
    }
  };

  const userTransactions = transactions.filter((t) => t.userId === currentUserId);
  const userSubscriptions = subscriptions.filter((s) => s.userId === currentUserId);

  /**
   * Executes a transfer through server-side payment orchestration:
   * - Validates balances on the server
   * - Checks quote expiry
   * - Debits sender and credits recipient in server database
   * - Returns verified transaction reference
   */
  const sendPayment = async ({
    recipientIdentifier,
    recipientName,
    amountNgn,
    destinationType,
    destinationBankOrProvider,
    destinationAmount,
    destinationCurrency = "NGN",
    quoteId,
  }: SendPaymentParams): Promise<{ success: boolean; reference: string; error?: string }> => {
    const reference = `VYL-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUser.id,
          quoteId,
          recipientIdentifier,
          amount: amountNgn,
          destinationType,
          destinationCurrency,
          reference,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          reference: "",
          error: data.error || "Payment failed to process.",
        };
      }

      // Sync updated balance from server response
      if (typeof data.newSenderBalance === "number") {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === currentUser.id
              ? { ...u, availableBalanceNgn: data.newSenderBalance, totalBalanceNgn: data.newSenderBalance }
              : u
          )
        );
      }

      // Add transaction to local state
      if (data.transaction) {
        setTransactions((prev) => [data.transaction, ...prev]);
      }

      // Sync updated balances across all accounts in directory
      refreshUsers();
      refreshTransactions();

      return {
        success: true,
        reference: data.transaction?.reference || reference,
      };
    } catch {
      return {
        success: false,
        reference: "",
        error: "Network error connecting to payment gateway.",
      };
    }
  };

  /**
   * Receives an inbound transfer / deposit into the active user's account via Open Payments.
   */
  const receivePayment = async (
    amountNgn: number,
    senderName: string = "Open Payments Interledger Testnet"
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/payments/receive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          amount: amountNgn,
          senderName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Failed to receive payment." };
      }

      await refreshUsers();
      await refreshTransactions();
      return { success: true };
    } catch {
      return { success: false, error: "Network error receiving payment." };
    }
  };

  const revokeMandate = (mandateId: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === mandateId ? { ...s, status: "revoked" } : s))
    );
  };

  const resetAllDemoData = () => {
    setUsers(DEMO_ACCOUNTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setSubscriptions(MOCK_SUBSCRIPTIONS);
    setCurrentUserId("usr_tomi");

    // Scoped cleanup only — NEVER call localStorage.clear()
    try {
      localStorage.removeItem("veylo_current_user_id");
      localStorage.removeItem("veylo_users_state");
      localStorage.removeItem("veylo_transactions_state");
      localStorage.removeItem("veylo_subscriptions_state");
    } catch {
      // Ignore
    }
  };

  return (
    <AccountContext.Provider
      value={{
        currentUser,
        allUsers: users,
        switchUser,
        transactions,
        userTransactions,
        subscriptions,
        userSubscriptions,
        testnetStatus,
        sendPayment,
        receivePayment,
        revokeMandate,
        resetAllDemoData,
        refreshTransactions,
        refreshUsers,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = (): AccountContextType => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
};
