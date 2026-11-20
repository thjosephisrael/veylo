"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayoutClient } from "@/components/layout/AppLayoutClient";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Building2,
  TrendingUp,
  CreditCard,
  QrCode,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Code2,
  ExternalLink,
} from "lucide-react";

export default function BusinessMerchantDashboardPage() {
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText("vyl_live_sec_8849201948201fa49bc0");
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  return (
    <AppLayoutClient
      title="Veylo Business Suite"
      subtitle="Direct Account Payments • 0% Card Interchange • Instant Settlement"
    >
      <div className="space-y-8 max-w-6xl">
        {/* Merchant Hero Banner */}
        <div className="rounded-3xl bg-midnight-950 p-6 md:p-8 text-white border border-midnight-800 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="lime" size="sm">
                  Verified Merchant
                </Badge>
                <span className="text-xs font-mono text-slate-400">
                  ID: VYL-MCH-88210
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black font-sans text-white">
                Reelroom Indie Cinema
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Settling direct to Access Bank PLC ••4410 via Open Payments rail
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                href="/business/stand"
                variant="lime"
                size="md"
                leftIcon={<QrCode className="w-4 h-4 text-midnight-950" />}
                className="font-bold text-midnight-950"
              >
                In-Store POS Stand Simulator
              </Button>
              <Button
                href="/security"
                variant="outline-dark"
                size="md"
                rightIcon={<ExternalLink className="w-4 h-4 text-acid-lime" />}
              >
                API &amp; Settlement Architecture
              </Button>
            </div>
          </div>
        </div>

        {/* Business Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="white" className="space-y-2">
            <span className="text-xs font-mono text-slate-500 uppercase">30-Day Volume</span>
            <p className="text-3xl font-black font-mono text-midnight-950">
              ₦14,820,500.00
            </p>
            <p className="text-xs text-emerald-600 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              +28.4% vs last month
            </p>
          </Card>

          <Card variant="white" className="space-y-2">
            <span className="text-xs font-mono text-slate-500 uppercase">Card Interchange Saved</span>
            <p className="text-3xl font-black font-mono text-electric-cobalt">
              ₦429,794.50
            </p>
            <p className="text-xs text-slate-500">
              Zero 2.9% Visa / Mastercard fee loss
            </p>
          </Card>

          <Card variant="white" className="space-y-2">
            <span className="text-xs font-mono text-slate-500 uppercase">Active Subscribers</span>
            <p className="text-3xl font-black font-mono text-midnight-950">
              1,428 Members
            </p>
            <p className="text-xs text-emerald-600 font-semibold">
              98.2% recurring mandate success
            </p>
          </Card>
        </div>

        {/* Developer API & Webhooks */}
        <Card variant="white" className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-midnight-950 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-electric-cobalt" />
                <span>Open Payments Integration Credentials</span>
              </h3>
              <p className="text-xs text-slate-500">
                Direct webhook delivery for instantaneous order fulfillment
              </p>
            </div>
            <Badge variant="lime" size="sm">
              Live API
            </Badge>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">MERCHANT SECRET KEY</span>
                <span className="text-slate-800 font-bold">
                  vyl_live_sec_••••••••••••••••49bc0
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyKey}
              >
                {apiKeyCopied ? "Copied" : "Copy Key"}
              </Button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">SETTLEMENT WEBHOOK</span>
                <span className="text-electric-cobalt">
                  https://api.reelroom.cinema/veylo/webhook
                </span>
              </div>
              <span className="text-emerald-600 font-bold text-[11px]">200 OK</span>
            </div>
          </div>
        </Card>
      </div>
    </AppLayoutClient>
  );
}
