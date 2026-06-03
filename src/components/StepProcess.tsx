import React, { useRef, useState } from "react";
import { PriceDisplay, ProcessType, type CreateDraftInput } from "../types/domain";

interface StepProcessProps {
  draft: CreateDraftInput;
  onChange: (patch: Partial<CreateDraftInput>) => void;
  onBack: () => void;
  onNext: () => void;
}

type PresetId = "standard" | "preisgeführt" | "mehrstufig" | "custom";

interface Preset {
  id: PresetId;
  label: string;
  description: string;
  bestFor: string;
  confirmation: string;
  config: Partial<CreateDraftInput>;
}

const PRESETS: Preset[] = [
  {
    id: "standard",
    label: "Standard",
    description: "Einmaliges, verdecktes Verfahren ohne Preisangabe.",
    bestFor: "Einfache Verkäufe mit klarem Prozess. Für Käufer:innen: Kein Preis sichtbar, einmaliges Angebot.",
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
    bestFor: "Objekte, bei denen ein Richtpreis hilfreich ist. Für Käufer:innen: Richtpreis sichtbar, Gebote verdeckt.",
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
    bestFor: "Stark nachgefragte Objekte und kompetitive Verkäufe. Für Käufer:innen: Mehrere Runden, Angebote revidierbar.",
    confirmation: "Empfehlenswert für stark nachgefragte Objekte.",
    config: {
      processType: ProcessType.SEALED_BID,
      roundsPlanned: 2,
      priceDisplay: PriceDisplay.HIDDEN,
      deadline: null,
    },
  },
  {
    id: "custom",
    label: "Custom",
    description: "Eigene Kombination — alle Einstellungen frei wählbar.",
    bestFor: "Verkäufe ohne Standardmuster. Für Käufer:innen: Abhängig von deinen Regeln.",
    confirmation: "Vollständig konfigurierbar.",
    config: {
      processType: ProcessType.OPEN_BID,
      roundsPlanned: 1,
      priceDisplay: PriceDisplay.HIDDEN,
      deadline: null,
    },
  },
];

function detectPreset(draft: CreateDraftInput): PresetId {
  const pt = draft.processType ?? ProcessType.SEALED_BID;
  const r = draft.roundsPlanned ?? 1;
  const pd = draft.priceDisplay ?? PriceDisplay.HIDDEN;
  if (pt === ProcessType.SEALED_BID && r === 1 && pd === PriceDisplay.HIDDEN) return "standard";
  if (pt === ProcessType.SEALED_BID && r === 1 && pd === PriceDisplay.PRICE) return "preisgeführt";
  if (pt === ProcessType.SEALED_BID && r === 2 && pd === PriceDisplay.HIDDEN) return "mehrstufig";
  return "custom";
}

const PROCESS_OPTIONS = [
  {
    value: ProcessType.SEALED_BID,
    label: "Verdeckt",
    description: "Gebote bleiben bis Fristablauf vertraulich — Standard in der Schweiz.",
  },
  {
    value: ProcessType.OPEN_BID,
    label: "Offen",
    description: "Alle Bieter:innen sehen die aktuellen Gebote der anderen.",
  },
];

const ROUNDS_OPTIONS = [
  { value: 1, label: "1 Runde", description: "Einmaliges Verfahren. Klar und effizient." },
  { value: 2, label: "2 Runden", description: "Bieter können nach Runde 1 nachbessern." },
  { value: 3, label: "3 Runden", description: "Maximaler Wettbewerbsdruck. Für kompetitive Lagen." },
];

