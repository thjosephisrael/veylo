import React from "react";
import Link from "next/link";
import { ExternalLink, Film } from "lucide-react";

export default function ReelroomRedirectPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-slate-800 p-8 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center font-bold text-white shadow-lg mx-auto">
          <Film className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-sans">Reelroom Cinema</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Reelroom is an independent 3rd-party cinema streaming website with its own standalone deployment and checkout experience.
          </p>
        </div>
        <div className="pt-2 space-y-3">
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 font-bold rounded-xl px-5 py-3 text-sm bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md"
          >
            <span>Launch Reelroom Website (Port 3001)</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 font-medium rounded-xl px-5 py-3 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
          >
            <span>Return to Veylo Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
