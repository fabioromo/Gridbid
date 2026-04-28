import React, { useEffect, useRef, useState } from "react";
import { useGridbidUiStore } from "../../store/gridbidUiStore";
import { useGridbidService } from "../../services/GridbidServiceContext";
import { PriceDisplay } from "../../types/domain";
import type { GridbidBidding } from "../../types/domain";
import type { BuyerDealRoomTab, FinancingStatus } from "../../types/buyer";
import { formatDeadline, formatCHF } from "../../utils/labels";

// ─── Tab configuration ────────────────────────────────────────────────────────

const TABS: { id: BuyerDealRoomTab; label: string }[] = [
  { id: "overview", label: "Übersicht" },
  { id: "documents", label: "Unterlagen" },
  { id: "qa", label: "Fragen & Updates" },
  { id: "bid", label: "Angebot einreichen" },
];

// ─── Root component ───────────────────────────────────────────────────────────

const BuyerDealRoom: React.FC = () => {
  const buyerBiddingId = useGridbidUiStore((s) => s.buyerBiddingId);
  const buyerRegistration = useGridbidUiStore((s) => s.buyerRegistration);
  const activeTab = useGridbidUiStore((s) => s.buyerDealRoomTab);
  const setTab = useGridbidUiStore((s) => s.setBuyerDealRoomTab);
  const service = useGridbidService();
  const [bidding, setBidding] = useState<GridbidBidding | null>(null);
  const [loading, setLoading] = useState(true);
  const [documentsViewed, setDocumentsViewed] = useState(false);

  function handleTabChange(tab: BuyerDealRoomTab) {
    if (tab === "documents") setDocumentsViewed(true);
    setTab(tab);
  }

  useEffect(() => {
    if (!buyerBiddingId) return;
    setLoading(true);
    service
      .getBiddingById(buyerBiddingId)
      .then((data) => {
        setBidding(data);
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
        Verfahren nicht gefunden.
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
      {/* Deal Room header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-gray-400">
                Deal Room
              </div>
              <h1 className="text-lg font-semibold text-gray-900">{bidding.title}</h1>
              <p className="mt-0.5 text-sm text-gray-500">{bidding.address}</p>
            </div>
            {bidding.websiteUrl && (
              <a
                href={bidding.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-gw-200 bg-gw-50 px-3 py-2 text-xs font-medium text-gw-700 transition-colors hover:border-gw-300 hover:bg-gw-100"
              >
                Objektbeschreibung
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3M10 2h4m0 0v4m0-4L7 9" />
                </svg>
              </a>
            )}
          </div>

          {/* Tab nav */}
          <div className="mt-5 flex gap-0 border-b border-gray-100">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative -mb-px px-4 pb-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-gw-600 text-gw-600"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {tab.id === "bid" && activeTab !== "bid" && (
                  <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gw-600 text-[10px] font-bold text-white">
                    !
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="mx-auto max-w-3xl px-6 py-8">
        {activeTab === "overview" && (
          <OverviewTab
            bidding={bidding}
            documentsViewed={documentsViewed}
            onViewDocuments={() => handleTabChange("documents")}
            onSubmitBid={() => handleTabChange("bid")}
          />
        )}
        {activeTab === "documents" && <DocumentsTab bidding={bidding} />}
        {activeTab === "qa" && <QATab />}
        {activeTab === "bid" && <BidTab bidding={bidding} />}
      </div>
    </div>
  );
};

// ─── Overview tab ─────────────────────────────────────────────────────────────

function OverviewTab({
  bidding,
  documentsViewed,
  onViewDocuments,
  onSubmitBid,
}: {
  bidding: GridbidBidding;
  documentsViewed: boolean;
  onViewDocuments: () => void;
  onSubmitBid: () => void;
}) {
  const daysUntilDeadline = bidding.deadline
    ? Math.ceil((new Date(bidding.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="space-y-5">
      {/* Nächster Schritt guidance */}
      <div className="rounded-xl border border-gw-100 bg-gw-50 px-5 py-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gw-600">
          Nächster Schritt
        </p>
        <ol className="space-y-2">
          {[
            { num: 1, label: "Unterlagen prüfen", done: documentsViewed },
            { num: 2, label: "Fragen klären", done: false },
            { num: 3, label: "Angebot einreichen", done: false },
          ].map((step) => (
            <li key={step.num} className="flex items-center gap-2.5">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  step.done ? "bg-emerald-100 text-emerald-600" : "bg-gw-600 text-white"
                }`}
              >
                {step.done ? (
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 12 12"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M2 6l3 3 5-5" />
                  </svg>
                ) : (
                  step.num
                )}
              </span>
              <span
                className={`text-sm ${
                  step.done ? "text-gray-400 line-through" : "font-medium text-gray-700"
                }`}
              >
                {step.label}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Property teaser */}
      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <div className="flex items-start gap-4">
          {bidding.imageUrl && (
            <img
              src={bidding.imageUrl}
              alt={bidding.title}
              className="h-20 w-20 shrink-0 rounded-lg object-cover"
            />
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-gray-900">{bidding.title}</h3>
            <p className="mt-0.5 text-xs text-gray-400">{bidding.address}</p>
            {bidding.websiteUrl && (
              <a
                href={bidding.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-gw-600 underline underline-offset-2 hover:text-gw-500"
              >
                Vollständige Objektbeschreibung ansehen
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3M10 2h4m0 0v4m0-4L7 9" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Process timeline */}
      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-gray-700">Ablauf & Fristen</h2>
          <div className="flex items-center gap-3">
            {daysUntilDeadline !== null && daysUntilDeadline > 0 && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-orange-600">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                Endet in {daysUntilDeadline === 1 ? "1 Tag" : `${daysUntilDeadline} Tagen`}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Mehrere Interessenten aktiv
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <TimelineItem
            done
            label="Registrierung abgeschlossen"
            description="Du hast Zugang zum Deal Room."
          />
          <TimelineItem
            done
            label="Unterlagen zugänglich"
            description="Phase-1-Dokumente stehen bereit."
          />
          <TimelineItem
            active
            label="Angebotsabgabe"
            description={
              bidding.deadline
                ? `Frist: ${formatDeadline(bidding.deadline)}`
                : "Keine Frist gesetzt."
            }
          />
          <TimelineItem label="Entscheid" description="Der Eigentümer prüft alle Angebote." />
        </div>
      </div>

      {/* State-based primary CTA */}
      <div className="space-y-3">
        {!documentsViewed ? (
          <>
            <button
              onClick={onViewDocuments}
              className="w-full rounded-xl bg-gw-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-gw-500"
            >
              Unterlagen prüfen
            </button>
            <button
              onClick={onSubmitBid}
              className="w-full rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700"
            >
              Direkt zum Angebot
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onSubmitBid}
              className="w-full rounded-xl bg-gw-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-gw-500"
            >
              Angebot vorbereiten
            </button>
            <button
              onClick={onViewDocuments}
              className="w-full rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700"
            >
              Unterlagen nochmals ansehen
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function TimelineItem({
  label,
  description,
  done = false,
  active = false,
}: {
  label: string;
  description: string;
  done?: boolean;
  active?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
          done
            ? "bg-emerald-100 text-emerald-600"
            : active
            ? "bg-gw-600 text-white"
            : "bg-gray-100 text-gray-300"
        }`}
      >
        {done ? (
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 12 12"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M2 6l3 3 5-5" />
          </svg>
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
        )}
      </div>
      <div>
        <p className={`text-sm font-medium ${done || active ? "text-gray-900" : "text-gray-400"}`}>
          {label}
        </p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
  );
}

// ─── Documents tab ────────────────────────────────────────────────────────────

function DocumentsTab({ bidding }: { bidding: GridbidBidding }) {
  const buyerAccessTier = useGridbidUiStore((s) => s.buyerAccessTier);
  const setTab = useGridbidUiStore((s) => s.setBuyerDealRoomTab);
  const { level1, level2, level3 } = bidding.documents;
  const hasAny = level1.length > 0 || level2.length > 0 || level3.length > 0;

  const phase2Unlocked = buyerAccessTier === "verified" || buyerAccessTier === "full";
  const phase3Unlocked = buyerAccessTier === "full";

  if (!hasAny) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-8 text-center">
        <p className="text-sm text-gray-400">Noch keine Unterlagen freigegeben.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {level1.length > 0 && (
        <DocumentPhase
          phase="Phase 1 – Basisunterlagen"
          description="Für alle registrierten Interessenten zugänglich."
          documents={level1}
          unlocked
        />
      )}
      {level2.length > 0 && (
        <DocumentPhase
          phase="Phase 2 – Erweiterte Unterlagen"
          description="Zugänglich nach Abgabe eines Erstangebots."
          documents={level2}
          unlocked={phase2Unlocked}
          lockReason={
            phase2Unlocked
              ? undefined
              : "Reiche ein Angebot ein, um Zugang zu diesen Unterlagen zu erhalten."
          }
          lockCta={
            phase2Unlocked
              ? undefined
              : { label: "Zum Angebot", onClick: () => setTab("bid") }
          }
        />
      )}
      {level3.length > 0 && (
        <DocumentPhase
          phase="Phase 3 – Vertragsdokumente"
          description="Wird individuell durch den Makler freigegeben."
          documents={level3}
          unlocked={phase3Unlocked}
          lockReason={
            phase3Unlocked
              ? undefined
              : "Diese Unterlagen werden vom Makler individuell für qualifizierte Käufer freigegeben."
          }
        />
      )}
    </div>
  );
}

function DocumentPhase({
  phase,
  description,
  documents,
  unlocked,
  lockReason,
  lockCta,
}: {
  phase: string;
  description: string;
  documents: string[];
  unlocked: boolean;
  lockReason?: string;
  lockCta?: { label: string; onClick: () => void };
}) {
  return (
    <div
      className={`rounded-xl border bg-white p-6 ${
        unlocked ? "border-gray-100" : "border-gray-100"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className={`text-sm font-semibold ${unlocked ? "text-gray-800" : "text-gray-500"}`}>
            {phase}
          </h3>
          <p className="mt-0.5 text-xs text-gray-400">{description}</p>
        </div>
        {!unlocked && (
          <span className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-400">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Gesperrt
          </span>
        )}
      </div>
      <div className={`space-y-2 ${unlocked ? "" : "opacity-50"}`}>
        {documents.map((doc) => (
          <div
            key={doc}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${
              unlocked ? "cursor-pointer bg-gray-50 hover:bg-gray-100" : "bg-gray-50"
            }`}
          >
            <svg
              className="h-4 w-4 shrink-0 text-gray-400"
              fill="none"
              viewBox="0 0 20 20"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="flex-1 text-sm text-gray-700">{doc}</span>
            {unlocked ? (
              <svg
                className="h-3.5 w-3.5 text-gray-400"
                fill="none"
                viewBox="0 0 16 16"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 8h8M9 5l3 3-3 3" />
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
      {!unlocked && lockReason && (
        <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
          <p className="text-xs text-gray-500">{lockReason}</p>
          {lockCta && (
            <button
              type="button"
              onClick={lockCta.onClick}
              className="mt-2 text-xs font-medium text-gw-600 hover:text-gw-500"
            >
              {lockCta.label} →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Q&A tab ──────────────────────────────────────────────────────────────────

const MOCK_UPDATES = [
  {
    id: "u1",
    date: "2026-04-11T10:00:00.000Z",
    type: "update" as const,
    title: "Besichtigungstermin bestätigt",
    body: "Die Besichtigung findet am Samstag, 14. Juni von 10–12 Uhr statt. Bitte melde dich per E-Mail an, um deinen Platz zu reservieren.",
  },
  {
    id: "u2",
    date: "2026-04-12T14:30:00.000Z",
    type: "faq" as const,
    title: "Ist eine Teilfinanzierung möglich?",
    body: "Ja, Hypothekarangebote werden akzeptiert. Bitte lege eine Finanzierungsbestätigung deiner Bank bei der Angebotsabgabe bei.",
  },
];

function QATab() {
  const [question, setQuestion] = useState("");
  const [sent, setSent] = useState(false);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setSent(true);
    setQuestion("");
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div className="space-y-6">
      {/* Updates feed */}
      <div>
        <h2 className="mb-4 text-sm font-semibold text-gray-700">Updates & FAQ</h2>
        <div className="space-y-3">
          {MOCK_UPDATES.map((item) => (
            <div key={item.id} className="rounded-xl border border-gray-100 bg-white p-5">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    item.type === "update"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {item.type === "update" ? "Update" : "FAQ"}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(item.date).toLocaleDateString("de-CH")}
                </span>
              </div>
              <p className="mb-1.5 text-sm font-medium text-gray-900">{item.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Question form */}
      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <h2 className="mb-1 text-sm font-semibold text-gray-700">Frage stellen</h2>
        <p className="mb-4 text-xs text-gray-400">
          Deine Frage wird vertraulich an den zuständigen Makler weitergeleitet.
        </p>
        {sent ? (
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Frage erfolgreich gesendet. Du erhältst eine Antwort per E-Mail.
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-3">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Deine Frage …"
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:border-gw-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!question.trim()}
              className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:opacity-40"
            >
              Frage senden
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Bid tab ──────────────────────────────────────────────────────────────────

type OfferValidityDays = 14 | 30 | 60;

const STEP = 5_000;

function parseAmount(s: string): number | null {
  const n = parseInt(s.replace(/[\s'\u2019]/g, ""), 10);
  return isNaN(n) || n <= 0 ? null : n;
}

function formatAmountInput(n: number): string {
  return new Intl.NumberFormat("de-CH").format(n);
}

function roundTo5k(n: number): number {
  return Math.round(n / STEP) * STEP;
}

function resolveVisiblePrice(bidding: GridbidBidding): number | null {
  if (bidding.priceDisplay === PriceDisplay.PRICE) {
    return bidding.richtpreis ?? bidding.listingPrice ?? null;
  }
  return null;
}

function getClosingDateOptions(): { value: string; label: string }[] {
  const now = new Date();
  const opts: { value: string; label: string }[] = [{ value: "sofort", label: "Sofort" }];
  for (let i = 1; i <= 5; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    opts.push({
      value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleDateString("de-CH", { month: "long", year: "numeric" }),
    });
  }
  return opts;
}

function daysUntil(isoDate: string): number {
  return Math.ceil((new Date(isoDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function formatDeadlineCompact(isoDate: string): string {
  const d = new Date(isoDate);
  const datePart = d.toLocaleDateString("de-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timePart = d.toLocaleTimeString("de-CH", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart}, ${timePart} Uhr`;
}

const FINANCING_LABELS: Record<FinancingStatus, string> = {
  open: "Noch offen",
  in_preparation: "In Vorbereitung",
  confirmed: "Bereits bestätigt",
};

const FINANCING_SIGNAL: Record<FinancingStatus, { label: string; color: string }> = {
  open: { label: "Geringere Sicherheit", color: "text-orange-500" },
  in_preparation: { label: "Mittlere Sicherheit", color: "text-amber-500" },
  confirmed: { label: "Hohe Sicherheit", color: "text-emerald-600" },
};

function BidTab({ bidding }: { bidding: GridbidBidding }) {
  const buyerRegistration = useGridbidUiStore((s) => s.buyerRegistration);
  const setBuyerAccessTier = useGridbidUiStore((s) => s.setBuyerAccessTier);

  const visiblePrice = resolveVisiblePrice(bidding);
  const [amount, setAmount] = useState(visiblePrice ? formatAmountInput(roundTo5k(visiblePrice)) : "");
  const [validityDays, setValidityDays] = useState<OfferValidityDays>(30);
  const [financingStatus, setFinancingStatus] = useState<FinancingStatus>(
    buyerRegistration?.financingStatus ?? "in_preparation"
  );
  const financingFromProfile =
    !!buyerRegistration && buyerRegistration.financingStatus === financingStatus;
  const [closingDate, setClosingDate] = useState("");
  const [conditions, setConditions] = useState("");
  const [idUploaded, setIdUploaded] = useState(false);
  const [financingProofUploaded, setFinancingProofUploaded] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const parsedAmount = parseAmount(amount);
  const isValidAmount = parsedAmount !== null;

  function handleAmountBlur() {
    if (parsedAmount) setAmount(formatAmountInput(roundTo5k(parsedAmount)));
  }

  function stepAmount(delta: number) {
    if (parsedAmount === null) {
      // First interaction with no value → land on 650'000 regardless of direction
      setAmount(formatAmountInput(650_000));
      return;
    }
    const next = Math.max(STEP, roundTo5k(parsedAmount) + delta);
    setAmount(formatAmountInput(next));
  }

  const trustCards = [
    { icon: "🔒", label: "Vertraulich", sub: "Nur der Eigentümer sieht dein Angebot" },
    { icon: "📄", label: "Dokumentiert", sub: "Automatische Bestätigung per E-Mail" },
    idUploaded || financingProofUploaded
      ? { icon: "⭐", label: "Verifiziert", sub: "Dein Angebot wird bevorzugt behandelt" }
      : { icon: "🔓", label: "Verifizierung", sub: "Verifizierte Käufer werden bevorzugt" },
  ];

  if (submitted) {
    return (
      <BidSubmittedState
        amount={parsedAmount ?? 0}
        idUploaded={idUploaded}
        financingProofUploaded={financingProofUploaded}
        onEdit={() => setSubmitted(false)}
      />
    );
  }

  if (confirming) {
    return (
      <BidConfirmationView
        amount={parsedAmount!}
        validityDays={validityDays}
        financingStatus={financingStatus}
        conditions={conditions}
        closingDate={closingDate}
        idUploaded={idUploaded}
        financingProofUploaded={financingProofUploaded}
        onBack={() => setConfirming(false)}
        onConfirm={() => {
          setBuyerAccessTier("verified");
          setSubmitted(true);
        }}
      />
    );
  }

  const deadlineDays = bidding.deadline ? daysUntil(bidding.deadline) : null;

  return (
    <div className="space-y-5">
      <BuyerStatusStrip idUploaded={idUploaded} financingProofUploaded={financingProofUploaded} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isValidAmount) setConfirming(true);
        }}
        className="space-y-5"
      >
        {/* Main form */}
        <div className="rounded-xl border border-gray-100 bg-white p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Angebot einreichen</h2>
              <p className="mt-0.5 text-xs text-gray-400">
                Dein Angebot wird vertraulich an den Eigentümer weitergeleitet.
              </p>
            </div>
            {bidding.deadline && deadlineDays !== null && deadlineDays > 0 && (
              <div className="shrink-0 text-right">
                <span className="block rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600">
                  {formatDeadlineCompact(bidding.deadline)}
                </span>
                <span className="mt-1 block text-right text-xs text-orange-400">
                  Noch {deadlineDays === 1 ? "1 Tag" : `${deadlineDays} Tage`}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {/* Amount stepper */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Angebotsbetrag
              </label>
              <AmountStepper
                value={amount}
                onChange={setAmount}
                onBlur={handleAmountBlur}
                onStep={stepAmount}
              />
              {amount && !isValidAmount && (
                <p className="mt-1.5 text-xs text-red-500">Bitte gib einen gültigen Betrag ein.</p>
              )}
            </div>

            {/* Validity */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Angebot gültig für
              </label>
              <div className="flex gap-2">
                {([14, 30, 60] as OfferValidityDays[]).map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setValidityDays(days)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      validityDays === days
                        ? "border-gw-500 bg-gw-50 text-gw-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {days} Tage
                  </button>
                ))}
              </div>
            </div>

            {/* Financing status */}
            <div>
              <div className="mb-1.5 flex items-baseline justify-between gap-2">
                <label className="text-sm font-medium text-gray-700">Finanzierungsstatus</label>
                {financingFromProfile && (
                  <span className="text-xs text-gray-400">basierend auf deinem Profil</span>
                )}
              </div>
              <div className="space-y-2">
                {(["open", "in_preparation", "confirmed"] as FinancingStatus[]).map((status) => (
                  <label
                    key={status}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                      financingStatus === status
                        ? "border-gw-300 bg-gw-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="financingStatus"
                      value={status}
                      checked={financingStatus === status}
                      onChange={() => setFinancingStatus(status)}
                      className="h-4 w-4 accent-gw-600"
                    />
                    <div>
                      <span className="text-sm text-gray-700">{FINANCING_LABELS[status]}</span>
                      <span className={`mt-0.5 block text-xs ${FINANCING_SIGNAL[status].color}`}>
                        {FINANCING_SIGNAL[status].label}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Closing date pills */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Gewünschter Übergabetermin{" "}
                <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <ClosingDatePills value={closingDate} onChange={setClosingDate} />
            </div>

            {/* Conditions */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Bedingungen / Bemerkungen{" "}
                <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                placeholder="z.B. Vorbehalt Finanzierungszusage …"
                rows={3}
                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:border-gw-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Verification section */}
        <VerificationSection
          idUploaded={idUploaded}
          financingProofUploaded={financingProofUploaded}
          onIdUpload={() => setIdUploaded(true)}
          onFinancingUpload={() => setFinancingProofUploaded(true)}
        />

        {/* Offer readiness panel — always visible */}
        <OfferReadinessPanel
          financingStatus={financingStatus}
          idUploaded={idUploaded}
          financingProofUploaded={financingProofUploaded}
          amount={parsedAmount ?? undefined}
        />

        <div>
          {!isValidAmount && (
            <p className="mb-2 text-center text-xs text-gray-400">
              Bitte gib einen Angebotsbetrag ein, um fortzufahren.
            </p>
          )}
          {isValidAmount && (
            <p className="mb-3 text-center text-xs text-gray-400">
              Du bist dabei, dein Angebot an den Verkäufer zu übermitteln.
            </p>
          )}
          <button
            type="submit"
            disabled={!isValidAmount}
            className="w-full rounded-xl bg-gw-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-gw-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Angebot prüfen & bestätigen
          </button>
        </div>
      </form>

      {/* Trust cards — third is dynamic based on verification state */}
      <div className="grid grid-cols-3 gap-3">
        {trustCards.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-gray-100 bg-white p-4 text-center"
          >
            <p className="mb-1 text-lg">{item.icon}</p>
            <p className="text-xs font-semibold text-gray-700">{item.label}</p>
            <p className="mt-0.5 text-xs text-gray-400">{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Buyer status strip ───────────────────────────────────────────────────────

function BuyerStatusStrip({
  idUploaded,
  financingProofUploaded,
}: {
  idUploaded: boolean;
  financingProofUploaded: boolean;
}) {
  const isVerified = idUploaded || financingProofUploaded;
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white px-5 py-3.5">
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-semibold text-gw-700">Stufe 2 von 3</span>
        <span className="text-xs text-gray-300">–</span>
        <span className="text-xs text-gray-500">Qualifiziert</span>
      </div>
      {isVerified ? (
        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 12 12"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M2 6l3 3 5-5" />
          </svg>
          Verifiziert
        </span>
      ) : (
        <p className="text-xs text-gray-400">
          Verifiziere dein Profil, um dein Angebot zu stärken ↓
        </p>
      )}
    </div>
  );
}

// ─── Verification section ─────────────────────────────────────────────────────

function VerificationSection({
  idUploaded,
  financingProofUploaded,
  onIdUpload,
  onFinancingUpload,
}: {
  idUploaded: boolean;
  financingProofUploaded: boolean;
  onIdUpload: () => void;
  onFinancingUpload: () => void;
}) {
  const idRef = useRef<HTMLInputElement>(null);
  const financingRef = useRef<HTMLInputElement>(null);
  const uploadCount = (idUploaded ? 1 : 0) + (financingProofUploaded ? 1 : 0);
  const badge =
    uploadCount === 2
      ? { label: "Verifiziert", cls: "bg-emerald-50 text-emerald-700" }
      : uploadCount === 1
      ? { label: "Teilweise verifiziert", cls: "bg-amber-50 text-amber-700" }
      : null;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <input
        ref={idRef}
        type="file"
        className="hidden"
        accept="image/*,application/pdf"
        onChange={onIdUpload}
      />
      <input
        ref={financingRef}
        type="file"
        className="hidden"
        accept="image/*,application/pdf"
        onChange={onFinancingUpload}
      />

      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">
            Stärke dein Angebot{" "}
            <span className="font-normal text-gray-400">(optional)</span>
          </h3>
          <p className="mt-0.5 text-xs text-gray-400">
            Verifizierte Angebote werden vom Verkäufer bevorzugt geprüft und ausgewählt.
          </p>
        </div>
        {badge && (
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${badge.cls}`}>
            {badge.label}
          </span>
        )}
      </div>

      <div className="space-y-2.5">
        <UploadRow
          label="Ausweis"
          description="Personalausweis oder Reisepass"
          uploaded={idUploaded}
          onUpload={() => idRef.current?.click()}
        />
        <UploadRow
          label="Finanzierungsbestätigung"
          description="Bankbestätigung oder Hypothekenangebot"
          uploaded={financingProofUploaded}
          onUpload={() => financingRef.current?.click()}
        />
      </div>
    </div>
  );
}

function UploadRow({
  label,
  description,
  uploaded,
  onUpload,
}: {
  label: string;
  description: string;
  uploaded: boolean;
  onUpload: () => void;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 ${
        uploaded ? "border-emerald-200 bg-emerald-50" : "border-gray-200"
      }`}
    >
      <div>
        <p className={`text-sm font-medium ${uploaded ? "text-emerald-800" : "text-gray-700"}`}>
          {label}
        </p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      {uploaded ? (
        <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-emerald-600">
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 12 12"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M2 6l3 3 5-5" />
          </svg>
          Hochgeladen
        </span>
      ) : (
        <button
          type="button"
          onClick={onUpload}
          className="shrink-0 rounded-lg border border-gw-200 bg-gw-50 px-3 py-1.5 text-xs font-medium text-gw-700 transition-colors hover:border-gw-300 hover:bg-gw-100"
        >
          Hochladen
        </button>
      )}
    </div>
  );
}

// ─── Amount stepper ───────────────────────────────────────────────────────────

function AmountStepper({
  value,
  onChange,
  onBlur,
  onStep,
}: {
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  onStep: (delta: number) => void;
}) {
  return (
    <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-200 focus-within:border-gw-500">
      <button
        type="button"
        onClick={() => onStep(-STEP)}
        aria-label="Betrag verringern"
        className="flex w-12 shrink-0 items-center justify-center border-r border-gray-200 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700 active:bg-gray-100 active:text-gray-800"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 16 16">
          <path d="M3 8h10" />
        </svg>
      </button>
      <div className="relative flex flex-1 items-center">
        <span className="pointer-events-none absolute left-3.5 text-sm font-medium text-gray-400">
          CHF
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder="1'250'000"
          className="w-full border-none bg-transparent py-3 pl-12 pr-4 font-mono text-base text-gray-900 placeholder-gray-300 focus:outline-none"
          required
        />
      </div>
      <button
        type="button"
        onClick={() => onStep(STEP)}
        aria-label="Betrag erhöhen"
        className="flex w-12 shrink-0 items-center justify-center border-l border-gray-200 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700 active:bg-gray-100 active:text-gray-800"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 16 16">
          <path d="M8 3v10M3 8h10" />
        </svg>
      </button>
    </div>
  );
}

// ─── Closing date pills ───────────────────────────────────────────────────────

function ClosingDatePills({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const options = getClosingDateOptions();
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(value === opt.value ? "" : opt.value)}
          className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
            value === opt.value
              ? "border-gw-400 bg-gw-50 text-gw-700"
              : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Offer readiness panel ────────────────────────────────────────────────────

function OfferReadinessPanel({
  financingStatus,
  idUploaded,
  financingProofUploaded,
  amount,
}: {
  financingStatus: FinancingStatus;
  idUploaded: boolean;
  financingProofUploaded: boolean;
  amount?: number;
}) {
  const fullyVerified = idUploaded && financingProofUploaded;

  if (fullyVerified) {
    return (
      <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <svg
            className="h-4 w-4 shrink-0 text-emerald-500"
            fill="none"
            viewBox="0 0 16 16"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M2 8l4 4 8-8" />
          </svg>
          <p className="text-sm font-medium text-emerald-800">
            Dein Angebot ist vollständig verifiziert
          </p>
        </div>
        <p className="mt-1 pl-6 text-xs text-emerald-600">
          Dieses Angebot hebt sich deutlich hervor.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white px-5 py-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Angebot im Überblick
      </p>
      {amount !== undefined && amount > 0 && (
        <div className="mb-4 border-b border-gray-100 pb-3">
          <p className="font-mono text-xl font-bold text-gray-900">{formatCHF(amount)}</p>
        </div>
      )}
      <div className="space-y-2.5">
        <ReadinessRow
          label="Finanzierung"
          value={FINANCING_LABELS[financingStatus]}
          ok={financingStatus === "confirmed"}
          neutral={financingStatus === "in_preparation"}
        />
        <ReadinessRow
          label="Identität"
          value={idUploaded ? "Hochgeladen" : "Nicht verifiziert"}
          ok={idUploaded}
        />
        <ReadinessRow
          label="Finanzierungsnachweis"
          value={financingProofUploaded ? "Hochgeladen" : "Fehlt"}
          ok={financingProofUploaded}
        />
      </div>
      {!idUploaded && !financingProofUploaded && (
        <p className="mt-3 text-xs text-gw-600">
          → Verifiziere dein Angebot, um deine Erfolgschancen zu erhöhen
        </p>
      )}
    </div>
  );
}

function ReadinessRow({
  label,
  value,
  ok,
  neutral = false,
}: {
  label: string;
  value: string;
  ok: boolean;
  neutral?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-2 text-sm text-gray-600">
        {ok ? (
          <svg
            className="h-3.5 w-3.5 shrink-0 text-emerald-500"
            fill="none"
            viewBox="0 0 12 12"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M2 6l3 3 5-5" />
          </svg>
        ) : (
          <svg
            className="h-3.5 w-3.5 shrink-0 text-gray-300"
            fill="none"
            viewBox="0 0 12 12"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M9 3L3 9M3 3l6 6" />
          </svg>
        )}
        {label}
      </span>
      <span
        className={`text-sm font-medium ${
          ok ? "text-emerald-700" : neutral ? "text-amber-600" : "text-gray-400"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Strength feedback ────────────────────────────────────────────────────────

function StrengthFeedback({
  amount,
  financingStatus,
  idUploaded,
  financingProofUploaded,
  showAmount = true,
}: {
  amount: number;
  financingStatus: FinancingStatus;
  idUploaded: boolean;
  financingProofUploaded: boolean;
  showAmount?: boolean;
}) {
  const hasVerification = idUploaded || financingProofUploaded;
  const fullyVerified = idUploaded && financingProofUploaded;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {showAmount ? "Dein Angebot" : "Angebotsstärke"}
        </p>
        {showAmount && (
          <span className="font-mono text-base font-semibold text-gray-900">
            {formatCHF(amount)}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <FeedbackRow done label={`Finanzierung: ${FINANCING_LABELS[financingStatus]}`} />
        {hasVerification ? (
          <FeedbackRow
            done
            label={fullyVerified ? "Vollständig verifiziert" : "Teilweise verifiziert"}
          />
        ) : (
          <>
            <FeedbackRow done={false} label="Keine Verifizierung" />
            <p className="pl-6 text-xs text-gw-600">
              → Verifizierte Angebote haben höhere Erfolgschancen
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function FeedbackRow({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
          done ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-300"
        }`}
      >
        {done ? (
          <svg
            className="h-2.5 w-2.5"
            fill="none"
            viewBox="0 0 12 12"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M2 6l3 3 5-5" />
          </svg>
        ) : (
          <svg
            className="h-2.5 w-2.5"
            fill="none"
            viewBox="0 0 12 12"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M9 3L3 9M3 3l6 6" />
          </svg>
        )}
      </span>
      <span className={`text-sm ${done ? "text-gray-700" : "text-gray-400"}`}>{label}</span>
    </div>
  );
}

// ─── Closing date formatter ───────────────────────────────────────────────────

function formatClosingDate(closingDate: string): string {
  if (!closingDate) return "Nicht angegeben";
  if (closingDate === "sofort") return "Sofort";
  const [year, month] = closingDate.split("-").map(Number);
  const d = new Date(year, month - 1, 1);
  return d.toLocaleDateString("de-CH", { month: "long", year: "numeric" });
}

// ─── Bid confirmation view ────────────────────────────────────────────────────

function BidConfirmationView({
  amount,
  validityDays,
  financingStatus,
  conditions,
  closingDate,
  idUploaded,
  financingProofUploaded,
  onBack,
  onConfirm,
}: {
  amount: number;
  validityDays: OfferValidityDays;
  financingStatus: FinancingStatus;
  conditions: string;
  closingDate: string;
  idUploaded: boolean;
  financingProofUploaded: boolean;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const fullyVerified = idUploaded && financingProofUploaded;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Angebot prüfen</h2>
        <p className="mt-1 text-sm text-gray-500">
          Bitte prüfe dein Angebot sorgfältig, bevor du es an den Verkäufer übermittelst.
        </p>
      </div>

      {/* Primary: offer summary — stronger visual weight */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 border-b border-gray-100 pb-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Angebotsbetrag
          </p>
          <p className="font-mono text-2xl font-bold text-gray-900">{formatCHF(amount)}</p>
        </div>
        <div className="space-y-3">
          <SummaryRow label="Gültigkeit" value={`${validityDays} Tage`} />
          <SummaryRow label="Finanzierungsstatus" value={FINANCING_LABELS[financingStatus]} />
          <SummaryRow
            label="Übergabetermin"
            value={closingDate ? formatClosingDate(closingDate) : "Nicht angegeben"}
          />
          {conditions ? (
            <div className="border-t border-gray-100 pt-3">
              <p className="mb-1 text-sm text-gray-500">Bedingungen / Bemerkungen</p>
              <p className="text-sm leading-relaxed text-gray-700">{conditions}</p>
            </div>
          ) : (
            <SummaryRow label="Bedingungen / Bemerkungen" value="Nicht angegeben" />
          )}
        </div>
      </div>

      {/* Secondary: verification/trust block — lighter visual weight */}
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Verifikation
        </p>
        <div className="mb-4 space-y-2.5">
          <SummaryRow
            label="Identität"
            value={idUploaded ? "Verifiziert" : "Nicht verifiziert"}
          />
          <SummaryRow
            label="Finanzierungsnachweis"
            value={financingProofUploaded ? "Hochgeladen" : "Fehlt"}
          />
          <SummaryRow label="Finanzierung" value={FINANCING_LABELS[financingStatus]} />
        </div>
        {fullyVerified ? (
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
            <p className="text-sm font-medium text-emerald-800">
              ✔ Dein Angebot ist vollständig verifiziert und hebt sich positiv hervor.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            <p className="text-xs text-gray-500">
              Verifizierte Angebote werden vom Verkäufer bevorzugt berücksichtigt.
            </p>
            <p className="text-xs text-gw-600">
              Du kannst dein Angebot jederzeit noch durch zusätzliche Verifizierung stärken.
            </p>
          </div>
        )}
      </div>

      {/* Confirmation statement */}
      <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4">
        <p className="text-sm leading-relaxed text-gray-600">
          Du reichst mit diesem Angebot eine ernsthafte Kaufabsicht ein.
          <br />
          Das Angebot wird dem Verkäufer zur Prüfung übermittelt.
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={onConfirm}
          className="w-full rounded-xl bg-gw-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-gw-500"
        >
          Angebot übermitteln
        </button>
        <button
          type="button"
          onClick={onBack}
          className="w-full rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700"
        >
          Zurück zur Bearbeitung
        </button>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-sm text-gray-500">{label}</span>
      <span
        className={`font-medium ${
          highlight ? "font-mono text-base text-gray-900" : "text-sm text-gray-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Bid submitted state ──────────────────────────────────────────────────────

function BidSubmittedState({
  amount,
  idUploaded,
  financingProofUploaded,
  onEdit,
}: {
  amount: number;
  idUploaded: boolean;
  financingProofUploaded: boolean;
  onEdit: () => void;
}) {
  const setTab = useGridbidUiStore((s) => s.setBuyerDealRoomTab);
  const hasVerification = idUploaded || financingProofUploaded;

  return (
    <div className="space-y-4">
      {/* Success card */}
      <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          <svg
            className="h-6 w-6 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mb-2 text-base font-semibold text-emerald-800">
          Dein Angebot wurde erfolgreich übermittelt.
        </h2>
        <p className="text-sm leading-relaxed text-emerald-700">
          Der Verkäufer wurde informiert und wird dein Angebot prüfen.
        </p>
        <p className="mt-3 text-sm font-medium text-emerald-800">
          Du kannst dein Angebot jederzeit bis zum Ablauf der Frist anpassen.
        </p>
        <p className="mt-3 text-xs text-emerald-600">Du erhältst eine Bestätigung per E-Mail.</p>
        {(idUploaded || financingProofUploaded) && (
          <p className="mt-3 text-xs font-medium text-emerald-700">
            Dein Angebot wurde als verifiziert eingereicht und hebt sich positiv hervor.
          </p>
        )}
      </div>

      {/* Process timeline */}
      <div className="rounded-xl border border-gray-100 bg-white p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Status deines Angebots
        </p>
        <div className="space-y-3">
          <TimelineItem
            done
            label="Angebot eingereicht"
            description="Dein Angebot wurde erfolgreich übermittelt."
          />
          <TimelineItem
            active
            label="In Prüfung"
            description="Der Eigentümer prüft alle eingegangenen Angebote."
          />
          <TimelineItem
            label="Entscheid"
            description="Du wirst per E-Mail über den Entscheid informiert."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setTab("overview")}
          className="w-full rounded-xl bg-gw-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-gw-500"
        >
          Zurück zur Übersicht
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="w-full rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700"
        >
          Angebot bearbeiten (bis Frist möglich)
        </button>
      </div>
    </div>
  );
}

export default BuyerDealRoom;