const PRICE_OPTIONS: { value: PriceDisplay; label: string; description: string }[] = [
  {
    value: PriceDisplay.HIDDEN,
    label: "Kein Preis anzeigen",
    description: "Käufer:innen bieten frei — kein Preis sichtbar.",
  },
  {
    value: PriceDisplay.PRICE,
    label: "Richtpreis anzeigen",
    description: "Käufer:innen sehen einen Richtwert und bieten verdeckt.",
  },
  {
    value: PriceDisplay.RANGE,
    label: "Preisspanne anzeigen",
    description: "Käufer:innen bewegen sich in einem definierten Rahmen.",
  },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconStandard = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M31.8758 24.8515L22.1356 28.001H20.3859V22.9789L14.3447 21.6958V14.6961L24.0705 5.99933L33.6708 14.6961V24.6703L31.8758 24.8515Z" fill="#4782F3"/>
    <path d="M5.13989 21.1125V14.6961L14.8029 5.99933H24.0112L33.6115 14.6961V24.4954" stroke="#2F363A"/>
    <path d="M14.2773 21.2875V14.6961L23.9404 5.99933" stroke="#2F363A"/>
    <path d="M5.34375 14.742H14.6846" stroke="#2F363A"/>
    <path d="M4.33667 34.1385H22.2715L37.4164 29.3559V28.7308C37.4164 26.4346 35.555 24.5732 33.2589 24.5732C32.8445 24.5732 32.4324 24.6353 32.0363 24.7571L22.5465 27.677C22.3641 27.7331 22.1745 27.7616 21.9837 27.7616H14.3004" stroke="#2F363A"/>
    <path d="M20.405 27.8198V23.0081L9.00842 20.4699C8.63616 20.393 8.25651 20.3543 7.87579 20.3543C4.89037 20.3543 2.47021 22.6866 2.47021 25.5636V26.1155" stroke="#2F363A"/>
  </svg>
);

const IconPreisgeführt = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.39355 34.1385H22.3283L37.4733 29.3559V28.7308C37.4733 26.4347 35.6119 24.5733 33.3157 24.5733C32.9014 24.5733 32.4893 24.6353 32.0932 24.7571L22.6033 27.6771C22.421 27.7332 22.2314 27.7617 22.0406 27.7617H14.3573" stroke="#2F363A"/>
    <path d="M20.4621 27.8199V23.0081L9.06555 20.4699C8.69329 20.3931 8.31363 20.3544 7.93292 20.3544C4.9475 20.3544 2.52734 22.6867 2.52734 25.5636V26.1155" stroke="#2F363A"/>
    <circle cx="20.0002" cy="10.272" r="6.66667" fill="#4782F3" stroke="#2F363A"/>
    <path d="M26.6668 17.2393V20.8276H13.3335V17.2393H26.6668Z" fill="#4782F3" stroke="#2F363A"/>
    <path d="M26.6668 20.8276V24.4158H20.4689V23.0556L13.3335 21.3889V20.8276H26.6668Z" fill="#4782F3" stroke="#2F363A"/>
    <path d="M26.6668 24.2316V26.441L22.7028 27.6706C22.5109 27.7301 22.3112 27.7604 22.1103 27.7604H20.4619V24.2316H26.6668Z" fill="#4782F3" stroke="#2F363A"/>
  </svg>
);

const IconMehrstufig = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M28.3333 18.333H29.9999C33.6818 18.333 36.6666 15.3482 36.6666 11.6663C36.6666 7.9844 33.6818 4.99963 29.9999 4.99963H18.3333" stroke="#182024"/>
    <path d="M11.6666 31.6663H9.99992C6.31802 31.6663 3.33325 28.6815 3.33325 24.9997C3.33325 21.3177 6.31802 18.333 9.99992 18.333H21.6666" stroke="#182024"/>
    <path d="M11.6675 4.99963H1.66748" stroke="#182024"/>
    <path d="M29.1666 31.6664H18.3333" stroke="#182024"/>
    <path d="M11.6667 5.00002C11.6667 5.88408 12.0179 6.73192 12.6431 7.35704C13.2682 7.98216 14.116 8.33335 15.0001 8.33335C15.8841 8.33335 16.732 7.98216 17.3571 7.35704C17.9822 6.73192 18.3334 5.88408 18.3334 5.00002C18.3334 4.11597 17.9822 3.26812 17.3571 2.643C16.732 2.01788 15.8841 1.66669 15.0001 1.66669C14.116 1.66669 13.2682 2.01788 12.6431 2.643C12.0179 3.26812 11.6667 4.11597 11.6667 5.00002Z" fill="#4782F3" stroke="#182024"/>
    <path d="M21.6667 18.3333C21.6667 19.2174 22.0179 20.0652 22.6431 20.6904C23.2682 21.3155 24.116 21.6667 25.0001 21.6667C25.8841 21.6667 26.732 21.3155 27.3571 20.6904C27.9822 20.0652 28.3334 19.2174 28.3334 18.3333C28.3334 17.4493 27.9822 16.6014 27.3571 15.9763C26.732 15.3512 25.8841 15 25.0001 15C24.116 15 23.2682 15.3512 22.6431 15.9763C22.0179 16.6014 21.6667 17.4493 21.6667 18.3333Z" fill="#4782F3" stroke="#182024"/>
    <path d="M11.6667 31.6667C11.6667 32.5508 12.0179 33.3986 12.6431 34.0237C13.2682 34.6489 14.116 35 15.0001 35C15.8841 35 16.732 34.6489 17.3571 34.0237C17.9822 33.3986 18.3334 32.5508 18.3334 31.6667C18.3334 30.7827 17.9822 29.9348 17.3571 29.3097C16.732 28.6846 15.8841 28.3334 15.0001 28.3334C14.116 28.3334 13.2682 28.6846 12.6431 29.3097C12.0179 29.9348 11.6667 30.7827 11.6667 31.6667Z" fill="#4782F3" stroke="#182024"/>
    <path d="M36.6667 31.6667L31.6667 26.6667H29.1667V36.6667H31.6667L36.6667 31.6667Z" fill="#4782F3" stroke="#182024"/>
  </svg>
);

