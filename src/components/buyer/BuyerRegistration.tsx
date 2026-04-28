import React, { useState } from "react";
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

// ── Local form types ──────────────────────────────────────────────────────────

interface Step1Fields {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Step1Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface Step2Fields {
  financingStatus: FinancingStatus | null;
  purchaseTiming: PurchaseTiming | null;
  budgetRange: BudgetRange | null;
  housingSituation: HousingSituation | null;
  interestedInSimilar: boolean;
  termsAccepted: boolean;
}

interface Step2Errors {
  financingStatus?: string;
  purchaseTiming?: string;
  termsAccepted?: string;
}

// ── Profile status — computed reactively from form state ──────────────────────

type ProfileItemStatus = "complete" | "progress" | "pending";

interface ProfileItem {
  label: string;
  status: ProfileItemStatus;
  text: string;
}

function computeProfileItems(s: Step2Fields): ProfileItem[] {
  const kaufvorhabenDone = !!s.financingStatus && !!s.purchaseTiming;
  const budgetDone       = !!s.budgetRange;
  return [
    {
      label: "Kontaktdaten",
      status: "complete",
      text:   "Vollständig",
    },
    {
      label: "Kaufvorhaben",
      status: kaufvorhabenDone ? "complete" : "progress",
      text:   kaufvorhabenDone ? "Vollständig" : "in Bearbeitung",
    },
    {
      label:  "Budget",
      status: budgetDone ? "complete" : "pending",
      text:   budgetDone ? "Vollständig" : "Offen",
    },
    {
      label:  "Finanzierungsnachweis",
      status: "pending",
      text:   "Offen",
    },
    {
      label:  "Identitätsverifizierung",
      status: "pending",
      text:   "Offen",
    },
  ];
}

// ── Profile status icons ──────────────────────────────────────────────────────

function IconComplete() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0 text-green-500" viewBox="0 0 16 16" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M8 15A7 7 0 108 1a7 7 0 000 14zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function IconProgress() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0 text-gw-600" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="3" fill="currentColor" />
    </svg>
  );
}

function IconPending() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0 text-gray-300" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

// ── Profilstatus panel (right sidebar) ───────────────────────────────────────

