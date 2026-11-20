"use client";

import React, { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Copy, Check, ShieldCheck } from "lucide-react";
import { VeyloSymbol } from "@/components/brand/VeyloLogo";
import { useAccount } from "@/context/AccountContext";
import { QrCode } from "@/components/ui/QrCode";

interface AppLayoutClientProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AppLayoutClient: React.FC<AppLayoutClientProps> = ({
  children,
  title = "Overview",
  subtitle = "Veylo Account & Interoperable Rails",
}) => {
  const { currentUser, receivePayment } = useAccount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);
  const [receiveSuccessMessage, setReceiveSuccessMessage] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUser.veyloAccountNumber.replace(/\s+/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateReceive = async (amount: number) => {
    setIsReceiving(true);
    setReceiveSuccessMessage(null);
    const res = await receivePayment(amount, "Open Payments Interledger Testnet");
    setIsReceiving(false);
    if (res.success) {
      setReceiveSuccessMessage(`+₦${amount.toLocaleString()} credited successfully via Open Payments!`);
      setTimeout(() => setReceiveSuccessMessage(null), 4000);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <AppSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          title={title}
          subtitle={subtitle}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenQrModal={() => setQrModalOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Shared Account QR Modal */}
      <Modal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title="Your Veylo Payment QR"
        subtitle="Any Open Payments or Veylo user can scan to resolve your identity instantly"
      >
        <div className="flex flex-col items-center text-center p-4 space-y-5">
          {/* Scannable Real Standards-Compliant QR Code */}
          <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-md">
            <QrCode
              value={currentUser.openPaymentsAddress}
              size={200}
              showCenterLogo={true}
            />
          </div>

          {/* Account Details */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-mono">
              <span>VEYLO ACCOUNT NUMBER</span>
              <ShieldCheck className="w-3.5 h-3.5 text-electric-cobalt" />
            </div>
            <p className="text-2xl font-black font-mono tracking-wider text-midnight-950">
              {currentUser.veyloAccountNumber}
            </p>
            <p className="text-sm font-semibold text-slate-700">
              {currentUser.name} <span className="text-slate-400 font-normal">({currentUser.handle})</span>
            </p>
            <p className="text-[11px] font-mono text-[#3D5BFF] pt-1">
              {currentUser.openPaymentsAddress}
            </p>
          </div>

          {/* Quick Inbound Payment Simulation Box */}
          <div className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider">
                Simulate Inbound Payment (Testnet)
              </span>
              <span className="text-[10px] font-mono text-[#3D5BFF] bg-[#3D5BFF]/10 px-2 py-0.5 rounded-full font-bold">
                Instant Credit
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Receive test funds directly into your account to verify real-time balance updates and activity feeds:
            </p>
            {receiveSuccessMessage && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-1.5 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{receiveSuccessMessage}</span>
              </div>
            )}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={isReceiving}
                onClick={() => handleSimulateReceive(25000)}
                className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:border-[#3D5BFF] text-xs font-mono font-bold text-[#111B32] hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-50 text-center"
              >
                +₦25,000
              </button>
              <button
                type="button"
                disabled={isReceiving}
                onClick={() => handleSimulateReceive(50000)}
                className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:border-[#3D5BFF] text-xs font-mono font-bold text-[#111B32] hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-50 text-center"
              >
                +₦50,000
              </button>
              <button
                type="button"
                disabled={isReceiving}
                onClick={() => handleSimulateReceive(100000)}
                className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:border-[#3D5BFF] text-xs font-mono font-bold text-[#111B32] hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-50 text-center"
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
              onClick={handleCopy}
              leftIcon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              className="flex-1"
            >
              {copied ? "Copied" : "Copy Account Number"}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setQrModalOpen(false)}
              className="flex-1"
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
