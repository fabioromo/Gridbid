import React, { useEffect, useState } from "react";
import { useGridbidUiStore } from "../../store/gridbidUiStore";
import { useGridbidService } from "../../services/GridbidServiceContext";
import type { GridbidBidding } from "../../types/domain";

// ── Logo ──────────────────────────────────────────────────────────────────────

function GridBidLogoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#4782f3" aria-hidden="true">
      <circle cx="12" cy="12"   r="2.63" />
      <circle cx="12" cy="7"    r="2.63" />
      <circle cx="12" cy="17"   r="2.63" />
      <circle cx="7"  cy="12"   r="2.63" />
      <circle cx="17" cy="12"   r="2.63" />
      <circle cx="7"  cy="7"    r="2.07" />
      <circle cx="17" cy="7"    r="2.07" />
      <circle cx="7"  cy="17"   r="2.07" />
      <circle cx="17" cy="17"   r="2.07" />
      <circle cx="12" cy="1.84" r="1.84" />
      <circle cx="12" cy="22.2" r="1.84" />
      <circle cx="1.84" cy="12" r="1.84" />
      <circle cx="22.2" cy="12" r="1.84" />
      <circle cx="7"    cy="1.84" r="1.22" />
      <circle cx="17"   cy="1.84" r="1.22" />
      <circle cx="7"    cy="22.2" r="1.22" />
      <circle cx="17"   cy="22.2" r="1.22" />
      <circle cx="1.84" cy="7"    r="1.22" />
      <circle cx="22.2" cy="7"    r="1.22" />
      <circle cx="1.84" cy="17"   r="1.22" />
      <circle cx="22.2" cy="17"   r="1.22" />
    </svg>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function LockIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M8 1a3 3 0 00-3 3v1H4a1 1 0 00-1 1v7a1 1 0 001 1h8a1 1 0 001-1V6a1 1 0 00-1-1h-1V4a3 3 0 00-3-3zm-1 3a1 1 0 112 0v1H7V4zm1 4a1 1 0 011 1v2a1 1 0 11-2 0V9a1 1 0 011-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3M10 2h4m0 0v4m0-4L7 9" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h12M10 4l6 6-6 6" />
    </svg>
  );
}

// ── Document card icons ───────────────────────────────────────────────────────

function HouseDocIcon() {
  return (
    <svg className="h-10 w-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#eef4fe" />
      <path d="M20 9L9 19v12h7v-7h8v7h7V19L20 9z" fill="#4782f3" fillOpacity="0.15" />
      <path d="M20 11L10 20.5V31h6v-7h8v7h6V20.5L20 11z" stroke="#4782f3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="26" cy="13.5" r="2.5" fill="#eef4fe" stroke="#4782f3" strokeWidth="1.5" />
    </svg>
  );
}

function FloorplanDocIcon() {
  return (
    <svg className="h-10 w-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#eef4fe" />
      <rect x="8" y="8" width="24" height="24" rx="1.5" stroke="#4782f3" strokeWidth="1.5" />
      <path d="M8 17h13M21 8v17" stroke="#4782f3" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 26h9" stroke="#4782f3" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="27.5" cy="27.5" r="3.5" fill="#4782f3" fillOpacity="0.25" />
    </svg>
  );
}

