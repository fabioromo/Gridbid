import React, { useEffect, useState } from "react";
import { ProcessType, PriceDisplay, type CreateDraftInput } from "../types/domain";
import { formatDeadline } from "../utils/labels";

type UserPlan = "standard" | "pro" | "enterprise";

interface StepActivateProps {
  draft: CreateDraftInput;
  activating: boolean;
  userPlan?: UserPlan;
  propertyImage?: string | null;
  termsAccepted: boolean;
  onTermsChange: (v: boolean) => void;
  onBack: () => void;
  onGoToStep: (step: number) => void;
  onDeadlineChange: (deadline: string | null) => void;
  onSaveAndActivate: () => void;
  onSaveAsDraft: () => void;
}

const SMART_MATCHING_BULLETS = [
  "Erhöht die Reichweite deines Verfahrens",
  "Schlägt dein Objekt passenden Kaufinteressenten vor",
  "Spart CHF 60 bei Abschluss",
];

const NACH_DEM_START = [
  "Das Verfahren ist sofort aktiv — Interessenten können sich registrieren.",
  "Gebote sind nur für dich sichtbar, nicht für andere Bieter.",
  "Du kannst das Verfahren jederzeit pausieren oder beenden.",
];

function detectPresetLabel(draft: CreateDraftInput): string {
  const pt = draft.processType ?? ProcessType.SEALED_BID;
  const r = draft.roundsPlanned ?? 1;
  const pd = draft.priceDisplay ?? PriceDisplay.HIDDEN;
  if (pt === ProcessType.SEALED_BID && r === 1 && pd === PriceDisplay.HIDDEN) return "Standard";
  if (pt === ProcessType.SEALED_BID && r === 1 && pd === PriceDisplay.PRICE) return "Preisgeführt";
  if (pt === ProcessType.SEALED_BID && r === 2 && pd === PriceDisplay.HIDDEN) return "Mehrstufig";
  return "Custom";
}

function visibilityLabel(processType: ProcessType | undefined): string {
  return processType === ProcessType.OPEN_BID ? "Offen" : "Verdeckt";
}

function priceGuidanceLabel(priceDisplay: PriceDisplay | undefined): string {
  if (priceDisplay === PriceDisplay.PRICE) return "Ja (Richtpreis)";
  if (priceDisplay === PriceDisplay.RANGE) return "Ja (Spanne)";
  return "Nein";
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const ExternalLinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M5 2H2C1.45 2 1 2.45 1 3V10C1 10.55 1.45 11 2 11H9C9.55 11 10 10.55 10 10V7" stroke="#182024" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M7.5 1H11V4.5" stroke="#182024" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 1L6 6" stroke="#182024" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M1.5 6.5L4.5 9.5L10.5 3" stroke="#182024" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIconWhite = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M1.5 6.5L4.5 9.5L10.5 3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RoadmapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M2 12L5.5 4L9 8.5L11.5 5.5L14 12H2Z" stroke="#182024" strokeWidth="1.2" strokeLinejoin="round" />
    <circle cx="11.5" cy="4" r="1.5" stroke="#182024" strokeWidth="1.2" />
  </svg>
);

const PropertyPlaceholderIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="1" stroke="#c4c4c4" strokeWidth="1.4" />
    <circle cx="8" cy="9" r="2" stroke="#c4c4c4" strokeWidth="1.4" />
    <path d="M2 16L7 11L11 14.5L15 10.5L22 16" stroke="#c4c4c4" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);

// ── Smart Matching Artwork ─────────────────────────────────────────────────────

