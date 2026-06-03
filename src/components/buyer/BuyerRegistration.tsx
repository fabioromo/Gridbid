import React, { useRef, useState } from "react";
import { AvatarDropdown } from "../AvatarDropdown";
import { useGridbidUiStore } from "../../store/gridbidUiStore";
import type {
  BuyerRegistration,
  FinancingStatus,
  PurchaseTiming,
  BudgetRange,
  HousingSituation,
} from "../../types/buyer";

// ── Option data ───────────────────────────────────────────────────────────────

const FINANCING_OPTIONS: { value: FinancingStatus; label: string; description: string }[] = [
  {
    value: "open",
    label: "Noch nicht begonnen",
    description: "Ich habe die Finanzierungsfrage noch nicht angegangen.",
  },
  {
    value: "in_preparation",
    label: "Gespräche mit der Bank laufen",
    description: "Ich plane den Kauf und bin in Kontakt mit einem Finanzierungspartner.",
  },
  {
    value: "confirmed",
    label: "Finanzierung bestätigt",
    description: "Eine Finanzierungsbestätigung oder Zusage liegt vor.",
  },
];

const TIMING_OPTIONS: { value: PurchaseTiming; label: string }[] = [
  { value: "immediately",     label: "Sofort — ich bin kaufbereit" },
  { value: "within_3_months", label: "In den nächsten 3 Monaten" },
  { value: "later",           label: "Später oder noch offen" },
];

const BUDGET_OPTIONS: { value: BudgetRange; label: string }[] = [
  { value: "under_600",  label: "Bis CHF 600'000" },
  { value: "600_900",    label: "CHF 600'000 – 900'000" },
  { value: "900_1300",   label: "CHF 900'000 – 1'300'000" },
  { value: "1300_1800",  label: "CHF 1'300'000 – 1'800'000" },
  { value: "1800_2500",  label: "CHF 1'800'000 – 2'500'000" },
  { value: "over_2500",  label: "Über CHF 2'500'000" },
];

const HOUSING_OPTIONS: { value: HousingSituation; label: string }[] = [
  { value: "renting", label: "Ich miete" },
  { value: "owning",  label: "Ich wohne im Eigentum" },
  { value: "other",   label: "Andere Situation" },
];

// ── Country codes ─────────────────────────────────────────────────────────────

interface Country { code: string; dialCode: string; flag: string; name: string }

const PRIORITY_COUNTRIES: Country[] = [
  { code: "CH", dialCode: "+41",  flag: "🇨🇭", name: "Schweiz" },
  { code: "DE", dialCode: "+49",  flag: "🇩🇪", name: "Deutschland" },
  { code: "FR", dialCode: "+33",  flag: "🇫🇷", name: "Frankreich" },
  { code: "IT", dialCode: "+39",  flag: "🇮🇹", name: "Italien" },
  { code: "AT", dialCode: "+43",  flag: "🇦🇹", name: "Österreich" },
];

const OTHER_COUNTRIES: Country[] = [
  { code: "BE", dialCode: "+32",  flag: "🇧🇪", name: "Belgien" },
  { code: "BR", dialCode: "+55",  flag: "🇧🇷", name: "Brasilien" },
  { code: "CN", dialCode: "+86",  flag: "🇨🇳", name: "China" },
  { code: "DK", dialCode: "+45",  flag: "🇩🇰", name: "Dänemark" },
  { code: "ES", dialCode: "+34",  flag: "🇪🇸", name: "Spanien" },
  { code: "FI", dialCode: "+358", flag: "🇫🇮", name: "Finnland" },
  { code: "GB", dialCode: "+44",  flag: "🇬🇧", name: "Vereinigtes Königreich" },
  { code: "GR", dialCode: "+30",  flag: "🇬🇷", name: "Griechenland" },
  { code: "IN", dialCode: "+91",  flag: "🇮🇳", name: "Indien" },
  { code: "JP", dialCode: "+81",  flag: "🇯🇵", name: "Japan" },
  { code: "LI", dialCode: "+423", flag: "🇱🇮", name: "Liechtenstein" },
  { code: "LU", dialCode: "+352", flag: "🇱🇺", name: "Luxemburg" },
  { code: "NL", dialCode: "+31",  flag: "🇳🇱", name: "Niederlande" },
  { code: "NO", dialCode: "+47",  flag: "🇳🇴", name: "Norwegen" },
  { code: "NZ", dialCode: "+64",  flag: "🇳🇿", name: "Neuseeland" },
  { code: "PL", dialCode: "+48",  flag: "🇵🇱", name: "Polen" },
  { code: "PT", dialCode: "+351", flag: "🇵🇹", name: "Portugal" },
  { code: "RU", dialCode: "+7",   flag: "🇷🇺", name: "Russland" },
  { code: "SE", dialCode: "+46",  flag: "🇸🇪", name: "Schweden" },
  { code: "SG", dialCode: "+65",  flag: "🇸🇬", name: "Singapur" },
  { code: "TR", dialCode: "+90",  flag: "🇹🇷", name: "Türkei" },
  { code: "US", dialCode: "+1",   flag: "🇺🇸", name: "USA" },
  { code: "ZA", dialCode: "+27",  flag: "🇿🇦", name: "Südafrika" },
];

