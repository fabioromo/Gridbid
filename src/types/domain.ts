import type { BuyerLevel, BuyerVerificationSignals } from "./buyer";

export enum ProcessType {
  SEALED_BID = "SEALED_BID",
  OPEN_BID = "OPEN_BID",
}

export enum BiddingStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
}

export enum PriceDisplay {
  HIDDEN = "HIDDEN",
  PRICE = "PRICE",
  RANGE = "RANGE",
}

export interface GridbidParticipant {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
}

export type OfferFinancingStatus = "open" | "in_preparation" | "confirmed";

export interface GridbidOffer {
  id: string;
  biddingId: string;
  participantId: string;
  amount: number;
  validityDays: number;
  preferredClosingDate: string | null;
  /** Snapshot of financing status at submission time — not live-linked to buyer profile */
  financingStatus: OfferFinancingStatus;
  conditions: string;
  /** Snapshot of verification signals at submission time */
  verificationSignals: BuyerVerificationSignals;
  /** Snapshot of buyer level at submission time — for sorting/filtering */
  verificationLevelAtSubmission: BuyerLevel;
  version: number;
  submittedAt: string;
}

export interface Phase3Grant {
  participantId: string;
  grantedAt: string;
  grantedBy: string;
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
  /** Richtpreis (guide price) — used as primary reference for spread calculation */
  richtpreis: number | null;
  /** Internal listing price — fallback reference when richtpreis is absent */
  listingPrice: number | null;
  deadline: string | null;
  publicUrl: string | undefined;
  roundsPlanned: number;
  biddingRules: string;
  documents: BiddingDocuments;
  /** Participants with agent-granted access to Phase 3 documents */
  phase3Grants: Phase3Grant[];
  participants: GridbidParticipant[];
  offers: GridbidOffer[];
  createdAt: string;
}

export type CreateDraftInput = Partial<
  Pick<
    GridbidBidding,
    | "title"
    | "address"
    | "websiteUrl"
    | "processType"
    | "priceDisplay"
    | "richtpreis"
    | "listingPrice"
    | "deadline"
    | "roundsPlanned"
    | "biddingRules"
    | "documents"
  >
>;

export type BiddingPatch = Partial<
  Pick<
    GridbidBidding,
    | "title"
    | "address"
    | "websiteUrl"
    | "processType"
    | "priceDisplay"
    | "richtpreis"
    | "listingPrice"
    | "deadline"
    | "roundsPlanned"
    | "biddingRules"
    | "documents"
  >
>;
