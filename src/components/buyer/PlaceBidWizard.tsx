import React, { useRef, useState } from "react";
import type { GridbidBidding } from "../../types/domain";
import type { BidData, FinancingStatus } from "../../types/buyer";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatAmountDisplay(amount: number): string {
  return `CHF ${amount.toLocaleString("de-CH")}`;
}

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

function formatClosingDateLabel(value: string): string {
  if (!value) return "—";
  if (value === "sofort") return "Sofort";
  const parts = value.split("-").map(Number);
  const year = parts[0] ?? 2026;
  const month = (parts[1] ?? 1) - 1;
  return new Date(year, month, 1).toLocaleDateString("de-CH", {
    month: "long",
    year: "numeric",
  });
}

// ── Constants ─────────────────────────────────────────────────────────────────

const FINANCING_LABEL: Record<FinancingStatus, string> = {
  open: "Noch offen",
  in_preparation: "In Vorbereitung",
  confirmed: "Bereits bestätigt",
};

const CLOSING_DATE_OPTIONS = [
  { label: "Sofort", value: "sofort" },
  { label: "Juni 2026", value: "2026-06" },
  { label: "Juli 2026", value: "2026-07" },
  { label: "August 2026", value: "2026-08" },
  { label: "September 2026", value: "2026-09" },
  { label: "Oktober 2026", value: "2026-10" },
];

const BID_STEPS = ["Angebotsdetails", "Stärken", "Prüfen"];

// ── Icons ─────────────────────────────────────────────────────────────────────

function GridBidLogoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#4782f3" aria-hidden="true">
      <circle cx="12" cy="12" r="2.63" /><circle cx="12" cy="7" r="2.63" />
      <circle cx="12" cy="17" r="2.63" /><circle cx="7" cy="12" r="2.63" />
      <circle cx="17" cy="12" r="2.63" /><circle cx="7" cy="7" r="2.07" />
      <circle cx="17" cy="7" r="2.07" /><circle cx="7" cy="17" r="2.07" />
      <circle cx="17" cy="17" r="2.07" /><circle cx="12" cy="1.84" r="1.84" />
      <circle cx="12" cy="22.2" r="1.84" /><circle cx="1.84" cy="12" r="1.84" />
      <circle cx="22.2" cy="12" r="1.84" /><circle cx="7" cy="1.84" r="1.22" />
      <circle cx="17" cy="1.84" r="1.22" /><circle cx="7" cy="22.2" r="1.22" />
      <circle cx="17" cy="22.2" r="1.22" /><circle cx="1.84" cy="7" r="1.22" />
      <circle cx="22.2" cy="7" r="1.22" /><circle cx="1.84" cy="17" r="1.22" />
      <circle cx="22.2" cy="17" r="1.22" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 3L13 13M13 3L3 13" stroke="#182024" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="8" r="7" />
      <path d="M8 4.5v3.5l2 2" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M16 10H4M4 10L9 5M4 10L9 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function HousePlaceholderIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10.5L12 3l9 7.5V21H3V10.5z" />
      <rect x="9" y="14" width="6" height="7" rx="0.5" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 1.5h3.5V5M10.5 1.5L5 7M5 2.5H1.5v8h8V7" />
    </svg>
  );
}

function IdCardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1.5" y="3.5" width="13" height="9" rx="1" />
      <circle cx="5.5" cy="8" r="1.5" />
      <path d="M9 6.5h3M9 9h3" />
    </svg>
  );
}

function FinancingDocIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 2H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V6M9 2l4 4M9 2v4h4" />
      <path d="M5 9h6M5 11.5h3" />
    </svg>
  );
}

function ShieldWarningIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 1.5L2.5 4.5V10C2.5 14 5.75 17.75 10 19.5C14.25 17.75 17.5 14 17.5 10V4.5L10 1.5Z"
        fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 10l2 2 4-4" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertWarningIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#b56100" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 5v3.5M8 10.5v.5" />
    </svg>
  );
}

function LevelBarIcon() {
  return (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
      <rect x="1" y="6.5" width="2" height="3.5" fill="#b56100" />
      <rect x="5" y="4" width="2" height="6" fill="#d1d5db" />
      <rect x="9" y="1.5" width="2" height="8.5" fill="#d1d5db" />
    </svg>
  );
}

function RemoveFileIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M2 2l8 8M10 2L2 10" />
    </svg>
  );
}

// ── Step indicator ────────────────────────────────────────────────────────────

const BidStepIndicator: React.FC<{ step: number }> = ({ step }) => (
  <div className="flex items-center">
    {BID_STEPS.map((label, i) => (
      <React.Fragment key={label}>
        <div className="flex items-center gap-3">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base font-medium leading-none ${
              i <= step ? "bg-[#182024] text-white" : "bg-[#e8e9e9] text-[#73787a]"
            }`}
          >
            {i < step ? <CheckIcon /> : <span className="font-mono">{i + 1}</span>}
          </span>
          <span
            className={`whitespace-nowrap text-sm font-medium ${
              i === step ? "text-[#182024]" : "text-[#73787a]"
            }`}
          >
            {label}
          </span>
        </div>
        {i < BID_STEPS.length - 1 && (
          <div className="mx-2 h-px min-w-[16px] flex-1 bg-[#e8e9e9]" />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ── Review row ────────────────────────────────────────────────────────────────

function ReviewRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-0 text-sm">
      <span className="w-48 shrink-0 text-[#73787a]">{label}</span>
      <span className="min-w-0 text-[#2f363a]">{children}</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export interface PlaceBidWizardProps {
  bidding: GridbidBidding;
  onClose: () => void;
  onSubmit: (bid: BidData) => void;
}

const PlaceBidWizard: React.FC<PlaceBidWizardProps> = ({ bidding, onClose, onSubmit }) => {
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState(1_150_000);
  const [validityDays, setValidityDays] = useState<14 | 30 | 60>(30);
  const [financingStatus, setFinancingStatus] = useState<FinancingStatus>("confirmed");
  const [closingDate, setClosingDate] = useState("");
  const [conditions, setConditions] = useState("");
  const [idFile, setIdFile] = useState<{ name: string; data: string } | null>(null);
  const [financingProofFile, setFinancingProofFile] = useState<{ name: string; data: string } | null>(null);

  const idFileRef = useRef<HTMLInputElement>(null);
  const financingFileRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (f: { name: string; data: string } | null) => void
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string") {
        setter({ name: file.name, data: ev.target.result });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleSubmit() {
    const bid: BidData = {
      amount,
      validityDays,
      financingStatus,
      closingDate,
      conditions,
      idUploaded: !!idFile,
      financingProofUploaded: !!financingProofFile,
      submittedAt: new Date().toISOString(),
    };
    onSubmit(bid);
  }

  const noDocuments = !idFile && !financingProofFile;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">

      {/* ── Top bar ── */}
      <header className="relative flex h-14 shrink-0 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <GridBidLogoIcon />
          <span className="text-sm font-semibold tracking-tight text-[#182024]">GridBid</span>
        </div>

        {bidding.deadline && (
          <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-3">
            <ClockIcon />
            <span className="text-sm font-medium text-[#2f363a]">
              {formatCountdownLabel(bidding.deadline)}
            </span>
            <div className="h-4 w-px bg-[#e8e9e9]" />
            <span className="text-sm text-[#73787a]">Runde schliesst:</span>
            <span className="text-sm font-medium text-[#3968c2]">
              {formatDeadlineDateFull(bidding.deadline)}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[#e8e9e9]"
          aria-label="Schliessen"
        >
          <CloseIcon />
        </button>
      </header>
      <div className="h-px bg-[#e8e9e9]" />

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-6 pb-10 pt-8">

          {/* Property header */}
          <div className="mb-6 flex items-center gap-4">
            {bidding.imageUrl ? (
              <img
                src={bidding.imageUrl}
                alt=""
                className="h-[52px] w-[71px] shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-[52px] w-[71px] shrink-0 items-center justify-center rounded-lg bg-[#f6f6f6] text-[#d1d2d3]">
                <HousePlaceholderIcon />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-medium text-[#182024]">{bidding.title}</p>
              <div className="mt-0.5 flex items-center gap-3">
                <span className="truncate text-sm text-[#73787a]">{bidding.address}</span>
                {bidding.websiteUrl && (
                  <>
                    <div className="h-4 w-px shrink-0 bg-[#e8e9e9]" />
                    <a
                      href={bidding.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex shrink-0 items-center gap-1 text-sm font-medium text-[#182024] hover:text-[#2f363a]"
                    >
                      Objektwebsite
                      <ExternalLinkIcon />
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="mb-8 h-px bg-[#e8e9e9]" />

          {/* Step indicator */}
          <div className="mb-8">
            <BidStepIndicator step={step} />
          </div>

          {/* ── Step 0: Angebotsdetails ── */}
          {step === 0 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-3xl font-bold text-[#182024]">Angebotsdetails</h2>
                <p className="mt-1 text-sm text-[#73787a]">
                  Dein Angebot wird vertraulich an den Eigentümer weitergeleitet.
                </p>
              </div>

              {/* Angebotsbetrag */}
              <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-[#182024]">Angebotsbetrag</span>
                <div className="flex items-center gap-4 rounded border border-[#e8e9e9] bg-white px-4 py-2">
                  <button
                    type="button"
                    onClick={() => setAmount((a) => Math.max(0, a - 10_000))}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#182024] transition-colors hover:bg-[#e8e9e9]"
                    aria-label="Betrag verringern"
                  >
                    <MinusIcon />
                  </button>
                  <span className="flex-1 text-center text-2xl font-medium text-[#182024]">
                    {formatAmountDisplay(amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAmount((a) => a + 10_000)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#182024] transition-colors hover:bg-[#e8e9e9]"
                    aria-label="Betrag erhöhen"
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>

              {/* Angebot gültig für */}
              <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-[#182024]">Angebot gültig für</span>
                <div className="flex flex-wrap gap-2">
                  {([14, 30, 60] as const).map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setValidityDays(days)}
                      className={`rounded-full px-4 py-2 text-base transition-colors ${
                        validityDays === days
                          ? "border-[1.5px] border-[#2f363a] bg-[#f6f6f6] font-medium text-[#182024]"
                          : "border border-[#e8e9e9] bg-white font-normal text-[#182024] hover:bg-[#f6f6f6]"
                      }`}
                    >
                      {days} Tage
                    </button>
                  ))}
                </div>
              </div>

              {/* Finanzierungsstatus */}
              <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-[#182024]">
                  Wie ist dein Finanzierungsstatus?
                </span>
                <div className="flex flex-col gap-2">
                  {(
                    [
                      {
                        value: "open" as FinancingStatus,
                        label: "Noch offen",
                        sublabel: "Geringere Sicherheit",
                        sublabelClass: "text-[#ce4742]",
                      },
                      {
                        value: "in_preparation" as FinancingStatus,
                        label: "In Vorbereitung",
                        sublabel: "Mittlere Sicherheit",
                        sublabelClass: "text-[#b56100]",
                      },
                      {
                        value: "confirmed" as FinancingStatus,
                        label: "Bereits bestätigt",
                        sublabel: "Hohe Sicherheit",
                        sublabelClass: "text-[#288352]",
                      },
                    ] as const
                  ).map((option) => {
                    const selected = financingStatus === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFinancingStatus(option.value)}
                        className={`flex w-full items-center gap-3 overflow-clip rounded-lg px-4 py-3 text-left transition-colors ${
                          selected
                            ? "border-[1.5px] border-[#2f363a] bg-[#f6f6f6]/50"
                            : "border border-[#e8e9e9] bg-white hover:bg-[#fafafa]"
                        }`}
                      >
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                            selected ? "border-[#182024] bg-[#182024]" : "border-[#73787a] bg-white"
                          }`}
                        >
                          {selected && <div className="h-2 w-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <p className="text-base font-medium text-[#182024]">{option.label}</p>
                          <p className={`text-xs ${option.sublabelClass}`}>{option.sublabel}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gewünschter Übergabetermin */}
              <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-[#182024]">
                  Gewünschter Übergabetermin{" "}
                  <span className="font-normal text-[#73787a]">(optional)</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {CLOSING_DATE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setClosingDate((prev) => (prev === opt.value ? "" : opt.value))
                      }
                      className={`rounded-full px-4 py-2 text-base transition-colors ${
                        closingDate === opt.value
                          ? "border-[1.5px] border-[#2f363a] bg-[#f6f6f6] font-medium text-[#182024]"
                          : "border border-[#e8e9e9] bg-white font-normal text-[#182024] hover:bg-[#f6f6f6]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bedingungen / Bemerkungen */}
              <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-[#182024]">
                  Bedingungen / Bemerkungen{" "}
                  <span className="font-normal text-[#73787a]">(optional)</span>
                </span>
                <textarea
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  rows={4}
                  placeholder="z.B. Vorbehalt Finanzierungszusage…"
                  className="w-full resize-none rounded border border-[#e8e9e9] bg-white px-3 py-3 text-base text-[#182024] placeholder-[#d1d2d3] outline-none transition-colors focus:border-[#73787a]"
                />
              </div>
            </div>
          )}

          {/* ── Step 1: Stärken ── */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-3xl font-bold text-[#182024]">Stärke dein Angebot</h2>
                <p className="mt-1 text-sm text-[#73787a]">
                  Verifizierte Angebote werden vom Verkäufer bevorzugt geprüft und ausgewählt.
                </p>
              </div>

              {/* Level banner */}
              <div className="flex items-start justify-between gap-4 rounded-lg border border-[#f2d8c0] bg-[#fbf2ea] p-4">
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <ShieldWarningIcon />
                    <span className="text-base font-medium text-[#b56100]">
                      Dein Käuferprofil ist auf Level 1
                    </span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#b56100" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
                      <circle cx="8" cy="8" r="6.5" />
                      <path d="M8 7v5M8 5v.01" />
                    </svg>
                  </div>
                  <p className="text-sm text-[#73787a]">
                    Lade beide Dokumente hoch um Level 3 zu erreichen und dein Angebot
                    hervorzuheben.
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1 rounded-full border border-[#e8e9e9] bg-white px-2 py-0.5">
                  <LevelBarIcon />
                  <span className="text-xs font-medium text-[#2f363a]">Level</span>
                  <span className="text-xs font-medium text-[#b56100]">1 von 3</span>
                </div>
              </div>

              {/* Upload rows */}
              <div className="flex flex-col gap-4">
                {/* Ausweis oder Reisepass */}
                <input
                  ref={idFileRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e, setIdFile)}
                />
                <div className="flex items-center overflow-clip rounded-lg border border-dashed border-[#d1d2d3] bg-[#fafafa]">
                  <div className="flex flex-1 items-center gap-3 p-4">
                    <span className="text-[#73787a]"><IdCardIcon /></span>
                    <span className="text-base font-medium text-[#182024]">
                      Ausweis oder Reisepass
                    </span>
                  </div>
                  <div className="flex items-center self-stretch px-4">
                    {idFile ? (
                      <div className="flex items-center gap-2">
                        <span className="max-w-[160px] truncate text-sm text-[#73787a]">
                          {idFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIdFile(null)}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-[#73787a] transition-colors hover:bg-[#e8e9e9] hover:text-[#182024]"
                          aria-label="Datei entfernen"
                        >
                          <RemoveFileIcon />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => idFileRef.current?.click()}
                        className="flex h-8 items-center gap-1.5 rounded-full bg-[#182024] px-3 text-sm font-medium text-white transition-colors hover:bg-[#2f363a]"
                      >
                        Hochladen
                        <PlusIcon />
                      </button>
                    )}
                  </div>
                </div>

                {/* Finanzierungsnachweis */}
                <input
                  ref={financingFileRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e, setFinancingProofFile)}
                />
                <div className="flex items-center overflow-clip rounded-lg border border-dashed border-[#d1d2d3] bg-[#fafafa]">
                  <div className="flex flex-1 items-center gap-3 p-4">
                    <span className="text-[#73787a]"><FinancingDocIcon /></span>
                    <span className="text-base font-medium text-[#182024]">
                      Finanzierungsnachweis
                    </span>
                  </div>
                  <div className="flex items-center self-stretch px-4">
                    {financingProofFile ? (
                      <div className="flex items-center gap-2">
                        <span className="max-w-[160px] truncate text-sm text-[#73787a]">
                          {financingProofFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setFinancingProofFile(null)}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-[#73787a] transition-colors hover:bg-[#e8e9e9] hover:text-[#182024]"
                          aria-label="Datei entfernen"
                        >
                          <RemoveFileIcon />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => financingFileRef.current?.click()}
                        className="flex h-8 items-center gap-1.5 rounded-full bg-[#182024] px-3 text-sm font-medium text-white transition-colors hover:bg-[#2f363a]"
                      >
                        Hochladen
                        <PlusIcon />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Prüfen ── */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-3xl font-bold text-[#182024]">Dein Angebot prüfen</h2>
                <p className="mt-1 text-sm text-[#73787a]">
                  Du gibst hiermit eine ernsthafte Kaufabsicht ab. Das Angebot wird dem Verkäufer
                  zur Prüfung übermittelt.
                </p>
              </div>

              {/* Angebotsdetails summary card */}
              <div className="flex items-start gap-6 overflow-clip rounded-lg border border-[#e8e9e9] bg-white p-4">
                <div className="flex flex-1 flex-col gap-3">
                  <span className="text-base font-medium text-[#182024]">Angebotsdetails</span>
                  <ReviewRow label="Angebotsbetrag">
                    <span className="text-xl font-medium text-[#182024]">
                      {formatAmountDisplay(amount)}
                    </span>
                  </ReviewRow>
                  <ReviewRow label="Angebot gültig für">{validityDays} Tage</ReviewRow>
                  <ReviewRow label="Finanzierungsstatus">{FINANCING_LABEL[financingStatus]}</ReviewRow>
                  <ReviewRow label="Gewünschter Übergabetermin">
                    {closingDate ? formatClosingDateLabel(closingDate) : "—"}
                  </ReviewRow>
                  <ReviewRow label="Bedingungen/Bemerkungen">
                    {conditions || "—"}
                  </ReviewRow>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="shrink-0 rounded-full px-3 py-1.5 text-sm font-medium text-[#2f363a] transition-colors hover:bg-[#e8e9e9]"
                >
                  Bearbeiten
                </button>
              </div>

              {/* Unterlagen summary card */}
              <div className="flex items-start gap-6 overflow-clip rounded-lg border border-[#e8e9e9] bg-white p-4">
                <div className="flex flex-1 flex-col gap-3">
                  <span className="text-base font-medium text-[#182024]">Unterlagen</span>
                  <ReviewRow label="Qualifikationslevel">
                    <div className="flex items-center gap-2">
                      <LevelBarIcon />
                      <span className="text-sm font-medium text-[#b56100]">Level 1 von 3</span>
                    </div>
                  </ReviewRow>
                  <ReviewRow label="Ausweis oder Reisepass">
                    {idFile ? idFile.name : "—"}
                  </ReviewRow>
                  <ReviewRow label="Finanzierungsnachweis">
                    {financingProofFile ? financingProofFile.name : "—"}
                  </ReviewRow>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="shrink-0 rounded-full px-3 py-1.5 text-sm font-medium text-[#2f363a] transition-colors hover:bg-[#e8e9e9]"
                >
                  Bearbeiten
                </button>
              </div>

              {/* No-documents warning banner */}
              {noDocuments && (
                <div className="flex items-start gap-3 rounded-lg border border-[#f2d8c0] bg-[#fbf2ea] p-4">
                  <span className="mt-0.5 shrink-0"><AlertWarningIcon /></span>
                  <div>
                    <p className="text-base font-medium text-[#b56100]">
                      Dein Angebot hat keine Begleitdokumente.
                    </p>
                    <p className="mt-0.5 text-sm text-[#73787a]">
                      Ein Ausweis oder Finanzierungsnachweis macht es deutlich stärker.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Sticky footer ── */}
      <footer className="shrink-0 border-t border-[#e8e9e9] bg-white">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-medium text-[#2f363a] transition-colors hover:bg-[#e8e9e9]"
          >
            Abbrechen
          </button>
          <div className="flex items-center gap-3">
            {step >= 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                aria-label="Zurück"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6f6f6] text-[#2f363a] transition-colors hover:bg-[#e8e9e9]"
              >
                <ArrowLeftIcon />
              </button>
            )}
            {step < 2 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="flex items-center gap-2 rounded-full bg-[#182024] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2f363a]"
              >
                Weiter
                <ArrowRightIcon />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-2 rounded-full bg-[#182024] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2f363a]"
              >
                Angebot einreichen
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PlaceBidWizard;
