import React, { useRef, useState } from "react";
import { PriceDisplay, ProcessType, type CreateDraftInput } from "../types/domain";

interface StepProcessProps {
  draft: CreateDraftInput;
  onChange: (patch: Partial<CreateDraftInput>) => void;
  onBack: () => void;
  onNext: () => void;
}

type PresetId = "standard" | "preisgeführt" | "mehrstufig";

interface Preset {
  id: PresetId;
  label: string;
  badge?: string;
  description: string;
  typischFür: string;
  fürKäufer: string;
  confirmation: string;
  config: Partial<CreateDraftInput>;
}

const PRESETS: Preset[] = [
  {
    id: "standard",
    label: "Standard",
    badge: "Empfohlen",
    description: "Einmaliges, verdecktes Verfahren ohne Preisangabe.",
    typischFür: "unkomplizierte Verkäufe mit klarem Ablauf",
    fürKäufer: "Kein Preis sichtbar · einmaliges Angebot",
    confirmation: "Typisches Verfahren für die meisten Verkäufe.",
    config: {
      processType: ProcessType.SEALED_BID,
      roundsPlanned: 1,
      priceDisplay: PriceDisplay.HIDDEN,
      deadline: null,
    },
  },
  {
    id: "preisgeführt",
    label: "Preisgeführt",
    description: "Bieter orientieren sich an einem Richtpreis. Die Gebote bleiben verdeckt.",
    typischFür: "Objekte, bei denen eine Preisorientierung sinnvoll ist",
    fürKäufer: "Richtpreis sichtbar · Gebot bleibt verdeckt",
    confirmation: "Geeignet, wenn ein Preis als Orientierung sinnvoll ist.",
    config: {
      processType: ProcessType.SEALED_BID,
      roundsPlanned: 1,
      priceDisplay: PriceDisplay.PRICE,
      deadline: null,
    },
  },
  {
    id: "mehrstufig",
    label: "Mehrstufig",
    description: "Mehrere Runden mit steigendem Wettbewerbsdruck.",
    typischFür: "stark nachgefragte Lagen und kompetitive Verfahren",
    fürKäufer: "Mehrere Runden · Angebot anpassbar",
    confirmation: "Empfehlenswert für stark nachgefragte Objekte.",
    config: {
      processType: ProcessType.SEALED_BID,
      roundsPlanned: 2,
      priceDisplay: PriceDisplay.HIDDEN,
      deadline: null,
    },
  },
];

function detectPreset(draft: CreateDraftInput): PresetId | null {
  const pt = draft.processType ?? ProcessType.SEALED_BID;
  const r = draft.roundsPlanned ?? 1;
  const pd = draft.priceDisplay ?? PriceDisplay.HIDDEN;
  if (pt === ProcessType.SEALED_BID && r === 1 && pd === PriceDisplay.HIDDEN) return "standard";
  if (pt === ProcessType.SEALED_BID && r === 1 && pd === PriceDisplay.PRICE) return "preisgeführt";
  if (pt === ProcessType.SEALED_BID && r === 2 && pd === PriceDisplay.HIDDEN) return "mehrstufig";
  return null;
}

const PROCESS_OPTIONS = [
  {
    value: ProcessType.SEALED_BID,
    label: "Verdeckt",
    description: "Gebote bleiben bis Fristablauf vertraulich — Standard in der Schweiz.",
    badge: "Empfohlen",
  },
  {
    value: ProcessType.OPEN_BID,
    label: "Offen",
    description: "Alle Bieter sehen die aktuellen Gebote der anderen.",
    badge: null,
  },
];

const ROUNDS_OPTIONS = [
  { value: 1, label: "1 Runde", description: "Einmaliges Verfahren. Klar und effizient." },
  { value: 2, label: "2 Runden", description: "Bieter können nach Runde 1 nachbessern." },
  { value: 3, label: "3 Runden", description: "Maximaler Wettbewerbsdruck. Für kompetitive Lagen." },
];

