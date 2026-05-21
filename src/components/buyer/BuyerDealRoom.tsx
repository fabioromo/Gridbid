import React, { useEffect, useRef, useState } from "react";
import { useGridbidUiStore } from "../../store/gridbidUiStore";

// ─── Logo ─────────────────────────────────────────────────────────────────────

function GridBidLogoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#4782f3" aria-hidden="true">
      <circle cx="12" cy="12"   r="2.63" /><circle cx="12" cy="7"    r="2.63" />
      <circle cx="12" cy="17"   r="2.63" /><circle cx="7"  cy="12"   r="2.63" />
      <circle cx="17" cy="12"   r="2.63" /><circle cx="7"  cy="7"    r="2.07" />
      <circle cx="17" cy="7"    r="2.07" /><circle cx="7"  cy="17"   r="2.07" />
      <circle cx="17" cy="17"   r="2.07" /><circle cx="12" cy="1.84" r="1.84" />
      <circle cx="12" cy="22.2" r="1.84" /><circle cx="1.84" cy="12" r="1.84" />
      <circle cx="22.2" cy="12" r="1.84" /><circle cx="7"    cy="1.84" r="1.22" />
      <circle cx="17"   cy="1.84" r="1.22" /><circle cx="7"  cy="22.2" r="1.22" />
      <circle cx="17"   cy="22.2" r="1.22" /><circle cx="1.84" cy="7"  r="1.22" />
      <circle cx="22.2" cy="7"    r="1.22" /><circle cx="1.84" cy="17" r="1.22" />
      <circle cx="22.2" cy="17"   r="1.22" />
    </svg>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ClockIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="7" />
      <path d="M8 4.5v3.5l2 2" />
    </svg>
  );
}

function InfoCircleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="8" cy="8" r="7" />
      <path d="M8 7v5M8 5v.01" />
    </svg>
  );
}

function LockIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M8 1a3 3 0 00-3 3v1H4a1 1 0 00-1 1v7a1 1 0 001 1h8a1 1 0 001-1V6a1 1 0 00-1-1h-1V4a3 3 0 00-3-3zm-1 3a1 1 0 112 0v1H7V4zm1 4a1 1 0 011 1v2a1 1 0 11-2 0V9a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
  );
}

function FileIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V6M9 2l4 4M9 2v4h4" />
    </svg>
  );
}

function ArrowRightSmIcon({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6h8M7 3l3 3-3 3" />
    </svg>
  );
}

function LevelBarIcon() {
  return (
    <svg className="h-3 w-3 shrink-0" viewBox="0 0 12 10" fill="none">
      <rect x="1" y="6.5" width="2" height="3.5" fill="#b56100" />
      <rect x="5" y="4" width="2" height="6" fill="#d1d5db" />
      <rect x="9" y="1.5" width="2" height="8.5" fill="#d1d5db" />
    </svg>
  );
}

// ─── Verification level icons (mirrored from BuyerRegistration) ───────────────

function ShieldAmberIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="none">
      <path d="M10 1.5L2.5 4.5V10C2.5 14 5.75 17.75 10 19.5C14.25 17.75 17.5 14 17.5 10V4.5L10 1.5Z"
            fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 10l2 2 4-4" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldBlueIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="none">
      <path d="M10 1.5L2.5 4.5V10C2.5 14 5.75 17.75 10 19.5C14.25 17.75 17.5 14 17.5 10V4.5L10 1.5Z"
            fill="#dbeafe" stroke="#3968c2" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldGrayIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="none">
      <path d="M10 1.5L2.5 4.5V10C2.5 14 5.75 17.75 10 19.5C14.25 17.75 17.5 14 17.5 10V4.5L10 1.5Z"
            fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function CheckSmIcon({ ticked }: { ticked: boolean }) {
  return (
    <svg
      className={`h-3 w-3 shrink-0 ${ticked ? "text-gray-700" : "text-gray-300"}`}
      viewBox="0 0 12 12" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M2 6l3 3 5-5" />
    </svg>
  );
}

