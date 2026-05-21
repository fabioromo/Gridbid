import React, { useEffect, useState } from "react";
import { BiddingStatus, PriceDisplay, ProcessType, type GridbidBidding } from "../types/domain";
import { useGridbidUiStore } from "../store/gridbidUiStore";
import { useGridbidService } from "../services/GridbidServiceContext";
import {
  STATUS_LABEL,
  formatDate,
  formatDateTime,
  formatDeadline,
  formatCHF,
} from "../utils/labels";

const VISIBILITY_LABEL: Record<ProcessType, string> = {
  [ProcessType.SEALED_BID]: "Privat",
  [ProcessType.OPEN_BID]: "Öffentlich",
};

const PRICE_SHORT_LABEL: Record<PriceDisplay, string> = {
  [PriceDisplay.HIDDEN]: "Nein",
  [PriceDisplay.PRICE]: "Ja (Richtpreis)",
  [PriceDisplay.RANGE]: "Ja (Rahmen)",
};

const STATUS_BADGE: Record<BiddingStatus, { label: string; className: string }> = {
  [BiddingStatus.DRAFT]: {
    label: STATUS_LABEL[BiddingStatus.DRAFT],
    className: "bg-gray-100 text-gray-500 border border-gray-200",
  },
  [BiddingStatus.ACTIVE]: {
    label: STATUS_LABEL[BiddingStatus.ACTIVE],
    className: "bg-gw-50 text-gw-700 border border-gw-200",
  },
  [BiddingStatus.CLOSED]: {
    label: STATUS_LABEL[BiddingStatus.CLOSED],
    className: "bg-gray-100 text-gray-400 border border-gray-200",
  },
};

// ─── Icons ───────────────────────────────────────────────────────────────────

function IconArrowLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.5 4L6 10l6.5 6" />
    </svg>
  );
}

function IconExternalLink() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 1.5h3.5V5M10.5 1.5L5 7M5 2.5H1.5v8h8V7" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 7.5v3.5" />
      <circle cx="8" cy="5.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5.5" y="5.5" width="7.5" height="7.5" rx="1" />
      <path d="M10.5 5.5V3.5a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" />
    </svg>
  );
}

function IconCheckCircle() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8" />
      <path d="M6.5 10l2.5 2.5 4.5-5" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 2l8 8M10 2l-8 8" />
    </svg>
  );
}

function IconHousePlaceholder() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5L12 3l9 7.5V21H3V10.5z" />
      <rect x="9" y="14" width="6" height="7" rx="0.5" />
    </svg>
  );
}

// ─── Empty-state illustrations ────────────────────────────────────────────────

function IllustrationOffers() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="26" fill="#EDF2FE" />
      {/* head */}
      <circle cx="28" cy="20" r="5" fill="#4782f3" />
      {/* torso / legs */}
      <path d="M21 40c0-6 3-10 7-10s7 4 7 10" stroke="#4782f3" strokeWidth="2" strokeLinecap="round" />
      {/* raised arm */}
      <path d="M28 31l-7-5.5" stroke="#4782f3" strokeWidth="2" strokeLinecap="round" />
      <circle cx="21" cy="25.5" r="2.5" fill="#4782f3" />
    </svg>
  );
}

function IllustrationParticipants() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="26" fill="#EDF2FE" />
      {/* left person */}
      <circle cx="18" cy="21" r="4" fill="#84aff8" />
      <path d="M12 38c0-5 2.5-8 6-8s6 3 6 8" stroke="#84aff8" strokeWidth="2" strokeLinecap="round" />
      {/* right person */}
      <circle cx="38" cy="21" r="4" fill="#84aff8" />
      <path d="M32 38c0-5 2.5-8 6-8s6 3 6 8" stroke="#84aff8" strokeWidth="2" strokeLinecap="round" />
      {/* center person (foreground) */}
      <circle cx="28" cy="19" r="5" fill="#4782f3" />
      <path d="M21 38c0-6 3-10 7-10s7 4 7 10" stroke="#4782f3" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

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

// ─── Component ────────────────────────────────────────────────────────────────

