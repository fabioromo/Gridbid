import React from "react";
import { BiddingStatus, type GridbidBidding } from "../types/domain";

// ─── Types ───────────────────────────────────────────────────────────────────

export type StatusFilterValue = BiddingStatus | "ALL";

interface FilterOption {
  value: StatusFilterValue;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { value: "ALL",                  label: "Alle" },
  { value: BiddingStatus.ACTIVE,   label: "Aktiv" },
  { value: BiddingStatus.DRAFT,    label: "Entwurf" },
  { value: BiddingStatus.CLOSED,   label: "Abgelaufen" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function countForFilter(biddings: GridbidBidding[], value: StatusFilterValue): number {
  if (value === "ALL") return biddings.length;
  return biddings.filter((b) => b.status === value).length;
}

// ─── Component ───────────────────────────────────────────────────────────────

interface StatusFilterProps {
  /** Full (unfiltered) biddings list — used for counts */
  biddings: GridbidBidding[];
  active: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
}

/**
 * Single-select pill filter bar for bidding status.
 * Default: "ALL". Clicking the active pill resets to "ALL".
 * Zero-count options are dimmed and non-interactive.
 */
const StatusFilter: React.FC<StatusFilterProps> = ({ biddings, active, onChange }) => {
  function handleClick(value: StatusFilterValue) {
    // Clicking the already-active filter resets to "Alle"
    onChange(active === value && value !== "ALL" ? "ALL" : value);
  }

  return (
    <div className="flex items-center gap-1.5">
      {FILTER_OPTIONS.map(({ value, label }) => {
        const count = countForFilter(biddings, value);
        const isActive = active === value;
        const isEmpty = count === 0;

        return (
          <button
            key={value}
            onClick={() => handleClick(value)}
            disabled={isEmpty && !isActive}
            className={[
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
              isActive
                ? "bg-violet-600 text-white shadow-sm"
                : isEmpty
                ? "cursor-default bg-gray-100 text-gray-300"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900",
            ].join(" ")}
          >
            {label}
            <span
              className={[
                "min-w-[16px] rounded-full px-1 py-px text-[10px] tabular-nums leading-none",
                isActive
                  ? "bg-white/25 text-white"
                  : isEmpty
                  ? "bg-gray-200 text-gray-300"
                  : "bg-gray-200 text-gray-500",
              ].join(" ")}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default StatusFilter;