// Sharpened: label names the action, description names the buyer experience
const PRICE_OPTIONS: { value: PriceDisplay; label: string; description: string }[] = [
  {
    value: PriceDisplay.HIDDEN,
    label: "Kein Preis anzeigen",
    description: "Käufer bieten frei — kein Preis sichtbar.",
  },
  {
    value: PriceDisplay.PRICE,
    label: "Richtpreis anzeigen",
    description: "Käufer sehen einen Richtwert und bieten verdeckt.",
  },
  {
    value: PriceDisplay.RANGE,
    label: "Preisspanne anzeigen",
    description: "Käufer bewegen sich in einem definierten Rahmen.",
  },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconStandard = ({ active }: { active: boolean }) => (
  <svg
    width="48"
    height="36"
    viewBox="0 0 48 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={active ? "text-gw-500" : "text-zinc-300"}
  >
    <rect x="8" y="4" width="32" height="22" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 10L24 20L40 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="18" y="26" width="12" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <path d="M24 32V36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconPreisgeführt = ({ active }: { active: boolean }) => (
  <svg
    width="48"
    height="36"
    viewBox="0 0 48 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={active ? "text-gw-500" : "text-zinc-300"}
  >
    <path
      d="M8 28L16 18L24 22L32 12L40 8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 20H40"
      stroke="currentColor"
      strokeWidth="1"
      strokeDasharray="3 2"
      strokeLinecap="round"
    />
    <circle cx="40" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const IconMehrstufig = ({ active }: { active: boolean }) => (
  <svg
    width="48"
    height="36"
    viewBox="0 0 48 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={active ? "text-gw-500" : "text-zinc-300"}
  >
    <path
      d="M8 32H18V22H28V14H38V6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M34 6H38V10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PRESET_ICONS = {
  standard: IconStandard,
  preisgeführt: IconPreisgeführt,
  mehrstufig: IconMehrstufig,
} as const;

// ─── Radio option row ─────────────────────────────────────────────────────────

const RadioOption = ({
  selected,
  label,
  description,
  badge,
  onClick,
  children,
}: {
  selected: boolean;
  label: string;
  description: string;
  badge?: string | null;
  onClick: () => void;
  children?: React.ReactNode;
}) => (
  <div>
    <button
      onClick={onClick}
      className={`flex w-full cursor-pointer items-start gap-3 rounded-lg border px-4 py-3.5 text-left transition-colors ${
        selected
          ? "border-gw-200 bg-gw-50"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
      }`}
    >
      <span
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          selected ? "border-gw-500" : "border-zinc-300"
        }`}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-gw-500" />}
      </span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${selected ? "text-zinc-900" : "text-zinc-700"}`}>
            {label}
          </span>
          {badge && (
            <span className="rounded border border-gw-200 bg-gw-50 px-1.5 py-0.5 text-xs font-medium text-gw-600">
              {badge}
            </span>
          )}
        </div>
        <p className={`mt-0.5 text-xs ${selected ? "text-zinc-600" : "text-zinc-400"}`}>
          {description}
        </p>
      </div>
    </button>
    {children}
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

const StepProcess: React.FC<StepProcessProps> = ({ draft, onChange, onBack, onNext }) => {
  const [guidePrice, setGuidePrice] = useState("");
  const [priceRangeMin, setPriceRangeMin] = useState("");
  const [priceRangeMax, setPriceRangeMax] = useState("");
  const [configHighlighted, setConfigHighlighted] = useState(false);

  const [appliedPreset, setAppliedPreset] = useState<Preset | null>(() => {
    const id = detectPreset(draft);
    return id ? (PRESETS.find((p) => p.id === id) ?? null) : null;
  });

  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activePreset = detectPreset(draft);
  const deadlineEnabled = draft.deadline !== null && draft.deadline !== undefined;
  const rounds = draft.roundsPlanned ?? 1;
  const priceDisplay = draft.priceDisplay ?? PriceDisplay.HIDDEN;

  function applyPreset(preset: Preset) {
    onChange(preset.config);
    setAppliedPreset(preset);
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    setConfigHighlighted(true);
    highlightTimer.current = setTimeout(() => setConfigHighlighted(false), 500);
  }

  function handleDeadlineToggle(enabled: boolean) {
    if (enabled) {
      const d = new Date();
      d.setDate(d.getDate() + 14);
      d.setHours(17, 0, 0, 0);
      onChange({ deadline: d.toISOString() });
    } else {
      onChange({ deadline: null });
    }
  }

  return (
    <div className="flex flex-col gap-10">

      {/* ── Step intro ───────────────────────────────────────────────────────── */}
      <div>
        <h2 className="mb-1 text-lg font-semibold text-zinc-900">
          Wie soll das Bieterverfahren ablaufen?
        </h2>
        <p className="text-sm text-zinc-500">
          Wähle eine Vorlage — du kannst alle Einstellungen danach anpassen.
        </p>
      </div>

      {/* ── Preset cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {PRESETS.map((preset) => {
          const selected = activePreset === preset.id;
          const Icon = PRESET_ICONS[preset.id];
          return (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className={`relative flex cursor-pointer flex-col gap-2 rounded-xl border-2 px-5 py-5 text-left transition-all duration-150 ${
                selected
                  ? "border-gw-500 bg-gw-50 shadow-[0_0_0_3px_rgba(127,119,221,0.12)]"
                  : "border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              {/* Empfohlen badge */}
              {preset.badge && (
                <span className="absolute right-3 top-3 rounded border border-gw-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gw-600">
                  {preset.badge}
                </span>
              )}

              {/* Illustration */}
              <div className="mb-1">
                <Icon active={selected} />
              </div>

              {/* Title */}
              <span className={`text-sm font-semibold ${selected ? "text-gw-600" : "text-zinc-800"}`}>
                {preset.label}
              </span>

              {/* Decision sentence */}
              <p className="text-xs leading-relaxed text-zinc-500">{preset.description}</p>

              {/* Contextual meta — visually receded */}
              <p className="text-[11px] text-gray-400">
                <span className="font-medium">Typisch für:</span> {preset.typischFür}
              </p>
              <p className="text-[11px] text-gray-400">
                <span className="font-medium">Für Käufer:</span> {preset.fürKäufer}
              </p>

              {/* Checkmark when selected */}
              {selected && (
                <span className="absolute bottom-3 right-3 flex h-4 w-4 items-center justify-center rounded-full bg-gw-600">
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path
                      d="M1 3L3 5L7 1"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Configuration — divided sections, no heavy box ────────────────────── */}
      <div className="flex flex-col gap-2">

        {/* Section header with attribution + confirmation */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-zinc-600">So funktioniert das Verfahren</p>
          {appliedPreset && (
            <div className="mt-1 flex flex-col gap-0.5">
              <p className="text-xs text-gw-500">Basierend auf „{appliedPreset.label}"</p>
              <p className="flex items-center gap-1 text-xs text-zinc-400">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  className="shrink-0 text-gw-400"
                >
                  <circle cx="5" cy="5" r="4.5" stroke="currentColor" strokeWidth="1" />
                  <path
                    d="M3 5L4.5 6.5L7 3.5"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {appliedPreset.confirmation}
              </p>
            </div>
          )}
        </div>

        {/* Config card — light border, internal dividers create rhythm */}
        <div
          className={`divide-y rounded-xl border transition-colors duration-500 ${
            configHighlighted
              ? "divide-gw-100 border-gw-200 bg-gw-50/50"
              : "divide-zinc-100 border-zinc-100 bg-white"
          }`}
        >
          {/* Verfahrensart */}
          <div className="px-6 py-5">
            <p className="mb-3 text-xs font-medium text-zinc-400">Verfahrensart</p>
            <div className="flex flex-col gap-2">
              {PROCESS_OPTIONS.map(({ value, label, description, badge }) => (
                <RadioOption
                  key={value}
                  selected={(draft.processType ?? ProcessType.SEALED_BID) === value}
                  label={label}
                  description={description}
                  badge={badge}
                  onClick={() => onChange({ processType: value })}
                />
              ))}
            </div>
          </div>

          {/* Rundenanzahl */}
          <div className="px-6 py-5">
            <p className="mb-3 text-xs font-medium text-zinc-400">Rundenanzahl</p>
            <div className="flex flex-col gap-2">
              {ROUNDS_OPTIONS.map(({ value, label, description }) => (
                <RadioOption
                  key={value}
                  selected={rounds === value}
                  label={label}
                  description={description}
                  onClick={() => onChange({ roundsPlanned: value })}
                />
              ))}
            </div>
          </div>

          {/* Preisorientierung */}
          <div className="px-6 py-5">
            <p className="mb-3 text-xs font-medium text-zinc-400">Preisorientierung</p>
            <div className="flex flex-col gap-2">
              {PRICE_OPTIONS.map(({ value, label, description }) => {
                const selected = priceDisplay === value;
                return (
                  <RadioOption
                    key={value}
                    selected={selected}
                    label={label}
                    description={description}
                    onClick={() => onChange({ priceDisplay: value })}
                  >
                    {selected && value === PriceDisplay.PRICE && (
                      <div className="mt-2 px-1">
                        <input
                          type="text"
                          value={guidePrice}
                          onChange={(e) => setGuidePrice(e.target.value)}
                          placeholder="CHF 1'200'000"
                          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-gw-500 focus:outline-none"
                        />
                      </div>
                    )}
                    {selected && value === PriceDisplay.RANGE && (
                      <div className="mt-2 flex items-center gap-3 px-1">
                        <input
                          type="text"
                          value={priceRangeMin}
                          onChange={(e) => setPriceRangeMin(e.target.value)}
                          placeholder="CHF 900'000"
                          className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-gw-500 focus:outline-none"
                        />
                        <span className="text-sm text-zinc-400">bis</span>
                        <input
                          type="text"
                          value={priceRangeMax}
                          onChange={(e) => setPriceRangeMax(e.target.value)}
                          placeholder="CHF 1'100'000"
                          className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-gw-500 focus:outline-none"
                        />
                      </div>
                    )}
                  </RadioOption>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Angebotsfrist — lightweight standalone row ────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 px-5 py-4">
          <div>
            <p className="text-sm font-medium text-zinc-700">Angebotsfrist</p>
            <p className="mt-0.5 text-xs text-zinc-400">
              {deadlineEnabled
                ? "Frist ist aktiv — Angebote können nur bis zum Ablauf eingereicht werden."
                : "Ohne Frist können Angebote unbegrenzt eingehen."}
            </p>
          </div>
          <button
            role="switch"
            aria-checked={deadlineEnabled}
            onClick={() => handleDeadlineToggle(!deadlineEnabled)}
            className={`relative ml-4 inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
              deadlineEnabled ? "bg-gw-600" : "bg-zinc-300"
            }`}
          >
            <span
              className={`mt-0.5 inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                deadlineEnabled ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {deadlineEnabled && (
          <div className="flex gap-3 px-1">
            <input
              type="date"
              value={draft.deadline ? new Date(draft.deadline).toISOString().slice(0, 10) : ""}
              onChange={(e) => {
                const time = draft.deadline
                  ? new Date(draft.deadline).toTimeString().slice(0, 5)
                  : "17:00";
                onChange({
                  deadline: e.target.value
                    ? new Date(`${e.target.value}T${time}`).toISOString()
                    : null,
                });
              }}
              className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-colors focus:border-gw-500 focus:outline-none"
            />
            <input
              type="time"
              value={
                draft.deadline ? new Date(draft.deadline).toTimeString().slice(0, 5) : "17:00"
              }
              onChange={(e) => {
                const date = draft.deadline
                  ? new Date(draft.deadline).toISOString().slice(0, 10)
                  : new Date().toISOString().slice(0, 10);
                onChange({
                  deadline: e.target.value
                    ? new Date(`${date}T${e.target.value}`).toISOString()
                    : null,
                });
              }}
              className="w-32 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-colors focus:border-gw-500 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* ── Notes — always visible ────────────────────────────────────────────── */}
      <div>
        <p className="mb-0.5 text-sm font-semibold text-zinc-600">
          Informationen für Interessenten
        </p>
        <p className="mb-3 text-xs text-zinc-400">
          Diese Informationen sehen Interessenten direkt im Bieterportal.
        </p>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">
          Hinweise für Interessent:innen{" "}
          <span className="font-normal text-zinc-400">(optional)</span>
        </label>
        <textarea
          value={draft.biddingRules ?? ""}
          onChange={(e) => onChange({ biddingRules: e.target.value })}
          rows={3}
          placeholder={
            "z. B. «Bitte reichen Sie Ihr Angebot bis Freitag, 14. Februar um 17:00 Uhr ein.»\n«Besichtigungen finden am Samstag, 15. Februar zwischen 10:00 und 12:00 Uhr statt.»"
          }
          className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-gw-500 focus:outline-none"
        />
      </div>

      {/* ── Navigation ────────────────────────────────────────────────────────── */}
      <div className="flex justify-between pt-2">
        <button
          onClick={onBack}
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-700"
        >
          Zurück
        </button>
        <button
          onClick={onNext}
          className="rounded-lg bg-gw-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gw-500"
        >
          Weiter → Dokumente festlegen
        </button>
      </div>
    </div>
  );
};

export default StepProcess;
