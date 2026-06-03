import React, { useMemo, useState } from "react";
import {
  BiddingStatus,
  PriceDisplay,
  ProcessType,
  type BiddingDocuments,
  type GridbidBidding,
  type GridbidOffer,
  type GridbidParticipant,
} from "../../types/domain";
import {
  formatCHF,
  formatDate,
  formatTimeRemaining,
} from "../../utils/labels";

// ─── Design tokens ────────────────────────────────────────────────────────────

const C = {
  textDefault:   "#1A1A1A",
  textDark:      "#0D0D0D",
  textSubtle:    "#6B7280",
  textDisabled:  "#9CA3AF",
  textWhite:     "#FFFFFF",
  textInfo:      "#1D4ED8",
  textSuccess:   "#166534",
  textWarning:   "#92400E",
  textError:     "#991B1B",
  bgPage:        "#FFFFFF",
  bgSurface:     "#F9FAFB",
  bgInfo:        "#EFF6FF",
  bgSuccess:     "#F0FDF4",
  bgWarning:     "#FFFBEB",
  bgError:       "#FEF2F2",
  brandBlue25:   "#EFF6FF",
  mono0:         "#FFFFFF",
  mono25:        "#F9FAFB",
  mono50:        "#F3F4F6",
  mono100:       "#E5E7EB",
  mono300:       "#D1D5DB",
  mono400:       "#9CA3AF",
  mono500:       "#6B7280",
  mono600:       "#4B5563",
  mono700:       "#374151",
  radiusMd:      8,
  radiusLg:      12,
};

// ─── Badge style presets ──────────────────────────────────────────────────────

const badge = {
  success: { background: C.bgSuccess, color: C.textSuccess, borderRadius: C.radiusMd, padding: "2px 8px", fontSize: 11, fontWeight: 600 } as React.CSSProperties,
  warning: { background: C.bgWarning, color: C.textWarning, borderRadius: C.radiusMd, padding: "2px 8px", fontSize: 11, fontWeight: 600 } as React.CSSProperties,
  info:    { background: C.bgInfo,    color: C.textInfo,    borderRadius: C.radiusMd, padding: "2px 8px", fontSize: 11, fontWeight: 600 } as React.CSSProperties,
  neutral: { background: C.mono50,    color: C.textSubtle,  borderRadius: C.radiusMd, padding: "2px 8px", fontSize: 11, fontWeight: 600 } as React.CSSProperties,
  error:   { background: C.bgError,   color: C.textError,   borderRadius: C.radiusMd, padding: "2px 8px", fontSize: 11, fontWeight: 600 } as React.CSSProperties,
};

// ─── Button style presets ─────────────────────────────────────────────────────

const btn = {
  primary:     { background: C.textDark,    color: C.textWhite,   border: "none",                   borderRadius: C.radiusMd, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" } as React.CSSProperties,
  success:     { background: C.textSuccess, color: C.textWhite,   border: "none",                   borderRadius: C.radiusMd, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" } as React.CSSProperties,
  warning:     { background: C.bgWarning,   color: C.textWarning, border: `1px solid ${C.mono300}`, borderRadius: C.radiusMd, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" } as React.CSSProperties,
  secondary:   { background: C.bgPage,      color: C.textDefault, border: `1px solid ${C.mono300}`, borderRadius: C.radiusMd, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" } as React.CSSProperties,
  ghost:       { background: "transparent", color: C.textSubtle,  border: "none",                   borderRadius: C.radiusMd, padding: "6px 12px", fontSize: 13, cursor: "pointer" } as React.CSSProperties,
  primarySm:   { background: C.textDark,    color: C.textWhite,   border: "none",                   borderRadius: C.radiusMd, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" } as React.CSSProperties,
  successSm:   { background: C.textSuccess, color: C.textWhite,   border: "none",                   borderRadius: C.radiusMd, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" } as React.CSSProperties,
  warningSm:   { background: C.bgWarning,   color: C.textWarning, border: `1px solid ${C.mono300}`, borderRadius: C.radiusMd, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" } as React.CSSProperties,
  secondarySm: { background: C.bgPage,      color: C.textDefault, border: `1px solid ${C.mono300}`, borderRadius: C.radiusMd, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" } as React.CSSProperties,
  ghostSm:     { background: "transparent", color: C.textSubtle,  border: "none",                   borderRadius: C.radiusMd, padding: "4px 8px",  fontSize: 12, cursor: "pointer" } as React.CSSProperties,
};

// ─── Typography helpers ───────────────────────────────────────────────────────

const T = {
  label:   { fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.07em", color: C.textSubtle },
  body:    { fontSize: 13, color: C.textDefault },
  meta:    { fontSize: 12, color: C.textSubtle },
  heading: { color: C.textDark },
  mono:    { fontFamily: "DM Mono, monospace", color: C.textDark },
};

// ─── Icons ────────────────────────────────────────────────────────────────────

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

function IconChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 4L6 8l4 4" />
    </svg>
  );
}

function IconChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 14 14" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
    >
      <path d="M3 5l4 4 4-4" />
    </svg>
  );
}

function IconLockSm() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="5" width="8" height="5.5" rx="1" />
      <path d="M3.5 5V3.5a2 2 0 014 0V5" />
    </svg>
  );
}

function IconUpload() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 9.5V2.5M4 5.5l3-3 3 3" />
      <path d="M2 11.5h10" />
    </svg>
  );
}

function IconFile() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.5 1.5H3a1 1 0 00-1 1v8a1 1 0 001 1h7a1 1 0 001-1V5.5M7.5 1.5L11 5.5M7.5 1.5v4H11" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4.5" y="4.5" width="7" height="7" rx="1" />
      <path d="M9.5 4.5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v5.5a1 1 0 0 0 1 1h1.5" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l3.5 3.5" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="6.5" cy="6.5" r="5.5" />
      <path d="M6.5 6v3.5M6.5 4v.01" />
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

function IconHousePlaceholder() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5L12 3l9 7.5V21H3V10.5z" />
      <rect x="9" y="14" width="6" height="7" rx="0.5" />
    </svg>
  );
}

function IconTablerClock({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
  );
}

