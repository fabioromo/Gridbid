import React, { useState } from "react";
import type { CreateDraftInput } from "../types/domain";
import { formatCHF } from "../utils/labels";

interface StepPropertyProps {
  draft: CreateDraftInput;
  onChange: (patch: Partial<CreateDraftInput>) => void;
  onNext: () => void;
}

const MOCK_GRIDWORK_OBJECTS = [
  {
    id: "gw001",
    title: "Einfamilienhaus Küsnacht",
    address: "Seestrasse 85, 8700 Küsnacht",
    price: 2450000,
    status: "Aktiv" as const,
    imageUrl: "https://picsum.photos/seed/house1/192/128",
    activityHint: "3 Interessenten · vor 2 Tagen aktiv",
    websiteUrl: "https://www.homegate.ch/kaufen/3001234567",
  },
  {
    id: "gw002",
    title: "4.5-Zi-Wohnung Zürich Seefeld",
    address: "Seefeldstrasse 112, 8008 Zürich",
    price: 1850000,
    status: "Aktiv" as const,
    imageUrl: "https://picsum.photos/seed/house2/192/128",
    activityHint: "Heute bearbeitet",
    websiteUrl: "https://www.immoscout24.ch/de/kaufen/4002345678",
  },
  {
    id: "gw003",
    title: "Maisonette Winterthur Altstadt",
    address: "Marktgasse 14, 8400 Winterthur",
    price: 980000,
    status: "Entwurf" as const,
    imageUrl: "https://picsum.photos/seed/house3/192/128",
    activityHint: "Entwurf · noch nicht veröffentlicht",
    websiteUrl: "https://www.homegate.ch/kaufen/3003456789",
  },
  {
    id: "gw004",
    title: "Terrassenwohnung Zug",
    address: "Baarerstrasse 21, 6300 Zug",
    price: 3200000,
    status: "Aktiv" as const,
    imageUrl: undefined,
    activityHint: "vor 5 Tagen aktiv",
    websiteUrl: undefined,
  },
];

const HouseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-6 w-6 text-zinc-300"
  >
    <path d="M3 9.5L12 3l9 6.5V21H15v-5h-6v5H3V9.5z" />
  </svg>
);

type Status = "Aktiv" | "Entwurf" | "Inaktiv";

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const styles: Record<Status, string> = {
    Aktiv: "bg-green-100 text-green-700",
    Entwurf: "bg-amber-50 text-amber-600",
    Inaktiv: "bg-zinc-100 text-zinc-500",
  };
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] ?? styles.Inaktiv}`}
    >
      {status}
    </span>
  );
};

const Thumbnail: React.FC<{ imageUrl: string | undefined; title: string }> = ({
  imageUrl,
  title,
}) => (
  <div className="h-16 w-24 shrink-0 overflow-hidden rounded-md bg-zinc-100">
    {imageUrl ? (
      <img
        src={imageUrl}
        alt={title}
        className="h-full w-full object-cover transition-opacity duration-200"
        loading="lazy"
      />
    ) : (
      <div className="flex h-full w-full items-center justify-center">
        <HouseIcon />
      </div>
    )}
  </div>
);

const RadioDot: React.FC<{ selected: boolean }> = ({ selected }) => (
  <span
    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
      selected ? "border-gw-500" : "border-zinc-200"
    }`}
  >
    {selected && <span className="h-1.5 w-1.5 rounded-full bg-gw-500" />}
  </span>
);

