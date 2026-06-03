import React from "react";
import { BiddingStatus, type GridbidBidding } from "../types/domain";
import { useGridbidUiStore } from "../store/gridbidUiStore";
import HighestBidCell from "./HighestBidCell";
import DeadlineCell from "./DeadlineCell";

// Shared grid column template — must match the header row in BiddingsOverview
// Columns: photo+name | status | highest-bid | bids | participants | deadline | actions
export const ROW_GRID = "grid-cols-[380px_140px_260px_96px_136px_1fr_auto]";

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<BiddingStatus, { label: string; badgeCls: string }> = {
  [BiddingStatus.DRAFT]: {
    label: "Entwurf",
    badgeCls: "bg-[#fbf2ea] text-[#b56100]",
  },
  [BiddingStatus.ACTIVE]: {
    label: "Aktiv",
    badgeCls: "bg-[#dcf5ea] text-[#009877]",
  },
  [BiddingStatus.CLOSED]: {
    label: "Abgelaufen",
    badgeCls: "bg-[#faedec] text-[#ce4742]",
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
      onClick={() => navigate(bidding.status === BiddingStatus.DRAFT ? "edit" : "detail", bidding.id, bidding)}
      className={[
        `grid ${ROW_GRID}`,
        "min-h-[60px] cursor-pointer items-center",
        "transition-colors hover:bg-gray-50",
      ].join(" ")}
    >
      {/* Col 1: Photo (60×40px) + title + address */}
      <div className="flex items-center gap-4 pl-2 pr-6">
        <div className="h-10 w-[60px] shrink-0 overflow-hidden rounded-[4px]">
          {bidding.imageUrl ? (
            <img
              src={bidding.imageUrl}
              alt={bidding.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M3 9.5L12 3l9 6.5V21H15v-5h-6v5H3V9.5z" />
              </svg>
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className={`truncate text-base font-medium leading-6 ${bidding.status === BiddingStatus.ACTIVE ? "text-[#182024]" : "text-[#73787a]"}`}>
            {bidding.title || "Unbenannt"}
          </p>
          <p className="truncate text-sm text-[#73787a]">{bidding.address || "—"}</p>
        </div>
      </div>

      {/* Col 2: Status badge */}
      <div className="relative flex items-center px-6 before:absolute before:left-0 before:top-1/2 before:h-8 before:w-px before:-translate-y-1/2 before:bg-gray-200 before:content-['']">
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badge.badgeCls}`}>
          {badge.label}
        </span>
      </div>

      {/* Col 3: Highest bid — amount — name / delta */}
      <HighestBidCell bidding={bidding} />

      {/* Col 4: Unique bidder count (centered) */}
      <div className="relative flex items-center justify-center text-sm tabular-nums text-[#182024] before:absolute before:left-0 before:top-1/2 before:h-8 before:w-px before:-translate-y-1/2 before:bg-gray-200 before:content-['']">
        {uniqueBidders > 0 ? uniqueBidders : <span className="text-[#73787a]">—</span>}
      </div>

      {/* Col 5: Participant count (centered) */}
      <div className="relative flex items-center justify-center text-sm tabular-nums text-[#182024] before:absolute before:left-0 before:top-1/2 before:h-8 before:w-px before:-translate-y-1/2 before:bg-gray-200 before:content-['']">
        {bidding.participants.length > 0
          ? bidding.participants.length
          : <span className="text-[#73787a]">—</span>}
      </div>

      {/* Col 6: Deadline — date + live countdown */}
      <DeadlineCell status={bidding.status} deadline={bidding.deadline} />

      {/* Col 7: Actions */}
      <div className="flex items-center pr-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(bidding.status === BiddingStatus.DRAFT ? "edit" : "detail", bidding.id, bidding);
          }}
          className="flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#f6f6f6] px-3 text-sm font-medium text-[#182024] transition-colors hover:bg-gray-200"
        >
          {bidding.status === BiddingStatus.DRAFT
            ? "Fortsetzen"
            : bidding.status === BiddingStatus.CLOSED
            ? "Auswertung"
            : "Deal Room"}
          <span className="text-xs">→</span>
        </button>
      </div>
    </div>
  );
};

export default BiddingRow;
