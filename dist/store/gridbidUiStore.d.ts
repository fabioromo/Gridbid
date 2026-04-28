import type { GridbidUiState, AppMode } from "../types/ui";
import type { BuyerView, BuyerDealRoomTab, BuyerRegistration, BuyerAccessTier } from "../types/buyer";
import type { GridbidBidding } from "../types/domain";
interface BuyerState {
    mode: AppMode;
    buyerView: BuyerView;
    buyerBiddingId: string | null;
    buyerBidding: GridbidBidding | null;
    buyerRegistration: BuyerRegistration | null;
    buyerAccessTier: BuyerAccessTier | null;
    buyerDealRoomTab: BuyerDealRoomTab;
    switchToAgency: () => void;
    switchToBuyer: (biddingId: string) => void;
    navigateBuyer: (view: BuyerView) => void;
    setBuyerBidding: (bidding: GridbidBidding) => void;
    setBuyerRegistration: (reg: BuyerRegistration) => void;
    setBuyerDealRoomTab: (tab: BuyerDealRoomTab) => void;
}
type FullState = GridbidUiState & BuyerState;
export declare const useGridbidUiStore: import("zustand").UseBoundStore<import("zustand").StoreApi<FullState>>;
export {};
