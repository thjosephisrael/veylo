"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayoutClient } from "@/components/layout/AppLayoutClient";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { NIGERIAN_BANKS } from "@/data/mockData";
import { useAccount } from "@/context/AccountContext";
import { resolveOpenPaymentsAddress } from "@/lib/interledger";
import {
  Building2,
  UserCheck,
  Globe2,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Check,
  Clock,
  Sparkles,
  Zap,
  LogOut,
} from "lucide-react";

export default function SendMoneyPage() {
  const { currentUser, allUsers, sendPayment } = useAccount();
  const [activeTab, setActiveTab] = useState<"nigerian_bank" | "veylo" | "international">(
    "nigerian_bank"
  );

  // Nigerian Bank Form State
  const [selectedBank, setSelectedBank] = useState("access");
  const [accountNumber, setAccountNumber] = useState("0918231920");
  const [resolvedName, setResolvedName] = useState<string | null>("Chioma Okonkwo");
  const [isResolving, setIsResolving] = useState(false);
  const [amountNgn, setAmountNgn] = useState("50000");

  // Veylo Account Form State
  const defaultOtherUser = allUsers.find((u) => u.id !== currentUser.id) || allUsers[1];
  const [veyloRecipientInput, setVeyloRecipientInput] = useState(defaultOtherUser.veyloAccountNumber);
  const [resolvedVeyloUser, setResolvedVeyloUser] = useState<string | null>(defaultOtherUser.name);
  const [resolvedOpenPaymentsPointer, setResolvedOpenPaymentsPointer] = useState<string | null>(
    defaultOtherUser.openPaymentsAddress
  );

  // Authorization Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [transferResult, setTransferResult] = useState<{
    reference: string;
    recipient: string;
  } | null>(null);

  // Handle bank account resolution dynamically
  const handleAccountChange = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 10);
    setAccountNumber(clean);

    if (clean.length === 10) {
      setIsResolving(true);
      setTimeout(() => {
        setIsResolving(false);
        if (clean === "0918231920" || clean.endsWith("1920")) {
          setSelectedBank("access");
          setResolvedName("Chioma Okonkwo");
        } else if (clean === "2201994419" || clean.endsWith("4419")) {
          setSelectedBank("zenith");
          setResolvedName("Babatunde Adeleke");
        } else if (clean === "0123456789" || clean.endsWith("6789")) {
          setSelectedBank("gtb");
          setResolvedName("Oluwatobi Adebayo");
        } else {
          const currentBank = NIGERIAN_BANKS.find((b) => b.id === selectedBank)?.name || "Commercial Bank";
          setResolvedName(`Demo Beneficiary (${currentBank})`);
        }
      }, 300);
    } else {
      setResolvedName(null);
    }
  };

  const handleVeyloRecipientChange = async (val: string) => {
    setVeyloRecipientInput(val);
    const clean = val.trim().toLowerCase().replace(/[\s\-\•]/g, "");

    if (clean.length >= 3) {
      const matched = allUsers.find((u) => {
        const uAcc = u.veyloAccountNumber.replace(/[\s\-\•]/g, "").toLowerCase();
        const uHandle = u.handle.toLowerCase().replace("@", "");
        return (
          uAcc === clean ||
          clean.includes(uAcc) ||
          uHandle === clean ||
          clean.includes(uHandle) ||
          u.name.toLowerCase().includes(clean)
        );
      });

      if (matched) {
        setResolvedVeyloUser(matched.name);
        setResolvedOpenPaymentsPointer(matched.openPaymentsAddress);
      } else {
        const res = await resolveOpenPaymentsAddress(val);
        setResolvedVeyloUser(res.publicName);
        setResolvedOpenPaymentsPointer(res.id);
      }
    } else {
      setResolvedVeyloUser(null);
      setResolvedOpenPaymentsPointer(null);
    }
  };

  const parsedAmount = parseFloat(amountNgn) || 0;
  const veyloFee = parsedAmount * 0.02; // 2.0% Veylo transaction fee rule
  const totalDebit = parsedAmount + veyloFee;

  const handleAuthorize = async () => {
    setIsAuthenticating(true);
    setAuthError(null);

    const recipientName =
      activeTab === "nigerian_bank"
        ? (resolvedName || "Nigerian Beneficiary")
        : (resolvedVeyloUser || "Veylo Recipient");

    const recipientIdentifier =
      activeTab === "nigerian_bank" ? accountNumber : veyloRecipientInput;

    const bankOrProvider =
      activeTab === "nigerian_bank"
        ? (NIGERIAN_BANKS.find((b) => b.id === selectedBank)?.name || "Nigerian Bank")
        : "Open Payments Interledger";

    const res = await sendPayment({
      recipientIdentifier,
      recipientName,
      amountNgn: parsedAmount,
      destinationType: activeTab === "nigerian_bank" ? "nigerian_bank" : "veylo",
      destinationBankOrProvider: bankOrProvider,
    });

    setIsAuthenticating(false);

    if (!res.success) {
      setAuthError(res.error || "Payment failed to process.");
      return;
    }

    setTransferResult({
      reference: res.reference,
      recipient: recipientName,
    });
  };

  const handleReset = () => {
    setAuthModalOpen(false);
    setTransferResult(null);
    setAuthError(null);
  };

  return (
    <AppLayoutClient
      title="Send Money"
      subtitle="Transfer to Nigerian banks, Veylo accounts, or international destinations"
    >
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Destination Category Switcher Tabs */}
        <div className="flex p-1.5 bg-slate-200/80 rounded-2xl gap-1">
          <button
            onClick={() => setActiveTab("nigerian_bank")}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "nigerian_bank"
                ? "bg-white text-midnight-950 shadow-sm"
                : "text-slate-600 hover:text-midnight-950"
            }`}
          >
            <Building2 className="w-4 h-4 text-electric-cobalt" />
            <span>Nigerian Bank</span>
          </button>

          <button
            onClick={() => setActiveTab("veylo")}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "veylo"
                ? "bg-white text-midnight-950 shadow-sm"
                : "text-slate-600 hover:text-midnight-950"
            }`}
          >
            <UserCheck className="w-4 h-4 text-electric-cobalt" />
            <span>Veylo Account / ID</span>
          </button>

          <Link
            href="/app/send/international"
            className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 text-slate-600 hover:text-midnight-950 hover:bg-white/60 transition-all"
          >
            <Globe2 className="w-4 h-4 text-electric-cobalt" />
            <span>International</span>
          </Link>
        </div>

        {/* ========================================================
            TAB 1: NIGERIAN BANK ACCOUNT FLOW
           ======================================================== */}
        {activeTab === "nigerian_bank" && (
          <Card variant="white" className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-midnight-950">
                Send to Nigerian Bank Account
              </h2>
              <p className="text-xs text-slate-500">
                Direct settlement via local commercial clearing rails (NIP). Funds clear instantly into the beneficiary account.
              </p>
            </div>

            {/* Quick Demo Beneficiary Accounts */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-slate-500 uppercase font-semibold">
                Quick Select Demo Beneficiary:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBank("access");
                    setAccountNumber("0918231920");
                    setResolvedName("Chioma Okonkwo");
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 text-left hover:border-electric-cobalt hover:bg-electric-cobalt/5 transition-all text-xs"
                >
                  <p className="font-bold text-midnight-950">Chioma Okonkwo</p>
                  <p className="text-[10px] text-slate-500 font-mono">Access Bank • 0918231920</p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBank("zenith");
                    setAccountNumber("2201994419");
                    setResolvedName("Babatunde Adeleke");
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 text-left hover:border-electric-cobalt hover:bg-electric-cobalt/5 transition-all text-xs"
                >
                  <p className="font-bold text-midnight-950">Babatunde Adeleke</p>
                  <p className="text-[10px] text-slate-500 font-mono">Zenith Bank • 2201994419</p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBank("gtb");
                    setAccountNumber("0123456789");
                    setResolvedName("Oluwatobi Adebayo");
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 text-left hover:border-electric-cobalt hover:bg-electric-cobalt/5 transition-all text-xs"
                >
                  <p className="font-bold text-midnight-950">Oluwatobi Adebayo</p>
                  <p className="text-[10px] text-slate-500 font-mono">GTBank • 0123456789</p>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Destination Bank Select */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
                  Select Destination Bank
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-electric-cobalt"
                >
                  {NIGERIAN_BANKS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Beneficiary Account Number */}
              <Input
                label="10-Digit Account Number"
                value={accountNumber}
                onChange={(e) => handleAccountChange(e.target.value)}
                placeholder="e.g. 0918231920"
                verified={!!resolvedName}
                leftAddon={<Building2 className="w-4 h-4" />}
                helperText="Enter any 10-digit NUBAN. Automatically resolves beneficiary."
              />

              {/* Real-time Beneficiary Resolution Card */}
              {isResolving && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-4 h-4 border-2 border-electric-cobalt border-t-transparent rounded-full animate-spin" />
                  <span>Resolving beneficiary details from Nigerian clearing rail...</span>
                </div>
              )}

              {resolvedName && !isResolving && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-700">
                    <span className="flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      SELECTED DEMO BENEFICIARY
                    </span>
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Simulated Partner Payout
                    </span>
                  </div>
                  <p className="text-base font-black text-midnight-950 font-sans">
                    {resolvedName}
                  </p>
                  <p className="text-xs text-slate-600 font-mono">
                    {NIGERIAN_BANKS.find((b) => b.id === selectedBank)?.name} • {accountNumber}
                  </p>
                  <p className="text-[11px] text-slate-400 pt-1">
                    Simulated commercial bank destination for demo testing.
                  </p>
                </div>
              )}

              {/* Transfer Amount Input */}
              <Input
                label="Transfer Amount (NGN)"
                value={amountNgn}
                onChange={(e) => setAmountNgn(e.target.value)}
                placeholder="0.00"
                leftAddon={<span className="font-bold text-slate-500">₦</span>}
                helperText={`Sender: ${currentUser.name} (Available: ₦${currentUser.availableBalanceNgn.toLocaleString()})`}
              />

              {/* Fee & Routing Breakdown */}
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Source Funding Account:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {currentUser.connectedBank.bankName} ({currentUser.connectedBank.accountNumber})
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Transfer Amount:</span>
                  <span className="font-mono font-bold text-slate-900">
                    ₦{parsedAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Veylo Transaction Fee (2.0%):</span>
                  <span className="font-mono font-bold text-slate-900">
                    ₦{veyloFee.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-bold text-midnight-950">
                  <span>Total Amount Debited:</span>
                  <span className="font-mono text-base text-electric-cobalt">
                    ₦{totalDebit.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-emerald-700 font-medium">
                  <span>Recipient Receives:</span>
                  <span className="font-mono font-bold">
                    ₦{parsedAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                variant="primary"
                size="lg"
                onClick={() => setAuthModalOpen(true)}
                disabled={!resolvedName || parsedAmount <= 0 || totalDebit > currentUser.availableBalanceNgn}
                className="w-full justify-center"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Review and Authorise Transfer
              </Button>
            </div>
          </Card>
        )}

        {/* ========================================================
            TAB 2: VEYLO ACCOUNT / ID FLOW (Real P2P Between 5 Demo Accounts)
           ======================================================== */}
        {activeTab === "veylo" && (
          <Card variant="white" className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-midnight-950">
                Send to Veylo Account or Handle
              </h2>
              <p className="text-xs text-slate-500">
                Instant peer-to-peer transfer via Open Payments protocol. Zero card fees.
              </p>
            </div>

            {/* Quick Demo Recipient Selectors */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-slate-500 uppercase font-semibold">
                Quick Select Demo Account to Pay:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {allUsers
                  .filter((u) => u.id !== currentUser.id)
                  .map((otherUser) => (
                    <button
                      key={otherUser.id}
                      type="button"
                      onClick={() => {
                        setVeyloRecipientInput(otherUser.veyloAccountNumber);
                        setResolvedVeyloUser(otherUser.name);
                        setResolvedOpenPaymentsPointer(otherUser.openPaymentsAddress);
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 text-left hover:border-electric-cobalt hover:bg-electric-cobalt/5 transition-all text-xs"
                    >
                      <p className="font-bold text-midnight-950 truncate">{otherUser.name}</p>
                      <p className="text-[10px] font-mono text-electric-cobalt truncate">
                        {otherUser.handle}
                      </p>
                      <p className="text-[10px] font-mono text-slate-400 truncate">
                        {otherUser.veyloAccountNumber}
                      </p>
                    </button>
                  ))}
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Recipient Veylo Number or Handle"
                value={veyloRecipientInput}
                onChange={(e) => handleVeyloRecipientChange(e.target.value)}
                placeholder="e.g. 718 902 4410 or @chioma"
                verified={!!resolvedVeyloUser}
                leftAddon={<UserCheck className="w-4 h-4" />}
                helperText="Enter 10-digit Veylo Account Number, @handle, or Open Payments pointer"
              />

              {resolvedVeyloUser && (
                <div className="p-4 rounded-xl bg-electric-cobalt/5 border border-electric-cobalt/20 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono text-electric-cobalt">
                    <span className="flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      RESOLVED OPEN PAYMENTS IDENTITY
                    </span>
                    <span>Direct ILP Peer</span>
                  </div>
                  <p className="text-base font-black text-midnight-950 font-sans">
                    {resolvedVeyloUser}
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    Endpoint: {resolvedOpenPaymentsPointer}
                  </p>
                </div>
              )}

              <Input
                label="Amount (NGN)"
                value={amountNgn}
                onChange={(e) => setAmountNgn(e.target.value)}
                placeholder="0.00"
                leftAddon={<span className="font-bold text-slate-500">₦</span>}
                helperText={`Your Available Balance: ₦${currentUser.availableBalanceNgn.toLocaleString()}`}
              />

              <Button
                variant="primary"
                size="lg"
                onClick={() => setAuthModalOpen(true)}
                disabled={!resolvedVeyloUser || parsedAmount <= 0 || totalDebit > currentUser.availableBalanceNgn}
                className="w-full justify-center"
              >
                Continue to Review
              </Button>
            </div>
          </Card>
        )}

        {/* ========================================================
            AUTHORIZATION MODAL (PIN & Biometric Auth)
           ======================================================== */}
        <Modal
          isOpen={authModalOpen}
          onClose={handleReset}
          title={transferResult ? "Transfer Settled" : "Authorise Payment"}
          subtitle={
            transferResult
              ? "Funds cleared instantly to recipient"
              : "Confirm the transaction details below"
          }
        >
          {!transferResult ? (
            <div className="space-y-6">
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Payer Account:</span>
                  <span className="font-bold text-slate-900">{currentUser.name} ({currentUser.handle})</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Beneficiary:</span>
                  <span className="font-bold text-slate-900">
                    {activeTab === "nigerian_bank" ? resolvedName : resolvedVeyloUser}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Amount Debited:</span>
                  <span className="font-mono font-bold text-electric-cobalt text-sm">
                    ₦{totalDebit.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  <span>Includes Veylo Fee (2.0%):</span>
                  <span className="font-mono">₦{veyloFee.toLocaleString()}</span>
                </div>
              </div>

              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                  {authError}
                </div>
              )}

              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAuthorize}
                  isLoading={isAuthenticating}
                  className="w-full justify-center font-bold"
                  leftIcon={<ShieldCheck className="w-5 h-5 text-white" />}
                >
                  Approve Payment
                </Button>
                <p className="text-[11px] text-center text-slate-400 font-mono">
                  Test environment authorization • Play money
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-5 py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h4 className="text-xl font-black text-midnight-950 font-sans">
                  ₦{parsedAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })} Sent
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Reference: <span className="font-mono text-slate-700">{transferResult.reference}</span>
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 text-xs text-left space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Recipient:</span>
                  <span className="font-bold text-slate-900">{transferResult.recipient}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Settlement Status:</span>
                  <span>Settled (Recorded in Server Ledger)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600 text-left space-y-1">
                <p className="font-bold text-midnight-950">✓ Server Ledger Updated</p>
                <p className="text-[11px] text-slate-500">
                  Your balance has been debited. To verify the credited balance and receipt for {transferResult.recipient}, sign out at the bottom left and switch to their account.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleReset}
                  className="flex-1"
                >
                  Send Another
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  href="/app/activity"
                  className="flex-1"
                >
                  View in Activity Ledger
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AppLayoutClient>
  );
}