function DescriptionDocIcon() {
  return (
    <svg className="h-10 w-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#eef4fe" />
      <path d="M13 8h11l8 8v16a2 2 0 01-2 2H13a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#4782f3" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M24 8v8h8" stroke="#4782f3" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M15 21h10M15 26h6" stroke="#4782f3" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Helper functions ──────────────────────────────────────────────────────────

function formatDeadline(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("de-CH", { day: "numeric", month: "long", year: "numeric" }) +
    ", " +
    d.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" }) +
    " Uhr"
  );
}

function calcProgressPct(createdAt: string, deadline: string): number {
  const start = new Date(createdAt).getTime();
  const end = new Date(deadline).getTime();
  const now = Date.now();
  if (end <= start) return 100;
  return Math.max(0, Math.min(100, ((now - start) / (end - start)) * 100));
}

// ── Static content data ───────────────────────────────────────────────────────

const STEPS = [
  { num: 1, title: "Registrieren",         desc: "2 Minuten.",                           locked: false },
  { num: 2, title: "Unterlagen einsehen",  desc: "Sofort.",                              locked: true  },
  { num: 3, title: "Angebot einreichen",   desc: "Wenn bereit.",                         locked: true  },
  { num: 4, title: "Entscheid",            desc: "Der Eigentümer prüft alle Angebote.",  locked: true  },
] as const;

const DOCS: Array<{ icon: React.ReactNode; title: string; desc: string }> = [
  { icon: <HouseDocIcon />,       title: "Verkaufsdossier", desc: "Beschreibung & Fotos" },
  { icon: <FloorplanDocIcon />,   title: "Grundriss",       desc: "Alle Etagen & Masse"  },
  { icon: <DescriptionDocIcon />, title: "Baubeschrieb",    desc: "Technische Details"   },
];

// ── Component ─────────────────────────────────────────────────────────────────

const BuyerPublicEntry: React.FC = () => {
  const buyerBiddingId  = useGridbidUiStore((s) => s.buyerBiddingId);
  const navigateBuyer   = useGridbidUiStore((s) => s.navigateBuyer);
  const setBuyerBidding = useGridbidUiStore((s) => s.setBuyerBidding);
  const switchToAgency  = useGridbidUiStore((s) => s.switchToAgency);
  const service = useGridbidService();

  const [bidding, setBidding] = useState<GridbidBidding | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!buyerBiddingId) return;
    setLoading(true);
    service
      .getBiddingById(buyerBiddingId)
      .then((data) => {
        setBidding(data);
        if (data) setBuyerBidding(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [service, buyerBiddingId]);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-gray-400">
        Wird geladen…
      </div>
    );
  }

  if (!bidding) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-gray-400">
        Dieses Verfahren wurde nicht gefunden.
      </div>
    );
  }

  const daysUntilDeadline = bidding.deadline
    ? Math.ceil((new Date(bidding.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const progressPct = bidding.deadline
    ? calcProgressPct(bidding.createdAt, bidding.deadline)
    : 0;

  return (
    <div className="flex min-h-full flex-col bg-white">

      {/* ── Header ── */}
      <header className="sticky top-0 z-10 bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <GridBidLogoIcon />
            <span className="text-sm font-semibold tracking-tight text-gray-900">GridBid</span>
          </div>
          <button
            onClick={switchToAgency}
            className="text-sm text-gray-400 transition-colors hover:text-gray-700"
          >
            Zurück zur Agenturansicht
          </button>
        </div>
        <div className="h-px bg-gray-100" />
      </header>

      {/* ── Scrollable content ── */}
      <main className="flex-1 pb-24">
        <div className="mx-auto max-w-2xl space-y-8 px-6 py-8">

          {/* ── Property hero ── */}
          <div className="space-y-4">
            {bidding.imageUrl && (
              <div className="overflow-hidden rounded-xl">
                <img
                  src={bidding.imageUrl}
                  alt={bidding.title}
                  className="h-72 w-full object-cover"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {bidding.title}
              </h1>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-400">{bidding.address}</span>
                {bidding.websiteUrl && (
                  <>
                    <div className="h-4 w-px bg-gray-200" />
                    <a
                      href={bidding.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 font-medium text-gray-900 hover:text-gw-600"
                    >
                      Objektwebsite
                      <ExternalLinkIcon />
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── Deadline card ── */}
          {bidding.deadline && (
            <div className="space-y-4 rounded-lg border border-gray-200 p-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Angebotsrunde</p>
                {daysUntilDeadline !== null && daysUntilDeadline > 0 ? (
                  <p className="text-2xl font-bold text-gray-900">
                    Noch {daysUntilDeadline === 1 ? "1 Tag" : `${daysUntilDeadline} Tage`}
                  </p>
                ) : (
                  <p className="text-2xl font-bold text-gray-400">Frist abgelaufen</p>
                )}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <span className="text-gray-700">
                    Schliesst:{" "}
                    <span className="font-medium text-gw-600">{formatDeadline(bidding.deadline)}</span>
                  </span>
                  <div className="h-4 w-px bg-gray-200" />
                  <span className="text-gray-400">Danach keine weiteren Angebote möglich.</span>
                </div>
              </div>
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gw-600 transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          {/* ── How it works ── */}
          <div className="space-y-2">
            <p className="text-base font-bold text-gray-800">So funktioniert es</p>
            <div>
              {STEPS.map((step, i) => (
                <div key={step.num} className="flex min-h-[56px] items-stretch">
                  {/* Circle + connector lines */}
                  <div className="flex w-8 shrink-0 flex-col items-center">
                    <div className={`w-px flex-1 bg-gray-200 ${i === 0 ? "opacity-0" : ""}`} />
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-sm font-medium ${
                        step.num === 1
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {step.num}
                    </div>
                    <div className={`w-px flex-1 bg-gray-200 ${i === STEPS.length - 1 ? "opacity-0" : ""}`} />
                  </div>
                  {/* Content */}
                  <div className="flex flex-1 items-center px-4 py-2">
                    <div className="flex-1">
                      <p className={`text-base leading-6 text-gray-900 ${step.num === 1 ? "font-bold" : "font-medium"}`}>
                        {step.title}
                      </p>
                      <p className="text-sm leading-5 text-gray-400">{step.desc}</p>
                    </div>
                    {step.locked && (
                      <div className="ml-4 text-gray-300">
                        <LockIcon />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="h-px bg-gray-100" />

          {/* ── Documents ── */}
          <div className="space-y-3">
            <p className="text-base font-bold text-gray-800">Was du erhalten wirst</p>
            <div className="grid grid-cols-3 gap-3">
              {DOCS.map((doc) => (
                <div key={doc.title} className="space-y-3 rounded-lg border border-gray-200 p-4">
                  {doc.icon}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                    <p className="text-xs text-gray-400">{doc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400">
              – Weitere Dokumente werden mit dem Fortschritt freigeschaltet.
            </p>
          </div>

        </div>
      </main>

      {/* ── Sticky CTA footer ── */}
      <div className="sticky bottom-0 z-10 flex items-center justify-center border-t border-gray-200 bg-white px-6 py-4">
        <button
          onClick={() => navigateBuyer("register")}
          className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-gray-700"
        >
          Zugang zum Deal Room erhalten
          <ArrowRightIcon />
        </button>
      </div>

    </div>
  );
};

export default BuyerPublicEntry;
