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
      <div className="flex items-center justify-end py-4 pr-5">
        <span className="text-sm text-gray-300">—</span>
      </div>
    );
  }

  const topBid = getTopBid(offers, participants);

  // ACTIVE with no bids yet
  if (!topBid) {
    return (
      <div className="flex items-center justify-end py-4 pr-5">
        {status === BiddingStatus.ACTIVE ? (
          <span className="text-xs italic text-gray-400">Noch keine Gebote</span>
        ) : (
          <span className="text-sm text-gray-300">—</span>
        )}
      </div>
    );
  }

  // Has bids → show amount, spread, and bidder name
  const refPrice = getReferencePrice(bidding);
  const spread = refPrice !== null ? topBid.amount - refPrice : null;
  const isAbove = spread !== null && spread >= 0;

  return (
    <div className="flex flex-col items-end justify-center py-4 pr-5">
      {/* Top bid amount */}
      <span className="text-sm font-semibold tabular-nums text-gray-900">
        {formatCHF(topBid.amount)}
      </span>

      {/* Spread vs. reference price */}
      {spread !== null && (
        <span
          className={`mt-0.5 flex items-center gap-0.5 text-xs font-medium ${
            isAbove ? "text-green-600" : "text-red-500"
          }`}
          title={`Referenzpreis: ${formatCHF(refPrice!)}`}
        >
          {isAbove ? "▲" : "▼"}
          <span>
            {isAbove ? "+" : "−"}
            {formatCHF(Math.abs(spread))}
          </span>
        </span>
      )}

      {/* Bidder name */}
      <span className="mt-0.5 max-w-[160px] truncate text-xs text-gray-400">
        {topBid.name}
      </span>
    </div>
  );
};

export default HighestBidCell;