const SmartMatchingArtwork = () => (
  <div className="w-[180px] self-stretch bg-[#dae6fd] flex items-center justify-center overflow-hidden relative shrink-0">
    <svg width="100" height="98" viewBox="0 0 100 98" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="16.8555" y="17.6004" width="63.1298" height="80.1069" fill="#182024" stroke="#182024" strokeWidth="0.56425" strokeLinejoin="round"/>
      <rect x="13.436" y="63.5928" width="63.1642" height="30.729" fill="white" stroke="#182024" strokeWidth="0.56425" strokeLinejoin="round"/>
      <rect x="18.2031" y="77.3943" width="53.5945" height="1.1285" fill="#182024" stroke="#182024" strokeWidth="0.56425" strokeLinejoin="round"/>
      <rect x="18.2031" y="81.9084" width="53.5945" height="1.1285" fill="#182024" stroke="#182024" strokeWidth="0.56425" strokeLinejoin="round"/>
      <rect x="18.2031" y="86.4223" width="35.408" height="1.1285" fill="#182024" stroke="#182024" strokeWidth="0.56425" strokeLinejoin="round"/>
      <rect x="13.436" y="14.2149" width="63.1643" height="49.3779" fill="#4782F3" stroke="#182024" strokeWidth="0.56425" strokeLinejoin="round"/>
      <path d="M63.8823 63.6277C63.8823 60.0766 66.7659 57.1979 70.323 57.1979C72.5962 57.1979 74.5943 58.3735 75.7406 60.149C76.0107 60.0138 76.2987 59.9089 76.6001 59.839C76.6001 61.1019 76.6001 62.3648 76.6001 63.6277H63.8823Z" fill="#DAE6FD" stroke="#182024" strokeWidth="0.56425" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M74.4663 61.1815C75.0004 60.5232 75.7454 60.0424 76.5987 59.8417" stroke="#182024" strokeWidth="0.56425" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="17.4214" y="47.4627" width="20.1339" height="16.1649" fill="white" stroke="#182024" strokeWidth="0.56425" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M71.0008 34.2989V63.6275H37.5552V34.2989L54.278 23.4223L71.0008 34.2989Z" fill="white" stroke="#182024" strokeWidth="0.56425" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="56.0728" y="51.5466" width="10.7191" height="12.081" fill="white" stroke="#182024" strokeWidth="0.56425" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M63.8921 55.9987L63.8921 59.1753" stroke="#182024" strokeWidth="0.56425" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="58.2368" y="51.5466" width="6.39087" height="12.081" fill="#4782F3" stroke="#182024" strokeWidth="0.56425" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M62.8984 55.9987L62.8984 59.1753" stroke="#182024" strokeWidth="0.56425" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M27.4881 20.1805L34.8233 45.8465H20.1528L27.4881 20.1805Z" fill="#DAE6FD" stroke="#182024" strokeWidth="0.56425" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M27.5151 31.3702L27.5151 45.4739" stroke="#182024" strokeWidth="0.56425" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M30.0779 41.0294L27.5142 42.8103" stroke="#182024" strokeWidth="0.56425" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M24.9351 37.204L27.5145 39.0007" stroke="#182024" strokeWidth="0.56425" strokeLinecap="round" strokeLinejoin="round"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M54.2774 23.2269L36.4722 34.534V38.309L54.2774 27.002V23.2269ZM54.2777 23.2269L72.0829 34.534V38.309L54.2777 27.002V23.2269Z" fill="#DAE6FD"/>
      <path d="M36.4722 34.534L36.3209 34.2958C36.2394 34.3476 36.19 34.4374 36.19 34.534H36.4722ZM54.2774 23.2269H54.5596C54.5596 23.124 54.5035 23.0293 54.4133 22.9797C54.3231 22.9301 54.2131 22.9336 54.1262 22.9888L54.2774 23.2269ZM36.4722 38.309H36.19C36.19 38.412 36.2461 38.5067 36.3363 38.5563C36.4265 38.6059 36.5365 38.6024 36.6234 38.5472L36.4722 38.309ZM54.2774 27.002L54.4287 27.2402C54.5102 27.1884 54.5596 27.0986 54.5596 27.002H54.2774ZM72.0829 34.534H72.3651C72.3651 34.4374 72.3157 34.3476 72.2342 34.2958L72.0829 34.534ZM54.2777 23.2269L54.4289 22.9888C54.342 22.9336 54.232 22.9301 54.1418 22.9797C54.0516 23.0293 53.9955 23.124 53.9955 23.2269H54.2777ZM72.0829 38.309L71.9317 38.5472C72.0186 38.6024 72.1286 38.6059 72.2188 38.5563C72.309 38.5067 72.3651 38.412 72.3651 38.309H72.0829ZM54.2777 27.002H53.9955C53.9955 27.0986 54.0449 27.1884 54.1264 27.2402L54.2777 27.002ZM36.4722 34.534L36.6234 34.7721L54.4287 23.4651L54.2774 23.2269L54.1262 22.9888L36.3209 34.2958L36.4722 34.534ZM36.4722 38.309H36.7543V34.534H36.4722H36.19V38.309H36.4722ZM54.2774 27.002L54.1262 26.7638L36.3209 38.0709L36.4722 38.309L36.6234 38.5472L54.4287 27.2402L54.2774 27.002ZM54.2774 23.2269H53.9953V27.002H54.2774H54.5596V23.2269H54.2774ZM72.0829 34.534L72.2342 34.2958L54.4289 22.9888L54.2777 23.2269L54.1264 23.4651L71.9317 34.7721L72.0829 34.534ZM72.0829 38.309H72.3651V34.534H72.0829H71.8008V38.309H72.0829ZM54.2777 27.002L54.1264 27.2402L71.9317 38.5472L72.0829 38.309L72.2342 38.0709L54.4289 26.7638L54.2777 27.002ZM54.2777 23.2269H53.9955V27.002H54.2777H54.5598V23.2269H54.2777Z" fill="#182024"/>
      <rect width="20.1339" height="1.83073" transform="matrix(1 0 0 -1 17.4214 47.4627)" fill="#DAE6FD" stroke="#182024" strokeWidth="0.56425" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="20.1807" y="50.3912" width="14.6705" height="13.2366" fill="#4782F3" stroke="#182024" strokeWidth="0.56425" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20.1807 54.8033L34.8517 54.8033" stroke="#182024" strokeWidth="0.56425" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20.1807 59.2156L34.8517 59.2156" stroke="#182024" strokeWidth="0.56425" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="42.6694" y="51.5013" width="4.30279" height="7.50809" fill="#DAE6FD" stroke="#182024" strokeWidth="0.56425" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="46.9731" y="51.5012" width="4.30279" height="7.50809" fill="#DAE6FD" stroke="#182024" strokeWidth="0.56425" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="42.6689" y="39.0875" width="4.30316" height="7.57235" fill="#DAE6FD" stroke="#182024" strokeWidth="0.56425" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="46.9717" y="39.0874" width="4.30316" height="7.57235" fill="#DAE6FD" stroke="#182024" strokeWidth="0.56425" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="58.1865" y="39.0875" width="4.30316" height="7.57235" fill="#DAE6FD" stroke="#182024" strokeWidth="0.56425" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="62.4888" y="39.0874" width="4.30316" height="7.57235" fill="#DAE6FD" stroke="#182024" strokeWidth="0.56425" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.2031 69.9179L19.6091 71.3238L21.7181 69.2149" stroke="#4782F3" strokeWidth="0.56425" strokeLinejoin="round"/>
      <rect x="23.1255" y="70.0655" width="10.76" height="1.02295" fill="#DAE6FD"/>
      <path d="M38.3491 69.9178L39.7551 71.3238L41.8641 69.2148" stroke="#4782F3" strokeWidth="0.56425" strokeLinejoin="round"/>
      <rect x="43.4424" y="70.0654" width="10.76" height="1.02295" fill="#DAE6FD"/>
      <path d="M0.282227 14.2149H8.55255" stroke="#182024" strokeWidth="0.56425" strokeLinejoin="round"/>
      <path d="M13.436 0L13.436 8.27032" stroke="#182024" strokeWidth="0.56425" strokeLinejoin="round"/>
      <path d="M3.93457 4.18329L9.78257 10.0313" stroke="#182024" strokeWidth="0.56425" strokeLinejoin="round"/>
      <path d="M86.3296 7.05115H84.6368" stroke="black" strokeWidth="0.56425" strokeLinejoin="round"/>
      <path d="M89.9619 7.05115H88.2692" stroke="black" strokeWidth="0.56425" strokeLinejoin="round"/>
      <path d="M87.3003 6.08148L87.3003 4.38873" stroke="black" strokeWidth="0.56425" strokeLinejoin="round"/>
      <path d="M87.3003 9.71359L87.3003 8.02084" stroke="black" strokeWidth="0.56425" strokeLinejoin="round"/>
      <circle cx="1.1286" cy="69.2148" r="0.846375" fill="#182024" stroke="#182024" strokeWidth="0.56425" strokeLinejoin="round"/>
      <circle cx="97.6151" cy="21.1153" r="1.69275" fill="white" stroke="#182024" strokeWidth="0.56425" strokeLinejoin="round"/>
      <circle cx="89.9623" cy="30.6118" r="1.69275" fill="#4782F3" stroke="#182024" strokeWidth="0.56425" strokeLinejoin="round"/>
    </svg>
  </div>
);

