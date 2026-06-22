import React, { useMemo, useRef, useState } from "react";
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
import { AvatarDropdown } from "../AvatarDropdown";
import smartMatchingIllustration from "../../assets/smart-matching.svg";

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
  mono:    { color: C.textDark },
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

function IconShieldCheck({ color }: { color: string }) {
  return (
    <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.5 1L10 2.8V6C10 8.8 8 10.6 5.5 11.5C3 10.6 1 8.8 1 6V2.8L5.5 1Z" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="0.9" strokeLinejoin="round" />
      <path d="M3.5 6L4.8 7.3L7.5 4.5" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
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

function fmtDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString("de-CH", { day: "numeric", month: "long", year: "numeric" });
}

function fmtTimeOnly(iso: string): string {
  return new Date(iso).toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" });
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

// Violet accent for Round 2
const VIOLET = {
  bg:   "#EEEDFE",
  text: "#7F77DD",
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
  | "round2_deadline_passed"
  | "closed";

function getEffectiveStatus(bidding: WorkspaceBidding): EffectiveStatus {
  if (bidding.status === BiddingStatus.DRAFT) return "draft";
  if (bidding.status === BiddingStatus.CLOSED) return "closed";
  if (bidding.round2Deadline) {
    if (new Date(bidding.round2Deadline) < new Date()) return "round2_deadline_passed";
    return "round2_active";
  }
  if (bidding.deadline && new Date(bidding.deadline) < new Date())
    return "deadline_passed";
  return "active";
}

function fmtRound2Deadline(iso: string): string {
  const d = new Date(iso);
  const weekday = d.toLocaleDateString("de-CH", { weekday: "short" });
  const day = d.getDate();
  const month = d.toLocaleDateString("de-CH", { month: "short" });
  const year = d.getFullYear();
  const time = d.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" });
  return `${weekday}, ${day}. ${month} ${year} · ${time}`;
}

const EFFECTIVE_STATUS_LABEL: Record<EffectiveStatus, string> = {
  draft:                 "Entwurf",
  active:                "Aktiv",
  deadline_passed:       "Frist abgelaufen",
  round2_active:         "Runde 2 aktiv",
  round2_deadline_passed:"R2 Frist abgelaufen",
  closed:                "Abgeschlossen",
};

const EFFECTIVE_STATUS_BADGE_STYLE: Record<EffectiveStatus, React.CSSProperties> = {
  draft:                 badge.neutral,
  active:                badge.info,
  deadline_passed:       badge.warning,
  round2_active:         { background: VIOLET.bg, color: VIOLET.text, borderRadius: C.radiusMd, padding: "2px 8px", fontSize: 11, fontWeight: 600 },
  round2_deadline_passed:badge.warning,
  closed:                badge.success,
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
  onOpenCloseWizard: () => void;
}

function AngeboteTab({
  bidding,
  buyers,
  propBids,
  uniqueBids,
  onAccept,
  onOpenRound2Modal,
  onOpenCloseWizard,
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
    effectiveStatus === "deadline_passed" ||
    effectiveStatus === "round2_active" ||
    effectiveStatus === "round2_deadline_passed";

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
    nextStep = "Runde 2 läuft. Sobald die Frist abgelaufen ist, kannst du das Verfahren abschliessen.";
  } else if (effectiveStatus === "round2_deadline_passed") {
    nextStep = "Runde 2 abgelaufen. Schliesse das Verfahren ab und erteile den Zuschlag.";
  } else if (effectiveStatus === "closed") {
    nextStep = "Verfahren abgeschlossen.";
  } else {
    nextStep = "Entwurf — aktiviere das Verfahren, um den Prozess zu starten.";
  }

  // Which action buttons to show
  const showRound2Btn = effectiveStatus === "active" || effectiveStatus === "deadline_passed";
  const showCloseBtn = effectiveStatus === "active" || effectiveStatus === "deadline_passed" || effectiveStatus === "round2_active" || effectiveStatus === "round2_deadline_passed";

  // Section 2 cell data
  const deadlinePassed =
    effectiveStatus === "deadline_passed" ||
    effectiveStatus === "round2_active" ||
    effectiveStatus === "round2_deadline_passed" ||
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

  const currentRoundNum = bidding.round2Deadline ? 2 : 1;
  const roundValue = `Runde ${currentRoundNum} von ${bidding.roundsPlanned}`;
  const roundSub =
    effectiveStatus === "active" ? "Läuft" :
    effectiveStatus === "deadline_passed" ? "Auswertung" :
    effectiveStatus === "round2_active" ? "Runde 2 aktiv" :
    effectiveStatus === "round2_deadline_passed" ? "Auswertung Runde 2" :
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

      {/* ── Section 1: Stats row ── */}
      <div style={{ border: "1px solid #E8E9E9", borderRadius: C.radiusMd, background: C.bgPage, padding: "22px 28px", marginBottom: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>

          {/* Col 1: Highest bid */}
          <div style={{ paddingRight: 20, borderRight: "1px solid #E8E9E9" }}>
            <div style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase" as const, letterSpacing: "0.07em", color: "#73787A", marginBottom: 6 }}>Höchstgebot</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#4782F3", lineHeight: 1, whiteSpace: "nowrap" }}>
              {topBid ? formatCHF(topBid.amount) : "—"}
            </div>
            {topBuyerName && (
              <div style={{ marginTop: 4, fontSize: 12, color: C.textSubtle }}>{topBuyerName}</div>
            )}
          </div>

          {/* Col 2: Δ Listenpreis */}
          <div style={{ padding: "0 20px", borderRight: "1px solid #E8E9E9" }}>
            <div style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase" as const, letterSpacing: "0.07em", color: "#73787A", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
              Δ Listenpreis
              <span style={{ color: "#73787A" }}><IconInfo /></span>
            </div>
            {listPrice != null && listPrice > 0 && delta != null ? (
              <>
                <div style={{ fontSize: 20, fontWeight: 700, color: delta >= 0 ? "#288352" : C.textError }}>
                  {delta >= 0 ? "+" : ""}{formatCHF(Math.abs(delta))}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: delta >= 0 ? "#288352" : C.textError, marginTop: 4 }}>
                  {delta >= 0 ? "+" : ""}{deltaPercent}%
                </div>
              </>
            ) : (
              <div style={{ fontSize: 16, color: C.textSubtle }}>—</div>
            )}
          </div>

          {/* Col 3: Bid spread */}
          <div style={{ paddingLeft: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase" as const, letterSpacing: "0.07em", color: "#73787A", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
              Gebotsstreuung
              <span style={{ color: "#73787A" }}><IconInfo /></span>
            </div>
            {uniqueBids.length >= 2 ? (() => {
              const spread = Math.max(...uniqueBids.map((b) => b.amount)) - Math.min(...uniqueBids.map((b) => b.amount));
              return (
                <div style={{ fontSize: 20, fontWeight: 700, color: "#182024" }}>
                  {formatCHF(spread)}
                </div>
              );
            })() : (
              <div style={{ fontSize: 16, color: C.textSubtle }}>—</div>
            )}
          </div>
        </div>
      </div>

      {/* ── Closed deal summary banner ── */}
      {effectiveStatus === "closed" && bidding.finalPrice != null && (
        <div style={{
          background: C.bgSuccess, borderRadius: C.radiusMd, padding: "14px 18px",
          marginTop: 16, border: `1px solid #BBF7D0`,
        }}>
          <div style={{ ...T.label, color: C.textSuccess, marginBottom: 6 }}>ZUSCHLAG ERTEILT</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.textSuccess }}>
              {bidding.winnerId
                ? (buyers.find(b => b.id === bidding.winnerId)?.name ?? bidding.winnerId)
                : (bidding.winnerName ?? "Käufer:in unbekannt")}
            </span>
            {bidding.finalPrice != null && (
              <span style={{ fontSize: 18, fontWeight: 600, color: C.textSuccess }}>
                {formatCHF(bidding.finalPrice)}
              </span>
            )}
            <span style={{ ...badge.neutral, fontSize: 11 }}>
              Runde {bidding.round2Deadline ? 2 : 1}
            </span>
          </div>
        </div>
      )}

      {/* ── Round 2 active banner ── */}
      {effectiveStatus === "round2_active" && bidding.round2Deadline && (
        <div style={{
          background: VIOLET.bg, borderRadius: C.radiusMd, padding: "10px 16px",
          marginBottom: 0, marginTop: 16,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
          border: `1px solid ${VIOLET.text}30`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: VIOLET.text, flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: VIOLET.text }}>Runde 2 läuft</span>
            <span style={{ fontSize: 13, color: VIOLET.text }}>·</span>
            <span style={{ fontSize: 13, color: VIOLET.text }}>
              {formatTimeRemaining(bidding.round2Deadline)}
            </span>
          </div>
          <span style={{ fontSize: 13, color: VIOLET.text }}>
            {bidding.round2InvitedBuyerIds.length} von {buyers.filter(b => uniqueBids.some(bid => bid.participantId === b.id)).length} Bietenden eingeladen
          </span>
        </div>
      )}

      {/* ── Section 4: Order book ── */}
      <div style={{ paddingTop: 24 }}>
        <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.textDark }}>
            {bidderCount} Käufer:innen in dieser Runde
          </span>
          <span style={{ width: 1, height: 14, background: C.mono300, display: "inline-block" }} />
          <span style={{ fontSize: 14, color: C.textSubtle }}>
            {bidCount} haben Angebote. ({bidPercent}%)
          </span>
        </div>

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
        <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 160px 110px 150px", gap: 20, padding: "0 12px 10px", borderBottom: `1px solid ${C.mono100}` }}>
          <div style={T.label}>Nr.</div>
          <div style={T.label}>BIETER:IN</div>
          <div style={T.label}>GEBOT / VS. LISTENPREIS</div>
          <div style={T.label}>RUNDE</div>
          <div style={{ ...T.label, textAlign: "right" }}>EINGEREICHT</div>
        </div>

        {uniqueBids.length === 0 && noBidBuyers.length === 0 ? (
          <div style={{ padding: "40px 0", textAlign: "center", fontSize: 14, color: C.textSubtle }}>
            Noch keine Angebote eingegangen.
          </div>
        ) : (() => {
          const inRound2 = effectiveStatus === "round2_active" || effectiveStatus === "round2_deadline_passed";
          const invitedBidders = inRound2
            ? uniqueBids.filter((bid) => bidding.round2InvitedBuyerIds.includes(bid.participantId))
            : uniqueBids;
          const notInvitedBidders = inRound2
            ? uniqueBids.filter((bid) => !bidding.round2InvitedBuyerIds.includes(bid.participantId))
            : [];

          function renderBidRow(bid: GridbidOffer, idx: number, isInvited: boolean) {
            const buyer = buyers.find((b) => b.id === bid.participantId);
            const name = buyer?.name ?? bid.participantId;
            const isExpanded = expandedBuyers.has(bid.participantId);
            const allBuyerBids = propBids
              .filter((b) => b.participantId === bid.participantId)
              .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
            const priorBids = allBuyerBids.filter((b) => b.id !== bid.id);
            const level = buyer ? getBuyerQualLevel(buyer) : 1;
            const ft = getFinancingTierFromLevel(level);
            const bidRound = bid.round ?? 1;
            const bidDelta = listPrice != null && listPrice > 0 ? bid.amount - listPrice : null;
            const bidDeltaPct =
              bidDelta != null && listPrice != null && listPrice > 0
                ? ((bidDelta / listPrice) * 100).toFixed(1)
                : null;

            const isHighest = idx === 0 && isInvited;
            return (
              <div key={bid.id} style={{ borderBottom: `1px solid ${C.mono100}`, background: isHighest ? "#F0F6FF" : "transparent" }}>
                <div
                  style={{ display: "grid", gridTemplateColumns: "32px 1fr 160px 110px 150px", gap: 20, padding: "18px 12px", alignItems: "start", cursor: "pointer" }}
                  onClick={() => toggleExpanded(bid.participantId)}
                >
                  {/* Rank */}
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 600,
                    background: isHighest ? C.textDark : "transparent",
                    border: isHighest ? "none" : `1px solid ${C.mono300}`,
                    color: isHighest ? "white" : C.textSubtle,
                  }}>
                    {idx + 1}
                  </div>

                  {/* BIETER:IN — name + verification + email only */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: C.textDark }}>{name}</div>
                      {(() => {
                        const lvlStyle: Record<1|2|3, { bg: string; border: string; color: string }> = {
                          1: { bg: "#FBF2EA", border: "#F0D5B0", color: "#B56100" },
                          2: { bg: "#EDF2FE", border: "#B8CCF5", color: "#3968C2" },
                          3: { bg: "#EAF3EE", border: "#A3D5B8", color: "#288352" },
                        };
                        const s = lvlStyle[level];
                        return (
                          <span style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 4, padding: "1px 6px", fontSize: 11, fontWeight: 600, color: s.color, display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <IconShieldCheck color={s.color} />
                            {level}
                          </span>
                        );
                      })()}
                      {isHighest && (
                        <span style={{ background: "#4782F3", color: "#fff", borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 600 }}>
                          Höchstgebot
                        </span>
                      )}
                    </div>
                    {buyer && <div style={{ fontSize: 12, color: C.textSubtle, marginTop: 2 }}>{buyer.email}</div>}
                  </div>

                  {/* BID / VS. LIST PRICE */}
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: isHighest ? "#4782F3" : C.textDark }}>
                      {formatCHF(bid.amount)}
                    </div>
                    {bidDelta != null ? (
                      <div style={{ fontSize: 12, color: bidDelta >= 0 ? "#288352" : C.textError, marginTop: 2 }}>
                        {bidDelta >= 0 ? "+" : ""}{formatCHF(Math.abs(bidDelta))}, {bidDelta >= 0 ? "+" : ""}{bidDeltaPct}%
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: C.textSubtle, marginTop: 2 }}>—</div>
                    )}
                  </div>

                  {/* ROUND */}
                  <div>
                    <span style={{ display: "inline-block", border: `1px solid ${C.mono100}`, borderRadius: 20, padding: "3px 12px", fontSize: 13, color: C.textDark, background: C.bgPage, whiteSpace: "nowrap" }}>
                      Runde {bidRound}
                    </span>
                  </div>

                  {/* SUBMITTED + chevron */}
                  <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <div style={{ fontSize: 13, color: C.textDark }}>{fmtDateLong(bid.submittedAt)}</div>
                    <div style={{ fontSize: 12, color: C.textSubtle }}>{fmtTimeOnly(bid.submittedAt)}</div>
                    <div style={{ color: C.textSubtle, marginTop: 2 }}>
                      <IconChevronDown open={isExpanded} />
                    </div>
                  </div>
                </div>

                {/* Expanded detail panel — columns aligned to table grid */}
                {isExpanded && (
                  <div style={{ background: C.bgSurface, borderRadius: C.radiusMd, padding: "16px 12px", margin: "0 0 8px 0" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 160px 110px 150px", gap: 20, alignItems: "start" }}>
                      {/* Spacer for rank col */}
                      <div />

                      {/* DETAILS — under BIETER:IN */}
                      <div>
                        <div style={{ ...T.label, marginBottom: 10 }}>ANGABEN</div>
                        {buyer && (
                          <a href={`mailto:${buyer.email}`} style={{ display: "block", fontSize: 13, color: C.textDefault, textDecoration: "none", marginBottom: 4 }}>
                            {buyer.email}
                          </a>
                        )}
                        {buyer?.phone && (
                          <div style={{ fontSize: 13, color: C.textDefault, marginBottom: 4 }}>{buyer.phone}</div>
                        )}
                        {buyer && (
                          <div style={{ fontSize: 13, color: C.textSubtle, marginTop: 2 }}>
                            Registriert: {new Date(buyer.registeredAt).toLocaleDateString("de-CH", { day: "numeric", month: "long", year: "numeric" })}
                          </div>
                        )}
                      </div>

                      {/* PREVIOUS BIDS — spans cols 3-5, sub-grid matches BID / ROUND / SUBMITTED */}
                      <div style={{ gridColumn: "3 / 6" }}>
                        <div style={{ ...T.label, marginBottom: 10 }}>FRÜHERE GEBOTE</div>
                        {priorBids.length > 0 ? (
                          priorBids.map((pb) => (
                            <div key={pb.id} style={{ display: "grid", gridTemplateColumns: "160px 110px 150px", gap: 20, alignItems: "center", padding: "5px 0", borderBottom: `1px solid ${C.mono100}` }}>
                              <span style={{ fontSize: 13, fontWeight: 500, color: C.textDark }}>{formatCHF(pb.amount)}</span>
                              <span style={{ display: "inline-block", border: `1px solid ${C.mono100}`, borderRadius: 20, padding: "2px 10px", fontSize: 12, color: C.textDark, background: C.bgPage, whiteSpace: "nowrap" }}>
                                Runde {pb.version ?? 1}
                              </span>
                              <span style={{ fontSize: 12, color: C.textSubtle, whiteSpace: "nowrap" }}>
                                {fmtDateLong(pb.submittedAt)}, {fmtTimeOnly(pb.submittedAt)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div style={{ fontSize: 13, color: C.textSubtle }}>Keine früheren Angebote</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          }

          return (
            <div>
              {/* Invited bidders */}
              {invitedBidders.map((bid, idx) => renderBidRow(bid, idx, true))}

              {/* Not invited section */}
              {notInvitedBidders.length > 0 && (
                <>
                  <div style={{ marginTop: 16, marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.textSubtle }}>
                      {notInvitedBidders.length} nicht eingeladen
                    </span>
                  </div>
                  <div style={{ opacity: 0.55 }}>
                    {notInvitedBidders.map((bid, idx) => renderBidRow(bid, idx, false))}
                  </div>
                </>
              )}

              {/* Registered buyers with no bid */}
              {noBidBuyers.length > 0 && (
                <>
                  {noBidBuyers.map((buyer) => {
                    const isExpanded = expandedBuyers.has(buyer.id);
                    return (
                      <div key={buyer.id} style={{ borderBottom: `1px solid ${C.mono100}`, opacity: 0.55 }}>
                        <div
                          style={{ display: "grid", gridTemplateColumns: "32px 1fr 160px 110px 150px", gap: 20, padding: "18px 12px", alignItems: "start", cursor: "pointer" }}
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
                          <div style={{ color: C.textSubtle, fontSize: 13 }}>—</div>
                          <div style={{ color: C.textSubtle, fontSize: 13 }}>—</div>
                          <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
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
          );
        })()}
      </div>

      {/* ── Section 5: Activity log ── */}
      {events.length > 0 && (
        <div style={{ paddingTop: 28 }}>
          <div style={{ ...T.label, marginBottom: 14 }}>Aktivitätsprotokoll</div>
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
                      <span style={{ fontWeight: 500, color: C.textDark }}>{formatCHF(evt.amount)}</span>
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
                <div style={{ flexShrink: 0, fontSize: 11, color: C.textSubtle }}>
                  {fmtDT(evt.timestamp)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, textAlign: "right" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: C.textInfo, padding: 0 }}>
              Mehr anzeigen
            </button>
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

function getDocIconColor(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "#E5484D";
  if (ext === "docx" || ext === "doc") return "#3B82F6";
  if (ext === "xlsx" || ext === "xls") return "#22C55E";
  return "#73787A";
}

function DocFileIcon({ filename }: { filename: string }) {
  const color = getDocIconColor(filename);
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", verticalAlign: "middle" }}>
      <path d="M10 9v-.75C10 7.01 8.99 6 7.75 6H6.25C5.01 6 4 7.01 4 8.25V9" />
      <circle cx="7" cy="3.5" r="1.5" />
      <path d="M13 9v-.5c0-.97-.73-1.77-1.67-1.94M10.33 1.06A2 2 0 0 1 13 3" />
      <path d="M1 9v-.5c0-.97.73-1.77 1.67-1.94M3.67 1.06A2 2 0 0 0 1 3" />
    </svg>
  );
}

function DokumenteTab({ bidding, buyers, onBiddingChange }: DokumenteTabProps) {
  const [toast, setToast] = useState<string | null>(null);
  const [level3AccessBuyerIds, setLevel3AccessBuyerIds] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadLevel, setUploadLevel] = useState<1 | 2 | 3 | null>(null);
  const [buyerModalOpen, setBuyerModalOpen] = useState(false);
  // Draft selection while modal is open; initialised from committed state on open
  const [selectedBuyerIds, setSelectedBuyerIds] = useState<Set<string>>(new Set());
  const [accessViewLevel, setAccessViewLevel] = useState<1 | 2 | 3 | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  const level2BuyerCount = buyers.filter((b) => !!(b.phone)).length;

  // Build sorted bids for the modal (highest bid per buyer)
  const latestBidByBuyer = useMemo(() => {
    const map = new Map<string, GridbidOffer>();
    for (const offer of bidding.offers) {
      const existing = map.get(offer.participantId);
      if (!existing || offer.amount > existing.amount) map.set(offer.participantId, offer);
    }
    return map;
  }, [bidding.offers]);

  const sortedModalBuyers = useMemo(() => {
    return buyers
      .filter((b) => latestBidByBuyer.has(b.id))
      .sort((a, b) => (latestBidByBuyer.get(b.id)?.amount ?? 0) - (latestBidByBuyer.get(a.id)?.amount ?? 0));
  }, [buyers, latestBidByBuyer]);

  const topBuyerId = sortedModalBuyers[0]?.id;

  const levels: Array<{
    num: 1 | 2 | 3;
    label: string;
    desc: string;
    accessCount: number;
    locked: boolean;
    docs: string[];
  }> = [
    { num: 1, label: "Bei Registrierung", desc: "Alle registrierten Interessent:innen", accessCount: buyers.length, locked: false, docs: bidding.documents.level1 },
    { num: 2, label: "Nach erstem Angebot", desc: "Verifizierte Käufer:innen (Telefon bestätigt)", accessCount: level2BuyerCount, locked: false, docs: bidding.documents.level2 },
    { num: 3, label: "Nach Freigabe", desc: "Manuelle Freigabe — vertrauliche Unterlagen", accessCount: level3AccessBuyerIds.size, locked: true, docs: bidding.documents.level3 },
  ];

  function addDocument(level: 1 | 2 | 3, title: string) {
    const key = (`level${level}` as keyof BiddingDocuments);
    const updated: BiddingDocuments = {
      ...bidding.documents,
      [key]: [...bidding.documents[key], title],
    };
    onBiddingChange({ ...bidding, documents: updated });
  }

  function openBuyerModal() {
    setSelectedBuyerIds(new Set(level3AccessBuyerIds));
    setBuyerModalOpen(true);
  }

  function saveBuyerAccess() {
    setLevel3AccessBuyerIds(new Set(selectedBuyerIds));
    setBuyerModalOpen(false);
  }

  function toggleBuyer(id: string) {
    setSelectedBuyerIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {levels.map((lvl) => (
        <div key={lvl.num} style={{ borderRadius: C.radiusMd, border: `1px solid ${C.mono100}`, background: C.bgPage, padding: 20 }}>
          {/* Card header */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#182024" }}>{lvl.label}</span>
              {lvl.locked && (
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: C.textSubtle }}>
                  <IconLockSm />
                  Freigabe durch Makler:in
                </span>
              )}
            </div>
            <div style={{ fontSize: 13, color: "#73787A", display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
              <span>{lvl.desc}</span>
              <span style={{ color: "#C0C5C8" }}>·</span>
              <UsersIcon />
              <span
                onClick={() => setAccessViewLevel(lvl.num)}
                style={{ cursor: "pointer", textDecoration: "underline", textDecorationColor: "#C0C5C8", textUnderlineOffset: 2 }}
              >
                <strong style={{ color: "#182024", fontWeight: 600 }}>{lvl.accessCount}</strong>{" "}
                Käufer:innen haben Zugriff
              </span>
            </div>
          </div>

          {/* File chips — 2-column grid */}
          {lvl.docs.length === 0 ? (
            <div style={{ padding: "16px 0", textAlign: "center", fontSize: 12, color: C.textSubtle }}>
              Noch keine Dokumente in dieser Stufe.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {lvl.docs.map((doc, docIdx) => (
                <div key={docIdx} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  border: `1px solid ${C.mono100}`, borderRadius: C.radiusMd,
                  padding: "7px 10px", background: C.mono25,
                }}>
                  <span style={{ flexShrink: 0 }}><DocFileIcon filename={doc} /></span>
                  <span style={{ flex: 1, fontSize: 12, color: C.textDefault, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc}</span>
                  <button
                    style={{ background: "none", border: "none", cursor: "pointer", color: C.textSubtle, padding: 0, flexShrink: 0, lineHeight: 1 }}
                    title="Entfernen"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Card footer — upload + (choose buyers for lvl 3) */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              style={{ ...btn.secondarySm, display: "flex", alignItems: "center", gap: 6 }}
              onClick={() => { setUploadLevel(lvl.num); fileInputRef.current?.click(); }}
            >
              <IconUpload />
              Mehr hochladen
            </button>
            {lvl.num === 3 && (
              <button style={btn.primarySm} onClick={openBuyerModal}>
                Käufer auswählen
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Access viewer modal */}
      {accessViewLevel !== null && (() => {
        const accessBuyers =
          accessViewLevel === 1 ? buyers :
          accessViewLevel === 2 ? buyers.filter((b) => !!b.phone) :
          buyers.filter((b) => level3AccessBuyerIds.has(b.id));
        const sortedAccess = [...accessBuyers].sort(
          (a, b) => (latestBidByBuyer.get(b.id)?.amount ?? 0) - (latestBidByBuyer.get(a.id)?.amount ?? 0)
        );
        const topId = sortedAccess[0]?.id;
        return (
          <div
            style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => setAccessViewLevel(null)}
          >
            <div
              style={{ background: "#fff", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", width: "100%", maxWidth: 420, margin: 16, overflow: "hidden" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 12px" }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#182024" }}>
                  {accessBuyers.length} Käufer:innen haben Zugriff
                </span>
                <button
                  style={{ background: "none", border: "none", cursor: "pointer", color: C.textSubtle, fontSize: 20, lineHeight: 1, padding: 0 }}
                  onClick={() => setAccessViewLevel(null)}
                >×</button>
              </div>
              <div style={{ padding: "0 20px 16px", fontSize: 13, color: "#73787A" }}>
                Diese Käufer:innen haben aktuell Zugriff auf die Dokumente:
              </div>

              {/* Buyer list */}
              <div style={{ border: `1px solid ${C.mono100}`, borderRadius: 8, margin: "0 20px 20px" }}>
                {sortedAccess.length === 0 ? (
                  <div style={{ padding: 20, textAlign: "center", fontSize: 13, color: C.textSubtle }}>Noch kein Zugriff gewährt.</div>
                ) : sortedAccess.map((buyer, idx) => {
                  const bid = latestBidByBuyer.get(buyer.id);
                  const isTop = buyer.id === topId && bid !== undefined;
                  const qualLvl = getBuyerQualLevel(buyer);
                  return (
                    <div
                      key={buyer.id}
                      style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
                        borderBottom: idx < sortedAccess.length - 1 ? `1px solid ${C.mono100}` : "none",
                      }}
                    >
                      <span style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#182024", fontWeight: 500 }}>
                        {buyer.name}
                        {(() => {
                          const lvlStyle: Record<1|2|3, { bg: string; border: string; color: string }> = {
                            1: { bg: "#FBF2EA", border: "#F0D5B0", color: "#B56100" },
                            2: { bg: "#EDF2FE", border: "#B8CCF5", color: "#3968C2" },
                            3: { bg: "#EAF3EE", border: "#A3D5B8", color: "#288352" },
                          };
                          const s = lvlStyle[qualLvl];
                          return (
                            <span style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 4, padding: "1px 6px", fontSize: 11, fontWeight: 600, color: s.color, display: "inline-flex", alignItems: "center", gap: 4 }}>
                              <IconShieldCheck color={s.color} />
                              {qualLvl}
                            </span>
                          );
                        })()}
                      </span>
                      {isTop && (
                        <span style={{ fontSize: 11, fontWeight: 600, background: "#1D4ED8", color: "#fff", borderRadius: 20, padding: "2px 8px", whiteSpace: "nowrap" }}>
                          Highest bid
                        </span>
                      )}
                      <span style={{ fontSize: 13, fontWeight: 700, color: isTop ? "#1D4ED8" : "#182024", whiteSpace: "nowrap" }}>
                        {bid ? formatCHF(bid.amount) : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px 20px" }}>
                <button
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: C.textDefault, fontWeight: 500 }}
                  onClick={() => setAccessViewLevel(null)}
                >
                  Abbrechen
                </button>
                <button
                  style={{ background: "#182024", color: "#fff", border: "none", borderRadius: 20, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                  onClick={() => setAccessViewLevel(null)}
                >
                  Schliessen
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Käufer auswählen modal */}
      {buyerModalOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setBuyerModalOpen(false)}
        >
          <div
            style={{ background: "#fff", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", width: "100%", maxWidth: 420, margin: 16, overflow: "hidden" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 12px" }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#182024" }}>Käufer auswählen</span>
              <button
                style={{ background: "none", border: "none", cursor: "pointer", color: C.textSubtle, fontSize: 20, lineHeight: 1, padding: 0 }}
                onClick={() => setBuyerModalOpen(false)}
              >×</button>
            </div>
            <div style={{ padding: "0 20px 16px", fontSize: 13, color: "#73787A" }}>
              Wähle die Käufer:innen aus, denen du Zugriff auf die Dokumente geben möchtest.
            </div>

            {/* Buyer list */}
            <div style={{ borderTop: `1px solid ${C.mono100}`, borderBottom: `1px solid ${C.mono100}` }}>
              {sortedModalBuyers.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", fontSize: 13, color: C.textSubtle }}>Noch keine Gebote vorhanden.</div>
              ) : sortedModalBuyers.map((buyer, idx) => {
                const bid = latestBidByBuyer.get(buyer.id);
                const checked = selectedBuyerIds.has(buyer.id);
                const isTop = buyer.id === topBuyerId;
                return (
                  <label
                    key={buyer.id}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "12px 20px",
                      borderBottom: idx < sortedModalBuyers.length - 1 ? `1px solid ${C.mono100}` : "none",
                      cursor: "pointer", background: "transparent",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleBuyer(buyer.id)}
                      style={{ width: 16, height: 16, flexShrink: 0, accentColor: "#182024" }}
                    />
                    <span style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#182024", fontWeight: 500 }}>
                      {buyer.name}
                      {isTop && (
                        <span style={{ fontSize: 11, fontWeight: 600, background: "#1D4ED8", color: "#fff", borderRadius: 20, padding: "2px 8px" }}>
                          Highest bid
                        </span>
                      )}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#182024", whiteSpace: "nowrap" }}>
                      {bid ? formatCHF(bid.amount) : "—"}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Modal footer */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px" }}>
              <button
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: C.textDefault, fontWeight: 500 }}
                onClick={() => setBuyerModalOpen(false)}
              >
                Abbrechen
              </button>
              <button
                style={{ background: "#182024", color: "#fff", border: "none", borderRadius: 20, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                onClick={saveBuyerAccess}
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && uploadLevel !== null) {
            addDocument(uploadLevel, file.name);
            showToast("Dokument hochgeladen.");
          }
          e.target.value = "";
          setUploadLevel(null);
        }}
      />

      {toast !== null && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 60,
          background: C.textDark, color: C.textWhite,
          borderRadius: C.radiusMd, padding: "10px 16px",
          fontSize: 13, fontWeight: 500,
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        }}>
          {toast}
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

function EinstellungenTab({ bidding, onBiddingChange: _onBiddingChange }: EinstellungenTabProps) {
  const effectiveStatus = getEffectiveStatus(bidding);
  const isLocked = effectiveStatus === "active" || effectiveStatus === "round2_active";

  const cardStyle: React.CSSProperties = {
    borderRadius: 8,
    border: "1px solid #E8E9E9",
    background: "#FFFFFF",
    padding: "20px 24px",
    marginBottom: 0,
  };

  const cardTitleRow = (title: string, action?: React.ReactNode) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: "#182024" }}>{title}</span>
      {action}
    </div>
  );

  const fieldRows = (rows: { label: string; value: React.ReactNode }[]) =>
    rows.map(({ label, value }, i) => (
      <div
        key={label}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 0",
          ...(i < rows.length - 1 ? { borderBottom: "1px solid #F0F1F1" } : {}),
        }}
      >
        <span style={{ fontSize: 13, color: "#73787A", fontWeight: 400 }}>{label}</span>
        <span style={{ fontSize: 13, color: "#182024", fontWeight: 400 }}>{value}</span>
      </div>
    ));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {isLocked && (
        <div style={{ borderRadius: 8, border: "1px solid #BFDBFE", background: "#EFF6FF", padding: "12px 16px", fontSize: 13, color: "#1E40AF", display: "flex", alignItems: "flex-start", gap: 8 }}>
          <span style={{ flexShrink: 0, marginTop: 1 }}><IconInfo /></span>
          <span>Einstellungen können während eines aktiven Verfahrens nicht geändert werden.</span>
        </div>
      )}

      {/* Card 1: Zusätzliche Informationen */}
      <div style={cardStyle}>
        {cardTitleRow(
          "Zusätzliche Informationen",
          <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#73787A", padding: 0 }} onClick={() => {}}>Bearbeiten</button>
        )}
        <p style={{ fontSize: 14, color: bidding.biddingRules ? "#182024" : "#73787A", margin: 0, lineHeight: 1.5 }}>
          {bidding.biddingRules || "Keine Informationen hinzugefügt."}
        </p>
      </div>

      {/* Card 2: Verfahren */}
      <div style={cardStyle}>
        {cardTitleRow("Verfahren")}
        {fieldRows([
          { label: "Vorlage",         value: "Standard" },
          { label: "Sichtbarkeit",    value: processTypeLabel(bidding.processType) },
          { label: "Rundenanzahl",    value: String(bidding.roundsPlanned) },
          { label: "Preisorientierung", value: priceDisplayLabel(bidding.priceDisplay) },
          { label: "Erstellt",        value: bidding.createdAt ? formatDate(bidding.createdAt) : "—" },
        ])}
      </div>

      {/* Card 3: Objekt */}
      <div style={cardStyle}>
        {cardTitleRow("Objekt")}
        {fieldRows([
          { label: "Titel",   value: bidding.title || "—" },
          { label: "Adresse", value: bidding.address || "—" },
          {
            label: "Externer Link",
            value: bidding.websiteUrl
              ? <span style={{ fontSize: 13, color: "#2563EB", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 260 }}>{bidding.websiteUrl}</span>
              : "—",
          },
        ])}
      </div>

      {/* Card 4: Smart Matching (conditional) */}
      {bidding.smartMatching && (
        <div style={cardStyle}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <img src={smartMatchingIllustration} alt="" style={{ height: 120, width: "auto", flexShrink: 0 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#182024" }}>Smart Matching aktiviert</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  "Erweitert die Reichweite deines Inserats",
                  "Empfiehlt dein Objekt passenden Käufer:innen",
                  "Spare CHF 60 beim Abschluss",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#182024" }}>
                    <span style={{ color: "#2563EB", fontWeight: 700 }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 13, color: "#182024", marginTop: 4 }}>
                Bei Abschluss:{" "}
                <span style={{ color: "#2563EB", fontWeight: 600 }}>CHF 290</span>{" "}
                <span style={{ textDecoration: "line-through", color: "#73787A" }}>CHF 350</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Warning modal (simple, reusable) ────────────────────────────────────────

interface WarningModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  body: string;
  confirmLabel: string;
}

function WarningModal({ open, onClose, onConfirm, title, body, confirmLabel }: WarningModalProps) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }}>
      <div style={{ width: "100%", maxWidth: 400, borderRadius: C.radiusLg, background: C.bgPage, border: `1px solid ${C.mono100}`, padding: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
        <h2 style={{ marginBottom: 10, fontSize: 16, fontWeight: 700, color: C.textDark }}>{title}</h2>
        <p style={{ marginBottom: 24, fontSize: 13, color: C.textSubtle }}>{body}</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button style={btn.secondary} onClick={onClose}>Abbrechen</button>
          <button
            style={{ ...btn.primary, background: C.textError }}
            onClick={() => { onConfirm(); onClose(); }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Round2WizardModal (3 steps) ──────────────────────────────────────────────

interface Round2WizardProps {
  open: boolean;
  onClose: () => void;
  buyers: WorkspaceBuyer[];
  uniqueBids: GridbidOffer[];
  onConfirm: (invitedIds: string[], deadline: string, transparency: "rank" | "blind") => void;
}

function Round2WizardModal({ open, onClose, buyers, uniqueBids, onConfirm }: Round2WizardProps) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set(uniqueBids.map(b => b.participantId)));
  const [deadline, setDeadline] = useState("");
  const [transparency, setTransparency] = useState<"rank" | "blind">("rank");

  // Reset on open
  React.useEffect(() => {
    if (open) {
      setStep(0);
      setSelected(new Set(uniqueBids.map(b => b.participantId)));
      setDeadline("");
      setTransparency("rank");
    }
  }, [open, uniqueBids]);

  if (!open) return null;

  const sortedBids = [...uniqueBids].sort((a, b) => b.amount - a.amount);
  const selectedIds = Array.from(selected);
  const invitedNames = selectedIds
    .map(id => buyers.find(b => b.id === id)?.name ?? id)
    .join(", ");

  const steps = ["Käufer:innen", "Frist & Transparenz", "Bestätigung"];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }}>
      <div style={{ width: "100%", maxWidth: 520, borderRadius: C.radiusLg, background: C.bgPage, border: `1px solid ${C.mono100}`, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "20px 24px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.textDark, margin: 0 }}>Runde 2 starten</h2>
            <button style={{ ...btn.ghost, padding: 4 }} onClick={onClose}>✕</button>
          </div>
          {/* Step indicator */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700,
                  background: i <= step ? VIOLET.text : C.mono100,
                  color: i <= step ? "white" : C.textSubtle,
                }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 12, color: i === step ? C.textDark : C.textSubtle, fontWeight: i === step ? 600 : 400 }}>{s}</span>
                {i < steps.length - 1 && <span style={{ color: C.mono300, fontSize: 11 }}>›</span>}
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div style={{ height: 2, background: C.mono100, borderRadius: 1, marginBottom: 0 }}>
            <div style={{ height: 2, background: VIOLET.text, borderRadius: 1, width: `${((step + 1) / steps.length) * 100}%`, transition: "width 0.2s" }} />
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: 24 }}>
          {step === 0 && (
            <div>
              <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={T.label}>BIETENDE AUSWÄHLEN</span>
                <span style={{ fontSize: 12, color: C.textSubtle }}>{selected.size} von {sortedBids.length} eingeladen</span>
              </div>
              <div style={{ border: `1px solid ${C.mono100}`, borderRadius: C.radiusMd, overflow: "hidden" }}>
                {sortedBids.map((bid, idx) => {
                  const name = buyers.find(b => b.id === bid.participantId)?.name ?? bid.participantId;
                  const checked = selected.has(bid.participantId);
                  return (
                    <label key={bid.participantId} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: idx < sortedBids.length - 1 ? `1px solid ${C.mono100}` : "none", cursor: "pointer", background: checked ? VIOLET.bg : "transparent" }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={e => {
                          setSelected(prev => {
                            const next = new Set(prev);
                            if (e.target.checked) next.add(bid.participantId);
                            else next.delete(bid.participantId);
                            return next;
                          });
                        }}
                        style={{ width: 16, height: 16, accentColor: VIOLET.text, cursor: "pointer" }}
                      />
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, fontWeight: 600, flexShrink: 0,
                          background: idx === 0 ? C.textDark : "transparent",
                          border: idx === 0 ? "none" : `1px solid ${C.mono300}`,
                          color: idx === 0 ? "white" : C.textSubtle,
                        }}>{idx + 1}</div>
                        <span style={{ fontSize: 14, fontWeight: 500, color: C.textDark }}>{name}</span>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 500, color: C.textDark, flexShrink: 0 }}>
                        {formatCHF(bid.amount)}
                      </span>
                    </label>
                  );
                })}
              </div>
              {selected.size === 0 && (
                <div style={{ marginTop: 8, fontSize: 12, color: C.textError }}>Mindestens 1 Bieter:in auswählen</div>
              )}
            </div>
          )}

          {step === 1 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 600, color: C.textDefault }}>Neue Frist</label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  style={{ width: "100%", borderRadius: C.radiusMd, border: `1px solid ${C.mono300}`, padding: "8px 12px", fontSize: 13, color: C.textDefault, outline: "none", boxSizing: "border-box" }}
                  onFocus={e => (e.currentTarget.style.borderColor = VIOLET.text)}
                  onBlur={e => (e.currentTarget.style.borderColor = C.mono300)}
                />
              </div>
              <div>
                <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 600, color: C.textDefault }}>Transparenz</div>
                {(["rank", "blind"] as const).map(opt => (
                  <label key={opt} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: C.radiusMd, border: `1px solid ${transparency === opt ? VIOLET.text : C.mono100}`, background: transparency === opt ? VIOLET.bg : "transparent", cursor: "pointer", marginBottom: 8 }}>
                    <input type="radio" name="transparency" value={opt} checked={transparency === opt} onChange={() => setTransparency(opt)} style={{ marginTop: 2, accentColor: VIOLET.text }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.textDark }}>
                        {opt === "rank" ? "Rang sichtbar" : "Blind"}
                      </div>
                      <div style={{ fontSize: 12, color: C.textSubtle, marginTop: 1 }}>
                        {opt === "rank" ? "Käufer:innen sehen ihren Rang, aber keine anderen Beträge" : "Käufer:innen wissen nur, dass sie eingeladen sind"}
                      </div>
                    </div>
                  </label>
                ))}
                <div style={{ fontSize: 12, color: C.textSubtle, marginTop: 4 }}>
                  Diese Einstellung gilt für alle eingeladenen Käufer:innen dieser Runde.
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ ...T.label, marginBottom: 12 }}>ZUSAMMENFASSUNG</div>
              <div style={{ border: `1px solid ${C.mono100}`, borderRadius: C.radiusMd, overflow: "hidden" }}>
                {[
                  { label: "Eingeladene Bieter:innen", value: invitedNames },
                  { label: "Neue Frist", value: deadline ? fmtRound2Deadline(deadline) : "—" },
                  { label: "Transparenz", value: transparency === "rank" ? "Rang sichtbar" : "Blind" },
                ].map(({ label, value }, i) => (
                  <div key={label} style={{ display: "flex", gap: 16, padding: "12px 16px", borderBottom: i < 2 ? `1px solid ${C.mono100}` : "none" }}>
                    <span style={{ fontSize: 12, color: C.textSubtle, flexShrink: 0, minWidth: 160 }}>{label}</span>
                    <span style={{ fontSize: 13, color: C.textDark, fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: C.textSubtle }}>
                Nicht eingeladene Käufer:innen erhalten eine Benachrichtigung, dass das Verfahren für sie abgeschlossen ist.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "0 24px 20px", display: "flex", justifyContent: "space-between" }}>
          <button style={btn.ghost} onClick={step === 0 ? onClose : () => setStep(s => s - 1)}>
            {step === 0 ? "Abbrechen" : "← Zurück"}
          </button>
          {step < 2 ? (
            <button
              style={{ background: VIOLET.text, color: "white", border: "none", borderRadius: C.radiusMd, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: selected.size === 0 || (step === 1 && !deadline) ? "not-allowed" : "pointer", opacity: selected.size === 0 || (step === 1 && !deadline) ? 0.4 : 1 }}
              disabled={selected.size === 0 || (step === 1 && !deadline)}
              onClick={() => setStep(s => s + 1)}
            >
              Weiter →
            </button>
          ) : (
            <button
              style={{ background: VIOLET.text, color: "white", border: "none", borderRadius: C.radiusMd, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              onClick={() => {
                onConfirm(Array.from(selected), new Date(deadline).toISOString(), transparency);
                onClose();
              }}
            >
              Runde 2 aktivieren
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CloseWizardModal (2 steps) ───────────────────────────────────────────────

const OTHER_WINNER = "__other__";

interface CloseWizardProps {
  open: boolean;
  onClose: () => void;
  buyers: WorkspaceBuyer[];
  uniqueBids: GridbidOffer[];
  onConfirm: (winnerId: string | null, winnerName: string | null, finalPrice: number) => void;
}

function CloseWizardModal({ open, onClose, buyers, uniqueBids, onConfirm }: CloseWizardProps) {
  const [step, setStep] = useState(0);
  const sortedBids = [...uniqueBids].sort((a, b) => b.amount - a.amount);
  const [winnerId, setWinnerId] = useState(sortedBids[0]?.participantId ?? "");
  const [otherName, setOtherName] = useState("");
  const [finalPrice, setFinalPrice] = useState<number | "">(sortedBids[0]?.amount ?? "");

  React.useEffect(() => {
    if (open) {
      setStep(0);
      const top = [...uniqueBids].sort((a, b) => b.amount - a.amount)[0];
      setWinnerId(top?.participantId ?? "");
      setOtherName("");
      setFinalPrice(top?.amount ?? "");
    }
  }, [open, uniqueBids]);

  if (!open) return null;

  const isOther = winnerId === OTHER_WINNER;
  const displayName = isOther
    ? (otherName.trim() || "Käufer:in unbekannt")
    : (buyers.find(b => b.id === winnerId)?.name ?? "—");
  const steps = ["Käufer:in", "Finalbetrag"];
  const priceValid = finalPrice !== "" && Number(finalPrice) > 0;

  function handleWinnerChange(id: string) {
    setWinnerId(id);
    if (id !== OTHER_WINNER) {
      const bid = uniqueBids.find(b => b.participantId === id);
      setFinalPrice(bid?.amount ?? "");
    } else {
      setFinalPrice("");
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }}>
      <div style={{ width: "100%", maxWidth: 480, borderRadius: C.radiusLg, background: C.bgPage, border: `1px solid ${C.mono100}`, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "20px 24px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.textDark, margin: 0 }}>Verfahren abschliessen</h2>
            <button style={{ ...btn.ghost, padding: 4 }} onClick={onClose}>✕</button>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700,
                  background: i <= step ? C.textDark : C.mono100,
                  color: i <= step ? "white" : C.textSubtle,
                }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 12, color: i === step ? C.textDark : C.textSubtle, fontWeight: i === step ? 600 : 400 }}>{s}</span>
                {i < steps.length - 1 && <span style={{ color: C.mono300, fontSize: 11 }}>›</span>}
              </div>
            ))}
          </div>
          <div style={{ height: 2, background: C.mono100, borderRadius: 1, marginBottom: 0 }}>
            <div style={{ height: 2, background: C.textDark, borderRadius: 1, width: `${((step + 1) / steps.length) * 100}%`, transition: "width 0.2s" }} />
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: 24 }}>
          {step === 0 && (
            <div>
              <div style={{ ...T.label, marginBottom: 12 }}>WER ERHÄLT DEN ZUSCHLAG?</div>
              <div style={{ border: `1px solid ${C.mono100}`, borderRadius: C.radiusMd, overflow: "hidden" }}>
                {sortedBids.map((bid, idx) => {
                  const name = buyers.find(b => b.id === bid.participantId)?.name ?? bid.participantId;
                  const checked = winnerId === bid.participantId;
                  return (
                    <label key={bid.participantId} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: `1px solid ${C.mono100}`, cursor: "pointer", background: checked ? C.bgSurface : "transparent" }}>
                      <input type="radio" name="winner" checked={checked} onChange={() => handleWinnerChange(bid.participantId)} style={{ accentColor: C.textDark }} />
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: C.textDark }}>{name}</span>
                      <span style={{ fontSize: 14, color: C.textDark }}>{formatCHF(bid.amount)}</span>
                    </label>
                  );
                })}
                <label style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer", background: isOther ? C.bgSurface : "transparent" }}>
                  <input type="radio" name="winner" checked={isOther} onChange={() => handleWinnerChange(OTHER_WINNER)} style={{ accentColor: C.textDark }} />
                  <span style={{ flex: 1, fontSize: 14, color: C.textSubtle, fontStyle: "italic" }}>Andere Person (nicht im System)</span>
                </label>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              {isOther && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 600, color: C.textDefault }}>
                    Name der Käufer:in <span style={{ fontWeight: 400, color: C.textSubtle }}>(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={otherName}
                    onChange={e => setOtherName(e.target.value)}
                    placeholder="z.B. Markus Berger"
                    style={{ width: "100%", borderRadius: C.radiusMd, border: `1px solid ${C.mono300}`, padding: "8px 12px", fontSize: 13, color: C.textDefault, outline: "none", boxSizing: "border-box" }}
                    onFocus={e => (e.currentTarget.style.borderColor = C.textInfo)}
                    onBlur={e => (e.currentTarget.style.borderColor = C.mono300)}
                  />
                </div>
              )}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 600, color: C.textDefault }}>Vereinbarter Kaufpreis (CHF)</label>
                <input
                  type="number"
                  value={finalPrice}
                  onChange={e => setFinalPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="z.B. 1500000"
                  style={{ width: "100%", borderRadius: C.radiusMd, border: `1px solid ${C.mono300}`, padding: "8px 12px", fontSize: 13, color: C.textDefault, outline: "none", boxSizing: "border-box", fontFamily: "DM Sans, sans-serif" }}
                  onFocus={e => (e.currentTarget.style.borderColor = C.textInfo)}
                  onBlur={e => (e.currentTarget.style.borderColor = C.mono300)}
                />
              </div>
              <div style={{ background: C.bgSurface, borderRadius: C.radiusMd, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.textDark }}>{displayName}</span>
                <span style={{ fontSize: 18, fontWeight: 600, color: priceValid ? C.textDark : C.textSubtle }}>
                  {priceValid ? formatCHF(Number(finalPrice)) : "—"}
                </span>
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: C.textSubtle }}>
                Alle anderen Bietenden werden benachrichtigt, dass das Verfahren abgeschlossen ist.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "0 24px 20px", display: "flex", justifyContent: "space-between" }}>
          <button style={btn.ghost} onClick={step === 0 ? onClose : () => setStep(s => s - 1)}>
            {step === 0 ? "Abbrechen" : "← Zurück"}
          </button>
          {step < 1 ? (
            <button
              style={{ ...btn.primary, opacity: winnerId ? 1 : 0.4 }}
              disabled={!winnerId}
              onClick={() => setStep(1)}
            >
              Weiter →
            </button>
          ) : (
            <button
              style={{ ...btn.success, opacity: priceValid ? 1 : 0.4 }}
              disabled={!priceValid}
              onClick={() => {
                onConfirm(
                  isOther ? null : winnerId,
                  isOther ? (otherName.trim() || null) : null,
                  Number(finalPrice),
                );
                onClose();
              }}
            >
              Zuschlag erteilen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── (legacy export kept for any external consumers) ──────────────────────────
export function Round2Modal({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: (d: string) => void }) {
  if (!open) return null;
  return <Round2WizardModal open={open} onClose={onClose} buyers={[]} uniqueBids={[]} onConfirm={(_ids, deadline) => onConfirm(deadline)} />;
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

// ─── Detail sidebar ───────────────────────────────────────────────────────────

interface DetailSidebarProps {
  bidding: WorkspaceBidding;
  effectiveStatus: EffectiveStatus;
  uniqueBids: GridbidOffer[];
  onOpenRound2: () => void;
  onOpenClose: () => void;
}

function DetailSidebar({ bidding, effectiveStatus, uniqueBids, onOpenRound2, onOpenClose }: DetailSidebarProps) {
  const currentRoundNum = bidding.round2Deadline ? 2 : 1;
  const activeDeadline = bidding.round2Deadline ?? bidding.deadline;
  const isActive = effectiveStatus === "active" || effectiveStatus === "round2_active";

  const countdown = activeDeadline ? formatTimeRemaining(activeDeadline) : null;

  let progressPct = 0;
  if (activeDeadline) {
    const roundStartMs = currentRoundNum === 2 && bidding.deadline
      ? new Date(bidding.deadline).getTime()
      : new Date(bidding.createdAt).getTime();
    const roundEndMs = new Date(activeDeadline).getTime();
    const nowMs = Date.now();
    progressPct = Math.min(100, Math.max(0, ((nowMs - roundStartMs) / (roundEndMs - roundStartMs)) * 100));
  }

  let guidanceText: string;
  if (effectiveStatus === "active") {
    guidanceText = `Frist läuft ab am ${bidding.deadline ? formatDate(bidding.deadline) : "—"}. Danach kannst du Runde 2 starten oder das Verfahren abschliessen.`;
  } else if (effectiveStatus === "deadline_passed" && bidding.roundsPlanned >= 2) {
    guidanceText = "Frist abgelaufen. Starte Runde 2 für ausgewählte Bieter:innen oder schliesse das Verfahren jetzt ab.";
  } else if (effectiveStatus === "deadline_passed") {
    guidanceText = "Frist abgelaufen. Nimm das beste Angebot an oder schliesse das Verfahren ab.";
  } else if (effectiveStatus === "round2_active") {
    guidanceText = "Runde 2 läuft. Sobald die Frist abgelaufen ist, kannst du das Verfahren abschliessen.";
  } else if (effectiveStatus === "round2_deadline_passed") {
    guidanceText = "Runde 2 abgelaufen. Schliesse das Verfahren ab und erteile den Zuschlag.";
  } else if (effectiveStatus === "closed") {
    guidanceText = "Verfahren abgeschlossen.";
  } else {
    guidanceText = "Entwurf — aktiviere das Verfahren, um den Prozess zu starten.";
  }

  const showRound2Btn = effectiveStatus === "active" || effectiveStatus === "deadline_passed";
  const showCloseBtn = effectiveStatus === "active" || effectiveStatus === "deadline_passed" || effectiveStatus === "round2_active" || effectiveStatus === "round2_deadline_passed";

  const roundLabel = `Runde ${currentRoundNum} von ${bidding.roundsPlanned}`;

  return (
    <div style={{
      position: "sticky",
      top: 57,
      alignSelf: "flex-start",
      width: 280,
      flexShrink: 0,
      borderLeft: `1px solid ${C.mono100}`,
      padding: "24px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 16,
      background: C.bgPage,
      maxHeight: "calc(100vh - 57px)",
      overflowY: "auto",
      minHeight: "calc(100vh - 57px)",
    }}>
      {/* Round + status badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.textSubtle }}>{roundLabel}</span>
        {isActive && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: C.textSuccess, background: C.bgSuccess, borderRadius: C.radiusMd, padding: "2px 8px", border: `1px solid #BBF7D0` }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.textSuccess, display: "inline-block" }} />
            Aktiv
          </span>
        )}
        {effectiveStatus === "closed" && (
          <span style={{ ...badge.success, fontSize: 11 }}>Abgeschlossen</span>
        )}
      </div>

      {/* Time remaining */}
      {countdown && (
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.textDark, lineHeight: 1.2 }}>
            {countdown}
          </div>
          {activeDeadline && (
            <div style={{ marginTop: 4, fontSize: 12, color: C.textInfo }}>
              Endet: {new Date(activeDeadline).toLocaleDateString("de-CH", { day: "numeric", month: "short", year: "numeric" })}
            </div>
          )}
        </div>
      )}
      {!countdown && effectiveStatus === "closed" && (
        <div style={{ fontSize: 13, fontWeight: 600, color: C.textSuccess }}>Abgeschlossen</div>
      )}

      {/* Progress bar */}
      {activeDeadline && (
        <div style={{ height: 6, background: C.mono100, borderRadius: 3 }}>
          <div style={{ height: 6, background: C.textInfo, borderRadius: 3, width: `${progressPct}%`, transition: "width 0.3s" }} />
        </div>
      )}

      {/* Divider */}
      <div style={{ height: 1, background: "#E8E9E9", margin: "0 -20px" }} />

      {/* Info note */}
      <div style={{ display: "flex", gap: 6, alignItems: "flex-start", fontSize: 12, color: C.textSubtle }}>
        <span style={{ flexShrink: 0, marginTop: 1 }}><IconInfo /></span>
        <span style={{ lineHeight: 1.5 }}>{guidanceText}</span>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {showRound2Btn && (
          <button style={{ ...btn.primary, width: "100%", textAlign: "center" }} onClick={onOpenRound2}>
            Runde 2 starten
          </button>
        )}
        {showCloseBtn && (
          <button style={{ ...btn.secondary, width: "100%", textAlign: "center" }} onClick={onOpenClose}>
            Verfahren abschliessen
          </button>
        )}
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
  const [round2WizardOpen, setRound2WizardOpen] = useState(false);
  const [round2WarningOpen, setRound2WarningOpen] = useState(false);
  const [closeWizardOpen, setCloseWizardOpen] = useState(false);
  const [closeWarningOpen, setCloseWarningOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleBiddingChange(updated: WorkspaceBidding) {
    setBidding(updated);
    onBiddingChange(updated);
  }

  function handleOpenRound2() {
    const eff = getEffectiveStatus(bidding);
    if (eff === "active") setRound2WarningOpen(true);
    else setRound2WizardOpen(true);
  }

  function handleOpenClose() {
    const eff = getEffectiveStatus(bidding);
    if (eff === "active" || eff === "round2_active") setCloseWarningOpen(true);
    else setCloseWizardOpen(true);
  }

  function handleRound2Confirm(invitedIds: string[], deadline: string, transparency: "rank" | "blind") {
    handleBiddingChange({
      ...bidding,
      status: BiddingStatus.ACTIVE,
      round2Deadline: deadline,
      round2InvitedBuyerIds: invitedIds,
      round2Transparency: transparency,
      currentRound: 2,
      // End round 1 deadline if still running
      deadline: new Date(bidding.deadline ?? 0) > new Date() ? new Date(Date.now() - 1000).toISOString() : bidding.deadline,
    });
  }

  function handleCloseConfirm(winnerId: string | null, winnerName: string | null, finalPrice: number) {
    handleBiddingChange({ ...bidding, status: BiddingStatus.CLOSED, winnerId, winnerName, finalPrice });
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
    { key: "bids",       label: "Angebote" },
    { key: "documents",  label: "Dokumente" },
    { key: "settings",   label: "Einstellungen" },
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
    <div style={{ display: "flex", flexDirection: "column", background: C.bgPage }}>
      {/* Global top bar — sticky */}
      <header style={{ position: "sticky", top: 0, zIndex: 40, display: "flex", height: 56, flexShrink: 0, alignItems: "center", justifyContent: "space-between", background: C.bgPage, padding: "0 24px", borderBottom: `1px solid ${C.mono100}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <GridBidLogoIcon />
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em", color: C.textDark }}>GridBid</span>
        </div>
        <AvatarDropdown />
      </header>

      {/* Two-column layout: left column (all content) + right sidebar (sticky) */}
      <div style={{ display: "flex", alignItems: "stretch" }}>

        {/* ── Left column ─────────────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Property header */}
          <div style={{ background: C.bgPage, padding: "16px 24px 20px", flexShrink: 0 }}>
            <div style={{ maxWidth: 896, margin: "0 auto" }}>

              {/* Back link row with ⋮ on far right */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <button
                  onClick={onBack}
                  style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: C.textSubtle, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.textDark)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.textSubtle)}
                >
                  ← Zurück zur Übersicht
                </button>
                <button
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 8px", fontSize: 20, color: C.textSubtle, lineHeight: 1, borderRadius: C.radiusMd }}
                  title="Weitere Optionen"
                  aria-label="Weitere Optionen"
                >
                  ⋮
                </button>
              </div>

              {/* Property image + title */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
                {bidding.imageUrl ? (
                  <img src={bidding.imageUrl} alt="" style={{ height: 48, width: 66, flexShrink: 0, borderRadius: C.radiusLg, objectFit: "cover" }} />
                ) : (
                  <div style={{ display: "flex", height: 48, width: 66, flexShrink: 0, alignItems: "center", justifyContent: "center", borderRadius: C.radiusLg, background: C.mono50, color: C.mono300 }}>
                    <IconHousePlaceholder />
                  </div>
                )}
                <div>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 700, color: C.textDark, margin: 0 }}>
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

              {/* Public link bar — compact secondary style */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, borderRadius: C.radiusMd, background: C.mono25, padding: "7px 12px" }}>
                <span style={{ display: "flex", flexShrink: 0, alignItems: "center", gap: 4, fontSize: 12, color: C.textSubtle }}>
                  <IconInfo />
                  Öffentlicher Link
                </span>
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12, color: C.textSubtle }}>
                  {publicUrl}
                </span>
                <button
                  onClick={copyUrl}
                  style={{ fontSize: 12, fontWeight: 500, color: C.textDefault, background: C.bgPage, border: `1px solid ${C.mono300}`, borderRadius: C.radiusMd, padding: "3px 10px", cursor: "pointer", flexShrink: 0 }}
                >
                  {copied ? "Kopiert!" : "Kopieren"}
                </button>
              </div>
            </div>
          </div>

          {/* Tab navigation */}
          <div style={{ background: C.bgPage, padding: "0 24px", flexShrink: 0 }}>
            <div style={{ maxWidth: 896, margin: "0 auto", display: "flex", borderBottom: `1px solid ${C.mono100}` }}>
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
          <div style={{ padding: "24px" }}>
            <div style={{ maxWidth: 896, margin: "0 auto", width: "100%" }}>
              {activeTab === "bids" && (
                <AngeboteTab
                  bidding={bidding}
                  buyers={registeredBuyers}
                  propBids={propBids}
                  uniqueBids={uniqueBids}
                  onBiddingChange={handleBiddingChange}
                  onOpenRound2Modal={handleOpenRound2}
                  onOpenEndDeadlineModal={handleOpenClose}
                  onAccept={setAcceptModal}
                  onOpenCloseWizard={handleOpenClose}
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

        </div>{/* end left column */}

        {/* Right sidebar — full height from below navbar */}
        <DetailSidebar
          bidding={bidding}
          effectiveStatus={effectiveStatus}
          uniqueBids={uniqueBids}
          onOpenRound2={handleOpenRound2}
          onOpenClose={handleOpenClose}
        />

      </div>{/* end two-column */}

      {/* Modals */}
      <WarningModal
        open={round2WarningOpen}
        onClose={() => setRound2WarningOpen(false)}
        onConfirm={() => setRound2WizardOpen(true)}
        title="Runde 1 läuft noch"
        body={`Runde 1 läuft noch bis ${bidding.deadline ? fmtDT(bidding.deadline) : "—"}. Wenn du jetzt startest, wird Runde 1 beendet.`}
        confirmLabel="Runde 1 beenden & weiter"
      />

      <Round2WizardModal
        open={round2WizardOpen}
        onClose={() => setRound2WizardOpen(false)}
        buyers={registeredBuyers}
        uniqueBids={uniqueBids}
        onConfirm={handleRound2Confirm}
      />

      <WarningModal
        open={closeWarningOpen}
        onClose={() => setCloseWarningOpen(false)}
        onConfirm={() => setCloseWizardOpen(true)}
        title="Verfahren läuft noch"
        body={`Die Deadline läuft noch bis ${getEffectiveStatus(bidding) === "round2_active" && bidding.round2Deadline ? fmtDT(bidding.round2Deadline) : bidding.deadline ? fmtDT(bidding.deadline) : "—"}. Bist du sicher, dass du das Bieterverfahren jetzt beenden möchtest? Diese Aktion kann nicht rückgängig gemacht werden.`}
        confirmLabel="Trotzdem beenden"
      />

      <CloseWizardModal
        open={closeWizardOpen}
        onClose={() => setCloseWizardOpen(false)}
        buyers={registeredBuyers}
        uniqueBids={uniqueBids}
        onConfirm={(wId, wName, price) => handleCloseConfirm(wId, wName, price)}
      />

      {acceptModal !== null && (
        <AcceptModal
          participantId={acceptModal}
          buyers={registeredBuyers}
          uniqueBids={uniqueBids}
          onConfirm={(id) => {
            handleBiddingChange({ ...bidding, status: BiddingStatus.CLOSED, winnerId: id, winnerName: null, finalPrice: uniqueBids.find(b => b.participantId === id)?.amount ?? null });
          }}
          onClose={() => setAcceptModal(null)}
        />
      )}
    </div>
  );
}

export default PropertyWorkspace;