const IconCustom = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.10205 13.4274C7.10205 14.833 7.66041 16.181 8.6543 17.1749C9.64819 18.1688 10.9962 18.7271 12.4018 18.7271C13.8073 18.7271 15.1553 18.1688 16.1492 17.1749C17.1431 16.181 17.7015 14.833 17.7015 13.4274C17.7015 12.0218 17.1431 10.6738 16.1492 9.67994C15.1553 8.68605 13.8073 8.12769 12.4018 8.12769C10.9962 8.12769 9.64819 8.68605 8.6543 9.67994C7.66041 10.6738 7.10205 12.0218 7.10205 13.4274Z" fill="#4782F3" stroke="#2F363A" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.6665 1.44965H5.37958C15.873 1.44965 24.3796 9.95623 24.3796 20.4496V24.1627H1.6665V1.44965Z" stroke="#2F363A"/>
    <path d="M24.3408 20.2607H33.5517C36.039 20.2607 38.0554 22.2772 38.0554 24.7645C38.0554 27.2519 36.039 29.2683 33.5516 29.2683H13.4696C11.068 29.2683 9.12109 31.2152 9.12109 33.6168C9.12109 36.0184 11.068 37.9653 13.4696 37.9653H28.6893" stroke="#2F363A"/>
  </svg>
);

const PRESET_ICONS: Record<PresetId, () => React.ReactElement> = {
  standard:     IconStandard,
  preisgeführt: IconPreisgeführt,
  mehrstufig:   IconMehrstufig,
  custom:       IconCustom,
};

// ─── Info tooltip ────────────────────────────────────────────────────────────

