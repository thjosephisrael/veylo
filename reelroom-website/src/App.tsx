import React, { useState } from "react";
import {
  Film,
  Play,
  ShieldCheck,
  Check,
  Smartphone,
  ArrowRight,
  Sparkles,
  Lock,
  Tv,
  Download,
  Calendar,
  X,
  Clock,
  Star,
  Layers,
} from "lucide-react";

export default function App() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [veyloAccount, setVeyloAccount] = useState("482 193 7604");
  const [checkoutStep, setCheckoutStep] = useState<"input" | "push" | "success">("input");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeFilmModal, setActiveFilmModal] = useState<any | null>(null);

  const films = [
    {
      id: "f1",
      title: "The Black Book: Director's Cut",
      director: "Editi Effiong",
      year: "2024",
      genre: "Action / Noir Thriller",
      duration: "2h 15m",
      rating: "9.2/10",
      festival: "Official Selection",
      description: "When his son is framed for a kidnapping, a grieving deacon takes justice into his own hands to clear his name and expose a corrupt cartel.",
      backdrop: "linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)",
    },
    {
      id: "f2",
      title: "Mami Wata: 35mm Restoration",
      director: "C.J. Obasi",
      year: "2023",
      genre: "Folklore / Monochromatic Drama",
      duration: "1h 47m",
      rating: "9.5/10",
      festival: "Sundance Special Jury Winner",
      description: "When harmony in a remote coastal village is threatened by an outsider, two sisters must fight to restore the water deity's blessing.",
      backdrop: "linear-gradient(135deg, #312E81 0%, #1E1B4B 100%)",
    },
    {
      id: "f3",
      title: "Lagos Neon: Midnight Tales",
      director: "Damilola Orimoloye",
      year: "2026",
      genre: "Neo-Noir / Cyber-Afro",
      duration: "1h 52m",
      rating: "8.9/10",
      festival: "Festival Premiere",
      description: "A neon-soaked journey through the underground music scene and corporate espionage of nighttime Victoria Island.",
      backdrop: "linear-gradient(135deg, #4C0519 0%, #1E1B4B 100%)",
    },
    {
      id: "f4",
      title: "Supa Modo: 10-Year Anniversary",
      director: "Likarion Wainaina",
      year: "2018",
      genre: "Drama / Inspirational",
      duration: "1h 14m",
      rating: "9.4/10",
      festival: "Berlinale Generation Award",
      description: "A young girl whose dream is to become a superhero inspires an entire village to come together and make her dream film a reality.",
      backdrop: "linear-gradient(135deg, #78350F 0%, #0F172A 100%)",
    },
  ];

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCheckoutStep("push");
    }, 700);
  };

  const handleApprovePush = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCheckoutStep("success");
      setIsSubscribed(true);
    }, 800);
  };

  const handleResetCheckout = () => {
    setCheckoutOpen(false);
    setTimeout(() => setCheckoutStep("input"), 300);
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 font-sans selection:bg-rose-600 selection:text-white">
      {/* Subscribed Banner */}
      {isSubscribed && (
        <div className="bg-emerald-500/10 border-b border-emerald-500/30 px-4 py-2.5 text-center text-xs text-emerald-400 font-mono flex items-center justify-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Director&apos;s Pass Active via Veylo Mandate #OP-MND-8821 • 400+ Films Unlocked</span>
        </div>
      )}

      {/* Reelroom Standalone Navbar */}
      <header className="border-b border-white/5 bg-[#08090D]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center font-bold text-white shadow-lg shadow-rose-950/50">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white font-heading">
                REELROOM
              </span>
              <span className="text-[10px] font-mono text-rose-400 block tracking-widest uppercase">
                Independent Cinema Stream
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#festival" className="hover:text-white transition-colors">
              Festival 2026
            </a>
            <a href="#films" className="hover:text-white transition-colors">
              Curated Films
            </a>
            <a href="#membership" className="hover:text-white transition-colors">
              Director&apos;s Pass
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {isSubscribed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Check className="w-3.5 h-3.5" />
                Director&apos;s Pass
              </span>
            ) : (
              <button
                onClick={() => setCheckoutOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold px-4 py-2 text-xs shadow-md shadow-rose-900/30 transition-all active:scale-[0.98]"
              >
                <span>Get Festival Pass</span>
                <span className="font-mono text-rose-200">€14.99</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Showcase */}
      <section id="festival" className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-20 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] bg-gradient-to-r from-[#200A10] via-[#11131B] to-[#0D0F17] border border-rose-900/30 p-8 sm:p-14 space-y-6 shadow-2xl relative overflow-hidden">
            {/* Ambient decorative blur */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-900/40 border border-rose-700/50 text-[11px] font-mono text-rose-300 font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Live Stream Premiere • Lagos &amp; Dakar
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-heading tracking-tight leading-[1.08] max-w-3xl">
              Nollywood &amp; African Independent Cinema Festival 2026
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Unlimited access to 400+ restored classic and contemporary African feature films, creator masterclasses, and filmmaker roundtables streaming in native 4K HDR.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setCheckoutOpen(true)}
                className="inline-flex items-center gap-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 py-3.5 text-sm shadow-xl shadow-rose-900/40 transition-all active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Watch Live Broadcast</span>
              </button>

              <a
                href="#films"
                className="inline-flex items-center gap-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold px-5 py-3.5 text-sm transition-all"
              >
                <span>Explore 400+ Lineup</span>
              </a>
            </div>

            {/* Feature Pills */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-rose-400" />
                4K UHD &amp; Dolby Atmos
              </span>
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4 text-rose-400" />
                Offline Festival Downloads
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D8F15B]" />
                Zero-Card Open Payments
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Film Catalog */}
      <section id="films" className="py-16 md:py-20 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-rose-400 uppercase tracking-widest block font-bold">
                FESTIVAL ARCHIVE &amp; PREMIERES
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-heading mt-1">
                Featured Screenings
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Streaming exclusively on Reelroom Director&apos;s Pass
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {films.map((film) => (
              <div
                key={film.id}
                className="group rounded-2xl bg-[#11131B] border border-white/5 overflow-hidden hover:border-rose-500/30 transition-all hover:-translate-y-1 shadow-lg"
              >
                {/* Poster Artwork Header */}
                <div
                  style={{ background: film.backdrop }}
                  className="h-48 p-5 flex flex-col justify-between relative"
                >
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/60 backdrop-blur-md text-white border border-white/10">
                      {film.duration}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-300" />
                      {film.rating}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-rose-300 font-bold block">
                      {film.festival}
                    </span>
                    <h3 className="text-lg font-bold text-white font-heading leading-tight">
                      {film.title}
                    </h3>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div className="text-xs text-slate-400">
                    Dir. <strong className="text-slate-200">{film.director}</strong> • {film.year}
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {film.description}
                  </p>

                  <button
                    onClick={() => setCheckoutOpen(true)}
                    className="w-full mt-2 py-2 rounded-xl bg-white/5 hover:bg-rose-600 text-slate-300 hover:text-white text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Stream Premiere</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership & Veylo Checkout Integration Section */}
      <section id="membership" className="py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            {/* Left Column: Membership Perks */}
            <div className="md:col-span-7 space-y-6 text-left">
              <span className="inline-block bg-rose-600/20 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider">
                UNLIMITED FESTIVAL ACCESS
              </span>

              <h2 className="text-3xl sm:text-5xl font-black text-white font-heading leading-tight">
                Director&apos;s Pass <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-300 to-amber-300">
                  Zero Credit Card Hassle.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Reelroom integrates Veylo Open Payments for instantaneous, privacy-preserving subscriptions. No 16-digit card numbers, expiration dates, or 3D Secure failures. Pay seamlessly with your 10-digit Veylo Account Number.
              </p>

              <div className="space-y-3 text-xs font-mono text-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#D8F15B]/20 text-[#D8F15B] flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>4K Ultra-HD streaming across all screens and web players</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#D8F15B]/20 text-[#D8F15B] flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Zero card credentials held or breached on merchant servers</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#D8F15B]/20 text-[#D8F15B] flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>User-controlled mandate: Pause or cancel anytime in Veylo</span>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing & Checkout Box */}
            <div className="md:col-span-5">
              <div className="rounded-3xl bg-[#11131B] border border-white/10 p-8 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                      MONTHLY PASS
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-4xl font-mono font-black text-white">€14.99</span>
                      <span className="text-xs font-mono text-slate-400">/ month</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-[#D8F15B]/10 text-[#D8F15B] border border-[#D8F15B]/30 font-bold">
                    ACTIVE FESTIVAL
                  </span>
                </div>

                <div className="rounded-xl bg-black/40 p-3 text-xs font-mono text-[#D8F15B] border border-white/5 flex items-center justify-between">
                  <span>Interledger Real-Time FX:</span>
                  <span className="font-bold">~₦30,579.60 NGN</span>
                </div>

                {/* Pay with Veylo Custom Branded CTA */}
                <button
                  onClick={() => setCheckoutOpen(true)}
                  className="w-full py-4 px-6 rounded-2xl bg-[#0B1222] border-2 border-[#3D5BFF] hover:border-[#D8F15B] text-white font-bold flex items-center justify-between group transition-all shadow-xl hover:shadow-[#3D5BFF]/20 active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    {/* Veylo V Symbol */}
                    <div className="w-8 h-8 rounded-lg bg-[#3D5BFF] text-[#D8F15B] flex items-center justify-center font-black text-lg">
                      V
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] font-mono tracking-wider text-slate-400 block uppercase">
                        INSTANT CHECKOUT
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-[#D8F15B] transition-colors">
                        Pay with Veylo Account
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#D8F15B] group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-[#3D5BFF]" />
                  <span>Powered by Open Payments &amp; Interledger</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reelroom Standalone Footer */}
      <footer className="border-t border-white/5 py-12 bg-[#050608] text-xs text-slate-400 font-mono">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-rose-500" />
            <span className="font-bold text-white">REELROOM INDEPENDENT CINEMA STREAM</span>
          </div>
          <div>
            © 2026 Reelroom Media GmbH. Direct Open Payments merchant settlement via Veylo.
          </div>
        </div>
      </footer>

      {/* ========================================================
          CHECKOUT MODAL (Veylo Open Payments Protocol)
         ======================================================== */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#11131B] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={handleResetCheckout}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <div className="w-8 h-8 rounded-lg bg-[#3D5BFF] text-[#D8F15B] flex items-center justify-center font-black">
                V
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-sans">
                  {checkoutStep === "success" ? "Subscribed to Reelroom!" : "Veylo Instant Checkout"}
                </h3>
                <p className="text-[11px] font-mono text-slate-400">
                  Open Payments Mandate Protocol
                </p>
              </div>
            </div>

            {/* Step 1: Input Account */}
            {checkoutStep === "input" && (
              <div className="space-y-5 text-left">
                <div className="rounded-xl bg-black/40 p-4 border border-white/5 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Merchant:</span>
                    <strong className="text-white">Reelroom Indie Cinema</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Plan:</span>
                    <span className="text-slate-200">Director&apos;s Pass Monthly</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Price:</span>
                    <strong className="text-[#D8F15B]">€14.99 EUR (~₦30,579.60)</strong>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-300 block">
                    Enter Your 10-Digit Veylo Account Number
                  </label>
                  <input
                    type="text"
                    value={veyloAccount}
                    onChange={(e) => setVeyloAccount(e.target.value)}
                    placeholder="e.g. 482 193 7604"
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-base focus:border-[#3D5BFF] focus:outline-none focus:ring-1 focus:ring-[#3D5BFF]"
                  />
                  <p className="text-[11px] font-mono text-slate-400">
                    Pre-filled with verified test account (Tomi Adebayo)
                  </p>
                </div>

                <button
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-[#3D5BFF] hover:bg-[#2E49E6] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Resolving Open Payments Identity...</span>
                  ) : (
                    <>
                      <span>Authorize via Veylo</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Step 2: Push Alert Simulation */}
            {checkoutStep === "push" && (
              <div className="space-y-6 text-center py-2">
                <div className="w-16 h-16 rounded-full bg-[#3D5BFF]/10 text-[#3D5BFF] flex items-center justify-center mx-auto">
                  <Smartphone className="w-8 h-8 animate-bounce" />
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white">
                    Biometric Authorization Dispatched
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    A secure cryptographic mandate request was sent to your connected phone.
                  </p>
                </div>

                {/* Mobile Notification Mockup */}
                <div className="rounded-2xl bg-black/80 border border-white/15 p-4 text-left space-y-3 shadow-xl">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#D8F15B]">
                    <span className="flex items-center gap-1.5 font-bold">
                      <span className="w-4 h-4 rounded bg-[#3D5BFF] text-[#D8F15B] flex items-center justify-center text-[10px]">V</span>
                      VEYLO SECURITY AUTHORIZATION
                    </span>
                    <span>JUST NOW</span>
                  </div>
                  <p className="text-xs text-slate-200">
                    Reelroom Indie Cinema requests recurring authorization for <strong>€14.99/mo</strong> from connected GTBank ••6789.
                  </p>
                  <button
                    onClick={handleApprovePush}
                    disabled={isProcessing}
                    className="w-full py-2.5 rounded-xl bg-[#D8F15B] hover:bg-[#C5DE48] text-[#111B32] font-black text-xs transition-all active:scale-[0.98]"
                  >
                    {isProcessing ? "Verifying Face ID..." : "Approve with Face ID"}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {checkoutStep === "success" && (
              <div className="space-y-5 text-center py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <div>
                  <h4 className="text-xl font-black text-white font-heading">
                    Subscription Authorized!
                  </h4>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Open Payments Mandate <strong className="text-slate-200">#OP-MND-8821</strong> registered.
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                  You now have full streaming access to the 2026 African Independent Cinema Festival. You can manage or revoke this mandate anytime in your Veylo account.
                </p>

                <button
                  onClick={handleResetCheckout}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-950 transition-all active:scale-[0.98]"
                >
                  Start Watching Stream Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
