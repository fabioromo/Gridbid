import React, { useState } from "react";
import type { BiddingDocuments } from "../types/domain";

interface StepDocumentsProps {
  documents: BiddingDocuments;
  onChange: (docs: BiddingDocuments) => void;
  onBack: () => void;
  onNext: () => void;
}

type LevelKey = keyof BiddingDocuments;

// Suggested documents per phase — shown as ghost chips, click to add instantly
const SUGGESTIONS: Record<LevelKey, string[]> = {
  level1: ["Verkaufsbroschüre", "Grundrisse", "Fotos", "Lageplan"],
  level2: ["Grundbuchauszug", "Baubeschrieb", "Renovationsinfos", "Energieausweis"],
  level3: ["Reservierungsvereinbarung", "Kaufvertragsentwurf", "Rechtsdokumente"],
};

type IconName = "users" | "funnel" | "key";
type StrokeWidth = 1.5 | 2;

// Heroicons v2 outline paths
const ICON_PATHS: Record<IconName, string> = {
  users:
    "M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z",
  funnel:
    "M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z",
  key: "M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 21.75 8.25Z",
};

const LEVELS: {
  key: LevelKey;
  phase: string;
  title: string;
  guidance: string;
  releaseText: string;
  confidenceTag: string;
  borderClass: string;
  cardBg: string;
  iconColor: string;
  iconStroke: StrokeWidth;
  icon: IconName;
  connectorLabel: string | null;
  emptyIsWarning: boolean;
  emptyText: string;
}[] = [
  {
    key: "level1",
    phase: "Phase 1",
    title: "Für alle Interessenten",
    guidance: "Zeig genug, um Interesse zu wecken — aber halte sensible Informationen zurück.",
    releaseText: "Automatisch nach Registrierung",
    confidenceTag: "Offen für alle registrierten Käufer",
    borderClass: "border-l-2 border-l-zinc-300",
    cardBg: "bg-white",
    iconColor: "text-zinc-400",
    iconStroke: 1.5,
    icon: "users",
    connectorLabel: "Nur für ernsthafte Käufer",
    emptyIsWarning: true,
    emptyText: "Ohne Unterlagen sehen registrierte Käufer nichts. Das kann Interesse kosten.",
  },
  {
    key: "level2",
    phase: "Phase 2",
    title: "Für ernsthafte Käufer",
    guidance: "Diese Unterlagen erhalten nur Käufer, die bereits ein Gebot abgegeben haben.",
    releaseText: "Automatisch nach erstem Gebot",
    confidenceTag: "Nur für qualifizierte Bieter",
    borderClass: "border-l-2 border-l-gw-400",
    cardBg: "bg-white",
    iconColor: "text-gw-500",
    iconStroke: 1.5,
    icon: "funnel",
    connectorLabel: "Nur auf deine Freigabe",
    emptyIsWarning: false,
    emptyText: "Optional — du kannst diese Phase auch leer lassen.",
  },
  {
    key: "level3",
    phase: "Phase 3",
    title: "Für ausgewählte Käufer",
    guidance: "Du entscheidest persönlich, wer diese Unterlagen erhält — für jeden Käufer einzeln.",
    releaseText: "Freigabe manuell durch dich",
    confidenceTag: "Du behältst die volle Kontrolle",
    borderClass: "border-l-2 border-l-gw-700",
    cardBg: "bg-gw-50",
    iconColor: "text-gw-700",
    iconStroke: 2,
    icon: "key",
    connectorLabel: null,
    emptyIsWarning: false,
    emptyText: "Optional — du kannst Unterlagen auch später manuell freigeben.",
  },
];

function PhaseIcon({ name, className, strokeWidth = 1.5 }: { name: IconName; className?: string; strokeWidth?: StrokeWidth }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className ?? "h-4 w-4"}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS[name]} />
    </svg>
  );
}

function PhaseConnector({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5 py-0.5 pl-3">
      <div className="flex flex-col items-center">
        <div className="h-2.5 w-px bg-zinc-200" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="h-3 w-3 text-zinc-300"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
        <div className="h-2.5 w-px bg-zinc-200" />
      </div>
      <span className="text-[11px] font-medium text-zinc-400">{label}</span>
    </div>
  );
}

