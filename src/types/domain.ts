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
  phone?: string;
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
  /** Which bidding round this offer belongs to (1 = Runde 1, 2 = Runde 2) */
  round?: number;
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
  /** Last wizard step reached (0–3) — only set on DRAFT biddings */
  wizardStep?: number;
  /** ISO timestamp when the bidding was closed — only set on CLOSED biddings */
  closedAt?: string;
  /** ISO deadline for Runde 2 — presence signals that Runde 2 has been started */
  round2Deadline: string | null;
  /** Buyer IDs invited to participate in Runde 2 */
  round2InvitedBuyerIds: string[];
  /** Transparency setting for Runde 2 */
  round2Transparency: "rank" | "blind";
  /** Buyer ID who received the Zuschlag — only set on CLOSED biddings; null if external buyer */
  winnerId: string | null;
  /** Free-text name when winner is not in the system (winnerId is null) */
  winnerName: string | null;
  /** Agreed final price — only set on CLOSED biddings */
  finalPrice: number | null;
}

export type CreateDraftInput = Partial<
  Pick<
    GridbidBidding,
    | "title"
    | "address"
    | "websiteUrl"
    | "imageUrl"
    | "processType"
    | "priceDisplay"
    | "richtpreis"
    | "listingPrice"
    | "deadline"
    | "roundsPlanned"
    | "biddingRules"
    | "documents"
    | "wizardStep"
  >
>;

export type BiddingPatch = Partial<
  Pick<
    GridbidBidding,
    | "title"
    | "address"
    | "websiteUrl"
    | "imageUrl"
    | "processType"
    | "priceDisplay"
    | "richtpreis"
    | "listingPrice"
    | "deadline"
    | "roundsPlanned"
    | "biddingRules"
    | "documents"
    | "wizardStep"
  >
>;