const InfoTooltip = ({ text }: { text: string }) => (
  <span className="group relative inline-flex items-center">
    <svg
      width="14" height="14" viewBox="0 0 14 14" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="cursor-default text-[#73787a]"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 6.5V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="7" cy="4.5" r="0.7" fill="currentColor" />
    </svg>
    <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 w-56 -translate-x-1/2 rounded-md bg-[#182024] px-3 py-2 text-xs leading-relaxed text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
      {text}
    </span>
  </span>
);

// ─── Radio option row ─────────────────────────────────────────────────────────

const RadioOption = ({
  selected,
  label,
  description,
  onClick,
  children,
}: {
  selected: boolean;
  label: string;
  description: string;
  onClick: () => void;
  children?: React.ReactNode;
}) => (
  <div>
    <button
      onClick={onClick}
      className={`flex w-full cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
        selected
          ? "border-zinc-800 bg-zinc-50"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          selected ? "border-zinc-900 bg-zinc-900" : "border-zinc-400 bg-white"
        }`}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-white" />}
      </span>
      <div className="flex-1">
        <span className="text-sm font-medium text-zinc-900">{label}</span>
        <p className="mt-0.5 text-xs text-zinc-500">{description}</p>
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
    return PRESETS.find((p) => p.id === id) ?? null;
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

      {/* ── Preset cards — 2×2 grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        {PRESETS.map((preset) => {
          const selected = activePreset === preset.id;
          const Icon = PRESET_ICONS[preset.id];
          return (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className={`flex cursor-pointer flex-col gap-3 rounded-lg border-2 p-4 text-left transition-colors ${
                selected
                  ? "border-zinc-900 bg-white"
                  : "border-zinc-200 bg-white hover:border-zinc-400"
              }`}
            >
              <Icon />
              <div>
                <p className="text-sm font-semibold text-zinc-900">{preset.label}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">{preset.description}</p>
              </div>
              <div className="border-t border-zinc-100 pt-2">
                <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">Ideal für</p>
                <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">{preset.bestFor}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── "So funktioniert das Verfahren" ──────────────────────────────────── */}
      <div>
        <p className="text-sm font-semibold text-zinc-600">So funktioniert das Verfahren</p>
        {appliedPreset && (
          <p className="mt-0.5 text-xs text-zinc-400">
            Basierend auf{" "}
            <span className="font-medium text-gw-500">{appliedPreset.label}</span>
            {" — "}{appliedPreset.confirmation}
          </p>
        )}
      </div>

      {/* ── Config sections ───────────────────────────────────────────────────── */}
      <div
        className={`flex flex-col gap-8 transition-opacity duration-500 ${
          configHighlighted ? "opacity-60" : "opacity-100"
        }`}
      >

        {/* Verfahrensart */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-zinc-500">Verfahrensart</p>
          <div className="flex flex-col gap-2">
            {PROCESS_OPTIONS.map(({ value, label, description }) => (
              <RadioOption
                key={value}
                selected={(draft.processType ?? ProcessType.SEALED_BID) === value}
                label={label}
                description={description}
                onClick={() => onChange({ processType: value })}
              />
            ))}
          </div>
        </div>

        {/* Zeitplan: Rundenanzahl + Angebotsfrist */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-medium text-zinc-500">Zeitplan</p>

          {/* Rundenanzahl */}
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-1.5">
              <p className="text-xs font-medium text-zinc-500">Rundenanzahl</p>
              <InfoTooltip text="Mehr Runden erhöhen den Wettbewerb, verlängern aber auch den Prozess." />
            </span>
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

          {/* Angebotsfrist */}
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-zinc-700">Angebotsfrist</p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Ohne Frist können Angebote unbegrenzt eingehen.
                </p>
              </div>
              <button
                role="switch"
                aria-checked={deadlineEnabled}
                onClick={() => handleDeadlineToggle(!deadlineEnabled)}
                className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                  deadlineEnabled ? "bg-zinc-900" : "bg-zinc-300"
                }`}
              >
                <span
                  className={`mt-0.5 inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    deadlineEnabled ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {deadlineEnabled && (
              <div className="flex gap-4">
                {/* Date input */}
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-sm font-medium text-zinc-700">Datum</label>
                  <div className="relative flex items-center rounded border border-zinc-200 bg-white px-3 h-10">
                    <svg
                      className="mr-2 h-4 w-4 shrink-0 text-zinc-400"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="1" y="2.5" width="14" height="12.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M1 6.5H15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      <path d="M5 1V4M11 1V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
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
                      className="flex-1 bg-transparent text-sm text-zinc-900 placeholder-zinc-300 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Time input */}
                <div className="flex flex-col gap-1.5 w-40">
                  <label className="text-sm font-medium text-zinc-700">Uhrzeit</label>
                  <div className="relative flex items-center rounded border border-zinc-200 bg-white px-3 h-10">
                    <svg
                      className="mr-2 h-4 w-4 shrink-0 text-zinc-400"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M8 4.5V8.5L10.5 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
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
                      className="flex-1 bg-transparent text-sm text-zinc-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preisorientierung */}
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-1.5">
            <p className="text-xs font-medium text-zinc-500">Preisorientierung</p>
            <InfoTooltip text="Mehr Orientierung erhöht die Klarheit für Käufer:innen, kann aber das Preispotenzial begrenzen." />
          </span>
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

      {/* ── Divider ───────────────────────────────────────────────────────────── */}
      <div className="h-px bg-zinc-100" />

      {/* ── Informationen für Interessenten ──────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-lg font-bold text-zinc-900">Informationen für Interessent:innen</p>
          <p className="mt-0.5 text-sm text-zinc-500">
            Diese Informationen sehen Interessent:innen direkt im Bieterportal.
          </p>
        </div>
        <textarea
          value={draft.biddingRules ?? ""}
          onChange={(e) => onChange({ biddingRules: e.target.value })}
          rows={4}
          placeholder="z. B. «Besichtigung: Sa 14. Juni, 10–12 Uhr»"
          className="w-full resize-none rounded border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-zinc-400 focus:outline-none"
        />
      </div>

    </div>
  );
};

export default StepProcess;
