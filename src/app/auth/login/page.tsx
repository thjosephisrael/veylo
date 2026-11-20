"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VeyloLogo } from "@/components/brand/VeyloLogo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useAccount } from "@/context/AccountContext";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  User,
  Store,
  Globe,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { allUsers, switchUser } = useAccount();

  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  // Authenticate via server session API
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanInput = identifier.trim();
    if (!cleanInput) {
      setErrorMsg("Please enter your Veylo ID, handle, or email address.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: cleanInput }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(
          data.error ||
            "No account found matching this Veylo ID or email. Please check your credentials or explore the demo."
        );
        setIsLoading(false);
        return;
      }

      // Switch context to returned user
      await switchUser(data.user.id);
      router.push("/app");
    } catch {
      setErrorMsg("Unable to connect to authentication server. Please try again.");
      setIsLoading(false);
    }
  };

  // Select demo persona via server session
  const handleSelectDemo = async (userId: string) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/demo-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to initialize demo session.");
        setIsLoading(false);
        return;
      }

      await switchUser(data.user.id);
      setDemoModalOpen(false);
      router.push("/app");
    } catch {
      setErrorMsg("Failed to start demo session.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-[#3D5BFF] selection:text-white">
      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-200">
        <VeyloLogo variant="light" size="sm" href="/" />

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-midnight-950 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="max-w-md mx-auto w-full my-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111B32] font-sans tracking-tight">
              Sign in to Veylo
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              One identity. A more connected way to move money.
            </p>
          </div>

          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <Input
              label="Veylo ID, Handle, or Email"
              type="text"
              placeholder="e.g. 482 193 7604 or @tomiade"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              helperText="Use your 10-digit Veylo Account Pass or registered handle"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          {/* Restrained Demo Explore Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-mono">
                or
              </span>
            </div>
          </div>

          {/* Understated Explore Demo Action */}
          <div className="text-center">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setDemoModalOpen(true)}
              className="w-full text-slate-700 hover:text-[#111B32] hover:border-slate-300"
              leftIcon={<Sparkles className="w-4 h-4 text-[#3D5BFF]" />}
            >
              Explore Demo Workspaces
            </Button>
            <p className="text-[11px] text-slate-400 pt-2 font-mono">
              Seeded sample accounts for hackathon review
            </p>
          </div>
        </div>
      </main>

      {/* Demo Selector Modal */}
      <Modal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        title="Select Demo Workspace"
        subtitle="Choose a sample persona to test sender, receiver, and merchant flows"
      >
        <div className="space-y-3 p-2">
          {allUsers.map((user) => {
            const isSender = user.role === "consumer" && user.id === "usr_tomi";
            const isMerchant = user.role === "business";
            const isIntl = user.role === "international";

            return (
              <button
                key={user.id}
                onClick={() => handleSelectDemo(user.id)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-[#3D5BFF] hover:bg-slate-50 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 group-hover:ring-2 group-hover:ring-[#3D5BFF] transition-all"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#111B32] group-hover:text-[#3D5BFF] transition-colors">
                        {user.name}
                      </span>
                      <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {isSender
                          ? "Primary Sender"
                          : isMerchant
                          ? "Merchant"
                          : isIntl
                          ? "Cross-Border"
                          : "Recipient"}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-500">
                      {user.veyloAccountNumber} • {user.handle}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-mono font-bold text-[#111B32]">
                    {user.currency === "NGN"
                      ? `₦${user.availableBalanceNgn.toLocaleString("en-NG")}`
                      : user.currency === "GBP"
                      ? `£${user.foreignBalance?.amount.toLocaleString("en-GB")}`
                      : `€${user.foreignBalance?.amount.toLocaleString("de-DE")}`}
                  </p>
                  <span className="text-[11px] text-[#3D5BFF] font-medium group-hover:underline">
                    Select &rarr;
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Modal>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center text-xs text-slate-400 py-4 font-mono">
        <p>Veylo Network • Open Payments / Interledger Hackathon Demo</p>
      </footer>
    </div>
  );
}
