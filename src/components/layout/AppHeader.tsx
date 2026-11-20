"use client";

import React from "react";
import Link from "next/link";
import { Menu, QrCode, LogOut } from "lucide-react";
import { useAccount } from "@/context/AccountContext";
import { Button } from "@/components/ui/Button";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileMenu?: () => void;
  onOpenQrModal?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  onOpenMobileMenu,
  onOpenQrModal,
}) => {
  const { currentUser, testnetStatus } = useAccount();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E2E8F0] bg-white/95 px-4 md:px-8 backdrop-blur-md">
      {/* Left title and hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 text-slate-600 hover:text-slate-900 lg:hidden rounded-lg hover:bg-slate-100"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg md:text-xl font-bold text-[#111B32] font-sans tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {onOpenQrModal && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenQrModal}
            leftIcon={<QrCode className="w-3.5 h-3.5 text-[#111B32]" />}
            className="hidden sm:inline-flex"
          >
            My QR
          </Button>
        )}

        {/* Truthful Environment Status Pill */}
        <div className="hidden lg:flex items-center gap-2 bg-[#F1F5F9] border border-[#E2E8F0] rounded-full px-3 py-1">
          <span
            className={`w-2 h-2 rounded-full ${
              testnetStatus.isConfigured
                ? "bg-[#10B981] animate-pulse"
                : "bg-amber-500"
            }`}
          />
          <span className="text-[11px] font-mono font-medium text-slate-700">
            {testnetStatus.isConfigured
              ? "Open Payments Testnet"
              : "Test Environment • Play Money"}
          </span>
        </div>

        {/* Clean, Non-Intrusive Active User Identity Badge */}
        <Link
          href="/app/account"
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 transition-all shadow-sm group"
          title="View Account Details"
        >
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300 group-hover:ring-[#3D5BFF] transition-all"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#10B981] rounded-full border border-white" />
          </div>

          <div className="text-left hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#111B32] group-hover:text-[#3D5BFF] transition-colors">
                {currentUser.name}
              </span>
              <span className="text-[9px] font-mono font-bold uppercase text-[#3D5BFF] bg-[#3D5BFF]/10 px-1.5 py-0.2 rounded">
                {currentUser.role}
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-500">
              {currentUser.currency === "NGN"
                ? `₦${currentUser.availableBalanceNgn.toLocaleString("en-NG")}`
                : currentUser.currency === "GBP"
                ? `£${currentUser.foreignBalance?.amount.toLocaleString("en-GB")}`
                : `€${currentUser.foreignBalance?.amount.toLocaleString("de-DE")}`}
            </p>
          </div>
        </Link>

        {/* Sign Out Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            window.location.href = "/auth/login";
          }}
          leftIcon={<LogOut className="w-3.5 h-3.5 text-slate-500" />}
          className="text-slate-700 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50"
        >
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </header>
  );
};
