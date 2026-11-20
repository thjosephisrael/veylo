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
  const { currentUser } = useAccount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUser.veyloAccountNumber.replace(/\s+/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
