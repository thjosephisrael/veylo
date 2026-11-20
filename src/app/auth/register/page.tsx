"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { VeyloLogo } from "@/components/brand/VeyloLogo";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAccount } from "@/context/AccountContext";
import {
  ArrowRight,
  ArrowLeft,
  User,
  Building2,
  Mail,
  ShieldCheck,
  AlertCircle,
  Globe,
  Lock,
} from "lucide-react";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { switchUser } = useAccount();

  const initialRole = searchParams.get("role") === "merchant" || searchParams.get("type") === "business"
    ? "business"
    : "consumer";

  const [accountType, setAccountType] = useState<"consumer" | "business">(initialRole);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");
  const [country, setCountry] = useState("NG");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const roleParam = searchParams.get("role") || searchParams.get("type");
    if (roleParam === "merchant" || roleParam === "business") {
      setAccountType("business");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg("Please enter your legal name or business entity name.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName.trim(),
          email: email.trim(),
          role: accountType,
          handle: handle.trim() ? handle.trim().replace(/^@/, "") : undefined,
          location:
            country === "GB"
              ? "London, United Kingdom"
              : country === "DE"
              ? "Berlin, Germany"
              : country === "US"
              ? "New York, United States"
              : "Lagos, Nigeria",
          currency: country === "GB" ? "GBP" : country === "DE" ? "EUR" : "NGN",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Registration failed. Please check your details.");
        setIsLoading(false);
        return;
      }

      // Switch context to newly created user
      await switchUser(data.user.id);

      // Route to dashboard
      if (accountType === "business") {
        router.push("/business");
      } else {
        router.push("/app");
      }
    } catch {
      setErrorMsg("Unable to connect to registration server. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-[#3D5BFF] selection:text-white">
      {/* Header */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between pb-6">
        <VeyloLogo variant="light" size="sm" href="/" />
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-midnight-950 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Registration Card */}
      <main className="max-w-md mx-auto w-full my-auto">
        <Card variant="white" className="p-6 sm:p-8 shadow-sm border border-slate-200 rounded-3xl space-y-6">
          <div className="space-y-1.5 text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-sans text-midnight-950 tracking-tight">
              {accountType === "business" ? "Create Merchant Account" : "Open your Veylo Account"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {accountType === "business"
                ? "Accept customer account payments with zero card interchange fees."
                : "Get a memorable 10-digit account identity for global payments."}
            </p>
          </div>

          {/* Account Type Selector */}
          <div className="flex p-1 bg-slate-100 rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => setAccountType("consumer")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                accountType === "consumer"
                  ? "bg-white text-midnight-950 shadow-sm"
                  : "text-slate-600 hover:text-midnight-950"
              }`}
            >
              <User className="w-3.5 h-3.5 text-[#3D5BFF]" />
              <span>Personal</span>
            </button>
            <button
              type="button"
              onClick={() => setAccountType("business")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                accountType === "business"
                  ? "bg-white text-midnight-950 shadow-sm"
                  : "text-slate-600 hover:text-midnight-950"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-[#3D5BFF]" />
              <span>Merchant / Business</span>
            </button>
          </div>

          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={accountType === "business" ? "Registered Business Entity Name" : "Legal Full Name"}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={accountType === "business" ? "e.g. Acme Coffee Roasters GmbH" : "e.g. Alexandra Chen"}
              required
            />

            <Input
              label={accountType === "business" ? "Business Email Address" : "Email Address"}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alexandra@example.com"
              leftAddon={<Mail className="w-4 h-4 text-slate-400" />}
              required
            />

            <Input
              label="Choose your Veylo Handle (Optional)"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="e.g. alexandra"
              leftAddon={<span className="font-bold text-slate-400">@</span>}
              helperText="Public directory identifier for direct peer transfers"
            />

            {/* Country / Corridor */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
                Country / Primary Currency
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3D5BFF]"
              >
                <option value="NG">Nigeria (NGN - ₦)</option>
                <option value="GB">United Kingdom (GBP - £)</option>
                <option value="DE">Eurozone (EUR - €)</option>
                <option value="US">United States (USD - $)</option>
              </select>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full justify-center"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {accountType === "business" ? "Create Merchant Account" : "Open Veylo Account"}
            </Button>
          </form>

          <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#3D5BFF] font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="max-w-md mx-auto w-full text-center text-xs text-slate-400 py-4 font-mono">
        © 2026 Veylo Network • Open Payments Infrastructure
      </footer>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
      <RegisterContent />
    </Suspense>
  );
}
