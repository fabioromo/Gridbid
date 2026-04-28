import type { GridbidBidding, CreateDraftInput, BiddingPatch } from "../types/domain";
export interface GridbidService {
    listBiddings(): Promise<GridbidBidding[]>;
    getBiddingById(id: string): Promise<GridbidBidding | null>;
    createDraft(input?: CreateDraftInput): Promise<GridbidBidding>;
    updateBidding(id: string, patch: BiddingPatch): Promise<GridbidBidding>;
    activateBidding(id: string): Promise<GridbidBidding>;
}
