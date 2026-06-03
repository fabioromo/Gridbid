export type GridbidView = "overview" | "create" | "edit" | "detail";

export type AppMode = "agency" | "buyer";

import type { GridbidBidding } from "./domain";

export interface GridbidUiState {
  view: GridbidView;
  selectedBiddingId: string | null;
  selectedBidding: GridbidBidding | null;
  navigate: (view: GridbidView, id?: string, bidding?: GridbidBidding) => void;
}
