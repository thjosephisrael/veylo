"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VeyloLogo, VeyloSymbol } from "@/components/brand/VeyloLogo";
import { Menu, X } from "lucide-react";

export const MarketingNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Personal", href: "/app" },
    { label: "Business", href: "/business" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Security", href: "/demo/checkout-architecture" },
    { label: "About", href: "/#about" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E2E8F0] bg-white">
      <div className="mx-auto flex h-[80px] max-w-[1440px] items-center justify-between px-6 sm:px-12">
        {/* Brand (Figma 51:4) */}
        <div className="flex items-center gap-2.5">
          <Link href="/" className="flex items-center gap-2.5 focus:outline-none">
            <div className="w-8 h-8 rounded-[8px] bg-[#D8F15B] flex items-center justify-center font-extrabold text-[20px] text-[#111B32] font-sans">
              V
            </div>
            <span className="font-extrabold text-[20px] tracking-wider text-[#111B32] font-sans">
              VEYLO
            </span>
          </Link>
        </div>

        {/* Center Desktop Links (Figma 51:8) */}
        <nav className="hidden lg:flex items-center gap-8 text-[14px]">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-medium text-[#475569] hover:text-[#111B32] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right CTA Area (Figma 51:15) */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-[14px] font-semibold text-[#111B32] hover:text-[#3D5BFF] transition-colors px-2"
          >
            Sign In
          </Link>

          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-[10px] bg-[#3D5BFF] hover:bg-[#2E49E6] text-white font-bold text-[13px] shadow-sm transition-all active:scale-[0.98]"
          >
            Open Account
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-700 hover:text-slate-900 lg:hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E2E8F0] bg-white px-6 py-4 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-sm font-semibold text-[#475569] hover:text-[#111B32]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/auth/login"
              className="py-2.5 text-center text-sm font-bold text-[#111B32] bg-slate-100 rounded-xl"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="py-2.5 text-center text-sm font-bold text-white bg-[#3D5BFF] rounded-xl"
            >
              Open Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
