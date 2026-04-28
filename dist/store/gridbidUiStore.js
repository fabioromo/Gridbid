import { create } from "zustand";
export const useGridbidUiStore = create((set) => ({
    // Agency state
    view: "overview",
    selectedBiddingId: null,
    navigate(view, id) {
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
    switchToAgency() {
        set({ mode: "agency", buyerView: "public", buyerBidding: null, buyerRegistration: null, buyerAccessTier: null });
    },
    switchToBuyer(biddingId) {
        set({
            mode: "buyer",
            buyerBiddingId: biddingId,
            buyerView: "public",
            buyerBidding: null,
            buyerRegistration: null,
            buyerAccessTier: null,
            buyerDealRoomTab: "overview",
        });
    },
    navigateBuyer(view) {
        set({ buyerView: view });
    },
    setBuyerBidding(bidding) {
        set({ buyerBidding: bidding });
    },
    // Saves buyer-supplied data and sets access tier as platform logic (separate concerns)
    setBuyerRegistration(reg) {
        set({ buyerRegistration: reg, buyerAccessTier: "basic" });
    },
    setBuyerDealRoomTab(tab) {
        set({ buyerDealRoomTab: tab });
    },
}));
