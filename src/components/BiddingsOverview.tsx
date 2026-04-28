import React, { useEffect, useState } from "react";
import { BiddingStatus, type GridbidBidding } from "../types/domain";
import { useGridbidUiStore } from "../store/gridbidUiStore";
import { useGridbidService } from "../services/GridbidServiceContext";
import BiddingRow, { ROW_GRID } from "./BiddingCard";
import StatusFilter, { type StatusFilterValue } from "./StatusFilter";

const HEADERS = [
  { label: "",            align: "" },           // photo
  { label: "Objekt",      align: "" },
  { label: "Höchstgebot", align: "text-right" },
  { label: "Gebote",      align: "text-right" },
  { label: "Teilnehmer",  align: "text-right" },
  { label: "Frist",       align: "" },
  { label: "Status",      align: "" },
  { label: "",            align: "text-right" },  // action
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
    <div className="px-6 py-8">
      <div className="mx-auto max-w-6xl">

        {/* Page header */}
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Bieterverfahren</h1>
          <button
            onClick={() => navigate("create")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            + Neues Verfahren
          </button>
        </div>

        {/* Status filter pills — always visible when there are biddings */}
        {biddings.length > 0 && (
          <div className="mb-5">
            <StatusFilter
              biddings={biddings}
              active={statusFilter}
              onChange={setStatusFilter}
            />
          </div>
        )}

        {biddings.length === 0 ? (
          <p className="text-sm text-gray-400">Noch keine Verfahren vorhanden.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            {/* Column header row */}
            <div className={`grid ${ROW_GRID} border-b border-gray-100 bg-gray-50`}>
              {HEADERS.map((h, i) => (
                <div
                  key={i}
                  className={`py-3 text-xs font-medium uppercase tracking-wide text-gray-400 ${h.align} ${
                    i === 0 ? "pl-0 pr-0" : "pr-5"
                  }`}
                >
                  {h.label}
                </div>
              ))}
            </div>

            {/* Data rows */}
            {filtered.length > 0 ? (
              filtered.map((b) => <BiddingRow key={b.id} bidding={b} />)
            ) : (
              <div className="px-5 py-8 text-center text-sm text-gray-400">
                Keine Verfahren mit diesem Status.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default BiddingsOverview;
