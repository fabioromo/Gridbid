export declare enum ProcessType {
    SEALED_BID = "SEALED_BID",
    OPEN_BID = "OPEN_BID"
}
export declare enum BiddingStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    CLOSED = "CLOSED"
}
export declare enum PriceDisplay {
    HIDDEN = "HIDDEN",
    PRICE = "PRICE",
    RANGE = "RANGE"
}
export interface GridbidParticipant {
    id: string;
    name: string;
    email: string;
    registeredAt: string;
}
export interface GridbidOffer {
    id: string;
    biddingId: string;
    participantId: string;
    amount: number;
    version: number;
    submittedAt: string;
}
export interface BiddingDocuments {
    level1: string[];
    level2: string[];
    level3: string[];
}
export interface GridbidBidding {
    id: string;
    title: string;
    address: string;
    websiteUrl: string | undefined;
    imageUrl?: string;
    processType: ProcessType;
    status: BiddingStatus;
    priceDisplay: PriceDisplay;
    deadline: string | null;
    publicUrl: string | undefined;
    roundsPlanned: number;
    biddingRules: string;
    documents: BiddingDocuments;
    participants: GridbidParticipant[];
    offers: GridbidOffer[];
    createdAt: string;
}
export type CreateDraftInput = Partial<Pick<GridbidBidding, "title" | "address" | "websiteUrl" | "processType" | "priceDisplay" | "deadline" | "roundsPlanned" | "biddingRules" | "documents">>;
export type BiddingPatch = Partial<Pick<GridbidBidding, "title" | "address" | "websiteUrl" | "processType" | "priceDisplay" | "deadline" | "roundsPlanned" | "biddingRules" | "documents">>;
