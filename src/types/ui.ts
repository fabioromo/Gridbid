export type GridbidView = "overview" | "create" | "detail";

export type AppMode = "agency" | "buyer";

export interface GridbidUiState {
  view: GridbidView;
  selectedBiddingId: string | null;
  navigate: (view: GridbidView, id?: string) => void;
}
