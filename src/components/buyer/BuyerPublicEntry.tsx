import React, { useEffect, useState } from "react";
import { useGridbidUiStore } from "../../store/gridbidUiStore";
import { useGridbidService } from "../../services/GridbidServiceContext";
import type { GridbidBidding } from "../../types/domain";

const STEPS_VISIBLE = [
  {
    bold: "Registrierung",
    rest: " – Deine Kontaktdaten und dein Kaufinteresse in 2 kurzen Schritten.",
  },
  {
    bold: "Unterlagen ansehen",
    rest: " – Du erhältst Zugriff auf die ersten Unterlagen zum Objekt.",
  },
];

const STEPS_COLLAPSED = [
  {
    bold: "Angebot einreichen",
    rest: " – Dein Angebot wird vertraulich und strukturiert übermittelt.",
  },
  {
    bold: "Entscheid",
    rest: " – Der Eigentümer prüft alle Angebote und entscheidet.",
  },
];

function formatDeadlineShort(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString("de-CH");
  const time = d.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" });
  return `${date}, ${time} Uhr`;
}

// ── Lock icon ─────────────────────────────────────────────────────────────────

function LockIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M8 1a3 3 0 00-3 3v1H4a1 1 0 00-1 1v7a1 1 0 001 1h8a1 1 0 001-1V6a1 1 0 00-1-1h-1V4a3 3 0 00-3-3zm-1 3a1 1 0 112 0v1H7V4zm1 4a1 1 0 011 1v2a1 1 0 11-2 0V9a1 1 0 011-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

const BuyerPublicEntry: React.FC = () => {
  const buyerBiddingId  = useGridbidUiStore((s) => s.buyerBiddingId);
  const navigateBuyer   = useGridbidUiStore((s) => s.navigateBuyer);
  const setBuyerBidding = useGridbidUiStore((s) => s.setBuyerBidding);
  const service = useGridbidService();

  const [bidding, setBidding] = useState<GridbidBidding | null>(null);
  const [loading, setLoading] = useState(true);
  const [stepsExpanded, setStepsExpanded] = useState(false);

  useEffect(() => {
    if (!buyerBiddingId) return;
    setLoading(true);
    service
      .getBiddingById(buyerBiddingId)
      .then((data) => {
        setBidding(data);
        if (data) setBuyerBidding(data); // cache in store — registration steps read from here
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

  return (
    <div className="min-h-full bg-white">
      <div className="mx-auto max-w-2xl px-6 py-14">

        {/* ── Property hero ── */}
        {bidding.imageUrl && (
          <div className="relative mb-8 overflow-hidden rounded-2xl shadow-md">
            <img
              src={bidding.imageUrl}
              alt={bidding.title}
              className="h-72 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/45 px-4 py-1.5 backdrop-blur-sm">
                <LockIcon />
                <span className="text-xs font-semibold uppercase tracking-wider text-white">
                  Privater Deal Room
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Title block ── */}
        <div className="mb-12 text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-gray-900">
            {bidding.title}
          </h1>
          <p className="mb-4 text-sm text-gray-400">{bidding.address}</p>
          {bidding.websiteUrl && (
            <a
              href={bidding.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gw-600 hover:text-gw-500"
            >
              Objektwebsite ansehen
              <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3M10 2h4m0 0v4m0-4L7 9" />
              </svg>
            </a>
          )}
        </div>

        {/* ── Process summary — progressive disclosure ── */}
        <div className="mb-14">
          <p className="mb-5 text-xs font-medium uppercase tracking-wider text-gray-400">
            So läuft der Prozess
          </p>
          <ol className="space-y-4">
            {STEPS_VISIBLE.map((step, i) => (
              <li key={i} className="flex items-start gap-3.5 text-sm text-gray-600">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gw-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span>
                  <span className="font-semibold text-gray-800">{step.bold}</span>
                  {step.rest}
                </span>
              </li>
            ))}
            {stepsExpanded && STEPS_COLLAPSED.map((step, i) => (
              <li key={i} className="flex items-start gap-3.5 text-sm text-gray-600">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-500">
                  {i + 3}
                </span>
                <span>
                  <span className="font-semibold text-gray-700">{step.bold}</span>
                  {step.rest}
                </span>
              </li>
            ))}
          </ol>
          <button
            onClick={() => setStepsExpanded((v) => !v)}
            className="mt-4 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
          >
            {stepsExpanded ? "Weniger anzeigen" : "Alle Schritte anzeigen"}
            <svg
              className={`h-3 w-3 transition-transform ${stepsExpanded ? "rotate-180" : ""}`}
              viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>
        </div>

        {/* ── CTA decision zone ── */}
        <div>

          {/* Deadline — typographic, not an alert */}
          {bidding.deadline && (
            <div className="mb-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                Angebotsfrist
              </p>
              {daysUntilDeadline !== null && daysUntilDeadline > 0 ? (
                <>
                  <p className="text-3xl font-bold tracking-tight text-gray-900">
                    Noch{" "}
                    {daysUntilDeadline === 1 ? "1 Tag" : `${daysUntilDeadline} Tage`}
                  </p>
                  <p className="mt-1.5 text-sm text-gray-500">
                    {formatDeadlineShort(bidding.deadline)} – danach wird der Deal Room geschlossen.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold text-gray-400">
                    Angebotsfrist abgelaufen
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    {formatDeadlineShort(bidding.deadline)}
                  </p>
                </>
              )}
            </div>
          )}

          <hr className="mb-6 border-gray-100" />

          {/* Exclusivity signal */}
          <p className="mb-4 flex items-center gap-2 text-xs text-gray-400">
            <LockIcon />
            Zugang nur für registrierte Interessenten.
          </p>

          {/* Value proposition — tangible reward before the click */}
          <p className="mb-5 text-sm text-gray-600">
            Grundriss, Verkaufsdossier, Baubeschrieb –{" "}
            <span className="font-medium text-gray-800">sofort nach Registrierung verfügbar.</span>
          </p>

          {/* CTA */}
          <button
            onClick={() => navigateBuyer("register")}
            className="w-full rounded-xl bg-gw-600 px-6 py-5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-gw-500"
          >
            Jetzt Unterlagen freischalten
          </button>

          {/* Micro-copy */}
          <p className="mt-3 text-center text-xs text-gray-300">
            Dauert weniger als 1 Minute · Unverbindlich · Vertraulich
          </p>

        </div>
      </div>
    </div>
  );
};

export default BuyerPublicEntry;
