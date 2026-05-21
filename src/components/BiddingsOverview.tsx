import React, { useEffect, useState } from "react";
import { BiddingStatus, type GridbidBidding } from "../types/domain";
import { useGridbidUiStore } from "../store/gridbidUiStore";
import { useGridbidService } from "../services/GridbidServiceContext";
import BiddingRow, { ROW_GRID } from "./BiddingCard";
import StatusFilter, { type StatusFilterValue } from "./StatusFilter";

// Columns must match ROW_GRID in BiddingCard.tsx:
// photo+name | status | highest-bid | bids | participants | deadline | actions
const HEADERS = [
  { label: "Objekt",      align: "" },
  { label: "Status",      align: "" },
  { label: "Höchstgebot", align: "" },
  { label: "Gebote",      align: "text-center" },
  { label: "Teilnehmer",  align: "text-center" },
  { label: "Frist",       align: "" },
  { label: "",            align: "" },           // actions (no label)
];

// ─── Default sort: ACTIVE first → soonest deadline, then DRAFT, then CLOSED ──

const STATUS_ORDER: Record<BiddingStatus, number> = {
  [BiddingStatus.ACTIVE]: 0,
  [BiddingStatus.DRAFT]:  1,
  [BiddingStatus.CLOSED]: 2,
};

function sortBiddings(list: GridbidBidding[]): GridbidBidding[] {
  return [...list].sort((a, b) => {
    const orderDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    if (orderDiff !== 0) return orderDiff;
    // Within ACTIVE: soonest deadline first (null = no deadline → goes last)
    if (a.status === BiddingStatus.ACTIVE) {
      if (a.deadline === null && b.deadline === null) return 0;
      if (a.deadline === null) return 1;
      if (b.deadline === null) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    return 0;
  });
}

// ─── Logo icon ───────────────────────────────────────────────────────────────

const GridBidLogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#4782f3" aria-hidden="true">
    <circle cx="12" cy="12"   r="2.63" />
    <circle cx="12" cy="7"    r="2.63" />
    <circle cx="12" cy="17"   r="2.63" />
    <circle cx="7"  cy="12"   r="2.63" />
    <circle cx="17" cy="12"   r="2.63" />
    <circle cx="7"  cy="7"    r="2.07" />
    <circle cx="17" cy="7"    r="2.07" />
    <circle cx="7"  cy="17"   r="2.07" />
    <circle cx="17" cy="17"   r="2.07" />
    <circle cx="12" cy="1.84" r="1.84" />
    <circle cx="12" cy="22.2" r="1.84" />
    <circle cx="1.84" cy="12" r="1.84" />
    <circle cx="22.2" cy="12" r="1.84" />
    <circle cx="7"    cy="1.84" r="1.22" />
    <circle cx="17"   cy="1.84" r="1.22" />
    <circle cx="7"    cy="22.2" r="1.22" />
    <circle cx="17"   cy="22.2" r="1.22" />
    <circle cx="1.84" cy="7"    r="1.22" />
    <circle cx="22.2" cy="7"    r="1.22" />
    <circle cx="1.84" cy="17"   r="1.22" />
    <circle cx="22.2" cy="17"   r="1.22" />
  </svg>
);

// ─── Component ───────────────────────────────────────────────────────────────

const BiddingsOverview: React.FC = () => {
  const navigate = useGridbidUiStore((s) => s.navigate);
  const service = useGridbidService();

  const [biddings, setBiddings] = useState<GridbidBidding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("ALL");

  useEffect(() => {
    setLoading(true);
    setError(null);
    service
      .listBiddings()
      .then((data) => {
        setBiddings(sortBiddings(data));
        setLoading(false);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Unbekannter Fehler");
        setLoading(false);
      });
  }, [service]);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-gray-400">
        Wird geladen…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-red-500">
        Fehler: {error}
      </div>
    );
  }

  const filtered =
    statusFilter === "ALL"
      ? biddings
      : biddings.filter((b) => b.status === statusFilter);

  return (
    <div className="flex flex-col bg-white">
      {/* Top bar: Logo + Avatar */}
      <header className="flex shrink-0 h-14 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <GridBidLogoIcon />
          <span className="text-sm font-semibold tracking-tight text-[#182024]">GridBid</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#4782f3] text-xs font-medium text-white">
            A
          </div>
          <span className="text-sm font-medium text-[#182024]">Anton</span>
        </div>
      </header>
      <div className="h-px bg-[#e8e9e9]" />

      <div className="px-10 py-8">
      <div className="flex flex-col gap-4">

        {/* Page header */}
        <div className="flex items-center justify-between">
          <h1 className="text-[32px] font-bold leading-10 text-[#06262d]">
            {biddings.length} Bieterverfahren
          </h1>
          <button
            onClick={() => navigate("create")}
            className="flex items-center gap-2 rounded-full bg-[#182024] px-4 py-2 text-base font-medium text-white transition-colors hover:bg-[#2f363a]"
          >
            Neues Verfahren
            <span className="text-base leading-none">+</span>
          </button>
        </div>

        {/* Status filter pills */}
        {biddings.length > 0 && (
          <StatusFilter
            biddings={biddings}
            active={statusFilter}
            onChange={setStatusFilter}
          />
        )}

        {biddings.length === 0 ? (
          <p className="text-sm text-[#73787a]">Noch keine Verfahren vorhanden.</p>
        ) : (
          <div className="overflow-hidden bg-white pt-2">
            {/* Column header row */}
            <div className={`grid ${ROW_GRID} border-b border-gray-200 py-2`}>
              {HEADERS.map((h, i) => (
                <div
                  key={i}
                  className={[
                    "text-xs font-medium uppercase tracking-wide text-[#73787a]",
                    h.align,
                    i === 0 ? "pl-2" : "pl-6",
                  ].join(" ")}
                >
                  {h.label}
                </div>
              ))}
            </div>

            {/* Data rows */}
            {filtered.length > 0 ? (
              filtered.map((b) => <BiddingRow key={b.id} bidding={b} />)
            ) : (
              <div className="px-5 py-8 text-center text-sm text-[#73787a]">
                Keine Verfahren mit diesem Status.
              </div>
            )}
          </div>
        )}

      </div>
      </div>
    </div>
  );
};

export default BiddingsOverview;
