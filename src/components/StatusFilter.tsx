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
              "inline-flex h-8 items-center gap-2 rounded-full px-3 text-sm transition-colors",
              isActive
                ? "border-[1.5px] border-[#2f363a] bg-[#f6f6f6] font-medium text-[#182024]"
                : isEmpty
                ? "cursor-default border border-[#e8e9e9] bg-white font-normal text-[#73787a] opacity-40"
                : "border border-[#e8e9e9] bg-white font-normal text-[#182024] hover:border-[#2f363a] hover:bg-[#f6f6f6]",
            ].join(" ")}
          >
            {label} ({count})
          </button>
        );
      })}
    </div>
  );
};

export default StatusFilter;
