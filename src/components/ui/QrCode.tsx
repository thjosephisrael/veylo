"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { VeyloSymbol } from "@/components/brand/VeyloLogo";

interface QrCodeProps {
  value: string;
  size?: number;
  showCenterLogo?: boolean;
  className?: string;
}

export const QrCode: React.FC<QrCodeProps> = ({
  value,
  size = 200,
  showCenterLogo = true,
  className = "",
}) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function generate() {
      try {
        const url = await QRCode.toDataURL(value, {
          errorCorrectionLevel: "H", // High error correction permits center logo overlay
          margin: 1,
          width: size * 2, // 2x for retina displays
          color: {
            dark: "#111B32", // Midnight Ink
            light: "#FFFFFF",
          },
        });
        if (isMounted) {
          setDataUrl(url);
          setError(null);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to generate QR code");
        }
      }
    }

    generate();

    return () => {
      isMounted = false;
    };
  }, [value, size]);

  if (error) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex items-center justify-center p-4 text-xs text-red-500 bg-red-50 rounded-2xl border border-red-200"
      >
        Failed to render QR
      </div>
    );
  }

  if (!dataUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex items-center justify-center bg-slate-100 rounded-2xl animate-pulse"
      >
        <span className="text-xs text-slate-400">Generating QR...</span>
      </div>
    );
  }

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dataUrl}
        alt={`Payment QR Code for ${value}`}
        width={size}
        height={size}
        className="rounded-2xl border border-slate-200 shadow-sm"
      />
      {showCenterLogo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="p-1.5 bg-white rounded-xl shadow-md border border-slate-100">
            <VeyloSymbol size={Math.round(size * 0.18)} variant="light" />
          </div>
        </div>
      )}
    </div>
  );
};