const StepDocuments: React.FC<StepDocumentsProps> = ({
  documents,
  onChange,
  onBack,
  onNext,
}) => {
  const [pendingAdd, setPendingAdd] = useState<{ key: LevelKey; value: string } | null>(null);

  function removeItem(key: LevelKey, index: number) {
    onChange({ ...documents, [key]: documents[key].filter((_, i) => i !== index) });
  }

  function addItem(key: LevelKey, value: string) {
    const trimmed = value.trim();
    if (trimmed && !documents[key].includes(trimmed)) {
      onChange({ ...documents, [key]: [...documents[key], trimmed] });
    }
  }

  function confirmAdd() {
    if (!pendingAdd) return;
    addItem(pendingAdd.key, pendingAdd.value);
    setPendingAdd(null);
  }

  function cancelAdd() {
    setPendingAdd(null);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Step header */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">
          Welche Unterlagen erhält der Käufer — und wann?
        </h2>
        <p className="mt-1.5 text-sm text-zinc-400">
          Lege fest, wie viel Käufer in jeder Phase sehen. Du behältst jederzeit die Kontrolle.
        </p>
      </div>

      {/* Phase cards */}
      <div className="flex flex-col">
        {LEVELS.map((level) => {
          const {
            key,
            phase,
            title,
            guidance,
            releaseText,
            confidenceTag,
            borderClass,
            cardBg,
            iconColor,
            iconStroke,
            icon,
            connectorLabel,
            emptyIsWarning,
            emptyText,
          } = level;

          const isAdding = pendingAdd?.key === key;
          const docs = documents[key];
          const count = docs.length;
          const availableSuggestions = SUGGESTIONS[key].filter((s) => !docs.includes(s));
          const allSuggestionsUsed = !isAdding && availableSuggestions.length === 0 && count > 0;

          return (
            <React.Fragment key={key}>
              <div className={`rounded-lg border border-zinc-200 ${cardBg} ${borderClass}`}>
                {/* Card header */}
                <div className="border-b border-zinc-100 px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-2.5">
                      <PhaseIcon
                        name={icon}
                        strokeWidth={iconStroke}
                        className={`mt-0.5 h-4 w-4 shrink-0 ${iconColor}`}
                      />
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-semibold text-zinc-900">{title}</span>
                          <span className="text-xs text-zinc-400">{phase}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-zinc-500">{guidance}</p>
                      </div>
                    </div>
                    {/* Doc count badge — only when populated */}
                    {count > 0 && (
                      <span className="shrink-0 text-xs font-medium text-gw-600">
                        ✓ {count} {count === 1 ? "Unterlage" : "Unterlagen"}
                      </span>
                    )}
                  </div>
                  {/* Release + confidence meta row */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 pl-6">
                    <span className="text-xs text-zinc-400">{releaseText}</span>
                    <span className="text-zinc-300">·</span>
                    <span className="text-xs font-medium text-zinc-500">{confidenceTag}</span>
                  </div>
                </div>

                {/* Document chips area */}
                <div className="px-5 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Confirmed document chips */}
                    {docs.map((doc, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700"
                      >
                        {doc}
                        <button
                          onClick={() => removeItem(key, i)}
                          className="ml-0.5 text-zinc-400 transition-colors hover:text-zinc-600"
                          aria-label={`${doc} entfernen`}
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    {/* Suggestion ghost chips — hidden while typing */}
                    {!isAdding &&
                      availableSuggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => addItem(key, s)}
                          className="flex items-center gap-1 rounded-md border border-dashed border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-gw-300 hover:bg-gw-50 hover:text-gw-600"
                        >
                          + {s}
                        </button>
                      ))}

                    {/* Inline add input or trigger */}
                    {isAdding ? (
                      <div className="flex items-center gap-2">
                        <input
                          autoFocus
                          type="text"
                          value={pendingAdd.value}
                          onChange={(e) => setPendingAdd({ key, value: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") confirmAdd();
                            if (e.key === "Escape") cancelAdd();
                          }}
                          placeholder="Dokumentname…"
                          className="rounded-md border border-gw-300 bg-white px-3 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-gw-400"
                        />
                        <button
                          onClick={confirmAdd}
                          className="rounded-md bg-gw-600 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gw-500"
                        >
                          Hinzufügen
                        </button>
                        <button
                          onClick={cancelAdd}
                          className="text-xs text-zinc-400 transition-colors hover:text-zinc-600"
                        >
                          Abbrechen
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setPendingAdd({ key, value: "" })}
                        className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-800"
                      >
                        + Eigenes Dokument hinzufügen
                      </button>
                    )}
                  </div>

                  {/* "Typische Auswahl" — shown when all suggestions are covered */}
                  {allSuggestionsUsed && (
                    <p className="mt-2.5 text-[11px] font-medium text-gw-600">
                      ✓ Typische Auswahl für diese Phase
                    </p>
                  )}

                  {/* Empty state */}
                  {count === 0 && !isAdding && (
                    <div
                      className={`mt-3 flex items-start gap-1.5 ${
                        emptyIsWarning ? "text-amber-500" : "text-zinc-400"
                      }`}
                    >
                      {emptyIsWarning ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="mt-px h-3.5 w-3.5 shrink-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="mt-px h-3.5 w-3.5 shrink-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                          />
                        </svg>
                      )}
                      <span className="text-xs">{emptyText}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Connector between phases */}
              {connectorLabel && <PhaseConnector label={connectorLabel} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Footer reassurance */}
      <p className="text-xs text-zinc-400">
        Unterlagen werden nach der Aktivierung hochgeladen. Du kannst diese Einstellungen jederzeit anpassen.
      </p>

      {/* Navigation */}
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
          Verfahren prüfen →
        </button>
      </div>
    </div>
  );
};

export default StepDocuments;
