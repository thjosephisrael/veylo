"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VeyloLogo } from "@/components/brand/VeyloLogo";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { NIGERIAN_BANKS } from "@/data/mockData";
import { useAccount } from "@/context/AccountContext";
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  UserCheck,
  Lock,
  Sparkles,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { currentUser } = useAccount();
  const [step, setStep] = useState(1);

  // Form State
  const [handle, setHandle] = useState(currentUser.handle.replace("@", ""));
  const [selectedBank, setSelectedBank] = useState("gtb");
  const [bankAccount, setBankAccount] = useState("0123456789");
  const [resolvedBankHolder, setResolvedBankHolder] = useState(currentUser.name);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsVerifying(true);
      setTimeout(() => {
        router.push("/app");
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-8 font-sans">
      <header className="max-w-xl mx-auto w-full flex items-center justify-between pb-6">
        <VeyloLogo variant="light" size="sm" href="/" />
        <span className="text-xs font-mono font-semibold text-slate-500">
          Step {step} of 3
        </span>
      </header>

      <main className="max-w-xl mx-auto w-full my-auto">
        <Card variant="white" className="p-8 sm:p-10 shadow-xl space-y-8">
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-electric-cobalt transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {/* Step 1: Claim Identity */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="lime" size="sm">
                  Identity Assignment
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-black font-sans text-midnight-950">
                  Claim your Veylo Account
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Every Veylo member receives a memorable 10-digit account number that acts as your universal Open Payments address.
                </p>
              </div>

              {/* Reserved Account Number Box */}
              <div className="p-5 rounded-2xl bg-midnight-950 text-white space-y-2">
                <span className="text-[10px] font-mono uppercase text-acid-lime font-bold">
                  Reserved Account Number
                </span>
                <p className="text-3xl font-mono font-black tracking-widest text-white">
                  {currentUser.veyloAccountNumber}
                </p>
                <p className="text-xs text-slate-400">
                  Assigned deterministically based on your registered credentials.
                </p>
              </div>

              <Input
                label="Choose your Veylo Handle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                leftAddon={<span className="font-bold text-slate-400">@</span>}
                helperText={`Public identifier for peer transfers: veylo.me/@${handle || "username"}`}
              />

              <Button
                variant="primary"
                size="lg"
                onClick={handleNextStep}
                className="w-full justify-center"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Bank Linking
              </Button>
            </div>
          )}

          {/* Step 2: Connect Bank */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="cobalt" size="sm">
                  Funding & Payout Rail
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-black font-sans text-midnight-950">
                  Connect your Nigerian bank
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Link your existing commercial bank account. Funds sent to your Veylo account will automatically sweep here.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
                    Commercial Bank
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

                <Input
                  label="10-Digit NUBAN Account Number"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  verified={!!resolvedBankHolder}
                />

                {resolvedBankHolder && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
                    <div className="flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Verified Beneficiary Name:</span>
                    </div>
                    <p className="text-sm font-black text-emerald-950">{resolvedBankHolder}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleNextStep}
                  className="flex-1 justify-center"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Authorize Link
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Security & Passkey */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="lime" size="sm">
                  Cryptographic Passkey
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-black font-sans text-midnight-950">
                  Enable device security
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Veylo uses hardware-bound passkeys and biometric authorization instead of static debit card PINs.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-electric-cobalt/10 text-electric-cobalt flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-midnight-950">Face ID / Touch ID Ready</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Transactions over your defined spending limits will prompt your device&apos;s biometric sensor.
                  </p>
                </div>
              </div>

              <Button
                variant="lime"
                size="lg"
                onClick={handleNextStep}
                isLoading={isVerifying}
                className="w-full justify-center font-bold"
                leftIcon={<Sparkles className="w-5 h-5 text-midnight-950" />}
              >
                Complete Setup & Launch Veylo
              </Button>
            </div>
          )}
        </Card>
      </main>

      <footer className="max-w-xl mx-auto w-full text-center text-xs text-slate-400">
        © 2026 Veylo Inc. Connected to Open Payments.
      </footer>
    </div>
  );
}
