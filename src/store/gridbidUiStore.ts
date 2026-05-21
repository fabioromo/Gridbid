import { create } from "zustand";
import type { GridbidUiState, GridbidView, AppMode } from "../types/ui";
import type { BuyerView, BuyerDealRoomTab, BuyerRegistration, BuyerAccessTier, BidData } from "../types/buyer";
import type { GridbidBidding } from "../types/domain";

interface BuyerState {
  mode: AppMode;
  buyerView: BuyerView;
  buyerBiddingId: string | null;
  buyerBidding: GridbidBidding | null;   // cached after entry page fetch — avoids re-fetch in registration
  buyerRegistration: BuyerRegistration | null;
  buyerAccessTier: BuyerAccessTier | null;
  buyerDealRoomTab: BuyerDealRoomTab;
  activeBid: BidData | null;
  switchToAgency: () => void;
  switchToBuyer: (biddingId: string) => void;
  navigateBuyer: (view: BuyerView) => void;
  setBuyerBidding: (bidding: GridbidBidding) => void;
  setBuyerRegistration: (reg: BuyerRegistration) => void;
  setBuyerAccessTier: (tier: BuyerAccessTier) => void;
  setBuyerDealRoomTab: (tab: BuyerDealRoomTab) => void;
  setActiveBid: (bid: BidData | null) => void;
}

type FullState = GridbidUiState & BuyerState;

export const useGridbidUiStore = create<FullState>((set) => ({
  // Agency state
  view: "overview",
  selectedBiddingId: null,

  navigate(view: GridbidView, id?: string) {
    set({ view, selectedBiddingId: id ?? null });
  },

  // Buyer state
  mode: "agency",
  buyerView: "public",
  buyerBiddingId: null,
  buyerBidding: null,
  buyerRegistration: null,
  buyerAccessTier: null,
  buyerDealRoomTab: "overview",
  activeBid: null,

  switchToAgency() {
    set({ mode: "agency", buyerView: "public", buyerBidding: null, buyerRegistration: null, buyerAccessTier: null, activeBid: null });
  },

  switchToBuyer(biddingId: string) {
    set({
      mode: "buyer",
      buyerBiddingId: biddingId,
      buyerView: "public",
      buyerBidding: null,
      buyerRegistration: null,
      buyerAccessTier: null,
      buyerDealRoomTab: "overview",
      activeBid: null,
    });
  },

  navigateBuyer(view: BuyerView) {
    set({ buyerView: view });
  },

  setBuyerBidding(bidding: GridbidBidding) {
    set({ buyerBidding: bidding });
  },

  // Saves buyer-supplied data and sets access tier as platform logic (separate concerns)
  setBuyerRegistration(reg: BuyerRegistration) {
    set({ buyerRegistration: reg, buyerAccessTier: "basic" });
  },

  setBuyerAccessTier(tier: BuyerAccessTier) {
    set({ buyerAccessTier: tier });
  },

  setBuyerDealRoomTab(tab: BuyerDealRoomTab) {
    set({ buyerDealRoomTab: tab });
  },

  setActiveBid(bid) {
    set({ activeBid: bid });
  },
}));