function IconTablerUsers({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconTablerFile({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function IconTablerRoute({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="5" r="2" /><circle cx="19" cy="19" r="2" />
      <path d="M5 7v3a2 2 0 0 0 2 2h8a2 2 0 0 1 2 2v3" />
    </svg>
  );
}

function IconTablerArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textInfo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 1, flexShrink: 0 }}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDT(iso: string): string {
  return new Date(iso).toLocaleString("de-CH", { dateStyle: "short", timeStyle: "short" });
}

function priceDisplayLabel(pd: PriceDisplay): string {
  switch (pd) {
    case PriceDisplay.HIDDEN: return "Kein Preis";
    case PriceDisplay.PRICE:  return "Richtpreis";
    case PriceDisplay.RANGE:  return "Preisspanne";
  }
}

function processTypeLabel(pt: ProcessType): string {
  switch (pt) {
    case ProcessType.SEALED_BID: return "Verdeckt";
    case ProcessType.OPEN_BID:   return "Öffentlich";
  }
}

interface FinancingTier {
  label: string;
  style: React.CSSProperties;
}

function getFinancingTierFromLevel(level: 1 | 2 | 3): FinancingTier {
  switch (level) {
    case 3: return { label: "Hohe Sicherheit",     style: badge.success };
    case 2: return { label: "Mittlere Sicherheit", style: badge.warning };
    case 1: return { label: "Geringere Sicherheit", style: badge.neutral };
  }
}

function getBuyerQualLevel(buyer: WorkspaceBuyer): 1 | 2 | 3 {
  if (buyer.qualificationLevel) return buyer.qualificationLevel;
  if (buyer.idDocument && buyer.financingProof) return 3;
  if (buyer.phone && buyer.buyerProfile) return 2;
  return 1;
}

// ─── Extended prototype types ─────────────────────────────────────────────────

export type WorkspaceBuyer = GridbidParticipant & {
  phone?: string;
  buyerProfile: boolean;
  idDocument: boolean;
  financingProof: boolean;
  offmarketOptIn?: boolean;
  qualificationLevel?: 1 | 2 | 3;
};

export type WorkspaceBidding = GridbidBidding & {
  currentRound: number;
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface PropertyWorkspaceProps {
  bidding: WorkspaceBidding;
  buyers: WorkspaceBuyer[];
  onBack: () => void;
  onBiddingChange: (updated: WorkspaceBidding) => void;
}

// ─── Effective status ─────────────────────────────────────────────────────────

type EffectiveStatus =
  | "draft"
  | "active"
  | "deadline_passed"
  | "round2_active"
  | "closed";

function getEffectiveStatus(bidding: WorkspaceBidding): EffectiveStatus {
  if (bidding.status === BiddingStatus.DRAFT) return "draft";
  if (bidding.status === BiddingStatus.CLOSED) return "closed";
  if (bidding.currentRound >= 2) return "round2_active";
  if (bidding.deadline && new Date(bidding.deadline) < new Date())
    return "deadline_passed";
  return "active";
}

const EFFECTIVE_STATUS_LABEL: Record<EffectiveStatus, string> = {
  draft:           "Entwurf",
  active:          "Aktiv",
  deadline_passed: "Frist abgelaufen",
  round2_active:   "Runde 2 aktiv",
  closed:          "Abgeschlossen",
};

const EFFECTIVE_STATUS_BADGE_STYLE: Record<EffectiveStatus, React.CSSProperties> = {
  draft:           badge.neutral,
  active:          badge.info,
  deadline_passed: badge.warning,
  round2_active:   badge.info,
  closed:          badge.success,
};

function StatusBadge({ status }: { status: EffectiveStatus }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", ...EFFECTIVE_STATUS_BADGE_STYLE[status] }}>
      {EFFECTIVE_STATUS_LABEL[status]}
    </span>
  );
}

// ─── Tab: Angebote ────────────────────────────────────────────────────────────

interface AngeboteTabProps {
  bidding: WorkspaceBidding;
  buyers: WorkspaceBuyer[];
  propBids: GridbidOffer[];
  uniqueBids: GridbidOffer[];
  onBiddingChange: (u: WorkspaceBidding) => void;
  onOpenRound2Modal: () => void;
  onOpenEndDeadlineModal: () => void;
  onAccept: (participantId: string) => void;
}

function AngeboteTab({
  bidding,
  buyers,
  propBids,
  uniqueBids,
  onAccept,
}: AngeboteTabProps) {
  const [expandedBuyers, setExpandedBuyers] = useState<Set<string>>(new Set());
  const effectiveStatus = getEffectiveStatus(bidding);
  const listPrice = bidding.listingPrice ?? bidding.richtpreis;
  const countdown = formatTimeRemaining(bidding.deadline);
  const topBid = uniqueBids[0] ?? null;
  const topBuyerName = topBid
    ? (buyers.find((b) => b.id === topBid.participantId)?.name ?? "—")
    : null;
  const delta =
    topBid != null && listPrice != null && listPrice > 0
      ? topBid.amount - listPrice
      : null;
  const deltaPercent =
    delta != null && listPrice != null && listPrice > 0
      ? ((delta / listPrice) * 100).toFixed(1)
      : null;

  function toggleExpanded(id: string) {
    setExpandedBuyers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const showEvalBar =
    effectiveStatus === "deadline_passed" || effectiveStatus === "round2_active";

  const noBidBuyers = buyers.filter(
    (b) => !uniqueBids.some((bid) => bid.participantId === b.id)
  );

  // Activity log events
  type BidEvent = { type: "bid"; name: string; amount: number; round: number; timestamp: string };
  type RegEvent = { type: "reg"; name: string; timestamp: string };
  type ActivityEvent = BidEvent | RegEvent;

  const events: ActivityEvent[] = [
    ...propBids.map((offer): BidEvent => ({
      type: "bid",
      name: buyers.find((b) => b.id === offer.participantId)?.name ?? offer.participantId,
      amount: offer.amount,
      round: offer.version ?? 1,
      timestamp: offer.submittedAt,
    })),
    ...bidding.participants.map((p): RegEvent => ({
      type: "reg",
      name: p.name,
      timestamp: p.registeredAt,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Nächster Schritt guidance text
  let nextStep: string;
  if (effectiveStatus === "active") {
    nextStep = `Frist läuft ab am ${bidding.deadline ? formatDate(bidding.deadline) : "—"}. Danach kannst du Runde 2 starten oder das Verfahren abschliessen.`;
  } else if (effectiveStatus === "deadline_passed" && bidding.roundsPlanned >= 2) {
    nextStep = "Frist abgelaufen. Starte Runde 2 für ausgewählte Bieter:innen oder schliesse das Verfahren jetzt ab.";
  } else if (effectiveStatus === "deadline_passed") {
    nextStep = "Frist abgelaufen. Nimm das beste Angebot an oder schliesse das Verfahren ab.";
  } else if (effectiveStatus === "round2_active") {
    nextStep = "Runde 2 läuft. Warte auf weitere Angebote bis zur neuen Frist.";
  } else if (effectiveStatus === "closed") {
    nextStep = "Verfahren abgeschlossen.";
  } else {
    nextStep = "Entwurf — aktiviere das Verfahren, um den Prozess zu starten.";
  }

  // Section 2 cell data
  const deadlinePassed =
    effectiveStatus === "deadline_passed" ||
    effectiveStatus === "round2_active" ||
    effectiveStatus === "closed";
  const daysLeft =
    bidding.deadline
      ? (new Date(bidding.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      : null;
  const fristColor =
    deadlinePassed || (daysLeft !== null && daysLeft <= 3)
      ? C.textWarning
      : C.textSuccess;

  const bidderCount = buyers.length;
  const bidCount = uniqueBids.length;
  const bidPercent = bidderCount > 0 ? Math.round((bidCount / bidderCount) * 100) : 0;

  const level3Docs = bidding.documents.level3;
  const docsColor = level3Docs.length > 0 ? C.textWarning : C.textSuccess;
  const docsSub = level3Docs.length > 0
    ? `Level 3 für ${level3Docs.length} Dok. ausstehend`
    : "Alle freigegeben";
  const docsSubColor = level3Docs.length > 0 ? C.textWarning : C.textSuccess;

  const roundValue = `Runde ${bidding.currentRound} von ${bidding.roundsPlanned}`;
  const roundSub =
    effectiveStatus === "active" ? "Läuft" :
    effectiveStatus === "deadline_passed" ? "Auswertung" :
    effectiveStatus === "round2_active" ? "Runde 2 aktiv" :
    effectiveStatus === "closed" ? "Abgeschlossen" :
    "Nicht gestartet";

  return (
    <div style={{ background: "white" }}>
      <style>{`
        @keyframes gridbid-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.35); }
        }
        .gridbid-pulse { animation: gridbid-pulse 1.5s ease-in-out infinite; }
      `}</style>

      {/* ── Section 1: Hero number ── */}
      <div style={{ paddingBottom: 24, borderBottom: `1px solid ${C.mono100}` }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>

          {/* Left: highest bid */}
          <div>
            <div style={{ ...T.label, marginBottom: 6 }}>HÖCHSTGEBOT</div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: 36, fontWeight: 500, color: C.textDark, lineHeight: 1 }}>
              {topBid ? formatCHF(topBid.amount) : "—"}
            </div>
            {topBuyerName && (
              <div style={{ marginTop: 4, fontSize: 13, color: C.textSubtle }}>{topBuyerName}</div>
            )}
          </div>

          {/* Center: list price delta */}
          {listPrice != null && listPrice > 0 && delta != null && (
            <div style={{ textAlign: "center", flex: 1, minWidth: 0 }}>
              <div style={{ ...T.label, marginBottom: 4 }}>DIFFERENZ ZUM LISTENPREIS</div>
              <div style={{ fontFamily: "DM Mono, monospace", fontSize: 16, fontWeight: 500, color: delta >= 0 ? C.textSuccess : C.textError }}>
                {delta >= 0 ? "+" : ""}{formatCHF(Math.abs(delta))}
              </div>
              <div style={{ fontSize: 13, color: delta >= 0 ? C.textSuccess : C.textError }}>
                {delta >= 0 ? "+" : ""}{deltaPercent}%
              </div>
            </div>
          )}

          {/* Right: status indicator + countdown */}
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, marginBottom: 6 }}>
              <div
                className="gridbid-pulse"
                style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: effectiveStatus === "active" ? C.textSuccess : C.textWarning,
                }}
              />
              <span style={{ fontSize: 13, fontWeight: 500, color: effectiveStatus === "active" ? C.textSuccess : C.textWarning }}>
                {EFFECTIVE_STATUS_LABEL[effectiveStatus]}
              </span>
            </div>
            {effectiveStatus === "active" || effectiveStatus === "round2_active" ? (
              <div style={{ fontFamily: "DM Mono, monospace", fontSize: 22, fontWeight: 500, color: C.textDark }}>
                {countdown}
              </div>
            ) : effectiveStatus === "deadline_passed" ? (
              <div style={{ fontSize: 13, fontWeight: 600, color: C.textWarning }}>Bereit zur Auswertung</div>
            ) : null}
            {bidding.deadline && (
              <div style={{ fontSize: 12, color: C.textSubtle, marginTop: 2 }}>{fmtDT(bidding.deadline)}</div>
            )}
            <div style={{ fontSize: 11, color: C.textSubtle, marginTop: 2 }}>Zuletzt aktualisiert: vor 2 Min.</div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Process health strip ── */}
      <div style={{ paddingTop: 20, paddingBottom: 20, borderBottom: `1px solid ${C.mono100}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>

          {/* Frist */}
          <div style={{ paddingRight: 20, borderRight: `1px solid ${C.mono100}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <IconTablerClock color={fristColor} />
              <span style={T.label}>FRIST</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: C.textDark }}>
              {deadlinePassed ? "Abgelaufen" : (countdown || "Keine Frist")}
            </div>
            <div style={{ fontSize: 11, color: C.textSubtle, marginTop: 1 }}>
              {bidding.deadline ? fmtDT(bidding.deadline) : "Keine Frist gesetzt"}
            </div>
          </div>

          {/* Käufer:innen */}
          <div style={{ padding: "0 20px", borderRight: `1px solid ${C.mono100}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <IconTablerUsers color={C.textInfo} />
              <span style={T.label}>KÄUFER:INNEN</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: C.textDark }}>{bidderCount} registriert</div>
            <div style={{ fontSize: 11, color: C.textSubtle, marginTop: 1 }}>
              {bidCount} haben geboten ({bidPercent}%)
            </div>
          </div>

          {/* Unterlagen */}
          <div style={{ padding: "0 20px", borderRight: `1px solid ${C.mono100}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <IconTablerFile color={docsColor} />
              <span style={T.label}>UNTERLAGEN</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: C.textDark }}>Level 1–2 freigegeben</div>
            <div style={{ fontSize: 11, color: docsSubColor, marginTop: 1 }}>{docsSub}</div>
          </div>

          {/* Runden */}
          <div style={{ paddingLeft: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <IconTablerRoute color={C.textSubtle} />
              <span style={T.label}>RUNDEN</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: C.textDark }}>{roundValue}</div>
            <div style={{ fontSize: 11, color: C.textSubtle, marginTop: 1 }}>{roundSub}</div>
          </div>
        </div>
      </div>

      {/* ── Section 3: Nächster Schritt ── */}
      <div style={{ paddingTop: 16, paddingBottom: 20, borderBottom: `1px solid ${C.mono100}` }}>
        <div style={{ background: C.bgSurface, borderRadius: C.radiusMd, padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
          <IconTablerArrowRight />
          <span style={{ fontSize: 13, color: C.textDefault }}>{nextStep}</span>
        </div>
      </div>

      {/* ── Section 4: Order book ── */}
      <div style={{ paddingTop: 24 }}>
        <div style={{ ...T.label, marginBottom: 12 }}>ANGEBOTSÜBERSICHT</div>

        {/* Evaluation bar */}
        {showEvalBar && uniqueBids.length > 0 && (
          <div style={{
            background: C.bgSurface, borderRadius: C.radiusMd, padding: "12px 16px",
            marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: C.textDark }}>Verfahren auswerten</span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {uniqueBids.map((bid) => {
                const name = buyers.find((b) => b.id === bid.participantId)?.name ?? bid.participantId;
                return (
                  <button
                    key={bid.participantId}
                    style={{ background: C.textSuccess, color: "white", padding: "5px 12px", borderRadius: C.radiusMd, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer" }}
                    onClick={() => onAccept(bid.participantId)}
                  >
                    Angebot von {name} annehmen
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 140px 120px 90px", gap: 16, paddingBottom: 8, borderBottom: `1px solid ${C.mono100}` }}>
          <div style={T.label} />
          <div style={T.label}>BIETER:IN</div>
          <div style={{ ...T.label, textAlign: "right" }}>ANGEBOT</div>
          <div style={{ ...T.label, textAlign: "right" }}>VS. LISTENPREIS</div>
          <div style={{ ...T.label, textAlign: "right" }}>FINANZIERUNG</div>
        </div>

        {uniqueBids.length === 0 && noBidBuyers.length === 0 ? (
          <div style={{ padding: "40px 0", textAlign: "center", fontSize: 14, color: C.textSubtle }}>
            Noch keine Angebote eingegangen.
          </div>
        ) : (
          <div>
            {/* Bidding rows */}
            {uniqueBids.map((bid, idx) => {
              const buyer = buyers.find((b) => b.id === bid.participantId);
              const name = buyer?.name ?? bid.participantId;
              const isExpanded = expandedBuyers.has(bid.participantId);
              const allBuyerBids = propBids
                .filter((b) => b.participantId === bid.participantId)
                .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
              const priorBids = allBuyerBids.filter((b) => b.id !== bid.id);
              const level = buyer ? getBuyerQualLevel(buyer) : 1;
              const ft = getFinancingTierFromLevel(level);
              const bidDelta =
                listPrice != null && listPrice > 0 ? bid.amount - listPrice : null;
              const bidDeltaPct =
                bidDelta != null && listPrice != null && listPrice > 0
                  ? ((bidDelta / listPrice) * 100).toFixed(1)
                  : null;

              return (
                <div key={bid.id} style={{ borderBottom: `1px solid ${C.mono100}` }}>
                  <div
                    style={{ display: "grid", gridTemplateColumns: "32px 1fr 140px 120px 90px", gap: 16, padding: "16px 0", alignItems: "start", cursor: "pointer" }}
                    onClick={() => toggleExpanded(bid.participantId)}
                  >
                    {/* Rank */}
                    <div style={{
                      width: 26, height: 26, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 600,
                      background: idx === 0 ? C.textDark : "transparent",
                      border: idx === 0 ? "none" : `1px solid ${C.mono300}`,
                      color: idx === 0 ? "white" : C.textSubtle,
                    }}>
                      {idx + 1}
                    </div>

                    {/* Buyer */}
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: C.textDark }}>{name}</div>
                      {buyer && <div style={{ fontSize: 12, color: C.textSubtle, marginTop: 1 }}>{buyer.email}</div>}
                      <div style={{ marginTop: 4, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                        <span style={ft.style}>{ft.label}</span>
                        <span style={badge.neutral}>Level {level}</span>
                      </div>
                      {level < 3 && (
                        <div style={{ fontSize: 11, color: C.textSubtle, marginTop: 3 }}>Selbstdeklariert</div>
                      )}
                    </div>

                    {/* Amount */}
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "DM Mono, monospace", fontSize: 16, fontWeight: 500, color: idx === 0 ? C.textInfo : C.textDark }}>
                        {formatCHF(bid.amount)}
                      </div>
                      <div style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: C.textSubtle, marginTop: 2 }}>
                        {fmtDT(bid.submittedAt)}
                      </div>
                    </div>

                    {/* Delta */}
                    <div style={{ textAlign: "right" }}>
                      {bidDelta != null ? (
                        <>
                          <div style={{ fontFamily: "DM Mono, monospace", fontSize: 13, color: bidDelta >= 0 ? C.textSuccess : C.textError }}>
                            {bidDelta >= 0 ? "+" : ""}{formatCHF(Math.abs(bidDelta))}
                          </div>
                          <div style={{ fontSize: 11, color: bidDelta >= 0 ? C.textSuccess : C.textError, marginTop: 1 }}>
                            {bidDelta >= 0 ? "+" : ""}{bidDeltaPct}%
                          </div>
                        </>
                      ) : (
                        <span style={{ color: C.textSubtle }}>—</span>
                      )}
                    </div>

                    {/* Financing + chevron */}
                    <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                      <span style={ft.style}>{ft.label}</span>
                      <div style={{ color: C.textSubtle }}>
                        <IconChevronDown open={isExpanded} />
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail panel */}
                  {isExpanded && (
                    <div style={{ background: C.bgSurface, borderRadius: C.radiusMd, padding: "12px 16px", margin: "0 0 8px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                      {/* Left: contact */}
                      <div>
                        {buyer?.phone && (
                          <a href={`tel:${buyer.phone}`} style={{ display: "block", fontSize: 13, color: C.textInfo, textDecoration: "none", marginBottom: 4 }}>
                            {buyer.phone}
                          </a>
                        )}
                        {buyer && (
                          <a href={`mailto:${buyer.email}`} style={{ display: "block", fontSize: 13, color: C.textInfo, textDecoration: "none", marginBottom: 4 }}>
                            {buyer.email}
                          </a>
                        )}
                        {buyer && (
                          <div style={{ fontSize: 12, color: C.textSubtle, marginBottom: 4 }}>
                            Registriert {new Date(buyer.registeredAt).toLocaleDateString("de-CH", { day: "numeric", month: "long", year: "numeric" })}
                          </div>
                        )}
                        {buyer?.offmarketOptIn && (
                          <span style={badge.neutral}>Off-Market</span>
                        )}
                      </div>

                      {/* Right: bid history */}
                      <div>
                        <div style={{ ...T.label, marginBottom: 6 }}>FRÜHERE GEBOTE</div>
                        {priorBids.length > 0 ? (
                          priorBids.map((pb) => (
                            <div key={pb.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0" }}>
                              <span style={{ fontFamily: "DM Mono, monospace", fontSize: 13, color: C.textSubtle }}>{formatCHF(pb.amount)}</span>
                              <span style={{ ...badge.neutral, fontSize: 11 }}>Runde {pb.version ?? 1}</span>
                              <span style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: C.textSubtle }}>{fmtDT(pb.submittedAt)}</span>
                            </div>
                          ))
                        ) : (
                          <div style={{ fontSize: 12, color: C.textSubtle }}>Keine früheren Gebote</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Registered buyers with no bid */}
            {noBidBuyers.length > 0 && (
              <>
                <div style={{ height: 1, background: C.mono300, margin: "4px 0" }} />
                {noBidBuyers.map((buyer) => {
                  const isExpanded = expandedBuyers.has(buyer.id);
                  return (
                    <div key={buyer.id} style={{ borderBottom: `1px solid ${C.mono100}`, opacity: 0.55 }}>
                      <div
                        style={{ display: "grid", gridTemplateColumns: "32px 1fr 140px 120px 90px", gap: 16, padding: "16px 0", alignItems: "start", cursor: "pointer" }}
                        onClick={() => toggleExpanded(buyer.id)}
                      >
                        <div style={{
                          width: 26, height: 26, borderRadius: "50%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, fontWeight: 600,
                          border: `1px dashed ${C.mono300}`,
                          color: C.textSubtle, background: "transparent",
                        }}>
                          —
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 500, color: C.textDark }}>{buyer.name}</div>
                          <div style={{ fontSize: 12, color: C.textSubtle, marginTop: 1 }}>{buyer.email}</div>
                          <div style={{ fontSize: 11, color: C.textSubtle, marginTop: 3 }}>Noch kein Angebot</div>
                        </div>
                        <div style={{ textAlign: "right", color: C.textSubtle, fontSize: 13 }}>—</div>
                        <div style={{ textAlign: "right", color: C.textSubtle, fontSize: 13 }}>—</div>
                        <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                          <span style={{ fontSize: 13, color: C.textSubtle }}>—</span>
                          <div style={{ color: C.textSubtle }}>
                            <IconChevronDown open={isExpanded} />
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div style={{ background: C.bgSurface, borderRadius: C.radiusMd, padding: "12px 16px", margin: "0 0 8px 0" }}>
                          {buyer.phone && (
                            <a href={`tel:${buyer.phone}`} style={{ display: "block", fontSize: 13, color: C.textInfo, textDecoration: "none", marginBottom: 4 }}>
                              {buyer.phone}
                            </a>
                          )}
                          <a href={`mailto:${buyer.email}`} style={{ display: "block", fontSize: 13, color: C.textInfo, textDecoration: "none", marginBottom: 4 }}>
                            {buyer.email}
                          </a>
                          <div style={{ fontSize: 12, color: C.textSubtle, marginBottom: 4 }}>
                            Registriert {new Date(buyer.registeredAt).toLocaleDateString("de-CH", { day: "numeric", month: "long", year: "numeric" })}
                          </div>
                          {buyer.offmarketOptIn && (
                            <span style={{ ...badge.neutral, display: "inline-block" }}>Off-Market</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Section 5: Aktivitätsprotokoll ── */}
      {events.length > 0 && (
        <div style={{ paddingTop: 28 }}>
          <div style={{ ...T.label, marginBottom: 14 }}>AKTIVITÄTSPROTOKOLL</div>
          <div>
            {events.map((evt, i) => (
              <div
                key={i}
                style={{
                  display: "flex", gap: 16, alignItems: "baseline",
                  padding: "8px 0",
                  borderBottom: i < events.length - 1 ? `0.5px solid ${C.mono100}` : "none",
                }}
              >
                <div style={{ width: 6, height: 6, flexShrink: 0, borderRadius: "50%", background: evt.type === "bid" ? C.textInfo : C.mono300, marginTop: 5 }} />
                <div style={{ flex: 1 }}>
                  {evt.type === "bid" ? (
                    <span style={{ fontSize: 13, color: C.textDefault }}>
                      <span style={{ fontWeight: 500, color: C.textDark }}>{evt.name}</span>
                      {" "}hat ein Angebot über{" "}
                      <span style={{ fontFamily: "DM Mono, monospace", fontWeight: 500, color: C.textDark }}>{formatCHF(evt.amount)}</span>
                      {" "}eingereicht{" "}
                      <span style={{ ...badge.info, padding: "2px 6px" }}>Runde {evt.round}</span>
                    </span>
                  ) : (
                    <span style={{ fontSize: 13, color: C.textSubtle }}>
                      <span style={{ fontWeight: 500, color: C.textDark }}>{evt.name}</span>
                      {" "}hat sich registriert
                    </span>
                  )}
                </div>
                <div style={{ flexShrink: 0, fontFamily: "DM Mono, monospace", fontSize: 11, color: C.textSubtle }}>
                  {fmtDT(evt.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Dokumente ───────────────────────────────────────────────────────────

interface DokumenteTabProps {
  bidding: WorkspaceBidding;
  buyers: WorkspaceBuyer[];
  onBiddingChange: (u: WorkspaceBidding) => void;
}

interface FreigabeEntry {
  buyerId: string;
  confirming: boolean;
}

const LEVEL_ACCENT: Record<1 | 2 | 3, string> = {
  1: C.textSuccess,
  2: C.textWarning,
  3: C.textSubtle,
};

function DokumenteTab({ bidding, buyers, onBiddingChange }: DokumenteTabProps) {
  const [uploadModal, setUploadModal] = useState<1 | 2 | 3 | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [freigabeState, setFreigabeState] = useState<Record<string, FreigabeEntry>>({});

  const level2BuyerCount = buyers.filter((b) => !!(b.phone)).length;

  const levels: Array<{
    num: 1 | 2 | 3;
    label: string;
    desc: string;
    accessCount: number;
    locked: boolean;
    docs: string[];
  }> = [
    { num: 1, label: "Level 1", desc: "Alle registrierten Interessent:innen", accessCount: buyers.length, locked: false, docs: bidding.documents.level1 },
    { num: 2, label: "Level 2", desc: "Verifizierte Käufer:innen (Telefon bestätigt)", accessCount: level2BuyerCount, locked: false, docs: bidding.documents.level2 },
    { num: 3, label: "Level 3", desc: "Manuelle Freigabe — vertrauliche Unterlagen", accessCount: 0, locked: true, docs: bidding.documents.level3 },
  ];

  function addDocument(level: 1 | 2 | 3, title: string) {
    const key = (`level${level}` as keyof BiddingDocuments);
    const updated: BiddingDocuments = {
      ...bidding.documents,
      [key]: [...bidding.documents[key], title],
    };
    onBiddingChange({ ...bidding, documents: updated });
  }

  function freigabeKey(level: number, docIdx: number) {
    return `${level}-${docIdx}`;
  }

  function setFreigabeBuyer(key: string, buyerId: string) {
    setFreigabeState((prev) => ({ ...prev, [key]: { buyerId, confirming: false } }));
  }

  function confirmFreigabe(key: string, docTitle: string) {
    const entry = freigabeState[key];
    if (!entry) return;
    const buyer = buyers.find((b) => b.id === entry.buyerId);
    if (buyer) console.log("Freigabe:", docTitle, buyer.name);
    setFreigabeState((prev) => { const next = { ...prev }; delete next[key]; return next; });
  }

  return (
    <div className="space-y-6">
      {levels.map((lvl) => (
        <div key={lvl.num} style={{ borderRadius: C.radiusLg, border: `1px solid ${C.mono100}`, background: C.bgPage, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.mono100}`, padding: "12px 16px", borderLeft: `3px solid ${LEVEL_ACCENT[lvl.num]}` }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.textDark }}>{lvl.label}</span>
                {lvl.locked && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: C.textSubtle }}>
                    <IconLockSm />
                    Freigabe durch Makler:in
                  </span>
                )}
              </div>
              <div style={{ marginTop: 2, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.textSubtle }}>
                <span>{lvl.desc}</span>
                <span style={{ width: 1, height: 12, background: C.mono100 }} />
                <span>
                  <strong style={{ color: C.textDefault }}>{lvl.accessCount}</strong>{" "}
                  Käufer:innen haben Zugriff
                </span>
              </div>
            </div>
            {!lvl.locked && (
              <button
                style={{ ...btn.secondarySm, display: "flex", alignItems: "center", gap: 6 }}
                onClick={() => { setUploadTitle(""); setUploadModal(lvl.num); }}
              >
                <IconUpload />
                Hochladen
              </button>
            )}
          </div>

          {lvl.docs.length === 0 ? (
            <div style={{ padding: "20px 16px", textAlign: "center", fontSize: 12, color: C.textSubtle }}>
              Noch keine Dokumente in dieser Stufe.
            </div>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {lvl.docs.map((doc, docIdx) => {
                const fKey = freigabeKey(lvl.num, docIdx);
                const fEntry = freigabeState[fKey];
                return (
                  <li key={docIdx} style={{ padding: "12px 16px", borderBottom: `1px solid ${C.mono100}` }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = C.mono25)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: C.textSubtle }}><IconFile /></span>
                      <span style={{ flex: 1, fontSize: 13, color: C.textDefault }}>{doc}</span>
                    </div>
                    {lvl.num === 3 && (
                      <div style={{ marginTop: 8, paddingLeft: 20 }}>
                        {!fEntry ? (
                          <button
                            style={{ ...btn.ghost, padding: "0", fontSize: 12, color: C.textInfo }}
                            onClick={() => setFreigabeState((prev) => ({ ...prev, [fKey]: { buyerId: buyers[0]?.id ?? "", confirming: false } }))}
                          >
                            Für Käufer:in freigeben →
                          </button>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <select
                              value={fEntry.buyerId}
                              onChange={(e) => setFreigabeBuyer(fKey, e.target.value)}
                              style={{ borderRadius: C.radiusMd, border: `1px solid ${C.mono100}`, padding: "4px 8px", fontSize: 12, color: C.textDefault, outline: "none" }}
                            >
                              {buyers.map((b) => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                              ))}
                            </select>
                            <button style={btn.primarySm} onClick={() => confirmFreigabe(fKey, doc)}>
                              Bestätigen
                            </button>
                            <button
                              style={{ ...btn.ghostSm, color: C.textSubtle }}
                              onClick={() => setFreigabeState((prev) => { const next = { ...prev }; delete next[fKey]; return next; })}
                            >
                              Abbrechen
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}

      {uploadModal !== null && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }}>
          <div style={{ width: "100%", maxWidth: 384, borderRadius: C.radiusLg, background: C.bgPage, border: `1px solid ${C.mono100}`, padding: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
            <h2 style={{ marginBottom: 16, fontSize: 18, fontWeight: 700, color: C.textDark }}>
              Dokument zu Level {uploadModal} hinzufügen
            </h2>
            <input
              autoFocus
              type="text"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && uploadTitle.trim()) {
                  addDocument(uploadModal, uploadTitle.trim());
                  setUploadModal(null);
                }
              }}
              placeholder="Dateiname, z.B. Grundriss_EG.pdf"
              style={{ width: "100%", borderRadius: C.radiusMd, border: `1px solid ${C.mono300}`, padding: "8px 12px", fontSize: 13, color: C.textDefault, outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = C.textInfo)}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.mono300)}
            />
            <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button style={btn.secondarySm} onClick={() => setUploadModal(null)}>
                Abbrechen
              </button>
              <button
                style={{ ...btn.primarySm, opacity: uploadTitle.trim() ? 1 : 0.4 }}
                disabled={!uploadTitle.trim()}
                onClick={() => {
                  if (uploadTitle.trim()) {
                    addDocument(uploadModal, uploadTitle.trim());
                    setUploadModal(null);
                  }
                }}
              >
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Einstellungen ───────────────────────────────────────────────────────

interface EinstellungenTabProps {
  bidding: WorkspaceBidding;
  onBiddingChange: (u: WorkspaceBidding) => void;
}

function EinstellungenTab({ bidding, onBiddingChange }: EinstellungenTabProps) {
  const [biddingRules, setBiddingRules] = useState(bidding.biddingRules);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const effectiveStatus = getEffectiveStatus(bidding);
  const isLocked = effectiveStatus === "active" || effectiveStatus === "round2_active";

  function save() {
    onBiddingChange({ ...bidding, biddingRules });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  }

  const readOnlyFields = [
    { label: "Titel",             value: bidding.title || "—" },
    { label: "Adresse",           value: bidding.address || "—" },
    { label: "Vorlage",           value: "Standard" },
    { label: "Sichtbarkeit",      value: processTypeLabel(bidding.processType) },
    { label: "Rundenanzahl",      value: String(bidding.roundsPlanned) },
    { label: "Preisorientierung", value: priceDisplayLabel(bidding.priceDisplay) },
    { label: "Frist",             value: bidding.deadline ? fmtDT(bidding.deadline) : "Ohne Frist" },
    { label: "Erstellt",          value: bidding.createdAt ? formatDate(bidding.createdAt) : "—" },
  ];

  return (
    <div className="space-y-5">
      {isLocked && (
        <div style={{ borderRadius: C.radiusMd, border: `1px solid ${C.mono300}`, background: C.bgWarning, padding: "12px 16px", fontSize: 13, color: C.textWarning }}>
          Einstellungen können während eines aktiven Verfahrens nicht geändert werden.
        </div>
      )}

      <div style={{ overflow: "hidden", borderRadius: C.radiusLg, border: `1px solid ${C.mono100}`, background: C.bgPage }}>
        {readOnlyFields.map(({ label, value }, i) => (
          <div
            key={label}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 16px",
              ...(i > 0 ? { borderTop: `1px solid ${C.mono100}` } : {}),
            }}
          >
            <span style={{ fontSize: 13, color: C.textSubtle }}>{label}</span>
            <span style={{ fontSize: 13, color: C.textDark }}>{value}</span>
          </div>
        ))}
      </div>

      <div>
        <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 600, color: C.textDefault }}>
          Informationen für Interessent:innen
        </label>
        <textarea
          value={biddingRules}
          onChange={(e) => setBiddingRules(e.target.value)}
          rows={6}
          style={{ width: "100%", resize: "none", borderRadius: C.radiusMd, border: `1px solid ${C.mono300}`, padding: "8px 12px", fontSize: 13, color: C.textDefault, outline: "none", boxSizing: "border-box" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = C.textInfo)}
          onBlur={(e) => (e.currentTarget.style.borderColor = C.mono300)}
          placeholder="Z.B. Mindestanforderungen, Prozessbeschreibung, wichtige Hinweise…"
        />
        <div style={{ marginTop: 4, fontSize: 12, color: C.textSubtle }}>
          Änderungen werden sofort im Käufer:innen Deal Room sichtbar.
        </div>
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <button style={btn.secondary} onClick={save}>
            Hinweis speichern
          </button>
          {settingsSaved && (
            <span style={{ fontSize: 13, color: C.textSuccess }}>Gespeichert ✓</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Round2Modal ──────────────────────────────────────────────────────────────

interface Round2ModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (newDeadline: string) => void;
}

export function Round2Modal({ open, onClose, onConfirm }: Round2ModalProps) {
  const [newDeadline, setNewDeadline] = useState("");

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }}>
      <div style={{ width: "100%", maxWidth: 448, borderRadius: C.radiusLg, background: C.bgPage, border: `1px solid ${C.mono100}`, padding: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
        <h2 style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: C.textDark }}>Runde 2 starten</h2>
        <p style={{ marginBottom: 20, fontSize: 13, color: C.textSubtle }}>
          Alle qualifizierten Bieter:innen werden zur zweiten Runde eingeladen.
          Lege eine neue Frist für Runde 2 fest.
        </p>
        <label style={{ display: "block", marginBottom: 4, fontSize: 11, fontWeight: 600, color: C.textSubtle }}>
          Neue Frist
        </label>
        <input
          type="datetime-local"
          value={newDeadline}
          onChange={(e) => setNewDeadline(e.target.value)}
          style={{ width: "100%", borderRadius: C.radiusMd, border: `1px solid ${C.mono300}`, padding: "8px 12px", fontSize: 13, color: C.textDefault, outline: "none", boxSizing: "border-box" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = C.textInfo)}
          onBlur={(e) => (e.currentTarget.style.borderColor = C.mono300)}
        />
        <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button style={btn.secondary} onClick={onClose}>Abbrechen</button>
          <button
            style={{ ...btn.primary, opacity: newDeadline ? 1 : 0.4 }}
            disabled={!newDeadline}
            onClick={() => {
              if (newDeadline) { onConfirm(new Date(newDeadline).toISOString()); onClose(); }
            }}
          >
            Runde 2 starten
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Accept modal ─────────────────────────────────────────────────────────────

interface AcceptModalProps {
  participantId: string;
  buyers: WorkspaceBuyer[];
  uniqueBids: GridbidOffer[];
  onConfirm: (participantId: string) => void;
  onClose: () => void;
}

function AcceptModal({ participantId, buyers, uniqueBids, onConfirm, onClose }: AcceptModalProps) {
  const buyer = buyers.find((b) => b.id === participantId);
  const bid = uniqueBids.find((b) => b.participantId === participantId);
  if (!buyer || !bid) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }}>
      <div style={{ width: "100%", maxWidth: 448, borderRadius: C.radiusLg, background: C.bgPage, border: `1px solid ${C.mono100}`, padding: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
        <h2 style={{ marginBottom: 12, fontSize: 18, fontWeight: 700, color: C.textDark }}>Angebot annehmen</h2>
        <p style={{ marginBottom: 24, fontSize: 13, color: C.textSubtle }}>
          Du nimmst das Angebot von <strong style={{ color: C.textDefault }}>{buyer.name}</strong> über{" "}
          {formatCHF(bid.amount)} an. Alle anderen Bieter:innen werden automatisch über die Absage
          informiert. Dieser Schritt kann nicht rückgängig gemacht werden.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button style={btn.secondary} onClick={onClose}>Abbrechen</button>
          <button
            style={btn.success}
            onClick={() => { onConfirm(participantId); onClose(); }}
          >
            Ja, Angebot annehmen
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PropertyWorkspace({
  bidding: initialBidding,
  buyers,
  onBack,
  onBiddingChange,
}: PropertyWorkspaceProps) {
  const [bidding, setBidding] = useState(initialBidding);
  const [activeTab, setActiveTab] = useState<"bids" | "documents" | "settings">("bids");
  const [acceptModal, setAcceptModal] = useState<string | null>(null);
  const [round2ModalOpen, setRound2ModalOpen] = useState(false);
  const [endDeadlineModal, setEndDeadlineModal] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleBiddingChange(updated: WorkspaceBidding) {
    setBidding(updated);
    onBiddingChange(updated);
  }

  function endDeadline() {
    handleBiddingChange({ ...bidding, deadline: new Date(Date.now() - 1000).toISOString() });
    setEndDeadlineModal(false);
  }

  const propBids = useMemo(
    () => [...bidding.offers].sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()),
    [bidding.offers]
  );

  const latestBidPerBuyer = useMemo(() => {
    const map = new Map<string, GridbidOffer>();
    for (const bid of propBids) {
      const existing = map.get(bid.participantId);
      if (!existing || new Date(bid.submittedAt) > new Date(existing.submittedAt)) {
        map.set(bid.participantId, bid);
      }
    }
    return map;
  }, [propBids]);

  const uniqueBids = useMemo(
    () => Array.from(latestBidPerBuyer.values()).sort((a, b) => b.amount - a.amount),
    [latestBidPerBuyer]
  );

  const registeredBuyers = useMemo(
    () => buyers.filter((b) => bidding.participants.some((p) => p.id === b.id)),
    [buyers, bidding.participants]
  );

  const tabs: Array<{ key: typeof activeTab; label: string }> = [
    { key: "bids",      label: "Angebote" },
    { key: "documents", label: "Dokumente" },
    { key: "settings",  label: "Einstellungen" },
  ];

  const effectiveStatus = getEffectiveStatus(bidding);
  const publicUrl = bidding.publicUrl ?? `https://gridbid.local/b/${bidding.id}`;

  function copyUrl() {
    void navigator.clipboard.writeText(publicUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{ display: "flex", minHeight: "100%", flexDirection: "column", background: C.bgSurface }}>
      {/* Global top bar */}
      <header style={{ display: "flex", height: 56, flexShrink: 0, alignItems: "center", justifyContent: "space-between", background: C.bgPage, padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <GridBidLogoIcon />
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em", color: C.textDark }}>GridBid</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 28, height: 28, flexShrink: 0, borderRadius: 9999, background: C.textInfo, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: C.textWhite }}>
            A
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: C.textDark }}>Anton</span>
        </div>
      </header>
      <div style={{ height: 1, background: C.mono100 }} />

      {/* Persistent property header */}
      <div style={{ borderBottom: `1px solid ${C.mono100}`, background: C.bgPage, padding: "16px 24px" }}>
        <div style={{ maxWidth: 896, margin: "0 auto" }} className="space-y-3">
          <button
            onClick={onBack}
            style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: C.textSubtle, background: "none", border: "none", cursor: "pointer", padding: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.textDark)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.textSubtle)}
          >
            <IconChevronLeft />
            Zurück zur Übersicht
          </button>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            {bidding.imageUrl ? (
              <img src={bidding.imageUrl} alt="" style={{ height: 52, width: 71, flexShrink: 0, borderRadius: C.radiusLg, objectFit: "cover" }} />
            ) : (
              <div style={{ display: "flex", height: 52, width: 71, flexShrink: 0, alignItems: "center", justifyContent: "center", borderRadius: C.radiusLg, background: C.mono50, color: C.mono300 }}>
                <IconHousePlaceholder />
              </div>
            )}
            <div>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: C.textDark, margin: 0 }}>
                  {bidding.title || "Unbenannt"}
                </h1>
                <StatusBadge status={effectiveStatus} />
              </div>
              <div style={{ marginTop: 2, display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: C.textSubtle }}>
                <span>{bidding.address || "—"}</span>
                {bidding.websiteUrl && (
                  <a
                    href={bidding.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 4, color: C.textInfo, textDecoration: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                  >
                    Öffentliche Website →
                    <IconExternalLink />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, borderRadius: C.radiusLg, border: `1px solid ${C.mono100}`, background: C.bgSurface, padding: "10px 16px" }}>
            <span style={{ display: "flex", flexShrink: 0, alignItems: "center", gap: 6, fontSize: 13, color: C.textSubtle }}>
              <IconInfo />
              Öffentlicher Link
            </span>
            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "DM Mono, monospace", fontSize: 13, color: C.textSubtle }}>
              {publicUrl}
            </span>
            <button
              onClick={copyUrl}
              style={{ ...btn.secondarySm, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}
            >
              <IconCopy />
              {copied ? "Kopiert!" : "Kopieren"}
            </button>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div style={{ borderBottom: `1px solid ${C.mono100}`, background: C.bgPage, padding: "0 24px" }}>
        <div style={{ maxWidth: 896, margin: "0 auto", display: "flex" }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                borderTop: "none", borderLeft: "none", borderRight: "none",
                borderBottom: activeTab === tab.key ? `2px solid ${C.textInfo}` : "2px solid transparent",
                color: activeTab === tab.key ? C.textInfo : C.textSubtle,
                padding: "12px 16px", fontSize: 13, fontWeight: 500,
                background: "none", cursor: "pointer", transition: "color 0.1s",
              }}
              onMouseEnter={(e) => { if (activeTab !== tab.key) e.currentTarget.style.color = C.textDark; }}
              onMouseLeave={(e) => { if (activeTab !== tab.key) e.currentTarget.style.color = C.textSubtle; }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, padding: "24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", width: "100%" }}>
          {activeTab === "bids" && (
            <AngeboteTab
              bidding={bidding}
              buyers={registeredBuyers}
              propBids={propBids}
              uniqueBids={uniqueBids}
              onBiddingChange={handleBiddingChange}
              onOpenRound2Modal={() => setRound2ModalOpen(true)}
              onOpenEndDeadlineModal={() => setEndDeadlineModal(true)}
              onAccept={setAcceptModal}
            />
          )}
          {activeTab === "documents" && (
            <DokumenteTab bidding={bidding} buyers={registeredBuyers} onBiddingChange={handleBiddingChange} />
          )}
          {activeTab === "settings" && (
            <EinstellungenTab bidding={bidding} onBiddingChange={handleBiddingChange} />
          )}
        </div>
      </div>

      {/* Modals */}
      <Round2Modal
        open={round2ModalOpen}
        onClose={() => setRound2ModalOpen(false)}
        onConfirm={(newDeadline) => {
          handleBiddingChange({ ...bidding, deadline: newDeadline, currentRound: 2 });
        }}
      />

      {acceptModal !== null && (
        <AcceptModal
          participantId={acceptModal}
          buyers={registeredBuyers}
          uniqueBids={uniqueBids}
          onConfirm={(id) => {
            handleBiddingChange({ ...bidding, status: BiddingStatus.CLOSED });
            console.log("Accepted bid from participant:", id);
          }}
          onClose={() => setAcceptModal(null)}
        />
      )}

      {endDeadlineModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }}>
          <div style={{ width: "100%", maxWidth: 384, borderRadius: C.radiusLg, background: C.bgPage, border: `1px solid ${C.mono100}`, padding: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
            <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
              <div style={{ display: "flex", width: 64, height: 64, alignItems: "center", justifyContent: "center", borderRadius: 9999, background: C.bgWarning, color: C.textWarning }}>
                <IconClock />
              </div>
            </div>
            <h2 style={{ marginBottom: 8, textAlign: "center", fontSize: 18, fontWeight: 700, color: C.textDark }}>
              Möchtest du die Frist wirklich beenden?
            </h2>
            <p style={{ marginBottom: 24, textAlign: "center", fontSize: 13, color: C.textSubtle }}>
              Danach können keine neuen Angebote mehr eingereicht werden.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button style={{ ...btn.warning, width: "100%", textAlign: "center" }} onClick={endDeadline}>
                Frist beenden
              </button>
              {bidding.roundsPlanned >= 2 && (
                <button
                  style={{ ...btn.secondary, width: "100%", textAlign: "center", borderColor: C.textInfo, color: C.textInfo }}
                  onClick={() => { setEndDeadlineModal(false); setRound2ModalOpen(true); }}
                >
                  Neue Runde starten
                </button>
              )}
              <button style={{ ...btn.ghost, width: "100%", textAlign: "center" }} onClick={() => setEndDeadlineModal(false)}>
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyWorkspace;
