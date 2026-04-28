import React from "react";
import { BiddingStatus, type GridbidBidding } from "../types/domain";
import { useGridbidUiStore } from "../store/gridbidUiStore";
import HighestBidCell from "./HighestBidCell";
import DeadlineCell from "./DeadlineCell";

// Shared grid column template — must match the header row in BiddingsOverview
export const ROW_GRID = "grid-cols-[88px_1fr_180px_84px_112px_164px_116px_116px]";

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<
  BiddingStatus,
  { label: string; cls: string; style?: React.CSSProperties; dot?: boolean }
> = {
  [BiddingStatus.DRAFT]: {
    label: "Entwurf",
    cls: "border",
    style: {
      backgroundColor: "#f3f4f6",
      color: "#6b7280",
      borderColor: "#e5e7eb",
    },
  },
  [BiddingStatus.ACTIVE]: {
    label: "Aktiv",
    cls: "border",
    style: {
      backgroundColor: "#eaf3ee",
      color: "#206942",
      borderColor: "#bfdacb",
    },
    dot: true,
  },
  [BiddingStatus.CLOSED]: {
    label: "Abgelaufen",
    cls: "border",
    style: {
      backgroundColor: "#fbf2ea",
      color: "#a45f1d",
      borderColor: "#f2d8c0",
    },
  },
};

// ─── Unique bidder count ──────────────────────────────────────────────────────

function getUniqueBidderCount(offers: GridbidBidding["offers"]): number {
  return new Set(offers.map((o) => o.participantId)).size;
}

// ─── Row ─────────────────────────────────────────────────────────────────────

interface BiddingRowProps {
  bidding: GridbidBidding;
}

const BiddingRow: React.FC<BiddingRowProps> = ({ bidding }) => {
  const navigate = useGridbidUiStore((s) => s.navigate);

  const uniqueBidders = getUniqueBidderCount(bidding.offers);
  const badge = STATUS_STYLE[bidding.status];

  return (
    <div
      onClick={() => navigate("detail", bidding.id)}
      className={[
        `grid ${ROW_GRID}`,
        "cursor-pointer items-stretch",
        "border-b border-gray-100 last:border-b-0",
        "transition-colors hover:bg-violet-50",
      ].join(" ")}
    >
      {/* Photo — inset with rounded corners */}
      <div className="self-stretch p-2">
        <div className="h-full overflow-hidden rounded-lg">
          {bidding.imageUrl ? (
            <img
              src={bidding.imageUrl}
              alt={bidding.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[64px] w-full items-center justify-center bg-gray-100 text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M3 9.5L12 3l9 6.5V21H15v-5h-6v5H3V9.5z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Object title + address */}
      <div className="flex flex-col justify-center py-4 pr-5">
        <p className="text-sm font-medium leading-snug text-gray-900">
          {bidding.title || "Unbenannt"}
        </p>
        <p className="mt-0.5 text-xs text-gray-400">{bidding.address || "—"}</p>
      </div>

      {/* Highest bid — spread indicator + bidder name */}
      <HighestBidCell bidding={bidding} />

      {/* Unique bidder count */}
      <div className="flex items-center justify-end py-4 pr-5">
        <span
          className={`text-sm tabular-nums ${
            uniqueBidders > 0 ? "font-medium text-gray-900" : "text-gray-300"
          }`}
        >
          {uniqueBidders}
        </span>
      </div>

      {/* Participant (registered buyer) count */}
      <div className="flex items-center justify-end py-4 pr-5">
        <span
          className={`text-sm tabular-nums ${
            bidding.participants.length > 0 ? "font-medium text-gray-900" : "text-gray-300"
          }`}
        >
          {bidding.participants.length}
        </span>
      </div>

      {/* Deadline — date + live countdown */}
      <DeadlineCell status={bidding.status} deadline={bidding.deadline} />

      {/* Status badge */}
      <div className="flex items-center py-4 pr-5">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.cls}`}
          style={badge.style}
        >
          {badge.dot && (
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: "#288352" }}
            />
          )}
          {badge.label}
        </span>
      </div>

      {/* Action */}
      <div className="flex items-center justify-end py-4 pr-5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate("detail", bidding.id);
          }}
          className="whitespace-nowrap rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-white hover:text-gray-900"
        >
          Deal Room →
        </button>
      </div>
    </div>
  );
};

export default BiddingRow;
