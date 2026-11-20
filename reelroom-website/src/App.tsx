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
  CreditCard,
  Building2,
  ChevronRight,
  Volume2,
  VolumeX,
  Maximize2,
  Info,
  Award,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

interface FilmItem {
  id: string;
  title: string;
  director: string;
  year: string;
  category: "all" | "premieres" | "classics" | "award" | "masterclass";
  genre: string;
  duration: string;
  rating: string;
  festival: string;
  laurel?: string;
  description: string;
  synopsis: string;
  backdrop: string;
  audio: string;
  videoUrl?: string;
}

export default function App() {
  // Navigation & filter state
  const [activeCategory, setActiveCategory] = useState<"all" | "premieres" | "classics" | "award" | "masterclass">("all");
  const [activeFilmModal, setActiveFilmModal] = useState<FilmItem | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Payment & Checkout state
  const [checkoutOpen, setCheckoutOpen] = useState(
    typeof window !== "undefined" && window.location.search.includes("checkout=true")
  );
  const [paymentMethod, setPaymentMethod] = useState<"card" | "veylo">(
    typeof window !== "undefined" && window.location.search.includes("method=veylo") ? "veylo" : "card"
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionMethod, setSubscriptionMethod] = useState<"card" | "veylo" | null>(null);

  // Card Form State
  const [cardNumber, setCardNumber] = useState("4532 8910 2341 8821");
  const [cardHolder, setCardHolder] = useState("Tomi Adebayo");
  const [cardExpiry, setCardExpiry] = useState("08 / 28");
  const [cardCvc, setCardCvc] = useState("842");
  const [cardStep, setCardStep] = useState<"form" | "3ds" | "processing" | "success">("form");
  const [threeDsOtp, setThreeDsOtp] = useState("739 104");

  // Veylo Form State
  const [veyloAccount, setVeyloAccount] = useState("482 193 7604");
  const [veyloStep, setVeyloStep] = useState<"input" | "push" | "success">("input");
  const [isProcessing, setIsProcessing] = useState(false);

  const films: FilmItem[] = [
    {
      id: "f1",
      title: "The Black Book: Director's Cut",
      director: "Editi Effiong",
      year: "2024",
      category: "premieres",
      genre: "Action / Noir Thriller",
      duration: "2h 15m",
      rating: "9.2/10",
      festival: "Official Selection Premiere",
      laurel: "Lagos International Film Festival • Best Cinematography",
      description: "When his son is framed for a kidnapping, a grieving deacon takes justice into his own hands to clear his name and expose a corrupt cartel.",
      synopsis: "Set against the brutal underbelly of Lagos police corruption and deep political intrigue, The Black Book is a tour de force in modern African neo-noir cinema. Restored in native 4K UHD with extended director commentary.",
      backdrop: "linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)",
      audio: "Dolby Atmos 7.1.4 (English & Yoruba)",
    },
    {
      id: "f2",
      title: "Mami Wata: 35mm Restoration",
      director: "C.J. Obasi",
      year: "2023",
      category: "award",
      genre: "Folklore / Monochromatic Drama",
      duration: "1h 47m",
      rating: "9.5/10",
      festival: "Sundance Special Jury Winner",
      laurel: "Sundance 2023 • World Cinema Dramatic Special Jury Award",
      description: "When harmony in a remote coastal village is threatened by an outsider, two sisters must fight to restore the water deity's blessing.",
      synopsis: "Filmed in breathtaking, high-contrast monochrome 35mm by cinematographer Lílis Soares, Mami Wata's hypnotic blend of West African folklore, matriarchal faith, and political resistance is a landmark of world cinema.",
      backdrop: "linear-gradient(135deg, #312E81 0%, #1E1B4B 100%)",
      audio: "Dolby Atmos (West African Pidgin & Fon)",
    },
    {
      id: "f3",
      title: "Lagos Neon: Midnight Tales",
      director: "Damilola Orimoloye",
      year: "2026",
      category: "premieres",
      genre: "Neo-Noir / Cyber-Afro",
      duration: "1h 52m",
      rating: "8.9/10",
      festival: "Festival World Premiere",
      laurel: "Festival Opening Night Gala Film",
      description: "A neon-soaked journey through the underground music scene and corporate espionage of nighttime Victoria Island.",
      synopsis: "An electronic music producer unwittingly intercepts an encrypted financial transmission inside a subterranean club, triggering a high-stakes midnight chase across the bridges of Lagos.",
      backdrop: "linear-gradient(135deg, #4C0519 0%, #1E1B4B 100%)",
      audio: "Stereo Uncompressed / Spatial Audio",
    },
    {
      id: "f4",
      title: "Supa Modo: 10-Year Anniversary",
      director: "Likarion Wainaina",
      year: "2018",
      category: "award",
      genre: "Drama / Inspirational",
      duration: "1h 14m",
      rating: "9.4/10",
      festival: "Berlinale Generation Award",
      laurel: "Berlin International Film Festival • Special Mention",
      description: "A young girl whose dream is to become a superhero inspires an entire village to come together and make her dream film a reality.",
      synopsis: "One of the most emotionally moving family dramas produced on the continent. Restored from original camera negatives for the 10-year festival retrospective.",
      backdrop: "linear-gradient(135deg, #78350F 0%, #0F172A 100%)",
      audio: "Dolby Digital 5.1 (Swahili with English subs)",
    },
    {
      id: "f5",
      title: "Atlantique: Dakar Nocturne",
      director: "Mati Diop",
      year: "2024 Restored",
      category: "classics",
      genre: "Supernatural Romance / Mystery",
      duration: "1h 45m",
      rating: "9.1/10",
      festival: "Cannes Grand Prix Selection",
      laurel: "Cannes Film Festival • Grand Prix Winner",
      description: "In a coastal suburb of Dakar, workers on a futuristic tower vanish into the Atlantic, only to return as spirits seeking retribution.",
      synopsis: "Mati Diop's hypnotic masterpiece explores migration, class, and love across the shores of Senegal with a haunting, ethereal score by Fatima Al Qadiri.",
      backdrop: "linear-gradient(135deg, #064E3B 0%, #022C22 100%)",
      audio: "Dolby Atmos (Wolof & French)",
    },
    {
      id: "f6",
      title: "Masterclass: Editi Effiong on Independent Financing",
      director: "Reelroom Studio Originals",
      year: "2026",
      category: "masterclass",
      genre: "Documentary / Masterclass",
      duration: "1h 08m",
      rating: "9.6/10",
      festival: "Festival Industry Keynote",
      laurel: "Reelroom Creator Fellowship Series",
      description: "Director Editi Effiong breaks down budgeting, direct-to-creator digital distribution, and bypassing traditional cinema gatekeepers.",
      synopsis: "An unsparing, highly practical 70-minute masterclass covering self-distribution, IP retention, international co-productions, and direct fan monetization.",
      backdrop: "linear-gradient(135deg, #3730A3 0%, #1E1B4B 100%)",
      audio: "Broadcast 4K Stereo PCM",
    },
  ];

  const filteredFilms =
    activeCategory === "all"
      ? films
      : films.filter((f) => f.category === activeCategory);

  // Card payment handler
  const handlePayWithCard = () => {
    setCardStep("processing");
    setTimeout(() => {
      setCardStep("3ds");
    }, 900);
  };

  const handleConfirm3Ds = () => {
    setCardStep("processing");
    setTimeout(() => {
      setCardStep("success");
      setIsSubscribed(true);
      setSubscriptionMethod("card");
    }, 1100);
  };

  // Veylo payment handler
  const handlePayWithVeylo = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setVeyloStep("push");
    }, 700);
  };

  const handleApproveVeyloPush = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setVeyloStep("success");
      setIsSubscribed(true);
      setSubscriptionMethod("veylo");
    }, 850);
  };

  const handleResetCheckout = () => {
    setCheckoutOpen(false);
    setTimeout(() => {
      setCardStep("form");
      setVeyloStep("input");
      setIsProcessing(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 font-sans selection:bg-rose-600 selection:text-white">
      {/* Subscribed Active Bar */}
      {isSubscribed && (
        <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2.5 text-center text-xs text-emerald-400 font-mono flex items-center justify-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>
            Director&apos;s Pass Active {subscriptionMethod === "veylo" ? "(Veylo Mandate #OP-MND-8821)" : "(Card ending in ••8821)"} • 400+ Screenings Unlocked in 4K HDR
          </span>
          <button
            onClick={() => setActiveFilmModal(films[0])}
            className="underline font-bold text-white hover:text-emerald-300 ml-2"
          >
            Start Streaming
          </button>
        </div>
      )}

      {/* Reelroom Header */}
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
                Independent African Cinema Stream
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#festival" className="hover:text-white transition-colors">
              Festival Live
            </a>
            <a href="#films" className="hover:text-white transition-colors">
              Curated Films
            </a>
            <a href="#schedule" className="hover:text-white transition-colors">
              Schedule &amp; Talks
            </a>
            <a href="#membership" className="hover:text-white transition-colors">
              Festival Passes
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {isSubscribed ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Check className="w-3.5 h-3.5" />
                  Director&apos;s Pass Active
                </span>
                <button
                  onClick={() => setActiveFilmModal(films[0])}
                  className="rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold px-3.5 py-1.5 text-xs shadow transition-all flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>Watch</span>
                </button>
              </div>
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

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-900/40 border border-rose-700/50 text-[11px] font-mono text-rose-300 font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                Live Broadcast • 14,280 Cinephiles Streaming
              </div>
              <span className="text-xs font-mono text-slate-400">
                Official Streaming Pavilion • Oct 14 – Nov 28, 2026
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-heading tracking-tight leading-[1.08] max-w-3xl">
              Nollywood &amp; African Independent Cinema Festival 2026
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Unlimited access to 400+ restored classic and contemporary African feature films, creator masterclasses, and filmmaker roundtables streaming in native 4K HDR.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  if (isSubscribed) {
                    setActiveFilmModal(films[0]);
                  } else {
                    setCheckoutOpen(true);
                  }
                }}
                className="inline-flex items-center gap-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 py-3.5 text-sm shadow-xl shadow-rose-900/40 transition-all active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isSubscribed ? "Start Live Stream" : "Watch Festival Broadcast"}</span>
              </button>

              <button
                onClick={() => setActiveFilmModal(films[0])}
                className="inline-flex items-center gap-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold px-5 py-3.5 text-sm transition-all"
              >
                <Film className="w-4 h-4 text-rose-400" />
                <span>Watch Official Trailer</span>
              </button>
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
                <Sparkles className="w-4 h-4 text-amber-400" />
                Director Q&amp;A Roundtables
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Cancel Anytime in 1-Click
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Critic Accolades Bar */}
      <section className="py-6 border-b border-white/5 bg-[#0C0E14] text-xs font-mono text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-slate-300">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white">&ldquo;The premier digital stage for contemporary African storytelling.&rdquo;</span>
            <span className="text-slate-500">— Sight &amp; Sound</span>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-slate-300">&ldquo;A masterclass in independent cinema curation.&rdquo;</span>
            <span className="text-slate-500">— Variety</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-300">&ldquo;Pristine 4K restorations.&rdquo;</span>
            <span className="text-slate-500">— IndieWire</span>
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
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "all", label: "All Screenings" },
                { id: "premieres", label: "Premieres" },
                { id: "award", label: "Award Winners" },
                { id: "classics", label: "35mm Restorations" },
                { id: "masterclass", label: "Masterclasses" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                    activeCategory === tab.id
                      ? "bg-rose-600 text-white font-bold"
                      : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFilms.map((film) => (
              <div
                key={film.id}
                className="group rounded-2xl bg-[#11131B] border border-white/5 overflow-hidden hover:border-rose-500/30 transition-all hover:-translate-y-1 shadow-lg flex flex-col justify-between"
              >
                {/* Poster Artwork Header */}
                <div
                  style={{ background: film.backdrop }}
                  className="h-52 p-5 flex flex-col justify-between relative"
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
                    {film.laurel && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300/90 font-bold block mb-1 flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {film.festival}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-white font-heading leading-tight">
                      {film.title}
                    </h3>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="text-xs text-slate-400">
                      Dir. <strong className="text-slate-200">{film.director}</strong> • {film.year} • <span className="text-rose-400">{film.genre}</span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {film.description}
                    </p>
                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 pt-1">
                      <Tv className="w-3.5 h-3.5 text-rose-400" />
                      <span>{film.audio}</span>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveFilmModal(film);
                        setIsPlayingVideo(true);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-rose-600 text-slate-200 hover:text-white text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isSubscribed ? "Stream in 4K" : "Watch Trailer"}</span>
                    </button>
                    <button
                      onClick={() => setActiveFilmModal(film)}
                      className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-mono transition-colors"
                      title="Film Details"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Festival Schedule & Talks */}
      <section id="schedule" className="py-16 md:py-20 border-b border-white/5 bg-[#0A0C12]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-mono text-rose-400 uppercase tracking-widest block font-bold">
              ROUNDTABLES &amp; LIVE SESSIONS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-heading mt-1">
              Live Festival Schedule
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-[#11131B] border border-white/5 p-6 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-rose-400 font-bold">TODAY • 20:00 WAT</span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px]">LIVE SOON</span>
              </div>
              <h3 className="text-base font-bold text-white">The Future of Nollywood 35mm Preservation</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Panel featuring C.J. Obasi, Lílis Soares, and the Nigerian Film Corporation archival team.
              </p>
              <div className="text-[11px] font-mono text-slate-400 pt-2 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-rose-400" />
                <span>Simulcast from Dakar &amp; Lagos</span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#11131B] border border-white/5 p-6 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 font-bold">TOMORROW • 18:30 WAT</span>
                <span className="px-2 py-0.5 rounded bg-white/5 text-slate-400 text-[10px]">SCHEDULED</span>
              </div>
              <h3 className="text-base font-bold text-white">Direct-to-Audience Digital Monetization</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Filmmakers discuss bypassing traditional theatrical gatekeepers using open digital protocols.
              </p>
              <div className="text-[11px] font-mono text-slate-400 pt-2 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-rose-400" />
                <span>Interactive Audience Q&amp;A</span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#11131B] border border-white/5 p-6 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 font-bold">SATURDAY • 21:00 WAT</span>
                <span className="px-2 py-0.5 rounded bg-white/5 text-slate-400 text-[10px]">CLOSING GALA</span>
              </div>
              <h3 className="text-base font-bold text-white">Jury Awards Ceremony &amp; World Premiere</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Announcement of the Golden Palm of Nollywood and world premiere of the festival winner.
              </p>
              <div className="text-[11px] font-mono text-slate-400 pt-2 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-rose-400" />
                <span>Exclusive to Director&apos;s Pass holders</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership & Checkout Section */}
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
                  Unlimited Curated Cinema.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Stream over 400+ restored African cinema masterworks, award-winning indie premieres, and exclusive director Q&amp;As in pristine 4K Ultra-HD with Dolby Atmos spatial audio.
              </p>

              <div className="space-y-3 text-xs font-mono text-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>4K Ultra-HD streaming across all smart TVs, tablets &amp; mobile web</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Direct festival simulcasts, filmmaker roundtables &amp; audience Q&amp;As</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Offline festival downloads on iOS and Android devices</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Cancel anytime with 1 click • Zero long-term commitment</span>
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
                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                    FESTIVAL ACCESS
                  </span>
                </div>

                <div className="rounded-xl bg-black/40 p-3 text-xs font-mono text-slate-300 border border-white/5 space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Includes:</span>
                    <span className="text-white">400+ Films &amp; Premieres</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Quality:</span>
                    <span className="text-amber-300">4K UHD HDR • Dolby Atmos</span>
                  </div>
                </div>

                {/* Make Payment CTA */}
                {isSubscribed ? (
                  <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Membership Active</span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-300">
                      You have full access to all festival films.
                    </p>
                    <button
                      onClick={() => setActiveFilmModal(films[0])}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow"
                    >
                      Stream Current Premiere
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => setCheckoutOpen(true)}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-base flex items-center justify-between group transition-all shadow-xl shadow-rose-950/50 active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-2.5">
                        <Lock className="w-4 h-4 text-rose-200" />
                        <span>Make Payment</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-mono text-rose-100">
                        <span>€14.99</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>

                    {/* Accepted Payment Methods Badges */}
                    <div className="pt-2 flex items-center justify-center gap-3 text-[11px] font-mono text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                        💳 Visa / MC
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                        Verve
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#3D5BFF]/20 border border-[#3D5BFF]/30 text-[#D8F15B] font-bold flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3D5BFF] text-[#D8F15B] flex items-center justify-center text-[8px]">V</span>
                        Veylo ID
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>256-Bit Encrypted Secure Checkout</span>
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
            © 2026 Reelroom Media GmbH • Berlin, Lagos &amp; Dakar
          </div>
        </div>
      </footer>

      {/* ========================================================
          FILM STREAMING & TRAILER MODAL
         ======================================================== */}
      {activeFilmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-[#11131B] border border-white/15 overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setActiveFilmModal(null)}
              className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white bg-black/60 rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Player Mockup */}
            <div
              style={{ background: activeFilmModal.backdrop }}
              className="h-72 w-full relative flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

              <div className="relative z-10 text-center space-y-3">
                <button
                  onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                  className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl shadow-rose-900 mx-auto transition-transform active:scale-95"
                >
                  <Play className="w-7 h-7 fill-white translate-x-0.5" />
                </button>
                <div className="text-xs font-mono text-slate-200 bg-black/60 px-3 py-1 rounded-full border border-white/10 inline-block">
                  {isSubscribed ? "Streaming Native 4K UHD • 2h 15m" : "Festival 3-Minute Trailer Preview"}
                </div>
              </div>

              {/* Player UI Controls bar at bottom */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-4 flex items-center justify-between text-xs font-mono text-slate-300">
                <div className="flex items-center gap-3">
                  <Play className="w-4 h-4 text-white" />
                  <span>02:14 / {activeFilmModal.duration}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsMuted(!isMuted)}>
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px]">4K HDR</span>
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Film Meta */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-wider">
                    {activeFilmModal.festival}
                  </span>
                  <h3 className="text-2xl font-bold text-white font-heading mt-0.5">
                    {activeFilmModal.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Directed by <strong className="text-slate-200">{activeFilmModal.director}</strong> • {activeFilmModal.year} • {activeFilmModal.genre}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-amber-300 text-sm font-mono font-bold flex items-center gap-1 justify-end">
                    <Star className="w-4 h-4 fill-amber-300" />
                    {activeFilmModal.rating}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Rotten Tomatoes 98%</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeFilmModal.synopsis}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
                <div className="text-xs font-mono text-slate-400">
                  Audio: <span className="text-slate-200">{activeFilmModal.audio}</span>
                </div>

                {!isSubscribed ? (
                  <button
                    onClick={() => {
                      setActiveFilmModal(null);
                      setCheckoutOpen(true);
                    }}
                    className="py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow"
                  >
                    Get Pass to Watch Full Film (€14.99)
                  </button>
                ) : (
                  <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    Unlocked with Director&apos;s Pass
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MULTI-METHOD PAYMENT MODAL (Card, Veylo, Bank)
         ======================================================== */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#11131B] border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleResetCheckout}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 pb-4 border-b border-white/10">
              <span className="text-[11px] font-mono text-rose-400 font-bold uppercase tracking-wider">
                REELROOM CINEMA CHECKOUT
              </span>
              <h3 className="text-xl font-bold text-white font-heading">
                Subscribe to Director&apos;s Pass
              </h3>
              <div className="flex justify-between items-center text-xs font-mono pt-1 text-slate-400">
                <span>Plan: 400+ Films Monthly Access</span>
                <span className="text-lg font-bold text-white font-mono">€14.99 <span className="text-xs font-normal text-slate-400">/ mo</span></span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            {cardStep !== "success" && veyloStep !== "success" && (
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-300 block">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Card Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      paymentMethod === "card"
                        ? "bg-rose-950/30 border-rose-500/60 ring-1 ring-rose-500/50"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className={`w-4 h-4 ${paymentMethod === "card" ? "text-rose-400" : "text-slate-400"}`} />
                      <span className="text-xs font-bold text-white">Credit / Debit Card</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 block mt-1">
                      Visa, Mastercard, Verve
                    </span>
                  </button>

                  {/* Veylo Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("veylo")}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                      paymentMethod === "veylo"
                        ? "bg-[#3D5BFF]/15 border-[#3D5BFF] ring-1 ring-[#3D5BFF]"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <span className="absolute top-1.5 right-2 px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-[#D8F15B] text-[#111B32]">
                      FASTEST
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-[#3D5BFF] text-[#D8F15B] flex items-center justify-center font-black text-[9px]">
                        V
                      </div>
                      <span className="text-xs font-bold text-white">Veylo Account</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 block mt-1">
                      10-Digit ID • 0% Fees
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================
                OPTION 1: CREDIT / DEBIT CARD FLOW
               ======================================================== */}
            {paymentMethod === "card" && (
              <div className="space-y-4 text-left">
                {cardStep === "form" && (
                  <div className="space-y-4">
                    {/* Cardholder Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300 block">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="Name on card"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-rose-500 focus:outline-none"
                      />
                    </div>

                    {/* Card Number */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-mono text-slate-300">
                        <span>Card Number</span>
                        <span className="text-[10px] text-slate-400">Visa / Mastercard / Verve</span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4532 •••• •••• 8821"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-rose-500 focus:outline-none tracking-wider"
                        />
                        <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      </div>
                    </div>

                    {/* Expiry and CVC */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-slate-300 block">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM / YY"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-slate-300 block flex items-center justify-between">
                          <span>Security Code (CVV)</span>
                          <Lock className="w-3 h-3 text-slate-400" />
                        </label>
                        <input
                          type="password"
                          value={cardCvc}
                          maxLength={4}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="•••"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="rounded-xl bg-black/40 p-3 text-[11px] font-mono text-slate-400 border border-white/5 flex items-center justify-between">
                      <span>Standard Interchange Fee:</span>
                      <span className="text-slate-300">+3.5% Card Scheme Toll</span>
                    </div>

                    <button
                      onClick={handlePayWithCard}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-rose-950/40"
                    >
                      <span>Pay €14.99 with Card</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* 3D Secure Verification Simulation */}
                {cardStep === "3ds" && (
                  <div className="space-y-5 text-center py-2">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto">
                      <ShieldCheck className="w-6 h-6" />
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white">
                        Bank 3D Secure Authentication
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                        Your issuing bank requires identity verification. An SMS security code was sent to your registered phone.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-black/70 border border-white/15 p-4 text-left space-y-3">
                      <div className="flex justify-between text-xs font-mono text-slate-400">
                        <span>Merchant:</span>
                        <strong className="text-white">Reelroom Media GmbH</strong>
                      </div>
                      <div className="flex justify-between text-xs font-mono text-slate-400">
                        <span>Amount:</span>
                        <strong className="text-white">€14.99 EUR</strong>
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <label className="text-[11px] font-mono text-slate-300 block">
                          Enter 6-Digit SMS Passcode
                        </label>
                        <input
                          type="text"
                          value={threeDsOtp}
                          onChange={(e) => setThreeDsOtp(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-center font-mono text-base font-bold tracking-widest text-amber-300 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <button
                        onClick={handleConfirm3Ds}
                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all mt-2"
                      >
                        Authorize Payment
                      </button>
                    </div>
                  </div>
                )}

                {/* Card Processing */}
                {cardStep === "processing" && (
                  <div className="py-10 text-center space-y-4">
                    <div className="w-10 h-10 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-mono text-slate-300">
                      Authorizing with card network &amp; settling payment...
                    </p>
                  </div>
                )}

                {/* Card Success */}
                {cardStep === "success" && (
                  <div className="space-y-5 text-center py-2">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <Check className="w-7 h-7 stroke-[3]" />
                    </div>

                    <div>
                      <h4 className="text-xl font-black text-white font-heading">
                        Card Payment Authorized!
                      </h4>
                      <p className="text-xs font-mono text-slate-400 mt-1">
                        Visa ending in ••••8821 billed €14.99.
                      </p>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                      Your Director&apos;s Pass is now active. You have full streaming access to all 400+ films in native 4K.
                    </p>

                    <button
                      onClick={handleResetCheckout}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-950 transition-all active:scale-[0.98]"
                    >
                      Start Streaming Films Now
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================
                OPTION 2: VEYLO OPEN PAYMENTS PROTOCOL FLOW
               ======================================================== */}
            {paymentMethod === "veylo" && (
              <div className="space-y-4 text-left">
                {veyloStep === "input" && (
                  <div className="space-y-4">
                    {/* Interledger Real-Time FX Banner */}
                    <div className="rounded-2xl bg-black/50 p-4 border border-[#3D5BFF]/30 text-xs space-y-2 font-mono">
                      <div className="flex justify-between items-center text-slate-400">
                        <span>Invoice Amount:</span>
                        <strong className="text-white font-mono">€14.99 EUR</strong>
                      </div>
                      <div className="flex justify-between items-center text-slate-400">
                        <span>Interledger Live FX:</span>
                        <strong className="text-[#D8F15B] font-mono">~₦30,579.60 NGN</strong>
                      </div>
                      <div className="flex justify-between items-center text-slate-400">
                        <span>Card Scheme Interchange:</span>
                        <strong className="text-emerald-400 font-mono">₦0.00 (Zero Fee)</strong>
                      </div>
                    </div>

                    {/* Veylo 10-Digit ID Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300 block">
                        Enter Your 10-Digit Veylo Account Number or @handle
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={veyloAccount}
                          onChange={(e) => setVeyloAccount(e.target.value)}
                          placeholder="e.g. 482 193 7604 or @tomi_a"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-[#3D5BFF]/50 text-white font-mono text-sm focus:border-[#D8F15B] focus:outline-none focus:ring-1 focus:ring-[#D8F15B]"
                        />
                        <div className="absolute left-3 top-3 w-4 h-4 rounded bg-[#3D5BFF] text-[#D8F15B] flex items-center justify-center font-black text-[9px]">
                          V
                        </div>
                      </div>
                      <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 pt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Resolved Identity: <strong>Tomi Adebayo</strong> • GTBank ••6789</span>
                      </p>
                    </div>

                    <button
                      onClick={handlePayWithVeylo}
                      disabled={isProcessing}
                      className="w-full py-3.5 rounded-xl bg-[#3D5BFF] hover:bg-[#2E49E6] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-[#3D5BFF]/30 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <span>Resolving Open Payments Identity...</span>
                      ) : (
                        <>
                          <span>Authorize with Veylo ID</span>
                          <ArrowRight className="w-4 h-4 text-[#D8F15B]" />
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Step 2: Push Alert Simulation on Phone */}
                {veyloStep === "push" && (
                  <div className="space-y-6 text-center py-2">
                    <div className="w-14 h-14 rounded-full bg-[#3D5BFF]/15 text-[#3D5BFF] flex items-center justify-center mx-auto">
                      <Smartphone className="w-7 h-7 animate-bounce" />
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-white">
                        Biometric Authorization Dispatched
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                        A secure cryptographic mandate request was sent to your connected mobile device.
                      </p>
                    </div>

                    {/* Mobile Notification Mockup */}
                    <div className="rounded-2xl bg-black/80 border border-white/15 p-4 text-left space-y-3 shadow-xl">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#D8F15B]">
                        <span className="flex items-center gap-1.5 font-bold">
                          <span className="w-4 h-4 rounded bg-[#3D5BFF] text-[#D8F15B] flex items-center justify-center text-[10px]">V</span>
                          VEYLO MANDATE AUTHORIZATION
                        </span>
                        <span>JUST NOW</span>
                      </div>
                      <p className="text-xs text-slate-200">
                        Reelroom Indie Cinema requests recurring subscription for <strong>€14.99/mo</strong> from connected GTBank ••6789.
                      </p>
                      <button
                        onClick={handleApproveVeyloPush}
                        disabled={isProcessing}
                        className="w-full py-2.5 rounded-xl bg-[#D8F15B] hover:bg-[#C5DE48] text-[#111B32] font-black text-xs transition-all active:scale-[0.98]"
                      >
                        {isProcessing ? "Verifying Face ID..." : "Approve with Face ID"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Success */}
                {veyloStep === "success" && (
                  <div className="space-y-5 text-center py-2">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <Check className="w-7 h-7 stroke-[3]" />
                    </div>

                    <div>
                      <h4 className="text-xl font-black text-white font-heading">
                        Subscribed via Veylo!
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
                      Start Streaming Films Now
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