function MinusSmIcon() {
  return (
    <svg className="h-3 w-3 shrink-0 text-gray-300" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 6h8" />
    </svg>
  );
}

function InfoSmIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-gray-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="8" cy="8" r="7" />
      <path d="M8 7v5M8 5v.01" />
    </svg>
  );
}

function LockSmIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-gray-400" viewBox="0 0 16 16" fill="currentColor">
      <path fillRule="evenodd" d="M8 1a3 3 0 00-3 3v1H4a1 1 0 00-1 1v7a1 1 0 001 1h8a1 1 0 001-1V6a1 1 0 00-1-1h-1V4a3 3 0 00-3-3zm-1 3a1 1 0 112 0v1H7V4zm1 4a1 1 0 011 1v2a1 1 0 11-2 0V9a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCountdownLabel(deadline: string): string {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return "Frist abgelaufen";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return `${days} Tage, ${hours}h verbleibend`;
}

function formatDeadlineDateFull(deadline: string): string {
  return new Date(deadline).toLocaleString("de-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Imports from app ─────────────────────────────────────────────────────────

import PlaceBidWizard from "./PlaceBidWizard";
import { useGridbidService } from "../../services/GridbidServiceContext";
import { PriceDisplay } from "../../types/domain";
import type { GridbidBidding } from "../../types/domain";
import type { BuyerDealRoomTab, BuyerRegistration, FinancingStatus, BidData } from "../../types/buyer";
import { formatDeadline, formatCHF } from "../../utils/labels";

// ─── Tab configuration ────────────────────────────────────────────────────────

const TABS: { id: BuyerDealRoomTab; label: string }[] = [
  { id: "overview", label: "Übersicht" },
  { id: "documents", label: "Unterlagen" },
  { id: "bid", label: "Angebote" },
];

// ─── Root component ───────────────────────────────────────────────────────────

const BuyerDealRoom: React.FC = () => {
  const buyerBiddingId = useGridbidUiStore((s) => s.buyerBiddingId);
  const buyerRegistration = useGridbidUiStore((s) => s.buyerRegistration);
  const activeTab = useGridbidUiStore((s) => s.buyerDealRoomTab);
  const setTab = useGridbidUiStore((s) => s.setBuyerDealRoomTab);
  const switchToAgency = useGridbidUiStore((s) => s.switchToAgency);
  const activeBid = useGridbidUiStore((s) => s.activeBid);
  const setActiveBid = useGridbidUiStore((s) => s.setActiveBid);
  const service = useGridbidService();
  const [bidding, setBidding] = useState<GridbidBidding | null>(null);
  const [loading, setLoading] = useState(true);
  const [documentsViewed, setDocumentsViewed] = useState(false);
  const [showBidWizard, setShowBidWizard] = useState(false);

  function handleBidSubmit(bid: BidData) {
    setActiveBid(bid);
    setShowBidWizard(false);
    setTab("bid");
  }

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

  const initials = buyerRegistration
    ? `${buyerRegistration.firstName.charAt(0)}${buyerRegistration.lastName.charAt(0)}`
    : "K";

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-white [scrollbar-gutter:stable]">

      {/* ── Top navigation bar ── */}
      <header className="sticky top-0 z-20 bg-white">
        <div className="relative flex items-center justify-between px-6 py-4">

          {/* Logo (left) */}
          <div className="flex shrink-0 items-center gap-2">
            <GridBidLogoIcon />
            <span className="text-sm font-semibold tracking-tight text-gray-900">GridBid</span>
          </div>

          {/* Centered countdown */}
          {bidding.deadline && (
            <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-3">
              <ClockIcon className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">
                {formatCountdownLabel(bidding.deadline)}
              </span>
              <div className="h-4 w-px bg-gray-200" />
              <span className="text-sm text-gray-500">Runde schliesst:</span>
              <span className="text-sm font-medium text-blue-600">
                {formatDeadlineDateFull(bidding.deadline)}
              </span>
            </div>
          )}

          {/* Right: user badge + back link */}
          <div className="flex shrink-0 items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gw-50 text-[10px] font-medium text-gw-700">
                {initials}
              </div>
              <span className="text-sm font-medium text-gray-900">Käufer</span>
            </div>
            <span className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5">
              <LevelBarIcon />
              <span className="text-xs font-medium text-gray-700">Level</span>
              <span className="text-xs font-medium text-amber-600">1 von 3</span>
            </span>
            <div className="h-5 w-px bg-gray-200" />
            <button
              onClick={switchToAgency}
              className="text-sm text-gray-400 transition-colors hover:text-gray-700"
            >
              Zurück zur Agenturansicht
            </button>
          </div>
        </div>
        <div className="h-px bg-gray-100" />
      </header>

      {/* ── Body: main content + sidebar ── */}
      <div className="flex flex-1">

        {/* ── Scrollable main column ── */}
        <main className="min-w-0 flex-1">

          {/* Property header */}
          <div className="mx-auto max-w-2xl px-6 pt-8">
            <div className="mb-6 flex items-center gap-4">
              {bidding.imageUrl && (
                <img
                  src={bidding.imageUrl}
                  alt={bidding.title}
                  className="h-14 w-20 shrink-0 rounded-lg object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <h1 className="text-3xl font-bold leading-tight text-gray-900">{bidding.title}</h1>
                <div className="mt-1 flex items-center gap-3">
                  <span className="text-sm text-gray-500">{bidding.address}</span>
                  {bidding.websiteUrl && (
                    <>
                      <div className="h-4 w-px bg-gray-200" />
                      <a
                        href={bidding.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-gw-600"
                      >
                        Objektwebsite
                        <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3M10 2h4m0 0v4m0-4L7 9" />
                        </svg>
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-end">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="px-4">
                    <span
                      className={`text-sm transition-colors ${
                        activeTab === tab.id
                          ? "font-bold text-gray-900"
                          : "font-medium text-gray-400 hover:text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </div>
                  <div
                    className={`h-0.5 w-full ${
                      activeTab === tab.id ? "bg-gray-900" : "bg-gray-100"
                    }`}
                  />
                </button>
              ))}
              <div className="h-0.5 flex-1 self-end bg-gray-100" />
            </div>
          </div>

          {/* Tab content */}
          <div className="mx-auto max-w-2xl px-6 py-8 pb-32">
            {activeTab === "overview" && (
              <OverviewTab
                bidding={bidding}
                onViewDocuments={() => handleTabChange("documents")}
              />
            )}
            {activeTab === "documents" && <DocumentsTab bidding={bidding} />}
            {activeTab === "bid" && <BidTab bidding={bidding} onPlaceBid={() => setShowBidWizard(true)} />}
          </div>
        </main>

        {/* ── Verification level sidebar ── */}
        <aside className="w-[280px] shrink-0 border-l border-gray-100">
          <div className="sticky top-[57px] p-5">
            <DealRoomVerificationPanel buyerRegistration={buyerRegistration} />
          </div>
        </aside>
      </div>

      {/* ── Bid placement wizard overlay ── */}
      {showBidWizard && (
        <PlaceBidWizard
          bidding={bidding}
          onClose={() => setShowBidWizard(false)}
          onSubmit={handleBidSubmit}
        />
      )}

      {/* ── Sticky footer ── */}
      <footer className="fixed bottom-0 inset-x-0 z-10 flex justify-center border-t border-gray-200 bg-white py-4">
        {activeTab !== "bid" ? (
          <button
            onClick={() => handleTabChange("bid")}
            className="rounded-full bg-gray-900 px-10 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-gray-700"
          >
            Angebot einreichen →
          </button>
        ) : activeBid ? (
          <button
            type="button"
            className="rounded-full bg-gray-100 px-10 py-3 text-base font-medium text-gray-900 transition-colors hover:bg-gray-200"
          >
            Angebote verwalten
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowBidWizard(true)}
            className="rounded-full bg-gray-900 px-10 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-gray-700"
          >
            Angebot einreichen →
          </button>
        )}
      </footer>

    </div>
  );
};

// ─── Overview tab ─────────────────────────────────────────────────────────────

function OverviewTab({
  bidding,
  onViewDocuments,
}: {
  bidding: GridbidBidding;
  onViewDocuments: () => void;
}) {
  const deadline = bidding.deadline;

  const daysUntil = deadline
    ? Math.max(0, Math.floor((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;
  const hoursUntil = deadline
    ? Math.max(0, Math.floor(((new Date(deadline).getTime() - Date.now()) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
    : null;

  const progressPercent = (() => {
    if (!deadline) return 50;
    const deadlineMs = new Date(deadline).getTime();
    const createdAtMs = bidding.createdAt ? new Date(bidding.createdAt).getTime() : null;
    if (!createdAtMs) return 50;
    const total = deadlineMs - createdAtMs;
    if (total <= 0) return 50;
    const elapsed = Date.now() - createdAtMs;
    return Math.min(98, Math.max(2, (elapsed / total) * 100));
  })();

  return (
    <div className="space-y-8">

      {/* Round window card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
          Angebotsrunde
        </p>
        <div className="mb-2 flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-900">
            {daysUntil !== null
              ? `${daysUntil} Tage, ${hoursUntil}h verbleibend`
              : "Keine Frist gesetzt"}
          </span>
          <InfoCircleIcon className="h-4 w-4 text-gray-400" />
        </div>
        {deadline && (
          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-sm text-gray-700">Schliesst:</span>
            <span className="text-sm font-medium text-blue-600">
              {formatDeadlineDateFull(deadline)}
            </span>
            <div className="hidden h-4 w-px bg-gray-200 sm:block" />
            <span className="text-sm text-gray-400">
              Danach keine weiteren Angebote möglich.
            </span>
          </div>
        )}
        {/* Progress bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gw-600"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Documents section */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Unterlagen</h2>
          <button
            onClick={onViewDocuments}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Alle anzeigen
            <ArrowRightSmIcon className="h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <OverviewDocumentCard
            phase="Bei Registrierung"
            count={bidding.documents.level1.length || 5}
            unlocked={true}
          />
          <OverviewDocumentCard
            phase="Mit Level 2 Verifizierung"
            count={bidding.documents.level2.length || 3}
            unlocked={false}
          />
          <OverviewDocumentCard
            phase="Auf Freigabe"
            count={bidding.documents.level3.length || 2}
            unlocked={false}
          />
        </div>
      </div>

    </div>
  );
}

// ─── Overview document card ───────────────────────────────────────────────────

function OverviewDocumentCard({
  phase,
  count,
  unlocked,
}: {
  phase: string;
  count: number;
  unlocked: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col gap-3 overflow-clip rounded-lg border p-4 ${
        unlocked ? "border-gray-200 bg-white" : "border-gray-200 bg-gray-50"
      }`}
    >
      {unlocked ? (
        <div className="flex w-fit items-center justify-center rounded bg-gw-50 p-2">
          <FileIcon className="h-4 w-4 text-gw-600" />
        </div>
      ) : (
        <div className="flex items-start justify-between">
          <div className="flex items-center justify-center rounded bg-gray-100 p-2">
            <FileIcon className="h-4 w-4 text-gray-400" />
          </div>
          <LockIcon className="h-4 w-4 text-gray-400" />
        </div>
      )}

      <div>
        <p
          className={`text-sm font-medium leading-tight ${
            unlocked ? "text-gray-900" : "text-gray-400"
          }`}
        >
          {phase}
        </p>
        <p className="mt-0.5 text-xs text-gray-400">{count} Unterlagen</p>
      </div>

      {unlocked && (
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-gw-50 px-2 py-0.5">
          <span className="h-2 w-2 rounded-full bg-gw-600" />
          <span className="text-xs font-medium text-gw-600">Jetzt verfügbar</span>
        </div>
      )}
    </div>
  );
}

// ─── Deal room verification panel ────────────────────────────────────────────

function DealRoomVerificationPanel({
  buyerRegistration,
}: {
  buyerRegistration: BuyerRegistration | null;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const hasPhone = !!(buyerRegistration?.phone?.trim());
  const hasQuestionnaire = !!(
    buyerRegistration?.financingStatus && buyerRegistration?.purchaseTiming
  );

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-gray-900">Dein Verifizierungslevel</span>
        <div
          className="relative cursor-default"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <InfoSmIcon />
          {showTooltip && (
            <div className="absolute left-5 top-0 z-50 w-60 rounded-lg bg-gray-900 px-3 py-2.5 text-xs leading-relaxed text-white shadow-xl">
              Höhere Qualifikationsstufen stärken deine Gebote. Level 3 kann nach der Registrierung freigeschaltet werden.
            </div>
          )}
        </div>
      </div>

      {/* Level 1 — complete */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <ShieldAmberIcon />
          <span className="text-base font-semibold text-amber-700">Level 1</span>
        </div>
        <div className="ml-[30px] space-y-1">
          <div className="flex items-center gap-2">
            <CheckSmIcon ticked={true} />
            <span className="text-xs text-gray-700">Persönliche Angaben</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckSmIcon ticked={true} />
            <span className="text-xs text-gray-700">Registriert</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Level 2 — in progress */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <ShieldBlueIcon />
          <span className="text-base font-semibold text-blue-700">Level 2</span>
        </div>
        <div className="ml-[30px] space-y-3">
          {/* Phone item */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              {hasPhone ? <CheckSmIcon ticked={true} /> : <MinusSmIcon />}
              <span className={`text-xs ${hasPhone ? "text-gray-700" : "text-gray-400"}`}>
                Telefonnummer bestätigen
              </span>
            </div>
            {!hasPhone && (
              <div className="pl-5">
                <button
                  type="button"
                  onClick={() => {}}
                  className="flex h-8 items-center gap-1.5 rounded-full bg-gray-50 px-3 text-xs font-medium text-gray-900 transition-colors hover:bg-gray-100"
                >
                  Hinzufügen
                  <ArrowRightSmIcon className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
          {/* Questionnaire item */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              {hasQuestionnaire ? <CheckSmIcon ticked={true} /> : <MinusSmIcon />}
              <span className={`text-xs ${hasQuestionnaire ? "text-gray-700" : "text-gray-400"}`}>
                Erweitertes Käuferprofil
              </span>
            </div>
            {!hasQuestionnaire && (
              <div className="pl-5">
                <button
                  type="button"
                  onClick={() => {}}
                  className="flex h-8 items-center gap-1.5 rounded-full bg-gray-50 px-3 text-xs font-medium text-gray-900 transition-colors hover:bg-gray-100"
                >
                  Starten
                  <ArrowRightSmIcon className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Level 3 — locked */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <ShieldGrayIcon />
          <span className="text-base font-semibold text-gray-400">Level 3</span>
          <LockSmIcon />
        </div>
        <div className="ml-[30px] space-y-1">
          <div className="flex items-center gap-2">
            <MinusSmIcon />
            <span className="text-xs text-gray-400">Ausweis oder Reisepass</span>
          </div>
          <div className="flex items-center gap-2">
            <MinusSmIcon />
            <span className="text-xs text-gray-400">Finanzierungsnachweis</span>
          </div>
        </div>
      </div>

    </div>
  );
}


// ─── Documents tab ────────────────────────────────────────────────────────────

function DocumentsTab({ bidding }: { bidding: GridbidBidding }) {
  const buyerAccessTier = useGridbidUiStore((s) => s.buyerAccessTier);
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
    <div>
      {level1.length > 0 && (
        <DocumentPhase
          phase="Bei Registrierung"
          description="Für alle registrierten Interessenten zugänglich."
          documents={level1}
          unlocked
          showAvailableBadge
        />
      )}
      {level2.length > 0 && (
        <>
          {level1.length > 0 && <div className="my-8 h-px bg-gray-100" />}
          <DocumentPhase
            phase="Mit Level 2 Verifizierung"
            description="Zugänglich wenn dein Profil auf Level 2 qualifiziert ist."
            documents={level2}
            unlocked={phase2Unlocked}
          />
        </>
      )}
      {level3.length > 0 && (
        <>
          {(level1.length > 0 || level2.length > 0) && <div className="my-8 h-px bg-gray-100" />}
          <DocumentPhase
            phase="Auf Freigabe"
            description="Wird individuell durch den Makler freigegeben."
            documents={level3}
            unlocked={phase3Unlocked}
          />
        </>
      )}
    </div>
  );
}

function DocumentPhase({
  phase,
  description,
  documents,
  unlocked,
  showAvailableBadge = false,
}: {
  phase: string;
  description: string;
  documents: string[];
  unlocked: boolean;
  showAvailableBadge?: boolean;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2">
        <h3 className={`text-xl font-bold leading-7 ${unlocked ? "text-gray-900" : "text-gray-500"}`}>
          {phase}
        </h3>
        {showAvailableBadge && unlocked && (
          <div className="flex items-center gap-1 rounded-full bg-gw-50 px-2 py-0.5">
            <span className="h-2 w-2 rounded-full bg-gw-600" />
            <span className="text-xs font-medium text-gw-600">Jetzt verfügbar</span>
          </div>
        )}
        {!unlocked && <LockIcon className="h-4 w-4 text-gray-400" />}
      </div>
      <p className="mb-4 text-sm text-gray-400">{description}</p>
      <div className="grid grid-cols-2 gap-2">
        {documents.map((doc) => (
          <DocCard key={doc} filename={doc} unlocked={unlocked} />
        ))}
      </div>
    </div>
  );
}

function DocCard({ filename, unlocked }: { filename: string; unlocked: boolean }) {
  return (
    <div
      className={`flex h-10 items-center overflow-hidden rounded border ${
        unlocked
          ? "cursor-pointer border-gray-200 bg-white hover:bg-gray-50"
          : "border-gray-200 bg-gray-50"
      }`}
    >
      <div className="flex flex-1 items-center gap-2 p-2">
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded ${
            unlocked ? "bg-gw-50" : "bg-gray-100"
          }`}
        >
          <FileIcon className={`h-3 w-3 ${unlocked ? "text-gw-600" : "text-gray-400"}`} />
        </div>
        <span
          className={`min-w-0 flex-1 truncate text-sm ${
            unlocked ? "text-gray-900" : "text-gray-400"
          }`}
        >
          {filename}
        </span>
        {!unlocked && <LockIcon className="h-3 w-3 shrink-0 text-gray-300" />}
      </div>
    </div>
  );
}

// ─── Q&A tab (kept for backward compatibility) ────────────────────────────────

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
              <p className="text-sm leading-relaxed text-gray-500">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
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

// ─── Bid tab helpers ─────────────────────────────────────────────────────────

const FINANCING_LABELS_BID: Record<FinancingStatus, string> = {
  open: "Noch offen",
  in_preparation: "In Vorbereitung",
  confirmed: "Bereits bestätigt",
};

function formatClosingDateBid(closingDate: string): string {
  if (!closingDate) return "Nicht angegeben";
  if (closingDate === "sofort") return "Sofort";
  const parts = closingDate.split("-").map(Number);
  const d = new Date(parts[0] ?? 0, (parts[1] ?? 1) - 1, 1);
  return d.toLocaleDateString("de-CH", { month: "long", year: "numeric" });
}

// ─── Bid illustration ────────────────────────────────────────────────────────

function BidIllustration() {
  return (
    <svg className="h-24 w-24" viewBox="0 0 96 96" fill="none" aria-hidden="true">
      <path d="M48 4L48 16" stroke="#a3a6a7" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M36 16L60 16" stroke="#a3a6a7" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="26" y="16" width="44" height="30" rx="6" fill="white" stroke="#2f363a" strokeWidth="1.5" />
      <path d="M34 27h28" stroke="#a3a6a7" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M34 34h18" stroke="#a3a6a7" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="48" cy="72" r="18" fill="#4782f3" opacity="0.12" />
      <circle cx="48" cy="72" r="12" fill="#4782f3" />
    </svg>
  );
}

// ─── Person icon ─────────────────────────────────────────────────────────────

function PersonIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-gray-400"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <circle cx="8" cy="5" r="3" />
      <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    </svg>
  );
}

// ─── Bid tab ─────────────────────────────────────────────────────────────────


// ─── Bid tab ─────────────────────────────────────────────────────────────────

function BidTab({
  bidding: _bidding,
  onPlaceBid,
}: {
  bidding: GridbidBidding;
  onPlaceBid?: () => void;
}) {
  const activeBid = useGridbidUiStore((s) => s.activeBid);

  if (!activeBid) {
    return <BidEmptyState />;
  }

  return <BidActiveSummary bid={activeBid} />;
}

// ─── Bid empty state ──────────────────────────────────────────────────────────

function BidEmptyState() {
  return (
    <div className="flex flex-col items-center gap-6 rounded-xl border border-gray-200 bg-white p-8 text-center">
      <BidIllustration />
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold text-gray-900">Noch keine Angebote</h2>
        <p className="text-sm text-gray-400">
          Sobald du ein Angebot eingereicht hast, kannst du es hier verfolgen.
        </p>
      </div>
    </div>
  );
}

// ─── Bid active summary ───────────────────────────────────────────────────────

function BidActiveSummary({ bid }: { bid: BidData }) {
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), 5000);
    return () => clearTimeout(timer);
  }, [showToast]);

  const submittedLabel = (() => {
    const d = new Date(bid.submittedAt);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday =
      d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear();
    const time = d.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" });
    return isYesterday
      ? `Gestern, ${time}`
      : `${d.toLocaleDateString("de-CH")}, ${time}`;
  })();

  return (
    <div className="space-y-4">
      {/* Section heading */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Runde 1</h2>
        <p className="text-sm text-gray-400">
          Du kannst dein Angebot jederzeit bis zur Frist anpassen.
        </p>
      </div>

      {/* Bid summary card */}
      <div className="overflow-clip rounded-lg border border-gray-200 bg-white">
        {/* Amount row */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <PersonIcon />
            <span className="text-xl font-medium text-gray-900">{formatCHF(bid.amount)}</span>
          </div>
          <button
            type="button"
            className="flex h-8 items-center justify-center rounded-full bg-gray-50 px-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
          >
            Bearbeiten
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100" />

        {/* Metadata, doc badges, timeline */}
        <div className="flex flex-col gap-4 p-4">
          {/* Four metadata columns with vertical dividers */}
          <div className="flex items-start gap-6">
            <BidMetaCol
              label="Angebot gültig für"
              value={`${bid.validityDays} Tage`}
            />
            <div className="h-8 w-px shrink-0 self-center bg-gray-200" />
            <BidMetaCol
              label="Finanzierungsstatus"
              value={FINANCING_LABELS_BID[bid.financingStatus]}
            />
            <div className="h-8 w-px shrink-0 self-center bg-gray-200" />
            <BidMetaCol
              label="Gewünschter Übergabetermin"
              value={formatClosingDateBid(bid.closingDate)}
            />
            <div className="h-8 w-px shrink-0 self-center bg-gray-200" />
            <BidMetaCol
              label="Bedingungen/Bemerkungen"
              value={bid.conditions || "–"}
            />
          </div>

          {/* Document verification badges */}
          {(bid.idUploaded || bid.financingProofUploaded) && (
            <div className="flex items-center gap-2">
              {bid.idUploaded && (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                  <svg
                    className="h-3 w-3 shrink-0"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 6l3 3 5-5" />
                  </svg>
                  Ausweis oder Reisepass
                </span>
              )}
              {bid.financingProofUploaded && (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                  <svg
                    className="h-3 w-3 shrink-0"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 6l3 3 5-5" />
                  </svg>
                  Finanzierungsnachweis
                </span>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-gray-100" />

          {/* Status timeline */}
          <div>
            <BidTimelineStep
              label="Angebot eingereicht"
              detail={submittedLabel}
              variant="active"
              showTopLine={false}
              showBottomLine={true}
            />
            <BidTimelineStep
              label="In Prüfung"
              detail="Beginnt nach Ablauf der Einreichungsfrist"
              variant="pending"
              showTopLine={true}
              showBottomLine={true}
            />
            <BidTimelineStep
              label="Entscheid"
              detail=""
              variant="pending"
              showTopLine={true}
              showBottomLine={false}
            />
          </div>
        </div>
      </div>

      {/* Toast — fixed bottom-right, auto-dismisses after 5 s */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] overflow-clip rounded-xl bg-gray-700 px-6 py-4 shadow-lg">
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-white"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <circle cx="10" cy="10" r="8" />
              <path d="M6.5 10l2.5 2.5 5-5" />
            </svg>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white">
                Dein Angebot wurde erfolgreich eingereicht. 🎉
              </p>
              <p className="mt-0.5 text-xs text-white/80">
                Die Agentur wurde informiert und wird dein Angebot prüfen.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowToast(false)}
              className="shrink-0 text-white/60 transition-colors hover:text-white"
              aria-label="Schliessen"
            >
              <svg
                className="h-3 w-3"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M2 2l8 8M10 2L2 10" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Bid metadata column ──────────────────────────────────────────────────────

function BidMetaCol({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}

// ─── Bid timeline step ────────────────────────────────────────────────────────

function BidTimelineStep({
  label,
  detail,
  variant,
  showTopLine,
  showBottomLine,
}: {
  label: string;
  detail: string;
  variant: "active" | "pending";
  showTopLine: boolean;
  showBottomLine: boolean;
}) {
  const isActive = variant === "active";
  return (
    <div className="flex items-stretch">
      {/* Vertical timeline column */}
      <div className="flex w-6 shrink-0 flex-col items-center pr-3">
        <div
          className={`w-px flex-1 ${showTopLine ? "bg-gray-200" : "opacity-0"}`}
          style={{ minHeight: 14 }}
        />
        <div
          className={`shrink-0 rounded-full ${
            isActive
              ? "h-3 w-3 border-4 border-gray-900 bg-white"
              : "h-3 w-3 bg-gray-300"
          }`}
        />
        <div
          className={`w-px flex-1 ${showBottomLine ? "bg-gray-200" : "opacity-0"}`}
          style={{ minHeight: 14 }}
        />
      </div>
      {/* Step content */}
      <div className="flex flex-col justify-center gap-0.5 py-2">
        <span
          className={`text-base font-medium leading-6 ${
            isActive ? "text-gray-900" : "text-gray-400"
          }`}
        >
          {label}
        </span>
        {detail && (
          <span className="text-sm leading-5 text-gray-400">{detail}</span>
        )}
      </div>
    </div>
  );
}

export default BuyerDealRoom;
