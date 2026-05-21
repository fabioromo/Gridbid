import React, { useState } from "react";
import type { BiddingDocuments } from "../types/domain";

interface StepDocumentsProps {
  documents: BiddingDocuments;
  onChange: (docs: BiddingDocuments) => void;
  onBack: () => void;
  onNext: () => void;
}

type LevelKey = keyof BiddingDocuments;

const SUGGESTIONS: Record<LevelKey, string[]> = {
  level1: ["Verkaufsbroschüre", "Grundrisse", "Fotos", "Lageplan"],
  level2: ["Grundbuchauszug", "Baubeschrieb", "Renovationsinfos"],
  level3: ["Reservierungsvereinbarung", "Kaufvertrag-Entwurf", "Rechtsdokumente"],
};

const LEVELS: { key: LevelKey; title: string; desc: string }[] = [
  {
    key: "level1",
    title: "1 – Bei der Registrierung",
    desc: "Für alle verfügbar, die sich registrieren. Käufer:innen sehen diese sobald sie Interesse bekunden.",
  },
  {
    key: "level2",
    title: "2 – Für verifizierte Käufer:innen",
    desc: "Wird freigeschaltet, sobald eine Käufer:in ihr Profil verifiziert hat.",
  },
  {
    key: "level3",
    title: "3 – Auf deine Freigabe",
    desc: "Von dir manuell freigegeben, Käufer:in für Käufer:in. Du entscheidest, wer diese sieht und wann.",
  },
];

function DocFileIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className ?? "h-4 w-4"}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
      />
    </svg>
  );
}

const StepDocuments: React.FC<StepDocumentsProps> = ({ documents, onChange }) => {
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
    <div className="flex flex-col gap-8">
      {/* Section heading */}
      <div>
        <h2 className="text-xl font-bold leading-7 text-zinc-900">
          Unterlagen für jede Phase hochladen
        </h2>
        <p className="mt-1 text-sm leading-5 text-zinc-500">
          Käufer:innen sehen mehr, je weiter sie im Verfahren vorankommen.
        </p>
      </div>

      {/* Three upload sections */}
      <div className="flex flex-col">
        {LEVELS.map((level, index) => {
          const { key, title, desc } = level;
          const docs = documents[key];
          const isAdding = pendingAdd?.key === key;
          const suggestions = SUGGESTIONS[key];

          return (
            <React.Fragment key={key}>
            <div className="flex flex-col gap-4 py-8">
              {/* Title + description + suggestion dots */}
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold leading-6 text-zinc-900">{title}</h3>
                <p className="text-sm leading-5 text-zinc-500">{desc}</p>
                <p className="text-sm leading-5 text-zinc-500">Typische Unterlagen für diese Phase:</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                  {suggestions.map((s, idx) => {
                    const added = docs.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => !added && addItem(key, s)}
                        disabled={added}
                        className={`flex items-center gap-1.5 text-sm leading-5 transition-colors ${
                          added
                            ? "cursor-default text-zinc-300"
                            : "cursor-pointer text-zinc-500 hover:text-zinc-800"
                        }`}
                      >
                        <span
                          className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                            idx === 0 && !added ? "bg-zinc-500" : "bg-zinc-300"
                          }`}
                        />
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drop zone */}
              <button
                type="button"
                onClick={() => setPendingAdd({ key, value: "" })}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 py-4 transition-colors hover:border-zinc-400 hover:bg-zinc-100 focus:outline-none"
              >
                <DocFileIcon className="h-4 w-4 text-zinc-400" />
                <span className="text-sm font-medium text-zinc-700">
                  Dokumente auswählen oder hierher ziehen
                </span>
              </button>

              {/* Inline name input */}
              {isAdding && (
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
                    className="flex-1 rounded border border-zinc-300 px-3 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                  <button
                    type="button"
                    onClick={confirmAdd}
                    className="rounded bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
                  >
                    Hinzufügen
                  </button>
                  <button
                    type="button"
                    onClick={cancelAdd}
                    className="text-sm text-zinc-400 transition-colors hover:text-zinc-600"
                  >
                    Abbrechen
                  </button>
                </div>
              )}

              {/* Uploaded file tiles — 2-column grid */}
              {docs.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {docs.map((doc, i) => {
                    const displayName = /\.[a-zA-Z]{2,4}$/.test(doc) ? doc : `${doc}.pdf`;
                    return (
                      <div
                        key={i}
                        className="flex items-center overflow-hidden rounded border border-zinc-200 bg-white"
                      >
                        <div className="flex flex-1 items-center gap-2 p-2 min-w-0">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-50 p-1">
                            <DocFileIcon className="h-3.5 w-3.5 text-blue-500" />
                          </div>
                          <span className="truncate text-sm text-zinc-700">{displayName}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(key, i)}
                          aria-label={`${doc} entfernen`}
                          className="flex h-9 w-9 shrink-0 items-center justify-center text-zinc-400 transition-colors hover:text-zinc-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-3 w-3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18 18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {index < LEVELS.length - 1 && (
              <div className="h-px bg-[#e8e9e9]" />
            )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Upload note */}
      <p className="text-xs leading-4 text-zinc-400">
        Unterlagen werden nach der Aktivierung hochgeladen. Du kannst diese Einstellungen jederzeit
        anpassen.
      </p>
    </div>
  );
};

export default StepDocuments;