const BiddingDetail: React.FC = () => {
  const selectedBiddingId = useGridbidUiStore((s) => s.selectedBiddingId);
  const navigate = useGridbidUiStore((s) => s.navigate);
  const switchToBuyer = useGridbidUiStore((s) => s.switchToBuyer);
  const service = useGridbidService();

  const [bidding, setBidding] = useState<GridbidBidding | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activating, setActivating] = useState(false);
  const [activationError, setActivationError] = useState<string | null>(null);
  const [confirmingActivation, setConfirmingActivation] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastVisible, setToastVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setToastVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!selectedBiddingId) return;
    setLoading(true);
    setLoadError(null);
    service
      .getBiddingById(selectedBiddingId)
      .then((data) => {
        setBidding(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        setLoadError(err instanceof Error ? err.message : "Unbekannter Fehler");
        setLoading(false);
      });
  }, [service, selectedBiddingId]);

  async function handleActivate() {
    if (!bidding) return;
    setActivating(true);
    setActivationError(null);
    setConfirmingActivation(false);
    try {
      const updated = await service.activateBidding(bidding.id);
      setBidding(updated);
    } catch (err: unknown) {
      setActivationError(err instanceof Error ? err.message : "Aktivierung fehlgeschlagen");
    } finally {
      setActivating(false);
    }
  }

  function handleCopy() {
    if (!bidding?.publicUrl) return;
    void navigator.clipboard.writeText(bidding.publicUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-gray-400">
        Wird geladen…
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-red-500">
        Fehler: {loadError}
      </div>
    );
  }

  if (!bidding) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-gray-400">
        Wird geladen…
      </div>
    );
  }

  const badge = STATUS_BADGE[bidding.status];

  return (
    <div className="flex min-h-full flex-col bg-white">

      {/* ── Top navigation ───────────────────────────────────────────────── */}
      <header className="flex h-14 shrink-0 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <GridBidLogoIcon />
          <span className="text-sm font-semibold tracking-tight text-[#182024]">GridBid</span>
        </div>
        <div className="flex items-center gap-4">
          {selectedBiddingId && (
            <button
              onClick={() => switchToBuyer(selectedBiddingId)}
              className="text-sm text-[#73787a] transition-colors hover:text-[#2f363a]"
            >
              Zur Käuferansicht wechseln
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#4782f3] text-xs font-medium text-white">
              A
            </div>
            <span className="text-sm font-medium text-[#182024]">Anton</span>
          </div>
        </div>
      </header>
      <div className="h-px bg-[#e8e9e9]" />

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="flex-1 px-6 py-8">
      <div className="mx-auto max-w-4xl">

        {/* Back link */}
        <button
          onClick={() => navigate("overview")}
          className="mb-6 flex items-center gap-1.5 text-sm text-[#73787a] transition-colors hover:text-[#2f363a]"
        >
          <IconArrowLeft />
          Zurück zur Übersicht
        </button>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Property thumbnail */}
            {bidding.imageUrl ? (
              <img
                src={bidding.imageUrl}
                alt=""
                className="h-[52px] w-[71px] flex-shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-[52px] w-[71px] flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-300">
                <IconHousePlaceholder />
              </div>
            )}

            {/* Title + address row */}
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <h1 className="text-[32px] font-bold leading-10 text-[#06262d]">
                  {bidding.title || "Unbenannt"}
                </h1>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}>
                  {badge.label}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#73787a]">{bidding.address || "—"}</span>
                {bidding.websiteUrl && (
                  <>
                    <span className="h-4 w-px bg-gray-200" />
                    <a
                      href={bidding.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm font-medium text-[#2f363a] transition-colors hover:text-[#06262d]"
                    >
                      Öffentliche Website
                      <IconExternalLink />
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Activation button – DRAFT only */}
          {bidding.status === BiddingStatus.DRAFT && (
            <div className="flex flex-col items-end gap-2">
              {!confirmingActivation ? (
                <button
                  onClick={() => setConfirmingActivation(true)}
                  className="rounded-lg bg-gw-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gw-500"
                >
                  Verfahren aktivieren
                </button>
              ) : (
                <div className="flex flex-col items-end gap-2">
                  <p className="text-xs text-gray-500">
                    Nach der Aktivierung ist das Verfahren öffentlich und kann nicht mehr
                    bearbeitet werden.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfirmingActivation(false)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700"
                    >
                      Abbrechen
                    </button>
                    <button
                      onClick={() => void handleActivate()}
                      disabled={activating}
                      className="rounded-lg bg-gw-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-gw-500 disabled:opacity-50"
                    >
                      {activating ? "Wird aktiviert…" : "Jetzt aktivieren"}
                    </button>
                  </div>
                </div>
              )}
              {activationError && (
                <p className="text-xs text-red-500">{activationError}</p>
              )}
            </div>
          )}
        </div>

        {/* ── Öffentlicher Link ──────────────────────────────────────────── */}
        <div className="mb-6 flex items-center justify-between rounded-lg border border-[#dae6fd] bg-[#edf2fe] px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-[#182024]">
            <span>Öffentlicher Link</span>
            <span className="text-[#73787a]"><IconInfo /></span>
          </div>
          {bidding.publicUrl ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#73787a]">{bidding.publicUrl}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-sm font-medium text-[#2f363a] transition-colors hover:text-[#06262d]"
              >
                {copied ? "Kopiert!" : "Kopieren"}
                <IconCopy />
              </button>
            </div>
          ) : (
            <span className="text-sm text-[#73787a]">Noch nicht aktiv</span>
          )}
        </div>

        {/* ── Verfahrensdetails (2-column card) ──────────────────────────── */}
        <div className="mb-6 rounded-lg border border-[#e8e9e9] bg-white p-4">
          <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[1fr_1px_1fr] sm:gap-x-6">
            <div className="flex flex-col gap-2">
              <InfoRow label="Sichtbarkeit"  value={VISIBILITY_LABEL[bidding.processType]} />
              <InfoRow label="Anzahl Runden" value={String(bidding.roundsPlanned)} />
              <InfoRow label="Preisanzeige"  value={PRICE_SHORT_LABEL[bidding.priceDisplay]} />
            </div>
            <div className="hidden bg-[#e8e9e9] sm:block" />
            <div className="border-t border-[#e8e9e9] pt-2 sm:border-t-0 sm:pt-0 flex flex-col gap-2">
              <InfoRow label="Frist"    value={formatDeadline(bidding.deadline)} />
              <InfoRow label="Erstellt" value={formatDate(bidding.createdAt)} />
            </div>
          </div>
        </div>

        {/* ── Angebote ───────────────────────────────────────────────────── */}
        <div className="h-px w-full bg-[#e8e9e9]" />
        <div className="my-6">
          {bidding.offers.length === 0 ? (
            <div className="flex items-center gap-4 rounded-lg border border-[#e8e9e9] bg-white p-4">
              <div className="flex-shrink-0"><IllustrationOffers /></div>
              <div>
                <p className="font-bold text-[#182024]">Noch keine Angebote eingegangen</p>
                <p className="mt-0.5 text-sm text-[#73787a]">
                  Sobald Interessent:innen ein Angebot einreichen, erscheinen diese hier.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-[#e8e9e9] bg-white">
              <div className="border-b border-[#e8e9e9] px-4 py-3">
                <h2 className="text-sm font-semibold text-[#2f363a]">Angebote</h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-[#73787a]">
                    <th className="px-4 pb-3 pt-4 font-medium">Teilnehmer</th>
                    <th className="px-4 pb-3 pt-4 font-medium">Betrag</th>
                    <th className="px-4 pb-3 pt-4 font-medium">Version</th>
                    <th className="px-4 pb-3 pt-4 font-medium">Eingereicht</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8e9e9]">
                  {bidding.offers.map((o) => {
                    const participant = bidding.participants.find((p) => p.id === o.participantId);
                    return (
                      <tr key={o.id}>
                        <td className="px-4 py-3 text-[#2f363a]">{participant?.name ?? o.participantId}</td>
                        <td className="px-4 py-3 font-mono text-[#2f363a]">{formatCHF(o.amount)}</td>
                        <td className="px-4 py-3 text-[#73787a]">v{o.version}</td>
                        <td className="px-4 py-3 text-[#73787a]">{formatDateTime(o.submittedAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Teilnehmer ─────────────────────────────────────────────────── */}
        <div className="h-px w-full bg-[#e8e9e9]" />
        <div className="my-6">
          {bidding.participants.length === 0 ? (
            <div className="flex items-center gap-4 rounded-lg border border-[#e8e9e9] bg-white p-4">
              <div className="flex-shrink-0"><IllustrationParticipants /></div>
              <div>
                <p className="font-bold text-[#182024]">Noch keine Teilnehmer:innen registriert</p>
                <p className="mt-0.5 text-sm text-[#73787a]">
                  Registrierte Interessent:innen erscheinen hier, sobald sie sich angemeldet haben.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-[#e8e9e9] bg-white">
              <div className="border-b border-[#e8e9e9] px-4 py-3">
                <h2 className="text-sm font-semibold text-[#2f363a]">Teilnehmer:innen</h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-[#73787a]">
                    <th className="px-4 pb-3 pt-4 font-medium">Name</th>
                    <th className="px-4 pb-3 pt-4 font-medium">E-Mail</th>
                    <th className="px-4 pb-3 pt-4 font-medium">Registriert</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8e9e9]">
                  {bidding.participants.map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-3 text-[#2f363a]">{p.name}</td>
                      <td className="px-4 py-3 text-[#73787a]">{p.email}</td>
                      <td className="px-4 py-3 text-[#73787a]">{formatDate(p.registeredAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
      </div>{/* end content */}

      {/* ── Toast ──────────────────────────────────────────────────────────── */}
      {toastVisible && (
        <div className="fixed bottom-6 right-6 flex items-center gap-8 rounded-xl bg-[#2f363a] px-6 py-4 shadow-lg">
          <div className="flex items-center gap-2 text-white">
            <IconCheckCircle />
            <span className="text-base font-medium">Bieterverfahren erfolgreich gestartet.</span>
          </div>
          <button
            onClick={() => setToastVisible(false)}
            className="text-white/60 transition-colors hover:text-white"
          >
            <IconClose />
          </button>
        </div>
      )}
    </div>
  );
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-6 text-sm">
      <span className="w-32 flex-shrink-0 text-[#73787a]">{label}</span>
      <span className="text-[#2f363a]">{value}</span>
    </div>
  );
}

export default BiddingDetail;