const StepProperty: React.FC<StepPropertyProps> = ({ draft, onChange, onNext }) => {
  const [selectedId, setSelectedId] = useState<string | "manual" | null>(() => {
    if (!draft.title?.trim()) return null;
    const match = MOCK_GRIDWORK_OBJECTS.find((o) => o.title === draft.title);
    return match ? match.id : "manual";
  });
  const [search, setSearch] = useState("");

  const filteredObjects = MOCK_GRIDWORK_OBJECTS.filter((o) => {
    const q = search.toLowerCase();
    return o.title.toLowerCase().includes(q) || o.address.toLowerCase().includes(q);
  });

  function handleSelectObject(obj: (typeof MOCK_GRIDWORK_OBJECTS)[number]) {
    setSelectedId(obj.id);
    onChange({ title: obj.title, address: obj.address, websiteUrl: obj.websiteUrl });
  }

  function handleSelectManual() {
    if (selectedId !== "manual") {
      setSelectedId("manual");
      onChange({ title: "", address: "", websiteUrl: undefined });
    }
  }

  const valid =
    selectedId !== null &&
    (selectedId !== "manual" || (draft.title?.trim().length ?? 0) > 0);

  const showNewCard =
    search === "" || "neues objekt erfassen".includes(search.toLowerCase());

  const hasItems = filteredObjects.length > 0 || showNewCard;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-zinc-900">
        Für welches Objekt möchtest du ein Bieterverfahren starten?
      </h2>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Objekt suchen — Adresse, Bezeichnung"
        className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-gw-500 focus:outline-none"
      />

      {/* List */}
      {hasItems ? (
        <div className="flex flex-col border-t border-zinc-100">
          {/* "Neues Objekt erfassen" — integrated row */}
          {showNewCard && (
            <>
              <button
                onClick={handleSelectManual}
                className={`flex w-full items-center gap-3 border-b border-l-[3px] px-4 py-3 text-left transition-all ${
                  selectedId === "manual"
                    ? "border-l-gw-400 bg-violet-50"
                    : "border-l-transparent bg-white hover:bg-zinc-50"
                } border-b-zinc-100`}
              >
                {/* + icon in thumbnail slot */}
                <div
                  className={`flex h-16 w-24 shrink-0 items-center justify-center rounded-md transition-colors ${
                    selectedId === "manual" ? "bg-gw-50" : "bg-zinc-50"
                  }`}
                >
                  <span
                    className={`text-2xl font-light leading-none transition-colors ${
                      selectedId === "manual" ? "text-gw-500" : "text-zinc-300"
                    }`}
                  >
                    +
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium transition-colors ${
                      selectedId === "manual" ? "text-gw-700" : "text-zinc-700"
                    }`}
                  >
                    Neues Objekt erfassen
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    Adresse und Details manuell eingeben
                  </p>
                </div>

                <RadioDot selected={selectedId === "manual"} />
              </button>

              {/* Inline manual entry form */}
              {selectedId === "manual" && (
                <div className="flex flex-col gap-4 border-b border-zinc-100 bg-zinc-50/60 px-5 py-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                      Bezeichnung <span className="text-red-500">*</span>
                    </label>
                    <input
                      autoFocus
                      type="text"
                      value={draft.title ?? ""}
                      onChange={(e) => onChange({ title: e.target.value })}
                      placeholder="z. B. Einfamilienhaus Zürich-Witikon"
                      className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-gw-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                      Adresse
                    </label>
                    <input
                      type="text"
                      value={draft.address ?? ""}
                      onChange={(e) => onChange({ address: e.target.value })}
                      placeholder="z. B. Musterstrasse 1, 8001 Zürich"
                      className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-gw-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                      Link zur Vermarktung{" "}
                      <span className="font-normal text-zinc-400">(optional)</span>
                    </label>
                    <input
                      type="url"
                      value={draft.websiteUrl ?? ""}
                      onChange={(e) =>
                        onChange({ websiteUrl: e.target.value || undefined })
                      }
                      placeholder="z. B. https://www.homegate.ch/kaufen/…"
                      className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-gw-500 focus:outline-none"
                    />
                    <p className="mt-1.5 text-xs text-zinc-400">
                      Wird Interessent:innen als Referenz angezeigt.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Scrollable property rows */}
          <div className="relative">
            <div className="max-h-72 overflow-y-auto">
              {filteredObjects.map((obj, idx) => {
                const selected = selectedId === obj.id;
                const isLast = idx === filteredObjects.length - 1;
                return (
                  <button
                    key={obj.id}
                    onClick={() => handleSelectObject(obj)}
                    className={`flex w-full items-center gap-3 border-l-[3px] px-4 py-3 text-left transition-all ${
                      isLast ? "" : "border-b border-b-zinc-100"
                    } ${
                      selected
                        ? "border-l-gw-400 bg-violet-50"
                        : "border-l-transparent bg-white hover:bg-zinc-50"
                    }`}
                  >
                    <Thumbnail imageUrl={obj.imageUrl} title={obj.title} />

                    <div className="min-w-0 flex-1">
                      {/* Line 1: title */}
                      <p className="truncate text-sm font-medium text-zinc-900">
                        {obj.title}
                      </p>
                      {/* Line 2: address · price + status badge */}
                      <div className="mt-0.5 flex items-center gap-2">
                        <p className="min-w-0 truncate text-xs text-zinc-400">
                          {obj.address} · {formatCHF(obj.price)}
                        </p>
                        <StatusBadge status={obj.status} />
                      </div>
                      {/* Line 3: activity hint */}
                      {obj.activityHint && (
                        <p className="mt-1 text-xs text-zinc-400">{obj.activityHint}</p>
                      )}
                    </div>

                    <RadioDot selected={selected} />
                  </button>
                );
              })}
            </div>
            {/* Gradient fade to signal scrollability */}
            {filteredObjects.length > 3 && (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
            )}
          </div>
        </div>
      ) : (
        <p className="px-1 py-2 text-sm text-zinc-400">Keine Objekte gefunden.</p>
      )}

      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          disabled={!valid}
          className="rounded-lg bg-gw-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gw-500 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400"
        >
          Verfahren konfigurieren →
        </button>
      </div>
    </div>
  );
};

export default StepProperty;