// ── Form types ────────────────────────────────────────────────────────────────

interface Step1Fields {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
}

interface Step1Errors { firstName?: string; lastName?: string; email?: string }

interface Step2Fields {
  financingStatus: FinancingStatus | null;
  purchaseTiming: PurchaseTiming | null;
  budgetRange: BudgetRange | null;
  housingSituation: HousingSituation | null;
  interestedInSimilar: boolean;
  termsAccepted: boolean;
}

interface Step2Errors { financingStatus?: string; purchaseTiming?: string; termsAccepted?: string }

// ── Icons ─────────────────────────────────────────────────────────────────────

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

function ExternalLinkIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3M10 2h4m0 0v4m0-4L7 9" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="h-3 w-3 shrink-0 text-gray-400" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4.5l3 3 3-3" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 10H4M10 4l-6 6 6 6" />
    </svg>
  );
}

function ArrowRightSmIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h10M8 3l5 5-5 5" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-gray-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="7" />
      <path d="M8 7v5M8 5v.01" strokeLinecap="round" />
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

// ── Verification level panel ──────────────────────────────────────────────────

function VerificationLevelPanel({
  step,
  phoneEntered,
  step2Complete,
}: {
  step: 1 | 2;
  phoneEntered: boolean;
  step2Complete: boolean;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const step1Done = step === 2;

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
          <InfoIcon />
          {showTooltip && (
            <div className="absolute left-5 top-0 z-50 w-60 rounded-lg bg-gray-900 px-3 py-2.5 text-xs leading-relaxed text-white shadow-xl">
              Höhere Qualifikationsstufen stärken deine Gebote. Level 3 kann nach der Registrierung freigeschaltet werden.
            </div>
          )}
        </div>
      </div>

      {/* Level 1 — amber */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <ShieldAmberIcon />
          <span className="text-base font-semibold text-amber-700">Level 1</span>
        </div>
        <div className="ml-[30px] space-y-1">
          <div className="flex items-center gap-2">
            {step1Done ? <CheckSmIcon ticked={true} /> : <MinusSmIcon />}
            <span className={`text-xs ${step1Done ? "text-gray-700" : "text-gray-400"}`}>
              Persönliche Angaben
            </span>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Level 2 — blue */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <ShieldBlueIcon />
          <span className="text-base font-semibold text-blue-700">Level 2</span>
        </div>
        <div className="ml-[30px] space-y-1">
          <div className="flex items-center gap-2">
            {phoneEntered ? <CheckSmIcon ticked={true} /> : <MinusSmIcon />}
            <span className={`text-xs ${phoneEntered ? "text-gray-700" : "text-gray-400"}`}>
              Telefonnummer bestätigen
            </span>
          </div>
          <div className="flex items-center gap-2">
            {step2Complete ? <CheckSmIcon ticked={true} /> : <MinusSmIcon />}
            <span className={`text-xs ${step2Complete ? "text-gray-700" : "text-gray-400"}`}>
              Erweitertes Käuferprofil
            </span>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Level 3 — locked */}
      <div className="flex items-center gap-2.5">
        <ShieldGrayIcon />
        <span className="text-base font-semibold text-gray-400">Level 3</span>
        <LockSmIcon />
      </div>

    </div>
  );
}

// ── Country code selector ─────────────────────────────────────────────────────

function CountryCodeSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (dialCode: string) => void;
}) {
  const allCountries = [...PRIORITY_COUNTRIES, ...OTHER_COUNTRIES];
  const selected = allCountries.find((c) => c.dialCode === value) ?? PRIORITY_COUNTRIES[0];

  return (
    <div className="relative shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 z-10 w-full cursor-pointer opacity-0"
        aria-label="Ländervorwahl"
      >
        {PRIORITY_COUNTRIES.map((c) => (
          <option key={c.code} value={c.dialCode}>
            {c.flag} {c.name} {c.dialCode}
          </option>
        ))}
        <option disabled>──────────</option>
        {OTHER_COUNTRIES.map((c) => (
          <option key={c.code} value={c.dialCode}>
            {c.flag} {c.name} {c.dialCode}
          </option>
        ))}
      </select>
      <div className="flex min-h-[42px] items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5 pointer-events-none">
        <span className="text-base leading-none">{selected.flag}</span>
        <ChevronDownIcon />
      </div>
    </div>
  );
}

// ── Validation ────────────────────────────────────────────────────────────────

function validateStep1(f: Step1Fields): Step1Errors {
  const e: Step1Errors = {};
  if (!f.firstName.trim()) e.firstName = "Bitte gib deinen Vornamen ein.";
  if (!f.lastName.trim())  e.lastName  = "Bitte gib deinen Nachnamen ein.";
  if (!f.email.includes("@")) e.email  = "Bitte gib eine gültige E-Mail-Adresse ein.";
  return e;
}

function validateStep2(f: Step2Fields): Step2Errors {
  const e: Step2Errors = {};
  if (!f.financingStatus) e.financingStatus = "Bitte wähle deine aktuelle Finanzierungssituation aus.";
  if (!f.purchaseTiming)  e.purchaseTiming  = "Bitte gib deinen geplanten Kaufzeitpunkt an.";
  if (!f.termsAccepted)   e.termsAccepted   = "Bitte bestätige die Nutzungsbedingungen, um fortzufahren.";
  return e;
}

function hasErrors(e: object): boolean {
  return Object.keys(e).length > 0;
}

// ── Access-granted transition overlay ────────────────────────────────────────

