import React from "react";
import { type GridbidBidding } from "../types/domain";
export declare const ROW_GRID = "grid-cols-[88px_1fr_180px_84px_112px_164px_116px_116px]";
interface BiddingRowProps {
    bidding: GridbidBidding;
}
declare const BiddingRow: React.FC<BiddingRowProps>;
export default BiddingRow;
