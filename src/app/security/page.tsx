"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayoutClient } from "@/components/layout/AppLayoutClient";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Lock,
  Zap,
  Cpu,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function SecurityArchitecturePage() {
  const [activeTab, setActiveTab] = useState<"matrix" | "packet">("matrix");

  const comparisonRows = [
    {
      metric: "Hops to Settlement",
      card: "7 intermediary entities (Merchant → Gateway → Acquirer → Card Network → Issuing Processor → Issuing Bank → 3DS Provider)",
      veylo: "2 network hops (Veylo Sender → Interledger Connector → Receiving Bank Endpoint)",
      winner: "veylo",
    },
    {
      metric: "Credential Security",
      card: "16-digit PAN, CVV, expiry date transmitted and stored across vendor databases (High breach risk)",
      veylo: "Zero card numbers or secrets stored. Authenticated via hardware-bound passkeys & asymmetric grants",
      winner: "veylo",
    },
    {
      metric: "Interchange & Processing Fee",
      card: "2.9% to 4.5% + $0.30 fixed fee per transaction + cross-border currency gouging",
      veylo: "0% card network interchange. Simple, flat 2.0% Veylo transaction fee",
      winner: "veylo",
    },
    {
      metric: "Subscription Revocation",
      card: "Difficult cancellation workflows, recurring billing zombies, merchant support queues",
      veylo: "1-Click instant revocation at protocol level from user's Veylo Subscriptions manager",
      winner: "veylo",
    },
    {
      metric: "Settlement Speed",
      card: "T+2 to T+5 business days rolling reserve delay",
      veylo: "Instant real-time streaming settlement (~3.2 seconds)",
      winner: "veylo",
    },
  ];

  return (
    <AppLayoutClient
      title="Security & Architecture"
      subtitle="Protocol Comparison: Legacy Card Schemes vs. Veylo Open Payments & Interledger"
    >
      <div className="space-y-8 max-w-5xl">
        {/* Toggle between Matrix and Packet Inspector */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("matrix")}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-colors ${
              activeTab === "matrix"
                ? "bg-midnight-950 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Architecture Matrix
          </button>
          <button
            onClick={() => setActiveTab("packet")}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-colors ${
              activeTab === "packet"
                ? "bg-midnight-950 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Interledger Packet Inspector (ILP v4)
          </button>
        </div>

        {activeTab === "matrix" ? (
          <div className="space-y-6">
            <Card variant="white" className="p-0 overflow-hidden">
              <div className="grid grid-cols-12 bg-slate-100/90 p-4 border-b border-slate-200 text-xs font-mono font-bold text-slate-700">
                <div className="col-span-3">ARCHITECTURAL DIMENSION</div>
                <div className="col-span-4 text-rose-700">LEGACY CARD NETWORK (VISA / MC)</div>
                <div className="col-span-5 text-electric-cobalt">VEYLO OPEN PAYMENTS ENGINE</div>
              </div>

              <div className="divide-y divide-slate-100">
                {comparisonRows.map((row, i) => (
                  <div key={i} className="grid grid-cols-12 p-4 sm:p-5 text-xs gap-4 items-start hover:bg-slate-50/50">
                    <div className="col-span-12 sm:col-span-3 font-bold text-midnight-950">
                      {row.metric}
                    </div>
                    <div className="col-span-12 sm:col-span-4 text-slate-600 flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{row.card}</span>
                    </div>
                    <div className="col-span-12 sm:col-span-5 text-midnight-950 font-medium flex items-start gap-2 bg-electric-cobalt/5 p-3 rounded-xl border border-electric-cobalt/15">
                      <CheckCircle2 className="w-4 h-4 text-electric-cobalt shrink-0 mt-0.5" />
                      <span>{row.veylo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          <Card variant="midnight" className="space-y-6 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-midnight-800">
              <span className="text-acid-lime font-bold">INTERLEDGER PREPARE PACKET SPECIFICATION</span>
              <Badge variant="lime" size="sm">
                ILP v4 STREAM
              </Badge>
            </div>

            <pre className="bg-midnight-950 p-6 rounded-2xl border border-midnight-800 overflow-x-auto text-slate-200 leading-relaxed">
{`{
  "packetType": "ILP_PREPARE",
  "amount": "250000000000", /* 250,000 NGN in fractional base units */
  "executionCondition": "SHA-256(7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069)",
  "expiresAt": "2026-11-19T22:45:00.000Z",
  "destination": "g.veylo.ng.gtb.0123456789",
  "data": {
    "openPaymentsGrant": "https://auth.veylo.me/grants/gn_981240",
    "senderAccount": "4821937604",
    "feeSchedule": {
      "veyloRate": "0.020",
      "interchangeDeduction": "0.000"
    }
  }
}`}
            </pre>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Cryptographic fulfillment fulfilled on receiving commercial bank credit.</span>
              <span className="text-emerald-400">Latency: 284ms RTT</span>
            </div>
          </Card>
        )}
      </div>
    </AppLayoutClient>
  );
}