function AccessGrantedOverlay() {
  return (
    <>
      <style>{`
        @keyframes gb-overlay-in  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes gb-overlay-out { from { opacity: 1 } to { opacity: 0 } }
        @keyframes gb-check-draw  { to   { stroke-dashoffset: 0 } }
        @keyframes gb-shield-blue { to   { fill: #eff6ff; stroke: #4782f3 } }
        @keyframes gb-check-blue  { to   { stroke: #4782f3 } }
        @keyframes gb-label-hide  { to   { opacity: 0 } }
        @keyframes gb-label-show  { to   { opacity: 1 } }
        @keyframes gb-shield-exit { to   { transform: scale(1.08); opacity: 0 } }

        .gb-overlay {
          animation: gb-overlay-in 150ms ease-out 0ms forwards;
        }
        .gb-shield-wrap {
          animation: gb-shield-exit 300ms ease-in 1600ms forwards;
        }
        .gb-shield-body {
          fill: #fef9f0;
          stroke: #b56100;
          animation: gb-shield-blue 300ms ease-in-out 800ms forwards;
        }
        .gb-check-path {
          stroke: #b56100;
          stroke-dasharray: 9;
          stroke-dashoffset: 9;
          fill: none;
          animation:
            gb-check-draw 400ms ease-out    150ms forwards,
            gb-check-blue 300ms ease-in-out 800ms forwards;
        }
        .gb-label-1 {
          animation: gb-label-hide 150ms ease-in 800ms forwards;
        }
        .gb-label-2 {
          opacity: 0;
          animation: gb-label-show 150ms ease-out 1000ms forwards;
        }
      `}</style>

      <div
        className="gb-overlay fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
        aria-live="polite"
        aria-label="Zugang wird geprüft"
      >
        <div className="gb-shield-wrap">
          <svg
            width="64"
            height="64"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              className="gb-shield-body"
              d="M10 1.5L2.5 4.5V10C2.5 14 5.75 17.75 10 19.5C14.25 17.75 17.5 14 17.5 10V4.5L10 1.5Z"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              className="gb-check-path"
              d="M7 10l2 2 4-4"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="relative mt-4 h-5">
          <p className="gb-label-1 absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-sm text-[#73787a]">
            Zugang wird geprüft…
          </p>
          <p className="gb-label-2 absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-sm text-[#73787a]">
            Zugang gewährt.
          </p>
        </div>
      </div>
    </>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

const BuyerRegistration: React.FC = () => {
  const navigateBuyer        = useGridbidUiStore((s) => s.navigateBuyer);
  const setBuyerRegistration = useGridbidUiStore((s) => s.setBuyerRegistration);
  const buyerBidding         = useGridbidUiStore((s) => s.buyerBidding);

  const [step, setStep] = useState<1 | 2>(1);
  const [isGrantingAccess, setIsGrantingAccess] = useState(false);

  const [step1, setStep1] = useState<Step1Fields>({
    firstName: "", lastName: "", email: "", phone: "", countryCode: "+41",
  });
  const [step2, setStep2] = useState<Step2Fields>({
    financingStatus: null, purchaseTiming: null,
    budgetRange: null, housingSituation: null,
    interestedInSimilar: false, termsAccepted: false,
  });

  const [errors1, setErrors1] = useState<Step1Errors>({});
  const [errors2, setErrors2] = useState<Step2Errors>({});
  const [step2Submitted, setStep2Submitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const firstErrorRef = useRef<HTMLParagraphElement | null>(null);

  const phoneEntered = !!step1.phone.trim();
  const step2Complete = !!step2.financingStatus && !!step2.purchaseTiming;

  const inputBase = "w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:border-gw-500 focus:outline-none transition-colors";

  function handleStep1Continue() {
    const errs = validateStep1(step1);
    setErrors1(errs);
    if (!hasErrors(errs)) {
      setErrors2({});
      setStep(2);
    }
  }

  function handleBack() {
    if (step === 1) navigateBuyer("public");
    else { setStep2Submitted(false); setStep(1); }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep2Submitted(true);
    const errs = validateStep2(step2);
    setErrors2(errs);
    if (hasErrors(errs) || !step2.financingStatus || !step2.purchaseTiming) {
      setTimeout(() => {
        firstErrorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 0);
      return;
    }

    setIsSubmitting(true);
    const reg: BuyerRegistration = {
      firstName: step1.firstName.trim(),
      lastName:  step1.lastName.trim(),
      email:     step1.email.trim(),
      phone:     step1.phone.trim() ? `${step1.countryCode} ${step1.phone.trim()}` : "",
      financingStatus:     step2.financingStatus,
      purchaseTiming:      step2.purchaseTiming,
      budgetRange:         step2.budgetRange,
      housingSituation:    step2.housingSituation,
      interestedInSimilar: step2.interestedInSimilar,
    };
    setBuyerRegistration(reg);
    setIsGrantingAccess(true);
    setTimeout(() => navigateBuyer("dealroom"), 2200);
  }

  return (
    <div className="flex min-h-full flex-col bg-white">

      {isGrantingAccess && <AccessGrantedOverlay />}

      {/* ── Logo header ── */}
      <header className="sticky top-0 z-10 bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <GridBidLogoIcon />
            <span className="text-sm font-semibold tracking-tight text-gray-900">GridBid</span>
          </div>
          <AvatarDropdown>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#D1D5DB" }} />
          </AvatarDropdown>
        </div>
        <div className="h-px bg-gray-100" />
      </header>

      {/* ── Two-column content area ── */}
      <div className="flex flex-1">

        {/* ── Scrollable main column ── */}
        <main className="min-w-0 flex-1 pb-24">
          <div className="mx-auto max-w-2xl px-6 py-8">

            {/* Property context strip */}
            {buyerBidding && (
              <div className="mb-8 flex items-center gap-3 border-b border-gray-100 pb-6">
                {buyerBidding.imageUrl && (
                  <img
                    src={buyerBidding.imageUrl}
                    alt={buyerBidding.title}
                    className="h-14 w-20 shrink-0 rounded-lg object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-medium text-gray-900">{buyerBidding.title}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="truncate text-gray-400">{buyerBidding.address}</span>
                    {buyerBidding.websiteUrl && (
                      <>
                        <div className="h-3.5 w-px shrink-0 bg-gray-200" />
                        <a
                          href={buyerBidding.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex shrink-0 items-center gap-1 font-medium text-gray-900 hover:text-gw-600"
                        >
                          Objektwebsite
                          <ExternalLinkIcon />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step indicator */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 font-mono text-sm font-medium text-white">
                {step}
              </div>
              <span className="text-base font-bold text-gray-900">
                {step === 1 ? "Registrieren" : "Käuferprofil"}
              </span>
            </div>

            {/* ── Step 1: contact details ── */}
            {step === 1 && (
              <div className="space-y-6">

                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Deine Kontaktdaten</h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Keine Weitergabe an Dritte. Nur Informationen zu diesem Objekt.
                  </p>
                </div>

                {/* Vorname + Nachname side by side */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Vorname</label>
                    <input
                      type="text"
                      value={step1.firstName}
                      onChange={(e) => setStep1((s) => ({ ...s, firstName: e.target.value }))}
                      placeholder="Anna"
                      className={errors1.firstName ? `${inputBase} border-red-400` : `${inputBase} border-gray-200`}
                    />
                    {errors1.firstName && <p className="mt-1 text-xs text-red-500">{errors1.firstName}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Nachname</label>
                    <input
                      type="text"
                      value={step1.lastName}
                      onChange={(e) => setStep1((s) => ({ ...s, lastName: e.target.value }))}
                      placeholder="Müller"
                      className={errors1.lastName ? `${inputBase} border-red-400` : `${inputBase} border-gray-200`}
                    />
                    {errors1.lastName && <p className="mt-1 text-xs text-red-500">{errors1.lastName}</p>}
                  </div>
                </div>

                {/* E-Mail */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">E-Mail</label>
                  <input
                    type="email"
                    value={step1.email}
                    onChange={(e) => setStep1((s) => ({ ...s, email: e.target.value }))}
                    placeholder="anna@beispiel.ch"
                    className={errors1.email ? `${inputBase} border-red-400` : `${inputBase} border-gray-200`}
                  />
                  {errors1.email ? (
                    <p className="mt-1 text-xs text-red-500">{errors1.email}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-400">Kein Spam. Nur Updates zu diesem Objekt.</p>
                  )}
                </div>

                {/* Telefon with country code selector */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Telefon <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <div className="flex items-stretch gap-2">
                    <CountryCodeSelector
                      value={step1.countryCode}
                      onChange={(code) => setStep1((s) => ({ ...s, countryCode: code }))}
                    />
                    <div className="flex flex-1 items-center rounded-lg border border-gray-200 px-3 py-2.5 transition-colors focus-within:border-gw-500">
                      <span className="mr-2 shrink-0 font-mono text-sm text-gray-400">
                        {step1.countryCode}
                      </span>
                      <input
                        type="tel"
                        value={step1.phone}
                        onChange={(e) => setStep1((s) => ({ ...s, phone: e.target.value }))}
                        placeholder="79 123 45 67"
                        className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-300 focus:outline-none"
                      />
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">Hilft bei Rückfragen und der Koordination.</p>
                </div>

              </div>
            )}

            {/* ── Step 2: buyer questionnaire ── */}
            {step === 2 && (
              <form id="reg-step2" onSubmit={handleSubmit} className="space-y-7">

                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Hilf uns, dir das beste Erlebnis zu geben...
                  </h1>
                  <p className="mt-1.5 text-sm text-gray-500">
                    Mit dem Käuferprofil baust du Vertrauen bei der Agentur auf und erhältst
                    erweiterten Zugang zu Unterlagen. Du kannst die Angaben jederzeit anpassen.
                  </p>
                </div>

                {/* Finanzierung — required, radio cards */}
                <div>
                  <p className="mb-3 text-sm font-medium text-gray-700">
                    Wie weit bist du mit der Finanzierung?
                  </p>
                  <div className="space-y-2">
                    {FINANCING_OPTIONS.map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 px-4 py-3.5 transition-colors ${
                          step2.financingStatus === opt.value
                            ? "border-gw-600 bg-gw-50"
                            : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="financing"
                          value={opt.value}
                          checked={step2.financingStatus === opt.value}
                          onChange={() => { setStep2((s) => ({ ...s, financingStatus: opt.value })); setErrors2((e) => ({ ...e, financingStatus: undefined })); }}
                          className="mt-0.5 accent-gw-600"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                          <p className="text-xs text-gray-400">{opt.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {step2Submitted && errors2.financingStatus && (
                    <p ref={firstErrorRef} className="mt-2 text-xs text-red-500">{errors2.financingStatus}</p>
                  )}
                </div>

                {/* Kaufzeitpunkt — required, radio cards */}
                <div>
                  <p className="mb-3 text-sm font-medium text-gray-700">Wann planst du den Kauf?</p>
                  <div className="space-y-2">
                    {TIMING_OPTIONS.map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 px-4 py-3.5 transition-colors ${
                          step2.purchaseTiming === opt.value
                            ? "border-gw-600 bg-gw-50"
                            : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="timing"
                          value={opt.value}
                          checked={step2.purchaseTiming === opt.value}
                          onChange={() => { setStep2((s) => ({ ...s, purchaseTiming: opt.value })); setErrors2((e) => ({ ...e, purchaseTiming: undefined })); }}
                          className="accent-gw-600"
                        />
                        <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                      </label>
                    ))}
                  </div>
                  {step2Submitted && errors2.purchaseTiming && (
                    <p ref={!errors2.financingStatus ? firstErrorRef : undefined} className="mt-2 text-xs text-red-500">{errors2.purchaseTiming}</p>
                  )}
                </div>

                <hr className="border-gray-100" />

                {/* Budget — optional, pill chips */}
                <div>
                  <p className="mb-3 text-sm font-medium text-gray-700">
                    Ungefähres Budget (CHF){" "}
                    <span className="font-normal text-gray-400">(optional)</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {BUDGET_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setStep2((s) => ({
                            ...s,
                            budgetRange: s.budgetRange === opt.value ? null : opt.value,
                          }))
                        }
                        className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                          step2.budgetRange === opt.value
                            ? "border-gw-600 bg-gw-50 font-medium text-gw-700"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wohnsituation — optional, full-width selectable rows */}
                <div>
                  <p className="mb-3 text-sm font-medium text-gray-700">
                    Wie wohnst du aktuell?{" "}
                    <span className="font-normal text-gray-400">(optional)</span>
                  </p>
                  <div className="space-y-2">
                    {HOUSING_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setStep2((s) => ({
                            ...s,
                            housingSituation: s.housingSituation === opt.value ? null : opt.value,
                          }))
                        }
                        className={`flex w-full items-center rounded-lg border-2 px-4 py-3.5 text-left transition-colors ${
                          step2.housingSituation === opt.value
                            ? "border-gw-600 bg-gw-50"
                            : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <span className={`text-sm font-medium ${
                          step2.housingSituation === opt.value ? "text-gw-700" : "text-gray-900"
                        }`}>
                          {opt.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Nutzungsbedingungen — required */}
                <div>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={step2.termsAccepted}
                      onChange={(e) => { setStep2((s) => ({ ...s, termsAccepted: e.target.checked })); setErrors2((err) => ({ ...err, termsAccepted: undefined })); }}
                      className="mt-0.5 accent-gw-600"
                    />
                    <p className="text-sm text-gray-600">
                      Ich bestätige, dass meine Angaben der Wahrheit entsprechen, und stimme den{" "}
                      <a
                        href="#"
                        className="underline underline-offset-2 hover:text-gray-900"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Nutzungsbedingungen
                      </a>{" "}
                      von Gridbid zu.
                    </p>
                  </label>
                  {step2Submitted && errors2.termsAccepted && (
                    <p ref={!errors2.financingStatus && !errors2.purchaseTiming ? firstErrorRef : undefined} className="mt-1.5 text-xs text-red-500">{errors2.termsAccepted}</p>
                  )}
                </div>

                {/* Ähnliche Objekte — optional marketing opt-in */}
                <div>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={step2.interestedInSimilar}
                      onChange={(e) => setStep2((s) => ({ ...s, interestedInSimilar: e.target.checked }))}
                      className="mt-0.5 accent-gw-600"
                    />
                    <p className="text-sm text-gray-500">
                      Ich möchte auch über ähnliche Objekte in dieser Region informiert werden.
                    </p>
                  </label>
                </div>

              </form>
            )}

          </div>
        </main>

        {/* ── Verification panel sidebar ── */}
        <aside className="w-[260px] shrink-0 border-l border-gray-100">
          <div className="sticky top-[57px] p-5">
            <VerificationLevelPanel
              step={step}
              phoneEntered={phoneEntered}
              step2Complete={step2Complete}
            />
          </div>
        </aside>

      </div>

      {/* ── Sticky footer ── */}
      <footer className="sticky bottom-0 z-10 border-t border-gray-200 bg-white pr-[260px]">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
            aria-label="Zurück"
          >
            <ArrowLeftIcon />
          </button>
          {step === 1 ? (
            <button
              type="button"
              onClick={handleStep1Continue}
              className="flex items-center gap-2 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
            >
              Weiter
              <ArrowRightSmIcon />
            </button>
          ) : (
            <button
              type="submit"
              form="reg-step2"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Wird vorbereitet …" : "Deal Room öffnen"}
              {!isSubmitting && <ArrowRightSmIcon />}
            </button>
          )}
        </div>
      </footer>

    </div>
  );
};

export default BuyerRegistration;