function ProfilstatusPanel({ items }: { items: ProfileItem[] }) {
  return (
    <div className="flex h-full flex-col px-6 py-8">

      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
          <svg className="h-[18px] w-[18px] text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-900">Dein Profil</h3>
        <p className="mt-0.5 text-xs text-gray-400">Basiszugang</p>
      </div>

      {/* Items */}
      <div className="flex-1">
        {items.map((item, i) => (
          <div
            key={item.label}
            className={`flex items-center justify-between py-4 ${
              i < items.length - 1 ? "border-b border-gray-50" : ""
            }`}
          >
            <div className="flex min-w-0 items-center gap-3">
              {item.status === "complete" ? <IconComplete /> :
               item.status === "progress" ? <IconProgress /> :
               <IconPending />}
              <span className={`truncate text-sm ${
                item.status === "pending" ? "text-gray-400" : "text-gray-700"
              }`}>
                {item.label}
              </span>
            </div>
            <span className={`ml-2 shrink-0 text-xs font-medium ${
              item.status === "complete" ? "text-green-600" :
              item.status === "progress" ? "text-gw-600" :
              "text-gray-300"
            }`}>
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* Footer — pinned to bottom */}
      <p className="mt-auto pt-6 text-xs leading-relaxed text-gray-400">
        Mit vollständigem Profil schaffst du Vertrauen bei der Agentur und erhältst
        erweiterten Zugang zu Unterlagen.
      </p>

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

// ── Component ─────────────────────────────────────────────────────────────────

const BuyerRegistration: React.FC = () => {
  const navigateBuyer        = useGridbidUiStore((s) => s.navigateBuyer);
  const setBuyerRegistration = useGridbidUiStore((s) => s.setBuyerRegistration);
  const buyerBidding         = useGridbidUiStore((s) => s.buyerBidding);

  const [step, setStep] = useState<1 | 2>(1);

  const [step1, setStep1] = useState<Step1Fields>({
    firstName: "", lastName: "", email: "", phone: "",
  });
  const [step2, setStep2] = useState<Step2Fields>({
    financingStatus: null, purchaseTiming: null,
    budgetRange: null, housingSituation: null,
    interestedInSimilar: false, termsAccepted: false,
  });

  const [errors1, setErrors1] = useState<Step1Errors>({});
  const [errors2, setErrors2] = useState<Step2Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleStep1Continue() {
    const errs = validateStep1(step1);
    setErrors1(errs);
    if (!hasErrors(errs)) setStep(2);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateStep2(step2);
    setErrors2(errs);
    if (hasErrors(errs) || !step2.financingStatus || !step2.purchaseTiming) return;

    setIsSubmitting(true);

    const reg: BuyerRegistration = {
      firstName: step1.firstName.trim(),
      lastName:  step1.lastName.trim(),
      email:     step1.email.trim(),
      phone:     step1.phone.trim(),
      financingStatus:     step2.financingStatus,
      purchaseTiming:      step2.purchaseTiming,
      budgetRange:         step2.budgetRange,
      housingSituation:    step2.housingSituation,
      interestedInSimilar: step2.interestedInSimilar,
      // termsAccepted is consent metadata — not stored in buyer profile
    };

    setBuyerRegistration(reg);
    setTimeout(() => navigateBuyer("dealroom"), 800);
  }

  // ── Input class helpers ──────────────────────────────────────────────────────

  const inputBase = "w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:border-gw-500 focus:outline-none transition-colors";
  const inputNormal = `${inputBase} border-gray-200`;
  const inputError  = `${inputBase} border-red-400`;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-full bg-white">

      {/* Property context strip — full width, anchors user across both steps */}
      {buyerBidding && (
        <div className="border-b border-gray-100 bg-white px-6 py-3">
          <div className="mx-auto flex max-w-2xl items-center gap-3">
            {buyerBidding.imageUrl && (
              <img
                src={buyerBidding.imageUrl}
                alt={buyerBidding.title}
                className="h-11 w-16 shrink-0 rounded-lg object-cover"
              />
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">
                {buyerBidding.title}
              </p>
              <p className="truncate text-xs text-gray-400">{buyerBidding.address}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 1 ──────────────────────────────────────────────────────────── */}
      {step === 1 && (
        <div key="step1" className="mx-auto max-w-2xl animate-fade-in px-6 py-10">

          {/* Back to entry page */}
          <button
            onClick={() => navigateBuyer("public")}
            className="mb-6 flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700"
          >
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 4L6 8l4 4" />
            </svg>
            Zurück
          </button>

          <div className="mb-4 flex items-center gap-3">
            <p className="text-xs text-gray-400">Schritt 1 von 2</p>
            <span className="text-xs text-gray-300">·</span>
            <p className="text-xs text-gray-400">Dauert weniger als 1 Minute</p>
          </div>

          <div className="mb-8">
            <h1 className="mb-2 text-xl font-semibold text-gray-900">
              Dein Zugang zum Deal Room beginnt hier
            </h1>
            <p className="mb-1.5 text-sm text-gray-600">
              Gib deine Kontaktdaten ein, damit wir dir den Zugang zum Deal Room freischalten können.
            </p>
            <p className="text-sm text-gray-400">
              Keine Weitergabe an Dritte. Nur Informationen zu diesem Objekt.
            </p>
          </div>

          <div className="space-y-5">

            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Vorname
                </label>
                <input
                  type="text"
                  value={step1.firstName}
                  onChange={(e) => setStep1((s) => ({ ...s, firstName: e.target.value }))}
                  placeholder="Anna"
                  className={errors1.firstName ? inputError : inputNormal}
                />
                {errors1.firstName && (
                  <p className="mt-1 text-xs text-red-500">{errors1.firstName}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Nachname
                </label>
                <input
                  type="text"
                  value={step1.lastName}
                  onChange={(e) => setStep1((s) => ({ ...s, lastName: e.target.value }))}
                  placeholder="Müller"
                  className={errors1.lastName ? inputError : inputNormal}
                />
                {errors1.lastName && (
                  <p className="mt-1 text-xs text-red-500">{errors1.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                E-Mail-Adresse
              </label>
              <input
                type="email"
                value={step1.email}
                onChange={(e) => setStep1((s) => ({ ...s, email: e.target.value }))}
                placeholder="anna@beispiel.ch"
                className={errors1.email ? inputError : inputNormal}
              />
              {errors1.email ? (
                <p className="mt-1 text-xs text-red-500">{errors1.email}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-400">
                  Kein Spam. Nur Updates zu diesem Objekt.
                </p>
              )}
            </div>

            {/* Phone — optional */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Telefon{" "}
                <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <input
                type="tel"
                value={step1.phone}
                onChange={(e) => setStep1((s) => ({ ...s, phone: e.target.value }))}
                placeholder="+41 79 123 45 67"
                className={inputNormal}
              />
              <p className="mt-1 text-xs text-gray-400">
                Hilft bei Rückfragen und der Koordination.
              </p>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={handleStep1Continue}
              className="w-full rounded-xl bg-gw-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-gw-500"
            >
              Weiter zu den letzten Angaben
            </button>

            <p className="text-center text-xs text-gray-400">
              Dauert weniger als 1 Minute.
            </p>

          </div>
        </div>
      )}

      {/* ── Step 2: flex layout with full-height profile sidebar ─────────── */}
      {step === 2 && (
        <div key="step2" className="animate-fade-in flex">

          {/* Form column */}
          <div className="min-w-0 flex-1 px-6 py-10">
          <div className="mx-auto max-w-2xl">

          <p className="mb-6 text-xs text-gray-400">Schritt 2 von 2</p>

            {/* ── Qualification form ── */}
            <form onSubmit={handleSubmit} className="space-y-7">

              <div>
                <h1 className="mb-2 text-xl font-semibold text-gray-900">
                  Fast geschafft – nur noch wenige Fragen
                </h1>
                <p className="text-sm text-gray-500">
                  Diese Angaben helfen bei der Qualifikation deines Interesses.
                  Du kannst sie später jederzeit anpassen.
                </p>
              </div>

              {/* Financing — required */}
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
                        onChange={() => setStep2((s) => ({ ...s, financingStatus: opt.value }))}
                        className="mt-0.5 accent-gw-600"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                        <p className="text-xs text-gray-400">{opt.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {errors2.financingStatus && (
                  <p className="mt-2 text-xs text-red-500">{errors2.financingStatus}</p>
                )}
              </div>

              {/* Purchase timing — required */}
              <div>
                <p className="mb-3 text-sm font-medium text-gray-700">
                  Wann planst du den Kauf?
                </p>
                <div className="space-y-2">
                  {TIMING_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 px-4 py-3 transition-colors ${
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
                        onChange={() => setStep2((s) => ({ ...s, purchaseTiming: opt.value }))}
                        className="accent-gw-600"
                      />
                      <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                    </label>
                  ))}
                </div>
                {errors2.purchaseTiming && (
                  <p className="mt-2 text-xs text-red-500">{errors2.purchaseTiming}</p>
                )}
              </div>

              {/* ── Optional section — open layout, no box ── */}
              <hr className="border-gray-100" />

              <div className="space-y-6">

                {/* Budget — optional, improves profile status */}
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-700">
                    Ungefähres Budget{" "}
                    <span className="font-normal text-gray-400">(optional)</span>
                  </p>
                  <p className="mb-3 text-xs text-gray-400">
                    Diese Informationen helfen bei der Empfehlungen von ähnlichen Objekten. Die Angaben werden nicht mit der Verkäuferschaft geteilt.
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

                {/* Housing situation — most secondary, CRM enrichment only */}
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Wie wohnst du aktuell?{" "}
                    <span className="font-normal text-gray-400">(optional)</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
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
                        className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                          step2.housingSituation === opt.value
                            ? "border-gw-600 bg-gw-50 font-medium text-gw-700"
                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* ── Legal + submission ── */}
              <hr className="border-gray-100" />

              {/* Terms — required */}
              <div>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={step2.termsAccepted}
                    onChange={(e) =>
                      setStep2((s) => ({ ...s, termsAccepted: e.target.checked }))
                    }
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
                {errors2.termsAccepted && (
                  <p className="mt-1.5 text-xs text-red-500">{errors2.termsAccepted}</p>
                )}
              </div>

              {/* Similar objects — optional marketing opt-in, visually separated from legal */}
              <div className="rounded-lg bg-gray-50 px-4 py-3">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={step2.interestedInSimilar}
                    onChange={(e) =>
                      setStep2((s) => ({ ...s, interestedInSimilar: e.target.checked }))
                    }
                    className="mt-0.5 accent-gw-600"
                  />
                  <p className="text-sm text-gray-500">
                    Ich bin auch an ähnlichen Objekten in dieser Region interessiert.
                  </p>
                </label>
              </div>

              {/* Button row */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700"
                >
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 4L6 8l4 4" />
                  </svg>
                  Zurück
                </button>
                <div className="flex-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-gw-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-gw-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? "Wird vorbereitet …" : "Deal Room öffnen"}
                  </button>
                  <p className="mt-2 text-center text-xs text-gray-400">
                    Unterlagen sofort verfügbar · Nur für die Agentur sichtbar
                  </p>
                </div>
              </div>

            </form>

          </div>
          </div>

          {/* Profile sidebar — sticky, natural height */}
          <aside className="w-72 shrink-0 px-5 pt-10">
            <div className="sticky top-6">
              <ProfilstatusPanel items={computeProfileItems(step2)} />
            </div>
          </aside>

        </div>
      )}

    </div>
  );
};

export default BuyerRegistration;
