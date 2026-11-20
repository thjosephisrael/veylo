"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AppLayoutClient } from "@/components/layout/AppLayoutClient";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useAccount } from "@/context/AccountContext";
import {
  Globe2,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  RefreshCw,
  Clock,
  Layers,
  Check,
  AlertTriangle,
  Info,
} from "lucide-react";

export default function InternationalTransferPage() {
  const { currentUser, sendPayment } = useAccount();

  const [destinationCountry, setDestinationCountry] = useState<"GB" | "EU" | "UNSUPPORTED">("GB");
  const [sortCode, setSortCode] = useState("40-22-18");
  const [accountNumber, setAccountNumber] = useState("88291044");
  const [iban, setIban] = useState("DE89 1004 0000 0123 4567 89");
  const [resolvedRecipient, setResolvedRecipient] = useState<string | null>("Arthur Pendelton");
  const [fxAmount, setFxAmount] = useState("150.00");

  // Routing Mode: Direct Interledger Bank Endpoint vs Local Payout Partner
  const [routeMode, setRouteMode] = useState<"direct_ilp" | "payout_partner">("direct_ilp");

  // Live Quote & Server Expiry
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [quoteExpiresAt, setQuoteExpiresAt] = useState<string | null>(null);
  const [quoteSecondsLeft, setQuoteSecondsLeft] = useState(60);
  const [isQuoteExpired, setIsQuoteExpired] = useState(false);
  const [isFetchingQuote, setIsFetchingQuote] = useState(false);

  const fxRate = destinationCountry === "GB" ? 2040.0 : 1885.0;
  const parsedFx = parseFloat(fxAmount) || 0;
  const ngnEquivalent = parsedFx * fxRate;
  const veyloFeeNgn = Number((ngnEquivalent * 0.02).toFixed(2)); // 2.0%
  const totalDebitNgn = ngnEquivalent + veyloFeeNgn;

  // Authorization Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [transferSettled, setTransferSettled] = useState(false);
  const [transferResult, setTransferResult] = useState<{
    reference: string;
    recipient: string;
  } | null>(null);

  // Fetch verified quote from server
  const fetchServerQuote = useCallback(async () => {
    if (parsedFx <= 0 || destinationCountry === "UNSUPPORTED") return;

    setIsFetchingQuote(true);
    setIsQuoteExpired(false);

    try {
      const targetCurrency = destinationCountry === "GB" ? "GBP" : "EUR";
      const destinationAddress =
        destinationCountry === "GB"
          ? "https://ilp.interledger-test.dev/arthur"
          : "https://ilp.interledger-test.dev/kafeartisan";

      const res = await fetch("/api/payments/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUser.id,
          destinationAddress,
          sourceAmountNgn: ngnEquivalent,
          targetCurrency,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setQuoteId(data.quoteId);
        setQuoteExpiresAt(data.expiresAt);
        setQuoteSecondsLeft(data.expiresInSeconds || 60);
      }
    } catch {
      // Fallback local expiry
      setQuoteExpiresAt(new Date(Date.now() + 60000).toISOString());
      setQuoteSecondsLeft(60);
    } finally {
      setIsFetchingQuote(false);
    }
  }, [parsedFx, destinationCountry, currentUser.id, ngnEquivalent]);

  useEffect(() => {
    fetchServerQuote();
  }, [destinationCountry, fetchServerQuote]);

  // Strict countdown timer respecting actual expiry
  useEffect(() => {
    if (!quoteExpiresAt) return;

    const timer = setInterval(() => {
      const diff = Math.max(
        0,
        Math.floor((new Date(quoteExpiresAt).getTime() - Date.now()) / 1000)
      );
      setQuoteSecondsLeft(diff);

      if (diff <= 0) {
        setIsQuoteExpired(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [quoteExpiresAt]);

  const handleCountryChange = (country: "GB" | "EU" | "UNSUPPORTED") => {
    setDestinationCountry(country);
    if (country === "GB") {
      setResolvedRecipient("Arthur Pendelton");
      setSortCode("40-22-18");
      setAccountNumber("88291044");
    } else if (country === "EU") {
      setResolvedRecipient("Kafé Artisan Berlin");
      setIban("DE89 1004 0000 0123 4567 89");
    } else {
      setResolvedRecipient(null);
    }
  };

  const handleAuthorize = async () => {
    if (isQuoteExpired) {
      setAuthError("Quote has expired. Please refresh the quote to proceed.");
      return;
    }

    setIsAuthorizing(true);
    setAuthError(null);

    const destinationCurrency = destinationCountry === "GB" ? "GBP" : "EUR";
    const bankOrProvider =
      destinationCountry === "GB"
        ? routeMode === "direct_ilp"
          ? "Barclays Direct ILP Endpoint"
          : "UK Faster Payments Partner"
        : routeMode === "direct_ilp"
        ? "SEPA Direct Interledger Endpoint"
        : "Eurozone Clearing Partner";

    const recipientIdentifier =
      destinationCountry === "GB"
        ? `Sort ${sortCode} • Acct ${accountNumber}`
        : iban;

    const recipientName = resolvedRecipient || "International Beneficiary";

    const res = await sendPayment({
      recipientIdentifier,
      recipientName,
      amountNgn: ngnEquivalent,
      destinationType: "international_bank",
      destinationBankOrProvider: bankOrProvider,
      destinationAmount: parsedFx,
      destinationCurrency,
      quoteId: quoteId || undefined,
    });

    setIsAuthorizing(false);

    if (!res.success) {
      setAuthError(res.error || "Transfer failed to process.");
      return;
    }

    setTransferResult({
      reference: res.reference,
      recipient: recipientName,
    });

    setTransferSettled(true);
  };

  const handleReset = () => {
    setAuthModalOpen(false);
    setTransferSettled(false);
    setTransferResult(null);
    setAuthError(null);
  };

  return (
    <AppLayoutClient
      title="International Transfer"
      subtitle="Cross-Border Value Movement via Open Payments & Partner Rails"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Architecture Notice Banner */}
        <div className="rounded-2xl bg-midnight-950 p-4 sm:p-5 text-white border border-midnight-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-electric-cobalt/20 text-electric-cobalt shrink-0 mt-0.5">
              <Layers className="w-5 h-5 text-acid-lime" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-acid-lime font-bold">
                Cross-Border Settlement Routing
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                Direct Open Payments value movement between currency corridors. External commercial bank delivery operates through licensed partner clearing rails.
              </p>
            </div>
          </div>
          <Badge variant="lime" size="sm" className="shrink-0 self-start sm:self-center">
            Test Environment • Play Money
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <Card variant="white" className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-midnight-950 font-sans">
                  Destination Country & Corridor
                </h2>
                <p className="text-xs text-slate-500">
                  Select corridor to adapt clearing parameters
                </p>
              </div>

              {/* Corridor Country Selector */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleCountryChange("GB")}
                  className={`py-3 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                    destinationCountry === "GB"
                      ? "border-electric-cobalt bg-electric-cobalt/5 text-midnight-950 shadow-sm"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span className="text-lg">🇬🇧</span>
                  <span>United Kingdom (GBP)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCountryChange("EU")}
                  className={`py-3 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                    destinationCountry === "EU"
                      ? "border-electric-cobalt bg-electric-cobalt/5 text-midnight-950 shadow-sm"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span className="text-lg">🇪🇺</span>
                  <span>Eurozone (EUR)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCountryChange("UNSUPPORTED")}
                  className={`py-3 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                    destinationCountry === "UNSUPPORTED"
                      ? "border-amber-500 bg-amber-50 text-amber-900"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span className="text-lg">🌐</span>
                  <span>Other / Offline</span>
                </button>
              </div>

              {/* Quick Select International Beneficiaries */}
              {destinationCountry !== "UNSUPPORTED" && (
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-slate-500 uppercase font-semibold">
                    Quick Select Demo Beneficiary:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {destinationCountry === "GB" ? (
                      <button
                        type="button"
                        onClick={() => {
                          setResolvedRecipient("Arthur Pendelton");
                          setSortCode("40-22-18");
                          setAccountNumber("88291044");
                        }}
                        className="p-2.5 rounded-xl border border-slate-200 text-left hover:border-electric-cobalt hover:bg-electric-cobalt/5 transition-all text-xs"
                      >
                        <p className="font-bold text-midnight-950">Arthur Pendelton (London, UK)</p>
                        <p className="text-[10px] text-slate-500 font-mono">Barclays • 40-22-18 • 88291044</p>
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setResolvedRecipient("Kafé Artisan Berlin");
                            setIban("DE89 1004 0000 0123 4567 89");
                          }}
                          className="p-2.5 rounded-xl border border-slate-200 text-left hover:border-electric-cobalt hover:bg-electric-cobalt/5 transition-all text-xs"
                        >
                          <p className="font-bold text-midnight-950">Kafé Artisan Berlin (Merchant)</p>
                          <p className="text-[10px] text-slate-500 font-mono">Commerzbank • DE89•••4012</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setResolvedRecipient("Helena Schmidt");
                            setIban("DE89 3704 0044 0532 0130 00");
                          }}
                          className="p-2.5 rounded-xl border border-slate-200 text-left hover:border-electric-cobalt hover:bg-electric-cobalt/5 transition-all text-xs"
                        >
                          <p className="font-bold text-midnight-950">Helena Schmidt (Munich)</p>
                          <p className="text-[10px] text-slate-500 font-mono">Deutsche Bank • DE89•••3000</p>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Unsupported corridor fallback state */}
              {destinationCountry === "UNSUPPORTED" ? (
                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-3">
                  <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
                  <h4 className="text-sm font-bold text-amber-950">
                    Corridor Not Available in Test Environment
                  </h4>
                  <p className="text-xs text-amber-800 leading-relaxed max-w-sm mx-auto">
                    The requested corridor is not configured in this test environment. Please select United Kingdom (GBP) or Eurozone (EUR) to continue.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCountryChange("GB")}
                    className="border-amber-300 bg-white text-amber-950 hover:bg-amber-100"
                  >
                    Switch to United Kingdom
                  </Button>
                </div>
              ) : (
                <>
                  {/* UK Adaptive Fields */}
                  {destinationCountry === "GB" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Sort Code (6 Digits)"
                          value={sortCode}
                          onChange={(e) => setSortCode(e.target.value)}
                          placeholder="e.g. 40-22-18"
                          helperText="UK clearing sort code"
                        />
                        <Input
                          label="Account Number (8 Digits)"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          placeholder="e.g. 88291044"
                          helperText="UK beneficiary account"
                        />
                      </div>

                      {resolvedRecipient && (
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between text-xs font-mono text-slate-700">
                            <span className="flex items-center gap-1 font-bold">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              SELECTED RECIPIENT
                            </span>
                            <span>Barclays Bank UK (Demo)</span>
                          </div>
                          <p className="text-base font-black text-midnight-950 font-sans">
                            {resolvedRecipient}
                          </p>
                          <p className="text-xs text-slate-500 font-mono">
                            Sort Code {sortCode} • Account {accountNumber}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* EU Adaptive Fields */}
                  {destinationCountry === "EU" && (
                    <div className="space-y-4">
                      <Input
                        label="Beneficiary IBAN"
                        value={iban}
                        onChange={(e) => setIban(e.target.value)}
                        placeholder="DE89..."
                        helperText="European International Bank Account Number"
                      />
                      <Input
                        label="BIC / SWIFT Code (Optional for SEPA)"
                        defaultValue="DEUTDEDDFXX"
                        placeholder="e.g. DEUT..."
                      />
                      {resolvedRecipient && (
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between text-xs font-mono text-slate-700">
                            <span className="flex items-center gap-1 font-bold">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              SELECTED RECIPIENT
                            </span>
                            <span>Eurozone Commercial Endpoint</span>
                          </div>
                          <p className="text-base font-black text-midnight-950 font-sans">
                            {resolvedRecipient}
                          </p>
                          <p className="text-xs text-slate-500 font-mono">
                            IBAN: {iban}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Transfer Amount Input */}
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <Input
                      label={
                        destinationCountry === "GB"
                          ? "Beneficiary Receives (GBP)"
                          : "Beneficiary Receives (EUR)"
                      }
                      value={fxAmount}
                      onChange={(e) => setFxAmount(e.target.value)}
                      placeholder="0.00"
                      leftAddon={
                        <span className="font-bold text-slate-500">
                          {destinationCountry === "GB" ? "£" : "€"}
                        </span>
                      }
                      helperText={`Sender: ${currentUser.name} (Available: ₦${currentUser.availableBalanceNgn.toLocaleString()})`}
                    />
                  </div>

                  {/* Route Topology Selector */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                        Clearing Route Mode
                      </label>
                      <span className="text-[11px] font-mono text-slate-500">
                        Configured Settlement Path
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRouteMode("direct_ilp")}
                        className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                          routeMode === "direct_ilp"
                            ? "border-electric-cobalt bg-electric-cobalt/5 shadow-sm"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-midnight-950">Mode 1: Direct ILP</span>
                          {routeMode === "direct_ilp" && <Check className="w-3.5 h-3.5 text-electric-cobalt" />}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          Direct Open Payments peer connector endpoint.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRouteMode("payout_partner")}
                        className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                          routeMode === "payout_partner"
                            ? "border-electric-cobalt bg-electric-cobalt/5 shadow-sm"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-midnight-950">Mode 2: Payout Partner</span>
                          {routeMode === "payout_partner" && <Check className="w-3.5 h-3.5 text-electric-cobalt" />}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          Integrated financial provider clearing to local domestic rails.
                        </p>
                      </button>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setAuthModalOpen(true)}
                    disabled={
                      !resolvedRecipient ||
                      parsedFx <= 0 ||
                      totalDebitNgn > currentUser.availableBalanceNgn ||
                      isQuoteExpired
                    }
                    className="w-full justify-center"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    {isQuoteExpired ? "Quote Expired — Please Refresh" : "Review and Authorise Transfer"}
                  </Button>
                </>
              )}
            </Card>
          </div>

          {/* Right Live Quote & Breakdown Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Card variant="midnight" className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-midnight-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={fetchServerQuote}
                    className="p-1 hover:bg-midnight-800 rounded transition-colors"
                    title="Refresh quote"
                  >
                    <RefreshCw
                      className={`w-4 h-4 text-acid-lime ${
                        isFetchingQuote ? "animate-spin" : ""
                      }`}
                    />
                  </button>
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                    Connector FX Quote
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
                      isQuoteExpired
                        ? "text-red-400 bg-red-950/50 border-red-800"
                        : "text-acid-lime bg-midnight-900 border-midnight-800"
                    }`}
                  >
                    {isQuoteExpired ? "Expired" : `${quoteSecondsLeft}s remaining`}
                  </span>
                  {isQuoteExpired && (
                    <button
                      onClick={fetchServerQuote}
                      className="text-[10px] text-acid-lime underline font-mono hover:opacity-80"
                    >
                      Refresh
                    </button>
                  )}
                </div>
              </div>

              {/* Rate & Equivalent Box */}
              <div className="space-y-3">
                <div className="text-xs font-mono text-slate-400">
                  <span>INDICATIVE EXCHANGE RATE</span>
                  <p className="text-xl font-bold font-mono text-white mt-1">
                    1 {destinationCountry === "GB" ? "GBP" : "EUR"} = ₦{fxRate.toLocaleString("en-NG")} NGN
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Open Payments corridor quote breakdown
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-midnight-950 border border-midnight-800 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Source Funding:</span>
                    <span className="text-white font-bold">
                      {currentUser.connectedBank.bankName} ({currentUser.connectedBank.accountNumber})
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Target FX Value:</span>
                    <span className="text-white">
                      ₦{ngnEquivalent.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Veylo Platform Fee (2.0%):</span>
                    <span className="text-acid-lime">
                      ₦{veyloFeeNgn.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Partner Rail Fee:</span>
                    <span className="text-slate-400">₦0.00 (Testnet Mode)</span>
                  </div>
                  <div className="pt-2 border-t border-midnight-800 flex justify-between text-sm font-bold text-white">
                    <span>Total Debited:</span>
                    <span className="text-acid-lime text-base">
                      ₦{totalDebitNgn.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="pt-1 flex justify-between text-xs text-slate-300">
                    <span>Recipient Receives:</span>
                    <span className="font-bold text-white">
                      {destinationCountry === "GB" ? `£${parsedFx.toFixed(2)} GBP` : `€${parsedFx.toFixed(2)} EUR`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Routing Visualizer */}
              <div className="p-4 rounded-2xl bg-midnight-950 border border-midnight-800 space-y-3 text-xs">
                <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                  Settlement Topology
                </span>
                <div className="space-y-2 font-mono text-[11px]">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Sender: {currentUser.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-acid-lime">
                    <span className="w-2 h-2 rounded-full bg-acid-lime" />
                    <span>Open Payments Routing (NGN → {destinationCountry === "GB" ? "GBP" : "EUR"})</span>
                  </div>
                  <div className="flex items-center gap-2 text-electric-cobalt">
                    <span className="w-2 h-2 rounded-full bg-electric-cobalt" />
                    <span>
                      {routeMode === "direct_ilp"
                        ? `Receiving Endpoint: Direct Open Payments`
                        : `Receiving Endpoint: Local Clearing Rail`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-white" />
                    <span>
                      Beneficiary: {resolvedRecipient || "Foreign Beneficiary"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* AUTHORIZATION MODAL */}
        <Modal
          isOpen={authModalOpen}
          onClose={handleReset}
          title={transferSettled ? "Payment Cleared" : "Confirm International Transfer"}
          subtitle={
            transferSettled
              ? "Funds cleared and recorded in server ledger"
              : "Review transfer and quote details before approving"
          }
        >
          {!transferSettled ? (
            <div className="space-y-6">
              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                  {authError}
                </div>
              )}

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Sender Account:</span>
                  <span className="font-bold text-slate-900">{currentUser.name}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Recipient:</span>
                  <span className="font-bold text-slate-900">{resolvedRecipient}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Destination:</span>
                  <span className="font-mono text-slate-900">
                    {destinationCountry === "GB"
                      ? `Barclays • Sort ${sortCode} • ${accountNumber}`
                      : iban}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Exchange Rate:</span>
                  <span className="font-mono text-slate-900">
                    1 {destinationCountry === "GB" ? "GBP" : "EUR"} = ₦{fxRate.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 font-bold text-sm pt-2 border-t border-slate-200">
                  <span>Amount Debited:</span>
                  <span className="font-mono text-electric-cobalt">
                    ₦{totalDebitNgn.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Beneficiary Receives:</span>
                  <span className="font-mono">
                    {destinationCountry === "GB" ? `£${parsedFx.toFixed(2)} GBP` : `€${parsedFx.toFixed(2)} EUR`}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAuthorize}
                  isLoading={isAuthorizing}
                  disabled={isQuoteExpired}
                  className="w-full justify-center font-bold"
                  leftIcon={<ShieldCheck className="w-5 h-5 text-white" />}
                >
                  {isQuoteExpired ? "Quote Expired — Please Refresh" : "Approve International Transfer"}
                </Button>
                <p className="text-[11px] text-center text-slate-400 font-mono">
                  Test environment execution • Play money
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
                  {destinationCountry === "GB" ? `£${parsedFx.toFixed(2)} GBP` : `€${parsedFx.toFixed(2)} EUR`} Sent
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Reference: <span className="font-mono text-slate-700">{transferResult?.reference}</span>
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 text-xs text-left space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Destination:</span>
                  <span className="font-bold text-slate-900">{transferResult?.recipient}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Settlement Status:</span>
                  <span>Settled (Recorded in Server Ledger)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600 text-left space-y-1">
                <p className="font-bold text-midnight-950">✓ Server Ledger Updated</p>
                <p className="text-[11px] text-slate-500">
                  Sender balance debited. To verify the credit in {transferResult?.recipient}&apos;s account, switch persona at the bottom left.
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
                  View Activity
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AppLayoutClient>
  );
}
