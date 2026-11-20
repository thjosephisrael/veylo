"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayoutClient } from "@/components/layout/AppLayoutClient";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { QrCode } from "@/components/ui/QrCode";
import { useAccount } from "@/context/AccountContext";
import { VeyloSymbol } from "@/components/brand/VeyloLogo";
import {
  Copy,
  Check,
  Send,
  Globe2,
  Repeat,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Building2,
  CheckCircle2,
  PieChart,
} from "lucide-react";

export default function AppDashboardPage() {
  const { currentUser, userTransactions, userSubscriptions, testnetStatus, receivePayment } = useAccount();
  const [copied, setCopied] = useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);
  const [receiveMsg, setReceiveMsg] = useState<string | null>(null);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(currentUser.veyloAccountNumber.replace(/\s+/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickReceive = async (amount: number) => {
    setIsReceiving(true);
    setReceiveMsg(null);
    const res = await receivePayment(amount, "Open Payments Interledger Testnet");
    setIsReceiving(false);
    if (res.success) {
      setReceiveMsg(`+₦${amount.toLocaleString()} credited successfully!`);
      setTimeout(() => setReceiveMsg(null), 4000);
    }
  };

  const activeSubsCount = userSubscriptions.filter((s) => s.status === "active").length;

  return (
    <AppLayoutClient
      title="Financial Overview"
      subtitle="Interoperable Account Hub & Open Payments Settlement"
    >
      <div className="space-y-8">
        {/* ========================================================
            HERO VEYLO ACCOUNT PASS CARD (Frame 28:2)
           ======================================================== */}
        <div className="rounded-3xl bg-midnight-950 p-6 md:p-8 text-white relative overflow-hidden shadow-2xl border border-midnight-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-electric-cobalt/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {/* Top row: Brand & Status Pill */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-midnight-900">
              <div className="flex items-center gap-3">
                <VeyloSymbol size={32} variant="dark" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold font-sans tracking-widest text-sm text-white">
                      VEYLO ACCOUNT PASS
                    </span>
                    <Badge variant="lime" size="sm" dot>
                      Active
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Open Payments Endpoint:{" "}
                    <span className="text-[#D8F15B]">{currentUser.openPaymentsAddress}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="midnight" size="sm" className="bg-midnight-900 text-acid-lime border-midnight-700">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Tier 3 KYC Verified
                </Badge>
              </div>
            </div>

            {/* Center Account Number Callout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 tracking-wider uppercase">
                    Your 10-Digit Interoperable Account Number
                  </span>
                  <span className="text-xs font-bold text-acid-lime font-mono">
                    {currentUser.handle}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-3xl sm:text-5xl font-black font-mono tracking-widest text-white">
                    {currentUser.veyloAccountNumber}
                  </span>
                  <button
                    onClick={handleCopyAccount}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-midnight-800 hover:bg-midnight-700 text-xs font-mono text-slate-300 hover:text-white transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-acid-lime" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400 pt-1">
                  Share this number to receive instant transfers from any Veylo user, commercial bank, or Open Payments wallet.
                </p>
              </div>

              {/* Connected Bank Status Pill Box */}
              <div className="md:col-span-4 bg-midnight-900/90 rounded-2xl border border-midnight-800 p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>FUNDING / PAYOUT LINK</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Linked
                  </span>
                </div>
                <div className="text-sm font-bold text-white truncate">
                  {currentUser.connectedBank.bankName}
                </div>
                <div className="text-xs font-mono text-slate-300 flex items-center justify-between">
                  <span>Acct: {currentUser.connectedBank.accountNumber}</span>
                  <span className="text-acid-lime font-bold">Auto-Sweep ON</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-4 border-t border-midnight-900 flex flex-wrap gap-3">
              <Button
                href="/app/send"
                variant="lime"
                size="md"
                leftIcon={<Send className="w-4 h-4" />}
              >
                Send to Bank / Veylo
              </Button>
              <Button
                href="/app/send/international"
                variant="primary"
                size="md"
                leftIcon={<Globe2 className="w-4 h-4" />}
              >
                International Transfer
              </Button>
              <Button
                onClick={() => setReceiveModalOpen(true)}
                variant="outline-dark"
                size="md"
                leftIcon={<ArrowDownLeft className="w-4 h-4 text-acid-lime" />}
              >
                Receive Funds
              </Button>
              <Button
                href="/app/subscriptions"
                variant="outline-dark"
                size="md"
                leftIcon={<Repeat className="w-4 h-4 text-acid-lime" />}
              >
                Subscriptions ({activeSubsCount})
              </Button>
            </div>
          </div>
        </div>

        {/* ========================================================
            BALANCE & SPENDING METRIC TILES
           ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="white" className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase">
              <span>Total Liquid Funds</span>
              <Building2 className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-midnight-950">
              {currentUser.currency === "NGN" ? (
                `₦${(currentUser.totalBalanceNgn).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`
              ) : currentUser.currency === "GBP" ? (
                `£${currentUser.foreignBalance?.amount.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`
              ) : (
                `€${currentUser.foreignBalance?.amount.toLocaleString("de-DE", { minimumFractionDigits: 2 })}`
              )}
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Available in {currentUser.connectedBank.bankName}</span>
            </div>
          </Card>

          <Card variant="white" className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase">
              <span>Interledger Testnet Status</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-electric-cobalt">
              {testnetStatus.latencyMs}ms RTT
            </div>
            <div className="text-xs text-slate-500 flex items-center justify-between">
              <span>wallet.interledger-test.dev</span>
              <span className="text-emerald-600 font-bold font-mono">14 Connectors</span>
            </div>
          </Card>

          <Card variant="white" className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase">
              <span>Active Subscriptions</span>
              <Repeat className="w-4 h-4 text-electric-cobalt" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-midnight-950">
              {activeSubsCount} Mandates
            </div>
            <div className="text-xs text-slate-500 flex items-center justify-between">
              <span>Open Payments Protocol</span>
              <Link href="/app/subscriptions" className="text-electric-cobalt font-semibold hover:underline">
                Manage (Revoke)
              </Link>
            </div>
          </Card>
        </div>

        {/* ========================================================
            RECENT ACTIVITY PREVIEW (Dynamic per Persona)
           ======================================================== */}
        <Card variant="white" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-midnight-950 font-sans">
                Payment Activity for {currentUser.name}
              </h2>
              <p className="text-xs text-slate-500">
                Direct transactions across Nigerian banks, Interledger connectors, and Open Payments mandates
              </p>
            </div>
            <Button
              href="/app/activity"
              variant="outline"
              size="sm"
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              View Full History
            </Button>
          </div>

          <div className="divide-y divide-slate-100">
            {userTransactions.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No transactions recorded yet for this persona. Send a transfer to test!
              </div>
            ) : (
              userTransactions.slice(0, 5).map((tx) => (
                <div
                  key={tx.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 rounded-xl px-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        tx.category === "deposit"
                          ? "bg-emerald-50 text-emerald-700"
                          : tx.destinationType === "international_bank"
                          ? "bg-electric-cobalt/10 text-electric-cobalt"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {tx.category === "deposit" ? (
                        <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-midnight-950">{tx.title}</p>
                      <p className="text-xs text-slate-500 font-mono">
                        {tx.destinationBankOrProvider} • {tx.timestamp}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center pl-13 sm:pl-0">
                    <span
                      className={`font-mono font-bold text-sm ${
                        tx.category === "deposit" ? "text-emerald-600" : "text-midnight-950"
                      }`}
                    >
                      {tx.category === "deposit" ? "+" : "-"}₦
                      {tx.amountNgn.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {tx.destinationCurrency && tx.destinationCurrency !== "NGN" && (
                        <span className="text-[10px] font-mono text-slate-500">
                          ({tx.destinationAmount} {tx.destinationCurrency})
                        </span>
                      )}
                      <Badge variant="success" size="sm">
                        Settled
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* ========================================================
            RECEIVE FUNDS & QR MODAL
           ======================================================== */}
        <Modal
          isOpen={receiveModalOpen}
          onClose={() => setReceiveModalOpen(false)}
          title="Receive Funds via Open Payments"
          subtitle="Share your account number, scan your QR code, or test an inbound transfer"
        >
          <div className="flex flex-col items-center text-center p-2 sm:p-4 space-y-5">
            {/* Scannable Real Standards-Compliant QR Code */}
            <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-md">
              <QrCode
                value={currentUser.openPaymentsAddress}
                size={180}
                showCenterLogo={true}
              />
            </div>

            {/* Account Details */}
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-mono">
                <span>UNIVERSAL VEYLO ACCOUNT</span>
                <ShieldCheck className="w-3.5 h-3.5 text-electric-cobalt" />
              </div>
              <p className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-midnight-950">
                {currentUser.veyloAccountNumber}
              </p>
              <p className="text-sm font-semibold text-slate-700">
                {currentUser.name} <span className="text-slate-400 font-normal">({currentUser.handle})</span>
              </p>
              <p className="text-[11px] font-mono text-[#3D5BFF] pt-0.5">
                {currentUser.openPaymentsAddress}
              </p>
            </div>

            {/* Quick Inbound Payment Simulation Box */}
            <div className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider">
                  Test Inbound Transfer (Open Payments)
                </span>
                <span className="text-[10px] font-mono text-[#3D5BFF] bg-[#3D5BFF]/10 px-2 py-0.5 rounded-full font-bold">
                  Instant Settlement
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Click an amount below to simulate an incoming transfer from the Interledger testnet and verify live balance updates:
              </p>
              {receiveMsg && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-1.5 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{receiveMsg}</span>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  disabled={isReceiving}
                  onClick={() => handleQuickReceive(25000)}
                  className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:border-[#3D5BFF] text-xs font-mono font-bold text-[#111B32] hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-50 text-center shadow-sm"
                >
                  +₦25,000
                </button>
                <button
                  type="button"
                  disabled={isReceiving}
                  onClick={() => handleQuickReceive(50000)}
                  className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:border-[#3D5BFF] text-xs font-mono font-bold text-[#111B32] hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-50 text-center shadow-sm"
                >
                  +₦50,000
                </button>
                <button
                  type="button"
                  disabled={isReceiving}
                  onClick={() => handleQuickReceive(100000)}
                  className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:border-[#3D5BFF] text-xs font-mono font-bold text-[#111B32] hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-50 text-center shadow-sm"
                >
                  +₦100,000
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full">
              <Button
                variant="outline"
                size="md"
                onClick={handleCopyAccount}
                leftIcon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                className="flex-1"
              >
                {copied ? "Copied" : "Copy Account Number"}
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setReceiveModalOpen(false)}
                className="flex-1"
              >
                Done
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayoutClient>
  );
}
