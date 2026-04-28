import { type BiddingPatch, type CreateDraftInput, type GridbidBidding } from "../types/domain";
import type { GridbidService } from "./gridbidService";
export declare class MockGridbidService implements GridbidService {
    private biddings;
    listBiddings(): Promise<GridbidBidding[]>;
    getBiddingById(id: string): Promise<GridbidBidding | null>;
    createDraft(input?: CreateDraftInput): Promise<GridbidBidding>;
    updateBidding(id: string, patch: BiddingPatch): Promise<GridbidBidding>;
    activateBidding(id: string): Promise<GridbidBidding>;
}
export declare const mockGridbidService: GridbidService;
