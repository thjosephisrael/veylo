"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { VeyloSymbol, VeyloLogo } from "@/components/brand/VeyloLogo";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  Globe2,
  Building2,
  ChevronDown,
  Layers,
  ArrowUpRight,
  Lock,
  Smartphone,
} from "lucide-react";

export default function MarketingHomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [transferred, setTransferred] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAuthorizeTransfer = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setTransferred(true);
    }, 700);
  };

  const faqs = [
    {
      q: "Is a Veylo Account Number a real bank account?",
      a: "No. It is a secure routing identifier that maps to your existing bank account via Open Payments and Interledger nodes. You keep your money deposited in your current bank.",
    },
    {
      q: "Can merchants debit funds without my permission?",
      a: "Never. Every transaction requires your explicit out-of-band biometric approval (Face ID or Passkey) on your phone. Merchants never hold pre-authorized billing authority unless you create a mandate.",
    },
    {
      q: "How do subscriptions work with Veylo?",
      a: "You grant a specific Open Payments recurring mandate with a hard maximum cap (e.g. €15.00/mo). You can pause, adjust, or cancel it anytime in 1 tap in your app.",
    },
    {
      q: "Are there foreign exchange fees on transfers?",
      a: "Veylo charges zero network markup on Interledger routes. You see a guaranteed exchange rate with a 45-second lock timer before confirming.",
    },
    {
      q: "What happens if I type the wrong Account Number?",
      a: "Veylo Account Numbers use Luhn/Verhoeff checksum validation. Additionally, the app resolves the verified legal name of the recipient before you confirm any payment.",
    },
    {
      q: "How do merchants integrate Veylo on their checkout?",
      a: "Merchants can install our drop-in JavaScript checkout widget or use our REST APIs with HMAC SHA-256 signed webhooks. In-store merchants use countertop acrylic stands.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-[#3D5BFF] selection:text-white">
      <MarketingNavbar />

      <main className="flex-1">
        {/* ========================================================
            HERO SECTION (Exact Figma Node 51:22 / 27:2)
           ======================================================== */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Hero Typography & CTAs (Figma 51:23) */}
              <div className="lg:col-span-7 space-y-6 text-left">
                {/* Editorial Serif Heading */}
                <h1 className="text-5xl sm:text-6xl lg:text-[64px] font-normal tracking-tight text-[#111B32] font-serif leading-[1.08]">
                  <span className="[text-stroke:0.85px_#111B32] [-webkit-text-stroke:0.85px_#111B32]">
                    One identity.
                  </span> <br />
                  <span className="italic text-[#3D5BFF] [text-stroke:0.4px_#3D5BFF] [-webkit-text-stroke:0.4px_#3D5BFF]">
                    A more connected way to move money.
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-[#475569] max-w-xl leading-relaxed font-medium">
                  Use your Veylo ID to connect with participating Open Payments-enabled wallets and pay through one clear experience. Send cross-border, check out online, and manage recurring payments with zero credential exposure.
                </p>

                {/* CTA Buttons (Figma 51:29) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center justify-center font-bold rounded-[12px] px-[22px] py-[14px] text-[15px] bg-[#D8F15B] hover:bg-[#C5DE48] text-[#111B32] shadow-sm transition-all active:scale-[0.98]"
                  >
                    Claim Your Veylo Account Number →
                  </Link>
                  <Link
                    href="/demo/reelroom"
                    className="inline-flex items-center justify-center font-semibold rounded-[12px] px-[20px] py-[14px] text-[14px] bg-white border border-[#CBD5E1] text-[#111B32] hover:bg-slate-50 transition-all active:scale-[0.98]"
                  >
                    Explore Checkout Demo
                  </Link>
                </div>

                {/* Trust Points (Figma 51:34) */}
                <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-5 text-[12px] font-semibold text-[#475569]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    Verified 10-Digit Account Routing
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    Open Payments Protocol
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    Zero Card Intermediaries
                  </span>
                </div>
              </div>

              {/* Right Column: Hero Transfer Card (Exact Figma 51:38) */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-[24px] bg-[#111B32] p-7 text-white shadow-2xl border border-midnight-800 space-y-4">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[11px] font-mono font-bold tracking-wider text-[#D8F15B]">
                      TRANSFER VIA VEYLO ACCOUNT NUMBER
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#D8F15B] bg-[#0A0F1E] border border-[#D8F15B] px-2 py-0.5 rounded-[6px]">
                      45s Guaranteed Rate Lock
                    </span>
                  </div>

                  {/* Recipient Account Input Box */}
                  <div className="space-y-1.5 text-left">
                    <span className="text-[11px] font-medium text-[#94A3B8]">
                      Recipient Veylo Account Number
                    </span>
                    <div className="rounded-[12px] bg-[#0A0F1E] border border-[#334155] px-4 py-3 flex items-center justify-between">
                      <span className="text-xl font-mono font-black text-white tracking-wider">
                        849 201 9382
                      </span>
                      <span className="text-[11px] font-bold text-[#10B981] bg-[rgba(16,185,129,0.2)] px-2 py-1 rounded-[6px]">
                        ✓ Verified: Elena Rostova (@elena)
                      </span>
                    </div>
                  </div>

                  {/* Quote & Routing Details */}
                  <div className="rounded-[14px] bg-[#0A0F1E] p-4 space-y-2.5 text-xs text-left">
                    <div className="flex justify-between items-center text-[#94A3B8]">
                      <span>You Send</span>
                      <span className="font-bold text-[17px] text-white">€150.00 EUR</span>
                    </div>
                    <div className="flex justify-between items-center text-[#94A3B8]">
                      <span>Guaranteed Exchange Rate</span>
                      <span className="font-semibold text-[#EEF2FF]">1 EUR = 1.0820 USD</span>
                    </div>
                    <div className="flex justify-between items-center text-[#94A3B8]">
                      <span>Interledger Network Routing Fee</span>
                      <span className="font-bold text-[#10B981]">€0.00 (Zero Network Fee)</span>
                    </div>
                    <div className="border-t border-[#1E293B] pt-2 flex justify-between items-center text-[#D8F15B]">
                      <span className="font-bold text-[13px]">Elena Receives Instantly</span>
                      <span className="font-black font-mono text-xl text-[#D8F15B]">$162.30 USD</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={handleAuthorizeTransfer}
                    disabled={transferred || isProcessing}
                    className="w-full h-[52px] rounded-[14px] bg-[#D8F15B] hover:bg-[#C5DE48] text-[#111B32] font-bold text-[15px] flex items-center justify-center transition-all active:scale-[0.98] disabled:bg-[#10B981] disabled:text-white shadow-sm"
                  >
                    {isProcessing ? (
                      <span className="animate-spin w-5 h-5 border-2 border-[#111B32] border-t-transparent rounded-full" />
                    ) : transferred ? (
                      <span className="flex items-center gap-2 font-bold text-white">
                        <Check className="w-5 h-5 text-white stroke-[3]" />
                        Transfer Settled via Interledger (340ms)
                      </span>
                    ) : (
                      "Authorize with Passkey / Face ID"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            CORE PILLARS: WHY 10 DIGITS (Exact Figma Node 51:65)
           ======================================================== */}
        <section className="py-20 md:py-24 bg-white border-b border-[#E2E8F0]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
            <div className="space-y-2">
              <p className="text-[11px] font-mono font-bold text-[#3D5BFF] uppercase tracking-wider">
                THE VEYLO ARCHITECTURE
              </p>
              <h2 className="text-3xl sm:text-[40px] font-serif text-[#111B32]">
                Why 10 Digits Defeat 16-Digit Cards
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {/* Card 01 */}
              <div className="rounded-[20px] bg-[#F8FAFC] border-[1.5px] border-[#E2E8F0] p-7 space-y-3.5 hover:border-[#3D5BFF]/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-base font-extrabold font-mono text-[#3D5BFF]">01</span>
                  <span className="bg-white border border-[#E2E8F0] px-2 py-0.5 rounded-[6px] text-[10px] font-bold text-[#111B32]">
                    Zero Identity Exposure
                  </span>
                </div>
                <h3 className="text-[20px] font-bold text-[#111B32]">10-Digit Numeric Identifier</h3>
                <div className="inline-block bg-[#111B32] px-2.5 py-1 rounded-[6px] text-[13px] font-mono font-extrabold text-[#D8F15B]">
                  482 193 7604
                </div>
                <p className="text-[13px] text-[#475569] leading-relaxed">
                  As familiar as a phone number. Resolves through Veylo&apos;s encrypted directory service to your underlying bank or wallet without exposing your true IBAN or card PAN.
                </p>
              </div>

              {/* Card 02 */}
              <div className="rounded-[20px] bg-[#EEF2FF] border-[1.5px] border-[#3D5BFF] p-7 space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-extrabold font-mono text-[#3D5BFF]">02</span>
                  <span className="bg-white border border-[#E2E8F0] px-2 py-0.5 rounded-[6px] text-[10px] font-bold text-[#111B32]">
                    Zero Database Breach Risk
                  </span>
                </div>
                <h3 className="text-[20px] font-bold text-[#111B32]">Zero-Credential Security</h3>
                <div className="inline-block bg-[#111B32] px-2.5 py-1 rounded-[6px] text-[13px] font-mono font-extrabold text-[#D8F15B]">
                  Biometric Push Auth
                </div>
                <p className="text-[13px] text-[#475569] leading-relaxed">
                  Merchants never collect, transmit, or store your PIN, password, or security codes. Checkout requests trigger a real-time out-of-band push to your phone for Face ID approval.
                </p>
              </div>

              {/* Card 03 */}
              <div className="rounded-[20px] bg-[#F8FAFC] border-[1.5px] border-[#E2E8F0] p-7 space-y-3.5 hover:border-[#3D5BFF]/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-base font-extrabold font-mono text-[#3D5BFF]">03</span>
                  <span className="bg-white border border-[#E2E8F0] px-2 py-0.5 rounded-[6px] text-[10px] font-bold text-[#111B32]">
                    Instant Ledger Finality
                  </span>
                </div>
                <h3 className="text-[20px] font-bold text-[#111B32]">Sub-Second ILP Settlement</h3>
                <div className="inline-block bg-[#111B32] px-2.5 py-1 rounded-[6px] text-[13px] font-mono font-extrabold text-[#D8F15B]">
                  340ms Atomic Delivery
                </div>
                <p className="text-[13px] text-[#475569] leading-relaxed">
                  Direct bank-to-bank settlement over Interledger Protocol (ILP v4). Eliminates the 2-3 business day card clearance window and 3% card interchange taxes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            HOW IT WORKS: 3-STEP ADOPTION (Exact Figma Node 51:97)
           ======================================================== */}
        <section id="how-it-works" className="py-20 md:py-24 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
            <div className="space-y-2">
              <p className="text-[11px] font-mono font-bold text-[#3D5BFF] uppercase tracking-wider">
                SIMPLE 3-STEP ADOPTION
              </p>
              <h2 className="text-3xl sm:text-[40px] font-serif text-[#111B32]">
                Three simple steps. No card friction.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {/* Step 1 */}
              <div className="rounded-[20px] bg-white border border-[#E2E8F0] p-7 space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-full bg-[#D8F15B] text-[#111B32] font-bold text-[14px] flex items-center justify-center">
                    01
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#94A3B8]">INSTANT SETUP</span>
                </div>
                <h3 className="text-[18px] font-bold text-[#111B32]">Claim Your Identifier</h3>
                <p className="text-[12px] font-semibold text-[#3D5BFF]">10-Digit Account # + @handle</p>
                <p className="text-[13px] text-[#475569] leading-relaxed">
                  Download the app and instantly receive your unique 10-digit Veylo Account Number (e.g. 482 193 7604) and memorable @handle alias in under two minutes.
                </p>
              </div>

              {/* Step 2 */}
              <div className="rounded-[20px] bg-white border border-[#E2E8F0] p-7 space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-full bg-[#D8F15B] text-[#111B32] font-bold text-[14px] flex items-center justify-center">
                    02
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#94A3B8]">INSTANT SETUP</span>
                </div>
                <h3 className="text-[18px] font-bold text-[#111B32]">Link Existing Bank</h3>
                <p className="text-[12px] font-semibold text-[#3D5BFF]">Commerzbank, SEPA or GTBank</p>
                <p className="text-[13px] text-[#475569] leading-relaxed">
                  Connect your existing institutional bank account via Open Payments. Keep your money safely deposited where it is—no need to pre-fund a separate wallet.
                </p>
              </div>

              {/* Step 3 */}
              <div className="rounded-[20px] bg-white border border-[#E2E8F0] p-7 space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-full bg-[#D8F15B] text-[#111B32] font-bold text-[14px] flex items-center justify-center">
                    03
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#94A3B8]">INSTANT SETUP</span>
                </div>
                <h3 className="text-[18px] font-bold text-[#111B32]">Pay &amp; Accept Everywhere</h3>
                <p className="text-[12px] font-semibold text-[#3D5BFF]">P2P, Countertop QR &amp; Subscriptions</p>
                <p className="text-[13px] text-[#475569] leading-relaxed">
                  Share your 10 digits to receive payments, scan countertop QR codes in retail stores, or approve web checkouts with 1 tap. Instant sub-second ledger finality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            VEYLO BUSINESS: CUT 2.9% CARD INTERCHANGE (Figma 51:126)
           ======================================================== */}
        <section className="py-20 md:py-24 bg-[#111B32] text-white border-b border-midnight-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-5 text-left">
                <span className="inline-block bg-[#0A0F1E] border border-[#D8F15B] px-2.5 py-1 rounded-[6px] text-[10px] font-mono font-bold text-[#D8F15B]">
                  FOR MERCHANTS &amp; COMMERCE
                </span>

                <h2 className="text-3xl sm:text-[46px] font-serif text-white leading-tight">
                  Accept account payments. <br />
                  <span className="italic text-[#D8F15B]">Cut 2.9% card interchange.</span>
                </h2>

                <p className="text-[15px] text-[#CBD5E1] max-w-xl leading-relaxed">
                  Veylo allows merchants to accept direct customer payments online and in-store. Customers identify with their 10-digit Veylo Account Number and authorize via biometric push on their phone. Zero card scheme fees, zero chargeback fraud liability.
                </p>

                <div className="space-y-2 text-[13px] font-semibold text-[#D8F15B]">
                  <p>✓ Zero merchant credit card interchange tax (flat €0.05 / packet)</p>
                  <p>✓ Countertop QR acrylic stands instantly print &amp; deploy to physical registers</p>
                  <p>✓ Transparent Open Payments API with real-time webhooks &amp; sub-second settlement</p>
                </div>

                {/* Merchant Quote Box (Figma 51:135) */}
                <div className="rounded-[14px] bg-[#0A0F1E] border border-[#3D5BFF] p-4 space-y-1 text-left">
                  <p className="text-[12px] font-bold text-[#D8F15B]">
                    &ldquo;Veylo cut our processing costs by €3,485 in month one and eliminated card chargebacks entirely.&rdquo;
                  </p>
                  <p className="text-[11px] text-white font-medium">
                    — Markus Weber, Co-founder at Kafé Artisan Berlin GmbH
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href="/auth/register?role=merchant"
                    className="inline-flex items-center justify-center font-bold rounded-[12px] px-[22px] py-[14px] text-[14px] bg-[#D8F15B] hover:bg-[#C5DE48] text-[#111B32] transition-all active:scale-[0.98]"
                  >
                    Create Free Merchant Account →
                  </Link>
                </div>
              </div>

              {/* Right Column: Physical Acrylic Stand (Figma 51:140) */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-md rounded-[24px] bg-[#0A0F1E] border border-[#1E293B] p-6 text-center space-y-4 shadow-2xl">
                  <span className="text-[10px] font-mono font-bold text-[#D8F15B] uppercase">
                    IN-STORE PHYSICAL COUNTERTOP STAND
                  </span>

                  {/* QR Box */}
                  <div className="w-52 h-52 mx-auto rounded-[20px] bg-white border-[3px] border-[#D8F15B] flex items-center justify-center relative shadow-lg">
                    <svg width="150" height="150" viewBox="0 0 200 200" fill="none">
                      <rect width="200" height="200" fill="white" />
                      <rect x="10" y="10" width="50" height="50" rx="6" fill="#111B32" />
                      <rect x="18" y="18" width="34" height="34" rx="4" fill="white" />
                      <rect x="25" y="25" width="20" height="20" rx="2" fill="#3D5BFF" />

                      <rect x="140" y="10" width="50" height="50" rx="6" fill="#111B32" />
                      <rect x="148" y="18" width="34" height="34" rx="4" fill="white" />
                      <rect x="155" y="25" width="20" height="20" rx="2" fill="#3D5BFF" />

                      <rect x="10" y="140" width="50" height="50" rx="6" fill="#111B32" />
                      <rect x="18" y="148" width="34" height="34" rx="4" fill="white" />
                      <rect x="25" y="155" width="20" height="20" rx="2" fill="#3D5BFF" />

                      <g fill="#111B32">
                        <rect x="70" y="20" width="10" height="10" rx="1" />
                        <rect x="90" y="20" width="10" height="10" rx="1" />
                        <rect x="110" y="20" width="10" height="10" rx="1" />
                        <rect x="70" y="40" width="20" height="10" rx="1" />
                        <rect x="100" y="40" width="10" height="10" rx="1" />
                        <rect x="20" y="70" width="10" height="20" rx="1" />
                        <rect x="40" y="70" width="20" height="10" rx="1" />
                        <rect x="140" y="70" width="20" height="10" rx="1" />
                        <rect x="170" y="70" width="10" height="10" rx="1" />
                      </g>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <VeyloSymbol size={28} variant="light" />
                    </div>
                  </div>

                  {/* Merchant Account Box */}
                  <div className="rounded-[12px] bg-[#111B32] border border-[#334155] p-3 space-y-1">
                    <p className="text-[9px] font-mono font-bold text-[#94A3B8]">
                      OR ENTER MERCHANT ACCOUNT NUMBER:
                    </p>
                    <p className="text-[22px] font-mono font-black text-[#D8F15B]">
                      702 441 8900
                    </p>
                    <p className="text-[10px] text-[#CBD5E1]">
                      Kafé Artisan Berlin • Terminal POS 01
                    </p>
                  </div>

                  {/* Settlement Indicator */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[rgba(16,185,129,0.2)] text-[11px] font-bold text-[#10B981]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                    Direct Settlement to Commerzbank IBAN DE89•••4012 (340ms)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            REELROOM SHOWCASE SECTION (Figma 51:151)
           ======================================================== */}
        <section className="py-20 md:py-24 bg-[#0C0D12] text-white border-b border-slate-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-5 text-left">
                <span className="inline-block bg-[#E50914] px-2 py-1 rounded-[4px] text-[9px] font-bold text-white uppercase tracking-wider">
                  FEATURED 3RD-PARTY CHECKOUT DEMO
                </span>

                <h2 className="text-3xl sm:text-[42px] font-serif text-white leading-tight">
                  Subscribe to ReelRoom Cinema <br />
                  <span className="italic text-[#3D5BFF]">With Zero Card Details</span>
                </h2>

                <p className="text-[14px] text-[#94A3B8] max-w-xl leading-relaxed">
                  See how real-world subscription services integrate Veylo. Customers authorize a recurring Open Payments mandate for €12.99/mo on Cinema Pro 4K without storing a credit card on file. Users retain 100% control to pause or revoke mandates directly in their Veylo app.
                </p>

                <div className="space-y-2 text-[12px] font-semibold text-[#D8F15B]">
                  <p>✓ Out-of-band push authorization eliminates card theft and credential scraping</p>
                  <p>✓ Billed autonomously on 1st of every month via atomic Interledger packets</p>
                  <p>✓ 1-click mandate cancellation stops zombie subscription charges instantly</p>
                </div>

                <div className="pt-2">
                  <Link
                    href="/demo/reelroom"
                    className="inline-flex items-center justify-center font-bold rounded-[10px] px-[20px] py-[12px] text-[13px] bg-[#3D5BFF] hover:bg-[#2E49E6] text-white transition-all active:scale-[0.98]"
                  >
                    Try Interactive ReelRoom Checkout Demo →
                  </Link>
                </div>
              </div>

              {/* Right Column: Mandate Preview Card (Figma 51:162) */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-md rounded-[20px] bg-[#161822] border-[1.5px] border-[#D8F15B] p-6 space-y-4 shadow-2xl text-left">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[11px] font-mono font-bold text-[#D8F15B]">
                      REELROOM CINEMA PRO • ORDER #RR-88491
                    </span>
                    <span className="bg-[#3D5BFF] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-[4px]">
                      MANDATE ACTIVE
                    </span>
                  </div>

                  <div className="rounded-[12px] bg-[#0E1018] p-4 space-y-2.5 text-xs font-mono">
                    <div className="flex justify-between items-center text-white">
                      <span className="font-bold text-[14px]">Cinema Pro 4K HDR (Monthly)</span>
                      <span className="font-black text-[18px]">€12.99 / mo</span>
                    </div>
                    <div className="flex justify-between items-center text-[#94A3B8]">
                      <span>Payer Veylo Account</span>
                      <span className="font-bold text-[#D8F15B]">482 193 7604 (@tomiade)</span>
                    </div>
                    <div className="flex justify-between items-center text-[#94A3B8]">
                      <span>Protocol Mandate ID</span>
                      <span className="text-[#EEF2FF]">mandate_op_9942a7bc</span>
                    </div>
                  </div>

                  {/* Push Handshake Pill (Figma 51:177) */}
                  <div className="rounded-[12px] bg-[#111B32] border border-[#334155] p-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#D8F15B] text-[#111B32] flex items-center justify-center text-lg shrink-0">
                      📲
                    </div>
                    <div className="text-left space-y-0.5">
                      <p className="text-[12px] font-bold text-[#D8F15B]">
                        Push Handshake Sent to iPhone 15 Pro
                      </p>
                      <p className="text-[11px] text-[#CBD5E1]">
                        Tomi approved €12.99/mo mandate via Face ID in Veylo App
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            FAQ SECTION (Exact Figma 51:183)
           ======================================================== */}
        <section className="py-20 md:py-24 bg-white border-b border-[#E2E8F0]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-2">
              <p className="text-[11px] font-mono font-bold text-[#3D5BFF] uppercase tracking-wider">
                FREQUENTLY ASKED QUESTIONS
              </p>
              <h2 className="text-3xl sm:text-[40px] font-serif text-[#111B32]">
                Everything You Need to Know
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] p-5 space-y-2 text-left"
                >
                  <p className="text-[14px] font-bold text-[#111B32] font-sans">
                    {faq.q}
                  </p>
                  <p className="text-[12px] text-[#475569] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