// ── Review row ────────────────────────────────────────────────────────────────

const ReviewRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center text-sm">
    <span className="w-48 shrink-0 text-[#73787a]">{label}</span>
    <span className="text-[#2f363a]">{value}</span>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

const StepActivate: React.FC<StepActivateProps> = ({
  draft,
  activating,
  userPlan = "standard",
  propertyImage,
  termsAccepted,
  onTermsChange,
  onGoToStep,
}) => {
  const [smartMatching, setSmartMatching] = useState(true);
  const [isLaunching, setIsLaunching] = useState(false);

  useEffect(() => {
    setIsLaunching(activating);
  }, [activating]);

  const isPaidPlan = userPlan === "pro" || userPlan === "enterprise";
  const fee = smartMatching ? 290 : 350;
  const docs = draft.documents ?? { level1: [], level2: [], level3: [] };

  return (
    <>
      {isLaunching && (
        <>
          <style>{`
            @keyframes gb-overlay {
              0%  { opacity: 0; }
              6%  { opacity: 1; }
              100% { opacity: 1; }
            }
            @keyframes gb-logo-appear {
              from { opacity: 0; }
              to   { opacity: 1; }
            }
            @keyframes gb-pulse {
              from { transform: scale(1); opacity: 0.3; }
              to   { transform: scale(2.5); opacity: 0; }
            }
          `}</style>
          <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
            style={{ animation: 'gb-overlay 2500ms ease-in-out forwards' }}
          >
            <div
              className="flex flex-col items-center gap-4"
              style={{ animation: 'gb-logo-appear 300ms ease-out 150ms 1 both' }}
            >
              <div className="relative" style={{ width: 80, height: 80 }}>
                <div
                  className="absolute inset-0 rounded-full border-2 border-[#4782f3]"
                  style={{ opacity: 0, animation: 'gb-pulse 600ms ease-out 800ms 1 forwards' }}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="#4782f3"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12"    r="2.63" />
                  <circle cx="12" cy="7"     r="2.63" />
                  <circle cx="12" cy="17"    r="2.63" />
                  <circle cx="7"  cy="12"    r="2.63" />
                  <circle cx="17" cy="12"    r="2.63" />
                  <circle cx="7"  cy="7"     r="2.07" />
                  <circle cx="17" cy="7"     r="2.07" />
                  <circle cx="7"  cy="17"    r="2.07" />
                  <circle cx="17" cy="17"    r="2.07" />
                  <circle cx="12" cy="1.84"  r="1.84" />
                  <circle cx="12" cy="22.2"  r="1.84" />
                  <circle cx="1.84" cy="12"  r="1.84" />
                  <circle cx="22.2" cy="12"  r="1.84" />
                  <circle cx="7"    cy="1.84" r="1.22" />
                  <circle cx="17"   cy="1.84" r="1.22" />
                  <circle cx="7"    cy="22.2" r="1.22" />
                  <circle cx="17"   cy="22.2" r="1.22" />
                  <circle cx="1.84" cy="7"    r="1.22" />
                  <circle cx="22.2" cy="7"    r="1.22" />
                  <circle cx="1.84" cy="17"   r="1.22" />
                  <circle cx="22.2" cy="17"   r="1.22" />
                </svg>
              </div>
              <p className="text-sm text-[#73787a]">Bieterverfahren wird gestartet</p>
            </div>
          </div>
        </>
      )}
      <div className="flex flex-col gap-6">

      {/* ── Section heading ──────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-[#182024]">Alle Details prüfen</h2>
        <p className="mt-0.5 text-sm text-[#73787a]">Prüfe alle Angaben, bevor du das Verfahren startest.</p>
      </div>

      {/* ── Cards container ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">

        {/* Objekt card */}
        <div className="flex items-center overflow-hidden rounded-lg border border-[#e8e9e9] bg-white">
          <div className="h-full w-24 shrink-0 self-stretch overflow-hidden bg-[#f6f6f6] flex items-center justify-center">
            {propertyImage ? (
              <img src={propertyImage} alt="" className="h-full w-full object-cover" />
            ) : (
              <PropertyPlaceholderIcon />
            )}
          </div>
          <div className="flex flex-1 items-start gap-3 p-4 min-w-0">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-base text-[#182024] leading-6">
                {draft.title || "—"}
              </p>
              <div className="mt-0.5 flex items-center gap-3 flex-wrap">
                {draft.address && (
                  <span className="text-sm text-[#73787a] whitespace-nowrap">{draft.address}</span>
                )}
                {draft.address && draft.websiteUrl && (
                  <span className="h-4 w-px bg-[#e8e9e9] shrink-0" />
                )}
                {draft.websiteUrl && (
                  <a
                    href={draft.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm font-medium text-[#182024] hover:underline whitespace-nowrap"
                  >
                    Inserat öffnen
                    <ExternalLinkIcon />
                  </a>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onGoToStep(0)}
              className="shrink-0 h-8 px-3 flex items-center justify-center rounded-full text-sm font-medium text-[#2f363a] hover:bg-[#f0f0f0] transition-colors"
            >
              Bearbeiten
            </button>
          </div>
        </div>

        {/* Prozess card */}
        <div className="flex items-start gap-6 overflow-hidden rounded-lg border border-[#e8e9e9] bg-white p-4">
          <div className="flex flex-1 flex-col gap-3 min-w-0">
            <p className="font-medium text-base text-[#182024] leading-6">Prozess</p>
            <ReviewRow label="Vorlage" value={detectPresetLabel(draft)} />
            <ReviewRow label="Sichtbarkeit" value={visibilityLabel(draft.processType)} />
            <ReviewRow label="Rundenanzahl" value={String(draft.roundsPlanned ?? 1)} />
            <ReviewRow label="Preisorientierung" value={priceGuidanceLabel(draft.priceDisplay)} />
            <ReviewRow label="Frist" value={formatDeadline(draft.deadline ?? null)} />
          </div>
          <button
            type="button"
            onClick={() => onGoToStep(1)}
            className="shrink-0 h-8 px-3 flex items-center justify-center rounded-full text-sm font-medium text-[#2f363a] hover:bg-[#f0f0f0] transition-colors"
          >
            Bearbeiten
          </button>
        </div>

        {/* Dokumente card */}
        <div className="flex items-start gap-6 overflow-hidden rounded-lg border border-[#e8e9e9] bg-white p-4">
          <div className="flex flex-1 flex-col gap-3 min-w-0">
            <p className="font-medium text-base text-[#182024] leading-6">Dokumente</p>
            <ReviewRow label="Bei Registrierung" value={`${docs.level1.length} gesamt`} />
            <ReviewRow label="Nach einem Gebot" value={`${docs.level2.length} gesamt`} />
            <ReviewRow label="Auf deine Freigabe" value={`${docs.level3.length} gesamt`} />
          </div>
          <button
            type="button"
            onClick={() => onGoToStep(2)}
            className="shrink-0 h-8 px-3 flex items-center justify-center rounded-full text-sm font-medium text-[#2f363a] hover:bg-[#f0f0f0] transition-colors"
          >
            Bearbeiten
          </button>
        </div>
      </div>

      <div className="h-px bg-[#e8e9e9]" />

      {/* ── Smart Matching card ──────────────────────────────────────────────── */}
      {!isPaidPlan && (
        <div className="overflow-hidden rounded-xl border border-[#e8e9e9] bg-white">
          <div className="flex items-stretch overflow-hidden border-b border-[#e8e9e9]">
            <SmartMatchingArtwork />
            <div className="flex flex-1 items-start gap-10 p-4 min-w-0">
              <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                <p className="font-bold text-base text-[#182024] leading-6">Smart Matching</p>
                <div className="mt-1.5 flex flex-col gap-0.5">
                  {SMART_MATCHING_BULLETS.map((bullet) => (
                    <div key={bullet} className="flex items-center gap-2">
                      <CheckIcon />
                      <span className="text-sm text-[#73787a]">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="shrink-0 p-2">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={smartMatching}
                  onClick={() => setSmartMatching(!smartMatching)}
                  className={`flex h-6 w-6 items-center justify-center rounded-sm border-[1.5px] transition-colors ${
                    smartMatching
                      ? "border-[#4782f3] bg-[#4782f3]"
                      : "border-[#73787a] bg-white"
                  }`}
                >
                  {smartMatching && <CheckIconWhite />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#73787a]">Heute fällig</span>
              <div className="flex items-baseline gap-2 font-mono text-base text-[#2f363a]">
                <span>CHF</span>
                <span>0</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#2f363a]">Bei Abschluss</span>
              <div className="flex items-baseline gap-4">
                {smartMatching && (
                  <div className="flex items-center gap-1 font-mono text-sm text-[#73787a] line-through">
                    <span>CHF</span>
                    <span>350</span>
                  </div>
                )}
                <div className={`flex items-baseline gap-1 font-mono text-2xl font-medium ${smartMatching ? "text-[#3968c2]" : "text-[#2f363a]"}`}>
                  <span>CHF</span>
                  <span>{fee}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isPaidPlan && (
        <div className="flex items-center gap-2.5 rounded-lg border border-[#e8e9e9] bg-[#fafafa] px-4 py-3">
          <CheckIcon />
          <span className="text-sm text-[#73787a]">In deinem Tarif enthalten — keine Erfolgsgebühr.</span>
        </div>
      )}

      <div className="h-px bg-[#e8e9e9]" />

      {/* ── Nutzungsbedingungen ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          role="checkbox"
          aria-checked={termsAccepted}
          onClick={() => onTermsChange(!termsAccepted)}
          className={`shrink-0 flex h-6 w-6 items-center justify-center rounded-sm border-[1.5px] transition-colors ${
            termsAccepted
              ? "border-[#4782f3] bg-[#4782f3]"
              : "border-[#73787a] bg-white"
          }`}
        >
          {termsAccepted && <CheckIconWhite />}
        </button>
        <p className="text-base text-[#2f363a]">
          Ich bestätige, dass ich die{" "}
          <a href="#" className="underline font-medium text-[#182024]">
            Nutzungsbedingungen
          </a>{" "}
          von GridBid gelesen, verstanden und akzeptiert habe.
        </p>
      </div>

      {/* ── Was passiert danach? ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 overflow-hidden rounded-lg border border-[#e8e9e9] bg-[#fafafa] p-4">
        <div className="flex items-center gap-2">
          <RoadmapIcon />
          <span className="font-medium text-base text-[#182024]">Was passiert danach?</span>
        </div>
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          {NACH_DEM_START.map((line) => (
            <li key={line} className="text-sm text-[#2f363a]">
              {line}
            </li>
          ))}
        </ul>
      </div>
    </div>
    </>
  );
};

export default StepActivate;
