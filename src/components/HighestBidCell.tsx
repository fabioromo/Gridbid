import React from "react";
import { BiddingStatus, type GridbidBidding } from "../types/domain";
import { formatCHF } from "../utils/labels";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns the highest offer and the bidder name.
 * Each participant can revise; we take the highest amount across all offers,
 * regardless of version, which correctly reflects the current top bid.
 */
function getTopBid(
  offers: GridbidBidding["offers"],
  participants: GridbidBidding["participants"],
): { amount: number; name: string } | null {
  if (offers.length === 0) return null;
  const top = offers.reduce((max, o) => (o.amount > max.amount ? o : max), offers[0]!);
  const participant = participants.find((p) => p.id === top.participantId);
  return { amount: top.amount, name: participant?.name ?? "—" };
}

/**
 * Resolves the reference price for spread calculation:
 * 1. Richtpreis (preferred)
 * 2. listingPrice (fallback)
 * Returns null if neither is defined.
 */
function getReferencePrice(bidding: GridbidBidding): number | null {
  return bidding.richtpreis ?? bidding.listingPrice;
}

// ─── Component ───────────────────────────────────────────────────────────────

interface HighestBidCellProps {
  bidding: GridbidBidding;
}

const HighestBidCell: React.FC<HighestBidCellProps> = ({ bidding }) => {
  const { status, offers, participants } = bidding;

  // DRAFT → bidding not started, show nothing meaningful
  if (status === BiddingStatus.DRAFT) {
    return (
      <div className="flex items-center relative px-6 py-3 before:absolute before:left-0 before:top-1/2 before:h-8 before:w-px before:-translate-y-1/2 before:bg-gray-200 before:content-['']">
        <span className="text-sm text-[#73787a]">—</span>
      </div>
    );
  }

  const topBid = getTopBid(offers, participants);

  // ACTIVE / no bids yet → show hint instead of bare dash
  if (!topBid) {
    const isActiveLike =
      status === BiddingStatus.ACTIVE;
    return (
      <div className="flex items-center relative px-6 py-3 before:absolute before:left-0 before:top-1/2 before:h-8 before:w-px before:-translate-y-1/2 before:bg-gray-200 before:content-['']">
        {isActiveLike ? (
          <span className="text-[12px] text-[#73787a]">Noch keine Gebote</span>
        ) : (
          <span className="text-sm text-[#73787a]">—</span>
        )}
      </div>
    );
  }

  // Has bids → show amount + bidder name on line 1, delta on line 2
  const refPrice = getReferencePrice(bidding);
  const spread = refPrice !== null ? topBid.amount - refPrice : null;
  const isAbove = spread !== null && spread >= 0;

  return (
    <div className="flex flex-col justify-center relative px-6 py-3 before:absolute before:left-0 before:top-1/2 before:h-8 before:w-px before:-translate-y-1/2 before:bg-gray-200 before:content-['']">
      {/* Line 1: amount — bidder name */}
      <div className="flex items-center gap-1.5 text-sm">
        <span className="shrink-0 whitespace-nowrap font-medium tabular-nums text-[#2f363a]">
          {formatCHF(topBid.amount)}
        </span>
        <span className="shrink-0 text-[#73787a]">–</span>
        <span className="min-w-0 truncate text-[#73787a]">{topBid.name}</span>
      </div>

      {/* Line 2: delta vs. reference price */}
      {spread !== null && (
        <div
          className={`mt-0.5 flex items-center gap-1 text-sm ${
            isAbove ? "text-[#288352]" : "text-[#ce4742]"
          }`}
          title={`Referenzpreis: ${formatCHF(refPrice!)}`}
        >
          <span className="tabular-nums">
            {isAbove ? "+ " : "− "}
            {formatCHF(Math.abs(spread))}
          </span>
          <span className="text-xs">{isAbove ? "↑" : "↓"}</span>
        </div>
      )}
    </div>
  );
};

export default HighestBidCell;
